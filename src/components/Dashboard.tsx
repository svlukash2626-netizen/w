import { Client, Deal, Task, CalendarEvent, ActivityItem } from '../types';
import {
  Users, Briefcase, CheckSquare, TrendingUp, DollarSign,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  Calendar, MessageSquare, Phone, FileText
} from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
  calendar: CalendarEvent[];
  activity: ActivityItem[];
  onNavigate: (page: 'crm' | 'tasks' | 'calendar' | 'activity') => void;
}

export default function Dashboard({ clients, deals, tasks, calendar, activity, onNavigate }: DashboardProps) {
  const totalRevenue = deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + d.amount, 0);
  const pipelineValue = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((s, d) => s + d.amount, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done').length;
  const todayEvents = calendar.filter(e => e.date === new Date().toISOString().split('T')[0]);

  const stageLabels: Record<string, string> = {
    new: 'Новая', in_progress: 'В работе', negotiation: 'Переговоры',
    proposal: 'Предложение', closed_won: 'Закрыто ✓', closed_lost: 'Закрыто ✗'
  };

  const stageColors: Record<string, string> = {
    new: 'bg-blue-500', in_progress: 'bg-yellow-500', negotiation: 'bg-purple-500',
    proposal: 'bg-indigo-500', closed_won: 'bg-green-500', closed_lost: 'bg-red-500'
  };

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700'
  };

  const activityIcons: Record<string, React.ReactNode> = {
    deal: <Briefcase size={14} className="text-indigo-500" />,
    task: <CheckSquare size={14} className="text-green-500" />,
    call: <Phone size={14} className="text-blue-500" />,
    email: <MessageSquare size={14} className="text-purple-500" />,
    comment: <MessageSquare size={14} className="text-gray-500" />,
    login: <Users size={14} className="text-slate-500" />,
    document: <FileText size={14} className="text-orange-500" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Добро пожаловать!</h2>
          <p className="text-gray-500 mt-1">Обзор ключевых показателей</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Выручка"
          value={`${(totalRevenue / 1000).toFixed(0)}K ₽`}
          icon={<DollarSign size={22} className="text-green-600" />}
          bgColor="bg-green-50"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Воронка продаж"
          value={`${(pipelineValue / 1000).toFixed(0)}K ₽`}
          icon={<TrendingUp size={22} className="text-indigo-600" />}
          bgColor="bg-indigo-50"
          trend={`${deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length} сделок`}
          trendUp={true}
        />
        <StatCard
          title="Клиенты"
          value={`${activeClients}`}
          icon={<Users size={22} className="text-blue-600" />}
          bgColor="bg-blue-50"
          trend={`Всего: ${clients.length}`}
          trendUp={true}
        />
        <StatCard
          title="Задачи"
          value={`${openTasks}`}
          icon={<CheckSquare size={22} className="text-orange-600" />}
          bgColor="bg-orange-50"
          trend={`${urgentTasks} срочных`}
          trendUp={false}
        />
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Воронка продаж</h3>
          <button onClick={() => onNavigate('crm')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Подробнее →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['new', 'in_progress', 'negotiation', 'proposal', 'closed_won', 'closed_lost'] as const).map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageAmount = stageDeals.reduce((s, d) => s + d.amount, 0);
            return (
              <div key={stage} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className={`w-3 h-3 rounded-full ${stageColors[stage]} mx-auto mb-2`} />
                <p className="text-xs text-gray-500 mb-1">{stageLabels[stage]}</p>
                <p className="text-lg font-bold text-gray-800">{stageDeals.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">{(stageAmount / 1000).toFixed(0)}K ₽</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Последние действия</h3>
            <button onClick={() => onNavigate('activity')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Вся лента →
            </button>
          </div>
          <div className="space-y-3">
            {activity.slice(0, 6).map(item => (
              <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {activityIcons[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{item.userName}</span> {item.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.timestamp).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Today's events */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                Сегодня
              </h3>
              <button onClick={() => onNavigate('calendar')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                →
              </button>
            </div>
            {todayEvents.length > 0 ? (
              <div className="space-y-2">
                {todayEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ev.color }} />
                      <p className="text-sm font-medium text-gray-700 truncate">{ev.title}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-4">{ev.startTime} - {ev.endTime}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Нет событий на сегодня</p>
            )}
          </div>

          {/* Urgent tasks */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                Срочные задачи
              </h3>
              <button onClick={() => onNavigate('tasks')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                →
              </button>
            </div>
            <div className="space-y-2">
              {tasks.filter(t => t.status !== 'done' && (t.priority === 'urgent' || t.priority === 'high')).slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                    {task.priority === 'urgent' ? 'Срочно' : 'Высокий'}
                  </span>
                  <p className="text-sm text-gray-700 truncate flex-1">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, trend, trendUp }: {
  title: string; value: string; icon: React.ReactNode; bgColor: string;
  trend: string; trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className={`flex items-center mt-3 text-sm ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span className="ml-1">{trend}</span>
      </div>
    </div>
  );
}
