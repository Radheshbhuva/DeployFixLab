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
      task: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
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

describe('Task CRUD API Integration Tests', () => {
  const prismaMock = prisma as any;

  describe('POST /api/v1/tasks', () => {
    it('should block requests without Bearer tokens', async () => {
      const res = await fetch(`${address}/api/v1/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Task' }),
      });

      expect(res.status).toBe(401);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should create a task successfully with valid token', async () => {
      const mockTask = {
        id: 'mock-task-uuid-1',
        userId: 'mock-user-123',
        title: 'Learn Docker',
        description: 'Read the orchestration guidelines',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prismaMock.task.create).mockResolvedValueOnce(mockTask);

      const res = await fetch(`${address}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Learn Docker',
          description: 'Read the orchestration guidelines',
        }),
      });

      expect(res.status).toBe(201);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.task.id).toBe(mockTask.id);
      expect(body.data.task.title).toBe(mockTask.title);
    });

    it('should fail with 400 if title is empty', async () => {
      const res = await fetch(`${address}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: '',
        }),
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_INPUT_VALIDATION');
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should list tasks with pagination meta', async () => {
      const mockTasks = [
        {
          id: 'mock-task-uuid-1',
          userId: 'mock-user-123',
          title: 'Learn Docker',
          description: 'Read guidelines',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: null,
          createdAt: new Date(),
        },
      ];

      vi.mocked(prismaMock.task.findMany).mockResolvedValueOnce(mockTasks);
      vi.mocked(prismaMock.task.count).mockResolvedValueOnce(1);

      const res = await fetch(`${address}/api/v1/tasks?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.tasks.length).toBe(1);
      expect(body.meta.page).toBe(1);
      expect(body.meta.limit).toBe(5);
      expect(body.meta.totalCount).toBe(1);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return task details if found', async () => {
      const mockTask = {
        id: 'mock-task-uuid-1',
        userId: 'mock-user-123',
        title: 'Learn Docker',
        status: 'TODO',
      };

      vi.mocked(prismaMock.task.findFirst).mockResolvedValueOnce(mockTask);

      const res = await fetch(`${address}/api/v1/tasks/mock-task-uuid-1`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.task.id).toBe(mockTask.id);
    });

    it('should return 404 if task is not found', async () => {
      vi.mocked(prismaMock.task.findFirst).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/tasks/some-random-id`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(404);
      const body = (await res.json()) as any;
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update task successfully if owned by user', async () => {
      const mockTask = { id: 'mock-task-uuid-1', userId: 'mock-user-123', title: 'Old Title' };
      const updatedMockTask = { ...mockTask, title: 'Updated Title' };

      vi.mocked(prismaMock.task.findFirst).mockResolvedValueOnce(mockTask);
      vi.mocked(prismaMock.task.update).mockResolvedValueOnce(updatedMockTask);

      const res = await fetch(`${address}/api/v1/tasks/mock-task-uuid-1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.task.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete task successfully if owned by user', async () => {
      const mockTask = { id: 'mock-task-uuid-1', userId: 'mock-user-123' };

      vi.mocked(prismaMock.task.findFirst).mockResolvedValueOnce(mockTask);
      vi.mocked(prismaMock.task.delete).mockResolvedValueOnce(mockTask);

      const res = await fetch(`${address}/api/v1/tasks/mock-task-uuid-1`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data).toBeNull();
    });
  });
});
