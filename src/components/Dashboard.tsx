import { Client, Deal, Task } from '../types';
import {
  Users,
  Briefcase,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  deals: Deal[];
  tasks: Task[];
}

export default function Dashboard({ clients, deals, tasks }: DashboardProps) {
  const totalRevenue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.amount, 0);

  const pipelineValue = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + d.amount, 0);

  const activeClients = clients.filter(c => c.status === 'active').length;
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

  const recentDeals = [...deals].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const upcomingTasks = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const stageLabels: Record<string, string> = {
    lead: 'Лид',
    negotiation: 'Переговоры',
    proposal: 'Предложение',
    closed_won: 'Закрыто (успех)',
    closed_lost: 'Закрыто (отказ)'
  };

  const stageColors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-700',
    negotiation: 'bg-yellow-100 text-yellow-700',
    proposal: 'bg-purple-100 text-purple-700',
    closed_won: 'bg-green-100 text-green-700',
    closed_lost: 'bg-red-100 text-red-700'
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };

  const priorityLabels: Record<string, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Дашборд</h2>
        <p className="text-gray-500 mt-1">Обзор ключевых показателей</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Выручка</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {(totalRevenue / 1000).toFixed(0)}K ₽
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm text-green-600">
            <ArrowUpRight size={16} />
            <span>+12% от прошлого месяца</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Воронка продаж</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {(pipelineValue / 1000).toFixed(0)}K ₽
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm text-indigo-600">
            <ArrowUpRight size={16} />
            <span>{deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length} активных сделок</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Клиенты</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{activeClients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm text-gray-500">
            <span>Всего: {clients.length} контактов</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Задачи</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{openTasks}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-3 text-sm text-red-500">
            <AlertCircle size={16} />
            <span>{highPriorityTasks} с высоким приоритетом</span>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Воронка продаж</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {(['lead', 'negotiation', 'proposal', 'closed_won', 'closed_lost'] as const).map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageAmount = stageDeals.reduce((sum, d) => sum + d.amount, 0);
            return (
              <div key={stage} className="text-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{stageLabels[stage]}</p>
                <p className="text-xl font-bold text-gray-800">{stageDeals.length}</p>
                <p className="text-xs text-gray-500 mt-1">{(stageAmount / 1000).toFixed(0)}K ₽</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase size={20} className="text-indigo-600" />
            Последние сделки
          </h3>
          <div className="space-y-3">
            {recentDeals.map(deal => (
              <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{deal.title}</p>
                  <p className="text-xs text-gray-500">{deal.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">
                    {deal.amount.toLocaleString()} ₽
                  </p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${stageColors[deal.stage]}`}>
                    {stageLabels[deal.stage]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-orange-600" />
            Ближайшие задачи
          </h3>
          <div className="space-y-3">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.assignedTo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{task.dueDate}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${priorityColors[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
