# 08 — AI Evaluation & Benchmark Strategy

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Evaluation & Benchmark Strategy                                |
| **Document ID**     | DFIX-AI-008                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & Reliability Architect                            |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Purpose

The **AI Evaluation Engine** (`ai/evaluation/`) provides a systematic framework to measure, benchmark, and continuously validate the diagnostic quality of the DeployFix AI system.

Without evaluation infrastructure, there is no way to:
- Know if a prompt change improved or degraded accuracy
- Detect regression when upgrading AI models
- Prove diagnostic accuracy claims to users
- Ensure hallucination rates remain below acceptable thresholds

This module provides the tooling, datasets, scenarios, and metrics to answer these questions with quantitative, reproducible results.

---

## 2. Evaluation Suite Structure

```
ai/evaluation/
|
+-- datasets/
|   +-- sample-dataset.json         # Pre-recorded EvidencePayload objects
|   +-- docker-failures.json        # Docker-specific failure evidence set
|   +-- database-failures.json      # Database-specific failure evidence set
|   +-- networking-failures.json    # Network failure evidence set
|   +-- mixed-failures.json         # Compound multi-component failure set
|
+-- scenarios/
|   +-- sample-scenario.json        # Scenario definition format reference
|   +-- scenario-001-db-conn.json   # DB connection refused scenario
|   +-- scenario-002-port-mismatch.json  # Docker port mismatch scenario
|   +-- scenario-003-missing-env.json    # Missing env var scenario
|   +-- scenario-004-oom-kill.json       # Container OOM scenario
|   +-- scenario-005-nginx-proxy.json    # Nginx upstream failure scenario
|   +-- scenario-006-migration.json      # Prisma migration failure scenario
|
+-- expected-diagnoses/
|   +-- sample-expected.json        # Expected output format reference
|   +-- expected-001.json           # Ground truth for scenario-001
|   +-- expected-002.json           # Ground truth for scenario-002
|   +-- ... (one per scenario)
|
+-- evaluation-runner.ts            # Main benchmark execution harness
+-- metrics.ts                      # Metric calculation functions
+-- README.md                       # How to run evaluations
```

---

## 3. Evaluation Dataset Schema

```typescript
// ai/evaluation/schemas.ts

export interface EvaluationScenario {
  id: string;                     // e.g. "scenario-001-db-conn"
  name: string;                   // Human-readable scenario name
  description: string;            // What failure this scenario tests
  failureDomain: FailureDomain;   // 'DB' | 'NET' | 'INFRA' | 'CONFIG' | 'APP' | 'SEC'
  expectedSeverity: DiagnosisSeverity;
  evidencePayload: EvidencePayload;  // Pre-recorded evidence (secrets already redacted)
  projectContext: ProjectContext;    // Pre-built project context for this scenario
  tags: string[];                 // e.g. ["docker", "postgres", "connection-refused"]
  chaosInjectionMethod: string;   // How the failure was injected for recording
}

export interface ExpectedDiagnosis {
  scenarioId: string;
  acceptableRootCauseKeywords: string[];  // Keywords that must appear in rootCause.description
  acceptableSeverities: DiagnosisSeverity[];
  minimumConfidenceScore: number;          // e.g. 75
  requiredEvidenceTypes: EvidenceType[];   // Evidence types that must be cited
  prohibitedHallucinationTerms: string[];  // Terms that must NOT appear (hallucination check)
  maximumResponseTimeMs: number;           // e.g. 30000
}
```

---

## 4. Key Target Metrics

