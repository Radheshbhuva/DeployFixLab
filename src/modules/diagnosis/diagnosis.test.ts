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
      userLabProgress: {
        findFirst: vi.fn(),
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

describe('Diagnosis API Integration Tests', () => {
  const prismaMock = prisma as any;

  it('should block unauthenticated requests', async () => {
    const res = await fetch(`${address}/api/v1/diagnosis/run`, {
      method: 'POST',
    });
    expect(res.status).toBe(401);
  });

  it('should return operational diagnosis when no active scenario exists', async () => {
    vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(null);

    const res = await fetch(`${address}/api/v1/diagnosis/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.prompt).toContain('DIAGNOSTIC INPUT PAYLOAD');
    expect(body.data.diagnosis.problem).toBe('System is fully operational');
    expect(body.data.diagnosis.confidence).toBe(1.0);
    expect(body.data.diagnosis.severity).toBe('low');
  });

  it('should return database credentials diagnosis when LAB-001 is active', async () => {
    const mockProgress = {
      id: 'progress-uuid-1',
      status: 'FAILED_INJECTED',
      lab: { code: 'LAB-001' },
    };

    vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(mockProgress);

    const res = await fetch(`${address}/api/v1/diagnosis/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.diagnosis.problem).toBe(
      'PostgreSQL Database Connection Authentication Failure'
    );
    expect(body.data.diagnosis.severity).toBe('critical');
    expect(body.data.diagnosis.recommendedActions.length).toBeGreaterThan(0);
  });

  it('should return port mismatch diagnosis when LAB-003 is active', async () => {
    const mockProgress = {
      id: 'progress-uuid-1',
      status: 'FAILED_INJECTED',
      lab: { code: 'LAB-003' },
    };

    vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(mockProgress);

    const res = await fetch(`${address}/api/v1/diagnosis/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.data.diagnosis.problem).toBe(
      'Nginx Gateway upstream connection failure (502 Bad Gateway)'
    );
    expect(body.data.diagnosis.severity).toBe('critical');
  });
});
