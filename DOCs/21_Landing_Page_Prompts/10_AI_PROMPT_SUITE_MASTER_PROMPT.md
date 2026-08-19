# 10 — DeployFix Lab: AI Prompt Suite & Master Prompts for Code Generation

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | AI Prompt Suite & Master Prompts for Code Generation |
| **Document ID** | DFIX-PROMPT-021-10 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Intended Agents** | Google Antigravity, Claude Code, Lovable, Cursor |

---

## 1. How to Use These Master Prompts

This document provides **copy-paste ready, highly structured prompts** for AI coding assistants to generate the DeployFix Lab Landing Page file by file with zero ambiguity.

---

## 2. Prompt 01 — Types and Mock Data Architecture

```markdown
### TASK: Create Landing Page Data Models & Mock Datasets

Create two files in `frontend/src/features/landing/`:
1. `types/landing.types.ts`: Define full TypeScript interfaces for:
   - `SampleIncident` (id, title, badge, severity, evidence array, rootCause, confidenceScore, confidenceTier, remediationTitle, remediationCommand, codeDiff)
   - `ContextSourceData` (id, title, badge, icon, description, capabilities, securityNote, codeSnippet, previewMetrics)
   - `LabScenarioPreview` (id, code, title, category, difficulty, durationMinutes, description, failureDriver, targetService, verificationScript, badgeColor)
   - `PricingPlan` (id, name, badge, isPopular, priceMonthly, priceAnnual, description, features, ctaLabel, ctaHref)
   - `TestimonialItem` (id, name, role, company, avatarUrl, quote, metricHighlight)
   - `FaqItem` (id, question, answer, category)

2. `data/landingData.ts`: Populate with rich, realistic mock datasets:
   - 3 realistic incident presets (`Postgres Connection Refused`, `Nginx 502 Bad Gateway`, `Port 3000 Collision`)
   - 4 context sources (`Website URL Probes`, `Multi-File Uploads`, `GitHub Context`, `Deployment Telemetry`)
   - 6 chaos scenarios (covering database, docker, networking, auth)
   - 3 pricing tiers (`Community Developer $0`, `Pro Engineer $29`, `Team & Enterprise $99`)
   - 3 developer testimonials with concrete MTTR reduction metrics
   - 5 technical FAQs answering Zero-Secret security, local Docker execution, and capped confidence algorithms.

Use strict TypeScript with no `any` types.
```

---

## 3. Prompt 02 — Hero & Interactive Incident Studio

```markdown
### TASK: Create HeroSection and InteractiveStudioPreview Components

In `frontend/src/features/landing/components/`:
1. `HeroSection.tsx`:
   - Top pill badge: "DeployFix V2 Live Engine — 4-Source Context & Zero-Secret Safety" with pulsing cyan dot.
   - H1 Display: "Stop Guessing in Production. Diagnose Broken Deployments with Multi-Source Evidence." with gradient text styling.
   - Subheadline describing evidence correlation, capped confidence, and verifiable remediation playbooks.
   - Dual CTAs: Primary "Start Free Lab" (links to `/register`) + Secondary "View Live Demo" (scrolls to `#demo`).
   - Renders `<InteractiveStudioPreview />`.

2. `InteractiveStudioPreview.tsx`:
   - Tab switcher for 3 sample incidents (Postgres ECONNREFUSED, Nginx 502, Port Collision).
   - Left column (Evidence Stream): Lists multi-source findings with source tags and icons.
   - Right column (Diagnosis & Fix):
     - Circular or linear Confidence Gauge (e.g. 94% [HIGH CONFIDENCE]).
     - Root cause summary card with glowing cyan accent.
     - Code diff patch preview with colored `+` and `-` lines.
     - Copyable remediation command with clipboard confirmation button.
   - Smooth active tab transitions and dark terminal styling.
```

---

## 4. Prompt 03 — 4-Source Context Showcase & Workflow Steps

```markdown
### TASK: Create ContextSourcesShowcase and DiagnosisWorkflowSteps Components

In `frontend/src/features/landing/components/`:
1. `ContextSourcesShowcase.tsx`:
   - Section ID: `#sources`.
   - Title: "Correlate All 4 Context Layers".
   - 4-tab interactive switcher (Website URL, File Uploads, GitHub Repo, Deployment Cloud).
   - Selected tab shows:
     - Detailed description & 4 bulleted capabilities with check icons.
     - Security guarantee callout (e.g. "Read-only probe", "Client-side regex redaction").
     - High-contrast syntax-highlighted code block / log snippet.
     - Telemetry metrics mini-cards (e.g. "Secrets Filtered: 2 Redacted", "HTTP Status: 502").

2. `DiagnosisWorkflowSteps.tsx`:
   - Section ID: `#how-it-works`.
   - 3-step numbered card workflow:
     1. Ingest Evidence (Collect logs, Dockerfiles, diffs, probes).
     2. Correlate Root Cause (AI engine maps symptoms to failure rules).
     3. Guided Playbook (Execute verified commands and confirm health).
   - Glassmorphism styling with connecting indicator lines.
```

---

## 5. Prompt 04 — Chaos Labs Catalog Preview & Live Log Terminal

```markdown
### TASK: Create ChaosLabsShowcase and LiveLogStreamSection Components

In `frontend/src/features/landing/components/`:
1. `ChaosLabsShowcase.tsx`:
   - Section ID: `#labs`.
   - Category filter pills: ALL | DATABASE | DOCKER | NETWORKING | AUTH.
   - 3-column responsive grid rendering `LabScenarioPreview` cards.
   - Each card displays:
     - Scenario Code (e.g., `DFIX-LAB-01`) & Category badge.
     - Difficulty Badge (`Beginner`, `Intermediate`, `Advanced`) with custom color tokens.
     - Target service and duration (e.g. `15 mins`).
     - Description of what is broken.
     - Failure driver and automated verification script snippet.
     - Direct CTA: "Launch Sandbox" linking to `/register` or `/labs/:id`.

2. `LiveLogStreamSection.tsx` & `SecurityArchitectureSection.tsx`:
   - Terminal window showing live simulated WebSocket logs with colors (INFO/WARN/ERROR/FATAL).
   - Filter dropdown by service (`[backend]`, `[postgres]`, `[nginx]`, `[chaos]`).
   - Security panel detailing Zero-Secret redaction and Docker bridge network isolation.
```

---

## 6. Prompt 05 — Pricing, Testimonials, FAQ & Assembly

```markdown
### TASK: Create Pricing, Testimonials, FAQ, Header, Footer & LandingPage Assembly

1. `PricingSection.tsx`: Monthly/Annual billing toggle (20% discount), 3 tier cards, highlighting "Pro Engineer".
2. `TestimonialsSection.tsx`: 3 developer quote cards with photos, roles, companies, and metric highlights.
3. `FaqSection.tsx`: Accordion list with expandable answers for 5 technical developer questions.
4. `LandingHeader.tsx`: Sticky glassmorphism header with status indicator, navigation anchors, and dynamic `useAuthStore` session state.
5. `LandingFooter.tsx`: 4-column footer with sitemap, documentation links, and copyright.
6. `LandingPage.tsx`: Top-level composition assembling all sections with proper semantic HTML5 and smooth scrolling.
7. `app/router.tsx`: Update `/` to render `<LandingPage />`.
```
