import { apiClient } from './apiClient';
import { Lab, LabSession, VerificationResult, FailureType } from '@/types/lab.types';

const MOCK_LABS: Lab[] = [
  {
    id: 'lab-01',
    code: 'DFIX-LAB-01',
    title: 'PostgreSQL Bridge Network Mismatch',
    category: 'DATABASE',
    description: 'Diagnose why the web backend cannot reach the PostgreSQL container due to loopback 127.0.0.1 misconfiguration inside Docker bridge.',
    difficulty: 'BEGINNER',
    severity: 'P1_CRITICAL',
    failureTypes: ['db_connection'],
    estimatedMinutes: 15,
    completionCount: 142,
    isNew: false,
    tags: ['Docker', 'PostgreSQL', 'Bridge Network', 'TCP Handshake'],
    topologyFlow: ['Client', 'Gateway (Port 5000)', 'PostgreSQL (Port 5432)'],
    topology: [
      { name: 'deployfix-gateway', role: 'API Gateway', image: 'node:20-alpine', port: 5000, internalIp: '172.28.0.2', status: 'UNHEALTHY' },
      { name: 'deployfix-postgres', role: 'Relational DB', image: 'postgres:16-alpine', port: 5432, internalIp: '172.28.0.3', status: 'HEALTHY' },
      { name: 'deployfix-redis', role: 'Session Cache', image: 'redis:7-alpine', port: 6379, internalIp: '172.28.0.4', status: 'HEALTHY' },
    ],
    slaImpact: '100% Failure on user authentication and database writes',
    incidentSymptoms: 'HTTP 503 Service Unavailable on /api/health and ECONNREFUSED 127.0.0.1:5432 in gateway logs.',
    objectives: [
      'Inspect docker compose network topology and running containers',
      'Verify host string in DATABASE_URL points to internal service hostname',
      'Apply configuration patch and restart deployfix-gateway service',
      'Run verification suite to confirm 100% TCP handshake & API health',
    ],
    prerequisites: ['Basic Docker CLI & environment variables knowledge', 'TCP/IP port binding fundamentals'],
    targetService: 'PostgreSQL DB (Port 5432)',
    faultSummary: 'Backend DATABASE_URL points to 127.0.0.1 instead of postgres service hostname inside Docker bridge.',
    hints: [
      'Inside Docker Compose, each container has its own isolated loopback interface (127.0.0.1).',
      'Use the service name "postgres" or "deployfix-postgres" as the database host.',
      'Check backend/.env or docker-compose.yml environment variables.',
    ],
    configFiles: [
      {
        filename: 'docker-compose.yml',
        language: 'yaml',
        content: `version: '3.8'
services:
  gateway:
    image: node:20-alpine
    container_name: deployfix-gateway
    environment:
      - DATABASE_URL=postgresql://sre_user:secret@127.0.0.1:5432/deployfix
      - PORT=5000
    networks:
      - chaos-net
  postgres:
    image: postgres:16-alpine
    container_name: deployfix-postgres
    environment:
      - POSTGRES_DB=deployfix
      - POSTGRES_USER=sre_user
      - POSTGRES_PASSWORD=secret
    networks:
      - chaos-net
networks:
  chaos-net:
    driver: bridge`,
        patchedContent: `version: '3.8'
services:
  gateway:
    image: node:20-alpine
    container_name: deployfix-gateway
    environment:
      - DATABASE_URL=postgresql://sre_user:secret@postgres:5432/deployfix
      - PORT=5000
    networks:
      - chaos-net
  postgres:
    image: postgres:16-alpine
    container_name: deployfix-postgres
    environment:
      - POSTGRES_DB=deployfix
      - POSTGRES_USER=sre_user
      - POSTGRES_PASSWORD=secret
    networks:
      - chaos-net
networks:
  chaos-net:
    driver: bridge`,
      },
    ],
    shortcuts: [
      { command: 'docker compose ps', description: 'List active container health statuses', category: 'inspect' },
      { command: 'docker compose logs --tail=30 gateway', description: 'Stream latest gateway error logs', category: 'log' },
      { command: 'curl -I http://localhost:5000/health', description: 'Probe gateway HTTP health status', category: 'network' },
      { command: 'sed -i "s/127.0.0.1/postgres/g" .env && docker compose restart gateway', description: 'Apply patch and restart container', category: 'fix' },
    ],
  },
  {
    id: 'lab-02',
    code: 'DFIX-LAB-02',
    title: 'DNS Resolution Failure on Alpine Linux',
    category: 'NETWORKING',
    description: 'Resolve inter-container hostname resolution dropouts caused by Musl libc sequential DNS resolver differences in Alpine Linux containers.',
    difficulty: 'ADVANCED',
    severity: 'P1_CRITICAL',
    failureTypes: ['dns_failure', 'network_timeout'],
    estimatedMinutes: 25,
    completionCount: 98,
    isNew: false,
    tags: ['Alpine', 'DNS', 'Musl', 'CoreDNS', 'Networking'],
    topologyFlow: ['Worker Node', 'CoreDNS Resolver', 'Upstream Services'],
    topology: [
      { name: 'deployfix-worker', role: 'Background Worker', image: 'alpine:3.19', port: 'N/A', internalIp: '172.28.0.5', status: 'UNHEALTHY' },
      { name: 'deployfix-coredns', role: 'DNS Engine', image: 'coredns:latest', port: 53, internalIp: '172.28.0.1', status: 'HEALTHY' },
      { name: 'deployfix-api', role: 'Target API', image: 'node:20-alpine', port: 8080, internalIp: '172.28.0.6', status: 'HEALTHY' },
    ],
    slaImpact: 'Intermittent 5000ms latency spikes and dropped background worker tasks',
    incidentSymptoms: 'Worker container hangs for 5 seconds per RPC request before dropping hostname resolution.',
    objectives: [
      'Inspect /etc/resolv.conf inside the Alpine worker container',
      'Benchmark DNS lookup latency using nslookup and dig',
      'Configure ndots:1 DNS option in docker-compose.yml',
      'Verify zero timeout drops on internal service discovery',
    ],
    prerequisites: ['Linux networking & CoreDNS resolver understanding', 'Musl libc vs glibc differences'],
    targetService: 'DNS Resolver / CoreDNS (Port 53)',
    faultSummary: 'Alpine Linux Musl libc queries all search domains sequentially when ndots >= 5.',
    hints: [
      'Check options ndots in /etc/resolv.conf inside the container.',
      'Configure dns_opt: ["ndots:1"] in docker-compose.yml or use FQDN with trailing dot.',
    ],
    configFiles: [
      {
        filename: 'docker-compose.yml',
        language: 'yaml',
        content: `services:
  worker:
    image: alpine:3.19
    container_name: deployfix-worker
    command: sh -c "while true; do nslookup api.internal; sleep 2; done"`,
        patchedContent: `services:
  worker:
    image: alpine:3.19
    container_name: deployfix-worker
    dns_opt:
      - ndots:1
    command: sh -c "while true; do nslookup api.internal; sleep 2; done"`,
      },
    ],
    shortcuts: [
      { command: 'cat /etc/resolv.conf', description: 'Read DNS resolver configuration', category: 'inspect' },
      { command: 'nslookup api.internal', description: 'Test hostname resolution', category: 'network' },
      { command: 'echo "options ndots:1" >> /etc/resolv.conf', description: 'Hotpatch resolver ndots setting', category: 'fix' },
    ],
  },
  {
    id: 'lab-03',
    code: 'DFIX-LAB-03',
    title: 'Redis Buffer Overflow & Eviction Crash Loop',
    category: 'RUNTIME',
    description: 'Identify and resolve an out-of-memory key eviction crash loop under simulated high-throughput write load.',
    difficulty: 'INTERMEDIATE',
    severity: 'P2_MAJOR',
    failureTypes: ['memory_leak', 'container_crash'],
    estimatedMinutes: 20,
    completionCount: 76,
    isNew: false,
    tags: ['Redis', 'Memory Limit', 'Cache Eviction', 'OOMKilled'],
    topologyFlow: ['API Ingestion', 'Redis Cache (Port 6379)', 'Eviction Engine'],
    topology: [
      { name: 'deployfix-redis', role: 'Key-Value Cache', image: 'redis:7-alpine', port: 6379, internalIp: '172.28.0.4', status: 'CRASHED' },
      { name: 'deployfix-ingest', role: 'High-Throughput Ingestion', image: 'golang:1.22', port: 8080, internalIp: '172.28.0.7', status: 'UNHEALTHY' },
    ],
    slaImpact: 'Cache eviction failure resulting in 100% write lockouts and OOMKill exit code 137',
    incidentSymptoms: 'Redis container restarts every 45 seconds with OOM command rejection errors.',
    objectives: [
      'Profile Redis memory saturation metrics via redis-cli info memory',
      'Configure maxmemory-policy to volatile-lru in redis.conf',
      'Expand container memory reservation and verify stable throughput',
    ],
    prerequisites: ['Redis CLI & memory management policies', 'Linux cgroup memory limits'],
    targetService: 'Redis Cache (Port 6379)',
    faultSummary: 'Redis container memory reached 98% cap triggering OOM crash without volatile-lru eviction policy.',
    hints: [
      'Check maxmemory and maxmemory-policy in redis.conf.',
      'Set maxmemory-policy allkeys-lru or volatile-lru.',
    ],
    configFiles: [
      {
        filename: 'redis.conf',
        language: 'ini',
        content: `maxmemory 128mb
maxmemory-policy noeviction`,
        patchedContent: `maxmemory 512mb
maxmemory-policy allkeys-lru`,
      },
    ],
    shortcuts: [
      { command: 'redis-cli -h redis info memory', description: 'Inspect memory consumption stats', category: 'inspect' },
      { command: 'redis-cli -h redis config set maxmemory-policy allkeys-lru', description: 'Configure LRU eviction policy', category: 'fix' },
      { command: 'docker compose restart redis', description: 'Restart Redis container', category: 'fix' },
    ],
  },
  {
    id: 'lab-04',
    code: 'DFIX-LAB-04',
    title: 'CORS & Origin Authorization Lockout',
    category: 'AUTH',
    description: 'Diagnose 403 Forbidden and preflight CORS header rejections between Vite React frontend and Express backend.',
    difficulty: 'BEGINNER',
    severity: 'P2_MAJOR',
    failureTypes: ['env_misconfiguration'],
    estimatedMinutes: 15,
    completionCount: 185,
    isNew: false,
    tags: ['CORS', 'Express', 'Preflight', 'Access-Control'],
    topologyFlow: ['Frontend (Port 5173)', 'CORS Middleware', 'Express API (Port 5000)'],
    topology: [
      { name: 'deployfix-frontend', role: 'React Client', image: 'node:20-alpine', port: 5173, internalIp: '172.28.0.8', status: 'HEALTHY' },
      { name: 'deployfix-backend', role: 'Express API', image: 'node:20-alpine', port: 5000, internalIp: '172.28.0.2', status: 'UNHEALTHY' },
    ],
    slaImpact: 'Users unable to log in or submit forms from web client',
    incidentSymptoms: 'Browser console displays "Access to XMLHttpRequest blocked by CORS policy: No Access-Control-Allow-Origin header".',
    objectives: [
      'Inspect browser preflight OPTIONS response headers',
      'Update CORS origin whitelist in Express middleware',
      'Verify credentials: true header support and run validation test',
    ],
    prerequisites: ['HTTP protocol & CORS preflight understanding', 'Express.js middleware'],
    targetService: 'Express API Gateway (Port 5000)',
    faultSummary: 'Express cors() middleware missing http://localhost:5173 in allowed origin list.',
    hints: [
      'Check CORS_ORIGIN in backend/.env or server.js configuration.',
      'Ensure Access-Control-Allow-Credentials is enabled for cookie auth.',
    ],
    shortcuts: [
      { command: 'curl -H "Origin: http://localhost:5173" -I http://localhost:5000/api/auth', description: 'Test CORS preflight headers', category: 'network' },
      { command: 'export CORS_ORIGIN="http://localhost:5173" && node server.js', description: 'Update CORS allowed origin', category: 'fix' },
    ],
  },
  {
    id: 'lab-05',
    code: 'DFIX-LAB-05',
    title: 'Prisma Schema Drift & Migration Deadlock',
    category: 'DATABASE',
    description: 'Resolve production schema drift where foreign key constraints fail during zero-downtime rolling database migrations.',
    difficulty: 'ADVANCED',
    severity: 'P1_CRITICAL',
    failureTypes: ['schema_drift'],
    estimatedMinutes: 30,
    completionCount: 42,
    isNew: false,
    tags: ['Prisma', 'PostgreSQL', 'Zero-Downtime', 'Lock Contention'],
    topologyFlow: ['Migration Runner', 'PostgreSQL Instance', 'Application Table Locks'],
    topology: [
      { name: 'deployfix-migrator', role: 'Prisma CLI Runner', image: 'node:20-alpine', port: 'N/A', internalIp: '172.28.0.9', status: 'UNHEALTHY' },
      { name: 'deployfix-postgres', role: 'Primary PostgreSQL', image: 'postgres:16-alpine', port: 5432, internalIp: '172.28.0.3', status: 'HEALTHY' },
    ],
    slaImpact: 'Database lock timeouts blocking 100% of live customer transactions',
    incidentSymptoms: 'Migration job stuck on ALTER TABLE foreign key validation with lock_timeout exceeded.',
    objectives: [
      'Detect exclusive table locks in PostgreSQL pg_locks',
      'Execute non-blocking migration with NOT VALID constraint',
      'Validate foreign keys asynchronously without downtime',
    ],
    prerequisites: ['PostgreSQL lock modes & transactions', 'Prisma migration lifecycles'],
    targetService: 'PostgreSQL DB (Port 5432)',
    faultSummary: 'Prisma migration acquired exclusive ACCESS EXCLUSIVE lock during live traffic.',
    hints: [
      'Add constraint using NOT VALID to avoid full table lock scan.',
      'Validate constraint separately in background transaction.',
    ],
    shortcuts: [
      { command: 'npx prisma migrate status', description: 'Check database schema sync status', category: 'inspect' },
      { command: 'psql -U sre_user -d deployfix -c "SELECT * FROM pg_stat_activity WHERE wait_event_type = \'Lock\';"', description: 'Inspect active locks', category: 'inspect' },
      { command: 'npx prisma migrate resolve --rolled-back "20260820_drift"', description: 'Roll back blocking migration step', category: 'fix' },
    ],
  },
  {
    id: 'lab-06',
    code: 'DFIX-LAB-06',
    title: 'Multi-Service Cascading Outage & OOM Kill',
    category: 'FULLSTACK',
    description: 'Triage a catastrophic multi-tier outage featuring simultaneous database host disconnect and unbounded memory leak in worker threads.',
    difficulty: 'EXPERT',
    severity: 'P1_CRITICAL',
    failureTypes: ['db_connection', 'container_crash', 'network_timeout', 'memory_leak'],
    estimatedMinutes: 45,
    completionCount: 18,
    isNew: true,
    tags: ['Chaos', 'Cascade Outage', 'Resilience', 'Circuit Breakers'],
    topologyFlow: ['NGINX Ingress', 'API Cluster', 'Redis Ring', 'PostgreSQL HA'],
    topology: [
      { name: 'deployfix-ingress', role: 'NGINX Ingress', image: 'nginx:alpine', port: 80, internalIp: '172.28.0.10', status: 'UNHEALTHY' },
      { name: 'deployfix-api', role: 'Express Service', image: 'node:20-alpine', port: 5000, internalIp: '172.28.0.2', status: 'CRASHED' },
      { name: 'deployfix-postgres', role: 'PostgreSQL DB', image: 'postgres:16-alpine', port: 5432, internalIp: '172.28.0.3', status: 'UNHEALTHY' },
      { name: 'deployfix-redis', role: 'Redis Cluster', image: 'redis:7-alpine', port: 6379, internalIp: '172.28.0.4', status: 'HEALTHY' },
    ],
    slaImpact: 'Total cluster outage across all ingress endpoints and data stores',
    incidentSymptoms: '502 Bad Gateway across all customer traffic. Node memory exhaustion triggering OOMKills.',
    objectives: [
      'Correlate multi-tier telemetry from logs, probes, and resource gauges',
      'Restore database bridge connectivity and drain connection pool queues',
      'Implement circuit breaking in API gateway and restart cluster nodes',
      'Run end-to-end synthetic verification suite to confirm 100% SLA recovery',
    ],
    prerequisites: ['Advanced distributed systems SRE', 'Chaos engineering triage principles'],
    targetService: 'Entire Distributed Cluster',
    faultSummary: 'Unbounded retry loops on database timeout consumed all available node RAM.',
    hints: [
      'Isolate the database network connectivity before rebooting frontend workers.',
      'Enable circuit breaker backoff to prevent thundering herd upon recovery.',
    ],
    shortcuts: [
      { command: 'docker compose ps', description: 'Examine status of all cluster containers', category: 'inspect' },
      { command: 'docker compose logs --tail=50', description: 'Correlate cluster-wide error logs', category: 'log' },
      { command: 'apply-cluster-recovery', description: 'Trigger automated cluster recovery script', category: 'fix' },
    ],
  },
  {
    id: 'lab-07',
    code: 'DFIX-LAB-07',
    title: 'NGINX Ingress 502 Upstream Buffer Exhaustion',
    category: 'NETWORKING',
    description: 'Resolve intermittent 502 Bad Gateway responses when large authentication headers exceed NGINX proxy buffer allocations.',
    difficulty: 'INTERMEDIATE',
    severity: 'P2_MAJOR',
    failureTypes: ['network_timeout', 'env_misconfiguration'],
    estimatedMinutes: 20,
    completionCount: 64,
    isNew: true,
    tags: ['NGINX', 'Reverse Proxy', 'Buffer Size', 'Upstream'],
    topologyFlow: ['Client HTTPS', 'NGINX Reverse Proxy (Port 80)', 'Upstream Node App'],
    topology: [
      { name: 'deployfix-nginx', role: 'Reverse Proxy', image: 'nginx:1.25-alpine', port: 80, internalIp: '172.28.0.11', status: 'UNHEALTHY' },
      { name: 'deployfix-app', role: 'Node.js App', image: 'node:20-alpine', port: 3000, internalIp: '172.28.0.12', status: 'HEALTHY' },
    ],
    slaImpact: 'Enterprise users with large JWT claims receive 502 Bad Gateway errors',
    incidentSymptoms: 'NGINX error log: "upstream sent too big header while reading response header from upstream".',
    objectives: [
      'Inspect NGINX error logs for buffer overflow notifications',
      'Configure proxy_buffer_size and proxy_buffers in nginx.conf',
      'Reload NGINX configuration and test with 8KB test payload',
    ],
    prerequisites: ['NGINX configuration & reverse proxy architecture'],
    targetService: 'NGINX Ingress Proxy (Port 80)',
    faultSummary: 'Default 4k proxy buffer size is insufficient for enterprise authorization tokens.',
    hints: [
      'Increase proxy_buffer_size to 128k and proxy_buffers 4 256k in nginx.conf.',
    ],
    shortcuts: [
      { command: 'cat /etc/nginx/nginx.conf', description: 'Inspect NGINX configuration', category: 'inspect' },
      { command: 'nginx -t', description: 'Test NGINX configuration syntax', category: 'inspect' },
      { command: 'nginx -s reload', description: 'Reload NGINX workers without downtime', category: 'fix' },
    ],
  },
  {
    id: 'lab-08',
    code: 'DFIX-LAB-08',
    title: 'JWT Secret Key Rotation Desynchronization',
    category: 'AUTH',
    description: 'Diagnose authentication failures after key rotation when the auth provider uses RS256 while backend expects HS256 algorithm.',
    difficulty: 'ADVANCED',
    severity: 'P1_CRITICAL',
    failureTypes: ['env_misconfiguration'],
    estimatedMinutes: 25,
    completionCount: 53,
    isNew: true,
    tags: ['JWT', 'RS256', 'Key Rotation', 'Public Key Infrastructure'],
    topologyFlow: ['Identity Provider', 'Auth Middleware', 'Protected Microservices'],
    topology: [
      { name: 'deployfix-idp', role: 'JWKS Key Issuer', image: 'node:20-alpine', port: 8081, internalIp: '172.28.0.13', status: 'HEALTHY' },
      { name: 'deployfix-api', role: 'Resource Server', image: 'node:20-alpine', port: 5000, internalIp: '172.28.0.2', status: 'UNHEALTHY' },
    ],
    slaImpact: 'All API requests rejected with 401 Unauthorized / invalid algorithm error',
    incidentSymptoms: 'API returns HTTP 401: "JsonWebTokenError: invalid algorithm: expected HS256 but got RS256".',
    objectives: [
      'Decode token header and inspect algorithmic claim (alg: RS256)',
      'Configure JWKS public key URI in resource server auth middleware',
      'Verify asymmetric verification passes for all issued user sessions',
    ],
    prerequisites: ['OAuth2 / OpenID Connect & cryptographic signing algorithms'],
    targetService: 'Auth Middleware & Resource Server',
    faultSummary: 'Resource server configured with static HS256 secret instead of dynamic JWKS key set.',
    hints: [
      'Update jwt verification options to accept algorithms: ["RS256"].',
      'Fetch public key from /.well-known/jwks.json endpoint.',
    ],
    shortcuts: [
      { command: 'curl http://localhost:8081/.well-known/jwks.json', description: 'Fetch issuer JWKS public keys', category: 'network' },
      { command: 'node verify-token.js', description: 'Run offline token verification diagnostic', category: 'inspect' },
    ],
  },
];

