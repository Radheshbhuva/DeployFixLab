# DeployFix Lab — GitHub Repository Integration: Security & Secret Filtering Standards

| Property | Value |
| :--- | :--- |
| **Document Name** | Security, Compliance & Secret Filtering Standards |
| **Document ID** | DFL-GH-SEC-007 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | Security Architecture & Compliance |
| **Owner** | DeployFix Lab Security Engineering Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. Threat Model & Security Principles

When connecting to external GitHub repositories, DeployFix Lab treats **all repository code, commits, and archive snapshots as untrusted input**.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     CORE SECURITY INVARIANTS                            │
│                                                                         │
│  1. ZERO DYNAMIC EXECUTION: Downloaded code is NEVER executed.          │
│  2. STRICT TOKEN ISOLATION: Browser NEVER receives GitHub tokens.       │
│  3. SENSITIVE FILE PURGE: Secret files are purged before parsing.       │
│  4. ARCHIVE RESOURCE GATES: Strict decompression and memory quotas.     │
│  5. ENCRYPTED CREDENTIALS: All stored tokens use AES-256-GCM.           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Invariant 1: Zero Dynamic Code Execution Rule

Under no circumstances should the ingestion engine, backend worker, or analysis service execute arbitrary commands or build processes on downloaded repository contents during standard ingestion:

### Prohibited Operations During Ingestion
```bash
# FORBIDDEN COMMANDS:
npm install / yarn install / pnpm install
npm test / npm run <script>
docker build / docker compose up
sh <any_script.sh> / bash <any_script.sh>
python setup.py / pip install
```

All ingestion and analysis must operate via **Static Analysis & AST Parsing Only**. If dynamic sandbox execution is introduced in later phases for interactive container labs, it must run inside dedicated, network-isolated microVMs with strictly bounded CPU, RAM, and disk quotas.

---

## 3. Invariant 2: Sensitive File Blacklist & Redaction

### 3.1 Blacklisted Files (Immediate Disk Purge)
The Ephemeral Workspace Manager automatically deletes or skips any files matching these patterns during archive extraction:

```text
# Environment & Secrets
.env
.env.*
!.env.example          # .env.example is allowed (keys only)
*.env

# Private Keys & Certificates
*.pem
*.key
*.pkcs12
*.pfx
id_rsa
id_rsa.pub
id_ed25519
id_ed25519.pub
*.p12

# Cloud & Service Credentials
credentials.json
service-account.json
gcloud-key.json
*.kdbx
```

### 3.2 High-Entropy Secret Redaction Engine
When reading configuration files (such as `.env.example`, `docker-compose.yml`, or `README.md`), all text is passed through the regex secret scrubber before being stored in RAM or database:

```typescript
export const SECRET_SCRUB_PATTERNS = [
  // GitHub Tokens
  /ghp_[0-9a-zA-Z]{36}/g,
  /github_pat_[0-9a-zA-Z_]{82}/g,
  
  // AWS Keys
  /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
  
  // Stripe API Keys
  /sk_live_[0-9a-zA-Z]{24}/g,
  /rk_live_[0-9a-zA-Z]{24}/g,
  
  // OpenAI & Google AI Keys
  /sk-[a-zA-Z0-9]{48}/g,
  /AIza[0-9A-Za-z\\-_]{35}/g,
  
  // Generic Password / Token Assignments
  /(password|secret|token|api_key|private_key)\s*[:=]\s*["']?([^\s"']{8,})["']?/gi
];

export function scrubText(rawText: string): string {
  let cleanText = rawText;
  for (const pattern of SECRET_SCRUB_PATTERNS) {
    cleanText = cleanText.replace(pattern, '[REDACTED_SECRET]');
  }
  return cleanText;
}
```

---

## 4. Invariant 3: Archive Extraction & Zip-Bomb Defense

To prevent disk exhaustion or Denial-of-Service attacks via malicious repositories, the extraction stream enforces strict limits:

| Resource Gate | Limit | Violation Action |
| :--- | :--- | :--- |
| **Max Archive Download Size** | `50 MB` | Connection aborted immediately |
| **Max Uncompressed Disk Size** | `200 MB` | Stream destroyed; workspace wiped |
| **Max Total Files Extracted** | `5,000 files` | Extraction terminated with `LimitExceeded` |
| **Max Directory Nesting Depth** | `10 levels` | Files deeper than 10 levels skipped |
| **Symlink Resolution** | `Workspace Root Only` | Symlinks pointing outside target directory are discarded |
| **Path Traversal (`../`)** | `Zero Tolerance` | Immediate extraction abort and security audit log |

---

## 5. Invariant 4: Token Encryption & Key Management

GitHub installation tokens and sensitive configuration parameters stored in PostgreSQL are encrypted using **AES-256-GCM** with unique Initialization Vectors (IV) per record.

```text
┌─────────────────────────────────────────────────────────────┐
│                 AES-256-GCM ENCRYPTION SCHEME               │
│                                                             │
│  Plaintext Token                                            │
│        │                                                    │
│        ▼                                                    │
│  [ AES-256-GCM Engine ] ◄── Master Encryption Key (256-bit) │
│        │                 ◄── Random 12-byte IV              │
│        ▼                                                    │
│  Encrypted Payload: iv:authTag:ciphertext                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Least Privilege GitHub App Permissions

DeployFix Lab requests the absolute minimum permissions required for static configuration analysis:

| Permission Name | Access Level | Rationale |
| :--- | :--- | :--- |
| **Repository metadata** | `Read-only` | Needed to inspect repo name, owner, default branch, visibility |
| **Repository contents** | `Read-only` | Needed to download configuration snapshots (`package.json`, `Dockerfile`) |
| **Selected Repositories** | `Scoped` | User explicitly selects target repositories; never requests whole-organization access by default |

### Prohibited Initial Permissions (Do Not Request)
- ❌ `Repository contents: Read and Write` (DeployFix does not push code in initial phase)
- ❌ `Pull requests: Read and Write`
- ❌ `Administration: Read and Write`
- ❌ `User data / Email: Write`
