import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { User } from '@/types/auth.types';
import { authService } from '@/services/authService';

vi.mock('@/services/apiClient', () => ({
  apiClient: {
    post: vi.fn().mockRejectedValue(new Error('Offline fallback')),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it('initializes with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('normalizes full name and sets user correctly', () => {
    const mockUser: User = {
      id: 'usr-123',
      email: 'student@deployfix.lab',
      fullName: 'Student',
      role: 'STUDENT',
    };

    useAuthStore.getState().setUser(mockUser, 'mock-jwt-token');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.fullName).toBe('Student');
    expect(state.user?.role).toBe('STUDENT');
    expect(state.accessToken).toBe('mock-jwt-token');
  });

  it('correctly validates role-based permissions', () => {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@deployfix.lab',
      fullName: 'Platform Admin',
      role: 'ADMIN',
    };

    useAuthStore.getState().setUser(adminUser, 'admin-token');
    const state = useAuthStore.getState();

    expect(state.hasRole(['ADMIN'])).toBe(true);
    expect(state.hasRole(['STUDENT'])).toBe(false);
    expect(state.canAccess({ roles: ['ADMIN', 'INSTRUCTOR'] })).toBe(true);
    expect(state.canAccess({ roles: ['STUDENT'] })).toBe(false);
  });

  it('authenticates via social login (Google, GitHub, Gmail) and sets role properly', async () => {
    // Google login
    const googleRes = await authService.socialLogin('google', 'STUDENT');
    expect(googleRes.user.email).toContain('gmail.com');
    expect(googleRes.user.role).toBe('STUDENT');
    expect(googleRes.accessToken).toBeTruthy();

    // GitHub login as ADMIN
    const githubRes = await authService.socialLogin('github', 'ADMIN');
    expect(githubRes.user.email).toContain('github.com');
    expect(githubRes.user.role).toBe('ADMIN');

    // Gmail login as INSTRUCTOR (DevOps/SRE)
    const gmailRes = await authService.socialLogin('gmail', 'INSTRUCTOR');
    expect(gmailRes.user.email).toContain('gmail.com');
    expect(gmailRes.user.role).toBe('INSTRUCTOR');
  });
});
