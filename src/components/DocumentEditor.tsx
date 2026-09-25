import { useState } from 'react';
import { Document, Employee } from '../types';
import { X, Save, Download, FileText } from 'lucide-react';

interface DocumentEditorProps {
  document: Document;
  employees: Employee[];
  onSave: (content: string) => void;
  onClose: () => void;
}

export default function DocumentEditor({ document, employees, onSave, onClose }: DocumentEditorProps) {
  const getFileType = (mimeType?: string) => {
    if (!mimeType) return 'unknown';
    if (['doc', 'docx'].includes(mimeType.toLowerCase())) return 'word';
    if (['xls', 'xlsx'].includes(mimeType.toLowerCase())) return 'excel';
    return 'unknown';
  };

  const fileType = getFileType(document.mimeType);
  
  // Demo content for editing
  const [content, setContent] = useState(() => {
    if (fileType === 'word') {
      return `ДОГОВОР №${document.name.match(/\d+/)?.[0] || '___'}

г. Москва                                                                                                    "___" ______ 20__ г.

ООО "Компания", именуемое в дальнейшем "Заказчик", в лице генерального директора Иванова И.И., действующего на основании Устава, с одной стороны, и

ООО "Партнёр", именуемое в дальнейшем "Исполнитель", в лице генерального директора Петрова П.П., действующего на основании Устава, с другой стороны,

заключили настоящий договор о следующем:

1. ПРЕДМЕТ ДОГОВОРА
1.1. Исполнитель обязуется выполнить работы по техническому обслуживанию оборудования Заказчика, а Заказчик обязуется принять и оплатить выполненные работы.

2. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЁТОВ
2.1. Стоимость работ составляет 100 000 (Сто тысяч) рублей 00 копеек, включая НДС 20%.
2.2. Оплата производится в течение 5 банковских дней с момента подписания акта выполненных работ.

3. СРОКИ ВЫПОЛНЕНИЯ РАБОТ
3.1. Начало работ: с момента подписания договора.
3.2. Окончание работ: в течение 30 календарных дней.

4. ОТВЕТСТВЕННОСТЬ СТОРОН
4.1. За нарушение сроков выполнения работ Исполнитель уплачивает пени в размере 0,1% от стоимости невыполненных работ за каждый день просрочки.

5. ПРОЧИЕ УСЛОВИЯ
5.1. Договор составлен в двух экземплярах, имеющих равную юридическую силу.

ПОДПИСИ СТОРОН:

Заказчик:                                                  Исполнитель:
_______________                                            _______________
Иванов И.И.                                                Петров П.П.`;
    } else if (fileType === 'excel') {
      return JSON.stringify({
        headers: ['№', 'Наименование товара/услуги', 'Ед. изм.', 'Кол-во', 'Цена за ед., руб.', 'Сумма, руб.'],
        rows: [
          ['1', 'Техническое обслуживание', 'усл.', '1', '50 000,00', '50 000,00'],
          ['2', 'Запасные части', 'шт.', '5', '3 000,00', '15 000,00'],
          ['3', 'Доставка', 'усл.', '1', '5 000,00', '5 000,00'],
          ['', '', '', '', 'Итого:', '70 000,00'],
          ['', '', '', '', 'НДС 20%:', '14 000,00'],
          ['', '', '', '', 'Всего с НДС:', '84 000,00']
        ]
      });
    }
    return '';
  });

  const [isExcel, setIsExcel] = useState(fileType === 'excel');
  const [excelData, setExcelData] = useState(() => {
    try {
      return JSON.parse(content);
    } catch {
      return { headers: [], rows: [] };
    }
  });

  const handleSave = () => {
    if (isExcel) {
      onSave(JSON.stringify(excelData));
    } else {
      onSave(content);
    }
  };

  const addExcelRow = () => {
    setExcelData({
      ...excelData,
      rows: [...excelData.rows, new Array(excelData.headers.length).fill('')]
    });
  };

  const updateExcelCell = (rowIdx: number, colIdx: number, value: string) => {
    const newRows = [...excelData.rows];
    newRows[rowIdx] = [...newRows[rowIdx]];
    newRows[rowIdx][colIdx] = value;
    setExcelData({ ...excelData, rows: newRows });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isExcel ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <FileText size={20} className={isExcel ? 'text-green-600' : 'text-blue-600'} />
            <div>
              <h3 className="font-semibold text-gray-800">{document.name}</h3>
              <p className="text-xs text-gray-500">
                {isExcel ? 'Редактор таблиц' : 'Редактор документов'} • {document.size}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave}
              className={`px-4 py-2 ${isExcel ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-sm font-medium flex items-center gap-2`}>
              <Save size={16} />Сохранить
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {isExcel ? (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50 border-b-2 border-green-200">
                    <tr>
                      {excelData.headers.map((header: string, idx: number) => (
                        <th key={idx} className="px-4 py-3 text-left font-semibold text-green-800 border-r border-green-200 last:border-r-0">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.rows.map((row: string[], rowIdx: number) => (
                      <tr key={rowIdx} className="border-b border-gray-200 hover:bg-gray-50">
                        {row.map((cell: string, colIdx: number) => (
                          <td key={colIdx} className="px-2 py-2 border-r border-gray-200 last:border-r-0">
                            <input
                              type="text"
                              value={cell}
                              onChange={e => updateExcelCell(rowIdx, colIdx, e.target.value)}
                              className="w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none rounded"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addExcelRow}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                + Добавить строку
              </button>
            </div>
          ) : (
            <div className="p-4 h-full">
              <div className="bg-white rounded-lg shadow-sm p-8 min-h-full">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-full min-h-[600px] p-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed resize-none"
                  placeholder="Начните вводить текст документа..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
