import { useState, useEffect } from 'react';
import { Page, Task, CalendarEvent, ChatChannel, ChatMessage, Employee, Document, WorkflowDocument, DocumentTemplate, ActivityItem, Notification } from './types';
import { store } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorkflowPage from './components/WorkflowPage';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import ChatPage from './components/ChatPage';
import EmployeesPage from './components/EmployeesPage';
import DocumentsPage from './components/DocumentsPage';
import ActivityPage from './components/ActivityPage';
import NotificationsPanel from './components/NotificationsPanel';
import LoginPage from './components/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('b24_auth');
    if (auth) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setTasks(store.getTasks());
      setCalendar(store.getCalendar());
      setChatChannels(store.getChatChannels());
      setChatMessages(store.getChatMessages());
      setEmployees(store.getEmployees());
      setDocuments(store.getDocuments());
      setWorkflow(store.getWorkflow());
      setTemplates(store.getTemplates());
      setActivity(store.getActivity());
      setNotifications(store.getNotifications());
    }
  }, [isAuthenticated]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('b24_auth');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const saveTasks = (v: Task[]) => { setTasks(v); store.saveTasks(v); };
  const saveCalendar = (v: CalendarEvent[]) => { setCalendar(v); store.saveCalendar(v); };
  const saveChatChannels = (v: ChatChannel[]) => { setChatChannels(v); store.saveChatChannels(v); };
  const saveChatMessages = (v: ChatMessage[]) => { setChatMessages(v); store.saveChatMessages(v); };
  const saveDocuments = (v: Document[]) => { setDocuments(v); store.saveDocuments(v); };
  const saveWorkflow = (v: WorkflowDocument[]) => { setWorkflow(v); store.saveWorkflow(v); };
  const saveTemplates = (v: DocumentTemplate[]) => { setTemplates(v); store.saveTemplates(v); };
  const saveNotifications = (v: Notification[]) => { setNotifications(v); store.saveNotifications(v); };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => saveNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => saveNotifications(notifications.map(n => ({ ...n, read: true })));
  const handleDeleteNotification = (id: string) => saveNotifications(notifications.filter(n => n.id !== id));

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard tasks={tasks} calendar={calendar} activity={activity} workflow={workflow}
          onNavigate={(page) => setCurrentPage(page)} />;
      case 'workflow':
        return <WorkflowPage documents={workflow} templates={templates} employees={employees}
          onSave={saveWorkflow} onSaveTemplates={saveTemplates} />;
      case 'tasks':
        return <TasksPage tasks={tasks} employees={employees} onSave={saveTasks} />;
      case 'calendar':
        return <CalendarPage events={calendar} onSave={saveCalendar} />;
      case 'chat':
        return <ChatPage channels={chatChannels} messages={chatMessages}
          onSaveChannels={saveChatChannels} onSaveMessages={saveChatMessages} />;
      case 'employees':
        return <EmployeesPage employees={employees} onSave={(e) => { setEmployees(e); store.saveEmployees(e); }} />;
      case 'disk':
        return <DocumentsPage documents={documents} employees={employees} onSave={saveDocuments} />;
      case 'activity':
        return <ActivityPage activity={activity} />;
      default:
        return <Dashboard tasks={tasks} calendar={calendar} activity={activity} workflow={workflow}
          onNavigate={(page) => setCurrentPage(page)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        unreadNotifications={unreadNotifications}
        onNotificationClick={() => setShowNotifications(true)}
        onLogout={handleLogout}
      />
      <main className="flex-1 lg:ml-0 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </div>
      </main>

      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDelete={handleDeleteNotification}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
