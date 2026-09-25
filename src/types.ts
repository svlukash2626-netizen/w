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

// ===== Documents (Disk) =====
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

// ===== Document Workflow (Документооборот) =====
export interface WorkflowDocument {
  id: string;
  title: string;
  type: WorkflowDocType;
  status: WorkflowStatus;
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  template?: string;
  content?: string;
  approvers: Approver[];
  currentApproverIndex: number;
  comments: WorkflowComment[];
  attachments: string[]; // document IDs
  tags: string[];
  version: number;
}

export type WorkflowDocType = 
  | 'contract' 
  | 'invoice' 
  | 'order' 
  | 'report' 
  | 'memo' 
  | 'request' 
  | 'act' 
  | 'other';

export type WorkflowStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'signed' 
  | 'archived';

export interface Approver {
  id: string;
  employeeId: string;
  employeeName: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  approvedAt?: string;
  order: number;
}

export interface WorkflowComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: WorkflowDocType;
  description: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

// ===== Activity =====
export interface ActivityItem {
  id: string;
  type: 'document' | 'task' | 'call' | 'email' | 'comment' | 'login' | 'approval' | 'file';
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
  | 'documents'
  | 'workflow'
  | 'tasks'
  | 'calendar'
  | 'chat'
  | 'employees'
  | 'disk'
  | 'activity';
