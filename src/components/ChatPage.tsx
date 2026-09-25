import { useState } from 'react';
import { ChatChannel, ChatMessage } from '../types';
import { generateId } from '../store';
import { Search, Send, Users, Hash, MessageSquare, Smile } from 'lucide-react';

interface ChatProps {
  channels: ChatChannel[];
  messages: ChatMessage[];
  onSaveChannels: (c: ChatChannel[]) => void;
  onSaveMessages: (m: ChatMessage[]) => void;
}

export default function ChatPage({ channels, messages, onSaveChannels, onSaveMessages }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<string>(channels[0]?.id || '');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const channelMessages = messages.filter(m => m.chatId === activeChannel);
  const activeChannelData = channels.find(c => c.id === activeChannel);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: generateId(), chatId: activeChannel, senderId: 'e1', senderName: 'Администратор',
      text: newMessage, timestamp: new Date().toISOString(), read: true
    };
    onSaveMessages([...messages, msg]);
    // Update channel last message
    const updatedChannels = channels.map(c =>
      c.id === activeChannel ? { ...c, lastMessage: `Вы: ${newMessage.slice(0, 30)}`, lastMessageTime: 'Сейчас', unreadCount: 0 } : c
    );
    onSaveChannels(updatedChannels);
    setNewMessage('');
  };

  const typeIcons: Record<string, React.ReactNode> = {
    group: <Users size={16} className="text-indigo-500" />,
    direct: <MessageSquare size={16} className="text-green-500" />,
    channel: <Hash size={16} className="text-purple-500" />,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Чат</h2>
        <p className="text-gray-500 mt-1">Корпоративный мессенджер</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex h-[calc(100vh-220px)]">
        {/* Channels list */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Поиск чатов..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChannels.map(channel => (
              <button key={channel.id} onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                  activeChannel === channel.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : 'hover:bg-gray-50'
                }`}>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {typeIcons[channel.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate">{channel.name}</p>
                    {channel.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{channel.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{activeChannelData?.name}</h3>
              <p className="text-xs text-gray-500">{activeChannelData?.participants.length || 0} участников</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.map(msg => {
              const isMe = msg.senderId === 'e1';
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isMe ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {msg.senderName.charAt(0)}
                  </div>
                  <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{msg.senderName}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`inline-block px-3 py-2 rounded-xl text-sm ${
                      isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Smile size={20} />
              </button>
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              <button onClick={sendMessage}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
