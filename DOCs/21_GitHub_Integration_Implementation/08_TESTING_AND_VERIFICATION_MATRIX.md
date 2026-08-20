# DeployFix Lab — GitHub Repository Integration: Testing & Verification Matrix

| Property | Value |
| :--- | :--- |
| **Document Name** | Testing, Verification & Quality Assurance Matrix |
| **Document ID** | DFL-GH-TEST-008 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Category** | Quality Assurance & Testing |
| **Owner** | DeployFix Lab QA & Engineering Team |
| **Created On** | 2026-08-17 |
| **Last Updated** | 2026-08-17 |
| **Repository** | DeployFix Lab (`Radheshbhuva/DeployFixLab`) |

---

## 1. Testing Strategy Overview

The testing suite ensures 100% test coverage across parsers, security filters, API endpoints, database persistence, and user interfaces without requiring active GitHub App installations during local unit tests.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           TESTING PYRAMID                               │
│                                                                         │
│                    ▲                                                    │
│                   / \     E2E Acceptance Tests (Playwright / Cypress)    │
│                  /   \    Mock GitHub OAuth & Ingestion Flow            │
│                 /─────\                                                 │
│                /       \   Integration Tests (Supertest + In-Memory DB)  │
│               /         \  Octokit Mocks & Ingestion Pipeline           │
│              /───────────\                                              │
│             /             \ Unit Tests (Jest / Vitest)                  │
│            /               \ 7 Multi-Artifact Parsers & Secret Scrubber │
│           └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Synthetic Test Fixtures

The integration test suite uses 4 dedicated synthetic repository fixtures located under `backend/tests/fixtures/synthetic-repos/`:

### Fixture A: `mismatch-express-docker-nginx`
- **Purpose:** Validate port mismatch detection between Docker and Nginx.
- **Files:**
  - `package.json`: Express backend on port 5000.
  - `Dockerfile`: `EXPOSE 5000`.
  - `nginx.conf`: `proxy_pass http://localhost:3000`.
- **Expected Outcome:** `RULE_PORT_MISMATCH` generates **CRITICAL** Flare.

### Fixture B: `fullstack-nextjs-prisma`
- **Purpose:** Validate multi-framework detection and database schema parsing.
- **Files:**
  - `package.json`: Next.js, React, `@prisma/client`.
  - `prisma/schema.prisma`: Datasource PostgreSQL, models `User`, `Project`.
  - `.github/workflows/ci.yml`: GitHub Actions Node 18 CI test runner.
- **Expected Outcome:** Frameworks detected (`Next.js`, `React`), DB (`PostgreSQL`), Prisma detected (`true`), CI detected (`true`).

### Fixture C: `malicious-security-repo`
- **Purpose:** Validate security sanitizers, secret redaction, and archive traversal guards.
- **Files:**
  - `.env`: Contains simulated `ghp_1234567890abcdefghijklmnopqrstuvwxyz` token.
  - `../../malicious.txt`: Symlink or archive header attempting directory escape.
  - `large_binary.bin`: 250MB zero-byte uncompressed stream.
- **Expected Outcome:** `.env` purged, fake token scrubbed, path traversal rejected, decompression aborts safely.

### Fixture D: `broken-syntax-repo`
- **Purpose:** Validate parser resilience against syntax errors.
- **Files:**
  - `package.json`: Contains unquoted strings and JSON syntax errors.
  - `Dockerfile`: Incomplete `FROM` without tag.
- **Expected Outcome:** Parsers fail gracefully without crashing; error summary recorded in `RepositoryScan`.

---

## 3. Requirement Traceability Matrix (RTM)

| Requirement ID | Description | Test Case ID | Test Type | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **FR-GH-01** | GitHub App Connect Flow | `TC-GH-AUTH-001` | Integration | Mock GitHub App installation redirect and state validation |
| **FR-GH-02** | List Selected Repositories | `TC-GH-REPO-002` | Integration | Octokit mock returns authorized repo list |
| **FR-GH-03** | Snapshot Download | `TC-GH-SNAP-003` | Unit/Integration | Stream tarball archive into `/tmp/deployfix/scans/<id>` |
| **FR-GH-04** | Package.json Parser | `TC-GH-PARSE-004` | Unit | Validate React, Vite, Express framework detection |
| **FR-GH-05** | Dockerfile Parser | `TC-GH-PARSE-005` | Unit | Validate `EXPOSE` port and base image extraction |
| **FR-GH-06** | Nginx Parser | `TC-GH-PARSE-006` | Unit | Validate `proxy_pass` and listen port extraction |
| **FR-GH-07** | Secret Redaction | `TC-GH-SEC-007` | Unit/Security | Assert zero secret strings in generated `ProjectContext` |
| **FR-GH-08** | Zip-Bomb Protection | `TC-GH-SEC-008` | Security | Stream > 200MB archive; assert stream abort |
| **FR-GH-09** | Prisma Context Persist | `TC-GH-DB-009` | Integration | Assert `ProjectContext` saved in Supabase PostgreSQL |
| **FR-GH-10** | Port Mismatch Flare | `TC-GH-FLARE-010` | Integration | Assert CRITICAL Flare created for Fixture A |
| **FR-GH-11** | Public URL Fallback | `TC-GH-FALL-011` | Integration | Scan public repository URL without App install |
| **FR-GH-12** | ZIP Upload Fallback | `TC-GH-FALL-012` | Integration | Upload sample project ZIP via Multer stream |

---

## 4. Test Execution Commands

```bash
# Run all GitHub Integration unit tests (parsers & sanitization)
npm run test -- backend/tests/unit/parsers.test.ts

# Run security & zip-bomb tests
npm run test -- backend/tests/security/sanitization.test.ts

# Run backend API integration tests with Octokit mocks
npm run test -- backend/tests/integration/github-integration.test.ts

# Run frontend React component tests
npm run test -- frontend/src/components/context/__tests__/

# Run full GitHub integration test suite
npm run test:github
```

---

## 5. Acceptance Sign-Off Criteria

Before merging GitHub Repository Integration into production:

1. **Unit Test Pass Rate:** 100% pass rate across all parser tests and regex redactors.
2. **Zero False Positives:** Non-conflicting repositories must produce 0 false-positive CRITICAL Flares.
3. **Security Audit:** Pass the automated secret scrubber check on 1,000 synthetic test contexts.
4. **Performance Gate:** Snapshot download, parsing, and context generation must complete in **< 3,000ms** for repositories under 50MB.
5. **Clean Workspace Gate:** Ephemeral `/tmp/deployfix/scans` directory must contain 0 residual files after test run.
