import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  statusFilter: 'ALL' | 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priorityFilter: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'ALL' | 'TODO' | 'IN_PROGRESS' | 'COMPLETED') => void;
  setPriorityFilter: (priority: 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH') => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const initialTasks: Task[] = [
  {
    id: 'tsk-101',
    title: 'Configure Nginx Reverse Proxy for Frontend Container',
    description: 'Setup static file caching rules and gzip compression in nginx.conf for production deployment.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-08-15',
    userId: 'usr-1',
    createdAt: '2026-08-08T09:00:00Z',
    updatedAt: '2026-08-09T10:00:00Z',
  },
  {
    id: 'tsk-102',
    title: 'Validate Prisma Schema Constraints & Supabase Connection',
    description: 'Ensure DATABASE_URL pooling strings correctly handle local Docker PostgreSQL and remote Supabase PostgreSQL.',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2026-08-10',
    userId: 'usr-1',
    createdAt: '2026-08-07T14:30:00Z',
    updatedAt: '2026-08-08T16:00:00Z',
  },
  {
    id: 'tsk-103',
    title: 'Implement Health Check Probes in Express API',
    description: 'Add /health, /ready, and /live JSON response endpoints to support Docker container liveness probes.',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-08-18',
    userId: 'usr-1',
    createdAt: '2026-08-09T11:00:00Z',
    updatedAt: '2026-08-09T11:00:00Z',
  },
  {
    id: 'tsk-104',
    title: 'Security Hardening: Non-Root Execution in Dockerfile',
    description: 'Update Node.js container Dockerfiles to enforce USER nodejs (UID 10001) and drop kernel capabilities.',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-08-20',
    userId: 'usr-1',
    createdAt: '2026-08-09T12:00:00Z',
    updatedAt: '2026-08-09T12:00:00Z',
  },
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  searchQuery: '',
  statusFilter: 'ALL',
  priorityFilter: 'ALL',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPriorityFilter: (priorityFilter) => set({ priorityFilter }),

  addTask: (newTaskData) =>
    set((state) => {
      const newTask: Task = {
        ...newTaskData,
        id: `tsk-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { tasks: [newTask, ...state.tasks] };
    }),

  updateTask: (id, updated) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updated, updatedAt: new Date().toISOString() }
          : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
