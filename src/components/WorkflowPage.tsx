import { useState } from 'react';
import { WorkflowDocument, WorkflowDocType, WorkflowStatus, Employee, DocumentTemplate } from '../types';
import { generateId } from '../store';
import {
  Plus, Search, Edit2, Trash2, X, FileText, CheckCircle, XCircle,
  Clock, Send, AlertCircle, Filter, ChevronDown, MessageSquare,
  Paperclip, Eye, Download, MoreVertical
} from 'lucide-react';

interface WorkflowPageProps {
  documents: WorkflowDocument[];
  templates: DocumentTemplate[];
  employees: Employee[];
  onSave: (d: WorkflowDocument[]) => void;
  onSaveTemplates: (t: DocumentTemplate[]) => void;
}

export default function WorkflowPage({ documents, templates, employees, onSave, onSaveTemplates }: WorkflowPageProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<WorkflowDocument | null>(null);
  const [viewingDoc, setViewingDoc] = useState<WorkflowDocument | null>(null);

  const typeLabels: Record<WorkflowDocType, string> = {
    contract: 'Договор', invoice: 'Счёт-фактура', order: 'Заказ', report: 'Отчёт',
    memo: 'Служебная записка', request: 'Заявка', act: 'Акт', other: 'Другое'
  };

  const statusLabels: Record<WorkflowStatus, string> = {
    draft: 'Черновик', pending_approval: 'На согласовании', approved: 'Согласован',
    rejected: 'Отклонён', signed: 'Подписан', archived: 'В архиве'
  };

  const statusColors: Record<WorkflowStatus, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    pending_approval: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-blue-100 text-blue-700 border-blue-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    signed: 'bg-green-100 text-green-700 border-green-200',
    archived: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const priorityLabels: Record<string, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
  const priorityColors: Record<string, string> = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

  const filtered = documents.filter(d => {
    const s = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const st = filterStatus === 'all' || d.status === filterStatus;
    const tp = filterType === 'all' || d.type === filterType;
    return s && st && tp;
  });

  const handleSave = (form: any) => {
    if (editingDoc) {
      onSave(documents.map(d => d.id === editingDoc.id ? { ...d, ...form, updatedAt: new Date().toISOString().split('T')[0] } : d));
    } else {
      const newDoc: WorkflowDocument = {
        id: generateId(), ...form, status: 'draft', createdBy: 'e1', createdByName: 'Администратор',
        createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
        approvers: [], currentApproverIndex: 0, comments: [], attachments: [], version: 1
      };
      onSave([...documents, newDoc]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить документ?')) onSave(documents.filter(d => d.id !== id));
  };

  const handleApprove = (docId: string, approved: boolean, comment?: string) => {
    const updated = documents.map(d => {
      if (d.id !== docId) return d;
      const newApprovers = [...d.approvers];
      if (newApprovers[d.currentApproverIndex]) {
        newApprovers[d.currentApproverIndex] = {
          ...newApprovers[d.currentApproverIndex],
          status: approved ? 'approved' : 'rejected',
          comment,
          approvedAt: new Date().toISOString()
        };
      }
      let newStatus: WorkflowStatus = d.status;
      let newIndex = d.currentApproverIndex + 1;
      if (!approved) {
        newStatus = 'rejected';
      } else if (newIndex >= newApprovers.length) {
        newStatus = 'approved';
      }
      return { ...d, approvers: newApprovers, currentApproverIndex: newIndex, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
    });
    onSave(updated);
    if (viewingDoc?.id === docId) {
      setViewingDoc(updated.find(d => d.id === docId) || null);
    }
  };

  const handleSendForApproval = (docId: string, approverIds: string[]) => {
    const updated = documents.map(d => {
      if (d.id !== docId) return d;
      const approvers = approverIds.map((empId, idx) => {
        const emp = employees.find(e => e.id === empId);
        return { id: generateId(), employeeId: empId, employeeName: emp?.name || '', status: 'pending' as const, order: idx + 1 };
      });
      return { ...d, approvers, currentApproverIndex: 0, status: 'pending_approval' as WorkflowStatus, updatedAt: new Date().toISOString().split('T')[0] };
    });
    onSave(updated);
  };

  const handleSign = (docId: string) => {
    const updated = documents.map(d => d.id === docId ? { ...d, status: 'signed' as WorkflowStatus, updatedAt: new Date().toISOString().split('T')[0] } : d);
    onSave(updated);
  };

  const handleArchive = (docId: string) => {
    const updated = documents.map(d => d.id === docId ? { ...d, status: 'archived' as WorkflowStatus, updatedAt: new Date().toISOString().split('T')[0] } : d);
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Документооборот</h2>
          <p className="text-gray-500 mt-1">Создание, согласование и подписание документов</p>
        </div>
        <button onClick={() => { setEditingDoc(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} />Новый документ
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск документов..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none">
          <option value="all">Все статусы</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg outline-none">
          <option value="all">Все типы</option>
          {Object.entries(typeLabels as Record<string, string>).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = documents.filter(d => d.status === key).length;
          return (
            <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-100">
              <span className={`w-2 h-2 rounded-full ${statusColors[key as WorkflowStatus].split(' ')[0]}`} />
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-bold text-gray-800">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  doc.status === 'signed' ? 'bg-green-100' : doc.status === 'rejected' ? 'bg-red-100' :
                  doc.status === 'pending_approval' ? 'bg-yellow-100' : 'bg-indigo-100'
                }`}>
                  <FileText size={20} className={
                    doc.status === 'signed' ? 'text-green-600' : doc.status === 'rejected' ? 'text-red-600' :
                    doc.status === 'pending_approval' ? 'text-yellow-600' : 'text-indigo-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 truncate">{doc.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[doc.status]}`}>{statusLabels[doc.status]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[doc.priority]}`}>{priorityLabels[doc.priority]}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{doc.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    <span>Тип: {typeLabels[doc.type]}</span>
                    <span>Создан: {doc.createdByName}</span>
                    <span>Дата: {doc.createdAt}</span>
                    {doc.dueDate && <span className="text-orange-500">Срок: {doc.dueDate}</span>}
                    <span>v{doc.version}</span>
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{tag}</span>)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { setViewingDoc(doc); setShowDetailModal(true); }} className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600"><Eye size={16} /></button>
                <button onClick={() => { setEditingDoc(doc); setShowModal(true); }} className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
            {/* Approval progress */}
            {doc.approvers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {doc.approvers.map((app, idx) => (
                    <div key={app.id} className="flex items-center gap-1 flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        app.status === 'approved' ? 'bg-green-500 text-white' :
                        app.status === 'rejected' ? 'bg-red-500 text-white' :
                        idx === doc.currentApproverIndex ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {app.status === 'approved' ? '✓' : app.status === 'rejected' ? '✗' : idx + 1}
                      </div>
                      <span className="text-xs text-gray-500">{app.employeeName.split(' ')[0]}</span>
                      {idx < doc.approvers.length - 1 && <span className="text-gray-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Документы не найдены</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <DocumentFormModal
          document={editingDoc}
          templates={templates}
          employees={employees}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          typeLabels={typeLabels}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingDoc && (
        <DocumentDetailModal
          document={viewingDoc}
          employees={employees}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onSendForApproval={handleSendForApproval}
          onSign={handleSign}
          onArchive={handleArchive}
          typeLabels={typeLabels}
          statusLabels={statusLabels}
          statusColors={statusColors}
        />
      )}
    </div>
  );
}

// ===== FORM MODAL =====
function DocumentFormModal({ document, templates, employees, onSave, onClose, typeLabels }: any) {
  const [form, setForm] = useState({
    title: document?.title || '',
    type: document?.type || 'contract' as WorkflowDocType,
    description: document?.description || '',
    content: document?.content || '',
    priority: document?.priority || 'medium' as WorkflowDocument['priority'],
    dueDate: document?.dueDate || '',
    tags: document?.tags?.join(', ') || ''
  });

  const applyTemplate = (templateId: string) => {
    const tpl = templates.find((t: DocumentTemplate) => t.id === templateId);
    if (tpl) {
      setForm({ ...form, content: tpl.content, type: tpl.type, title: form.title || tpl.name });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{document ? 'Редактировать документ' : 'Новый документ'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        {templates.length > 0 && !document && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <label className="block text-sm font-medium text-indigo-800 mb-2">Создать из шаблона:</label>
            <select onChange={e => applyTemplate(e.target.value)} defaultValue=""
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg outline-none bg-white">
              <option value="">— Выберите шаблон —</option>
              {templates.map((tpl: DocumentTemplate) => (
                <option key={tpl.id} value={tpl.id}>{tpl.name} ({typeLabels[tpl.type]})</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип документа</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Содержание документа</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" rows={8} placeholder="Текст документа..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Срок исполнения</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Теги (через запятую)</label>
              <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" placeholder="Договор, Срочно" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave({ ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) })}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">
            {document ? 'Сохранить' : 'Создать'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}

// ===== DETAIL MODAL =====
function DocumentDetailModal({ document, employees, onClose, onApprove, onSendForApproval, onSign, onArchive, typeLabels, statusLabels, statusColors }: any) {
  const [comment, setComment] = useState('');
  const [showApproverSelect, setShowApproverSelect] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-gray-800">{document.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[document.status]}`}>{statusLabels[document.status]}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{document.description}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
              <span>Тип: {typeLabels[document.type]}</span>
              <span>Создан: {document.createdByName}</span>
              <span>Дата: {document.createdAt}</span>
              <span>Версия: {document.version}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Document content */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Содержание документа:</h4>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{document.content || 'Нет содержания'}</pre>
          </div>

          {/* Approval chain */}
          {document.approvers.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Маршрут согласования:</h4>
              <div className="space-y-2">
                {document.approvers.map((app: any, idx: number) => (
                  <div key={app.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    app.status === 'approved' ? 'bg-green-50 border-green-200' :
                    app.status === 'rejected' ? 'bg-red-50 border-red-200' :
                    idx === document.currentApproverIndex ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      app.status === 'approved' ? 'bg-green-500 text-white' :
                      app.status === 'rejected' ? 'bg-red-500 text-white' :
                      idx === document.currentApproverIndex ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {app.status === 'approved' ? '✓' : app.status === 'rejected' ? '✗' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{app.employeeName}</p>
                      {app.comment && <p className="text-xs text-gray-500 mt-0.5">"{app.comment}"</p>}
                      {app.approvedAt && <p className="text-xs text-gray-400 mt-0.5">{new Date(app.approvedAt).toLocaleString('ru-RU')}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {app.status === 'approved' ? 'Согласовано' : app.status === 'rejected' ? 'Отклонено' : 'Ожидает'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Комментарии:</h4>
            {document.comments.length > 0 ? (
              <div className="space-y-2">
                {document.comments.map((c: any) => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{String(c.authorName)}</span>
                      <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString('ru-RU')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{String(c.text)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Нет комментариев</p>
            )}
          </div>

          {/* Tags */}
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.map((tag: string) => <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">{tag}</span>)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {document.status === 'draft' && (
            <div>
              {!showApproverSelect ? (
                <button onClick={() => setShowApproverSelect(true)}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2">
                  <Send size={16} />Отправить на согласование
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Выберите согласующих (в порядке очереди):</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {employees.map((emp: Employee) => (
                      <label key={emp.id} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer">
                        <input type="checkbox" checked={selectedApprovers.includes(emp.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedApprovers([...selectedApprovers, emp.id]);
                            else setSelectedApprovers(selectedApprovers.filter(id => id !== emp.id));
                          }}
                          className="w-4 h-4 text-indigo-600 rounded" />
                        <span className="text-sm text-gray-700">{emp.name} — {emp.position}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { onSendForApproval(document.id, selectedApprovers); setShowApproverSelect(false); }}
                      disabled={selectedApprovers.length === 0}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                      Отправить ({selectedApprovers.length})
                    </button>
                    <button onClick={() => setShowApproverSelect(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Отмена</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {document.status === 'pending_approval' && document.currentApproverIndex < document.approvers.length && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => onApprove(document.id, true, comment)}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} />Согласовать
                </button>
                <button onClick={() => onApprove(document.id, false, comment)}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                  <XCircle size={16} />Отклонить
                </button>
              </div>
              <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Комментарий к решению (необязательно)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm" />
            </div>
          )}

          {document.status === 'approved' && (
            <button onClick={() => onSign(document.id)}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
              <CheckCircle size={16} />Подписать документ
            </button>
          )}

          {document.status === 'signed' && (
            <button onClick={() => onArchive(document.id)}
              className="w-full py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium flex items-center justify-center gap-2">
              <FileText size={16} />В архив
            </button>
          )}

          {(document.status === 'rejected' || document.status === 'archived') && (
            <p className="text-center text-sm text-gray-500 py-2">Документ {document.status === 'rejected' ? 'отклонён' : 'в архиве'}. Действия недоступны.</p>
          )}
        </div>
      </div>
    </div>
  );
}
