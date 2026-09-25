import { useState } from 'react';
import { Deal, Client } from '../types';
import { generateId } from '../store';
import { Plus, Search, Edit2, Trash2, X, DollarSign, Calendar, Briefcase } from 'lucide-react';

interface DealsProps {
  deals: Deal[];
  clients: Client[];
  onSave: (deals: Deal[]) => void;
}

export default function Deals({ deals, clients, onSave }: DealsProps) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [filterStage, setFilterStage] = useState<string>('all');

  const [form, setForm] = useState({
    title: '',
    clientId: '',
    amount: 0,
    stage: 'lead' as Deal['stage'],
    expectedCloseDate: '',
    description: ''
  });

  const filteredDeals = deals.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStage === 'all' || d.stage === filterStage;
    return matchesSearch && matchesFilter;
  });

  const openAddModal = () => {
    setEditingDeal(null);
    setForm({ title: '', clientId: '', amount: 0, stage: 'lead', expectedCloseDate: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      clientId: deal.clientId,
      amount: deal.amount,
      stage: deal.stage,
      expectedCloseDate: deal.expectedCloseDate,
      description: deal.description
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const selectedClient = clients.find(c => c.id === form.clientId);

    if (editingDeal) {
      const updated = deals.map(d =>
        d.id === editingDeal.id
          ? { ...d, ...form, clientName: selectedClient?.name || d.clientName }
          : d
      );
      onSave(updated);
    } else {
      const newDeal: Deal = {
        id: generateId(),
        ...form,
        clientName: selectedClient?.name || 'Не указан',
        createdAt: new Date().toISOString().split('T')[0]
      };
      onSave([...deals, newDeal]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить сделку?')) {
      onSave(deals.filter(d => d.id !== id));
    }
  };

  const stageLabels: Record<string, string> = {
    lead: 'Лид',
    negotiation: 'Переговоры',
    proposal: 'Предложение',
    closed_won: 'Закрыто (успех)',
    closed_lost: 'Закрыто (отказ)'
  };

  const stageColors: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-700 border-blue-200',
    negotiation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    proposal: 'bg-purple-100 text-purple-700 border-purple-200',
    closed_won: 'bg-green-100 text-green-700 border-green-200',
    closed_lost: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Сделки</h2>
          <p className="text-gray-500 mt-1">Управление сделками и воронкой продаж</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Новая сделка
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по названию или клиенту..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        >
          <option value="all">Все этапы</option>
          {Object.entries(stageLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Deals List */}
      <div className="grid gap-4">
        {filteredDeals.map(deal => (
          <div
            key={deal.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{deal.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${stageColors[deal.stage]}`}>
                    {stageLabels[deal.stage]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{deal.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span className="font-medium text-gray-700">{deal.amount.toLocaleString()} ₽</span>
                  </span>
                  <span>Клиент: <span className="text-gray-700">{deal.clientName}</span></span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Закрытие: {deal.expectedCloseDate}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(deal)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(deal.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Сделки не найдены</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingDeal ? 'Редактировать сделку' : 'Новая сделка'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Внедрение CRM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Клиент</label>
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Выберите клиента</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (₽)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Этап</label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value as Deal['stage'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {Object.entries(stageLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ожидаемая дата закрытия</label>
                <input
                  type="date"
                  value={form.expectedCloseDate}
                  onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Детали сделки..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {editingDeal ? 'Сохранить' : 'Создать'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
