import { Client, Deal, Task, CalendarEvent, ChatChannel, ChatMessage, Employee, Document, ActivityItem, Notification } from './types';

const STORAGE_KEYS = {
  clients: 'b24_clients',
  deals: 'b24_deals',
  tasks: 'b24_tasks',
  calendar: 'b24_calendar',
  chat: 'b24_chat',
  employees: 'b24_employees',
  documents: 'b24_documents',
  activity: 'b24_activity',
  notifications: 'b24_notifications',
};

// ===== DEMO DATA =====
const demoEmployees: Employee[] = [
  { id: 'e1', name: 'Алексей Смирнов', position: 'Генеральный директор', department: 'Руководство', email: 'a.smirnov@company.ru', phone: '+7 (495) 100-00-01', status: 'online', hireDate: '2020-01-15', skills: ['Менеджмент', 'Стратегия'] },
  { id: 'e2', name: 'Мария Иванова', position: 'Руководитель отдела продаж', department: 'Продажи', email: 'm.ivanova@company.ru', phone: '+7 (495) 100-00-02', status: 'online', managerId: 'e1', hireDate: '2020-03-10', skills: ['B2B продажи', 'CRM', 'Переговоры'] },
  { id: 'e3', name: 'Дмитрий Петров', position: 'Менеджер по продажам', department: 'Продажи', email: 'd.petrov@company.ru', phone: '+7 (495) 100-00-03', status: 'busy', managerId: 'e2', hireDate: '2021-06-01', skills: ['Холодные звонки', 'Презентации'] },
  { id: 'e4', name: 'Елена Козлова', position: 'Менеджер по продажам', department: 'Продажи', email: 'e.kozlova@company.ru', phone: '+7 (495) 100-00-04', status: 'online', managerId: 'e2', hireDate: '2022-02-15', skills: ['Работа с клиентами', 'Договоры'] },
  { id: 'e5', name: 'Сергей Волков', position: 'Тимлид разработки', department: 'IT', email: 's.volkov@company.ru', phone: '+7 (495) 100-00-05', status: 'away', managerId: 'e1', hireDate: '2020-05-20', skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 'e6', name: 'Анна Новикова', position: 'Frontend-разработчик', department: 'IT', email: 'a.novikova@company.ru', phone: '+7 (495) 100-00-06', status: 'online', managerId: 'e5', hireDate: '2022-09-01', skills: ['React', 'CSS', 'JavaScript'] },
  { id: 'e7', name: 'Игорь Морозов', position: 'Backend-разработчик', department: 'IT', email: 'i.morozov@company.ru', phone: '+7 (495) 100-00-07', status: 'offline', managerId: 'e5', hireDate: '2021-11-15', skills: ['Python', 'PostgreSQL', 'Docker'] },
  { id: 'e8', name: 'Ольга Соколова', position: 'HR-менеджер', department: 'HR', email: 'o.sokolova@company.ru', phone: '+7 (495) 100-00-08', status: 'online', managerId: 'e1', hireDate: '2020-08-01', skills: ['Рекрутинг', 'Адаптация'] },
  { id: 'e9', name: 'Павел Лебедев', position: 'Маркетолог', department: 'Маркетинг', email: 'p.lebedev@company.ru', phone: '+7 (495) 100-00-09', status: 'busy', managerId: 'e1', hireDate: '2021-04-10', skills: ['SMM', 'SEO', 'Контент'] },
  { id: 'e10', name: 'Наталья Федорова', position: 'Бухгалтер', department: 'Финансы', email: 'n.fedorova@company.ru', phone: '+7 (495) 100-00-10', status: 'online', managerId: 'e1', hireDate: '2020-02-01', skills: ['1С', 'Налоги', 'Отчётность'] },
];

