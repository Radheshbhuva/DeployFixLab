import { create } from 'zustand';

export interface LabScenario {
  id: string;
  title: string;
  category: 'DOCKER' | 'DATABASE' | 'NGINX' | 'SECURITY' | 'CICD';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  summary: string;
  problemStatement: string;
  symptoms: string[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED';
  verificationSteps: { id: string; label: string; passed: boolean }[];
}

interface LabState {
  labs: LabScenario[];
  activeLabId: string | null;
  setActiveLab: (id: string | null) => void;
  runProbeVerification: (labId: string) => void;
  resetLabState: (labId: string) => void;
}

const initialLabs: LabScenario[] = [
  {
    id: 'lab-001',
    title: 'FAIL-DB-04: Supabase Connection String Resolution & Network Isolation',
    category: 'DATABASE',
    difficulty: 'INTERMEDIATE',
    summary: 'Diagnose and fix database connection pool timeouts when switching from local Docker PostgreSQL to remote Supabase cloud PostgreSQL.',
    problemStatement: 'The API service fails to perform Prisma migrations on startup, outputting error P1001: Can\'t reach database server at db.supabase.co:5432.',
    symptoms: [
      'Express container crashes with code 1 during startup',
      'GET /health returns HTTP 500 Internal Server Error',
      'Prisma Client query engine throws ECONNREFUSED',
    ],
    status: 'IN_PROGRESS',
    verificationSteps: [
      { id: 'v1', label: 'Verify DATABASE_URL environment variable encoding', passed: true },
      { id: 'v2', label: 'Check outbound SSL/TLS connection parameters (?sslmode=require)', passed: true },
      { id: 'v3', label: 'Execute npx prisma db push against target instance', passed: false },
    ],
  },
  {
    id: 'lab-002',
    title: 'FAIL-NGINX-01: 502 Bad Gateway Reverse Proxy Loop',
    category: 'NGINX',
    difficulty: 'BEGINNER',
    summary: 'Fix Nginx upstream container routing configuration error causing 502 Bad Gateway responses on /api requests.',
    problemStatement: 'Nginx proxy container cannot resolve backend:5000 service hostname due to missing Docker Compose internal network declaration.',
    symptoms: [
      'Browser receives 502 Bad Gateway on all API calls',
      'Nginx error log: host not found in upstream backend:5000',
    ],
    status: 'NOT_STARTED',
    verificationSteps: [
      { id: 'v1', label: 'Inspect docker-compose network bridge definition', passed: false },
      { id: 'v2', label: 'Verify Nginx resolver directive and upstream port bindings', passed: false },
    ],
  },
  {
    id: 'lab-003',
    title: 'FAIL-SEC-02: Non-Root Execution Privilege Escalation Violation',
    category: 'SECURITY',
    difficulty: 'ADVANCED',
    summary: 'Harden container runtime security by eliminating root execution and read-only filesystem violations.',
    problemStatement: 'Container runtime security auditor rejects image build because process executes as root (UID 0) with write permissions to root filesystem.',
    symptoms: [
      'Security audit pipeline fails compliance check DFIX-SEC-102',
      'Process executes as root user inside production container',
    ],
    status: 'VERIFIED',
    verificationSteps: [
      { id: 'v1', label: 'Enforce USER nodejs (UID 10001) in multi-stage Dockerfile', passed: true },
      { id: 'v2', label: 'Mount tmpfs filesystem for /tmp directory', passed: true },
      { id: 'v3', label: 'Set read_only: true in docker-compose.yml', passed: true },
    ],
  },
];

export const useLabStore = create<LabState>((set) => ({
  labs: initialLabs,
  activeLabId: 'lab-001',
  setActiveLab: (activeLabId) => set({ activeLabId }),
  runProbeVerification: (labId) =>
    set((state) => ({
      labs: state.labs.map((lab) => {
        if (lab.id !== labId) return lab;
        const allPassed = true;
        const updatedSteps = lab.verificationSteps.map((step) => ({ ...step, passed: true }));
        return { ...lab, status: allPassed ? 'VERIFIED' : 'FAILED', verificationSteps: updatedSteps };
      }),
    })),
  resetLabState: (labId) =>
    set((state) => ({
      labs: state.labs.map((lab) =>
        lab.id === labId
          ? {
              ...lab,
              status: 'IN_PROGRESS',
              verificationSteps: lab.verificationSteps.map((s, idx) => ({ ...s, passed: idx === 0 })),
            }
          : lab
      ),
    })),
}));
