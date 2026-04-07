import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Users } from 'lucide-react';
import { useConversations, useMessages, useSendMessage, useMarkMessageAsRead } from '../hooks/useDashboard';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';

export default function DashboardMessagesPage() {
  const { user } = useAuthStore();
  const { isConnected, lastMessage } = useWebSocket();
  const { data: conversations = [], isLoading: loadingConversations, refetch: refetchConversations } = useConversations();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessageAsRead();
  const toast = useToast();

  const { data: fetchedMessages = [], isLoading: loadingMessages } = useMessages(selectedUser?.id);

  useEffect(() => {
    if (fetchedMessages && fetchedMessages.length > 0) {
      setMessages(fetchedMessages);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 50);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (selectedUser) {
      markAsRead.mutate(selectedUser.id, {
        onSuccess: () => {
          refetchConversations();
        }
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (lastMessage?.type === 'new_message' && lastMessage?.message) {
      const msg = lastMessage.message;
      if (selectedUser?.id === msg.sender_id || selectedUser?.id === msg.receiver_id) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id);
          if (exists) return prev;
          return [...prev, msg];
        });
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
      refetchConversations();
    }
  }, [lastMessage, selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const tempMessage = {
        id: Date.now().toString(),
        sender_id: user?.id,
        receiver_id: selectedUser.id,
        content: newMessage,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempMessage]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      
      await sendMessage.mutateAsync({ 
        receiverId: selectedUser.id, 
        content: newMessage 
      });
      
      setNewMessage('');
      refetchConversations();
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Error al enviar mensaje');
      setMessages(prev => prev.filter(m => m.id !== Date.now().toString()));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Mensajes</h1>
          <p className="text-on-surface-variant mt-1">Tus conversaciones con otros usuarios</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-on-surface-variant">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_16px_rgba(25,28,30,0.04)] overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        <div className="flex h-full">
          <div className="w-80 border-r border-surface-container-low flex flex-col">
            <div className="p-4 border-b border-surface-container-low">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Users className="w-4 h-4" />
                <span>{conversations.length} conversaciones</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                      <div className="w-12 h-12 bg-surface-container-high rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-container-high rounded w-3/4" />
                        <div className="h-3 bg-surface-container-high rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay conversaciones</p>
                </div>
              ) : (
                conversations.map((conv: any) => (
                  <button
                    key={conv.user?.id}
                    onClick={() => setSelectedUser(conv.user)}
                    className={`w-full p-4 border-b border-surface-container-low text-left hover:bg-surface-container-low transition-colors ${
                      selectedUser?.id === conv.user?.id ? 'bg-surface-container-low' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0">
                        {conv.user?.avatar_url ? (
                          <img src={conv.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="font-bold text-on-surface-variant text-lg">
                            {conv.user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-on-surface truncate">{conv.user?.name}</p>
                          <span className="text-xs text-on-surface-variant shrink-0 ml-2 opacity-60">
                            {conv.last_message?.created_at ? new Date(conv.last_message.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant truncate">
                          {conv.last_message?.content || 'Sin mensajes'}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0" title={`${conv.unread_count} mensaje${conv.unread_count > 1 ? 's' : ''} sin leer`} />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-surface-container-low flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center shrink-0">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="font-bold text-on-surface-variant">
                        {selectedUser.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">{selectedUser.name}</p>
                    <p className="text-sm text-on-surface-variant">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-12">
                      <span className="text-on-surface-variant">Cargando mensajes...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-on-surface-variant">
                      <p>No hay mensajes aún. ¡Envía el primero!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isMe ? 'bg-primary text-white rounded-br-md' : 'bg-surface-container-low text-on-surface rounded-bl-md'
                          }`}>
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              isMe ? 'text-white/70' : 'text-on-surface-variant opacity-60'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-surface-container-low flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-3 border border-surface-container-high rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendMessage.isPending}
                    className="bg-primary text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Selecciona una conversación</p>
                  <p className="text-sm mt-1">Elige un contacto de la lista para comenzar a chatear</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}