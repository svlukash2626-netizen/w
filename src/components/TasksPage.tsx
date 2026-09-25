import { useState } from 'react';
import { Task, TaskStatus, Employee } from '../types';
import { generateId } from '../store';
import { Plus, Search, Edit2, Trash2, X, Calendar, Flag, User, List, Columns } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  employees: Employee[];
  onSave: (t: Task[]) => void;
}

export default function TasksPage({ tasks, employees, onSave }: TasksProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const filtered = tasks.filter(t => {
    const s = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const st = filterStatus === 'all' || t.status === filterStatus;
    const pr = filterPriority === 'all' || t.priority === filterPriority;
    return s && st && pr;
  });

  const statuses: TaskStatus[] = ['new', 'in_progress', 'review', 'done'];
  const statusLabels: Record<TaskStatus, string> = { new: 'Новые', in_progress: 'В работе', review: 'На проверке', done: 'Выполнено' };
  const statusColors: Record<TaskStatus, string> = { new: 'border-gray-400', in_progress: 'border-blue-400', review: 'border-yellow-400', done: 'border-green-400' };
  const priorityLabels: Record<string, string> = { urgent: 'Срочно', high: 'Высокий', medium: 'Средний', low: 'Низкий' };
  const priorityBg: Record<string, string> = { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };

  const moveTask = (id: string, status: TaskStatus) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : t.completedAt } : t);
    onSave(updated);
  };

  const handleSave = (form: any) => {
    const emp = employees.find(e => e.id === form.assigneeId);
    if (editing) {
      onSave(tasks.map(t => t.id === editing.id ? { ...t, ...form, assigneeName: emp?.name || t.assigneeName } : t));
    } else {
      onSave([...tasks, { id: generateId(), ...form, assigneeName: emp?.name || '', creatorId: 'e1', creatorName: 'Администратор', createdAt: new Date().toISOString().split('T')[0], tags: [] }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => { if (confirm('Удалить задачу?')) onSave(tasks.filter(t => t.id !== id)); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Задачи и проекты</h2>
          <p className="text-gray-500 mt-1">Управление задачами команды</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} />Новая задача
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск задач..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none">
          <option value="all">Все статусы</option>
          {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none">
          <option value="all">Все приоритеты</option>
          {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex gap-1">
          <button onClick={() => setView('kanban')} className={`p-2 rounded-lg ${view === 'kanban' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}><Columns size={18} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}><List size={18} /></button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {statuses.map(status => {
            const statusTasks = filtered.filter(t => t.status === status);
            return (
              <div key={status} className="min-w-[280px] flex-1">
                <div className={`bg-white rounded-xl border-t-4 ${statusColors[status]} shadow-sm`}>
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700 text-sm">{statusLabels[status]}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{statusTasks.length}</span>
                  </div>
                  <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                    {statusTasks.map(task => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-indigo-200"
                        onClick={() => { setEditing(task); setShowModal(true); }}>
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
                            <button onClick={e => { e.stopPropagation(); handleDelete(task.id); }} className="p-1 hover:bg-white rounded"><Trash2 size={12} className="text-red-400" /></button>
                          </div>
                        </div>
                        {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityBg[task.priority]}`}>{priorityLabels[task.priority]}</span>
                          {task.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{tag}</span>)}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><User size={10} />{task.assigneeName}</span>
                          <span className="flex items-center gap-1"><Calendar size={10} />{task.dueDate}</span>
                        </div>
                        {/* Quick status change */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {statuses.filter(s => s !== status).map(s => (
                            <button key={s} onClick={e => { e.stopPropagation(); moveTask(task.id, s); }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 rounded hover:border-indigo-300 hover:text-indigo-600">
                              {statusLabels[s].slice(0, 6)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Задача</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Исполнитель</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Приоритет</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Срок</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{task.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{task.assigneeName}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityBg[task.priority]}`}>{priorityLabels[task.priority]}</span></td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{statusLabels[task.status]}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(task); setShowModal(true); }} className="p-1.5 hover:bg-indigo-50 rounded text-gray-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <TaskModal task={editing} employees={employees} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function TaskModal({ task, employees, onSave, onClose }: { task: Task | null; employees: Employee[]; onSave: (f: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: task?.title || '', description: task?.description || '', priority: task?.priority || 'medium' as Task['priority'],
    status: task?.status || 'new' as TaskStatus, dueDate: task?.dueDate || '', assigneeId: task?.assigneeId || ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{task ? 'Редактировать задачу' : 'Новая задача'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="low">Низкий</option><option value="medium">Средний</option>
                <option value="high">Высокий</option><option value="urgent">Срочно</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="new">Новые</option><option value="in_progress">В работе</option>
                <option value="review">На проверке</option><option value="done">Выполнено</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель</label>
              <select value={form.assigneeId} onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="">Выберите</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
            {task ? 'Сохранить' : 'Создать'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}
