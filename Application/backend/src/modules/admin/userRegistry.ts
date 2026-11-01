import { Role } from '../../types/rbac.types';

export interface InMemoryUserRecord {
  id: string;
  email: string;
  name: string;
  role: Role | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  passwordHash?: string;
  plainPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { tasks: number; labProgress: number };
}

class UserRegistryStore {
  private users: InMemoryUserRecord[] = [
    {
      id: 'usr-admin-demo',
      name: 'Platform Admin',
      email: 'admin@deployfix.lab',
      role: 'ADMIN',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      _count: { tasks: 5, labProgress: 3 },
    },
    {
      id: 'usr-admin-demo-dev',
      name: 'Platform Admin (Dev)',
      email: 'admin@deployfix.dev',
      role: 'ADMIN',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      _count: { tasks: 2, labProgress: 1 },
    },
    {
      id: 'usr-admin-demo-com',
      name: 'Platform Admin (Com)',
      email: 'admin@deployfix.com',
      role: 'ADMIN',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      _count: { tasks: 2, labProgress: 1 },
    },
    {
      id: 'usr-instructor-demo',
      name: 'DevOps/SRE Engineer',
      email: 'instructor@deployfix.lab',
      role: 'INSTRUCTOR',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-02T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      _count: { tasks: 4, labProgress: 2 },
    },
    {
      id: 'usr-instructor-demo-dev',
      name: 'DevOps/SRE Engineer (Dev)',
      email: 'instructor@deployfix.dev',
      role: 'INSTRUCTOR',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-02T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      _count: { tasks: 2, labProgress: 1 },
    },
    {
      id: 'usr-student-demo',
      name: 'Student Engineer',
      email: 'student@deployfix.lab',
      role: 'STUDENT',
      plainPassword: 'Password123!',
      createdAt: new Date('2026-01-03T00:00:00Z'),
      updatedAt: new Date('2026-01-03T00:00:00Z'),
      _count: { tasks: 1, labProgress: 1 },
    },
  ];

  public registerUser(user: {
    id: string;
    email: string;
    name: string;
    role: Role | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    passwordHash?: string;
    plainPassword?: string;
    createdAt?: Date;
  }): InMemoryUserRecord {
    return this.upsert(user);
  }

  public upsert(user: {
    id: string;
    email: string;
    name: string;
    role: Role | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    passwordHash?: string;
    plainPassword?: string;
    createdAt?: Date;
  }): InMemoryUserRecord {
    const normalizedEmail = user.email.toLowerCase().trim();
    const existingIndex = this.users.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    const record: InMemoryUserRecord = {
      id: user.id || `usr-${Date.now()}`,
      email: normalizedEmail,
      name: user.name,
      role: (user.role as Role) || 'STUDENT',
      passwordHash: user.passwordHash,
      plainPassword: user.plainPassword,
      createdAt: user.createdAt || new Date(),
      updatedAt: new Date(),
      _count: { tasks: 0, labProgress: 0 },
    };

    if (existingIndex >= 0) {
      const existing = this.users[existingIndex]!;
      const updatedUser: InMemoryUserRecord = {
        ...existing,
        ...record,
        updatedAt: new Date(),
      };
      this.users[existingIndex] = updatedUser;
      return updatedUser;
    } else {
      this.users.unshift(record);
      return record;
    }
  }

  public findByEmail(email: string): InMemoryUserRecord | undefined {
    const normalized = email.toLowerCase().trim();
    return this.users.find((u) => u.email.toLowerCase() === normalized);
  }

  public findById(id: string): InMemoryUserRecord | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getAll(): InMemoryUserRecord[] {
    return [...this.users];
  }

  public updateRole(id: string, newRole: Role | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'): boolean {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      user.role = newRole as Role;
      user.updatedAt = new Date();
      return true;
    }
    return false;
  }

  public getStats() {
    const totalUsers = this.users.length;
    const studentCount = this.users.filter((u) => u.role === 'STUDENT').length;
    const instructorCount = this.users.filter((u) => u.role === 'INSTRUCTOR').length;
    const adminCount = this.users.filter((u) => u.role === 'ADMIN').length;
    return {
      totalUsers,
      studentCount,
      instructorCount,
      adminCount,
    };
  }
}

export const UserRegistry = new UserRegistryStore();
