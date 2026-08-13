import { apiClient } from './apiClient';
import { DiagnosisRequest, DiagnosisOutput } from '@/types/diagnosis.types';

const MOCK_DIAGNOSIS_OUTPUT: DiagnosisOutput = {
  id: 'diag-9428',
  createdAt: new Date().toISOString(),
  problem: 'Backend API container cannot establish a connection to PostgreSQL database',
  rootCause: "The DATABASE_URL environment variable inside docker-compose.yml is configured as 'postgresql://user:pass@localhost:5432/db'. Inside Docker container networks, 'localhost' points to the backend container itself rather than the dedicated PostgreSQL container service ('postgres').",
  confidenceScore: 94,
  confidenceLevel: 'HIGH',
  evidence: [
    { finding: 'Backend container logs report: ECONNREFUSED 127.0.0.1:5432 on startup', source: 'DEPLOYMENT_LOG', sourceLabel: 'Deployment Logs', severity: 'critical' },
    { finding: 'PostgreSQL container is running and healthy on internal port 5432', source: 'DOCKER_COMPOSE', sourceLabel: 'Docker Compose', severity: 'info' },
    { finding: "DATABASE_URL environment variable host is set to 'localhost'", source: 'ENV_FILE', sourceLabel: 'Environment Variables', severity: 'critical' },
    { finding: "Docker Compose service name is declared as 'postgres'", source: 'DOCKER_COMPOSE', sourceLabel: 'Docker Compose', severity: 'major' },
  ],
  recoverySteps: [
    { stepNumber: 1, title: 'Update DATABASE_URL Hostname', description: "Change the DATABASE_URL host from 'localhost' to the Docker Compose service name 'postgres'.", command: 'DATABASE_URL=postgresql://user:password@postgres:5432/mydb', verification: "Verify DATABASE_URL contains '@postgres:5432/'" },
    { stepNumber: 2, title: 'Restart Backend Container', description: 'Recreate the backend container so it picks up the updated environment variable.', command: 'docker-compose up -d --force-recreate backend', verification: "Run: docker-compose ps backend and confirm status is 'Up'" },
    { stepNumber: 3, title: 'Test Database Connection', description: 'Execute an internal ping command to verify database connectivity from the backend container.', command: 'docker-compose exec backend nc -zv postgres 5432', verification: "Output should state: 'postgres (172.20.0.3:5432) open'" },
    { stepNumber: 4, title: 'Confirm Application Health', description: 'Query the backend health check endpoint to confirm end-to-end operational recovery.', command: 'curl -i http://localhost:3000/api/v1/health', verification: "HTTP Response status code must be 200 OK with body { status: 'healthy' }" },
  ],
  verificationChecklist: [
    "DATABASE_URL updated to use Docker service hostname 'postgres'",
    'Backend container recreated and running without restart loops',
    'Backend logs confirm successful database connection handshake',
    'Application health check returns 200 OK',
    'End-to-end API endpoints responding normally',
  ],
  affectedServices: ['backend-api', 'postgresql-database', 'nginx-proxy'],
};

export const diagnosisService = {
  submitDiagnosis: async (request: DiagnosisRequest): Promise<DiagnosisOutput> => {
    try {
      const res = await apiClient.post<DiagnosisOutput>('/diagnosis/analyze', request);
      return res.data;
    } catch {
      // Simulate AI thinking latency for realistic demo
      await new Promise((resolve) => setTimeout(resolve, 3500));
      return MOCK_DIAGNOSIS_OUTPUT;
    }
  },

  getDiagnosisHistory: async (): Promise<DiagnosisOutput[]> => {
    try {
      const res = await apiClient.get<DiagnosisOutput[]>('/diagnosis/history');
      return res.data;
    } catch {
      return [MOCK_DIAGNOSIS_OUTPUT];
    }
  },
};