const demoClients: Client[] = [
  { id: 'c1', name: 'Иван Петров', email: 'ivan@technoprom.ru', phone: '+7 (999) 123-45-67', company: 'ООО "ТехноПром"', status: 'active', createdAt: '2024-01-15', notes: 'Ключевой клиент', managerId: 'e2' },
  { id: 'c2', name: 'Мария Сидорова', email: 'maria@innovations.ru', phone: '+7 (999) 234-56-78', company: 'АО "Инновации"', status: 'lead', createdAt: '2024-02-20', notes: 'Контакт на конференции', managerId: 'e3' },
  { id: 'c3', name: 'Алексей Козлов', email: 'alex@kozlov-ip.ru', phone: '+7 (999) 345-67-89', company: 'ИП Козлов', status: 'active', createdAt: '2024-03-10', notes: 'Постоянный клиент', managerId: 'e2' },
  { id: 'c4', name: 'Елена Волкова', email: 'elena@digital-group.ru', phone: '+7 (999) 456-78-90', company: 'ООО "Дигитал Групп"', status: 'inactive', createdAt: '2024-01-05', notes: 'Приостановили сотрудничество', managerId: 'e4' },
  { id: 'c5', name: 'Дмитрий Новиков', email: 'dmitry@stroymaster.ru', phone: '+7 (999) 567-89-01', company: 'ООО "СтройМастер"', status: 'lead', createdAt: '2024-04-01', notes: 'Заинтересован в CRM', managerId: 'e3' },
  { id: 'c6', name: 'Ольга Морозова', email: 'olga@retail-plus.ru', phone: '+7 (999) 678-90-12', company: 'ООО "Ритейл Плюс"', status: 'active', createdAt: '2024-03-25', notes: 'Годовой контракт', managerId: 'e4' },
];

const demoDeals: Deal[] = [
  { id: 'd1', title: 'Внедрение CRM для ТехноПром', clientId: 'c1', clientName: 'Иван Петров', amount: 500000, stage: 'negotiation', createdAt: '2024-02-01', expectedCloseDate: '2024-06-30', description: 'Полное внедрение CRM', probability: 70 },
  { id: 'd2', title: 'Консалтинг для Инновации', clientId: 'c2', clientName: 'Мария Сидорова', amount: 250000, stage: 'new', createdAt: '2024-03-15', expectedCloseDate: '2024-07-15', description: 'Аудит бизнес-процессов', probability: 20 },
  { id: 'd3', title: 'Поддержка для ИП Козлов', clientId: 'c3', clientName: 'Алексей Козлов', amount: 75000, stage: 'closed_won', createdAt: '2024-01-20', expectedCloseDate: '2024-03-01', description: 'Годовая подписка', probability: 100 },
  { id: 'd4', title: 'Разработка для Дигитал Групп', clientId: 'c5', clientName: 'Дмитрий Новиков', amount: 1200000, stage: 'proposal', createdAt: '2024-04-05', expectedCloseDate: '2024-08-01', description: 'Кастомный модуль аналитики', probability: 50 },
  { id: 'd5', title: 'Интеграция для Ритейл Плюс', clientId: 'c6', clientName: 'Ольга Морозова', amount: 350000, stage: 'in_progress', createdAt: '2024-04-10', expectedCloseDate: '2024-07-01', description: 'Интеграция с 1С', probability: 60 },
  { id: 'd6', title: 'Обучение персонала', clientId: 'c1', clientName: 'Иван Петров', amount: 120000, stage: 'closed_won', createdAt: '2024-01-10', expectedCloseDate: '2024-02-15', description: 'Обучение работе с CRM', probability: 100 },
  { id: 'd7', title: 'Миграция данных', clientId: 'c4', clientName: 'Елена Волкова', amount: 180000, stage: 'closed_lost', createdAt: '2024-02-01', expectedCloseDate: '2024-04-01', description: 'Миграция с другой CRM', probability: 0 },
];

