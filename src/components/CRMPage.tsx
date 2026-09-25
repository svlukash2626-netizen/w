import { useState } from 'react';
import { Client, Deal, DealStage } from '../types';
import { generateId } from '../store';
import {
  Plus, Search, Edit2, Trash2, X, Mail, Phone, Building,
  DollarSign, Users, Briefcase, ChevronDown, GripVertical
} from 'lucide-react';

interface CRMProps {
  clients: Client[];
  deals: Deal[];
  onSaveClients: (c: Client[]) => void;
  onSaveDeals: (d: Deal[]) => void;
}

type Tab = 'deals' | 'clients';

export default function CRMPage({ clients, deals, onSaveClients, onSaveDeals }: CRMProps) {
  const [tab, setTab] = useState<Tab>('deals');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">CRM</h2>
          <p className="text-gray-500 mt-1">Управление клиентами и сделками</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('deals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'deals' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Briefcase size={16} className="inline mr-1.5" />Сделки
          </button>
          <button
            onClick={() => setTab('clients')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'clients' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Users size={16} className="inline mr-1.5" />Клиенты
          </button>
        </div>
      </div>

      {tab === 'deals' ? (
        <DealsKanban deals={deals} clients={clients} onSave={onSaveDeals} view={view} setView={setView} />
      ) : (
        <ClientsList clients={clients} onSave={onSaveClients} />
      )}
    </div>
  );
}

// ===== DEALS KANBAN =====
function DealsKanban({ deals, clients, onSave, view, setView }: {
  deals: Deal[]; clients: Client[]; onSave: (d: Deal[]) => void; view: 'kanban' | 'list'; setView: (v: 'kanban' | 'list') => void;
}) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const stages: DealStage[] = ['new', 'in_progress', 'negotiation', 'proposal', 'closed_won', 'closed_lost'];
  const stageLabels: Record<DealStage, string> = {
    new: 'Новая', in_progress: 'В работе', negotiation: 'Переговоры',
    proposal: 'Предложение', closed_won: 'Закрыто ✓', closed_lost: 'Закрыто ✗'
  };
  const stageHeaderColors: Record<DealStage, string> = {
    new: 'border-blue-400', in_progress: 'border-yellow-400', negotiation: 'border-purple-400',
    proposal: 'border-indigo-400', closed_won: 'border-green-400', closed_lost: 'border-red-400'
  };

  const filtered = deals.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const moveDeal = (dealId: string, newStage: DealStage) => {
    const updated = deals.map(d => d.id === dealId ? { ...d, stage: newStage } : d);
    onSave(updated);
  };

  const openAdd = () => { setEditingDeal(null); setShowModal(true); };
  const openEdit = (deal: Deal) => { setEditingDeal(deal); setShowModal(true); };

  const handleSave = (form: { title: string; clientId: string; amount: number; stage: DealStage; expectedCloseDate: string; description: string; probability: number }) => {
    const client = clients.find(c => c.id === form.clientId);
    if (editingDeal) {
      onSave(deals.map(d => d.id === editingDeal.id ? { ...d, ...form, clientName: client?.name || d.clientName } : d));
    } else {
      const newDeal: Deal = { id: generateId(), ...form, clientName: client?.name || '', createdAt: new Date().toISOString().split('T')[0] };
      onSave([...deals, newDeal]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить сделку?')) onSave(deals.filter(d => d.id !== id));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск сделок..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className={`px-3 py-2 rounded-lg text-sm ${view === 'kanban' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>Канбан</button>
          <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg text-sm ${view === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>Список</button>
          <button onClick={openAdd} className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Plus size={16} />Сделка
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageDeals = filtered.filter(d => d.stage === stage);
            const total = stageDeals.reduce((s, d) => s + d.amount, 0);
            return (
              <div key={stage} className="min-w-[260px] flex-1">
                <div className={`bg-white rounded-xl border-t-4 ${stageHeaderColors[stage]} shadow-sm`}>
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-700 text-sm">{stageLabels[stage]}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{stageDeals.length}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{(total / 1000).toFixed(0)}K ₽</p>
                  </div>
                  <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                    {stageDeals.map(deal => (
                      <div key={deal.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-indigo-200"
                        onClick={() => openEdit(deal)}>
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-gray-800 text-sm leading-tight">{deal.title}</p>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); openEdit(deal); }} className="p-1 hover:bg-white rounded">
                              <Edit2 size={12} className="text-gray-400" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(deal.id); }} className="p-1 hover:bg-white rounded">
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{deal.clientName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-gray-700">{deal.amount.toLocaleString()} ₽</span>
                          <span className="text-xs text-gray-400">{deal.probability}%</span>
                        </div>
                        {/* Quick move buttons */}
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stages.filter(s => s !== stage).map(s => (
                            <button key={s} onClick={e => { e.stopPropagation(); moveDeal(deal.id, s); }}
                              className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 rounded hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                              {stageLabels[s].slice(0, 5)}
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
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Название</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Клиент</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Сумма</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Этап</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(deal => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{deal.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{deal.clientName}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{deal.amount.toLocaleString()} ₽</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{stageLabels[deal.stage]}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(deal)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(deal.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <DealModal deal={editingDeal} clients={clients} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </>
  );
}

function DealModal({ deal, clients, onSave, onClose }: { deal: Deal | null; clients: Client[]; onSave: (f: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: deal?.title || '', clientId: deal?.clientId || '', amount: deal?.amount || 0,
    stage: deal?.stage || 'new' as DealStage, expectedCloseDate: deal?.expectedCloseDate || '',
    description: deal?.description || '', probability: deal?.probability || 20
  });

  const stageOptions: Record<DealStage, string> = {
    new: 'Новая', in_progress: 'В работе', negotiation: 'Переговоры',
    proposal: 'Предложение', closed_won: 'Закрыто ✓', closed_lost: 'Закрыто ✗'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{deal ? 'Редактировать сделку' : 'Новая сделка'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Название сделки" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Клиент</label>
            <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Выберите клиента</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (₽)</label>
              <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Вероятность (%)</label>
              <input type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Этап</label>
              <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as DealStage })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                {Object.entries(stageOptions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата закрытия</label>
              <input type="date" value={form.expectedCloseDate} onChange={e => setForm({ ...form, expectedCloseDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
            {deal ? 'Сохранить' : 'Создать'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}

// ===== CLIENTS LIST =====
function ClientsList({ clients, onSave }: { clients: Client[]; onSave: (c: Client[]) => void }) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');

  const filtered = clients.filter(c => {
    const s = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    return s && (filter === 'all' || c.status === filter);
  });

  const statusLabels: Record<string, string> = { active: 'Активный', inactive: 'Неактивный', lead: 'Лид' };
  const statusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', lead: 'bg-blue-100 text-blue-700' };

  const handleSave = (form: { name: string; email: string; phone: string; company: string; status: Client['status']; notes: string }) => {
    if (!form.name.trim()) return;
    if (editing) {
      onSave(clients.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      onSave([...clients, { id: generateId(), ...form, createdAt: new Date().toISOString().split('T')[0] }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить клиента?')) onSave(clients.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск клиентов..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'lead', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? 'Все' : statusLabels[f]}
            </button>
          ))}
          <button onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Plus size={16} />Клиент
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map(client => (
          <div key={client.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{client.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[client.status]}`}>{statusLabels[client.status]}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Building size={10} />{client.company}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(client); setShowModal(true); }} className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(client.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 ml-13">
              <span className="flex items-center gap-1"><Mail size={13} />{client.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} />{client.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && <ClientModal client={editing} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </>
  );
}

function ClientModal({ client, onSave, onClose }: { client: Client | null; onSave: (f: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: client?.name || '', email: client?.email || '', phone: client?.phone || '',
    company: client?.company || '', status: client?.status || 'lead' as Client['status'], notes: client?.notes || ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{client ? 'Редактировать клиента' : 'Новый клиент'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
              <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Client['status'] })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="lead">Лид</option>
                <option value="active">Активный</option>
                <option value="inactive">Неактивный</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
            {client ? 'Сохранить' : 'Добавить'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}
