# 04 — Diagnosis Engine Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Diagnosis Engine Specification                                    |
| **Document ID**     | DFIX-AI-004                                                       |
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

The **Diagnosis Engine** (`ai/diagnosis/`) is Stage 5 of the DeployFix AI pipeline and the **central intelligence core** of the entire system.

It receives the normalized `EvidencePayload` and `ProjectContext`, evaluates them against the Deterministic Rules Engine, correlates symptoms with root causes, optionally invokes an AI provider for complex reasoning, and produces a fully structured, Zod-validated **`AIDiagnosisOutput`** object.

The diagnosis engine embodies the core DeployFix philosophy:

```
Deterministic first. AI second. Human always approves.
```

---

## 2. Full Diagnostic Pipeline

```
INPUTS
  - ProjectContext (from ai/context/)
  - EvidencePayload (from ai/evidence/)
           |
           v
STEP 1 — DETERMINISTIC RULES EVALUATION
  (ai/rules/ — Layer 1)
  - Each rule evaluator receives EvidencePayload + ProjectContext
  - Returns RuleMatch[] array (matched rules with severity + confidence boost)
  - 100% reproducible — same inputs always produce same rule outputs
           |
           v
STEP 2 — EVIDENCE CORRELATION
  (ai/diagnosis/evidence-correlator.ts — Layer 2)
  - Cross-references log signals, health probe results, Docker states,
    and config analysis into symptom clusters
  - Builds a symptom-to-cause linkage graph
  - Computes initial confidence score component from multi-signal agreement
  - Output: CorrelatedEvidence[] with linkage metadata
           |
  _________|_________
 |                   |
 v                   v
Layer 1 resolved?   Layer 1 UNRESOLVED or insufficient confidence
 |                   |
 v                   v
SKIP Layer 3     STEP 3 — AI PROVIDER REASONING
                  (ai/providers/ — Layer 3)
                  - Constructs prompt: system.prompt + context summary
                    + correlated evidence JSON + rule outputs
                  - Calls IAIProvider.diagnose()
                  - Receives structured JSON response
                  - Validates JSON structure before accepting
           |
           v
STEP 4 — ROOT CAUSE ENGINE
  (ai/diagnosis/root-cause-engine.ts)
  - Pinpoints specific fault: file path, env var name, Docker service,
    config key, or line number
  - Assigns fault ownership (frontend, backend, database, proxy, infrastructure)
  - Selects primary root cause from ranked candidates
           |
           v
STEP 5 — CONFIDENCE ENGINE
  (ai/diagnosis/confidence-engine.ts)
  - Aggregates confidence components:
      base score (rule match quality)
    + evidence completeness bonus
    + multi-signal verification bonus
    + AI reasoning certainty score (if Layer 3 invoked)
    - novelty penalty (if failure pattern is unusual)
  - Clamps output to 0-100%
  - Assigns confidence rating: LOW (<50%) | MEDIUM (50-79%) | HIGH (>=80%)
           |
           v
STEP 6 — SCHEMA VALIDATION
  (ai/diagnosis/diagnosis-schema.ts)
  - Zod-validates full AIDiagnosisOutput
  - Enforces: autoRemediationAllowed = false
  - Throws DiagnosisValidationError if schema violated
           |
           v
OUTPUT: AIDiagnosisOutput (validated JSON)
```

---

## 3. Module Responsibilities

### 3.1 `diagnosis-engine.ts` — Main Orchestrator

The entry point for all diagnosis requests. Coordinates all pipeline steps in sequence.

**Interface:**
```typescript
class DiagnosisEngine {
  constructor(
    private ruleEngine: RuleEngine,
    private evidenceCorrelator: EvidenceCorrelator,
    private rootCauseEngine: RootCauseEngine,
    private confidenceEngine: ConfidenceEngine,
    private aiProvider: IAIProvider
  ) {}

  async diagnose(
    context: ProjectContext,
    evidence: EvidencePayload
  ): Promise<AIDiagnosisOutput>
}
```

**Orchestration Rules:**
- If `evidence.completeness < 30%`: Abort diagnosis and return a `CONTEXT_INSUFFICIENT` error
- If `ruleMatches.length > 0` AND top rule confidence >= 80%: Skip Layer 3 AI call
- If `ruleMatches.length === 0` OR top rule confidence < 60%: Invoke Layer 3

---

### 3.2 `evidence-correlator.ts` — Evidence Correlation Engine

Builds a **symptom linkage graph** connecting observable symptoms to candidate root causes.

**Symptom Cluster Examples:**

| Symptom Cluster | Candidate Root Causes | Confidence Boost |
|----------------|----------------------|-----------------|
| `[HEALTH 500] + [LOG ECONNREFUSED 5432]` | Database connection failure | +25% |
| `[DOCKER exit 137] + [LOG OOMKilled]` | Container OOM kill — insufficient memory limit | +30% |
| `[HTTP 502] + [DOCKER unhealthy backend]` | Backend crashed; Nginx upstream unreachable | +35% |
| `[LOG MISSING_ENV_VAR DATABASE_URL] + [HEALTH 500]` | Missing required environment variable | +40% |
| `[CONFIG NGINX_PORT_MISMATCH] + [HTTP 502]` | Nginx proxying to wrong backend port | +35% |
| `[LOG P3006] + [DOCKER postgres healthy]` | Migration not applied to running DB | +30% |
| `[LOG EXEC_FORMAT] + [DOCKER exit 1]` | Wrong CPU architecture image (arm64 vs amd64) | +20% |

