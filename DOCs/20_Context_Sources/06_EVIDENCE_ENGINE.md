# 06 — Evidence Engine Specification

**Document ID:** DFL-CTX-06  
**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The **Evidence Engine** is the deterministic processing layer between raw context sources and the Diagnosis Engine. It extracts, classifies, and correlates evidence items from all connected sources before any AI inference is applied.

> **Design Principle:** Evidence must be deterministic. The Evidence Engine does not guess — it extracts structured facts from the data provided.

---

## 2. Evidence Pipeline

```
Source 1: GitHub       ─┐
Source 2: Deployment   ─┤──▶ EXTRACTION ──▶ CLASSIFICATION ──▶ CORRELATION
Source 3: Website URL  ─┤
Source 4: File Upload  ─┘
                              │                   │                │
                              ▼                   ▼                ▼
                        Raw Facts          Categorized       Cross-source
                                           Evidence          Conflicts
                                               │
                                               ▼
                                       EVIDENCE REGISTRY
                                               │
                                               ▼
                                      DIAGNOSIS ENGINE
```

---

## 3. Evidence Item Model

```typescript
interface EvidenceItem {
  id: string;
  source: 'github' | 'deployment' | 'website' | 'upload';
  sourceFile?: string;              // e.g. "Dockerfile", "nginx.conf"
  type: EvidenceType;
  severity: 'info' | 'warning' | 'critical';
  value: string;                    // Raw extracted value
  detail: string;                   // Human-readable description
  relatedItems: string[];           // IDs of correlated evidence
  confidence: number;               // 0.0 - 1.0 (extraction confidence)
  extractedAt: string;
}

type EvidenceType =
  | 'port_config'
  | 'http_status'
  | 'tls_status'
  | 'env_var_key'
  | 'env_var_missing'
  | 'build_error'
  | 'runtime_crash'
  | 'proxy_config'
  | 'container_config'
  | 'service_dependency'
  | 'stack_detection'
  | 'log_error_pattern'
  | 'deployment_status';
```

---

## 4. Extraction Rules (V1)

### Rule EX-01: HTTP Status Extraction
```
Source: Website URL
IF httpStatus is 4xx or 5xx
THEN extract EvidenceItem {
  type: 'http_status',
  severity: 5xx → 'critical', 4xx → 'warning',
  value: httpStatus,
  detail: '<status description>'
}
```

### Rule EX-02: Dockerfile Port Extraction
```
Source: File Upload (Dockerfile)
Regex: /^EXPOSE\s+(\d+)/m
THEN extract EvidenceItem {
  type: 'port_config',
  severity: 'info',
  value: <port number>,
  detail: 'Container exposes port <N>'
}
```

### Rule EX-03: Nginx Upstream Port Extraction
```
Source: File Upload (nginx.conf)
Regex: /proxy_pass\s+https?:\/\/[^:]+:(\d+)/
THEN extract EvidenceItem {
  type: 'proxy_config',
  severity: 'info',
  value: <proxy port>,
  detail: 'Nginx routes traffic to upstream port <N>'
}
```

### Rule EX-04: Log Error Pattern Extraction
```
Source: File Upload (*.log) or Deployment
Patterns: [
  /ECONNREFUSED.+:(\d+)/,   → 'connection_refused'
  /ENOENT/,                  → 'file_not_found'
  /ER_ACCESS_DENIED/,        → 'db_access_denied'
  /Invalid options object/,  → 'config_error'
  /Cannot find module/,      → 'missing_dependency'
  /\[ERROR\]/                → 'generic_error'
]
THEN extract EvidenceItem { type: 'log_error_pattern', ... }
```

---

## 5. Correlation Rules (V1)

### Rule CR-01: Port Mismatch
```
IF evidence.type === 'port_config' (from Dockerfile)
AND evidence.type === 'proxy_config' (from nginx.conf)
AND dockerfile_port !== nginx_proxy_port
THEN generate CorrelatedEvidence {
  type: 'port_mismatch',
  severity: 'critical',
  items: [dockerfile_evidence_id, nginx_evidence_id],
  detail: 'Container exposes <A> but nginx routes to <B>'
}
```

### Rule CR-02: 502 + Port Mismatch Confirmation
```
IF CorrelatedEvidence.type === 'port_mismatch'
AND evidence.type === 'http_status' AND value === 502
THEN escalate severity to 'critical', increase confidence by 0.2
detail: 'Port mismatch confirmed by 502 Bad Gateway response'
```

### Rule CR-03: Missing Environment Variable
```
IF github.envExample.keys contains KEY_X
AND deployment.envVarKeys does NOT contain KEY_X
THEN generate CorrelatedEvidence {
  type: 'env_var_missing',
  severity: 'critical',
  detail: 'KEY_X required by app but not set in deployment'
}
```

---

## 6. Evidence Registry UI

The Evidence Registry is displayed in the Diagnosis Page as a collapsible list:

```
┌──────────────────────────────────────────────────────┐
│ 🔍 Evidence Registry  (17 items)       [Collapse ▲]  │
├────────────────────────────────────────────────────  │
│ 🔴 CRITICAL  Port mismatch: Docker=5000, nginx→3000  │
│   Sources: Dockerfile, nginx.conf                    │
│                                                      │
│ 🔴 CRITICAL  HTTP 502 Bad Gateway                    │
│   Sources: Website URL                               │
│                                                      │
│ 🟡 WARNING   NODE_ENV not set in Dockerfile          │
│   Sources: Dockerfile                                │
│                                                      │
│ 🔵 INFO      Base image: node:18-alpine              │
│   Sources: Dockerfile                                │
│                                          [Show All]  │
└──────────────────────────────────────────────────────┘
```
