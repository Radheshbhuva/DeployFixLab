import { apiClient } from './apiClient';
import { UserRole } from '@/types/rbac.types';

export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
    labProgress: number;
  };
}

export interface ListUsersResponse {
  users: AdminUserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStatsResponse {
  totalUsers: number;
  studentCount: number;
  instructorCount: number;
  adminCount: number;
}

export const adminService = {
  /**
   * Fetches paginated user list with optional search and role filtering.
   */
  async listUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
  }): Promise<ListUsersResponse> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data.data;
  },

  /**
   * Updates a user's role.
   */
  async updateUserRole(userId: string, role: UserRole): Promise<AdminUserListItem> {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data.data.user;
  },

  /**
   * Retrieves summary statistics of all registered roles.
   */
  async getUserStats(): Promise<UserStatsResponse> {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },
};