const demoTasks: Task[] = [
  { id: 't1', title: 'Подготовить коммерческое предложение', description: 'Подготовить КП для ТехноПром с учётом новых требований', priority: 'high', status: 'in_progress', dueDate: '2024-05-20', assigneeId: 'e3', assigneeName: 'Дмитрий Петров', creatorId: 'e2', creatorName: 'Мария Иванова', projectId: undefined, tags: ['CRM', 'Продажи'], createdAt: '2024-05-01' },
  { id: 't2', title: 'Позвонить Марии Сидоровой', description: 'Уточнить требования к проекту', priority: 'medium', status: 'new', dueDate: '2024-05-18', assigneeId: 'e3', assigneeName: 'Дмитрий Петров', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Звонок'], createdAt: '2024-05-10' },
  { id: 't3', title: 'Отправить счёт ИП Козлов', description: 'Выставить счёт на оплату подписки', priority: 'low', status: 'done', dueDate: '2024-05-15', assigneeId: 'e10', assigneeName: 'Наталья Федорова', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Финансы'], createdAt: '2024-05-05', completedAt: '2024-05-14' },
  { id: 't4', title: 'Презентация для Дигитал Групп', description: 'Подготовить и провести презентацию модуля аналитики', priority: 'urgent', status: 'new', dueDate: '2024-05-25', assigneeId: 'e4', assigneeName: 'Елена Козлова', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Презентация', 'Клиент'], createdAt: '2024-05-08' },
  { id: 't5', title: 'Разработать модуль отчётов', description: 'Создать новый модуль аналитики и отчётов', priority: 'high', status: 'in_progress', dueDate: '2024-06-15', assigneeId: 'e6', assigneeName: 'Анна Новикова', creatorId: 'e5', creatorName: 'Сергей Волков', tags: ['Разработка', 'Frontend'], createdAt: '2024-05-01' },
  { id: 't6', title: 'Настроить API интеграцию', description: 'Настроить интеграцию с внешним API', priority: 'high', status: 'review', dueDate: '2024-05-22', assigneeId: 'e7', assigneeName: 'Игорь Морозов', creatorId: 'e5', creatorName: 'Сергей Волков', tags: ['Backend', 'API'], createdAt: '2024-05-03' },
  { id: 't7', title: 'Обновить данные в CRM', description: 'Проверить и обновить контактные данные клиентов', priority: 'low', status: 'new', dueDate: '2024-05-30', assigneeId: 'e4', assigneeName: 'Елена Козлова', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['CRM'], createdAt: '2024-05-12' },
  { id: 't8', title: 'Провести собеседование', description: 'Провести собеседование с кандидатом на позицию frontend-разработчика', priority: 'medium', status: 'done', dueDate: '2024-05-16', assigneeId: 'e8', assigneeName: 'Ольга Соколова', creatorId: 'e5', creatorName: 'Сергей Волков', tags: ['HR', 'Рекрутинг'], createdAt: '2024-05-09', completedAt: '2024-05-16' },
];

const demoCalendar: CalendarEvent[] = [
  { id: 'ev1', title: 'Встреча с ТехноПром', description: 'Обсуждение этапов внедрения', date: '2024-05-20', startTime: '10:00', endTime: '11:30', type: 'meeting', participants: ['e2', 'e3', 'c1'], color: '#4f46e5', location: 'Переговорная 1' },
  { id: 'ev2', title: 'Звонок с Инновации', description: 'Первичное обсуждение проекта', date: '2024-05-18', startTime: '14:00', endTime: '14:30', type: 'call', participants: ['e3', 'c2'], color: '#059669' },
  { id: 'ev3', title: 'Дедлайн: КП для Дигитал', description: 'Срок отправки коммерческого предложения', date: '2024-05-25', startTime: '18:00', endTime: '18:00', type: 'deadline', participants: ['e4'], color: '#dc2626' },
  { id: 'ev4', title: 'Командное собрание', description: 'Еженедельное собрание команды продаж', date: '2024-05-22', startTime: '09:00', endTime: '10:00', type: 'meeting', participants: ['e2', 'e3', 'e4'], color: '#4f46e5', location: 'Конференц-зал' },
  { id: 'ev5', title: 'Презентация продукта', description: 'Презентация нового модуля для клиента', date: '2024-05-23', startTime: '15:00', endTime: '16:30', type: 'event', participants: ['e4', 'e6'], color: '#7c3aed', location: 'Онлайн' },
  { id: 'ev6', title: 'Напоминание: отправить счёт', description: 'Отправить счёт для ИП Козлов', date: '2024-05-19', startTime: '09:00', endTime: '09:00', type: 'reminder', participants: ['e10'], color: '#f59e0b' },
];

const demoChatChannels: ChatChannel[] = [
  { id: 'ch1', name: 'Отдел продаж', type: 'group', participants: ['e2', 'e3', 'e4'], lastMessage: 'Мария: Коллеги, не забудьте про КП!', lastMessageTime: '10:30', unreadCount: 3 },
  { id: 'ch2', name: 'IT команда', type: 'group', participants: ['e5', 'e6', 'e7'], lastMessage: 'Сергей: Релиз в пятницу', lastMessageTime: '09:15', unreadCount: 1 },
  { id: 'ch3', name: 'Дмитрий Петров', type: 'direct', participants: ['e3'], lastMessage: 'Привет! Как дела с клиентом?', lastMessageTime: 'Вчера', unreadCount: 0 },
  { id: 'ch4', name: 'Общие объявления', type: 'channel', participants: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'Ольга: Не забудьте заполнить анкеты', lastMessageTime: '08:00', unreadCount: 5 },
  { id: 'ch5', name: 'Анна Новикова', type: 'direct', participants: ['e6'], lastMessage: 'Готово, отправила на ревью', lastMessageTime: '11:45', unreadCount: 2 },
];

const demoChatMessages: ChatMessage[] = [
  { id: 'm1', chatId: 'ch1', senderId: 'e2', senderName: 'Мария Иванова', text: 'Коллеги, доброе утро! Напоминаю про КП для ТехноПром.', timestamp: '2024-05-17T09:00:00', read: true },
  { id: 'm2', chatId: 'ch1', senderId: 'e3', senderName: 'Дмитрий Петров', text: 'Доброе утро! Уже работаю над ним, будет готово к обеду.', timestamp: '2024-05-17T09:05:00', read: true },
  { id: 'm3', chatId: 'ch1', senderId: 'e4', senderName: 'Елена Козлова', text: 'Я подготовила шаблоны, отправила на почту.', timestamp: '2024-05-17T09:15:00', read: true },
  { id: 'm4', chatId: 'ch1', senderId: 'e2', senderName: 'Мария Иванова', text: 'Отлично! Не забудьте про КП!', timestamp: '2024-05-17T10:30:00', read: false },
  { id: 'm5', chatId: 'ch2', senderId: 'e5', senderName: 'Сергей Волков', text: 'Команда, релиз модуля отчётов запланирован на пятницу.', timestamp: '2024-05-17T08:00:00', read: true },
  { id: 'm6', chatId: 'ch2', senderId: 'e6', senderName: 'Анна Новикова', text: 'Фронтенд часть готова, жду ревью бэкенда.', timestamp: '2024-05-17T08:30:00', read: true },
  { id: 'm7', chatId: 'ch2', senderId: 'e7', senderName: 'Игорь Морозов', text: 'API готово, сегодня залью на стейджинг.', timestamp: '2024-05-17T09:15:00', read: true },
];

const demoDocuments: Document[] = [
  { id: 'doc1', name: 'Коммерческие предложения', type: 'folder', uploadedBy: 'Мария Иванова', uploadedAt: '2024-01-15', shared: true, starred: true },
  { id: 'doc2', name: 'Договоры', type: 'folder', uploadedBy: 'Наталья Федорова', uploadedAt: '2024-01-10', shared: true, starred: false },
  { id: 'doc3', name: 'КП_ТехноПром_2024.pdf', type: 'file', size: '2.4 MB', mimeType: 'pdf', uploadedBy: 'Дмитрий Петров', uploadedAt: '2024-05-01', parentId: 'doc1', shared: false, starred: true },
  { id: 'doc4', name: 'Презентация_модуль.pptx', type: 'file', size: '15.8 MB', mimeType: 'pptx', uploadedBy: 'Елена Козлова', uploadedAt: '2024-05-08', shared: true, starred: false },
  { id: 'doc5', name: 'Договор_ИП_Козлов.docx', type: 'file', size: '340 KB', mimeType: 'docx', uploadedBy: 'Наталья Федорова', uploadedAt: '2024-01-20', parentId: 'doc2', shared: false, starred: false },
  { id: 'doc6', name: 'Техническое задание.xlsx', type: 'file', size: '1.2 MB', mimeType: 'xlsx', uploadedBy: 'Сергей Волков', uploadedAt: '2024-04-05', shared: true, starred: true },
  { id: 'doc7', name: 'Отчёт_Q1_2024.pdf', type: 'file', size: '5.6 MB', mimeType: 'pdf', uploadedBy: 'Наталья Федорова', uploadedAt: '2024-04-15', shared: true, starred: false },
  { id: 'doc8', name: 'Маркетинговая стратегия.pdf', type: 'file', size: '3.1 MB', mimeType: 'pdf', uploadedBy: 'Павел Лебедев', uploadedAt: '2024-03-20', shared: false, starred: false },
];

const demoActivity: ActivityItem[] = [
  { id: 'a1', type: 'deal', description: 'сделку "Внедрение CRM для ТехноПром" на этап "Переговоры"', userId: 'e2', userName: 'Мария Иванова', timestamp: '2024-05-17T10:30:00', entityType: 'deal', entityId: 'd1' },
  { id: 'a2', type: 'task', description: 'задачу "Подготовить коммерческое предложение"', userId: 'e3', userName: 'Дмитрий Петров', timestamp: '2024-05-17T09:00:00', entityType: 'task', entityId: 't1' },
  { id: 'a3', type: 'call', description: 'звонок клиенту Марии Сидоровой (АО "Инновации")', userId: 'e3', userName: 'Дмитрий Петров', timestamp: '2024-05-17T08:30:00' },
  { id: 'a4', type: 'comment', description: 'комментарий к задаче "Разработать модуль отчётов"', userId: 'e6', userName: 'Анна Новикова', timestamp: '2024-05-17T08:00:00', entityType: 'task', entityId: 't5' },
  { id: 'a5', type: 'document', description: 'документ "Презентация_модуль.pptx"', userId: 'e4', userName: 'Елена Козлова', timestamp: '2024-05-16T17:00:00', entityType: 'document', entityId: 'doc4' },
  { id: 'a6', type: 'deal', description: 'закрыл сделку "Поддержка для ИП Козлов" — успех', userId: 'e2', userName: 'Мария Иванова', timestamp: '2024-05-16T15:00:00', entityType: 'deal', entityId: 'd3' },
  { id: 'a7', type: 'login', description: 'вошёл в систему', userId: 'e5', userName: 'Сергей Волков', timestamp: '2024-05-16T09:00:00' },
  { id: 'a8', type: 'task', description: 'завершил задачу "Провести собеседование"', userId: 'e8', userName: 'Ольга Соколова', timestamp: '2024-05-16T14:00:00', entityType: 'task', entityId: 't8' },
];

const demoNotifications: Notification[] = [
  { id: 'n1', title: 'Новая задача', message: 'Вам назначена задача "Презентация для Дигитал Групп"', type: 'info', read: false, timestamp: '2024-05-17T10:00:00' },
  { id: 'n2', title: 'Сделка обновлена', message: 'Сделка "Внедрение CRM" перешла на этап "Переговоры"', type: 'success', read: false, timestamp: '2024-05-17T09:30:00' },
  { id: 'n3', title: 'Дедлайн завтра', message: 'Задача "Позвонить Марии Сидоровой" — срок завтра', type: 'warning', read: false, timestamp: '2024-05-17T08:00:00' },
  { id: 'n4', title: 'Новое сообщение', message: 'Мария Иванова отправила сообщение в чат "Отдел продаж"', type: 'info', read: true, timestamp: '2024-05-16T16:00:00' },
  { id: 'n5', title: 'Документ загружен', message: 'Елена Козлова загрузила "Презентация_модуль.pptx"', type: 'info', read: true, timestamp: '2024-05-16T14:00:00' },
];

// ===== STORAGE HELPERS =====
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error(e); }
}

export const store = {
  getClients: () => getFromStorage(STORAGE_KEYS.clients, demoClients),
  saveClients: (v: Client[]) => saveToStorage(STORAGE_KEYS.clients, v),
  getDeals: () => getFromStorage(STORAGE_KEYS.deals, demoDeals),
  saveDeals: (v: Deal[]) => saveToStorage(STORAGE_KEYS.deals, v),
  getTasks: () => getFromStorage(STORAGE_KEYS.tasks, demoTasks),
  saveTasks: (v: Task[]) => saveToStorage(STORAGE_KEYS.tasks, v),
  getCalendar: () => getFromStorage(STORAGE_KEYS.calendar, demoCalendar),
  saveCalendar: (v: CalendarEvent[]) => saveToStorage(STORAGE_KEYS.calendar, v),
  getChatChannels: () => getFromStorage(STORAGE_KEYS.chat + '_channels', demoChatChannels),
  saveChatChannels: (v: ChatChannel[]) => saveToStorage(STORAGE_KEYS.chat + '_channels', v),
  getChatMessages: () => getFromStorage(STORAGE_KEYS.chat + '_messages', demoChatMessages),
  saveChatMessages: (v: ChatMessage[]) => saveToStorage(STORAGE_KEYS.chat + '_messages', v),
  getEmployees: () => getFromStorage(STORAGE_KEYS.employees, demoEmployees),
  saveEmployees: (v: Employee[]) => saveToStorage(STORAGE_KEYS.employees, v),
  getDocuments: () => getFromStorage(STORAGE_KEYS.documents, demoDocuments),
  saveDocuments: (v: Document[]) => saveToStorage(STORAGE_KEYS.documents, v),
  getActivity: () => getFromStorage(STORAGE_KEYS.activity, demoActivity),
  saveActivity: (v: ActivityItem[]) => saveToStorage(STORAGE_KEYS.activity, v),
  getNotifications: () => getFromStorage(STORAGE_KEYS.notifications, demoNotifications),
  saveNotifications: (v: Notification[]) => saveToStorage(STORAGE_KEYS.notifications, v),
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
