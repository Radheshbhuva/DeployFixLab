/**
 * DeployFix SRE Virtual Terminal Execution Engine
 * Provides realistic Linux, Docker, Kubernetes, Network & SRE incident simulation.
 */

export interface TerminalOutputLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'warning' | 'info';
  text: string;
  timestamp?: string;
  command?: string;
}

export interface VirtualFile {
  name: string;
  path: string;
  content: string;
  permissions?: string;
}

export interface TerminalEngineContext {
  labId?: string;
  labTitle?: string;
  patchApplied?: boolean;
  hostname?: string;
  user?: string;
  currentDir?: string;
  files?: Record<string, string>;
  onPatchApplied?: () => void;
  onRunVerification?: () => void;
  onCustomCommand?: (cmd: string) => TerminalOutputLine[] | null;
}

export class TerminalEngine {
  private files: Record<string, string> = {};
  private history: string[] = [];
  private hostname: string;
  private user: string;
  private currentDir: string;
  private envVars: Record<string, string> = {};
  private context: TerminalEngineContext;

  constructor(context: TerminalEngineContext = {}) {
    this.context = context;
    this.hostname = context.hostname || 'deployfix-sandbox';
    this.user = context.user || 'sre';
    this.currentDir = context.currentDir || '~/app';

    // Default virtual filesystem
    this.files = {
      'docker-compose.yml': context.files?.['docker-compose.yml'] || `version: '3.8'
services:
  gateway:
    image: node:20-alpine
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DATABASE_URL=\${DATABASE_URL:-postgresql://sre_user:secret@127.0.0.1:5432/deployfix}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: sre_user
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: deployfix
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"`,
      '.env': context.files?.['.env'] || `PORT=5000
DATABASE_URL=postgresql://sre_user:secret@127.0.0.1:5432/deployfix
REDIS_URL=redis://redis:6379
NODE_ENV=production
LOG_LEVEL=debug`,
      'nginx.conf': context.files?.['nginx.conf'] || `events { worker_connections 1024; }
http {
  upstream api_servers {
    server 127.0.0.1:5000 max_fails=3 fail_timeout=10s;
  }
  server {
    listen 80;
    location / {
      proxy_pass http://api_servers;
      proxy_set_header Host $host;
      proxy_connect_timeout 5s;
    }
  }
}`,
      '/etc/resolv.conf': `nameserver 172.28.0.1
options ndots:1 timeout:2
search deployfix.internal svc.cluster.local`,
      '/etc/hosts': `127.0.0.1       localhost
172.28.0.2      deployfix-gateway
172.28.0.3      postgres
172.28.0.4      redis`,
      ...context.files,
    };

    this.envVars = {
      HOSTNAME: this.hostname,
      USER: this.user,
      HOME: '/home/sre',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      PORT: '5000',
      NODE_ENV: 'production',
      CONTAINER_RUNTIME: 'docker://26.0.0',
      NETWORK_SUBNET: '172.28.0.0/16',
    };
  }

  public updateContext(newContext: Partial<TerminalEngineContext>): void {
    this.context = { ...this.context, ...newContext };
    if (newContext.files) {
      this.files = { ...this.files, ...newContext.files };
    }
    if (newContext.patchApplied !== undefined) {
      if (newContext.patchApplied) {
        this.files['.env'] = this.files['.env'].replace('127.0.0.1:5432', 'postgres:5432');
        this.files['docker-compose.yml'] = this.files['docker-compose.yml'].replace(
          '127.0.0.1:5432',
          'postgres:5432'
        );
      }
    }
  }

  public getPrompt(): string {
    return `${this.user}@${this.hostname}:${this.currentDir}$ `;
  }

  public getHistory(): string[] {
    return [...this.history];
  }

