import { Task, CalendarEvent, ChatChannel, ChatMessage, Employee, Document, WorkflowDocument, DocumentTemplate, ActivityItem, Notification } from './types';

const STORAGE_KEYS = {
  tasks: 'b24_tasks',
  calendar: 'b24_calendar',
  chat: 'b24_chat',
  employees: 'b24_employees',
  documents: 'b24_documents',
  workflow: 'b24_workflow',
  templates: 'b24_templates',
  activity: 'b24_activity',
  notifications: 'b24_notifications',
};

// ===== DEMO DATA =====
const demoEmployees: Employee[] = [
  { id: 'e1', name: 'Алексей Смирнов', position: 'Генеральный директор', department: 'Руководство', email: 'a.smirnov@company.ru', phone: '+7 (495) 100-00-01', status: 'online', hireDate: '2020-01-15', skills: ['Менеджмент', 'Стратегия'] },
  { id: 'e2', name: 'Мария Иванова', position: 'Руководитель отдела документооборота', department: 'Документооборот', email: 'm.ivanova@company.ru', phone: '+7 (495) 100-00-02', status: 'online', managerId: 'e1', hireDate: '2020-03-10', skills: ['Документооборот', 'Делопроизводство', 'Архивирование'] },
  { id: 'e3', name: 'Дмитрий Петров', position: 'Специалист по документообороту', department: 'Документооборот', email: 'd.petrov@company.ru', phone: '+7 (495) 100-00-03', status: 'busy', managerId: 'e2', hireDate: '2021-06-01', skills: ['Согласование', 'Архив', 'Реестры'] },
  { id: 'e4', name: 'Елена Козлова', position: 'Специалист по документообороту', department: 'Документооборот', email: 'e.kozlova@company.ru', phone: '+7 (495) 100-00-04', status: 'online', managerId: 'e2', hireDate: '2022-02-15', skills: ['Договоры', 'Счета', 'Акты'] },
  { id: 'e5', name: 'Сергей Волков', position: 'Тимлид разработки', department: 'IT', email: 's.volkov@company.ru', phone: '+7 (495) 100-00-05', status: 'away', managerId: 'e1', hireDate: '2020-05-20', skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 'e6', name: 'Анна Новикова', position: 'Frontend-разработчик', department: 'IT', email: 'a.novikova@company.ru', phone: '+7 (495) 100-00-06', status: 'online', managerId: 'e5', hireDate: '2022-09-01', skills: ['React', 'CSS', 'JavaScript'] },
  { id: 'e7', name: 'Игорь Морозов', position: 'Backend-разработчик', department: 'IT', email: 'i.morozov@company.ru', phone: '+7 (495) 100-00-07', status: 'offline', managerId: 'e5', hireDate: '2021-11-15', skills: ['Python', 'PostgreSQL', 'Docker'] },
  { id: 'e8', name: 'Ольга Соколова', position: 'HR-менеджер', department: 'HR', email: 'o.sokolova@company.ru', phone: '+7 (495) 100-00-08', status: 'online', managerId: 'e1', hireDate: '2020-08-01', skills: ['Рекрутинг', 'Адаптация'] },
  { id: 'e9', name: 'Павел Лебедев', position: 'Главный бухгалтер', department: 'Бухгалтерия', email: 'p.lebedev@company.ru', phone: '+7 (495) 100-00-09', status: 'busy', managerId: 'e1', hireDate: '2020-04-10', skills: ['1С', 'Налоги', 'Отчётность'] },
  { id: 'e10', name: 'Наталья Федорова', position: 'Бухгалтер', department: 'Бухгалтерия', email: 'n.fedorova@company.ru', phone: '+7 (495) 100-00-10', status: 'online', managerId: 'e9', hireDate: '2020-02-01', skills: ['1С', 'Первичная документация', 'Зарплата'] },
];

