# 09 — Integration Roadmap

**Document ID:** DFL-CTX-09  
**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-13  
**Target Production:** November 2026

---

## 1. Overview

This document defines the phased integration roadmap for DeployFix context sources. Each version adds new context source capabilities while remaining backward compatible with prior versions.

---

## 2. Release Roadmap

### V1 — Manual Upload + Website URL
**Target:** MVP (Build Now)  
**Goal:** Deliver a working diagnosis product that requires zero third-party integrations.

**Included:**
- ✅ Website URL inspection (HTTP status, TLS, headers)
- ✅ Manual file upload (Dockerfile, docker-compose.yml, nginx.conf, .env.example, logs)
- ✅ Project Context Panel (2 of 4 sources active)
- ✅ Evidence Engine — extraction rules (EX-01 through EX-04)
- ✅ Evidence Engine — correlation rules (CR-01: Port Mismatch, CR-02: 502 Confirmation)
- ✅ Diagnosis Engine — deterministic diagnosis + AI-assisted explanation
- ✅ Context Completeness Gauge
- ✅ Guided Recovery Steps with code diff suggestions
- ✅ Context Qualification on all diagnosis outputs

**NOT Included in V1:**
- ❌ GitHub OAuth
- ❌ Deployment Platform APIs
- ❌ Automated monitoring

---

### V2 — GitHub Integration
**Target:** 4 weeks post-V1  
**Goal:** Enable deep code + configuration analysis from actual repositories.

**Included:**
- ✅ GitHub OAuth (scope: `repo:read`)
- ✅ Repository selector UI
- ✅ Automatic artifact ingestion (Dockerfile, nginx.conf, .env.example, etc.)
- ✅ Evidence Rule: Port mismatch from source (EX-05)
- ✅ Evidence Rule: Missing env vars from .env.example (EX-06)
- ✅ Evidence Rule: CI/CD pipeline analysis (EX-07)
- ✅ Resync capability (pull latest repo state)
- ✅ Context Completeness: now up to 75% (Website + Upload + GitHub)

---

### V3 — Deployment Platform Integration
**Target:** 6 weeks post-V2  
**Goal:** Add runtime operations context — what actually happened after deployment.

**Included:**
- ✅ Platform selector: Railway, Render (V3-Alpha); Vercel, Fly.io (V3-Beta)
- ✅ Build log ingestion and error extraction
- ✅ Runtime crash log analysis
- ✅ Environment variable key enumeration (not values)
- ✅ Deployment status + history
- ✅ Correlated diagnosis: GitHub vs Deployment state
- ✅ Context Completeness: up to 100% with all 4 sources

---

### V4 — Monitoring Integration
**Target:** 8 weeks post-V3  
**Goal:** Integrate observability tools for continuous monitoring context.

**Included:**
- ✅ Datadog / New Relic / Better Uptime integration
- ✅ Sentry error tracking integration
- ✅ Uptime history as evidence
- ✅ Alerting rule analysis
- ✅ Performance degradation as evidence context

---

### V5 — DeployFix Agent
**Target:** 12 weeks post-V4  
**Goal:** Proactive diagnosis without user intervention.

**Included:**
- ✅ Automated evidence collection on deployment events
- ✅ Webhook-triggered diagnosis on deployment failure
- ✅ Diagnosis without user-initiated session
- ✅ Slack / Discord / Email notification of diagnosis
- ✅ Suggested recovery steps pushed to user automatically

---

### Future — Controlled Automated Remediation
**Status:** Post-V5, requires explicit design review  
**Goal:** Allow DeployFix to apply recovery steps with user approval.

> ⚠️ This capability requires careful security design. DeployFix must never apply changes without:
> - Explicit user approval of each change
> - Clear rollback capability
> - Audit trail of all automated actions

---

## 3. Context Source Availability by Version

| Source | V1 | V2 | V3 | V4 | V5 |
|--------|----|----|----|----|----|
| Website URL | ✅ | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ | ✅ |
| GitHub | ❌ | ✅ | ✅ | ✅ | ✅ |
| Deployment Platform | ❌ | ❌ | ✅ | ✅ | ✅ |
| Monitoring Tools | ❌ | ❌ | ❌ | ✅ | ✅ |
| Automated Agent | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Max Context Completeness by Version

| Version | Max Score |
|---------|-----------|
| V1 | 55% |
| V2 | 80% |
| V3 | 100% |
| V4 | 100% + continuous |
| V5 | 100% + proactive |

---

## 5. November 2026 Target Assessment

V1 scope (Website URL + File Upload + Evidence Engine + Diagnosis Engine) is fully achievable before November 2026 when built with the existing React 18 + TypeScript frontend architecture.

The existing [`DiagnosisPage.tsx`](file:///c:/House_of_Growth/DeployFix_Lab/frontend/src/features/diagnosis/DiagnosisPage.tsx) already provides the scaffold for Evidence display, Source input, and Diagnosis output as specified in V1.
