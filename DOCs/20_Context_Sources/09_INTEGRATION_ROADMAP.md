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
- ✅ Project Context Panel (2 of 3 sources active)
- ✅ Evidence Engine — extraction rules (EX-01 through EX-04)
- ✅ Evidence Engine — correlation rules (CR-01: Port Mismatch, CR-02: 502 Confirmation)
- ✅ Diagnosis Engine — deterministic diagnosis + AI-assisted explanation
- ✅ Context Completeness Gauge
- ✅ Guided Recovery Steps with code diff suggestions
- ✅ Context Qualification on all diagnosis outputs

---

### V2 — GitHub Integration
**Target:** Current Release  
**Goal:** Enable deep code + configuration analysis from actual repositories.

**Included:**
- ✅ GitHub Repository Integration (scope: `repo:read`)
- ✅ Repository selector UI
- ✅ Automatic artifact ingestion (Dockerfile, nginx.conf, .env.example, etc.)
- ✅ Evidence Rule: Port mismatch from source (EX-05)
- ✅ Evidence Rule: Missing env vars from .env.example (EX-06)
- ✅ Evidence Rule: CI/CD pipeline analysis (EX-07)
- ✅ Resync capability (pull latest repo state)
- ✅ Context Completeness: now up to 100% (Website + Upload + GitHub)

---

### V3 — Monitoring & Sandboxes
**Target:** Next Milestone  
**Goal:** Integrate observability tools and automated chaos sandbox verification.

**Included:**
- ✅ Container Chaos Sandbox Verification
- ✅ Sentry / Prometheus error tracking integration
- ✅ Automated health probing post-remediation
- ✅ Live SRE Terminal diagnostic playground

---

## 3. Context Source Availability by Version

| Source | V1 | V2 | V3 |
|--------|----|----|----|
| Website URL | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ |
| GitHub | ❌ | ✅ | ✅ |
| Container Sandbox | ❌ | ❌ | ✅ |

---

## 4. Max Context Completeness by Version

| Version | Max Score |
|---------|-----------|
| V1 | 65% |
| V2 | 100% |
| V3 | 100% + sandboxes |
