# 03 — Website URL Context Source

**Document ID:** DFL-CTX-03  
**Status:** V1 Feature (Build Now)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The Website URL source gives DeployFix publicly observable evidence about a deployed application. It is the **only source that requires zero authorization** and is a core part of the V1 MVP.

> **Versioning:** This is a **V1 feature** — build this first.

---

## 2. What DeployFix Observes (Public Only)

| Observable Signal | Method | Evidence Type |
|------------------|--------|---------------|
| HTTP status code | HEAD request | Health status |
| HTTPS/TLS state | Connection inspection | Security config |
| Redirect chain | Follow redirects | Configuration |
| Response headers | Response analysis | Server info |
| Content-Type | Header parsing | Framework detection |
| Server header | Header parsing | Stack detection |
| X-Powered-By | Header parsing | Tech detection |
| Page load success/fail | GET request | Availability |
| Error page patterns | Body analysis | Error classification |

---

## 3. What DeployFix Must NEVER Assume It Can See

This is an **architectural contract**. The UI and AI engine must NEVER claim to have seen or inferred:

- ❌ Private source code
- ❌ Database schema or contents
- ❌ Environment variables
- ❌ Private API endpoints
- ❌ Server filesystem
- ❌ Docker configuration
- ❌ CI/CD pipeline configuration
- ❌ Server-side logs
- ❌ Any data not in a public HTTP response

All diagnoses based solely on Website URL must be explicitly qualified:

> *"Based on publicly observable evidence from https://example.com..."*

---

## 4. Frontend UI/UX Specification

### 4.1 URL Input Form

**Location:** Project Context Panel → Source: Website URL

```
┌──────────────────────────────────────────┐
│ 🌐 Enter Your Website URL               │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ https://your-app.railway.app         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ DeployFix will perform a public HTTP     │
│ inspection only. No private data is      │
│ accessed.                               │
│                                          │
│            [ Inspect Website ]           │
└──────────────────────────────────────────┘
```

### 4.2 Inspection Loading State

```
┌──────────────────────────────────────────┐
│ 🔍 Inspecting Website...                │
│                                          │
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  40%               │
│                                          │
│ ✅ DNS resolved                          │
│ ✅ TCP connection established            │
│ 🔄 Checking TLS certificate...          │
│                                          │
└──────────────────────────────────────────┘
```

### 4.3 Results Display

**502 Bad Gateway Example:**
```
┌──────────────────────────────────────────┐
│ 🌐 Website Inspection Complete           │
│                                          │
│ URL: https://my-shop.railway.app         │
│                                          │
│ ┌─────────────────────────────────────┐  │
│ │ HTTP Status     502 Bad Gateway  🔴 │  │
│ │ HTTPS           ✅ Valid TLS        │  │
│ │ Redirect        None               │  │
│ │ Server          nginx/1.24.0       │  │
│ │ Response Time   1,240ms            │  │
│ │ Content-Type    text/html          │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ 🔍 Evidence Extracted:                  │
│   · 502 suggests upstream app not reachable│
│   · nginx is running and responding      │
│   · Likely: container not listening on   │
│     expected proxy port                  │
│                                          │
│ ⚠️ Based on public data only            │
│                                          │
│ [ Add More Context ]  [ Run Diagnosis ]  │
└──────────────────────────────────────────┘
```

---

## 5. Data Types

```typescript
interface WebsiteContext {
  url: string;
  inspectedAt: string;
  httpStatus: number;
  httpsEnabled: boolean;
  tlsValid: boolean;
  tlsExpiry?: string;
  redirectChain: RedirectHop[];
  responseHeaders: Record<string, string>;
  serverHeader?: string;
  poweredByHeader?: string;
  responseTimeMs: number;
  errorPageDetected: boolean;
  errorPagePattern?: 'nginx_502' | 'nginx_404' | 'app_error' | 'custom' | 'unknown';
  availability: 'up' | 'down' | 'partial' | 'unknown';
}

interface RedirectHop {
  from: string;
  to: string;
  statusCode: number;
}
```

---

## 6. Context Contribution

Providing a Website URL unlocks:
- **+20% Context Completeness Score** (baseline V1 capability)
- HTTP status classification
- TLS validation evidence
- Server stack detection
- Availability assessment
- Proxy/gateway error patterns

---

## 7. Diagnosis Qualification Rule

When Website URL is the ONLY source, the AI diagnosis preamble MUST read:

> *"The following diagnosis is based exclusively on publicly observable HTTP evidence from [URL]. No internal system access has been granted. Additional context sources would enable a more precise diagnosis."*
