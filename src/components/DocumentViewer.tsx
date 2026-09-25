import { Document } from '../types';
import { X, Download, File, Image, FileText } from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const getFileType = (mimeType?: string) => {
    if (!mimeType) return 'unknown';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(mimeType.toLowerCase())) return 'image';
    if (mimeType.toLowerCase() === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(mimeType.toLowerCase())) return 'word';
    if (['xls', 'xlsx'].includes(mimeType.toLowerCase())) return 'excel';
    if (['ppt', 'pptx'].includes(mimeType.toLowerCase())) return 'powerpoint';
    if (['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts'].includes(mimeType.toLowerCase())) return 'text';
    return 'unknown';
  };

  const fileType = getFileType(document.mimeType);

  // Demo content for different file types
  const getDemoContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <Image size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">{document.name}</p>
              <p className="text-sm text-gray-500 mt-2">Предпросмотр изображения</p>
              <div className="mt-4 p-4 bg-white rounded-lg inline-block">
                <div className="w-64 h-48 bg-gradient-to-br from-indigo-200 to-purple-200 rounded flex items-center justify-center">
                  <Image size={48} className="text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <span className="font-medium">{document.name}</span>
              </div>
              <span className="text-sm text-gray-300">{document.size}</span>
            </div>
            <div className="flex-1 bg-gray-100 p-8 overflow-auto">
              <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{document.name.replace('.pdf', '')}</h1>
                <div className="space-y-4 text-gray-600">
                  <p className="text-sm">Дата создания: {document.uploadedAt}</p>
                  <p className="text-sm">Автор: {document.uploadedBy}</p>
                  <hr className="my-4" />
                  <div className="prose prose-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Содержание документа</h2>
                    <p className="text-sm leading-relaxed">
                      Это демонстрационный PDF документ. В реальной системе здесь отображалось бы содержимое файла.
                      Документ содержит важную информацию о проекте, требования и спецификации.
                    </p>
                    <p className="text-sm leading-relaxed">
                      Основные разделы включают: обзор проекта, технические требования, сроки реализации,
                      бюджет и контактная информация ответственных лиц.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">Примечание:</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Для полноценного просмотра PDF файлов интегрируйте библиотеку pdf.js или используйте
                        встроенный PDF viewer браузера через iframe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'word':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <span className="font-medium">{document.name}</span>
              </div>
              <span className="text-sm text-blue-100">{document.size}</span>
            </div>
            <div className="flex-1 bg-gray-50 p-8 overflow-auto">
              <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto min-h-[600px]">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{document.name.replace('.docx', '')}</h1>
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p><strong>Дата:</strong> {document.uploadedAt}</p>
                  <p><strong>Автор:</strong> {document.uploadedBy}</p>
                  <hr className="my-6" />
                  <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Введение</h2>
                  <p>
                    Настоящий документ описывает основные положения и условия сотрудничества между сторонами.
                    Документ содержит всю необходимую информацию для принятия решения.
                  </p>
                  <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Основные положения</h2>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Пункт первый с описанием условий</li>
                    <li>Пункт второй с дополнительными требованиями</li>
                    <li>Пункт третий с ограничениями и оговорками</li>
                  </ul>
                  <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Заключение</h2>
                  <p>
                    Документ подготовлен в соответствии с установленными требованиями и готов к рассмотрению.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'excel':
        return (
          <div className="flex flex-col h-full">
            <div className="bg-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <span className="font-medium">{document.name}</span>
              </div>
              <span className="text-sm text-green-100">{document.size}</span>
            </div>
            <div className="flex-1 bg-gray-100 p-4 overflow-auto">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-green-50 border-b-2 border-green-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-green-800">№</th>
                      <th className="px-4 py-3 text-left font-semibold text-green-800">Наименование</th>
                      <th className="px-4 py-3 text-right font-semibold text-green-800">Количество</th>
                      <th className="px-4 py-3 text-right font-semibold text-green-800">Цена</th>
                      <th className="px-4 py-3 text-right font-semibold text-green-800">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">1</td>
                      <td className="px-4 py-3">Услуга 1</td>
                      <td className="px-4 py-3 text-right">10</td>
                      <td className="px-4 py-3 text-right">5 000 ₽</td>
                      <td className="px-4 py-3 text-right font-medium">50 000 ₽</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">2</td>
                      <td className="px-4 py-3">Услуга 2</td>
                      <td className="px-4 py-3 text-right">5</td>
                      <td className="px-4 py-3 text-right">12 000 ₽</td>
                      <td className="px-4 py-3 text-right font-medium">60 000 ₽</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">3</td>
                      <td className="px-4 py-3">Услуга 3</td>
                      <td className="px-4 py-3 text-right">8</td>
                      <td className="px-4 py-3 text-right">7 500 ₽</td>
                      <td className="px-4 py-3 text-right font-medium">60 000 ₽</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-green-50 border-t-2 border-green-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right font-semibold text-green-800">Итого:</td>
                      <td className="px-4 py-3 text-right font-bold text-green-800 text-lg">170 000 ₽</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center max-w-md">
              <File size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{document.name}</h3>
              <p className="text-gray-600 mb-4">
                Предпросмотр для данного типа файлов недоступен.
              </p>
              <div className="bg-white rounded-lg p-4 text-left space-y-2 text-sm">
                <p><span className="text-gray-500">Размер:</span> <span className="font-medium">{document.size}</span></p>
                <p><span className="text-gray-500">Тип:</span> <span className="font-medium">{document.mimeType?.toUpperCase() || 'Неизвестно'}</span></p>
                <p><span className="text-gray-500">Загружен:</span> <span className="font-medium">{document.uploadedAt}</span></p>
                <p><span className="text-gray-500">Автор:</span> <span className="font-medium">{document.uploadedBy}</span></p>
              </div>
              <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium inline-flex items-center gap-2">
                <Download size={18} />
                Скачать файл
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <File size={20} className="text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-800">{document.name}</h3>
              <p className="text-xs text-gray-500">{document.size} • {document.uploadedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2">
              <Download size={16} />
              Скачать
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {getDemoContent()}
        </div>
      </div>
    </div>
  );
}
