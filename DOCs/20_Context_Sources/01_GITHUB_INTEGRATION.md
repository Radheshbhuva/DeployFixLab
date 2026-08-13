# 01 — GitHub Repository Integration

**Document ID:** DFL-CTX-01  
**Status:** V2 Feature (Planned)  
**Version:** 1.0  
**Last Updated:** 2026-08-13

---

## 1. Overview

The GitHub integration is the **primary code + architecture source** for DeployFix. It allows DeployFix to understand what the user actually built: the technology stack, container config, CI/CD pipeline, environment requirements, and project structure.

> **Versioning:** This is a **V2 feature**. V1 uses Website URL + File Upload only.

---

## 2. What DeployFix Reads from GitHub

| Artifact | Purpose | Evidence Type |
|----------|---------|---------------|
| `package.json` | Runtime + framework detection | Stack detection |
| `Dockerfile` | Container port, base image, build stages | Container config |
| `docker-compose.yml` | Service topology, port mapping, volumes | Service topology |
| `.env.example` | Required environment variable keys | Environment requirements |
| `nginx.conf` | Reverse proxy config, ports, SSL | Proxy config |
| `.github/workflows/*.yml` | CI/CD pipeline steps | Build + deploy pipeline |
| Prisma schema | Database models, providers | Database config |
| Source tree structure | Tech stack confirmation | Architecture |
| `README.md` | User-declared stack + deployment notes | Self-reported context |

---

## 3. What DeployFix Does NOT Access

- Actual source code (beyond structure)
- Private credentials
- Database connection strings
- Any `.env` files (only `.env.example`)
- GitHub organization private data beyond the authorized repository

---

## 4. Frontend UI/UX Specification

### 4.1 GitHub Connection Panel

**Location:** Project Context Panel → Source: GitHub (collapsed/expanded card)

**States:**
- `disconnected` — Shows connect button
- `connecting` — Loading spinner, "Authorizing with GitHub..."
- `connected` — Shows repo name, branch, last synced time
- `error` — Shows error message with retry

**Connect Flow:**
1. User clicks **"Connect GitHub Repo"**
2. Opens GitHub OAuth popup (scope: `repo:read`)
3. On success: user selects which repository to connect
4. DeployFix fetches the relevant files listed above
5. Shows confirmation: "Repository analyzed — 6 artifacts ingested"

### 4.2 Repository Selector

```
┌──────────────────────────────────────────┐
│ 🔗 Connect GitHub Repository             │
│                                          │
│ Select repository:                       │
│ ┌────────────────────────────────────┐   │
│ │ Radheshbhuva / DeployFixLab    ▾   │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Branch: [ main ▾ ]                       │
│                                          │
│       [ Cancel ]  [ Connect Repo ]       │
└──────────────────────────────────────────┘
```

### 4.3 Connected State Display

```
┌──────────────────────────────────────────┐
│ ✅ GitHub Repository Connected           │
│                                          │
│ Radheshbhuva/DeployFixLab               │
│ Branch: main  ·  Last synced: 2 min ago  │
│                                          │
│ Artifacts Ingested:                      │
│   ✓ Dockerfile          ✓ package.json  │
│   ✓ docker-compose.yml  ✓ .env.example  │
│   ✓ nginx.conf          ✓ CI/CD Workflows│
│                                          │
│ [🔄 Resync]            [✕ Disconnect]   │
└──────────────────────────────────────────┘
```

---

## 5. Data Types

```typescript
interface GitHubContext {
  repoOwner: string;
  repoName: string;
  branch: string;
  syncedAt: string;
  artifacts: {
    packageJson?: ParsedPackageJson;
    dockerfile?: ParsedDockerfile;
    dockerCompose?: ParsedDockerCompose;
    envExample?: string[];         // List of required env var keys
    nginxConf?: ParsedNginxConfig;
    workflows?: ParsedWorkflow[];
    prismaSchema?: ParsedPrismaSchema;
    sourceStructure?: SourceTreeNode[];
  };
}
```

---

## 6. Context Contribution

Connecting GitHub unlocks:
- **+25% Context Completeness Score**
- Port mismatch detection (Dockerfile vs nginx.conf)
- Missing env var detection (.env.example vs deployment env)
- Build stage analysis
- Framework-specific diagnostic rules

---

## 7. Evidence Examples

```
GitHub → Dockerfile EXPOSE 5000
GitHub → nginx.conf proxy_pass localhost:3000

Evidence: PortMismatchEvidence {
  severity: CRITICAL,
  source: "GitHub",
  detail: "Container exposes 5000 but nginx routes to 3000"
}
```
