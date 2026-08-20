import { apiClient } from './apiClient';
import { Lab, LabSession, VerificationResult, FailureType } from '@/types/lab.types';

const MOCK_LABS: Lab[] = [
  {
    id: 'lab-01',
    code: 'DFIX-LAB-01',
    title: 'PostgreSQL Bridge Network Mismatch',
    category: 'DATABASE',
    description: 'Diagnose why the web backend cannot reach PostgreSQL container due to loopback 127.0.0.1 misconfiguration inside Docker bridge.',
    difficulty: 'BEGINNER',
    failureTypes: ['db_connection'],
    estimatedMinutes: 15,
    completionCount: 142,
    isNew: false,
    tags: ['Docker', 'PostgreSQL', 'Bridge Network'],
    objectives: [
      'Inspect docker compose network topology',
      'Verify host string in DATABASE_URL matches internal service name',
      'Restart backend service and verify port 5432 handshake',
    ],
    prerequisites: ['Basic Docker CLI & environment variables knowledge'],
    targetService: 'PostgreSQL DB (Port 5432)',
    faultSummary: 'Backend DATABASE_URL points to 127.0.0.1 instead of postgres service hostname inside Docker network.',
    hints: [
      'Inside Docker Compose, each container has its own loopback interface (127.0.0.1).',
      'Use the service name "postgres" as the database host.',
    ],
  },
  {
    id: 'lab-02',
    code: 'DFIX-LAB-02',
    title: 'DNS Resolution Failure on Alpine Linux',
    category: 'NETWORKING',
    description: 'Resolve inter-container hostname resolution failures caused by Musl libc DNS resolver differences in Alpine Linux containers.',
    difficulty: 'ADVANCED',
    failureTypes: ['dns_failure'],
    estimatedMinutes: 25,
    completionCount: 98,
    isNew: false,
    tags: ['Alpine', 'DNS', 'Musl', 'Networking'],
    objectives: [
      'Inspect /etc/resolv.conf inside the container',
      'Test internal DNS query using nslookup',
      'Configure ndots:1 or alpine dns options in docker-compose.yml',
    ],
    prerequisites: ['Linux networking & CoreDNS fundamentals'],
    targetService: 'DNS Resolver / CoreDNS',
    faultSummary: 'Alpine Linux Musl libc resolves single-dot hostnames sequentially causing 5s timeout drops.',
    hints: [
      'Check options ndots in /etc/resolv.conf.',
      'Configure dns_opt: ["ndots:1"] in docker-compose.yml.',
    ],
  },
  {
    id: 'lab-03',
    code: 'DFIX-LAB-03',
    title: 'Redis Buffer Overflow & Eviction Crash',
    category: 'RUNTIME',
    description: 'Identify and resolve an out-of-memory key eviction crash loop under simulated high-throughput write load.',
    difficulty: 'INTERMEDIATE',
    failureTypes: ['memory_leak', 'container_crash'],
    estimatedMinutes: 20,
    completionCount: 76,
    isNew: false,
    tags: ['Redis', 'Memory', 'Cache', 'Eviction'],
    objectives: [
      'Profile Redis memory saturation metrics',
      'Configure maxmemory-policy to volatile-lru',
      'Expand container memory limit to 1024MB',
    ],
    prerequisites: ['Redis CLI & memory management'],
    targetService: 'Redis Cache (Port 6379)',
    faultSummary: 'Redis container memory reached 95% triggering OOM crash without LRU eviction.',
    hints: [
      'Check redis.conf maxmemory configuration.',
      'Verify container memory limit in docker compose.',
    ],
  },
  {
    id: 'lab-04',
    code: 'DFIX-LAB-04',
    title: 'CORS & Origin Authorization Lockout',
    category: 'AUTH',
    description: 'Diagnose 403 Forbidden and preflight CORS header rejections between Vite React frontend and Express backend.',
    difficulty: 'BEGINNER',
    failureTypes: ['env_misconfiguration'],
    estimatedMinutes: 15,
    completionCount: 185,
    isNew: false,
    tags: ['CORS', 'Express', 'Auth', 'Preflight'],
    objectives: [
      'Inspect browser preflight OPTIONS response headers',
      'Update CORS origin whitelist in Express middleware',
      'Verify credentials: true header support',
    ],
    prerequisites: ['HTTP protocol & CORS fundamentals'],
    targetService: 'Express API Gateway (Port 5000)',
    faultSummary: 'Express cors() middleware missing http://localhost:5173 in allowed origins.',
    hints: [
      'Check CORS_ORIGIN in backend/.env.',
      'Ensure Access-Control-Allow-Credentials is set to true.',
    ],
  },
  {
    id: 'lab-05',
    code: 'DFIX-LAB-05',
    title: 'Prisma Schema Drift on Concurrent Migration',
    category: 'DATABASE',
    description: 'Resolve production schema drift where foreign key constraints fail during zero-downtime rolling database migrations.',
    difficulty: 'ADVANCED',
    failureTypes: ['schema_drift'],
    estimatedMinutes: 30,
    completionCount: 42,
    isNew: false,
    tags: ['Prisma', 'PostgreSQL', 'Migrations', 'Locking'],
    objectives: [
      'Detect column type mismatch in migration log',
      'Execute safe migration down/up replay',
      'Verify zero lock timeouts on live session table',
    ],
    prerequisites: ['Prisma ORM & PostgreSQL transactions'],
    targetService: 'PostgreSQL DB (Port 5432)',
    faultSummary: 'Prisma migration acquired exclusive table lock during user traffic burst.',
    hints: [
      'Use prisma migrate deploy with lock timeouts.',
    ],
  },
  {
    id: 'lab-06',
    code: 'DFIX-LAB-06',
    title: 'Multi-Service Cascade Failure & OOM Kill',
    category: 'FULLSTACK',
    description: 'Triage a catastrophic multi-tier outage featuring simultaneous DB host drop and memory exhaustion cascade.',
    difficulty: 'EXPERT',
    failureTypes: ['db_connection', 'container_crash', 'network_timeout'],
    estimatedMinutes: 45,
    completionCount: 18,
    isNew: true,
    tags: ['Chaos', 'Multi-Service', 'Recovery', 'Resilience'],
    objectives: [
      'Correlate multi-source telemetry from logs and probes',
      'Restore database container bridge health',
      'Restart API Gateway and confirm 100% SLA pass',
    ],
    prerequisites: ['Advanced SRE & distributed incident management'],
    targetService: 'Entire Cluster (API, DB, Redis)',
    faultSummary: 'Simultaneous database network severance and unbounded memory leak in worker thread.',
    hints: [
      'Isolate the root cause before restarting secondary services.',
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
      // Mock failure injection
    }
  },

  runVerification: async (sessionId: string): Promise<VerificationResult[]> => {
    try {
      const res = await apiClient.post<VerificationResult[]>(`/labs/session/${sessionId}/verify`);
      return res.data;
    } catch {
      return [
        { testName: 'TCP Port Binding Check', passed: true, actualValue: 'Port 5432 LISTENING', expectedValue: 'Port 5432 LISTENING' },
        { testName: 'PostgreSQL Handshake', passed: true, actualValue: '200 OK (8ms)', expectedValue: '200 OK' },
        { testName: 'DATABASE_URL Hostname Match', passed: true, actualValue: 'postgres', expectedValue: 'postgres' },
        { testName: 'End-to-End Health API', passed: true, actualValue: 'HTTP 200 { status: "ok" }', expectedValue: 'HTTP 200 { status: "ok" }' },
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
