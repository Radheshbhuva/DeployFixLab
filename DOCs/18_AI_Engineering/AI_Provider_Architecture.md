# 06 — AI Provider Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Provider Architecture Specification                            |
| **Document ID**     | DFIX-AI-006                                                       |
| **Version**         | 2.0.0                                                             |
| **Status**          | Approved — Active                                                 |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

## 1. Overview & Purpose

The **AI Provider Architecture** (`ai/providers/`) defines a **vendor-agnostic abstraction layer** for all LLM interactions in the DeployFix system.

The core principle is **dependency inversion** — the `DiagnosisEngine` never depends directly on OpenAI or any specific AI model. It depends on the `IAIProvider` interface. Concrete implementations are injected at runtime based on environment configuration.

### Why This Matters

| Without Provider Abstraction | With Provider Abstraction |
|-----------------------------|--------------------------|
| Switching from OpenAI to Anthropic requires modifying DiagnosisEngine | Switching providers = swap one injected instance |
| Running tests requires real API keys and real API calls | MockProvider runs tests offline with zero latency |
| Provider failures crash the diagnosis pipeline | Fallback providers can be registered transparently |
| Model version upgrades need code changes throughout | Upgrade in one provider file only |

---

## 2. Provider Architecture Diagram

```
Diagnosis Engine
     |
     | (injects at runtime based on PROVIDER env var)
     v
IAIProvider Interface (ai/providers/ai-provider.ts)
     |
     +-- openai-provider.ts     (Production)
     |     OpenAI GPT-4o / GPT-4o-mini
     |     Structured JSON output via function calling
     |
     +-- mock-provider.ts       (Testing / Local Dev)
     |     Zero-latency deterministic responses
     |     No API key required
     |
     +-- [anthropic-provider.ts] (Future V2)
           Claude 3.5 Sonnet — not implemented in V1
```

---

## 3. IAIProvider Interface Contract

```typescript
// ai/providers/ai-provider.ts

export interface DiagnosticPromptPayload {
  systemPrompt: string;              // Full system persona prompt
  contextSummary: string;            // Compressed ProjectContext summary for LLM
  evidenceSignals: EvidenceSignal[]; // Structured evidence array
  ruleOutputs: RuleMatch[];          // Deterministic rule evaluation results
  projectTopology: string;           // JSON-serialized topology summary
  requestedOutputFormat: 'JSON';     // Always JSON for structured output
}

export interface RecoveryPromptPayload {
  diagnosisId: string;
  diagnosisSummary: string;
  rootCause: DiagnosisRootCause;
  projectContext: string;           // Compressed context summary
}

export interface IAIProvider {
  /** Unique provider identifier */
  readonly name: string;

  /** Current model identifier */
  readonly model: string;

  /**
   * Runs diagnosis reasoning over the provided evidence and context.
   * Returns a JSON string that must be parsed and validated against
   * AIDiagnosisOutputSchema.
   */
  diagnose(payload: DiagnosticPromptPayload): Promise<string>;

  /**
   * Generates an enhanced, narrative recovery guide for the given diagnosis.
   */
  generateRecoveryGuide(payload: RecoveryPromptPayload): Promise<string>;

  /**
   * Checks whether the provider API is accessible and keys are valid.
   * Returns true if healthy.
   */
  healthCheck(): Promise<boolean>;

  /**
   * Returns the estimated cost in USD for the last API call.
   * Returns null if cost tracking is not supported.
   */
  getLastCallCost(): number | null;
}
```

---

## 4. OpenAI Provider Implementation

**File:** `ai/providers/openai-provider.ts`
**Model:** `gpt-4o` (default) | `gpt-4o-mini` (cost-efficient fallback)
**Environment Variable Required:** `OPENAI_API_KEY`

### Configuration

```typescript
const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL ?? 'gpt-4o',
  maxTokens: 4096,
  temperature: 0.1,          // Low temperature for deterministic diagnostic outputs
  responseFormat: 'json_object', // Enforces JSON output mode
  timeout: 30_000,           // 30 second timeout
  maxRetries: 2,
};
```

### Prompt Construction Strategy

The OpenAI provider constructs a multi-part prompt from the `DiagnosticPromptPayload`:

