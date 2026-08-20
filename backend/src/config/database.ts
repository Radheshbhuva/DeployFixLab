import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client — reused across all modules
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

/**
 * Verifies database connectivity by running a simple SELECT 1 probe.
 * Used by the /health endpoint to report database liveness.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.error('[Database] Health check failed:', err);
    return false;
  }
}

/**
 * Gracefully disconnect the Prisma client.
 * Called during SIGTERM / SIGINT shutdown handlers.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('[Database] Prisma connection pool closed.');
}
