import {
  SampleIncident,
  ContextSourceData,
  LabScenarioPreview,
  PricingPlan,
  TestimonialItem,
  FaqItem,
  LogStreamEntry
} from '../types/landing.types';

export const SAMPLE_INCIDENTS: SampleIncident[] = [
  {
    id: 'postgres-conn',
    title: 'PostgreSQL Connection Refused',
    badge: 'DATABASE',
    severity: 'critical',
    evidence: [
      { source: 'CONTAINER LOG', text: 'FATAL: connect ECONNREFUSED 127.0.0.1:5432', iconName: 'Terminal', severity: 'critical' },
      { source: 'DOCKER COMPOSE', text: 'Service "backend" attempts connection to localhost instead of bridge hostname "postgres"', iconName: 'Box', severity: 'major' },
      { source: 'URL PROBE', text: 'GET https://api.prod/health -> HTTP 500 Internal Error (340ms)', iconName: 'Globe', severity: 'warning' },
      { source: 'ENV AUDIT', text: 'DATABASE_URL="postgresql://user:***@127.0.0.1:5432/app" [Secrets Redacted]', iconName: 'ShieldCheck', severity: 'info' }
    ],
    rootCause: 'Backend is configured to connect to 127.0.0.1 (container loopback) instead of the Docker bridge network hostname "postgres".',
    confidenceScore: 94,
    confidenceTier: 'HIGH',
    remediationTitle: 'Update Database Hostname in Container Environment',
    remediationCommand: 'sed -i "s/127.0.0.1/postgres/" .env && docker-compose restart backend',
    codeDiff: '- DATABASE_URL=postgresql://postgres:pass@127.0.0.1:5432/app\n+ DATABASE_URL=postgresql://postgres:pass@postgres:5432/app'
  },
  {
    id: 'nginx-upstream',
    title: 'Nginx 502 Bad Gateway (OOM Kill)',
    badge: 'NETWORKING & MEMORY',
    severity: 'critical',
    evidence: [
      { source: 'NGINX ACCESS', text: '10.0.0.1 - "GET /api/v1/tasks" 502 157 "-" (0.004s)', iconName: 'Globe', severity: 'critical' },
      { source: 'NGINX ERROR', text: 'connect() failed (111: Connection refused) while connecting to upstream backend:3000', iconName: 'Terminal', severity: 'major' },
      { source: 'DOCKER HEALTH', text: 'Container "backend-api" entered CrashLoopBackoff (OOMKilled exit code 137)', iconName: 'AlertTriangle', severity: 'critical' }
    ],
    rootCause: 'Upstream Node.js process crashed due to V8 heap out-of-memory error during JSON serialization.',
    confidenceScore: 91,
    confidenceTier: 'HIGH',
    remediationTitle: 'Increase Container Memory Limit & Node Max Old Space',
    remediationCommand: 'docker update --memory=2g backend-api && docker restart backend-api',
    codeDiff: '- deploy.resources.limits.memory: 512M\n+ deploy.resources.limits.memory: 2048M\n+ environment: NODE_OPTIONS="--max-old-space-size=1536"'
  },
  {
    id: 'port-collision',
    title: 'Dual-Container Port 3000 Collision',
    badge: 'DOCKER COMPOSE',
    severity: 'major',
    evidence: [
      { source: 'DOCKER DAEMON', text: 'driver failed programming external connectivity: Bind for 0.0.0.0:3000 failed: port is already allocated', iconName: 'Box', severity: 'major' },
      { source: 'COMPOSE AUDIT', text: 'Both frontend dev server and backend API gateway declare host port 3000:3000', iconName: 'GitBranch', severity: 'major' }
    ],
    rootCause: 'Host port 3000 is concurrently claimed by the frontend preview container and backend API gateway.',
    confidenceScore: 98,
    confidenceTier: 'HIGH',
    remediationTitle: 'Remap API Gateway Host Port to 5000',
    remediationCommand: 'docker-compose up -d --force-recreate backend',
    codeDiff: '- ports:\n-   - "3000:3000"\n+ ports:\n+   - "5000:3000"'
  }
];

