import prisma from '../../prisma';

export class DashboardService {
  /**
   * Aggregates stats, recent tasks, user profile, and system status.
   */
  public static async getDashboardData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Query task counts by status
    const [total, todo, inProgress, done] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'TODO' } }),
      prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { userId, status: 'DONE' } }),
    ]);

    // Query last 5 updated tasks
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        updatedAt: true,
      },
    });

    // Check database status
    let databaseStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = 'unhealthy';
    }

    return {
      user,
      stats: {
        total,
        todo,
        inProgress,
        done,
      },
      recentTasks,
      system: {
        database: databaseStatus,
        uptime: process.uptime(),
      },
    };
  }
}
