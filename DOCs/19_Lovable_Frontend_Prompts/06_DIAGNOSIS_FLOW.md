# 06 — AI Diagnosis Flow Specification for Antigravity

> **Prerequisites:** Specifications 00–05 must be reviewed first.
> This specification details the flagship AI Diagnosis Flow — evidence collection, root cause diagnosis, recovery steps, and verification checklist to implement in Antigravity.

---

## CONTEXT: What the AI Diagnosis Flow Does

The Diagnosis Flow is DeployFix Lab's most important feature. It is NOT a chatbot.
It is a structured, evidence-based diagnosis system:

1. **User provides context sources** (GitHub URL, production URL, files, logs, config)
2. **System collects and analyzes evidence** across all provided sources
3. **Diagnosis Engine runs** — correlates evidence, identifies root cause
4. **Output is a structured diagnosis** — not a paragraph of text, but a structured card:
   - Root Cause (clear, specific)
   - Evidence List (with source references)
   - Confidence Score (0–100%)
   - Recovery Steps (step-by-step guide)
   - Verification Checklist (how to confirm recovery)

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Build the AI Diagnosis Flow for DeployFix Lab. This is the product's flagship feature — a structured, wizard-based diagnosis interface. It is NOT a chat interface. It is a step-by-step evidence collection → diagnosis → recovery guide flow.

---

DIAGNOSIS TYPES (src/types/diagnosis.types.ts):

export type EvidenceSourceType = 
  'GITHUB_URL' | 'PRODUCTION_URL' | 'DOCKERFILE' | 'DOCKER_COMPOSE' | 
  'ENV_FILE' | 'LOG_TEXT' | 'CONFIG_FILE' | 'DEPLOYMENT_LOG' | 'FREE_TEXT';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';

export interface EvidenceSource {
  id: string;
  type: EvidenceSourceType;
  label: string;             // e.g. "GitHub Repository", "Production URL"
  value: string;             // The actual URL, text, or file content
  isRequired: boolean;
}

export interface DiagnosisEvidence {
  finding: string;           // e.g. "Backend logs contain ECONNREFUSED to 127.0.0.1:5432"
  source: EvidenceSourceType;
  sourceLabel: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
}

export interface RecoveryStep {
  stepNumber: number;
  title: string;
  description: string;
  command?: string;           // optional shell command to run
  verification?: string;      // how to verify this step worked
}

export interface DiagnosisOutput {
  id: string;
  sessionId?: string;
  createdAt: string;
  problem: string;            // Clear problem statement: "Backend cannot connect to PostgreSQL"
  rootCause: string;          // The single root cause: "DATABASE_URL points to localhost instead of postgres service"
  confidenceScore: number;    // 0–100
  confidenceLevel: ConfidenceLevel;
  evidence: DiagnosisEvidence[];
  recoverySteps: RecoveryStep[];
  verificationChecklist: string[];
  affectedServices: string[];
}

export interface DiagnosisRequest {
  sources: EvidenceSource[];
  projectName?: string;
  additionalContext?: string;
}

---

DIAGNOSIS SERVICE (src/services/diagnosisService.ts):

  submitDiagnosis(request: DiagnosisRequest): Promise<DiagnosisOutput>
    — POST /api/v1/diagnosis/analyze
    — This is a potentially slow operation (5–30 seconds while AI processes)
    — Returns the full DiagnosisOutput

  getDiagnosisHistory(userId: string): Promise<DiagnosisOutput[]>
    — GET /api/v1/diagnosis/history

---

DIAGNOSIS STORE (src/store/diagnosisStore.ts):

Zustand:
  sources: EvidenceSource[]
  isAnalyzing: boolean
  currentDiagnosis: DiagnosisOutput | null
  diagnosisHistory: DiagnosisOutput[]
  error: string | null
  
  addSource(source): void
  removeSource(id): void
  updateSource(id, value): void
  setAnalyzing(bool): void
  setDiagnosis(output): void
  clearDiagnosis(): void
  setError(msg): void

---

DIAGNOSIS PAGE (src/features/diagnosis/DiagnosisPage.tsx):

Layout: AppLayout wrapper.
This page has TWO main states:
  State A: INPUT FORM (when no active diagnosis)
  State B: DIAGNOSIS RESULTS (when diagnosis is complete)

---

STATE A — INPUT FORM:

