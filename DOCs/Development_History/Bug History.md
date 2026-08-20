# Bug History

**Document Name:** Bug History  
**Document ID:** HIST-BUG-001  
**Version:** 1.1.0  
**Category:** Development History  
**Status:** Active  
**Owner:** Entire Engineering Team  
**Reviewer:** Technical Lead  

---

# 1. Purpose

The **Bug History** document is the official defect tracking register for **DeployFix Lab**. It records every bug discovered during development, testing, deployment, and production simulation, including investigation, root cause, resolution, verification, and preventive actions.

---

# 2. Master Defect Changelog Table

| Bug ID | Date (ISO) | Module | Severity | Priority | Summary Description | Status |
|---|---|---|---|---|---|---|
| `BUG-001` | 2026-08-09 | `auth` | Medium | P1 | JWT expires immediately after login due to epoch timestamp format mismatch. | Closed |
| `BUG-002` | 2026-08-19 | `backend/auth` | High | P1 | Node.js `(node:17108) [DEP0169] DeprecationWarning: url.parse() behavior is not standardized` on backend startup. | Closed |

---

# 3. Detailed Bug Records

## BUG-002: Node.js url.parse() [DEP0169] Deprecation in bcrypt Native Pre-Gyp
- **Sprint:** Sprint 2.2
- **Date Reported:** 2026-08-19
- **Reporter:** Developer
- **Assignee:** Backend Engineer
- **Module:** `backend/` (Authentication / Dependencies)
- **Severity:** High
- **Priority:** P1
- **Status:** Closed / Verified

### Problem Description:
When starting the backend with `npm run dev` (`tsx watch src/server.ts`), Node.js emitted a security deprecation warning:
```
(node:17108) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.
```

### Root Cause Analysis:
The native `bcrypt` package relied on `@mapbox/node-pre-gyp` binary loader, which internally called Node's deprecated legacy `url.resolve()` and `url.parse()` APIs. Because Node 20+ warns on non-standard URL parser usage, this warning was emitted on server bootstrap.

### Resolution:
1. Uninstalled `bcrypt` and installed pure JavaScript `bcryptjs` and `@types/bcryptjs`.
2. Updated `backend/src/modules/auth/auth.service.ts` to use `bcryptjs.hash()` and `bcryptjs.compare()`.
3. Updated `backend/src/modules/auth/auth.test.ts` to mock `bcryptjs`.
4. Verified that password hashing entropy, salts, and comparisons remain 100% compatible.

### Verification:
- Ran `npm run dev` in `backend/`: Server started cleanly with 0 warnings on port 5000.
- Ran `npm test` in `backend/`: 13 test suites and 56/56 unit tests passed in 1.48s.

### Prevention Strategy:
Avoid native C++ Node addons with legacy pre-gyp dependencies when pure JavaScript equivalents (`bcryptjs`) provide equivalent cryptographic security and cross-platform reliability.