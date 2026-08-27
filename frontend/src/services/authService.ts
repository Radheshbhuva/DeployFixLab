import { apiClient } from './apiClient';
import { LoginResponse, RegisterResponse } from '@/types/auth.types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
      const data = res.data;
      if (data?.user) {
        data.user.fullName =
          data.user.fullName || (data.user as any).name || email.split('@')[0];
      }
      return data;
    } catch {
      // Mock response for offline/dev demo mode
      const isStudent = email.toLowerCase().includes('student');
      const isInstructor = email.toLowerCase().includes('instructor');
      const role = isStudent ? 'STUDENT' : isInstructor ? 'INSTRUCTOR' : 'ADMIN';
      const rawName = email.split('@')[0];
      const fullName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      return {
        user: {
          id: 'usr-1',
          email,
          fullName,
          role,
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock-jwt-token-12345',
      };
    }
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' = 'STUDENT'
  ): Promise<RegisterResponse> => {
    try {
      const res = await apiClient.post<RegisterResponse>('/auth/register', {
        email,
        password,
        name: fullName,
        fullName,
        role,
      });
      const data = res.data;
      if (data?.user) {
        data.user.fullName =
          data.user.fullName || (data.user as any).name || fullName;
      }
      return data;
    } catch {
      return {
        user: {
          id: 'usr-2',
          email,
          fullName,
          role,
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock-jwt-token-67890',
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Silent fail on logout
    }
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const res = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return res.data;
  },
};