Page header:
  - Title: "AI Diagnosis Engine" in text-3xl font-bold
  - Subtitle: "Provide your project context. DeployFix will analyze the evidence and diagnose the root cause." in text-text-secondary

Section 1 — Project Name (optional):
  - Input: "Project Name (optional)" placeholder "e.g. MyShop Backend"

Section 2 — Evidence Sources (the main input area):

  Show a grid of source cards. Each source type is its own card:
  
  SourceCard component (src/features/diagnosis/components/SourceCard.tsx):
    Props: sourceType: EvidenceSourceType, label, description, icon, isAdded, onAdd, onRemove
    
    Visual:
    - Not added: Card with dashed border (border-dashed border-slate-600), icon + label + description, "+ Add" button
    - Added: Card with solid border-brand-primary, shows input/textarea for the value, "Remove" button
    - On "+ Add": expand the card inline to show the input field (smooth height animation)

  Show these 6 source type cards:
  
  1. GitHub Repository
     Icon: Github (Lucide)
     Description: "Connect your GitHub repository for code and config analysis"
     Input: URL field, placeholder "https://github.com/yourorg/yourrepo"
  
  2. Production URL  
     Icon: Globe
     Description: "Your live production URL for health check analysis"
     Input: URL field, placeholder "https://your-app.com"
  
  3. Dockerfile
     Icon: Container (or Box)
     Description: "Paste your Dockerfile contents for container configuration analysis"
     Input: Textarea, 8 rows, monospace font, placeholder "FROM node:18-alpine..."
  
  4. Docker Compose
     Icon: Layers
     Description: "Paste your docker-compose.yml for service orchestration analysis"
     Input: Textarea, 8 rows, monospace font, placeholder "version: '3.8'\nservices:..."
  
  5. Deployment Logs
     Icon: ScrollText
     Description: "Paste recent deployment or build logs for error pattern analysis"
     Input: Textarea, 10 rows, monospace font, terminal-style background (#0D1117)
  
  6. Free Text Description
     Icon: MessageSquare
     Description: "Describe the problem in your own words"
     Input: Textarea, 5 rows, placeholder "e.g. My backend container keeps crashing with connection errors..."

  Validation: at least ONE source must be added before submitting.

Section 3 — Submit:

  "Analyze Deployment" button — Primary variant — full width — with Brain icon
  
  When clicked:
  - Validate at least 1 source is added
  - If not: show red error message "Please add at least one context source before analyzing"
  - If valid: transition to ANALYZING STATE

ANALYZING STATE (between form and results):

  Full-page overlay or inline replacement of the form:
  - Large animated icon (rotating Loader2 or a custom animated "thinking" icon)
  - Title: "Analyzing Your Deployment..." in text-xl
  - Animated status messages that cycle every 2 seconds:
    "Reading evidence sources..."
    "Analyzing configuration files..."
    "Correlating error patterns..."
    "Identifying root cause..."
    "Calculating confidence score..."
    "Generating recovery guide..."
  - Subtle progress bar (indeterminate, animated)
  - "This may take 10–30 seconds depending on evidence complexity." in text-text-muted text-sm
  - Mock: after 4 seconds, transition to results (use setTimeout for demo)

---

STATE B — DIAGNOSIS RESULTS:

When diagnosis is complete, show the full DiagnosisOutput in a structured layout.

DIAGNOSIS OUTPUT CARD:

  Main card: bg-surface, rounded-xl, p-8, border border-slate-600

  HEADER BAR:
    Left: "Diagnosis Report" text + timestamp
    Right: ConfidenceScore badge — large, prominent:
      - 80–100: big green badge "94% Confident — HIGH"
      - 50–79: amber badge "65% Confident — MEDIUM"  
      - 20–49: red badge "35% Confident — LOW"
      - 0–19: slate badge "INSUFFICIENT DATA"

  PROBLEM STATEMENT SECTION:
    Label: "Problem Identified" in text-xs uppercase text-text-secondary
    Value: diagnosis.problem in text-xl font-semibold text-text-primary
    (e.g., "Backend cannot connect to PostgreSQL database")

  ROOT CAUSE SECTION:
    Label: "Root Cause" in text-xs uppercase text-text-secondary with a Target icon
    Value: diagnosis.rootCause in text-lg font-medium text-status-danger
    (e.g., "DATABASE_URL environment variable points to localhost instead of the Docker service hostname 'postgres'")

  EVIDENCE SECTION:
    Label: "Supporting Evidence" with a ListChecks icon
    Each DiagnosisEvidence as an EvidenceItem:
      - Left: severity dot (critical=red, major=amber, minor=blue, info=slate)
      - Finding text in text-sm text-text-primary
      - Source label in text-xs text-text-muted "[from Deployment Logs]"

  AFFECTED SERVICES:
    Label: "Affected Services"
    Pills showing each affected service name (bg-slate-700 rounded-full px-3 py-1 text-sm)

  RECOVERY GUIDE SECTION:
    Label: "Recovery Steps" with a Wrench icon
    Numbered step list:
      Each RecoveryStep as a card:
        - Step number circle (blue filled circle)
        - Title in font-semibold
        - Description in text-sm text-text-secondary
        - If command exists: show in a terminal block (bg-[#0D1117] rounded-md p-3 font-mono text-terminal-green text-sm with a copy button)
        - If verification exists: show in italic text-slate-400 "✓ Verify: ..."

  VERIFICATION CHECKLIST:
    Label: "Verification Checklist" with a CheckSquare icon
    Interactive checkboxes (click to mark complete):
      Each verificationChecklist item with a checkbox
      When all checked: show "All verifications complete" with a green celebration banner

  ACTION BUTTONS ROW (bottom):
    - "New Diagnosis" (Ghost) — clears state, goes back to form
    - "Save Report" (Ghost) — mock save to history
    - "Copy Report" (Ghost with Copy icon) — copies formatted report to clipboard
    - "Run Lab on This Issue" (Primary) — links to the relevant lab if matched

---

MOCK DIAGNOSIS OUTPUT (for demo when API not connected):

{
  problem: "Backend cannot connect to PostgreSQL database",
  rootCause: "DATABASE_URL environment variable references 'localhost:5432' but inside Docker Compose, the PostgreSQL service is accessible via hostname 'postgres', not 'localhost'.",
  confidenceScore: 94,
  confidenceLevel: 'HIGH',
  evidence: [
    { finding: "Backend container logs show: ECONNREFUSED 127.0.0.1:5432", source: 'DEPLOYMENT_LOG', severity: 'critical' },
    { finding: "PostgreSQL container health check is passing (status: healthy)", source: 'DOCKER_COMPOSE', severity: 'info' },
    { finding: "DATABASE_URL in docker-compose.yml set to localhost:5432", source: 'DOCKER_COMPOSE', severity: 'critical' },
    { finding: "Backend service depends_on: postgres is declared but DATABASE_URL host is incorrect", source: 'DOCKER_COMPOSE', severity: 'major' }
  ],
  recoverySteps: [
    { stepNumber: 1, title: "Update DATABASE_URL", description: "Change your DATABASE_URL from 'localhost' to 'postgres' (the Docker service name)", command: "DATABASE_URL=postgresql://user:password@postgres:5432/mydb", verification: "Confirm DATABASE_URL host is 'postgres'" },
    { stepNumber: 2, title: "Restart Backend Container", description: "Apply the environment variable change by restarting the backend service", command: "docker-compose restart backend", verification: "Run: docker-compose ps and confirm backend is 'Up'" },
    { stepNumber: 3, title: "Verify Database Connectivity", description: "Check that the backend can now connect to PostgreSQL", command: "docker-compose exec backend node -e \"require('./src/db').testConnection()\"", verification: "Should output: 'Database connection successful'" },
    { stepNumber: 4, title: "Run Health Check", description: "Confirm the full stack is healthy", command: "curl http://localhost:3000/api/v1/health", verification: "Should return: { status: 'ok' }" }
  ],
  verificationChecklist: [
    "DATABASE_URL updated to use Docker service hostname 'postgres'",
    "Backend container restarted successfully",
    "Backend health endpoint returns 200 OK",
    "PostgreSQL connection test passes",
    "Application functions end-to-end correctly"
  ],
  affectedServices: ["backend-api", "postgresql"]
}
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `src/features/diagnosis/DiagnosisPage.tsx`
- `src/features/diagnosis/components/SourceCard.tsx`
- `src/features/diagnosis/components/DiagnosisOutputCard.tsx`
- `src/features/diagnosis/components/EvidenceItem.tsx`
- `src/features/diagnosis/components/RecoveryStepCard.tsx`
- `src/store/diagnosisStore.ts`
- `src/services/diagnosisService.ts`
- `src/types/diagnosis.types.ts`
