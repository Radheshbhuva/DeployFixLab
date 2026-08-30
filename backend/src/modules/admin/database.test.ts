import { describe, it, expect, vi } from 'vitest';
import { DatabaseService } from './database.service';
import prisma from '../../prisma';

describe('DatabaseService (Supabase Monitoring)', () => {
  it('returns database metrics with correct structure', async () => {
    vi.spyOn(prisma, '$queryRaw').mockResolvedValue([{ version: 'PostgreSQL 15.6 on x86_64 (Supabase Cloud)' }] as any);
    vi.spyOn(prisma.user, 'count').mockResolvedValue(3);
    vi.spyOn(prisma.task, 'count').mockResolvedValue(5);
    vi.spyOn(prisma.labScenario, 'count').mockResolvedValue(6);

    const metrics = await DatabaseService.getMetrics();
    expect(metrics).toBeDefined();
    expect(metrics.provider).toContain('Supabase');
    expect(metrics.connected).toBe(true);
    expect(metrics.tables.length).toBe(8);
    expect(metrics.dashboardUrls.tableEditor).toContain('/editor');
  });

  it('measures ping latency successfully', async () => {
    vi.spyOn(prisma, '$queryRaw').mockResolvedValue([{ version: 'PostgreSQL 15.6' }] as any);
    const ping = await DatabaseService.measurePingLatency();
    expect(ping.connected).toBe(true);
    expect(ping.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('blocks disallowed mutation keywords in diagnostic query runner', async () => {
    await expect(
      DatabaseService.executeDiagnosticQuery('DROP TABLE users;')
    ).rejects.toThrow('Read-only diagnostic mode prevents "DROP" statements.');

    await expect(
      DatabaseService.executeDiagnosticQuery('DELETE FROM tasks WHERE id = 1;')
    ).rejects.toThrow('Read-only diagnostic mode prevents "DELETE" statements.');
  });
});
