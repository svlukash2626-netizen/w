import { useState } from 'react';
import { ActivityItem } from '../types';
import { Briefcase, CheckSquare, Phone, MessageSquare, Users, FileText, Filter } from 'lucide-react';

interface ActivityProps {
  activity: ActivityItem[];
}

export default function ActivityPage({ activity }: ActivityProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = activity.filter(a => filter === 'all' || a.type === filter);

  const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    deal: { icon: <Briefcase size={14} />, label: 'Сделки', color: 'bg-indigo-100 text-indigo-600' },
    task: { icon: <CheckSquare size={14} />, label: 'Задачи', color: 'bg-green-100 text-green-600' },
    call: { icon: <Phone size={14} />, label: 'Звонки', color: 'bg-blue-100 text-blue-600' },
    email: { icon: <MessageSquare size={14} />, label: 'Почта', color: 'bg-purple-100 text-purple-600' },
    comment: { icon: <MessageSquare size={14} />, label: 'Комментарии', color: 'bg-gray-100 text-gray-600' },
    login: { icon: <Users size={14} />, label: 'Входы', color: 'bg-slate-100 text-slate-600' },
    document: { icon: <FileText size={14} />, label: 'Документы', color: 'bg-orange-100 text-orange-600' },
  };

  const groupedByDate: Record<string, ActivityItem[]> = {};
  filtered.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(item);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Лента активности</h2>
        <p className="text-gray-500 mt-1">Все действия в системе</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <Filter size={12} />Все
        </button>
        {Object.entries(typeConfig).map(([key, config]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${filter === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {config.icon}{config.label}
          </button>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 sticky top-0 bg-gray-50 py-2">{date}</h3>
            <div className="space-y-2">
              {items.map(item => {
                const config = typeConfig[item.type];
                return (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-gray-800">{item.userName}</span>
                          {' '}
                          <span>{item.description}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">
                            {new Date(item.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
          <p>Нет действий</p>
        </div>
      )}
    </div>
  );
}
