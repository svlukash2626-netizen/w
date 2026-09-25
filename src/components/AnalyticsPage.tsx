import { Deal, Task, Client } from '../types';
import { TrendingUp, DollarSign, Users, Target, Award, Clock } from 'lucide-react';

interface AnalyticsProps {
  deals: Deal[];
  tasks: Task[];
  clients: Client[];
}

export default function AnalyticsPage({ deals, tasks, clients }: AnalyticsProps) {
  const totalRevenue = deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + d.amount, 0);
  const pipelineValue = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((s, d) => s + d.amount, 0);
  const avgDealSize = deals.length > 0 ? deals.reduce((s, d) => s + d.amount, 0) / deals.length : 0;
  const winRate = deals.filter(d => ['closed_won', 'closed_lost'].includes(d.stage)).length > 0
    ? (deals.filter(d => d.stage === 'closed_won').length / deals.filter(d => ['closed_won', 'closed_lost'].includes(d.stage)).length * 100)
    : 0;
  const tasksCompleted = tasks.filter(t => t.status === 'done').length;
  const tasksTotal = tasks.length;
  const tasksCompletionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal * 100) : 0;

  const stageData = [
    { stage: 'Новые', count: deals.filter(d => d.stage === 'new').length, amount: deals.filter(d => d.stage === 'new').reduce((s, d) => s + d.amount, 0), color: 'bg-blue-500' },
    { stage: 'В работе', count: deals.filter(d => d.stage === 'in_progress').length, amount: deals.filter(d => d.stage === 'in_progress').reduce((s, d) => s + d.amount, 0), color: 'bg-yellow-500' },
    { stage: 'Переговоры', count: deals.filter(d => d.stage === 'negotiation').length, amount: deals.filter(d => d.stage === 'negotiation').reduce((s, d) => s + d.amount, 0), color: 'bg-purple-500' },
    { stage: 'Предложение', count: deals.filter(d => d.stage === 'proposal').length, amount: deals.filter(d => d.stage === 'proposal').reduce((s, d) => s + d.amount, 0), color: 'bg-indigo-500' },
    { stage: 'Успех', count: deals.filter(d => d.stage === 'closed_won').length, amount: deals.filter(d => d.stage === 'closed_won').reduce((s, d) => s + d.amount, 0), color: 'bg-green-500' },
    { stage: 'Отказ', count: deals.filter(d => d.stage === 'closed_lost').length, amount: deals.filter(d => d.stage === 'closed_lost').reduce((s, d) => s + d.amount, 0), color: 'bg-red-500' },
  ];

  const maxCount = Math.max(...stageData.map(s => s.count), 1);

  // Tasks by priority
  const priorityData = [
    { label: 'Срочно', count: tasks.filter(t => t.priority === 'urgent').length, color: 'bg-red-500' },
    { label: 'Высокий', count: tasks.filter(t => t.priority === 'high').length, color: 'bg-orange-500' },
    { label: 'Средний', count: tasks.filter(t => t.priority === 'medium').length, color: 'bg-yellow-500' },
    { label: 'Низкий', count: tasks.filter(t => t.priority === 'low').length, color: 'bg-green-500' },
  ];

  const maxPriority = Math.max(...priorityData.map(p => p.count), 1);

  // Client status
  const clientData = [
    { label: 'Активные', count: clients.filter(c => c.status === 'active').length, color: 'bg-green-500', percent: clients.length > 0 ? (clients.filter(c => c.status === 'active').length / clients.length * 100) : 0 },
    { label: 'Лиды', count: clients.filter(c => c.status === 'lead').length, color: 'bg-blue-500', percent: clients.length > 0 ? (clients.filter(c => c.status === 'lead').length / clients.length * 100) : 0 },
    { label: 'Неактивные', count: clients.filter(c => c.status === 'inactive').length, color: 'bg-gray-400', percent: clients.length > 0 ? (clients.filter(c => c.status === 'inactive').length / clients.length * 100) : 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Аналитика</h2>
        <p className="text-gray-500 mt-1">Статистика и отчёты</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <DollarSign size={24} className="opacity-80" />
          <p className="text-2xl font-bold mt-2">{(totalRevenue / 1000).toFixed(0)}K ₽</p>
          <p className="text-sm opacity-80 mt-1">Выручка</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <TrendingUp size={24} className="opacity-80" />
          <p className="text-2xl font-bold mt-2">{(pipelineValue / 1000).toFixed(0)}K ₽</p>
          <p className="text-sm opacity-80 mt-1">Воронка</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
          <Target size={24} className="opacity-80" />
          <p className="text-2xl font-bold mt-2">{winRate.toFixed(0)}%</p>
          <p className="text-sm opacity-80 mt-1">Конверсия</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <Award size={24} className="opacity-80" />
          <p className="text-2xl font-bold mt-2">{(avgDealSize / 1000).toFixed(0)}K ₽</p>
          <p className="text-sm opacity-80 mt-1">Средний чек</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Воронка продаж</h3>
          <div className="space-y-3">
            {stageData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 flex-shrink-0">{item.stage}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                    style={{ width: `${(item.count / maxCount) * 100}%`, minWidth: item.count > 0 ? '2rem' : '0' }}>
                    {item.count > 0 && <span className="text-xs text-white font-medium">{item.count}</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{(item.amount / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Задачи по приоритету</h3>
          <div className="space-y-4">
            {priorityData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.count}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / maxPriority) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Completion rate */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Clock size={14} />Выполнение задач</span>
              <span className="text-sm font-bold text-gray-800">{tasksCompletionRate.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${tasksCompletionRate}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{tasksCompleted} из {tasksTotal} задач выполнено</p>
          </div>
        </div>

        {/* Client Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Распределение клиентов</h3>
          <div className="flex items-center gap-6">
            {/* Donut chart simulation */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {clientData.reduce((acc: React.ReactNode[], item, idx) => {
                  const offset = clientData.slice(0, idx).reduce((s, i) => s + i.percent, 0);
                  acc.push(
                    <circle key={idx} cx="18" cy="18" r="15.915" fill="none"
                      stroke={item.color.replace('bg-', '').includes('green') ? '#22c55e' : item.color.replace('bg-', '').includes('blue') ? '#3b82f6' : '#9ca3af'}
                      strokeWidth="3" strokeDasharray={`${item.percent} ${100 - item.percent}`}
                      strokeDashoffset={`${-offset}`} />
                  );
                  return acc;
                }, [])}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{clients.length}</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {clientData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.count}</span>
                  <span className="text-xs text-gray-400">{item.percent.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Сводка</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Users size={14} />Всего клиентов</span>
              <span className="font-bold text-gray-800">{clients.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2"><TrendingUp size={14} />Активных сделок</span>
              <span className="font-bold text-gray-800">{deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Target size={14} />Успешных сделок</span>
              <span className="font-bold text-green-600">{deals.filter(d => d.stage === 'closed_won').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2"><DollarSign size={14} />Общая выручка</span>
              <span className="font-bold text-gray-800">{totalRevenue.toLocaleString()} ₽</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2"><Award size={14} />Задач выполнено</span>
              <span className="font-bold text-gray-800">{tasksCompleted}/{tasksTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
