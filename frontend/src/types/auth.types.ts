export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