```
[System Prompt]     <- ai/prompts/diagnosis/system.prompt
                       Defines DeployFix AI persona, output format requirements,
                       and hard constraints (no hallucination, no auto-remediation)

[User Message]      <- Dynamically constructed:
  Project Topology: {JSON.stringify(context.topology)}
  
  Collected Evidence:
  {JSON.stringify(evidenceSignals, null, 2)}
  
  Rule Engine Outputs:
  {JSON.stringify(ruleOutputs, null, 2)}
  
  Task: Analyze the deployment failure evidence above.
  Identify the root cause. Produce a structured JSON diagnosis
  following the AIDiagnosisOutput format exactly.
```

### Structured Output Enforcement

The OpenAI provider uses **JSON mode** (`response_format: { type: "json_object" }`) to guarantee the model outputs valid JSON. The returned JSON is then parsed and validated through Zod schema before being accepted.

If the JSON fails Zod validation, the response is discarded and the system falls back to rules-only diagnosis.

### Rate Limiting & Cost Controls

| Limit | Value |
|-------|-------|
| Max diagnoses per user per day | 50 (V1) |
| Max tokens per prompt | 4,096 output + ~8,000 input |
| Estimated cost per diagnosis | $0.01–$0.05 USD (GPT-4o) |
| Monthly cost cap enforcement | Backend middleware rate limiter |

---

## 5. Mock Provider Implementation

**File:** `ai/providers/mock-provider.ts`
**Purpose:** Offline, deterministic, zero-latency AI provider for:
- Unit tests (`ai/tests/`)
- Integration tests without requiring API keys
- Local development environments where `OPENAI_API_KEY` is not set
- AI evaluation benchmark runs (`ai/evaluation/`)

### Mock Response Strategy

The mock provider matches incoming rule outputs to a pre-built canned response library:

```typescript
const MOCK_RESPONSE_MAP: Record<string, Partial<AIDiagnosisOutput>> = {
  'DB_ECONNREFUSED': {
    severity: 'CRITICAL',
    domain: 'DB',
    summary: 'Backend cannot connect to PostgreSQL — ECONNREFUSED on port 5432',
    // ... full mock diagnosis
  },
  'NGINX_PORT_MISMATCH': {
    severity: 'HIGH',
    domain: 'NET',
    summary: 'Nginx is proxying to wrong backend port',
    // ...
  },
  // ... additional mock entries
};
```

If no rule match key is found, the mock provider returns a generic LOW confidence diagnosis.

---

## 6. Provider Selection & Injection

The `DiagnosisEngine` receives its provider through **constructor injection**:

```typescript
// In apps/backend/src/services/diagnosis.service.ts

const provider = process.env.AI_PROVIDER === 'mock'
  ? new MockProvider()
  : new OpenAIProvider(process.env.OPENAI_API_KEY);

const engine = new DiagnosisEngine(provider, ruleEngine, correlator);
```

**Environment Variable:** `AI_PROVIDER=mock` | `AI_PROVIDER=openai`

This means:
- CI/CD pipelines set `AI_PROVIDER=mock` — no API key needed
- Production sets `AI_PROVIDER=openai` with `OPENAI_API_KEY`
- Individual developers can choose either locally

---

## 7. Provider Health Check

The backend `GET /api/v1/health/ai` endpoint reports provider health:

```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "status": "healthy",
  "lastChecked": "2026-08-09T17:00:00.000Z",
  "latencyMs": 342
}
```

If `IAIProvider.healthCheck()` returns `false`, the diagnosis endpoint falls back to rules-only mode and returns a warning in the diagnostic metadata.

---

## 8. Adding a New Provider (V2+)

To add a new AI provider in a future version:

1. Create `ai/providers/<name>-provider.ts`
2. Implement the full `IAIProvider` interface
3. Add the provider name to `AI_PROVIDER` enum in environment validation
4. Add canned mock responses to `mock-provider.ts` for parity testing
5. Add provider-specific ADR entry to `DOCs/03_Architecture/08_ADR_Log.md`
6. Add evaluation benchmark results in `ai/evaluation/`

---

*This specification is the authoritative reference for `ai/providers/`. No direct OpenAI SDK calls should exist outside of `openai-provider.ts`. The DiagnosisEngine must only interact with `IAIProvider`. Violations break provider-agnostic architecture.*
