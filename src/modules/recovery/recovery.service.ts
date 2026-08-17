import prisma from '../../prisma';
import { generateStep } from '../../../ai/recovery/recovery-step-generator';
import { createRecoveryPlan } from '../../../ai/recovery/recovery-planner';
import { RecoveryPlan } from '../../../ai/recovery/recovery-schema';

// Global memory map to track student's completed recovery steps: `${userId}_${labId}` -> Set of orders
const executedStepsMap = new Map<string, Set<number>>();

export class RecoveryService {
  /**
   * Generates step array based on lab code using generateStep helper.
   */
  private static getStepsForCode(code: string) {
    if (code === 'LAB-001') {
      return [
        generateStep(
          1,
          'Update DATABASE_URL password in the environment file to postgres_secure_pass',
          'nano .env',
          '.env'
        ),
        generateStep(
          2,
          'Restart the backend application server container',
          'docker restart backend-api'
        ),
        generateStep(
          3,
          'Verify connection health status by calling the liveness probe',
          'curl http://localhost:4000/api/v1/health/liveness'
        ),
      ];
    }

    if (code === 'LAB-003') {
      return [
        generateStep(
          1,
          'Modify nginx.conf target proxy upstream port from 4000 to 5000',
          'nano nginx.conf',
          'nginx.conf'
        ),
        generateStep(
          2,
          'Restart the nginx-proxy gateway container to reload configuration rules',
          'docker restart nginx-proxy'
        ),
        generateStep(
          3,
          'Verify connection routing by requesting tasks endpoint via port 80',
          'curl http://localhost/api/v1/tasks'
        ),
      ];
    }

    if (code === 'LAB-004') {
      return [
        generateStep(
          1,
          'Inspect docker compose configurations and double backend memory_limit properties',
          'nano docker-compose.yml',
          'docker-compose.yml'
        ),
        generateStep(
          2,
          'Recreate and launch backend containers',
          'docker-compose up -d --force-recreate backend-api'
        ),
        generateStep(3, 'Verify container is running stably without crashes', 'docker ps -a'),
      ];
    }

    return [generateStep(1, 'No active recovery steps needed')];
  }

  /**
   * Generates a recovery plan guide.
   */
  public static async getRecoveryGuide(userId: string, labId?: string): Promise<RecoveryPlan> {
    let activeLabId = labId;

    if (!activeLabId) {
      const progress = await prisma.userLabProgress.findFirst({
        where: { userId, status: 'FAILED_INJECTED' },
      });
      if (!progress) {
        throw new Error('No active failed lab scenario session found');
      }
      activeLabId = progress.labId;
    }

    const lab = await prisma.labScenario.findUnique({
      where: { id: activeLabId },
    });

    if (!lab) {
      throw new Error('Lab scenario not found');
    }

    const rawSteps = this.getStepsForCode(lab.code);
    const stepsStringArray = rawSteps.map((s) => s.action);

    // Creates dynamic schema output
    const plan = await createRecoveryPlan(lab.id, stepsStringArray);

    // Map properties from generateStep back into the plan steps
    plan.steps = plan.steps.map((step, idx) => {
      const origin = rawSteps[idx];
      return {
        ...step,
        command: origin?.command,
        targetFile: origin?.targetFile,
      };
    });

    return plan;
  }

  /**
   * Tracks step execution, transitioning status to VERIFIED when all steps are completed.
   */
  public static async executeRecoveryStep(userId: string, labId: string, stepOrder: number) {
    const lab = await prisma.labScenario.findUnique({
      where: { id: labId },
    });

    if (!lab) {
      throw new Error('Lab scenario not found');
    }

    const progress = await prisma.userLabProgress.findFirst({
      where: { userId, labId },
    });

    if (!progress) {
      throw new Error('Lab progress session not started');
    }

    const rawSteps = this.getStepsForCode(lab.code);
    const stepCount = rawSteps.length;

    const matchedStep = rawSteps.find((s) => s.order === stepOrder);
    if (!matchedStep) {
      throw new Error(`Invalid stepOrder: step ${stepOrder} does not exist in this recovery guide`);
    }

    const trackingKey = `${userId}_${labId}`;
    let executed = executedStepsMap.get(trackingKey);
    if (!executed) {
      executed = new Set<number>();
      executedStepsMap.set(trackingKey, executed);
    }

    executed.add(stepOrder);

    const isAllExecuted = executed.size === stepCount;

    if (isAllExecuted) {
      executedStepsMap.delete(trackingKey);

      // Transition progress status to VERIFIED
      const updatedProgress = await prisma.userLabProgress.update({
        where: { id: progress.id },
        data: {
          status: 'VERIFIED',
          completedAt: new Date(),
        },
      });

      return {
        resolved: true,
        message: 'All recovery steps executed successfully. Lab resolved!',
        executedSteps: Array.from(executed),
        progress: updatedProgress,
      };
    }

    return {
      resolved: false,
      message: `Step ${stepOrder} executed successfully.`,
      executedSteps: Array.from(executed),
      progress,
    };
  }
}