| Metric | Target Threshold | How Measured |
|--------|-----------------|-------------|
| **Diagnostic Accuracy** | >= 95% | Percentage of scenarios where top diagnosis root cause matches expected keywords |
| **Severity Precision** | >= 98% | Percentage of scenarios where `severity` matches `expectedSeverity` |
| **Root Cause Keyword Match** | >= 90% | At least 2 of `acceptableRootCauseKeywords` appear in `rootCause.description` |
| **Hallucination Rate** | <= 1% | Percentage of diagnoses mentioning `prohibitedHallucinationTerms` or non-existent files |
| **Confidence Calibration** | R^2 >= 0.85 | Correlation between `confidence.score` and actual accuracy across scenarios |
| **Recovery Step Usefulness** | >= 95% | Percentage of recovery playbooks where at minimum 80% of steps are applicable |
| **Mean Response Time** | <= 15,000ms | Average `metadata.processingTimeMs` across all scenarios |
| **P95 Response Time** | <= 25,000ms | 95th percentile response time |
| **Rules-Only Coverage** | >= 70% | Percentage of scenarios resolved by Layer 1 without LLM call |

---

## 5. Evaluation Runner Architecture

```typescript
// ai/evaluation/evaluation-runner.ts

class EvaluationRunner {
  constructor(
    private diagnosisEngine: DiagnosisEngine,
    private scenarios: EvaluationScenario[],
    private expectedDiagnoses: Map<string, ExpectedDiagnosis>
  ) {}

  async runAll(): Promise<EvaluationReport>
  async runScenario(scenario: EvaluationScenario): Promise<ScenarioResult>
  async runBySeverity(severity: DiagnosisSeverity): Promise<EvaluationReport>
  async runByDomain(domain: FailureDomain): Promise<EvaluationReport>
}

interface ScenarioResult {
  scenarioId: string;
  passed: boolean;
  actualDiagnosis: AIDiagnosisOutput;
  expectedDiagnosis: ExpectedDiagnosis;
  metrics: {
    keywordMatch: boolean;
    severityMatch: boolean;
    hallucinationDetected: boolean;
    confidenceScore: number;
    responseTimeMs: number;
    usedAIProvider: boolean;   // false if rules-only resolved it
  };
  failureReason?: string;       // Populated if passed === false
}

interface EvaluationReport {
  runId: string;
  timestamp: string;
  totalScenarios: number;
  passed: number;
  failed: number;
  accuracyRate: number;           // passed / total
  hallucinationRate: number;
  meanResponseTimeMs: number;
  p95ResponseTimeMs: number;
  rulesOnlyCoverageRate: number;
  perDomainResults: Record<FailureDomain, DomainMetrics>;
  failedScenarios: ScenarioResult[];
}
```

---

## 6. Hallucination Detection

Hallucination is the AI generating diagnoses that reference evidence, files, or components that do not exist in the actual `EvidencePayload` or `ProjectContext`.

### Detection Methods

| Method | Implementation |
|--------|---------------|
| **Prohibited term check** | Compare `rootCause.affectedFile` against actual files in ProjectContext |
| **Evidence citation check** | Verify each cited evidence item exists in the actual EvidencePayload |
| **Component plausibility check** | Verify `rootCause.component` corresponds to a real service in topology |
| **Command validity check** | Check recovery step commands reference real services/files in context |
| **Prohibited keyword scan** | Scan output for `prohibitedHallucinationTerms` from expected diagnosis |

### Hallucination Rate Calculation

```
hallucination_rate = diagnoses_with_hallucination / total_diagnoses * 100

Target: <= 1%
If hallucination_rate > 1%: Prompt engineering revision required before release
If hallucination_rate > 5%: Model/provider evaluation required
```

---

## 7. Confidence Calibration Analysis

A well-calibrated confidence score means: when the AI says "90% confident," it should be correct ~90% of the time.

The evaluation runner produces a **calibration curve** by grouping diagnoses into confidence bands and measuring actual accuracy in each band:

| Confidence Band | Expected Accuracy | Calibration Pass |
|----------------|-------------------|-----------------|
| 0–49% | < 50% | R^2 >= 0.85 across all bands |
| 50–79% | 50–79% | |
| 80–89% | >= 80% | |
| 90–100% | >= 90% | |

