import { useState, useEffect } from 'react';
import { Page, Client, Deal, Task, CalendarEvent, ChatChannel, ChatMessage, Employee, Document, ActivityItem, Notification } from './types';
import { store } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CRMPage from './components/CRMPage';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import ChatPage from './components/ChatPage';
import EmployeesPage from './components/EmployeesPage';
import DocumentsPage from './components/DocumentsPage';
import ActivityPage from './components/ActivityPage';
import AnalyticsPage from './components/AnalyticsPage';
import NotificationsPanel from './components/NotificationsPanel';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data states
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [chatChannels, setChatChannels] = useState<ChatChannel[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data
  useEffect(() => {
    setClients(store.getClients());
    setDeals(store.getDeals());
    setTasks(store.getTasks());
    setCalendar(store.getCalendar());
    setChatChannels(store.getChatChannels());
    setChatMessages(store.getChatMessages());
    setEmployees(store.getEmployees());
    setDocuments(store.getDocuments());
    setActivity(store.getActivity());
    setNotifications(store.getNotifications());
  }, []);

  // Save handlers
  const saveClients = (v: Client[]) => { setClients(v); store.saveClients(v); };
  const saveDeals = (v: Deal[]) => { setDeals(v); store.saveDeals(v); };
  const saveTasks = (v: Task[]) => { setTasks(v); store.saveTasks(v); };
  const saveCalendar = (v: CalendarEvent[]) => { setCalendar(v); store.saveCalendar(v); };
  const saveChatChannels = (v: ChatChannel[]) => { setChatChannels(v); store.saveChatChannels(v); };
  const saveChatMessages = (v: ChatMessage[]) => { setChatMessages(v); store.saveChatMessages(v); };
  const saveDocuments = (v: Document[]) => { setDocuments(v); store.saveDocuments(v); };
  const saveNotifications = (v: Notification[]) => { setNotifications(v); store.saveNotifications(v); };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    saveNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    saveNotifications(notifications.filter(n => n.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} deals={deals} tasks={tasks} calendar={calendar} activity={activity}
          onNavigate={(page) => setCurrentPage(page)} />;
      case 'crm':
        return <CRMPage clients={clients} deals={deals} onSaveClients={saveClients} onSaveDeals={saveDeals} />;
      case 'tasks':
        return <TasksPage tasks={tasks} employees={employees} onSave={saveTasks} />;
      case 'calendar':
        return <CalendarPage events={calendar} onSave={saveCalendar} />;
      case 'chat':
        return <ChatPage channels={chatChannels} messages={chatMessages} onSaveChannels={saveChatChannels} onSaveMessages={saveChatMessages} />;
      case 'employees':
        return <EmployeesPage employees={employees} />;
      case 'documents':
        return <DocumentsPage documents={documents} onSave={saveDocuments} />;
      case 'activity':
        return <ActivityPage activity={activity} />;
      case 'analytics':
        return <AnalyticsPage deals={deals} tasks={tasks} clients={clients} />;
      default:
        return <Dashboard clients={clients} deals={deals} tasks={tasks} calendar={calendar} activity={activity}
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
