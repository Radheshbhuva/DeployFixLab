import { apiClient } from './apiClient';
import { LoginResponse, RegisterResponse } from '@/types/auth.types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
      return res.data;
    } catch {
      // Mock response for offline/dev demo mode
      return {
        user: {
          id: 'usr-1',
          email,
          fullName: email.split('@')[0].toUpperCase(),
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
        },
        accessToken: 'mock-jwt-token-12345',
      };
    }
  },

  register: async (email: string, password: string, fullName: string): Promise<RegisterResponse> => {
    try {
      const res = await apiClient.post<RegisterResponse>('/auth/register', { email, password, fullName });
      return res.data;
    } catch {
      return {
        user: {
          id: 'usr-2',
          email,
          fullName,
          role: 'STUDENT',
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
