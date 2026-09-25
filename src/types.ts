// ===== CRM =====
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  createdAt: string;
  notes: string;
  avatar?: string;
  managerId?: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  amount: number;
  stage: DealStage;
  createdAt: string;
  expectedCloseDate: string;
  description: string;
  probability: number;
}

export type DealStage = 'new' | 'in_progress' | 'negotiation' | 'proposal' | 'closed_won' | 'closed_lost';

// ===== Tasks =====
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  creatorId: string;
  creatorName: string;
  projectId?: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export type TaskStatus = 'new' | 'in_progress' | 'review' | 'done';

// ===== Calendar =====
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'deadline' | 'event' | 'reminder';
  participants: string[];
  color: string;
  location?: string;
}

// ===== Chat =====
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachments?: { name: string; type: string; size: string }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// ===== Employees =====
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  managerId?: string;
  hireDate: string;
  skills: string[];
}

// ===== Documents =====
export interface Document {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  mimeType?: string;
  uploadedBy: string;
  uploadedAt: string;
  parentId?: string;
  shared: boolean;
  starred: boolean;
}

// ===== Activity =====
export interface ActivityItem {
  id: string;
  type: 'deal' | 'task' | 'call' | 'email' | 'comment' | 'login' | 'document';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
}

// ===== Notifications =====
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

export type Page =
  | 'dashboard'
  | 'crm'
  | 'tasks'
  | 'calendar'
  | 'chat'
  | 'employees'
  | 'documents'
  | 'activity'
  | 'analytics';
