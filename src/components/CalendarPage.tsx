import { useState } from 'react';
import { CalendarEvent } from '../types';
import { generateId } from '../store';
import { Plus, X, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  onSave: (e: CalendarEvent[]) => void;
}

export default function CalendarPage({ events, onSave }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // May 2024
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const typeLabels: Record<string, string> = { meeting: 'Встреча', call: 'Звонок', deadline: 'Дедлайн', event: 'Событие', reminder: 'Напоминание' };
  const typeColors: Record<string, string> = { meeting: '#4f46e5', call: '#059669', deadline: '#dc2626', event: '#7c3aed', reminder: '#f59e0b' };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleSave = (form: any) => {
    const newEvent: CalendarEvent = {
      id: generateId(), ...form, participants: [], color: typeColors[form.type] || '#4f46e5'
    };
    onSave([...events, newEvent]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить событие?')) onSave(events.filter(e => e.id !== id));
  };

  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Календарь</h2>
          <p className="text-gray-500 mt-1">Планирование событий и встреч</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Plus size={16} />Новое событие
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20} /></button>
          <h3 className="text-lg font-semibold text-gray-800">{monthNames[month]} {year}</h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20} /></button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) return <div key={idx} className="aspect-square" />;
            const dayEvents = getEventsForDate(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === '2024-05-17';
            return (
              <div key={idx} onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square p-1 rounded-lg border cursor-pointer transition-all hover:border-indigo-300 ${
                  isToday ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'
                } ${selectedDate === dateStr ? 'ring-2 ring-indigo-500' : ''}`}>
                <span className={`text-xs font-medium ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>{day}</span>
                <div className="mt-0.5 space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev.id} className="text-[9px] px-1 py-0.5 rounded truncate text-white" style={{ backgroundColor: ev.color }}>
                      {ev.title.slice(0, 10)}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[9px] text-gray-400">+{dayEvents.length - 2}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">
            События на {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
          </h3>
          <div className="space-y-2">
            {events.filter(e => e.date === selectedDate).length > 0 ? (
              events.filter(e => e.date === selectedDate).map(ev => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: ev.color }} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={10} />{ev.startTime} - {ev.endTime}</span>
                      {ev.location && <span className="flex items-center gap-1"><MapPin size={10} />{ev.location}</span>}
                      <span className="text-indigo-500">{typeLabels[ev.type]}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(ev.id)} className="text-gray-400 hover:text-red-500 p-1"><X size={14} /></button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Нет событий</p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && <EventModal selectedDate={selectedDate} onSave={handleSave} onClose={() => setShowModal(false)} typeLabels={typeLabels} />}
    </div>
  );
}

function EventModal({ selectedDate, onSave, onClose, typeLabels }: { selectedDate: string | null; onSave: (f: any) => void; onClose: () => void; typeLabels: Record<string, string> }) {
  const [form, setForm] = useState({
    title: '', description: '', date: selectedDate || '', startTime: '09:00', endTime: '10:00',
    type: 'meeting' as CalendarEvent['type'], location: ''
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Новое событие</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Конец</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Место</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium">Создать</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 font-medium">Отмена</button>
        </div>
      </div>
    </div>
  );
}
