# 04 — Manual File Upload Source

**Document ID:** DFL-CTX-04  
**Status:** V1 Feature (Build Now)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

Manual File Upload is the **primary evidence-gathering mechanism** for V1. Users who cannot connect GitHub or their deployment platform can upload key deployment configuration files and logs directly. DeployFix analyzes these files as structured evidence.

> **Versioning:** This is a **V1 feature** — build this alongside Website URL.

---

## 2. Accepted File Types

| File | Purpose | Analysis Type |
|------|---------|---------------|
| `Dockerfile` | Container port, base image, ENV, CMD | Container config analysis |
| `docker-compose.yml` | Service topology, ports, volumes, dependencies | Service mesh analysis |
| `nginx.conf` | Proxy config, port mapping, SSL, upstream | Reverse proxy analysis |
| `package.json` | Framework, scripts, dependencies | Stack detection |
| `package-lock.json` | Exact dependency versions | Version analysis |
| `.env.example` | Required environment variable keys | Env requirement extraction |
| GitHub Actions `.yml` | CI/CD pipeline steps | Build pipeline analysis |
| `*.log` | Runtime/build logs | Error extraction |
| `render.yaml` / `railway.json` | Platform deploy config | Platform config analysis |

---

## 3. File Size + Security Limits

| Constraint | Limit |
|-----------|-------|
| Max file size | 2 MB per file |
| Max files per upload | 10 files |
| Accepted extensions | `.dockerfile`, `.yml`, `.yaml`, `.json`, `.conf`, `.log`, `.txt`, `.env.example` |
| Rejected always | `.env`, `.env.local`, `.env.production`, any file containing actual secrets |

> **Security Rule:** If any uploaded file contains patterns matching secrets (private keys, tokens, passwords), DeployFix must:
> 1. Refuse to store the file
> 2. Warn the user: *"This file appears to contain secrets. DeployFix cannot accept files with real credentials."*
> 3. Suggest using `.env.example` format instead

---

## 4. Frontend UI/UX Specification

### 4.1 File Upload Drop Zone

```
┌──────────────────────────────────────────────┐
│ 📁 Upload Configuration Files & Logs         │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │       ⬆️  Drop files here              │  │
│  │                                        │  │
│  │    or [ Browse Files ]                 │  │
│  │                                        │  │
│  │  Accepts: Dockerfile, docker-compose,  │  │
│  │  nginx.conf, package.json, .log, .yml  │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Max 10 files · Max 2MB each                 │
│  ⚠️ Do not upload files with real secrets   │
└──────────────────────────────────────────────┘
```

### 4.2 File Processing States

**Uploaded File Card — Analyzing:**
```
┌──────────────────────────────────────────┐
│ 📄 Dockerfile                     🔄     │
│ 2.4 KB · Analyzing...                    │
│ ▓▓▓▓▓▓▓░░░░░░░░░  45%                   │
└──────────────────────────────────────────┘
```

**Uploaded File Card — Complete:**
```
┌──────────────────────────────────────────┐
│ 📄 Dockerfile                     ✅     │
│ 2.4 KB · 3 evidence items extracted      │
│                                          │
│  · EXPOSE 5000 detected                  │
│  · Base image: node:18-alpine            │
│  · ENV NODE_ENV not set                  │
│                                          │
│                              [✕ Remove]  │
└──────────────────────────────────────────┘
```

**Secret Detected — Rejection:**
```
┌──────────────────────────────────────────┐
│ 🚫 .env — Upload Rejected                │
│                                          │
│ ⚠️ This file appears to contain real    │
│ secrets or credentials. DeployFix cannot │
│ accept files with private data.          │
│                                          │
│ Please use .env.example format (keys     │
│ only, no values).                        │
│                              [✕ Dismiss] │
└──────────────────────────────────────────┘
```

### 4.3 Evidence Summary After Upload

```
┌──────────────────────────────────────────┐
│ 📁 Uploaded Files — 4 files analyzed     │
│                                          │
│ ✅ Dockerfile         3 evidence items   │
│ ✅ docker-compose.yml 5 evidence items   │
│ ✅ nginx.conf         2 evidence items   │
│ ✅ app.log            7 evidence items   │
│                                          │
│ Total Evidence Items: 17                 │
│ Context Completeness: ████████░░  55%   │
│                                          │
│ [ Add More Files ]  [ Run Diagnosis ]    │
└──────────────────────────────────────────┘
```

---

## 5. Data Types

```typescript
interface UploadedFilesContext {
  files: UploadedFile[];
  totalEvidenceItems: number;
  uploadedAt: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: 'dockerfile' | 'docker_compose' | 'nginx_conf' | 'package_json' | 'env_example' | 'github_actions' | 'log' | 'platform_config' | 'other';
  sizeBytes: number;
  status: 'uploading' | 'analyzing' | 'complete' | 'rejected' | 'error';
  rejectionReason?: 'secrets_detected' | 'too_large' | 'unsupported_type';
  evidenceItems: EvidenceItem[];
  parsedContent?: ParsedFileContent;
}
```

---

## 6. Context Contribution

Uploading configuration files unlocks:
- **+15–35% Context Completeness Score** (based on files provided)
- Dockerfile port + image analysis
- docker-compose service topology mapping
- nginx proxy configuration analysis
- Log error extraction and classification
- Environment variable key detection

---

## 7. Evidence Extraction Example

```
Upload: Dockerfile → EXPOSE 5000
Upload: nginx.conf → proxy_pass http://localhost:3000
Upload: app.log   → "connect ECONNREFUSED 0.0.0.0:5000"

Evidence Correlation:
  · Port mismatch: Docker=5000, Nginx expects=3000  [CRITICAL]
  · Log confirms: application attempted 0.0.0.0:5000  [CRITICAL]

Diagnosis: Port configuration mismatch — nginx routing to 3000,
           container only listening on 5000
Confidence: 78% (based on 3 consistent evidence items)
```
