import prisma from '../../prisma';
import { Role } from '../../types/rbac.types';
import { AuditService } from '../audit/audit.service';
import { ListUsersQueryInput } from './admin.schema';

export class AdminService {
  /**
   * Retrieves paginated list of users with search and role filters.
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

    const [users, total] = await Promise.all([
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
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('User not found');
    }

    // Protect against self-demotion lockout
    if (adminUserId === targetUserId && newRole !== 'ADMIN') {
      throw new Error('Self-demotion is prevented to avoid administrative lockout');
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
  }

  /**
   * Retrieves summary statistics of users across roles.
   */
  public static async getUserStats() {
    const [totalUsers, studentCount, instructorCount, adminCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    return {
      totalUsers,
      studentCount,
      instructorCount,
      adminCount,
    };
  }
}