export const CONTEXT_SOURCES_DATA: ContextSourceData[] = [
  {
    id: 'url',
    title: 'Website URL & Live Health Probes',
    badge: 'LIVE TELEMETRY',
    iconName: 'Globe',
    description: 'Executes non-invasive HTTP GET probes, DNS resolution queries, SSL handshake validations, and latency audits against live deployment endpoints.',
    capabilities: [
      'Automatic HTTP status code detection (200, 404, 500, 502, 504)',
      'TLS certificate expiry and cipher validation',
      'Response latency & TTFB distribution tracking',
      'Security header presence audit (HSTS, CSP, X-Frame-Options)'
    ],
    securityNote: 'Read-only probes with configurable timeouts (max 5000ms). Zero payload transmission.',
    codeSnippet: `// Live Probe Execution
curl -I --connect-timeout 3 https://staging.app.io/api/health

HTTP/2 502 Bad Gateway
server: nginx/1.25.3
date: Wed, 19 Aug 2026 12:00:00 GMT
x-deployfix-latency: 412ms
x-upstream-status: 111 Connection Refused`,
    previewMetrics: [
      { label: 'HTTP Status', value: '502 Bad Gateway', status: 'warn' },
      { label: 'Latency', value: '412ms', status: 'neutral' },
      { label: 'TLS Cert', value: 'Valid (248 days)', status: 'good' }
    ]
  },
  {
    id: 'files',
    title: 'Multi-File Config & Log Ingestion',
    badge: 'ZERO-SECRET AUDIT',
    iconName: 'FileCode',
    description: 'Upload Dockerfiles, docker-compose.yml, Nginx configurations, and application server logs. Automated regex engine detects and strips secrets before ingestion.',
    capabilities: [
      'Multi-stage Dockerfile layer optimization check',
      'Docker Compose service dependency and network audit',
      'Instant regex stripping of JWT keys, DB passwords, and AWS tokens',
      'Drag-and-drop batch upload with size and MIME validation'
    ],
    securityNote: 'Client-side secret redaction ensures plain-text credentials never leave the browser.',
    codeSnippet: `# Docker Compose Ingestion (Sanitized)
version: "3.8"
services:
  backend:
    build: ./backend
    environment:
      DATABASE_URL: "postgresql://postgres:[REDACTED]@postgres:5432/app"
      JWT_SECRET: "[REDACTED_32_BYTES]"
    ports:
      - "5000:5000"`,
    previewMetrics: [
      { label: 'Secrets Filtered', value: '2 Redacted', status: 'good' },
      { label: 'Compose Valid', value: '3 Services', status: 'good' },
      { label: 'Log Lines', value: '1,420 Lines', status: 'neutral' }
    ]
  },
  {
    id: 'github',
    title: 'GitHub Repository Context',
    badge: 'VCS CORRELATION',
    iconName: 'GitBranch',
    description: 'Correlate recent git commits, pull request file diffs, and GitHub Actions CI/CD workflows against the exact moment an incident occurred.',
    capabilities: [
      'Branch and commit SHA pinning for exact reproducibility',
      'CI/CD workflow YAML step failure inspection',
      'Changed file tree inspection to identify recent code regressions',
      'Direct linking to offending PR lines'
    ],
    securityNote: 'Uses scoped GitHub Personal Access Tokens or public repo URL read permissions.',
    codeSnippet: `// Commit Diff Ingested (SHA: a7782aa)
diff --git a/backend/src/config/database.ts b/backend/src/config/database.ts
- host: process.env.DB_HOST || "postgres"
+ host: "127.0.0.1" // ERROR: breaks inside container!`,
    previewMetrics: [
      { label: 'Recent Commits', value: '5 Inspected', status: 'neutral' },
      { label: 'Offending Diff', value: 'Line 14 Found', status: 'warn' },
      { label: 'CI Status', value: 'Failed on Step 3', status: 'warn' }
    ]
  }
];

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

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Community Developer',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Essential deployment troubleshooting for individual developers and students.',
    features: [
      '5 standard Docker & DB chaos scenarios',
      'Client-side multi-source evidence audit',
      'Local container execution sandbox',
      'Standard diagnostic confidence metrics',
      'Community Discord support'
    ],
    ctaLabel: 'Get Started Free',
    ctaHref: '/register'
  },
  {
    id: 'pro',
    name: 'Pro Engineer',
    badge: 'MOST POPULAR',
    isPopular: true,
    priceMonthly: 29,
    priceAnnual: 24,
    description: 'Complete diagnostic suite with unlimited AI root-cause correlation and live telemetry.',
    features: [
      'All 15+ containerized chaos scenarios',
      'Unlimited 4-source AI diagnostic runs',
      'Real-time WebSocket log stream with filters',
      'Automated code diff patch generation',
      'Zero-secret regex redaction engine',
      'Interactive guided recovery playbooks',
      'Priority incident support'
    ],
    ctaLabel: 'Launch Pro Sandbox',
    ctaHref: '/register?plan=pro'
  },
  {
    id: 'team',
    name: 'Team & Enterprise',
    priceMonthly: 99,
    priceAnnual: 79,
    description: 'Advanced incident training and custom failure injection for engineering teams.',
    features: [
      'Everything in Pro for entire team',
      'Custom chaos scenario builder & injector',
      'Cohort & student progress telemetry',
      'CI/CD automated incident replay runner',
      'Role-based access control (Admin / Instructor)',
      'SAML SSO & Audit logging',
      'Dedicated SRE support & custom integrations'
    ],
    ctaLabel: 'Contact Enterprise',
    ctaHref: 'mailto:enterprise@deployfixlab.io'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Sarah Chen',
    role: 'Principal SRE',
    company: 'CloudScale Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    quote: 'DeployFix Lab cut our junior onboarding time in half. Instead of explaining network bridge errors repeatedly, new hires diagnose container crash loops in realistic sandboxes.',
    metricHighlight: '70% Faster SRE Onboarding'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Lead DevOps Architect',
    company: 'Nexus FinTech',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    quote: 'The 4-source correlation engine is revolutionary. It caught a subtle Nginx upstream timeout caused by Docker internal DNS in seconds—an error that took our team 3 hours during our last outage.',
    metricHighlight: '3hr Outage Resolved in 30s'
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Fullstack Engineering Lead',
    company: 'Veloce Data',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    quote: 'Zero-Secret filtering was our non-negotiable requirement. DeployFix guarantees our AWS keys and DB tokens never leak, while delivering accurate code diff patches.',
    metricHighlight: '100% Secret-Safe Diagnosis'
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does DeployFix Lab protect sensitive environment secrets?',
    answer: 'DeployFix Lab utilizes a multi-layer regex redaction engine on the client side before any payload is submitted. Variables such as DATABASE_URL, AWS_SECRET_ACCESS_KEY, JWT_SECRET, and private keys are matched against strict patterns and replaced with sanitized placeholders like [REDACTED_32_BYTES]. Raw credentials never leave your browser.',
    category: 'Security'
  },
  {
    id: 'faq-2',
    question: 'How is DeployFix Lab different from ChatGPT or generic LLMs?',
    answer: 'Generic LLMs only see raw text pasted into a chat prompt and frequently hallucinate confident but ungrounded advice. DeployFix Lab correlates 3 structured layers (Website URL probes, Docker/Nginx configurations, and git commit histories) using deterministic rules and mathematical evidence scoring. Every diagnosis includes verifiable evidence and capped confidence bounds.',
    category: 'Engine'
  },
  {
    id: 'faq-3',
    question: 'Can I run DeployFix Lab entirely on my local machine?',
    answer: 'Yes! DeployFix Lab is built with full local Docker Compose support. You can clone the repository, run docker-compose up, and execute complete failure injection labs and diagnostic flows within your local container network.',
    category: 'Deployment'
  },
  {
    id: 'faq-4',
    question: 'What runtime environments and technologies are supported?',
    answer: 'DeployFix Lab supports Node.js, Express, React, Vite, Next.js, Python FastAPI, PostgreSQL, Redis, Nginx, and Docker Compose.',
    category: 'Compatibility'
  },
  {
    id: 'faq-5',
    question: 'What is the Capped Confidence Score?',
    answer: 'Confidence scores represent mathematical evidence sufficiency. If only 1 source is provided (e.g. only a URL error), the score is capped at 60% (Moderate). Providing 3 or more correlated sources unlocks high confidence (>90%) with concrete code diff remediation.',
    category: 'Engine'
  }
];

