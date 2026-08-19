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
        upsert: vi.fn(),
      },
    },
  };
});

let server: Server;
let address = '';
let studentToken = '';
let adminToken = '';

beforeAll(async () => {
  studentToken = jwt.sign(
    { id: 'student-123', email: 'student@example.com', role: 'STUDENT' },
    JWT_SECRET
  );
  adminToken = jwt.sign({ id: 'admin-123', email: 'admin@example.com', role: 'ADMIN' }, JWT_SECRET);

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

describe('Chaos Engine API Integration Tests', () => {
  const prismaMock = prisma as any;

  describe('POST /api/v1/chaos/inject', () => {
    it('should block unauthenticated requests', async () => {
      const res = await fetch(`${address}/api/v1/chaos/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: 'scenario-uuid-1' }),
      });

      expect(res.status).toBe(401);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should block STUDENT role access with 403', async () => {
      const res = await fetch(`${address}/api/v1/chaos/inject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ scenarioId: 'scenario-uuid-1' }),
      });

      expect(res.status).toBe(403);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('FORBIDDEN_INSUFFICIENT_ROLE');
    });

    it('should allow ADMIN role to inject chaos successfully', async () => {
      const mockScenario = { id: 'scenario-uuid-1', title: 'Broken DB Credentials' };
      const mockProgress = {
        id: 'progress-uuid-1',
        userId: 'student-123',
        labId: 'scenario-uuid-1',
        status: 'FAILED_INJECTED',
      };

      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValueOnce(mockScenario);
      vi.mocked(prismaMock.userLabProgress.upsert).mockResolvedValueOnce(mockProgress);

      const res = await fetch(`${address}/api/v1/chaos/inject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ scenarioId: 'scenario-uuid-1', userId: 'student-123' }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
    });
  });

  describe('POST /api/v1/chaos/verify', () => {
    it('should verify resolution successfully and update progress', async () => {
      const mockScenario = { id: 'scenario-uuid-1', title: 'Broken DB Credentials' };
      const mockProgress = {
        id: 'progress-uuid-1',
        userId: 'student-123',
        labId: 'scenario-uuid-1',
        status: 'FAILED_INJECTED',
      };
      const resolvedProgress = {
        ...mockProgress,
        status: 'VERIFIED',
        completedAt: new Date(),
      };

      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValueOnce(mockScenario);
      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(mockProgress);
      vi.mocked(prismaMock.userLabProgress.update).mockResolvedValueOnce(resolvedProgress);

      const res = await fetch(`${address}/api/v1/chaos/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ scenarioId: 'scenario-uuid-1' }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.progress.status).toBe('VERIFIED');
    });
  });
});
