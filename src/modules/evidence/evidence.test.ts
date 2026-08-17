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

describe('Evidence API Integration Tests', () => {
  const prismaMock = prisma as any;

  describe('Unauthenticated Blocks', () => {
    it('should block unauthenticated log queries', async () => {
      const res = await fetch(`${address}/api/v1/evidence/nginx-logs`);
      expect(res.status).toBe(401);
    });

    it('should block unauthenticated container queries', async () => {
      const res = await fetch(`${address}/api/v1/evidence/docker-containers`);
      expect(res.status).toBe(401);
    });

    it('should block unauthenticated config queries', async () => {
      const res = await fetch(`${address}/api/v1/evidence/configs`);
      expect(res.status).toBe(401);
    });
  });

  describe('Healthy/Default Evidence Checks', () => {
    it('should return healthy log streams', async () => {
      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/evidence/nginx-logs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.logs).toContain('curl/7.81.0');
    });

    it('should return healthy container arrays', async () => {
      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/evidence/docker-containers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(
        body.data.containers.every((c: any) => c.status === 'running' && c.health === 'healthy')
      ).toBe(true);
    });

    it('should return healthy configurations', async () => {
      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/evidence/configs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as any;
      expect(body.success).toBe(true);
      expect(body.data.configs['nginx.conf']).toContain('proxy_pass http://backend-api:5000;');
    });
  });

  describe('Failure Telemetry Simulation Checks', () => {
    it('should simulate LAB-001 Broken DB Credentials evidence', async () => {
      const mockProgress = {
        id: 'progress-uuid-1',
        status: 'FAILED_INJECTED',
        lab: { code: 'LAB-001' },
      };

      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValue(mockProgress);

      // Check configs
      const resConfig = await fetch(`${address}/api/v1/evidence/configs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyConfig = (await resConfig.json()) as any;
      expect(bodyConfig.data.configs['.env']).toContain('wrong_password_db');

      // Check logs
      const resLogs = await fetch(`${address}/api/v1/evidence/nginx-logs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyLogs = (await resLogs.json()) as any;
      expect(bodyLogs.data.logs).toContain('password authentication failed');
    });

    it('should simulate LAB-003 Proxy Port Mismatch evidence', async () => {
      const mockProgress = {
        id: 'progress-uuid-1',
        status: 'FAILED_INJECTED',
        lab: { code: 'LAB-003' },
      };

      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValue(mockProgress);

      // Check containers
      const resContainers = await fetch(`${address}/api/v1/evidence/docker-containers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyContainers = (await resContainers.json()) as any;
      const nginx = bodyContainers.data.containers.find((c: any) => c.name === 'nginx-proxy');
      expect(nginx.health).toBe('unhealthy');

      // Check configs
      const resConfig = await fetch(`${address}/api/v1/evidence/configs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyConfig = (await resConfig.json()) as any;
      expect(bodyConfig.data.configs['nginx.conf']).toContain('backend-api:4000');
    });

    it('should simulate LAB-004 Heap Memory Leak OOM evidence', async () => {
      const mockProgress = {
        id: 'progress-uuid-1',
        status: 'FAILED_INJECTED',
        lab: { code: 'LAB-004' },
      };

      vi.mocked(prismaMock.userLabProgress.findFirst).mockResolvedValue(mockProgress);

      const resContainers = await fetch(`${address}/api/v1/evidence/docker-containers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const bodyContainers = (await resContainers.json()) as any;
      const backend = bodyContainers.data.containers.find((c: any) => c.name === 'backend-api');
      expect(backend.status).toBe('exited');
      expect(backend.exitCode).toBe(137);
    });
  });
});
