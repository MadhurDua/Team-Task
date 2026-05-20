export type Role = 'admin' | 'member';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  title?: string;
  skills?: string[];
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  color: string;
  owner: User;
  members: { user: User; role: string }[];
  activity?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  project: Project | string;
  assignee?: User;
  creator?: User;
  order: number;
  labels?: string[];
  activity?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  message: string;
  actor?: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; total: number; pages: number };
}
