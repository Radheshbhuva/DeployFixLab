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
      user: {
        findUnique: vi.fn(),
      },
      task: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      $queryRaw: vi.fn(),
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

describe('Dashboard API Integration Tests', () => {
  const prismaMock = prisma as any;

  it('should block unauthenticated requests', async () => {
    const res = await fetch(`${address}/api/v1/dashboard`);
    expect(res.status).toBe(401);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
  });

  it('should return 200 and return aggregated dashboard stats', async () => {
    const mockUser = {
      id: 'mock-user-123',
      name: 'Jane Student',
      email: 'jane@example.com',
      role: 'STUDENT',
    };

    const mockTasks = [
      {
        id: 'task-uuid-1',
        title: 'Learn Dockerize',
        status: 'TODO',
        priority: 'HIGH',
        updatedAt: new Date(),
      },
    ];

    vi.mocked(prismaMock.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(prismaMock.task.count)
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3) // todo
      .mockResolvedValueOnce(5) // in progress
      .mockResolvedValueOnce(2); // done

    vi.mocked(prismaMock.task.findMany).mockResolvedValueOnce(mockTasks);
    vi.mocked(prismaMock.$queryRaw).mockResolvedValueOnce([1]); // healthy database mock

    const res = await fetch(`${address}/api/v1/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.user.id).toBe(mockUser.id);
    expect(body.data.stats.total).toBe(10);
    expect(body.data.stats.todo).toBe(3);
    expect(body.data.stats.inProgress).toBe(5);
    expect(body.data.stats.done).toBe(2);
    expect(body.data.recentTasks.length).toBe(1);
    expect(body.data.recentTasks[0].title).toBe('Learn Dockerize');
    expect(body.data.system.database).toBe('healthy');
    expect(body.data.system.uptime).toBeTypeOf('number');
  });
});
