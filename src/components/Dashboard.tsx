import { Task, CalendarEvent, ActivityItem, WorkflowDocument } from '../types';
import {
  FileText, CheckSquare, Clock, AlertCircle,
  Calendar, TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  calendar: CalendarEvent[];
  activity: ActivityItem[];
  workflow: WorkflowDocument[];
  onNavigate: (page: 'workflow' | 'tasks' | 'calendar' | 'activity') => void;
}

export default function Dashboard({ tasks, calendar, activity, workflow, onNavigate }: DashboardProps) {
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done').length;
  const todayEvents = calendar.filter(e => e.date === '2024-05-17');
  const pendingApprovals = workflow.filter(w => w.status === 'pending_approval').length;
  const draftDocuments = workflow.filter(w => w.status === 'draft').length;
  const signedDocuments = workflow.filter(w => w.status === 'signed').length;

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700'
  };

  const activityIcons: Record<string, React.ReactNode> = {
    document: <FileText size={14} className="text-indigo-500" />,
    task: <CheckSquare size={14} className="text-green-500" />,
    call: <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    email: <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    comment: <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    login: <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    approval: <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    file: <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  };

  const workflowStatusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending_approval: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700',
    signed: 'bg-green-100 text-green-700',
    archived: 'bg-slate-100 text-slate-700'
  };

  const workflowStatusLabels: Record<string, string> = {
    draft: 'Черновик',
    pending_approval: 'На согласовании',
    approved: 'Согласован',
    rejected: 'Отклонён',
    signed: 'Подписан',
    archived: 'В архиве'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Добро пожаловать!</h2>
          <p className="text-gray-500 mt-1">Обзор документооборота и задач</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Документы на согласовании"
          value={`${pendingApprovals}`}
          icon={<FileText size={22} className="text-yellow-600" />}
          bgColor="bg-yellow-50"
          trend={`${draftDocuments} черновиков`}
          trendUp={true}
        />
        <StatCard
          title="Подписанные документы"
          value={`${signedDocuments}`}
          icon={<CheckSquare size={22} className="text-green-600" />}
          bgColor="bg-green-50"
          trend="В этом месяце"
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
        <StatCard
          title="События сегодня"
          value={`${todayEvents.length}`}
          icon={<Calendar size={22} className="text-indigo-600" />}
          bgColor="bg-indigo-50"
          trend="Запланировано"
          trendUp={true}
        />
      </div>

      {/* Workflow Status Overview */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Статусы документов</h3>
          <button onClick={() => onNavigate('workflow')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Все документы →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['draft', 'pending_approval', 'approved', 'rejected', 'signed', 'archived'] as const).map(status => {
            const count = workflow.filter(w => w.status === status).length;
            return (
              <div key={status} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${workflowStatusColors[status]}`}>
                  {workflowStatusLabels[status]}
                </span>
                <p className="text-xl font-bold text-gray-800">{count}</p>
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

          {/* Pending approvals */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-yellow-500" />
                Ожидают согласования
              </h3>
              <button onClick={() => onNavigate('workflow')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                →
              </button>
            </div>
            <div className="space-y-2">
              {workflow.filter(w => w.status === 'pending_approval').slice(0, 3).map(doc => (
                <div key={doc.id} className="p-2 rounded-lg hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 truncate">{doc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Создан: {doc.createdAt}</p>
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
