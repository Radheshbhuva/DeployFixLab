# 05 — DeployFix Lab: Chaos Labs Catalog Preview Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Chaos Labs Catalog Preview Specification |
| **Document ID** | DFIX-SPEC-021-05 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Component** | `ChaosLabsShowcase.tsx` |

---

## 1. Feature Purpose & Value Proposition

DeployFix Lab includes a **hands-on scenario runner with controlled chaos failure injection**. 

The landing page features a **live filterable catalog preview** allowing potential users to explore realistic failure scenarios, understand what gets broken in container sandboxes, and see how automated verification scripts confirm their recovery.

---

## 2. Mock Scenario Catalog Data Model

```typescript
export interface LabScenarioPreview {
  id: string;
  code: string;
  title: string;
  category: 'database' | 'docker' | 'networking' | 'auth';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  failureDriver: string;
  targetService: string;
  verificationScript: string;
  badgeColor: string;
}

export const LAB_SCENARIOS_PREVIEW: LabScenarioPreview[] = [
  {
    id: 'lab-01',
    code: 'DFIX-LAB-01',
    title: 'PostgreSQL Bridge Network Mismatch',
    category: 'database',
    difficulty: 'Beginner',
    durationMinutes: 15,
    description: 'Diagnose and remediate a container failure where the Express backend cannot reach PostgreSQL due to an invalid 127.0.0.1 loopback host config.',
    failureDriver: 'Chaos DB Host Mismatch Injection',
    targetService: 'postgres-db',
    verificationScript: 'docker-compose exec backend npm run test:db-conn',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'lab-02',
    code: 'DFIX-LAB-02',
    title: 'Nginx 502 Bad Gateway on Upstream Crash',
    category: 'networking',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    description: 'Reverse proxy returns 502 Bad Gateway after the upstream Node.js process experiences a memory leak and is killed by Linux OOM killer (exit code 137).',
    failureDriver: 'Chaos V8 Heap Memory Spike',
    targetService: 'nginx-proxy',
    verificationScript: 'curl -s -f http://localhost:80/api/health',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  {
    id: 'lab-03',
    code: 'DFIX-LAB-03',
    title: 'Dual-Container Host Port 3000 Collision',
    category: 'docker',
    difficulty: 'Beginner',
    durationMinutes: 10,
    description: 'Docker daemon fails to start the API gateway container because host port 3000 is concurrently allocated to the React frontend dev container.',
    failureDriver: 'Port Allocation Conflict Injector',
    targetService: 'docker-daemon',
    verificationScript: 'docker-compose ps --services --filter "status=running"',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'lab-04',
    code: 'DFIX-LAB-04',
    title: 'Prisma Migration Advisory Lock Deadlock',
    category: 'database',
    difficulty: 'Advanced',
    durationMinutes: 30,
    description: 'A deployment job hangs indefinitely because a previous aborted migration held an advisory lock on the Postgres database catalog.',
    failureDriver: 'Advisory Lock Contention Driver',
    targetService: 'postgres-db',
    verificationScript: 'npx prisma migrate status',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  {
    id: 'lab-05',
    code: 'DFIX-LAB-05',
    title: 'JWT Secret Rotation & Cookie Invalidation',
    category: 'auth',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    description: 'All authenticated requests fail with 401 Unauthorized after an environment update changes JWT_SECRET without rotating user refresh tokens.',
    failureDriver: 'JWT Token Invalidation Injector',
    targetService: 'auth-service',
    verificationScript: 'npm run test:auth-flow',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  {
    id: 'lab-06',
    code: 'DFIX-LAB-06',
    title: 'DNS Resolution Failure on Alpine Linux',
    category: 'networking',
    difficulty: 'Advanced',
    durationMinutes: 25,
    description: 'Musl libc DNS resolver inside an Alpine container fails to resolve internal Docker service names during high-concurrency connection spikes.',
    failureDriver: 'CoreDNS Packet Drop Simulation',
    targetService: 'dns-resolver',
    verificationScript: 'nslookup postgres.dfix-net',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  }
];
```

---

## 3. Component UI & Filtering Layout

```tsx
<section id="labs" className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-800/80">
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
    <div>
      <span className="text-violet-400 font-mono text-xs uppercase tracking-widest">Interactive Chaos Sandbox</span>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mt-2">Real Outages. Zero Production Risk.</h2>
      <p className="text-slate-400 max-w-xl mt-3 text-base">
        Browse containerized incident scenarios. Practice diagnosing, breaking, and verifying deployments in an isolated sandbox.
      </p>
    </div>

    {/* Category Filter Pills */}
    <div className="flex items-center gap-2 mt-6 md:mt-0 flex-wrap">
      {['ALL', 'DATABASE', 'DOCKER', 'NETWORKING', 'AUTH'].map(cat => (
        <button key={cat} className="px-3.5 py-1.5 rounded-lg text-xs font-mono border ...">
          {cat}
        </button>
      ))}
    </div>
  </div>

  {/* 3-Column Scenario Card Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Scenario Cards with Difficulty Badge, Duration, Failure Driver, and "Launch Lab" link */}
  </div>
</section>
```
