# 08 — AI Evaluation & Benchmark Strategy

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Evaluation & Benchmark Strategy                                |
| **Document ID**     | DFIX-AI-008                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Technical Lead & Reliability Architect                            |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-09                                                        |
| **Last Updated**    | 2026-08-09                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Overview & Benchmark Objectives

DeployFix Lab includes a dedicated evaluation engine (`ai/evaluation/`) to continuously benchmark AI diagnostic accuracy, root-cause precision, confidence calibration, and hallucination rates across pre-recorded failure scenarios.

---

# 2. Evaluation Suite Components

```
ai/evaluation/
├── datasets/                 # Pre-recorded evidence payloads for lab scenarios
├── scenarios/                # Ground truth failure scenario definitions
├── expected-diagnoses/       # Ground truth diagnostic outputs (JSON)
├── evaluation-runner.ts      # Test harness that executes AI provider against scenarios
└── metrics.ts                # Calculates precision, recall, calibration & latency
```

---

# 3. Key Target Metrics

| Metric | Target Threshold | Description |
|---|---|---|
| **Diagnostic Accuracy** | $\ge 95\%$ | Percentage of test scenarios where the top diagnosis matches ground truth. |
| **Root Cause Precision** | $\ge 90\%$ | Correct identification of the specific broken component / configuration key. |
| **Hallucination Rate** | $\le 1\%$ | Percentage of diagnoses referencing non-existent evidence or non-existent files. |
| **Confidence Calibration** | $R^2 \ge 0.85$ | Correlation between confidence score % and actual diagnostic accuracy. |
| **Recovery Step Usefulness** | $\ge 95\%$ | Percentage of recovery playbooks that successfully resolve the injected chaos failure. |
