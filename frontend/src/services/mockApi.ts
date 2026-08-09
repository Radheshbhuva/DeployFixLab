import { User } from '@/store/authStore';
import { Task } from '@/store/taskStore';

export const mockAuthService = {
  async login(email: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 600));
    return {
      user: {
        id: 'usr-1',
        name: 'Alex Mercer',
        email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        createdAt: new Date().toISOString(),
      },
      token: `mock-jwt-${Date.now()}`,
    };
  },

  async register(name: string, email: string): Promise<{ user: User; token: string }> {
    await new Promise((res) => setTimeout(res, 600));
    return {
      user: {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name,
        email,
        role: 'USER',
        createdAt: new Date().toISOString(),
      },
      token: `mock-jwt-${Date.now()}`,
    };
  },
};

export const mockHealthService = {
  async getSystemStatus() {
    await new Promise((res) => setTimeout(res, 400));
    return {
      status: 'OPERATIONAL',
      uptimeSeconds: 84920,
      databaseConnected: true,
      activeContainers: 4,
      version: '1.0.0-phase1',
    };
  },
};
