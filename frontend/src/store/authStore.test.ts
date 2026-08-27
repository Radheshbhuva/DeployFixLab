import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import { User } from '@/types/auth.types';

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
      fullName: 'Student Engineer',
      role: 'STUDENT',
    };

    useAuthStore.getState().setUser(mockUser, 'mock-jwt-token');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.fullName).toBe('Student Engineer');
    expect(state.user?.role).toBe('STUDENT');
    expect(state.accessToken).toBe('mock-jwt-token');
  });

  it('correctly validates role-based permissions', () => {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@deployfix.lab',
      fullName: 'Platform Commander',
      role: 'ADMIN',
    };

    useAuthStore.getState().setUser(adminUser, 'admin-token');
    const state = useAuthStore.getState();

    expect(state.hasRole(['ADMIN'])).toBe(true);
    expect(state.hasRole(['STUDENT'])).toBe(false);
    expect(state.canAccess({ roles: ['ADMIN', 'INSTRUCTOR'] })).toBe(true);
    expect(state.canAccess({ roles: ['STUDENT'] })).toBe(false);
  });

  it('clears auth upon sign out', () => {
    useAuthStore.getState().setUser(
      { id: '1', email: 'a@b.com', fullName: 'A B', role: 'STUDENT' },
      'tok'
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
