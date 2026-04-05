import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';
import { messageService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function DashboardMessagesPage() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadMessages(userId);
    }
  }, [userId]);

  const loadConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data.data);
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const response = await messageService.getWithUser(otherUserId);
      setMessages(response.data.data);
      const conv = conversations.find(c => c.user?.id === otherUserId);
      if (conv) setSelectedUser(conv.user);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await messageService.send(selectedUser.id, newMessage);
      setNewMessage('');
      loadMessages(selectedUser.id);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mensajes</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-full">
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Conversaciones</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay conversaciones</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user?.id}
                  onClick={() => setSelectedUser(conv.user)}
                  className={`w-full p-4 border-b text-left hover:bg-gray-50 ${
                    selectedUser?.id === conv.user?.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {conv.user?.avatar_url ? (
                        <img src={conv.user.avatar_url} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        <span className="font-bold text-gray-500">
                          {conv.user?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-900 truncate">{conv.user?.name}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(conv.last_message?.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.last_message?.content}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
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
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt="" className="w-full h-full rounded-full" />
                  ) : (
                    <span className="font-bold text-gray-500">
                      {selectedUser.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isMe ? 'bg-primary text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isMe ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-primary/90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}