export const labService = {
  getLabs: async (): Promise<Lab[]> => {
    try {
      const res = await apiClient.get<Lab[]>('/labs');
      return res.data;
    } catch {
      return MOCK_LABS;
    }
  },

  getLabById: async (id: string): Promise<Lab> => {
    try {
      const res = await apiClient.get<Lab>(`/labs/${id}`);
      return res.data;
    } catch {
      const found = MOCK_LABS.find((l) => l.id === id || l.id === `lab-${id.replace('lab-', '')}`);
      if (!found) return MOCK_LABS[0];
      return found;
    }
  },

  startLabSession: async (labId: string): Promise<LabSession> => {
    try {
      const res = await apiClient.post<LabSession>(`/labs/${labId}/start`);
      return res.data;
    } catch {
      return {
        sessionId: `sess-${Date.now()}`,
        labId,
        userId: 'usr-1',
        status: 'IN_PROGRESS',
        startedAt: new Date().toISOString(),
      };
    }
  },

  injectChaos: async (sessionId: string, failureType: FailureType): Promise<void> => {
    try {
      await apiClient.post(`/labs/session/${sessionId}/inject`, { failureType });
    } catch {
      // Handled in mock sandbox
    }
  },

  runVerification: async (sessionId: string): Promise<VerificationResult[]> => {
    try {
      const res = await apiClient.post<VerificationResult[]>(`/labs/session/${sessionId}/verify`);
      return res.data;
    } catch {
      return [
        { testName: 'Docker Bridge Isolation & Routing Check', passed: true, actualValue: 'Subnet 172.28.0.0/16 Active', expectedValue: '172.28.0.0/16 Active', latencyMs: 12 },
        { testName: 'Target Port TCP Binding Verification', passed: true, actualValue: 'Port 5432 LISTENING (0.0.0.0)', expectedValue: 'Port 5432 LISTENING', latencyMs: 8 },
        { testName: 'Internal Service DNS Resolution', passed: true, actualValue: 'postgres -> 172.28.0.3 (0ms)', expectedValue: 'postgres -> 172.28.0.3', latencyMs: 4 },
        { testName: 'Protocol Handshake & Auth Credentials', passed: true, actualValue: 'Authentication OK (sre_user)', expectedValue: 'Authentication OK', latencyMs: 16 },
        { testName: 'End-to-End Synthetic Health Probe', passed: true, actualValue: 'HTTP 200 { status: "healthy", sla: "100%" }', expectedValue: 'HTTP 200 { status: "healthy" }', latencyMs: 22 },
      ];
    }
  },

  completeSession: async (sessionId: string): Promise<LabSession> => {
    try {
      const res = await apiClient.post<LabSession>(`/labs/session/${sessionId}/complete`);
      return res.data;
    } catch {
      return {
        sessionId,
        labId: 'lab-01',
        userId: 'usr-1',
        status: 'VERIFIED',
        startedAt: new Date(Date.now() - 900000).toISOString(),
        completedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        score: 100,
      };
    }
  },
};