---

### 3.3 `root-cause-engine.ts` — Root Cause Pinpointer

Translates correlated evidence into a specific, actionable root cause statement.

**Root Cause Output Fields:**

| Field | Type | Example |
|-------|------|---------|
| `component` | string | `"Backend Service (.env)"` |
| `description` | string | `"DATABASE_URL points to localhost instead of Docker service name 'postgres'"` |
| `affectedFile` | string (optional) | `"apps/backend/.env"` |
| `affectedLine` | number (optional) | `7` |
| `faultyValue` | string (optional) | `"postgresql://dfix:secret@localhost:5432/deployfix_db"` |
| `correctValue` | string (optional) | `"postgresql://dfix:secret@postgres:5432/deployfix_db"` |

**Root Cause Ranking:** When multiple candidate root causes exist, the engine ranks by:
1. Evidence signal confidence boost sum
2. Rule match severity
3. Number of independent evidence sources confirming the cause

---

### 3.4 `confidence-engine.ts` — Confidence Score Calculator

Computes a calibrated confidence percentage for the diagnosis.

**Confidence Composition:**

| Component | Weight | Condition |
|-----------|--------|-----------|
| Base rule match score | Up to 40% | Proportional to highest matching rule's built-in confidence |
| Evidence completeness bonus | Up to 20% | Based on `EvidencePayload.completeness` |
| Multi-signal verification bonus | Up to 25% | For each independently verified signal confirming root cause |
| AI reasoning certainty score | Up to 20% | From AI provider's self-reported confidence (if Layer 3 invoked) |
| Novelty penalty | -15% max | Applied when failure pattern is rare or novel |

**Confidence Rating Map:**

| Score | Rating | Recommended Action |
|-------|--------|--------------------|
| 80–100% | HIGH | Present diagnosis with high confidence |
| 50–79% | MEDIUM | Present with caveat: "Review evidence before acting" |
| 0–49% | LOW | Present with warning: "Collect more evidence; this is uncertain" |

---

### 3.5 `diagnosis-schema.ts` — Zod Schema Enforcement

Validates all `AIDiagnosisOutput` objects before they leave the diagnosis engine.

**Key Schema Rules:**
- `severity` must be one of: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `confidence.score` must be a number 0–100
- `evidence` array must have at least 1 item
- `recovery.steps` must be a non-empty ordered array
- `autoRemediationAllowed` must be `false` (hardcoded invariant in V1)
- All `string` fields must be non-empty (no empty string diagnostics)

---

## 4. Failure Classification Taxonomy

The diagnosis engine classifies all failures into one of 6 canonical failure domains:

| Domain | Code | Examples |
|--------|------|---------|
| **Infrastructure** | `INFRA` | Container crash loop, OOM kill, Docker build failure |
| **Network** | `NET` | DNS failure, port mismatch, connection refused, proxy misconfiguration |
| **Database** | `DB` | Connection refused, migration failure, auth failure, relation missing |
| **Configuration** | `CONFIG` | Missing .env variable, wrong hostname, invalid YAML |
| **Application** | `APP` | Module not found, uncaught exception, startup script failure |
| **Security** | `SEC` | SSL certificate failure, auth rejection, permission denied |

---

## 5. Diagnosis Decision Matrix

```
Evidence Available?   Rule Match?   AI Invoked?   Output
      YES               YES (>=80%)    NO          HIGH confidence diagnosis
      YES               YES (<80%)     YES         MEDIUM-HIGH diagnosis (AI supplements rules)
      YES               NO             YES         MEDIUM diagnosis (AI-only, rules found nothing)
      PARTIAL           YES            NO          MEDIUM diagnosis (with completeness warning)
      PARTIAL           NO             YES         LOW diagnosis (AI with incomplete evidence)
      NO                NO             NO          ERROR: Insufficient evidence to diagnose
```

---

## 6. Error Handling

| Error | Type | Behavior |
|-------|------|----------|
| Evidence completeness < 30% | `InsufficientEvidenceError` | Return error to caller; do not generate diagnosis |
| AI provider timeout (>30s) | `AIProviderTimeoutError` | Fall back to rules-only diagnosis with LOW confidence |
| AI provider returns invalid JSON | `AIResponseParseError` | Discard AI output; use rules-only diagnosis |
| Zod schema validation failure | `DiagnosisValidationError` | Log error, do not return invalid diagnosis to frontend |
| All rules return no match AND AI disabled | `NoDiagnosisError` | Return diagnostic with severity=LOW, message="Pattern not recognized" |

---

*This specification is the authoritative reference for `ai/diagnosis/`. The `AIDiagnosisOutput` schema defined here must remain synchronized with `ai/schemas/diagnosis.schema.ts` and `ai/diagnosis/diagnosis-schema.ts`. Schema changes require a version bump in this document and an ADR entry.*
