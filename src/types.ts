export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  createdAt: string;
  notes: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  amount: number;
  stage: 'lead' | 'negotiation' | 'proposal' | 'closed_won' | 'closed_lost';
  createdAt: string;
  expectedCloseDate: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  assignedTo: string;
  relatedDealId?: string;
  createdAt: string;
}

export type Page = 'dashboard' | 'clients' | 'deals' | 'tasks';