  public getAvailableCompletions(input: string): string[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const parts = trimmed.split(/\s+/);
    const lastWord = parts[parts.length - 1];

    const commandList = [
      'docker compose ps',
      'docker compose logs',
      'docker compose restart',
      'docker compose up',
      'docker compose down',
      'docker ps',
      'docker logs',
      'docker inspect',
      'docker stats',
      'kubectl get pods',
      'kubectl get svc',
      'kubectl logs',
      'kubectl describe pod',
      'curl',
      'curl -I http://localhost:5000/health',
      'curl http://localhost:5000/health',
      'netstat -tuln',
      'nslookup postgres',
      'nslookup redis',
      'ping -c 3 postgres',
      'cat docker-compose.yml',
      'cat .env',
      'cat nginx.conf',
      'cat /etc/resolv.conf',
      'cat /etc/hosts',
      'ls -la',
      'pwd',
      'whoami',
      'uname -a',
      'env',
      'top',
      'free -m',
      'df -h',
      'apply-patch',
      'fix',
      'restart',
      'verify',
      'clear',
      'help',
      'history',
      'chaos list',
      'chaos status',
    ];

    if (parts.length === 1) {
      return commandList
        .filter((c) => c.startsWith(lastWord.toLowerCase()))
        .map((c) => c.split(' ')[0]);
    }

    // File completion
    const filenames = Object.keys(this.files);
    return filenames.filter((f) => f.toLowerCase().startsWith(lastWord.toLowerCase()));
  }

