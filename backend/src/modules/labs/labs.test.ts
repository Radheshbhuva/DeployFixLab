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
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      userLabProgress: {
        upsert: vi.fn(),
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

describe('Labs API Integration Tests', () => {
  const prismaMock = prisma as any;

  describe('GET /api/v1/labs', () => {
    it('should block unauthenticated requests', async () => {
      const res = await fetch(`${address}/api/v1/labs`);
      expect(res.status).toBe(401);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should return 200 catalog with scenarios list', async () => {
      const mockScenarios = [
        {
          id: 'scenario-uuid-1',
          code: 'LAB-001',
          title: 'Broken DB Credentials',
          category: 'DATABASE',
          difficulty: 'BEGINNER',
          description: 'Broken DB',
          progress: [],
        },
      ];

      vi.mocked(prismaMock.labScenario.findMany).mockResolvedValueOnce(mockScenarios);

      const res = await fetch(`${address}/api/v1/labs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.labs.length).toBe(1);
      expect(body.data.labs[0].title).toBe('Broken DB Credentials');
    });
  });

  describe('POST /api/v1/labs/:id/start', () => {
    it('should start lab session progress successfully', async () => {
      const mockScenario = { id: 'scenario-uuid-1', title: 'Broken DB Credentials' };
      const mockProgress = {
        id: 'progress-uuid-1',
        userId: 'mock-user-123',
        labId: 'scenario-uuid-1',
        status: 'IN_PROGRESS',
      };

      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValueOnce(mockScenario);
      vi.mocked(prismaMock.userLabProgress.upsert).mockResolvedValueOnce(mockProgress);

      const res = await fetch(`${address}/api/v1/labs/scenario-uuid-1/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.progress.status).toBe('IN_PROGRESS');
    });

    it('should return 404 if lab scenario does not exist', async () => {
      vi.mocked(prismaMock.labScenario.findUnique).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/labs/some-missing-uuid/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(404);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });
});
