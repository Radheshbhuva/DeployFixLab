# 07 — AI Code Review Workflow

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | AI Code Review Workflow                                           |
| **Document ID**     | DFIX-AI-007                                                       |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | AI Systems & Quality Lead                                         |
| **Reviewer**        | Principal Architect, Technical Lead                               |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Scope

This document defines the official **AI Code Review Workflow** for **DeployFix Lab**. It establishes how AI agents and LLM tools conduct static code analysis, security auditing, requirement traceability validation, and architectural compliance checks on pull requests before human sign-off.

---

# 2. AI Code Review Pipeline & Phases

```
Pull Request Opened / Diff Submitted
               │
               ▼
[ Phase 1: Context Resolution & Context Loading ]
               │
               ▼
[ Phase 2: Static Analysis & Quality Gate Check ]
               │
               ▼
[ Phase 3: Security & Vulnerability Scan ]
               │
               ▼
[ Phase 4: Requirement Traceability Audit ]
               │
               ▼
[ Phase 5: AI Review Summary & Suggestion Generation ]
```

---

# 3. AI Code Review Execution Checklist

During every code review pass, the AI agent must validate the submitted git diff against the following 6 core pillars:

## 3.1 Architecture & Layering Compliance
* Verify adherence to the 4-Tier Layered Architecture (`Routes` -> `Controllers` -> `Services` -> `Repositories`).
* Check that business logic is encapsulated in `Services` and NOT embedded in `Controllers` or Express routes.

## 3.2 Security Audit
* Verify zero plaintext secrets, tokens, API keys, or private certificates committed in diffs.
* Confirm all user inputs are parsed via Zod validation schemas (`validations/`).
* Check that database queries use parameterized SQL via Prisma ORM (zero string concatenation in queries).
* Verify bcrypt salt rounds >= 10 for password hashing.

## 3.3 Coding & Naming Standards
* Enforce naming conventions specified in `03_Naming_Convention.md` (`camelCase` vars, `PascalCase` components/types, `kebab-case` files, `snake_case` DB fields).
* Ensure TypeScript strict mode is satisfied with zero implicit `any` types.

## 3.4 Performance & Scalability
* Check for potential N+1 database queries inside loops.
* Ensure asynchronous functions use `async/await` with proper `try/catch` error boundaries.

## 3.5 Logging & Observability
* Verify Winston structured JSON logging is used (`logger.info()`, `logger.error()`).
* Ensure sensitive payload fields (`password`, `token`) are masked as `[REDACTED]`.

## 3.6 Documentation & History Synchronization
* Confirm relevant `Development_History` log is updated (e.g. `Backend_Work_History.md`).
* Ensure `Commit_History.md` entry is staged for commit and push.

---

# 4. Standard AI Review Output Format

AI code reviews must output findings in the following markdown structure:

```markdown
## AI Code Review Report — PR #[PR Number]

### Summary
[Brief overview of changes and overall pass/fail recommendation]

### Critical Blocking Issues 🛑
- [Issue 1: Security risk / secret leak / unhandled exception]

### Warnings & Improvements ⚠️
- [Improvement 1: Code duplication / naming mismatch / missing type annotation]

### Requirement Traceability Verified ✅
- Requirement ID: `FR-XXX` verified against code implementation.

### Final Verdict
[ APPROVED | REQUEST_CHANGES | NEEDS_HUMAN_VERIFICATION ]
```
