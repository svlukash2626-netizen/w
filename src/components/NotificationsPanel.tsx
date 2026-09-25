import { Notification } from '../types';
import { Bell, Check, X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function NotificationsPanel({ notifications, onMarkRead, onMarkAllRead, onDelete, onClose }: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    info: { icon: <Info size={16} />, color: 'text-blue-500 bg-blue-50' },
    success: { icon: <CheckCircle size={16} />, color: 'text-green-500 bg-green-50' },
    warning: { icon: <AlertTriangle size={16} />, color: 'text-yellow-500 bg-yellow-50' },
    error: { icon: <XCircle size={16} />, color: 'text-red-500 bg-red-50' },
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-800">Уведомления</h3>
            {unreadCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Прочитать все
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {notifications.map(notif => {
                const config = typeConfig[notif.type];
                return (
                  <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.timestamp).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notif.read && (
                          <button onClick={() => onMarkRead(notif.id)} className="p-1 hover:bg-indigo-100 rounded text-indigo-500" title="Отметить как прочитанное">
                            <Check size={14} />
                          </button>
                        )}
                        <button onClick={() => onDelete(notif.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Bell size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Нет уведомлений</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
