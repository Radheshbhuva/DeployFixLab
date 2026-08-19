import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import app from '../../app';
import prisma from '../../prisma';

const JWT_SECRET =
  process.env.JWT_SECRET || 'deployfix_lab_dev_jwt_secret_change_in_production_32bytes';

// Mock the prisma client globally for this test
vi.mock('../../prisma', () => {
  return {
    default: {
      labScenario: {
        findUnique: vi.fn(),
      },
      userLabProgress: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

let server: Server;
let address = '';
let authToken = '';

beforeAll(async () => {
  authToken = jwt.sign(
    { id: 'mock-user-123', email: 'jane@example.com', role: 'STUDENT' },
    JWT_SECRET
  );

  return new Promise<void>((resolve) => {
    // Port 0 tells the OS to listen on a random available port
    server = app.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        address = `http://localhost:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  return new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

describe('Recovery API Integration Tests', () => {
  const prismaMock = prisma as any;

  describe('GET /api/v1/recovery/guide', () => {
    it('should block unauthenticated guide requests', async () => {
      const res = await fetch(`${address}/api/v1/recovery/guide`);
      expect(res.status).toBe(401);
    });

    it('should return recovery guide plan successfully', async () => {
      const mockProgress = {
        id: 'progress-uuid-1',
        labId: 'scenario-uuid-1',
        status: 'FAILED_INJECTED',
      };
      const mockScenario = {
        id: 'scenario-uuid-1',
        code: 'LAB-001',
        title: 'Broken DB Credentials',
      };

      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(mockProgress);
      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValueOnce(mockScenario);

      const res = await fetch(`${address}/api/v1/recovery/guide`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.guide.steps.length).toBe(3);
      expect(body.data.guide.steps[0].action).toContain('DATABASE_URL');
    });
  });

  describe('POST /api/v1/recovery/execute', () => {
    it('should block unauthenticated execution requests', async () => {
      const res = await fetch(`${address}/api/v1/recovery/execute`, {
        method: 'POST',
      });
      expect(res.status).toBe(401);
    });

    it('should handle payload validation errors', async () => {
      const res = await fetch(`${address}/api/v1/recovery/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ labId: 'some-id' }), // missing stepOrder
      });

      expect(res.status).toBe(400);
    });

    it('should track step executions and mark progress VERIFIED when all completed', async () => {
      const mockScenario = {
        id: 'scenario-uuid-1',
        code: 'LAB-001',
        title: 'Broken DB Credentials',
      };
      const mockProgress = {
        id: 'progress-uuid-1',
        userId: 'mock-user-123',
        labId: 'scenario-uuid-1',
        status: 'FAILED_INJECTED',
      };

      // Mock prisma lookups for steps 1, 2, and 3
      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValue(mockScenario);
      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValue(mockProgress);

      // Execute Step 1
      const res1 = await fetch(`${address}/api/v1/recovery/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ labId: 'scenario-uuid-1', stepOrder: 1 }),
      });
      expect(res1.status).toBe(200);
      const body1 = (await res1.json()) as any;
      expect(body1.data.resolved).toBe(false);
      expect(body1.data.executedSteps).toContain(1);

      // Execute Step 2
      const res2 = await fetch(`${address}/api/v1/recovery/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ labId: 'scenario-uuid-1', stepOrder: 2 }),
      });
      expect(res2.status).toBe(200);
      const body2 = (await res2.json()) as any;
      expect(body2.data.resolved).toBe(false);
      expect(body2.data.executedSteps).toContain(2);

      // Mock the final status update
      const updatedProgress = { ...mockProgress, status: 'VERIFIED', completedAt: new Date() };
      vi.mocked(prismaMock.userLabProgress.update).mockResolvedValueOnce(updatedProgress);

      // Execute Step 3 (The final step)
      const res3 = await fetch(`${address}/api/v1/recovery/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ labId: 'scenario-uuid-1', stepOrder: 3 }),
      });
      expect(res3.status).toBe(200);
      const body3 = (await res3.json()) as any;
      expect(body3.data.resolved).toBe(true);
      expect(body3.data.progress.status).toBe('VERIFIED');
    });
  });
});