const demoTasks: Task[] = [
  { id: 't1', title: 'Подготовить договор с ООО "ТехноПром"', description: 'Подготовить проект договора поставки с учётом новых требований', priority: 'high', status: 'in_progress', dueDate: '2024-05-20', assigneeId: 'e4', assigneeName: 'Елена Козлова', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Договор', 'Срочно'], createdAt: '2024-05-01' },
  { id: 't2', title: 'Согласовать счёт-фактуру №245', description: 'Проверить и согласовать счёт-фактуру от поставщика', priority: 'medium', status: 'new', dueDate: '2024-05-18', assigneeId: 'e3', assigneeName: 'Дмитрий Петров', creatorId: 'e9', creatorName: 'Павел Лебедев', tags: ['Счёт', 'Бухгалтерия'], createdAt: '2024-05-10' },
  { id: 't3', title: 'Архивировать документы за Q1', description: 'Перенести документы первого квартала в архив', priority: 'low', status: 'done', dueDate: '2024-05-15', assigneeId: 'e3', assigneeName: 'Дмитрий Петров', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Архив'], createdAt: '2024-05-05', completedAt: '2024-05-14' },
  { id: 't4', title: 'Разработать шаблон акта выполненных работ', description: 'Создать новый шаблон для актов выполненных работ', priority: 'urgent', status: 'new', dueDate: '2024-05-25', assigneeId: 'e4', assigneeName: 'Елена Козлова', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Шаблон', 'Документ'], createdAt: '2024-05-08' },
  { id: 't5', title: 'Обновить реестр договоров', description: 'Актуализировать данные в реестре договоров', priority: 'high', status: 'in_progress', dueDate: '2024-06-15', assigneeId: 'e3', assigneeName: 'Дмитрий Петров', creatorId: 'e2', creatorName: 'Мария Иванова', tags: ['Реестр', 'Документооборот'], createdAt: '2024-05-01' },
  { id: 't6', title: 'Настроить автоматическую рассылку уведомлений', description: 'Настроить систему уведомлений для согласования документов', priority: 'high', status: 'review', dueDate: '2024-05-22', assigneeId: 'e6', assigneeName: 'Анна Новикова', creatorId: 'e5', creatorName: 'Сергей Волков', tags: ['IT', 'Автоматизация'], createdAt: '2024-05-03' },
  { id: 't7', title: 'Провести обучение сотрудников', description: 'Обучить новых сотрудников работе с системой документооборота', priority: 'medium', status: 'new', dueDate: '2024-05-30', assigneeId: 'e2', assigneeName: 'Мария Иванова', creatorId: 'e1', creatorName: 'Алексей Смирнов', tags: ['Обучение', 'HR'], createdAt: '2024-05-12' },
  { id: 't8', title: 'Подготовить отчёт по документообороту', description: 'Подготовить ежемесячный отчёт по движению документов', priority: 'medium', status: 'done', dueDate: '2024-05-16', assigneeId: 'e2', assigneeName: 'Мария Иванова', creatorId: 'e1', creatorName: 'Алексей Смирнов', tags: ['Отчёт'], createdAt: '2024-05-09', completedAt: '2024-05-16' },
];

const demoCalendar: CalendarEvent[] = [
  { id: 'ev1', title: 'Совещание по документообороту', description: 'Еженедельное совещание отдела', date: '2024-05-20', startTime: '10:00', endTime: '11:30', type: 'meeting', participants: ['e2', 'e3', 'e4'], color: '#4f46e5', location: 'Переговорная 1' },
  { id: 'ev2', title: 'Звонок с поставщиком', description: 'Обсуждение условий договора', date: '2024-05-18', startTime: '14:00', endTime: '14:30', type: 'call', participants: ['e4'], color: '#059669' },
  { id: 'ev3', title: 'Дедлайн: отчёт за май', description: 'Срок сдачи ежемесячного отчёта', date: '2024-05-31', startTime: '18:00', endTime: '18:00', type: 'deadline', participants: ['e2'], color: '#dc2626' },
  { id: 'ev4', title: 'Обучение новых сотрудников', description: 'Вводный курс по системе документооборота', date: '2024-05-22', startTime: '09:00', endTime: '12:00', type: 'event', participants: ['e2', 'e8'], color: '#7c3aed', location: 'Конференц-зал' },
  { id: 'ev5', title: 'Согласование бюджета', description: 'Встреча с финансовым директором', date: '2024-05-23', startTime: '15:00', endTime: '16:00', type: 'meeting', participants: ['e1', 'e9'], color: '#4f46e5', location: 'Кабинет директора' },
  { id: 'ev6', title: 'Напоминание: подписать акты', description: 'Подписать акты выполненных работ за апрель', date: '2024-05-19', startTime: '09:00', endTime: '09:00', type: 'reminder', participants: ['e1'], color: '#f59e0b' },
];

const demoChatChannels: ChatChannel[] = [
  { id: 'ch1', name: 'Отдел документооборота', type: 'group', participants: ['e2', 'e3', 'e4'], lastMessage: 'Мария: Коллеги, не забудьте про договор!', lastMessageTime: '10:30', unreadCount: 3 },
  { id: 'ch2', name: 'IT команда', type: 'group', participants: ['e5', 'e6', 'e7'], lastMessage: 'Сергей: Релиз в пятницу', lastMessageTime: '09:15', unreadCount: 1 },
  { id: 'ch3', name: 'Дмитрий Петров', type: 'direct', participants: ['e3'], lastMessage: 'Привет! Как дела с архивом?', lastMessageTime: 'Вчера', unreadCount: 0 },
  { id: 'ch4', name: 'Общие объявления', type: 'channel', participants: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'], lastMessage: 'Ольга: Не забудьте заполнить анкеты', lastMessageTime: '08:00', unreadCount: 5 },
  { id: 'ch5', name: 'Бухгалтерия', type: 'group', participants: ['e9', 'e10'], lastMessage: 'Наталья: Счета проверены', lastMessageTime: '11:45', unreadCount: 2 },
];

const demoChatMessages: ChatMessage[] = [
  { id: 'm1', chatId: 'ch1', senderId: 'e2', senderName: 'Мария Иванова', text: 'Коллеги, доброе утро! Напоминаю про договор с ТехноПром.', timestamp: '2024-05-17T09:00:00', read: true },
  { id: 'm2', chatId: 'ch1', senderId: 'e3', senderName: 'Дмитрий Петров', text: 'Доброе утро! Уже работаю над ним, будет готово к обеду.', timestamp: '2024-05-17T09:05:00', read: true },
  { id: 'm3', chatId: 'ch1', senderId: 'e4', senderName: 'Елена Козлова', text: 'Я подготовила шаблоны, отправила на почту.', timestamp: '2024-05-17T09:15:00', read: true },
  { id: 'm4', chatId: 'ch1', senderId: 'e2', senderName: 'Мария Иванова', text: 'Отлично! Не забудьте про договор!', timestamp: '2024-05-17T10:30:00', read: false },
  { id: 'm5', chatId: 'ch2', senderId: 'e5', senderName: 'Сергей Волков', text: 'Команда, релиз модуля уведомлений запланирован на пятницу.', timestamp: '2024-05-17T08:00:00', read: true },
  { id: 'm6', chatId: 'ch2', senderId: 'e6', senderName: 'Анна Новикова', text: 'Фронтенд часть готова, жду ревью бэкенда.', timestamp: '2024-05-17T08:30:00', read: true },
  { id: 'm7', chatId: 'ch2', senderId: 'e7', senderName: 'Игорь Морозов', text: 'API готово, сегодня залью на стейджинг.', timestamp: '2024-05-17T09:15:00', read: true },
];

const demoDocuments: Document[] = [
  { id: 'doc1', name: 'Договоры', type: 'folder', uploadedBy: 'Мария Иванова', uploadedAt: '2024-01-15', shared: true, starred: true },
  { id: 'doc2', name: 'Счета-фактуры', type: 'folder', uploadedBy: 'Наталья Федорова', uploadedAt: '2024-01-10', shared: true, starred: false },
  { id: 'doc3', name: 'Акты выполненных работ', type: 'folder', uploadedBy: 'Елена Козлова', uploadedAt: '2024-02-01', shared: true, starred: true },
  { id: 'doc4', name: 'Договор_ТехноПром_2024.pdf', type: 'file', size: '2.4 MB', mimeType: 'pdf', uploadedBy: 'Елена Козлова', uploadedAt: '2024-05-01', parentId: 'doc1', shared: false, starred: true },
  { id: 'doc5', name: 'Шаблон_договора_поставки.docx', type: 'file', size: '340 KB', mimeType: 'docx', uploadedBy: 'Мария Иванова', uploadedAt: '2024-01-20', parentId: 'doc1', shared: true, starred: false },
  { id: 'doc6', name: 'Счёт-фактура №245.xlsx', type: 'file', size: '1.2 MB', mimeType: 'xlsx', uploadedBy: 'Наталья Федорова', uploadedAt: '2024-05-10', parentId: 'doc2', shared: false, starred: false },
  { id: 'doc7', name: 'Акт_выполненных_работ_апрель.pdf', type: 'file', size: '1.8 MB', mimeType: 'pdf', uploadedBy: 'Елена Козлова', uploadedAt: '2024-05-05', parentId: 'doc3', shared: true, starred: true },
  { id: 'doc8', name: 'Реестр_договоров_2024.xlsx', type: 'file', size: '3.1 MB', mimeType: 'xlsx', uploadedBy: 'Дмитрий Петров', uploadedAt: '2024-04-15', shared: true, starred: false },
  { id: 'doc9', name: 'Отчёт_по_документообороту_Q1.pdf', type: 'file', size: '5.6 MB', mimeType: 'pdf', uploadedBy: 'Мария Иванова', uploadedAt: '2024-04-20', shared: true, starred: false },
];

const demoWorkflowDocuments: WorkflowDocument[] = [
  {
    id: 'wd1',
    title: 'Договор поставки №125/2024',
    type: 'contract',
    status: 'pending_approval',
    description: 'Договор поставки оборудования с ООО "ТехноПром"',
    createdBy: 'e4',
    createdByName: 'Елена Козлова',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-15',
    dueDate: '2024-05-25',
    priority: 'high',
    content: 'Договор поставки оборудования между ООО "Компания" и ООО "ТехноПром"...',
    approvers: [
      { id: 'a1', employeeId: 'e2', employeeName: 'Мария Иванова', status: 'approved', comment: 'Согласовано', approvedAt: '2024-05-10', order: 1 },
      { id: 'a2', employeeId: 'e9', employeeName: 'Павел Лебедев', status: 'pending', order: 2 },
      { id: 'a3', employeeId: 'e1', employeeName: 'Алексей Смирнов', status: 'pending', order: 3 }
    ],
    currentApproverIndex: 1,
    comments: [
      { id: 'c1', authorId: 'e2', authorName: 'Мария Иванова', text: 'Проверила, всё корректно', createdAt: '2024-05-10T10:30:00' }
    ],
    attachments: ['doc4'],
    tags: ['Поставка', 'ТехноПром'],
    version: 2
  },
  {
    id: 'wd2',
    title: 'Счёт-фактура №245',
    type: 'invoice',
    status: 'approved',
    description: 'Счёт-фактура от поставщика ООО "СтройМастер"',
    createdBy: 'e10',
    createdByName: 'Наталья Федорова',
    createdAt: '2024-05-10',
    updatedAt: '2024-05-16',
    dueDate: '2024-05-20',
    priority: 'medium',
    content: 'Счёт-фактура на оплату услуг...',
    approvers: [
      { id: 'a4', employeeId: 'e9', employeeName: 'Павел Лебедев', status: 'approved', comment: 'Оплачено', approvedAt: '2024-05-16', order: 1 }
    ],
    currentApproverIndex: 1,
    comments: [],
    attachments: ['doc6'],
    tags: ['Оплата', 'СтройМастер'],
    version: 1
  },
  {
    id: 'wd3',
    title: 'Акт выполненных работ за апрель',
    type: 'act',
    status: 'signed',
    description: 'Акт выполненных работ по договору №98/2024',
    createdBy: 'e4',
    createdByName: 'Елена Козлова',
    createdAt: '2024-05-05',
    updatedAt: '2024-05-12',
    priority: 'medium',
    content: 'Акт выполненных работ...',
    approvers: [
      { id: 'a5', employeeId: 'e2', employeeName: 'Мария Иванова', status: 'approved', approvedAt: '2024-05-08', order: 1 },
      { id: 'a6', employeeId: 'e1', employeeName: 'Алексей Смирнов', status: 'approved', approvedAt: '2024-05-12', order: 2 }
    ],
    currentApproverIndex: 2,
    comments: [],
    attachments: ['doc7'],
    tags: ['Акт', 'Апрель'],
    version: 1
  },
  {
    id: 'wd4',
    title: 'Служебная записка: закупка оборудования',
    type: 'memo',
    status: 'draft',
    description: 'Запрос на закупку нового оборудования для офиса',
    createdBy: 'e5',
    createdByName: 'Сергей Волков',
    createdAt: '2024-05-14',
    updatedAt: '2024-05-14',
    dueDate: '2024-05-28',
    priority: 'low',
    content: 'Прошу рассмотреть возможность закупки...',
    approvers: [],
    currentApproverIndex: 0,
    comments: [],
    attachments: [],
    tags: ['Закупка', 'IT'],
    version: 1
  },
  {
    id: 'wd5',
    title: 'Заявка на командировку',
    type: 'request',
    status: 'rejected',
    description: 'Заявка на командировку в Санкт-Петербург',
    createdBy: 'e3',
    createdByName: 'Дмитрий Петров',
    createdAt: '2024-05-08',
    updatedAt: '2024-05-11',
    priority: 'medium',
    content: 'Прошу согласовать командировку...',
    approvers: [
      { id: 'a7', employeeId: 'e2', employeeName: 'Мария Иванова', status: 'approved', approvedAt: '2024-05-09', order: 1 },
      { id: 'a8', employeeId: 'e1', employeeName: 'Алексей Смирнов', status: 'rejected', comment: 'Перенести на июнь', approvedAt: '2024-05-11', order: 2 }
    ],
    currentApproverIndex: 2,
    comments: [
      { id: 'c2', authorId: 'e1', authorName: 'Алексей Смирнов', text: 'Прошу перенести на июнь из-за загруженности', createdAt: '2024-05-11T14:00:00' }
    ],
    attachments: [],
    tags: ['Командировка'],
    version: 1
  },
  {
    id: 'wd6',
    title: 'Отчёт по документообороту за май',
    type: 'report',
    status: 'pending_approval',
    description: 'Ежемесячный отчёт о движении документов',
    createdBy: 'e2',
    createdByName: 'Мария Иванова',
    createdAt: '2024-05-15',
    updatedAt: '2024-05-17',
    dueDate: '2024-05-22',
    priority: 'high',
    content: 'Отчёт о движении документов за май 2024...',
    approvers: [
      { id: 'a9', employeeId: 'e1', employeeName: 'Алексей Смирнов', status: 'pending', order: 1 }
    ],
    currentApproverIndex: 0,
    comments: [],
    attachments: ['doc9'],
    tags: ['Отчёт', 'Май'],
    version: 1
  }
];

const demoTemplates: DocumentTemplate[] = [
  { id: 'tpl1', name: 'Договор поставки', type: 'contract', description: 'Типовой договор поставки товаров', content: 'ДОГОВОР ПОСТАВКИ №___\n\nг. Москва\n\n"___" ______ 20__ г.', createdBy: 'e2', createdAt: '2024-01-15' },
  { id: 'tpl2', name: 'Акт выполненных работ', type: 'act', description: 'Акт сдачи-приёмки выполненных работ', content: 'АКТ\nвыполненных работ №___\n\nг. Москва\n\n"___" ______ 20__ г.', createdBy: 'e2', createdAt: '2024-01-20' },
  { id: 'tpl3', name: 'Служебная записка', type: 'memo', description: 'Типовая форма служебной записки', content: 'СЛУЖЕБНАЯ ЗАПИСКА\n\nКому: ___\nОт: ___\n\nТема: ___', createdBy: 'e2', createdAt: '2024-02-01' },
  { id: 'tpl4', name: 'Заявка на закупку', type: 'request', description: 'Заявка на закупку товаров/услуг', content: 'ЗАЯВКА НА ЗАКУПКУ №___\n\nДата: ___\nИнициатор: ___', createdBy: 'e9', createdAt: '2024-02-10' },
];

const demoActivity: ActivityItem[] = [
  { id: 'a1', type: 'document', description: 'создал документ "Договор поставки №125/2024"', userId: 'e4', userName: 'Елена Козлова', timestamp: '2024-05-17T10:30:00', entityType: 'workflow', entityId: 'wd1' },
  { id: 'a2', type: 'approval', description: 'согласовал документ "Счёт-фактура №245"', userId: 'e9', userName: 'Павел Лебедев', timestamp: '2024-05-16T15:00:00', entityType: 'workflow', entityId: 'wd2' },
  { id: 'a3', type: 'task', description: 'завершил задачу "Архивировать документы за Q1"', userId: 'e3', userName: 'Дмитрий Петров', timestamp: '2024-05-14T17:00:00', entityType: 'task', entityId: 't3' },
  { id: 'a4', type: 'comment', description: 'оставил комментарий к документу "Договор поставки"', userId: 'e2', userName: 'Мария Иванова', timestamp: '2024-05-10T10:30:00', entityType: 'workflow', entityId: 'wd1' },
  { id: 'a5', type: 'file', description: 'загрузил файл "Реестр_договоров_2024.xlsx"', userId: 'e3', userName: 'Дмитрий Петров', timestamp: '2024-05-08T14:00:00', entityType: 'document', entityId: 'doc8' },
  { id: 'a6', type: 'document', description: 'подписал документ "Акт выполненных работ за апрель"', userId: 'e1', userName: 'Алексей Смирнов', timestamp: '2024-05-12T16:00:00', entityType: 'workflow', entityId: 'wd3' },
  { id: 'a7', type: 'login', description: 'вошёл в систему', userId: 'e5', userName: 'Сергей Волков', timestamp: '2024-05-16T09:00:00' },
  { id: 'a8', type: 'task', description: 'завершил задачу "Подготовить отчёт по документообороту"', userId: 'e2', userName: 'Мария Иванова', timestamp: '2024-05-16T14:00:00', entityType: 'task', entityId: 't8' },
];

const demoNotifications: Notification[] = [
  { id: 'n1', title: 'Документ на согласование', message: '"Договор поставки №125/2024" ожидает вашего согласования', type: 'info', read: false, timestamp: '2024-05-17T10:00:00' },
  { id: 'n2', title: 'Документ согласован', message: '"Счёт-фактура №245" успешно согласован', type: 'success', read: false, timestamp: '2024-05-16T15:00:00' },
  { id: 'n3', title: 'Дедлайн завтра', message: 'Срок согласования "Договор поставки" — завтра', type: 'warning', read: false, timestamp: '2024-05-17T08:00:00' },
  { id: 'n4', title: 'Новый комментарий', message: 'Мария Иванова оставила комментарий к договору', type: 'info', read: true, timestamp: '2024-05-10T10:30:00' },
  { id: 'n5', title: 'Документ отклонён', message: '"Заявка на командировку" отклонена руководителем', type: 'error', read: true, timestamp: '2024-05-11T14:00:00' },
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
  getWorkflow: () => getFromStorage(STORAGE_KEYS.workflow, demoWorkflowDocuments),
  saveWorkflow: (v: WorkflowDocument[]) => saveToStorage(STORAGE_KEYS.workflow, v),
  getTemplates: () => getFromStorage(STORAGE_KEYS.templates, demoTemplates),
  saveTemplates: (v: DocumentTemplate[]) => saveToStorage(STORAGE_KEYS.templates, v),
  getActivity: () => getFromStorage(STORAGE_KEYS.activity, demoActivity),
  saveActivity: (v: ActivityItem[]) => saveToStorage(STORAGE_KEYS.activity, v),
  getNotifications: () => getFromStorage(STORAGE_KEYS.notifications, demoNotifications),
  saveNotifications: (v: Notification[]) => saveToStorage(STORAGE_KEYS.notifications, v),
};

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
