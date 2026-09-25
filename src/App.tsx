import { useState, useEffect } from 'react';
import { Page, Client, Deal, Task } from './types';
import { getClients, saveClients, getDeals, saveDeals, getTasks, saveTasks } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Deals from './components/Deals';
import Tasks from './components/Tasks';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load data on mount
  useEffect(() => {
    setClients(getClients());
    setDeals(getDeals());
    setTasks(getTasks());
  }, []);

  // Save handlers
  const handleSaveClients = (updated: Client[]) => {
    setClients(updated);
    saveClients(updated);
  };

  const handleSaveDeals = (updated: Deal[]) => {
    setDeals(updated);
    saveDeals(updated);
  };

  const handleSaveTasks = (updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} deals={deals} tasks={tasks} />;
      case 'clients':
        return <Clients clients={clients} onSave={handleSaveClients} />;
      case 'deals':
        return <Deals deals={deals} clients={clients} onSave={handleSaveDeals} />;
      case 'tasks':
        return <Tasks tasks={tasks} onSave={handleSaveTasks} />;
      default:
        return <Dashboard clients={clients} deals={deals} tasks={tasks} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