export const MOCK_LIVE_LOGS: LogStreamEntry[] = [
  { timestamp: '12:00:01.120', level: 'INFO', source: 'nginx', message: 'Proxy initialized. Upstream mapped to backend:3000' },
  { timestamp: '12:00:01.450', level: 'INFO', source: 'backend', message: 'Express API initialized on port 3000 in development' },
  { timestamp: '12:00:02.102', level: 'WARN', source: 'backend', message: 'Database connection retry 1/5 timed out after 2000ms' },
  { timestamp: '12:00:04.110', level: 'FATAL', source: 'backend', message: 'connect ECONNREFUSED 127.0.0.1:5432' },
  { timestamp: '12:00:04.115', level: 'ERROR', source: 'nginx', message: 'Upstream backend:3000 connection lost. Emitting HTTP 502 Bad Gateway' },
  { timestamp: '12:00:05.000', level: 'INFO', source: 'chaos', message: 'Chaos failure injected: [Vector: DB_HOST_MISMATCH]' },
  { timestamp: '12:01:10.400', level: 'INFO', source: 'backend', message: 'DATABASE_URL updated to postgres:5432. Connected OK' },
  { timestamp: '12:01:10.510', level: 'INFO', source: 'health', message: 'Readiness probe returned HTTP 200 OK (14ms)' }
];
