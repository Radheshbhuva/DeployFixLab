import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Server } from 'http';
import bcrypt from 'bcryptjs';
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
        create: vi.fn(),
      },
      refreshToken: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
    },
  };
});

let server: Server;
let address = '';

beforeAll(async () => {
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

describe('Authentication API Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'mock-uuid-1234',
        name: 'Jane Student',
        email: 'jane@example.com',
        role: 'STUDENT',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser as any);

      const res = await fetch(`${address}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Student',
          email: 'jane@example.com',
          password: 'P@ssword123!',
        }),
      });

      expect(res.status).toBe(201);
      const body = (await res.json()) as { success: boolean; data: { user: typeof mockUser } };
      expect(body.success).toBe(true);
      expect(body.data.user.id).toBe(mockUser.id);
      expect(body.data.user.email).toBe(mockUser.email);
      expect(body.data.user.name).toBe(mockUser.name);
      expect(body.data.user.role).toBe(mockUser.role);
    });

    it('should return 409 if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'exists' } as any);

      const res = await fetch(`${address}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Student',
          email: 'jane@example.com',
          password: 'P@ssword123!',
        }),
      });

      expect(res.status).toBe(409);
      const body = (await res.json()) as { success: boolean; error: { code: string } };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('USER_ALREADY_EXISTS');
    });

    it('should return 400 on input validation failure', async () => {
      const res = await fetch(`${address}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '', // too short
          email: 'invalid-email',
          password: '123', // too short
        }),
      });

      expect(res.status).toBe(400);
      const body = (await res.json()) as {
        success: boolean;
        error: { code: string; details: any[] };
      };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_INPUT_VALIDATION');
      expect(body.error.details.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully and return access token + refresh cookie', async () => {
      const passwordHash = await bcrypt.hash('P@ssword123!', 10);
      const mockUser = {
        id: 'mock-uuid-1234',
        name: 'Jane Student',
        email: 'jane@example.com',
        passwordHash,
        role: 'STUDENT',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser as any);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as any);

      const res = await fetch(`${address}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jane@example.com',
          password: 'P@ssword123!',
        }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        success: boolean;
        data: { accessToken: string; expiresIn: number };
      };
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeTypeOf('string');
      expect(body.data.expiresIn).toBe(900);

      // Verify refresh cookie is set
      const cookies = res.headers.get('set-cookie');
      expect(cookies).not.toBeNull();
      expect(cookies).toContain('refreshToken=');
      expect(cookies).toContain('HttpOnly');
      expect(cookies).toContain('Path=/api/v1/auth/refresh');
    });

    it('should return 401 on invalid credentials', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

      const res = await fetch(`${address}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jane@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(res.status).toBe(401);
      const body = (await res.json()) as { success: boolean; error: { code: string } };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 if authorization header is missing', async () => {
      const res = await fetch(`${address}/api/v1/auth/me`);
      expect(res.status).toBe(401);
      const body = (await res.json()) as { success: boolean; error: { code: string } };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should return 401 if token is expired or invalid', async () => {
      const res = await fetch(`${address}/api/v1/auth/me`, {
        headers: { Authorization: 'Bearer invalidtoken' },
      });
      expect(res.status).toBe(401);
      const body = (await res.json()) as { success: boolean; error: { code: string } };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should return 200 and user info if token is valid', async () => {
      const token = jwt.sign(
        { id: 'mock-uuid-1234', email: 'jane@example.com', role: 'STUDENT' },
        JWT_SECRET
      );

      const res = await fetch(`${address}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        success: boolean;
        data: { user: { id: string; email: string; role: string } };
      };
      expect(body.success).toBe(true);
      expect(body.data.user.id).toBe('mock-uuid-1234');
      expect(body.data.user.email).toBe('jane@example.com');
      expect(body.data.user.role).toBe('STUDENT');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return 401 if refresh cookie is missing', async () => {
      const res = await fetch(`${address}/api/v1/auth/refresh`, {
        method: 'POST',
      });
      expect(res.status).toBe(401);
      const body = (await res.json()) as { success: boolean; error: { code: string } };
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('UNAUTHORIZED_NO_TOKEN');
    });

    it('should rotate token successfully if cookie is valid', async () => {
      const mockRecord = {
        id: 'token-uuid',
        userId: 'mock-uuid-1234',
        token: 'old-refresh-token',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
        user: {
          id: 'mock-uuid-1234',
          email: 'jane@example.com',
          role: 'STUDENT',
        },
      };

      const prismaMock = prisma as any;
      vi.mocked(prismaMock.refreshToken.findUnique).mockResolvedValueOnce(mockRecord);
      vi.mocked(prismaMock.refreshToken.update).mockResolvedValueOnce({});
      vi.mocked(prismaMock.refreshToken.create).mockResolvedValueOnce({});

      const res = await fetch(`${address}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { Cookie: 'refreshToken=old-refresh-token' },
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        success: boolean;
        data: { accessToken: string; expiresIn: number };
      };
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeTypeOf('string');

      const cookies = res.headers.get('set-cookie');
      expect(cookies).not.toBeNull();
      expect(cookies).toContain('refreshToken=');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should revoke token and clear cookie', async () => {
      const prismaMock = prisma as any;
      vi.mocked(prismaMock.refreshToken.updateMany).mockResolvedValueOnce({ count: 1 });

      const res = await fetch(`${address}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: 'refreshToken=some-token' },
      });

      expect(res.status).toBe(200);
      const cookies = res.headers.get('set-cookie');
      expect(cookies).toContain('refreshToken=;');
    });
  });
});