If the calibration R² drops below 0.85, the confidence engine weights must be recalibrated.

---

## 8. Chaos Failure Injection — Scenario Recording Process

New evaluation scenarios are recorded by:

1. **Inject a known failure** into a local Docker Compose deployment using the `troubleshooting/` chaos scripts
2. **Capture evidence** by running the evidence collection pipeline and saving the output
3. **Record ground truth** — document the exact root cause, severity, and recovery steps
4. **Create scenario files** in `ai/evaluation/scenarios/` and `ai/evaluation/expected-diagnoses/`
5. **Verify scenario** by running evaluation-runner and confirming the AI produces matching output

### Covered Failure Scenarios (V1 Target: 20 scenarios)

| ID | Failure | Domain |
|----|---------|--------|
| 001 | DATABASE_URL points to localhost instead of postgres | CONFIG |
| 002 | Docker port mapping mismatch (backend EXPOSE vs host port) | NET |
| 003 | Missing required environment variable (DATABASE_URL absent) | CONFIG |
| 004 | Container OOM killed — insufficient memory limit | INFRA |
| 005 | Nginx proxying to wrong backend port | NET |
| 006 | Prisma migration not applied — relation does not exist | DB |
| 007 | PostgreSQL container not on correct Docker network | NET |
| 008 | Backend crashes on startup — Module not found | APP |
| 009 | PostgreSQL password authentication failed | DB |
| 010 | SSL certificate expired or invalid hostname | SEC |
| 011 | Docker build fails — COPY instruction references missing file | INFRA |
| 012 | Container crash loop — exit code 1, restart count > 3 | INFRA |
| 013 | DNS resolution failure — container hostname not found | NET |
| 014 | Frontend cannot reach backend API — CORS misconfiguration | NET |
| 015 | Docker Compose depends_on not set — startup race condition | INFRA |
| 016 | Backend port 4000 not exposed in docker-compose.yml | NET |
| 017 | Nginx upstream connection timeout | NET |
| 018 | Wrong CPU architecture image (arm64 on amd64 host) | INFRA |
| 019 | Environment variable value has trailing whitespace | CONFIG |
| 020 | Prisma schema drift — applied migrations don't match schema | DB |

---

## 9. Evaluation Execution & CI/CD Integration

### Local Execution

```bash
# Run all scenarios against mock provider (no API key needed)
AI_PROVIDER=mock npx ts-node ai/evaluation/evaluation-runner.ts

# Run all scenarios against OpenAI (requires OPENAI_API_KEY)
AI_PROVIDER=openai npx ts-node ai/evaluation/evaluation-runner.ts

# Run specific domain only
AI_PROVIDER=mock npx ts-node ai/evaluation/evaluation-runner.ts --domain DB
```

### CI/CD Integration

The evaluation runner runs automatically in CI/CD on every PR that touches `ai/` code:

```yaml
# .github/workflows/ai-evaluation.yml
- name: Run AI Evaluation Suite
  env:
    AI_PROVIDER: mock
  run: npx ts-node ai/evaluation/evaluation-runner.ts --ci

# CI gate: Fails if accuracyRate < 0.95 or hallucinationRate > 0.01
```

---

## 10. Evaluation Report — Target Acceptance Criteria

Before any production release, the evaluation report MUST show:

| Metric | Minimum Required |
|--------|-----------------|
| Diagnostic Accuracy | >= 95% |
| Hallucination Rate | <= 1% |
| Confidence Calibration R² | >= 0.85 |
| Mean Response Time | <= 15,000ms |
| Rules-Only Coverage | >= 70% |
| Severity Precision | >= 98% |

If any metric falls below the required threshold, the release is blocked until the issue is resolved.

---

*This document is the authoritative reference for the AI evaluation framework. All new evaluation scenarios must follow the schema defined in Section 3. New acceptance thresholds require team consensus and an update to this document.*
