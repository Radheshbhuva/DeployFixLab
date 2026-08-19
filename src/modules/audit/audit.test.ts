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
      auditLog: {
        findMany: vi.fn(),
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

describe('Audit API Integration Tests', () => {
  const prismaMock = prisma as any;

  it('should block unauthenticated requests', async () => {
    const res = await fetch(`${address}/api/v1/audit`);
    expect(res.status).toBe(401);
  });

  it('should block STUDENT role with 403', async () => {
    const res = await fetch(`${address}/api/v1/audit`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect(res.status).toBe(403);
    const body = (await res.json()) as any;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('FORBIDDEN_INSUFFICIENT_ROLE');
  });

  it('should allow ADMIN role to retrieve all audit logs', async () => {
    const mockLogs = [
      {
        id: 'audit-uuid-1',
        userId: 'student-123',
        action: 'START_LAB',
        resource: 'LAB_SCENARIO',
        details: { labId: 'lab-id-1' },
        createdAt: new Date().toISOString(),
        user: {
          id: 'student-123',
          name: 'Student 1',
          email: 'student@example.com',
          role: 'STUDENT',
        },
      },
    ];

    vi.mocked(prismaMock.auditLog.findMany).mockResolvedValueOnce(mockLogs);

    const res = await fetch(`${address}/api/v1/audit`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.logs.length).toBe(1);
    expect(body.data.logs[0].action).toBe('START_LAB');
  });
});
