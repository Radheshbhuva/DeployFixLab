import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { parse as parseUrl } from 'url';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: 'frontend' | 'backend' | 'database' | 'nginx' | 'chaos-engine';
  message: string;
  traceId?: string;
}

export interface TerminalCommandPayload {
  type: 'command';
  command: string;
  sessionId?: string;
  labId?: string;
}

class ChaosWebSocketManager {
  private wss: WebSocketServer | null = null;
  private logClients = new Set<WebSocket>();
  private terminalClients = new Map<string, WebSocket>();
  private logStreamInterval: NodeJS.Timeout | null = null;

  public init(server: HttpServer): WebSocketServer {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const parsed = parseUrl(req.url || '', true);
      const pathname = parsed.pathname || '';
      const sessionId = (parsed.query.sessionId as string) || `session-${Date.now()}`;
      const labId = (parsed.query.labId as string) || 'default-lab';

      console.log(`[WebSocket] Client connected on ${pathname} (Session: ${sessionId})`);

      if (pathname.startsWith('/logs/stream')) {
        this.logClients.add(ws);

        // Send initial connection greeting
        const greeting: LogEntry = {
          id: `init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: 'INFO',
          source: 'backend',
          message: `WebSocket log streaming pipeline active [Session: ${sessionId}]`,
          traceId: `tr-${Math.random().toString(36).substring(2, 8)}`,
        };
        ws.send(JSON.stringify(greeting));

        ws.on('close', () => {
          this.logClients.delete(ws);
          console.log(`[WebSocket] Log stream client disconnected (${sessionId})`);
        });
      } else {
        // Lab Terminal or general execution socket
        this.terminalClients.set(sessionId, ws);

        ws.on('message', (data) => {
          try {
            const rawStr = data.toString();
            let parsedData: TerminalCommandPayload;
            try {
              parsedData = JSON.parse(rawStr);
            } catch {
              parsedData = { type: 'command', command: rawStr.trim(), sessionId, labId };
            }

            this.handleTerminalCommand(ws, parsedData.command || '', labId, sessionId);
          } catch (err) {
            console.error('[WebSocket] Failed to handle incoming message:', err);
          }
        });

        ws.on('close', () => {
          this.terminalClients.delete(sessionId);
          console.log(`[WebSocket] Terminal client disconnected (${sessionId})`);
        });
      }

      ws.on('error', (err) => {
        console.warn(`[WebSocket] Client error on ${pathname}:`, err.message);
      });
    });

    // Start background telemetry generator for active live monitoring
    this.startBackgroundTelemetry();

    console.log('[WebSocket] Chaos Lab WebSocket Server initialized on /logs/stream and terminal endpoints');
    return this.wss;
  }

  public broadcastLog(entry: LogEntry): void {
    const payload = JSON.stringify(entry);
    for (const client of this.logClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }

  private handleTerminalCommand(ws: WebSocket, cmd: string, labId: string, sessionId: string): void {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Send acknowledgment
    ws.send(
      JSON.stringify({
        type: 'stdout',
        text: `$ ${trimmed}`,
      })
    );

    // Simulate realistic terminal command responses for Chaos Labs
    setTimeout(() => {
      let outputText = '';
      let isError = false;

      switch (trimmed.toLowerCase()) {
        case 'docker compose ps':
        case 'docker-compose ps':
          outputText =
            `NAME                     IMAGE               COMMAND                  SERVICE             STATUS              PORTS\n` +
            `deployfix-gateway-1      deployfix/gateway   "docker-entrypoint.s…"   api-gateway         running (healthy)   0.0.0.0:80->80/tcp\n` +
            `deployfix-postgres-1     postgres:16-alpine  "docker-entrypoint.s…"   database            running (unhealthy) 0.0.0.0:5432->5432/tcp\n` +
            `deployfix-nginx-1        nginx:alpine        "/docker-entrypoint.…"   nginx               running             0.0.0.0:443->443/tcp`;
          break;

        case 'docker compose logs --tail=10 database':
        case 'docker logs postgres':
          outputText =
            `postgres_1  | 2026-08-20 05:45:12.102 UTC [1] FATAL:  database files are incompatible with server\n` +
            `postgres_1  | 2026-08-20 05:45:12.103 UTC [1] DETAIL: The data directory was initialized by PostgreSQL version 14, which is not compatible with this server 16.2.\n` +
            `postgres_1  | 2026-08-20 05:45:13.411 UTC [1] LOG:   database system is shut down`;
          isError = true;
          break;

        case 'curl http://localhost/api/health':
        case 'curl localhost/health':
          outputText = `{"status":"error","code":"DB_CONNECTION_FAILURE","message":"Could not connect to database host at postgres:5432","timestamp":"${new Date().toISOString()}"}`;
          isError = true;
          break;

        case 'netstat -tuln':
          outputText =
            `Active Internet connections (only servers)\n` +
            `Proto Recv-Q Send-Q Local Address           Foreign Address         State\n` +
            `tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN\n` +
            `tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN\n` +
            `tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN`;
          break;

        case 'fix':
        case 'patch':
        case 'remediate':
          outputText =
            `[DeployFix Remediation Engine]\n` +
            `Applying compatibility migration patch for PostgreSQL 16 schema...\n` +
            `[+] PostgreSQL container configuration updated (image: postgres:16-alpine)\n` +
            `[+] Restarting container service database...\n` +
            `[+] Health check passed: PostgreSQL 16.2 is accepting connections on port 5432.\n` +
            `SUCCESS: Fault mitigated. Run verification tests to score.`;
          break;

        default:
          outputText = `Command executed in container sandbox [Lab: ${labId}]: ${trimmed}\nExit Code: 0`;
          break;
      }

      ws.send(
        JSON.stringify({
          type: isError ? 'stderr' : 'stdout',
          text: outputText,
          timestamp: new Date().toISOString(),
        })
      );

      // Also broadcast this as a live log entry
      this.broadcastLog({
        id: `term-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: isError ? 'ERROR' : 'INFO',
        source: 'chaos-engine',
        message: `[Terminal ${sessionId}] ${trimmed} -> Exit ${isError ? 1 : 0}`,
        traceId: `tr-${Math.random().toString(36).substring(2, 8)}`,
      });
    }, 300);
  }

  private startBackgroundTelemetry(): void {
    if (this.logStreamInterval) clearInterval(this.logStreamInterval);

    const sources = ['frontend', 'backend', 'database', 'nginx', 'chaos-engine'] as const;
    const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG'] as const;

    this.logStreamInterval = setInterval(() => {
      if (this.logClients.size === 0) return;

      const randomSource = sources[Math.floor(Math.random() * sources.length)] || 'backend';
      const randomLevel = levels[Math.floor(Math.random() * levels.length)] || 'INFO';

      const sampleMessages = {
        INFO: `Health probe GET /health responded 200 OK (${Math.floor(Math.random() * 25 + 5)}ms)`,
        WARN: `Worker thread pool at ${Math.floor(Math.random() * 20 + 70)}% threshold capacity`,
        DEBUG: `Prisma connection pool active query count: ${Math.floor(Math.random() * 8 + 1)}`,
        ERROR: `Container ingress rate-limit triggered for host IP: 192.168.1.${Math.floor(Math.random() * 100)}`,
      };

      const entry: LogEntry = {
        id: `telemetry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        level: randomLevel,
        source: randomSource,
        message: sampleMessages[randomLevel as keyof typeof sampleMessages] || 'System status nominal',
        traceId: `tr-${Math.random().toString(36).substring(2, 8)}`,
      };

      this.broadcastLog(entry);
    }, 3500);
  }

  public shutdown(): void {
    if (this.logStreamInterval) {
      clearInterval(this.logStreamInterval);
      this.logStreamInterval = null;
    }
    if (this.wss) {
      for (const client of this.wss.clients) {
        client.close(1000, 'Server shutting down');
      }
      this.wss.close();
      this.wss = null;
    }
  }
}

export const chaosWebSocketManager = new ChaosWebSocketManager();
