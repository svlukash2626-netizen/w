import React from 'react';
import { Page } from '../types';
import {
  LayoutDashboard, FileText, CheckSquare, Calendar,
  MessageSquare, UserCircle, FolderOpen, Activity,
  Menu, X, Bell, LogOut
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
  unreadNotifications: number;
  onNotificationClick: () => void;
  onLogout: () => void;
}

const menuItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
  { page: 'workflow', label: 'Документооборот', icon: <FileText size={20} /> },
  { page: 'tasks', label: 'Задачи', icon: <CheckSquare size={20} /> },
  { page: 'calendar', label: 'Календарь', icon: <Calendar size={20} /> },
  { page: 'chat', label: 'Чат', icon: <MessageSquare size={20} /> },
  { page: 'employees', label: 'Сотрудники', icon: <UserCircle size={20} /> },
  { page: 'disk', label: 'Диск', icon: <FolderOpen size={20} /> },
  { page: 'activity', label: 'Лента', icon: <Activity size={20} /> },
];

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle, unreadNotifications, onNotificationClick, onLogout }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
      )}

      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-30 lg:hidden flex items-center justify-between px-4">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Документооборот</h1>
        <button onClick={onNotificationClick} className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>

      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 transition-transform duration-300 w-64 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:z-auto`}>
        
        <div className="p-5 border-b border-slate-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Документооборот
          </h1>
          <p className="text-slate-500 text-xs mt-1">Корпоративный портал</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onPageChange(item.page);
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                currentPage === item.page
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-lg">
              А
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Администратор</p>
              <p className="text-xs text-slate-400 truncate">admin@company.ru</p>
            </div>
            <button
              onClick={onNotificationClick}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-700/50 relative"
            >
              <Bell size={16} className="text-slate-400" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm"
          >
            <LogOut size={18} />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>
    </>
  );
}
