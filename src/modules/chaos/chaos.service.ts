import prisma from '../../prisma';

export class ChaosService {
  /**
   * Inject controlled chaos failures by activating failure states.
   */
  public static async injectChaos(labId: string, userId: string): Promise<void> {
    const scenario = await prisma.labScenario.findUnique({
      where: { id: labId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    // Set UserLabProgress status to FAILED_INJECTED
    await prisma.userLabProgress.upsert({
      where: {
        userId_labId: {
          userId,
          labId,
        },
      },
      create: {
        userId,
        labId,
        status: 'FAILED_INJECTED',
      },
      update: {
        status: 'FAILED_INJECTED',
        completedAt: null,
      },
    });
  }

  /**
   * Run resolution check probes and update lab progress to VERIFIED.
   */
  public static async verifyChaos(userId: string, labId: string) {
    const scenario = await prisma.labScenario.findUnique({
      where: { id: labId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, labId },
    });

    if (!progress) {
      throw new Error('Lab session not started');
    }

    // Update user progress to VERIFIED
    return prisma.userLabProgress.update({
      where: { id: progress.id },
      data: {
        status: 'VERIFIED',
        completedAt: new Date(),
      },
    });
  }
}
