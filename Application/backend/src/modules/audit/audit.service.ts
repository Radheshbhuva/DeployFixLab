import prisma from '../../prisma';

export class AuditService {
  /**
   * Records a user action in the audit logs.
   */
  public static async log(userId: string | null, action: string, resource: string, details?: any) {
    try {
      if (!prisma.auditLog) {
        return null;
      }
      return await prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          details: details || {},
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      return null;
    }
  }

  /**
   * Retrieves all audit logs ordered by creation timestamp descending.
   */
  public static async getLogs() {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves personal audit logs for a specific user.
   */
  public static async getPersonalLogs(userId: string) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
