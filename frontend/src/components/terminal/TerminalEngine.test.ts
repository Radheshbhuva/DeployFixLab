import { describe, it, expect } from 'vitest';
import { TerminalEngine } from './TerminalEngine';

describe('TerminalEngine', () => {
  it('initializes with default prompt and environment', () => {
    const engine = new TerminalEngine({ hostname: 'test-sandbox', user: 'sre' });
    expect(engine.getPrompt()).toBe('sre@test-sandbox:~/app$ ');
  });

  it('executes help command and lists available SRE tools', () => {
    const engine = new TerminalEngine();
    const output = engine.execute('help');
    expect(output.length).toBeGreaterThan(1);
    expect(output[1].text).toContain('DeployFix SRE Sandbox Terminal');
    expect(output[1].text).toContain('docker compose ps');
  });

  it('handles docker compose ps and outputs container table', () => {
    const engine = new TerminalEngine({ patchApplied: false });
    const output = engine.execute('docker compose ps');
    const tableLine = output.find((l) => l.type === 'output');
    expect(tableLine?.text).toContain('deployfix-gateway');
    expect(tableLine?.text).toContain('503 ERROR');
  });

  it('handles curl probes and reflects degraded vs healthy state', () => {
    const engineUnhealthy = new TerminalEngine({ patchApplied: false });
    const outUnhealthy = engineUnhealthy.execute('curl http://localhost:5000/health');
    expect(outUnhealthy.some((l) => l.type === 'error' && l.text.includes('503 Service Unavailable'))).toBe(true);

    const engineHealthy = new TerminalEngine({ patchApplied: true });
    const outHealthy = engineHealthy.execute('curl http://localhost:5000/health');
    expect(outHealthy.some((l) => l.type === 'success' && l.text.includes('200 OK'))).toBe(true);
  });

  it('reads virtual filesystem files via cat', () => {
    const engine = new TerminalEngine();
    const envOut = engine.execute('cat .env');
    expect(envOut.some((l) => l.text.includes('DATABASE_URL='))).toBe(true);

    const composeOut = engine.execute('cat docker-compose.yml');
    expect(composeOut.some((l) => l.text.includes('services:'))).toBe(true);
  });

  it('executes apply-patch and updates internal state and files', () => {
    let patchCallbackFired = false;
    const engine = new TerminalEngine({
      onPatchApplied: () => {
        patchCallbackFired = true;
      },
    });

    const patchOut = engine.execute('apply-patch');
    expect(patchCallbackFired).toBe(true);
    expect(patchOut.some((l) => l.type === 'success')).toBe(true);

    // Subsequent curl should now be healthy
    const curlOut = engine.execute('curl /health');
    expect(curlOut.some((l) => l.type === 'success' && l.text.includes('200 OK'))).toBe(true);
  });

  it('executes network diagnostic tools (netstat, nslookup, ping)', () => {
    const engine = new TerminalEngine();
    const netstatOut = engine.execute('netstat -tuln');
    expect(netstatOut.some((l) => l.text.includes(':5000'))).toBe(true);

    const nslookupOut = engine.execute('nslookup postgres');
    expect(nslookupOut.some((l) => l.text.includes('172.28.0.3'))).toBe(true);

    const pingOut = engine.execute('ping postgres');
    expect(pingOut.some((l) => l.text.includes('64 bytes from'))).toBe(true);
  });

  it('handles autocompletion for commands and files', () => {
    const engine = new TerminalEngine();
    const dockerCompletions = engine.getAvailableCompletions('dock');
    expect(dockerCompletions).toContain('docker');

    const fileCompletions = engine.getAvailableCompletions('cat .e');
    expect(fileCompletions).toContain('.env');
  });

  it('tracks command history', () => {
    const engine = new TerminalEngine();
    engine.execute('docker ps');
    engine.execute('cat .env');
    expect(engine.getHistory()).toEqual(['docker ps', 'cat .env']);
  });
});
