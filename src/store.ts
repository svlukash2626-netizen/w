import { Client, Deal, Task } from './types';

const CLIENTS_KEY = 'crm_clients';
const DEALS_KEY = 'crm_deals';
const TASKS_KEY = 'crm_tasks';

// Initial demo data
const demoClients: Client[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    company: 'ООО "ТехноПром"',
    status: 'active',
    createdAt: '2024-01-15',
    notes: 'Ключевой клиент, заинтересован в расширении пакета услуг'
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    phone: '+7 (999) 234-56-78',
    company: 'АО "Инновации"',
    status: 'lead',
    createdAt: '2024-02-20',
    notes: 'Первый контакт на конференции'
  },
  {
    id: '3',
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    phone: '+7 (999) 345-67-89',
    company: 'ИП Козлов',
    status: 'active',
    createdAt: '2024-03-10',
    notes: 'Постоянный клиент, ежемесячные заказы'
  },
  {
    id: '4',
    name: 'Елена Волкова',
    email: 'elena@example.com',
    phone: '+7 (999) 456-78-90',
    company: 'ООО "Дигитал Групп"',
    status: 'inactive',
    createdAt: '2024-01-05',
    notes: 'Приостановили сотрудничество'
  },
  {
    id: '5',
    name: 'Дмитрий Новиков',
    email: 'dmitry@example.com',
    phone: '+7 (999) 567-89-01',
    company: 'ООО "СтройМастер"',
    status: 'lead',
    createdAt: '2024-04-01',
    notes: 'Заинтересован в CRM решении'
  }
];

const demoDeals: Deal[] = [
  {
    id: '1',
    title: 'Внедрение CRM для ТехноПром',
    clientId: '1',
    clientName: 'Иван Петров',
    amount: 500000,
    stage: 'negotiation',
    createdAt: '2024-02-01',
    expectedCloseDate: '2024-06-30',
    description: 'Полное внедрение CRM системы с обучением персонала'
  },
  {
    id: '2',
    title: 'Консалтинг для Инновации',
    clientId: '2',
    clientName: 'Мария Сидорова',
    amount: 250000,
    stage: 'lead',
    createdAt: '2024-03-15',
    expectedCloseDate: '2024-07-15',
    description: 'Аудит бизнес-процессов и рекомендации'
  },
  {
    id: '3',
    title: 'Поддержка для ИП Козлов',
    clientId: '3',
    clientName: 'Алексей Козлов',
    amount: 75000,
    stage: 'closed_won',
    createdAt: '2024-01-20',
    expectedCloseDate: '2024-03-01',
    description: 'Годовая подписка на техническую поддержку'
  },
  {
    id: '4',
    title: 'Разработка для Дигитал Групп',
    clientId: '5',
    clientName: 'Дмитрий Новиков',
    amount: 1200000,
    stage: 'proposal',
    createdAt: '2024-04-05',
    expectedCloseDate: '2024-08-01',
    description: 'Разработка кастомного модуля аналитики'
  }
];

const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Подготовить коммерческое предложение',
    description: 'Подготовить КП для ТехноПром с учётом новых требований',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-05-20',
    assignedTo: 'Менеджер',
    relatedDealId: '1',
    createdAt: '2024-05-01'
  },
  {
    id: '2',
    title: 'Позвонить Марии Сидоровой',
    description: 'Уточнить требования к проекту',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-18',
    assignedTo: 'Менеджер',
    relatedDealId: '2',
    createdAt: '2024-05-10'
  },
  {
    id: '3',
    title: 'Отправить счёт ИП Козлов',
    description: 'Выставить счёт на оплату подписки',
    priority: 'low',
    status: 'done',
    dueDate: '2024-05-15',
    assignedTo: 'Бухгалтерия',
    relatedDealId: '3',
    createdAt: '2024-05-05'
  },
  {
    id: '4',
    title: 'Презентация для Дигитал Групп',
    description: 'Подготовить и провести презентацию модуля аналитики',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-05-25',
    assignedTo: 'Менеджер',
    relatedDealId: '4',
    createdAt: '2024-05-08'
  },
  {
    id: '5',
    title: 'Обновить данные в CRM',
    description: 'Проверить и обновить контактные данные клиентов',
    priority: 'low',
    status: 'todo',
    dueDate: '2024-05-30',
    assignedTo: 'Администратор',
    createdAt: '2024-05-12'
  }
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function getClients(): Client[] {
  return getFromStorage(CLIENTS_KEY, demoClients);
}

export function saveClients(clients: Client[]): void {
  saveToStorage(CLIENTS_KEY, clients);
}

export function getDeals(): Deal[] {
  return getFromStorage(DEALS_KEY, demoDeals);
}

export function saveDeals(deals: Deal[]): void {
  saveToStorage(DEALS_KEY, deals);
}

export function getTasks(): Task[] {
  return getFromStorage(TASKS_KEY, demoTasks);
}

export function saveTasks(tasks: Task[]): void {
  saveToStorage(TASKS_KEY, tasks);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
