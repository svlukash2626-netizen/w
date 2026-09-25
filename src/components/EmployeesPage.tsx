import { useState } from 'react';
import { Employee } from '../types';
import { generateId } from '../store';
import { Search, Mail, Phone, Building, Calendar, Plus, Edit2, X, UserPlus } from 'lucide-react';

interface EmployeesProps {
  employees: Employee[];
  onSave: (e: Employee[]) => void;
}

export default function EmployeesPage({ employees, onSave }: EmployeesProps) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const departments = [...new Set(employees.map(e => e.department))];
  const filtered = employees.filter(e => {
    const s = e.name.toLowerCase().includes(search.toLowerCase()) || e.position.toLowerCase().includes(search.toLowerCase());
    return s && (filterDept === 'all' || e.department === filterDept);
  });

  const statusColors: Record<string, string> = {
    online: 'bg-green-500', offline: 'bg-gray-400', busy: 'bg-red-500', away: 'bg-yellow-500'
  };
  const statusLabels: Record<string, string> = { online: 'В сети', offline: 'Не в сети', busy: 'Занят', away: 'Отошёл' };

  const openAddModal = () => {
    setEditingEmployee(null);
    setShowFormModal(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowFormModal(true);
  };

  const handleSave = (form: any) => {
    if (!form.name.trim()) return;
    if (editingEmployee) {
      onSave(employees.map(e => e.id === editingEmployee.id ? { ...e, ...form } : e));
    } else {
      const newEmp: Employee = {
        id: generateId(),
        ...form,
        hireDate: form.hireDate || new Date().toISOString().split('T')[0]
      };
      onSave([...employees, newEmp]);
    }
    setShowFormModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить сотрудника?')) {
      onSave(employees.filter(e => e.id !== id));
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Сотрудники</h2>
          <p className="text-gray-500 mt-1">Управление персоналом компании</p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <UserPlus size={16} />Добавить сотрудника
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск сотрудников..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none">
          <option value="all">Все отделы</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
          <p className="text-xs text-gray-500 mt-1">Всего сотрудников</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'online').length}</p>
          <p className="text-xs text-gray-500 mt-1">В сети</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-800">{departments.length}</p>
          <p className="text-xs text-gray-500 mt-1">Отделов</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-500">{employees.filter(e => e.status === 'busy').length}</p>
          <p className="text-xs text-gray-500 mt-1">Заняты</p>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} onClick={() => setSelectedEmployee(emp)}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusColors[emp.status]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{emp.name}</h3>
                <p className="text-sm text-gray-500 truncate">{emp.position}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Building size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-400">{emp.department}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {emp.skills.slice(0, 3).map(skill => (
                <span key={skill} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{skill}</span>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className={`w-2 h-2 rounded-full ${statusColors[emp.status]}`} />
              <span className="text-xs text-gray-500">{statusLabels[emp.status]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-3">{selectedEmployee.name}</h3>
              <p className="text-gray-500">{selectedEmployee.position}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className={`w-2 h-2 rounded-full ${statusColors[selectedEmployee.status]}`} />
                <span className="text-sm text-gray-500">{statusLabels[selectedEmployee.status]}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Отдел</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEmployee.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Эл. почта</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEmployee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Телефон</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEmployee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Дата приёма на работу</p>
                  <p className="text-sm font-medium text-gray-800">{new Date(selectedEmployee.hireDate).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Навыки</p>
                <div className="flex flex-wrap gap-1">
                  {selectedEmployee.skills.map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setSelectedEmployee(null); openEditModal(selectedEmployee); }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2">
                <Edit2 size={16} />Редактировать
              </button>
              <button onClick={() => handleDelete(selectedEmployee.id)}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium">
                Удалить
              </button>
              <button onClick={() => setSelectedEmployee(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showFormModal && (
        <EmployeeFormModal
          employee={editingEmployee}
          departments={departments}
          onSave={handleSave}
          onClose={() => setShowFormModal(false)}
        />
      )}
    </div>
  );
}

function EmployeeFormModal({ employee, departments, onSave, onClose }: any) {
  const [form, setForm] = useState({
    name: employee?.name || '',
    position: employee?.position || '',
    department: employee?.department || departments[0] || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    status: employee?.status || 'online' as Employee['status'],
    managerId: employee?.managerId || '',
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
    skills: employee?.skills?.join(', ') || ''
  });

  const statusOptions = [
    { value: 'online', label: 'В сети' },
    { value: 'offline', label: 'Не в сети' },
    { value: 'busy', label: 'Занят' },
    { value: 'away', label: 'Отошёл' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Иванов Иван Иванович" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
              <input type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Специалист" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Отдел</label>
              <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Название отдела" list="departments-list" />
              <datalist id="departments-list">
                {departments.map((d: string) => <option key={d} value={d} />)}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Эл. почта</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="email@company.ru" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+7 (999) 123-45-67" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата приёма</label>
              <input type="date" value={form.hireDate} onChange={e => setForm({ ...form, hireDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Навыки (через запятую)</label>
            <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Документооборот, Делопроизводство" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave({ ...form, skills: form.skills.split(',').map((s: string) => s.trim()).filter(Boolean) })}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
            {employee ? 'Сохранить' : 'Добавить'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}
