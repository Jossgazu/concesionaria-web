import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { messageService } from '../../services/api';
import type { Conversation, Message, User } from '../../types';

interface MessageThreadProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function MessageThread({ conversation, onBack }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const otherParticipant = conversation.participants?.find((p) => p.id !== user?.id);

  useEffect(() => {
    loadMessages();
  }, [conversation.id]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await messageService.getMessages(conversation.id);
      setMessages(response.data);
    } catch (err) {
      console.error('Error loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await messageService.send(otherParticipant?.id || '', newMessage, conversation.vehicle?.id);
      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error('Error sending message');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {otherParticipant?.name?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{otherParticipant?.name || 'Usuario'}</h3>
          {conversation.vehicle && (
            <p className="text-sm text-gray-500">
              Re: {conversation.vehicle.brand} {conversation.vehicle.model}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando mensajes...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No hay mensajes aún</p>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="btn-primary p-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
