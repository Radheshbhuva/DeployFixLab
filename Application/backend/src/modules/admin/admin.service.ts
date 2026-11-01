import prisma from '../../prisma';
import { Role } from '../../types/rbac.types';
import { AuditService } from '../audit/audit.service';
import { ListUsersQueryInput } from './admin.schema';
import { UserRegistry, InMemoryUserRecord } from './userRegistry';

export class AdminService {
  /**
   * Retrieves paginated list of users with search and role filters.
   * Merges database users with live registered users so new accounts appear immediately.
   */
  public static async listUsers(query: ListUsersQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let users: any[];
    let total: number;

    try {
      [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                tasks: true,
                labProgress: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      // Merge newly registered users from live in-memory registry
      const registeredInMemory = UserRegistry.getAll();
      for (const memUser of registeredInMemory) {
        if (!users.some((u) => u.email.toLowerCase() === memUser.email.toLowerCase())) {
          if (!query.role || memUser.role === query.role) {
            if (
              !query.search ||
              memUser.name.toLowerCase().includes(query.search.toLowerCase()) ||
              memUser.email.toLowerCase().includes(query.search.toLowerCase())
            ) {
              users.unshift(memUser);
              total++;
            }
          }
        }
      }
    } catch {
      // Database offline: serve directly from UserRegistry (includes all registered users)
      let filtered: InMemoryUserRecord[] = UserRegistry.getAll();
      if (query.role) {
        filtered = filtered.filter((u: InMemoryUserRecord) => u.role === query.role);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (u: InMemoryUserRecord) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
        );
      }
      total = filtered.length;
      users = filtered.slice(skip, skip + limit);
    }

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Promotes, demotes, or alters a user's role.
   */
  public static async updateUserRole(adminUserId: string, targetUserId: string, newRole: Role) {
    // Protect against self-demotion lockout
    if (adminUserId === targetUserId && newRole !== 'ADMIN') {
      throw new Error('Self-demotion is prevented to avoid administrative lockout');
    }

    // Always update in UserRegistry first
    UserRegistry.updateRole(targetUserId, newRole);

    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        const memUser = UserRegistry.findById(targetUserId);
        if (memUser) {
          return memUser;
        }
        throw new Error('User not found');
      }

      const oldRole = targetUser.role;

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole as any },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await AuditService.log(adminUserId, 'USER_ROLE_UPDATED', 'USER', {
        targetUserId,
        targetUserEmail: targetUser.email,
        oldRole,
        newRole,
      });

      return updatedUser;
    } catch (err: any) {
      if (err.message === 'User not found' || err.message?.includes('Self-demotion')) {
        throw err;
      }
      // Offline fallback: return updated user from UserRegistry
      const memUser = UserRegistry.findById(targetUserId);
      if (memUser) {
        return memUser;
      }
      throw new Error('User not found');
    }
  }

  /**
   * Retrieves summary statistics of users across roles.
   */
  public static async getUserStats() {
    try {
      const [totalUsers, studentCount, instructorCount, adminCount] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
      ]);

      const memStats = UserRegistry.getStats();
      if (totalUsers > 0) {
        return {
          totalUsers: Math.max(totalUsers, memStats.totalUsers),
          studentCount: Math.max(studentCount, memStats.studentCount),
          instructorCount: Math.max(instructorCount, memStats.instructorCount),
          adminCount: Math.max(adminCount, memStats.adminCount),
        };
      }
      return memStats;
    } catch {
      return UserRegistry.getStats();
    }
  }
}
