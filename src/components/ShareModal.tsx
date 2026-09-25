import { useState } from 'react';
import { Document, Employee } from '../types';
import { X, Users, Check } from 'lucide-react';

interface ShareModalProps {
  document: Document;
  employees: Employee[];
  onShare: (employeeIds: string[]) => void;
  onClose: () => void;
}

export default function ShareModal({ document, employees, onShare, onClose }: ShareModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEmployee = (empId: string) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const handleShare = () => {
    onShare(selectedEmployees);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              Поделиться файлом
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{document.name}</span>
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Employees list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredEmployees.length > 0 ? (
            <div className="space-y-2">
              {filteredEmployees.map(emp => {
                const isSelected = selectedEmployees.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{emp.name}</p>
                      <p className="text-xs text-gray-500 truncate">{emp.position} • {emp.department}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users size={40} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Сотрудники не найдены</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          {selectedEmployees.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              Выбрано сотрудников: <span className="font-bold text-indigo-600">{selectedEmployees.length}</span>
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              disabled={selectedEmployees.length === 0}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Поделиться
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
