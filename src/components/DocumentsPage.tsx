import { useState } from 'react';
import { Document } from '../types';
import { Search, Folder, File, Star, Share2, Download, MoreVertical, Plus, Grid, List, Eye } from 'lucide-react';
import DocumentViewer from './DocumentViewer';

interface DocumentsProps {
  documents: Document[];
  onSave: (d: Document[]) => void;
}

export default function DocumentsPage({ documents, onSave }: DocumentsProps) {
  const [search, setSearch] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showStarred, setShowStarred] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  const filtered = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = (currentFolder === undefined ? !d.parentId : d.parentId === currentFolder);
    const matchesStarred = !showStarred || d.starred;
    return matchesSearch && matchesFolder && matchesStarred;
  });

  const folders = filtered.filter(d => d.type === 'folder');
  const files = filtered.filter(d => d.type === 'file');

  const toggleStar = (id: string) => {
    onSave(documents.map(d => d.id === id ? { ...d, starred: !d.starred } : d));
  };

  const deleteDoc = (id: string) => {
    if (confirm('Удалить?')) onSave(documents.filter(d => d.id !== id));
  };

  const getFileIcon = (mimeType?: string) => {
    const colors: Record<string, string> = {
      pdf: 'text-red-500', docx: 'text-blue-500', xlsx: 'text-green-500',
      pptx: 'text-orange-500', default: 'text-gray-500'
    };
    return colors[mimeType || 'default'] || colors.default;
  };

  const breadcrumbs = () => {
    const crumbs: { id: string | undefined; name: string }[] = [{ id: undefined, name: 'Мой диск' }];
    if (currentFolder) {
      const folder = documents.find(d => d.id === currentFolder);
      if (folder) crumbs.push({ id: folder.id, name: folder.name });
    }
    return crumbs;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Диск</h2>
          <p className="text-gray-500 mt-1">Файлы и документы компании</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowStarred(!showStarred); setCurrentFolder(undefined); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${showStarred ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <Star size={14} />Избранное
          </button>
          <button className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Plus size={16} />Загрузить
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs().map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-gray-300">/</span>}
            <button onClick={() => setCurrentFolder(crumb.id)}
              className={`hover:text-indigo-600 ${idx === breadcrumbs().length - 1 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {/* Search & View toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Поиск файлов..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}><Grid size={18} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}><List size={18} /></button>
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {folders.map(folder => (
            <div key={folder.id} onClick={() => setCurrentFolder(folder.id)}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <Folder size={36} className="text-indigo-400" />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); toggleStar(folder.id); }}
                    className={`p-1 rounded ${folder.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}>
                    <Star size={14} fill={folder.starred ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{folder.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{folder.uploadedAt}</p>
            </div>
          ))}
          {files.map(file => (
            <div key={file.id} onClick={() => setViewingDocument(file)} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <File size={36} className={getFileIcon(file.mimeType)} />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); setViewingDocument(file); }}
                    className="p-1 text-gray-300 hover:text-indigo-500 rounded"><Eye size={14} /></button>
                  <button onClick={e => { e.stopPropagation(); toggleStar(file.id); }}
                    className={`p-1 rounded ${file.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}>
                    <Star size={14} fill={file.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-1 text-gray-300 hover:text-indigo-500 rounded"><Share2 size={14} /></button>
                  <button className="p-1 text-gray-300 hover:text-indigo-500 rounded"><Download size={14} /></button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">{file.size}</span>
                <span className="text-xs text-gray-400">{file.uploadedAt}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Размер</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Загружен</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Автор</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...folders, ...files].map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => doc.type === 'folder' && setCurrentFolder(doc.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {doc.type === 'folder' ? <Folder size={18} className="text-indigo-400" /> : <File size={18} className={getFileIcon(doc.mimeType)} />}
                      <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                      {doc.starred && <Star size={12} className="text-yellow-500" fill="currentColor" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{doc.size || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{doc.uploadedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{doc.uploadedBy}</td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(folders.length === 0 && files.length === 0) && (
        <div className="text-center py-12 text-gray-400">
          <Folder size={48} className="mx-auto mb-3 text-gray-300" />
          <p>Папка пуста</p>
        </div>
      )}

      {/* Document Viewer */}
      {viewingDocument && (
        <DocumentViewer document={viewingDocument} onClose={() => setViewingDocument(null)} />
      )}
    </div>
  );
}
