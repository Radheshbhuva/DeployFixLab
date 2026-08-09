# 06 — AI Provider Architecture Specification

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Provider Architecture Specification                            |
| **Document ID**     | DFIX-AI-006                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & System Architect                                 |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Provider Abstraction Layer

To avoid hardcoding a single AI vendor across the codebase, DeployFix Lab abstracts all LLM interactions behind the `IAIProvider` interface:

```
                      Diagnosis Engine
                             │
                             ▼
                   `ai/providers/ai-provider.ts`
                   (IAIProvider Interface)
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     `openai-provider.ts` `anthropic-provider.ts` `mock-provider.ts`
```

---

# 2. Interface Contract

```typescript
export interface DiagnosticPromptPayload {
  systemPrompt: string;
  contextSummary: string;
  evidence: Array<Record<string, unknown>>;
  ruleOutputs: Array<Record<string, unknown>>;
}

export interface IAIProvider {
  name: string;
  diagnose(payload: DiagnosticPromptPayload): Promise<string>;
  generateRecoveryGuide(diagnosisId: string): Promise<string>;
  healthCheck(): Promise<boolean>;
}
```

* **`openai-provider.ts`**: Implements OpenAI GPT-4o / GPT-4o-mini structured JSON generation.
* **`mock-provider.ts`**: Offline, zero-latency provider that matches deterministic rule IDs to canned diagnostic responses for automated testing and local developer convenience without requiring active API keys.
