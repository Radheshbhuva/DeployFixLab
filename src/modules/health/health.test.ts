import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';
import app from '../../app';

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

describe('Health Module Integration Tests', () => {
  it('should return 200 OK on GET /health', async () => {
    const res = await fetch(`${address}/health`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      status: string;
      service: string;
      uptime: number;
      timestamp: string;
    };
    expect(data.status).toBe('ok');
    expect(data.service).toBe('deployfix-backend');
    expect(data.uptime).toBeTypeOf('number');
    expect(data.timestamp).toBeTypeOf('string');
  });

  it('should return 200 OK on GET /live', async () => {
    const res = await fetch(`${address}/live`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string };
    expect(data.status).toBe('ok');
  });

  it('should return 200 OK on GET /ready', async () => {
    const res = await fetch(`${address}/ready`);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string };
    expect(data.status).toBe('ok');
  });
});
