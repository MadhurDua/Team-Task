import { create } from 'zustand';
import { api, getData } from '../services/api';
import type { Project, Task, User } from '../lib/types';

interface DashboardData {
  stats: { totalTasks: number; completedTasks: number; pendingTasks: number; overdueTasks: number };
  productivity: { date: string; completed: number; touched: number }[];
  projects: Project[];
  team: User[];
  activity: Task[];
}

interface WorkspaceState {
  dashboard?: DashboardData;
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId?: string) => Promise<void>;
  createProject: (payload: Partial<Project>) => Promise<Project>;
  createTask: (payload: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, payload: Partial<Task>) => Promise<Task>;
  setTasks: (tasks: Task[]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  projects: [],
  tasks: [],
  loading: false,
  async fetchDashboard() {
    set({ loading: true });
    const dashboard = await getData<DashboardData>('/dashboard');
    set({ dashboard, loading: false });
  },
  async fetchProjects() {
    set({ loading: true });
    const projects = await getData<Project[]>('/projects');
    set({ projects, loading: false });
  },
  async fetchTasks(projectId) {
    set({ loading: true });
    const tasks = await getData<Task[]>(`/tasks${projectId ? `?project=${projectId}` : ''}`);
    set({ tasks, loading: false });
  },
  async createProject(payload) {
    const { data } = await api.post('/projects', payload);
    set({ projects: [data.data, ...get().projects] });
    return data.data;
  },
  async createTask(payload) {
    const { data } = await api.post('/tasks', payload);
    set({ tasks: [data.data, ...get().tasks] });
    return data.data;
  },
  async updateTask(id, payload) {
    const previous = get().tasks;
    set({ tasks: previous.map((task) => (task._id === id ? { ...task, ...payload } as Task : task)) });
    try {
      const { data } = await api.patch(`/tasks/${id}`, payload);
      set({ tasks: get().tasks.map((task) => (task._id === id ? data.data : task)) });
      return data.data;
    } catch (error) {
      set({ tasks: previous });
      throw error;
    }
  },
  setTasks(tasks) {
    set({ tasks });
  }
}));
