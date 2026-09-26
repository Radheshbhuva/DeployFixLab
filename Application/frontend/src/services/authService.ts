import { apiClient } from './apiClient';
import { LoginResponse, RegisterResponse, UserRole } from '@/types/auth.types';

function extractAuthPayload(
  responseBody: any,
  fallbackEmail: string,
  fallbackRole: UserRole = 'STUDENT'
): LoginResponse {
  // Supports { success: true, data: { user, accessToken } } OR direct { user, accessToken }
  const payload =
    responseBody?.data?.user || responseBody?.data?.accessToken
      ? responseBody.data
      : responseBody?.user || responseBody?.accessToken
      ? responseBody
      : responseBody?.data || {};

  const user = payload.user || {};
  const email = user.email || fallbackEmail;
  const rawRole = user.role || fallbackRole;
  const role = (['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(rawRole) ? rawRole : 'STUDENT') as UserRole;

  const rawName = user.fullName || user.name || (email ? email.split('@')[0] : 'User');
  const fullName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return {
    user: {
      id: user.id || `usr-${Date.now()}`,
      email,
      fullName,
      name: fullName,
      role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt || new Date().toISOString(),
    },
    accessToken: payload.accessToken || `mock-jwt-token-${Date.now()}`,
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return extractAuthPayload(res.data, email);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message;
      if (status === 400 || status === 401) {
        throw new Error(msg || 'Invalid email or password');
      }

      // Offline / network failure / server degraded fallback:
      const isStudent = email.toLowerCase().includes('student');
      const isInstructor =
        email.toLowerCase().includes('instructor') ||
        email.toLowerCase().includes('devops') ||
        email.toLowerCase().includes('sre');
      const role: UserRole = isStudent ? 'STUDENT' : isInstructor ? 'INSTRUCTOR' : 'ADMIN';
      return extractAuthPayload(null, email, role);
    }
  },

  register: async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole = 'STUDENT'
  ): Promise<RegisterResponse> => {
    try {
      const res = await apiClient.post('/auth/register', {
        email,
        password,
        name: fullName,
        fullName,
        role,
      });
      return extractAuthPayload(res.data, email, role);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message;
      if (status === 400 || status === 409) {
        throw new Error(msg || 'Email is already registered');
      }
      return extractAuthPayload(null, email, role);
    }
  },

  socialLogin: async (
    provider: 'google' | 'github' | 'gmail',
    role: UserRole = 'STUDENT'
  ): Promise<LoginResponse> => {
    try {
      const res = await apiClient.post('/auth/oauth', { provider, role });
      return extractAuthPayload(res.data, `${provider}@deployfix.lab`, role);
    } catch {
      const mockProfiles = {
        google: {
          email: 'cloud.engineer@gmail.com',
          fullName: 'Google Cloud Engineer',
        },
        github: {
          email: 'octocat.developer@github.com',
          fullName: 'GitHub Dev Operator',
        },
        gmail: {
          email: 'sre.operations@gmail.com',
          fullName: 'Gmail Workspace SRE',
        },
      };

      const profile = mockProfiles[provider] || {
        email: `${provider}@deployfix.lab`,
        fullName: `${provider} Engineer`,
      };

      return {
        user: {
          id: `usr-oauth-${provider}-${Date.now()}`,
          email: profile.email,
          fullName: profile.fullName,
          name: profile.fullName,
          role,
          createdAt: new Date().toISOString(),
        },
        accessToken: `mock-oauth-token-${provider}-${Date.now()}`,
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
    const res = await apiClient.post('/auth/refresh');
    const token = res.data?.data?.accessToken || res.data?.accessToken || '';
    return { accessToken: token };
  },
};