  public execute(rawCmd: string): TerminalOutputLine[] {
    const cmd = rawCmd.trim();
    if (!cmd) return [];

    this.history.push(cmd);
    const now = new Date().toISOString().substring(11, 19);
    const lineId = () => Math.random().toString(36).substring(2, 9);

    const inputLine: TerminalOutputLine = {
      id: lineId(),
      type: 'input',
      text: `${this.getPrompt()}${cmd}`,
      timestamp: now,
      command: cmd,
    };

    // Allow custom handler hook
    if (this.context.onCustomCommand) {
      const customOut = this.context.onCustomCommand(cmd);
      if (customOut) {
        return [inputLine, ...customOut];
      }
    }

    const lower = cmd.toLowerCase();
    const parts = cmd.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();
    const isPatchApplied = this.context.patchApplied || false;

    const out: TerminalOutputLine[] = [inputLine];

    // Helper to push output
    const push = (text: string, type: TerminalOutputLine['type'] = 'output') => {
      out.push({ id: lineId(), type, text, timestamp: now });
    };

    // 1. HELP / MAN
    if (lower === 'help' || lower === 'man' || lower === '--help') {
      push(
        `DeployFix SRE Sandbox Terminal (v2.4 - Alpine Linux 3.19 / Docker 26.0)
Available SRE Commands:

Container Orchestration:
  docker compose ps          List container service health, states & bindings
  docker compose logs [svc]  Tail container stdout/stderr logs (e.g. gateway, postgres)
  docker compose restart     Gracefully restart target container services
  docker ps -a               List all Docker container instances
  docker stats --no-stream   Inspect live container CPU and memory consumption

Kubernetes Diagnostics:
  kubectl get pods           List cluster pods and ready states
  kubectl get svc            List services and cluster IP bindings
  kubectl logs [pod]         Inspect pod log stream
  kubectl describe pod [pod] Detailed pod conditions and events

Network & Telemetry Probes:
  curl [options] [url]       Execute HTTP probe with headers (-I, -v, -s)
  netstat -tuln / ss -tulpn  Inspect active listening TCP/UDP socket ports
  nslookup [host]            Test DNS resolution against CoreDNS (172.28.0.1)
  ping -c 3 [host]           ICMP latency and packet drop diagnostics
  nc -zv [host] [port]       TCP handshake connectivity test

Virtual Filesystem & Inspection:
  cat [file]                 Print file contents (docker-compose.yml, .env, nginx.conf)
  ls -la                     List files and permissions in current directory
  grep [pattern] [file]      Search for string patterns inside files
  sed / echo / touch         Modify or create configuration files
  env / printenv             Print active sandbox environment variables
  top / free -m / df -h      Inspect CPU, memory buffers, and disk usage

Remediation & Automation:
  apply-patch / fix          Apply recommended configuration fix and trigger service restart
  verify                     Execute automated test suite against sandbox endpoints
  clear / cls                Clear terminal screen buffer
  history                    Show command history`,
        'info'
      );
      return out;
    }

    // 2. CLEAR
    if (lower === 'clear' || lower === 'cls') {
      return [{ id: lineId(), type: 'system', text: 'Terminal cleared.' }];
    }

    // 3. DOCKER / DOCKER COMPOSE
    if (baseCmd === 'docker') {
      if (lower.includes('compose ps') || lower === 'docker ps' || lower === 'docker ps -a') {
        const gwHealth = isPatchApplied ? 'Up (healthy) - 0.4% CPU' : 'Up (unhealthy) - 503 ERROR';
        const pgHealth = 'Up (healthy) - 1.2% CPU';
        const redisHealth =
          isPatchApplied || this.context.labId !== 'lab-03'
            ? 'Up (healthy) - 0.2% CPU'
            : 'Restarting (OOMKilled - 100% RAM)';

        push(
          `CONTAINER ID   NAME                 IMAGE               COMMAND                  SERVICE    CREATED         STATUS              PORTS
d9f81a20bc11   deployfix-gateway    node:20-alpine      "npm run start"          gateway    12 mins ago     ${gwHealth}   0.0.0.0:5000->5000/tcp
a3e4210cf492   deployfix-postgres   postgres:16-alpine  "docker-entrypoint.s…"   postgres   12 mins ago     ${pgHealth}   0.0.0.0:5432->5432/tcp
f1c09941bd88   deployfix-redis      redis:7-alpine      "docker-entrypoint.s…"   redis      12 mins ago     ${redisHealth}   0.0.0.0:6379->6379/tcp`,
          'output'
        );
      } else if (lower.includes('logs')) {
        if (lower.includes('postgres') || lower.includes('db')) {
          push(
            `[postgres] 2026-08-30 08:20:01.102 UTC [1] LOG:  database system was shut down at 2026-08-30 08:19:50 UTC
[postgres] 2026-08-30 08:20:01.150 UTC [1] LOG:  database system is ready to accept connections
[postgres] 2026-08-30 08:20:01.151 UTC [1] LOG:  autovacuum launcher started
[postgres] 2026-08-30 08:20:15.340 UTC [28] LOG:  connection received: host=172.28.0.2 port=54912
[postgres] 2026-08-30 08:20:15.345 UTC [28] LOG:  connection authorized: user=sre_user database=deployfix`,
            'info'
          );
        } else if (lower.includes('redis')) {
          push(
            `[redis] 1:M 30 Aug 2026 08:20:00.000 * Running mode=standalone, port=6379.
[redis] 1:M 30 Aug 2026 08:20:00.001 # Server initialized
[redis] 1:M 30 Aug 2026 08:20:00.002 * Ready to accept connections tcp`,
            'info'
          );
        } else {
          // Gateway logs
          if (isPatchApplied) {
            push(
              `[gateway] 2026-08-30T08:35:00.120Z [info]: Connected to PostgreSQL at postgres:5432 (latency: 1.2ms)
[gateway] 2026-08-30T08:35:00.180Z [info]: Connected to Redis cache at redis:6379
[gateway] 2026-08-30T08:35:00.200Z [info]: HTTP gateway listening on port 5000 [NODE_ENV=production]
[gateway] 2026-08-30T08:35:05.890Z [info]: GET /health 200 OK (2.4ms)
[gateway] 2026-08-30T08:35:10.110Z [info]: GET /api/v1/orders 200 OK (18.1ms)`,
              'success'
            );
          } else {
            push(
              `[gateway] 2026-08-30T08:20:12.802Z [error]: Database initialization failed: Connection refused 127.0.0.1:5432
[gateway] 2026-08-30T08:20:12.803Z [error]: Error: connect ECONNREFUSED 127.0.0.1:5432
[gateway]     at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1605:16)
[gateway]     at Protocol.handshake (/app/node_modules/pg/lib/connection.js:132:10)
[gateway] 2026-08-30T08:20:17.805Z [warn]: Retrying database connection in 5000ms... (attempt 4/10)
[gateway] 2026-08-30T08:20:20.100Z [error]: GET /health 503 SERVICE UNAVAILABLE (Database unreachable)`,
              'error'
            );
          }
        }
      } else if (lower.includes('restart')) {
        push('Gracefully restarting container services: [deployfix-gateway]...', 'info');
        push('Stopping deployfix-gateway ... done\nStarting deployfix-gateway ... done', 'system');
        if (isPatchApplied) {
          push('✓ deployfix-gateway restarted and healthy (PID: 140, Port: 5000).', 'success');
        } else {
          push(
            '⚠ deployfix-gateway restarted, but synthetic healthcheck still reports 503 (database connection refused on 127.0.0.1:5432).',
            'warning'
          );
        }
      } else if (lower.includes('stats')) {
        push(
          `CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O
d9f81a20bc11   deployfix-gateway    0.42%     68.4MiB / 2.000GiB    3.34%     1.24MB / 890kB    12.4MB / 0B
a3e4210cf492   deployfix-postgres   1.10%     142.1MiB / 2.000GiB   6.94%     890kB / 1.24MB    48.2MB / 1.2MB
f1c09941bd88   deployfix-redis      0.15%     18.2MiB / 512.0MiB    3.55%     420kB / 420kB     0B / 0B`,
          'output'
        );
      } else if (lower.includes('inspect')) {
        push(
          `[
  {
    "Id": "d9f81a20bc117a229ef40b01c",
    "Created": "2026-08-30T08:18:00.120Z",
    "Path": "npm",
    "Args": ["run", "start"],
    "State": {
      "Status": "running",
      "Running": true,
      "Health": {
        "Status": "${isPatchApplied ? 'healthy' : 'unhealthy'}",
        "FailingStreak": ${isPatchApplied ? 0 : 5}
      }
    },
    "NetworkSettings": {
      "IPAddress": "172.28.0.2",
      "Gateway": "172.28.0.1",
      "Ports": {
        "5000/tcp": [{ "HostIp": "0.0.0.0", "HostPort": "5000" }]
      }
    }
  }
]`,
          'output'
        );
      } else {
        push('Docker CLI v26.0.0, build 26.0.0-1. Execute "docker compose ps" or "docker compose logs".', 'output');
      }
      return out;
    }

    // 4. KUBECTL
    if (baseCmd === 'kubectl') {
      if (lower.includes('get pods') || lower.includes('get pod')) {
        const gwStatus = isPatchApplied ? 'Running   0          4m12s' : 'CrashLoopBackOff   4 (45s ago)   4m12s';
        push(
          `NAME                                 READY   STATUS             RESTARTS   AGE
gateway-deployment-7c98f588b-2d4x1   0/1     ${gwStatus}
postgres-statefulset-0               1/1     Running            0          15m
redis-deployment-55df6d4b7c-m9k22    1/1     Running            0          15m`,
          isPatchApplied ? 'success' : 'warning'
        );
      } else if (lower.includes('get svc') || lower.includes('get services')) {
        push(
          `NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
gateway      ClusterIP   10.96.142.12     <none>        5000/TCP         15m
postgres     ClusterIP   10.96.88.204     <none>        5432/TCP         15m
redis        ClusterIP   10.96.19.78      <none>        6379/TCP         15m
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP          28d`,
          'output'
        );
      } else if (lower.includes('logs')) {
        push(`[kubectl] Streaming logs from pod/gateway-deployment-7c98f588b-2d4x1...`, 'info');
        if (isPatchApplied) {
          push('INFO: Pod ready. Healthprobe status: 200 OK.', 'success');
        } else {
          push('FATAL: Failed to reach database at 127.0.0.1:5432. Exiting process with code 1.', 'error');
        }
      } else {
        push('kubectl controls the Kubernetes cluster manager. Available: get pods, get svc, logs.', 'output');
      }
      return out;
    }

    // 5. CURL / HTTP PROBE
    if (baseCmd === 'curl' || baseCmd === 'wget') {
      const url = parts.find((p) => p.startsWith('http') || p.includes(':') || p.includes('/')) || 'http://localhost:5000/health';
      if (isPatchApplied) {
        push(
          `Connected to ${url} (172.28.0.2:5000)
HTTP/1.1 200 OK
Date: ${new Date().toUTCString()}
Server: deployfix-gateway/v1.0.0
Content-Type: application/json; charset=utf-8
Content-Length: 142
Connection: keep-alive
X-Response-Time: 3.2ms

{
  "status": "HEALTHY",
  "services": {
    "database": { "status": "UP", "host": "postgres:5432", "latencyMs": 1.2 },
    "redis": { "status": "UP", "host": "redis:6379", "latencyMs": 0.4 }
  },
  "uptime": 248,
  "environment": "production"
}`,
          'success'
        );
      } else {
        push(
          `HTTP/1.1 503 Service Unavailable
Date: ${new Date().toUTCString()}
Server: deployfix-gateway/v1.0.0
Content-Type: application/json; charset=utf-8
Content-Length: 184
Connection: close
X-Response-Time: 5002.1ms

{
  "status": "UNHEALTHY",
  "error": "ECONNREFUSED: Unable to reach database backend at 127.0.0.1:5432",
  "remediation": "Update DATABASE_URL from 127.0.0.1 to postgres in Docker network.",
  "activeConnections": 0
}`,
          'error'
        );
      }
      return out;
    }

    // 6. NETSTAT / SS / LSOF
    if (baseCmd === 'netstat' || baseCmd === 'ss' || baseCmd === 'lsof') {
      push(
        `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN      14/node
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      28/postgres
tcp        0      0 0.0.0.0:6379            0.0.0.0:*               LISTEN      42/redis-server
tcp        0      0 127.0.0.11:53           0.0.0.0:*               LISTEN      1/dockerd-dns`,
        'output'
      );
      return out;
    }

    // 7. NSLOOKUP / DIG / PING
    if (baseCmd === 'nslookup' || baseCmd === 'dig') {
      const target = parts[1] || 'postgres';
      const ip = target.includes('redis') ? '172.28.0.4' : target.includes('postgres') ? '172.28.0.3' : '172.28.0.2';
      push(
        `Server:         172.28.0.1
Address:        172.28.0.1#53

Non-authoritative answer:
Name:   ${target}.deployfix-chaos-net
Address: ${ip} (RTT: 0.38ms via CoreDNS)`,
        'success'
      );
      return out;
    }

    if (baseCmd === 'ping') {
      const target = parts.find((p) => !p.startsWith('-') && p !== 'ping') || 'postgres';
      push(
        `PING ${target} (172.28.0.3): 56 data bytes
64 bytes from 172.28.0.3: icmp_seq=0 ttl=64 time=0.284 ms
64 bytes from 172.28.0.3: icmp_seq=1 ttl=64 time=0.312 ms
64 bytes from 172.28.0.3: icmp_seq=2 ttl=64 time=0.298 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max = 0.284/0.298/0.312 ms`,
        'success'
      );
      return out;
    }

    if (baseCmd === 'nc' || baseCmd === 'telnet') {
      const host = parts[1] || 'postgres';
      const port = parts[2] || '5432';
      push(`Connection to ${host} ${port} port [tcp/*] succeeded! (Handshake: 0.4ms)`, 'success');
      return out;
    }

    // 8. CAT / INSPECT FILE
    if (baseCmd === 'cat' || baseCmd === 'head' || baseCmd === 'tail') {
      const filename = parts.find((p) => !p.startsWith('-') && p !== baseCmd);
      if (!filename) {
        push(`cat: missing file operand. Example: cat docker-compose.yml, cat .env`, 'error');
        return out;
      }

      // Check matched file in virtual filesystem
      const matchedKey = Object.keys(this.files).find(
        (k) => k.toLowerCase() === filename.toLowerCase() || k.endsWith(filename)
      );

      if (matchedKey && this.files[matchedKey]) {
        push(this.files[matchedKey], 'output');
      } else {
        push(`cat: ${filename}: No such file or directory`, 'error');
      }
      return out;
    }

    // 9. LS / DIR
    if (baseCmd === 'ls' || baseCmd === 'dir') {
      const isDetailed = lower.includes('-l') || lower.includes('-la') || lower.includes('-al');
      if (isDetailed) {
        push(
          `total 36
drwxr-xr-x 6 sre sre 4096 Aug 30 08:15 .
drwxr-xr-x 3 sre sre 4096 Aug 30 08:10 ..
-rw-r--r-- 1 sre sre  240 Aug 30 08:15 .env
-rw-r--r-- 1 sre sre 1024 Aug 30 08:12 docker-compose.yml
-rw-r--r-- 1 sre sre  480 Aug 30 08:10 nginx.conf
-rw-r--r-- 1 sre sre 1204 Aug 30 08:10 package.json
drwxr-xr-x 2 sre sre 4096 Aug 30 08:10 src/
drwxr-xr-x 2 sre sre 4096 Aug 30 08:10 tests/`,
          'output'
        );
      } else {
        push(`.env   docker-compose.yml   nginx.conf   package.json   src/   tests/`, 'output');
      }
      return out;
    }

    // 10. PWD / WHOAMI / UNAME / DATE / UPTIME
    if (baseCmd === 'pwd') {
      push('/home/sre/app', 'output');
      return out;
    }
    if (baseCmd === 'whoami') {
      push('sre', 'output');
      return out;
    }
    if (baseCmd === 'id') {
      push('uid=1000(sre) gid=1000(sre) groups=1000(sre),27(sudo),999(docker)', 'output');
      return out;
    }
    if (baseCmd === 'uname' || baseCmd === 'uname -a') {
      push('Linux deployfix-sandbox 6.6.14-deployfix-sre #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', 'output');
      return out;
    }
    if (baseCmd === 'date') {
      push(new Date().toUTCString(), 'output');
      return out;
    }
    if (baseCmd === 'uptime') {
      push(' 08:35:12 up 2 hrs, 1 user, load average: 0.12, 0.08, 0.05', 'output');
      return out;
    }

    // 11. TOP / HTOP / FREE / DF / PS
    if (baseCmd === 'free' || baseCmd === 'free -m') {
      push(
        `               total        used        free      shared  buff/cache   available
Mem:            2048         384        1420          12         244        1664
Swap:           1024           0        1024`,
        'output'
      );
      return out;
    }

    if (baseCmd === 'df' || baseCmd === 'df -h') {
      push(
        `Filesystem      Size  Used Avail Use% Mounted on
overlay          50G  4.2G   43G   9% /
tmpfs            64M     0   64M   0% /dev
/dev/sda1        50G  4.2G   43G   9% /app`,
        'output'
      );
      return out;
    }

    if (baseCmd === 'top' || baseCmd === 'htop' || baseCmd === 'ps' || lower.includes('ps aux')) {
      push(
        `PID   USER     PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  14  sre      20   0  782.4m  68.4m  24.1m S   0.4   3.3   0:04.12 node dist/index.js
  28  postgres 20   0  380.1m 142.1m  42.0m S   1.1   6.9   0:08.40 postgres
  42  redis    20   0   48.2m  18.2m   8.1m S   0.1   0.9   0:01.05 redis-server *:6379
   1  root     20   0   12.4m   2.1m   1.2m S   0.0   0.1   0:00.20 /sbin/init`,
        'output'
      );
      return out;
    }

    // 12. ENV / PRINTENV / EXPORT
    if (baseCmd === 'env' || baseCmd === 'printenv') {
      const dbUrl = isPatchApplied
        ? 'postgresql://sre_user:secret@postgres:5432/deployfix'
        : 'postgresql://sre_user:secret@127.0.0.1:5432/deployfix';

      const vars = {
        ...this.envVars,
        DATABASE_URL: dbUrl,
        REDIS_URL: 'redis://redis:6379',
      };

      push(Object.entries(vars).map(([k, v]) => `${k}=${v}`).join('\n'), 'output');
      return out;
    }

    if (baseCmd === 'export') {
      if (parts.length > 1) {
        const [k, v] = parts[1].split('=');
        if (k && v) {
          this.envVars[k] = v;
          push(`Exported environment variable: ${k}=${v}`, 'success');
        }
      } else {
        push(Object.entries(this.envVars).map(([k, v]) => `declare -x ${k}="${v}"`).join('\n'), 'output');
      }
      return out;
    }

    // 13. SRE REMEDIATION & RECOVERY (apply-patch, fix, patch, verify)
    if (
      baseCmd === 'apply-patch' ||
      baseCmd === 'fix' ||
      baseCmd === 'patch' ||
      lower.includes('apply-patch') ||
      lower.includes('apply patch') ||
      lower.includes('fix-issue')
    ) {
      this.context.patchApplied = true;
      this.files['.env'] = this.files['.env'].replace('127.0.0.1:5432', 'postgres:5432');
      this.files['docker-compose.yml'] = this.files['docker-compose.yml'].replace(
        '127.0.0.1:5432',
        'postgres:5432'
      );

      push('⚙ Applying SRE configuration remediation patch...', 'info');
      push(
        `--- a/.env
+++ b/.env
@@ -1,3 +1,3 @@
 PORT=5000
-DATABASE_URL=postgresql://sre_user:secret@127.0.0.1:5432/deployfix
+DATABASE_URL=postgresql://sre_user:secret@postgres:5432/deployfix
 REDIS_URL=redis://redis:6379`,
        'success'
      );
      push('Restarting affected container services: [gateway]...', 'info');
      push('✓ Container deployfix-gateway reloaded with updated DNS configuration.', 'success');
      push('✓ Synthetic healthcheck verified: HTTP 200 OK (3.2ms response latency). Incident resolved.', 'success');

      if (this.context.onPatchApplied) {
        this.context.onPatchApplied();
      }
      return out;
    }

    if (baseCmd === 'verify' || baseCmd === 'test' || baseCmd === 'run-tests') {
      push('Running DeployFix SRE Automated Verification Suite...', 'info');
      if (isPatchApplied) {
        push('✓ TEST 1: Database Connectivity Probe (postgres:5432) -> PASS (1.2ms)', 'success');
        push('✓ TEST 2: Gateway Healthcheck Probe (GET /health) -> PASS (HTTP 200 OK)', 'success');
        push('✓ TEST 3: Redis In-Memory Cache Ingestion -> PASS (0.4ms)', 'success');
        push('✓ TEST 4: SLA Latency Threshold (< 50ms) -> PASS (3.2ms)', 'success');
        push('ALL 4 SRE VERIFICATION TESTS PASSED. Incident resolved with 100% SLA.', 'success');
      } else {
        push('✓ TEST 1: Container Process Inspection -> PASS (PID: 14)', 'success');
        push('✗ TEST 2: Gateway Healthcheck Probe (GET /health) -> FAILED (HTTP 503 SERVICE UNAVAILABLE)', 'error');
        push('✗ TEST 3: PostgreSQL TCP Handshake -> FAILED (ECONNREFUSED 127.0.0.1:5432)', 'error');
        push('VERIFICATION FAILED (1/3 Passing). Container cannot reach database via localhost in bridge network.', 'error');
      }

      if (this.context.onRunVerification) {
        this.context.onRunVerification();
      }
      return out;
    }

    // 14. HISTORY
    if (baseCmd === 'history') {
      push(this.history.map((h, idx) => `  ${idx + 1}  ${h}`).join('\n'), 'output');
      return out;
    }

    // 15. GREP / SED / ECHO
    if (baseCmd === 'grep') {
      const pattern = parts[1] || '';
      const filename = parts[2] || '';
      const content = this.files[filename] || '';
      if (!pattern) {
        push('Usage: grep [pattern] [filename]', 'error');
      } else if (!content) {
        push(`grep: ${filename || 'file'}: No such file or directory`, 'error');
      } else {
        const matches = content
          .split('\n')
          .filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));
        if (matches.length > 0) {
          push(matches.join('\n'), 'output');
        } else {
          push(`No matches found for "${pattern}" in ${filename}`, 'warning');
        }
      }
      return out;
    }

    if (baseCmd === 'echo') {
      const rest = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
      push(rest, 'output');
      return out;
    }

    // Default Fallback
    push(
      `bash: ${cmd}: command executed in sandbox environment (exit code: 0). Type "help" for list of SRE tools.`,
      'output'
    );
    return out;
  }
}
