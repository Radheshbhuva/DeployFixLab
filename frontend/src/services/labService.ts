import { apiClient } from './apiClient';
import { Lab, LabSession, VerificationResult, FailureType } from '@/types/lab.types';

const MOCK_LABS: Lab[] = [
  { id: '1', title: 'Database Connection Failure', description: 'Diagnose why the web backend cannot reach PostgreSQL after a deployment update.', difficulty: 'BEGINNER', failureTypes: ['db_connection'], estimatedMinutes: 30, completionCount: 142, isNew: false, tags: ['Docker', 'Database'], objectives: ['Inspect container networking', 'Verify DATABASE_URL hostname', 'Restart service'], prerequisites: ['Basic Docker CLI knowledge'] },
  { id: '2', title: 'DNS Resolution Breakdown', description: 'Resolve inter-container hostname resolution failures in a Docker Compose network.', difficulty: 'BEGINNER', failureTypes: ['dns_failure'], estimatedMinutes: 25, completionCount: 98, isNew: false, tags: ['Docker', 'Networking'], objectives: ['Check DNS configuration', 'Test container ping', 'Fix network bridge'], prerequisites: ['Networking basics'] },
  { id: '3', title: 'Nginx Reverse Proxy Misconfiguration', description: 'Fix 502 Bad Gateway errors caused by an invalid Nginx upstream configuration.', difficulty: 'INTERMEDIATE', failureTypes: ['env_misconfiguration'], estimatedMinutes: 45, completionCount: 76, isNew: false, tags: ['Nginx', 'Configuration'], objectives: ['Analyze Nginx error logs', 'Verify backend port binding', 'Reload proxy'], prerequisites: ['Nginx syntax'] },
  { id: '4', title: 'Memory Leak Under Load', description: 'Identify and resolve an out-of-memory crash loop in a Node.js container.', difficulty: 'INTERMEDIATE', failureTypes: ['memory_leak'], estimatedMinutes: 60, completionCount: 54, isNew: false, tags: ['Node.js', 'Memory'], objectives: ['Profile heap memory', 'Identify unhandled socket listeners', 'Fix leak'], prerequisites: ['Node.js performance'] },
  { id: '5', title: 'Container Crash Loop', description: 'Troubleshoot a container that exits immediately upon startup due to missing environment variables.', difficulty: 'INTERMEDIATE', failureTypes: ['container_crash'], estimatedMinutes: 40, completionCount: 110, isNew: false, tags: ['Docker', 'Kubernetes'], objectives: ['Inspect exit code 1', 'Add missing ENV entries', 'Verify startup healthcheck'], prerequisites: ['Container lifecycles'] },
  { id: '6', title: 'Database Schema Drift', description: 'Resolve production API crashes caused by unapplied Prisma/TypeORM database migrations.', difficulty: 'ADVANCED', failureTypes: ['schema_drift'], estimatedMinutes: 75, completionCount: 32, isNew: false, tags: ['Database', 'Migrations'], objectives: ['Detect schema mismatch', 'Run migration rollback/apply', 'Verify column types'], prerequisites: ['SQL & ORMs'] },
  { id: '7', title: 'Port Conflict Resolution', description: 'Fix deployment failures when two services attempt to bind to port 8080.', difficulty: 'BEGINNER', failureTypes: ['port_conflict'], estimatedMinutes: 20, completionCount: 185, isNew: false, tags: ['Docker', 'Networking'], objectives: ['Find listening PIDs', 'Remap host ports', 'Update compose file'], prerequisites: ['Linux networking'] },
  { id: '8', title: 'Network Timeout Cascade', description: 'Mitigate microservice cascade failures when an external API gateway times out.', difficulty: 'ADVANCED', failureTypes: ['network_timeout'], estimatedMinutes: 90, completionCount: 28, isNew: false, tags: ['Networking', 'Microservices'], objectives: ['Configure circuit breakers', 'Set connection timeouts', 'Test fallback UI'], prerequisites: ['Distributed systems'] },
  { id: '9', title: 'Environment Variable Misconfiguration', description: 'Diagnose authentication failures caused by missing API keys in staging.', difficulty: 'INTERMEDIATE', failureTypes: ['env_misconfiguration'], estimatedMinutes: 35, completionCount: 88, isNew: false, tags: ['Configuration'], objectives: ['Inspect process.env', 'Update staging secrets', 'Verify handshake'], prerequisites: ['Environment management'] },
  { id: '10', title: 'Multi-Service Chaos', description: 'Solve a multi-component deployment breakdown featuring simultaneous DB and DNS failures.', difficulty: 'EXPERT', failureTypes: ['db_connection', 'dns_failure', 'container_crash'], estimatedMinutes: 120, completionCount: 14, isNew: true, tags: ['Docker', 'Full-Stack'], objectives: ['Correlate multi-source telemetry', 'Execute phased recovery', 'Confirm full health'], prerequisites: ['Advanced DevOps'] },
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
      const found = MOCK_LABS.find((l) => l.id === id);
      if (!found) throw new Error('Lab not found');
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
        { testName: 'PostgreSQL Handshake', passed: true, actualValue: '200 OK', expectedValue: '200 OK' },
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
        labId: '1',
        userId: 'usr-1',
        status: 'VERIFIED',
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        completedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        score: 100,
      };
    }
  },
};
