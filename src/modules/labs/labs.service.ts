import prisma from '../../prisma';

export class LabsService {
  /**
   * Retrieves all lab scenarios with user session progress states.
   */
  public static async getLabs(userId: string) {
    return prisma.labScenario.findMany({
      include: {
        progress: {
          where: { userId },
        },
      },
      orderBy: { title: 'asc' },
    });
  }

  /**
   * Starts a lab scenario session by upserting progress to IN_PROGRESS.
   */
  public static async startLab(userId: string, labId: string) {
    // Verify lab scenario exists
    const scenario = await prisma.labScenario.findUnique({
      where: { id: labId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    return prisma.userLabProgress.upsert({
      where: {
        userId_labId: {
          userId,
          labId,
        },
      },
      create: {
        userId,
        labId,
        status: 'IN_PROGRESS',
      },
      update: {
        status: 'IN_PROGRESS',
        completedAt: null,
      },
    });
  }
}
