# 01 — DeployFix Lab: Landing Page Engineering Implementation Plan

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Landing Page Engineering Implementation Plan |
| **Document ID** | DFIX-ENG-021 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Target Codebase** | `frontend/src/features/landing/` |
| **Dependencies** | React 18, React Router DOM v6, Lucide React, Tailwind CSS 3.4, Zustand |

---

## 1. Overview & Architectural Strategy

The DeployFix Lab Landing Page will be created as a modular feature inside `frontend/src/features/landing/`. It provides a public-facing, responsive, visually stunning showcase of the entire product ecosystem without requiring immediate authentication, while offering seamless one-click transitions into the interactive sandbox and auth flow.

```
frontend/src/
├── app/
│   └── router.tsx                               # Route '/' mapped to <LandingPage />
├── features/
│   ├── landing/
│   │   ├── LandingPage.tsx                      # Top-level composition shell
│   │   ├── components/
│   │   │   ├── LandingHeader.tsx                # Sticky glassmorphism navigation
│   │   │   ├── HeroSection.tsx                  # Hero typography & CTA triggers
│   │   │   ├── InteractiveStudioPreview.tsx     # Functional simulated diagnosis widget
│   │   │   ├── StatsBanner.tsx                  # Metric stats & social proof strip
│   │   │   ├── ContextSourcesShowcase.tsx       # 4-source ingestion interactive tabs
│   │   │   ├── DiagnosisWorkflowSteps.tsx       # 3-step evidence correlation engine
│   │   │   ├── ChaosLabsShowcase.tsx            # Filterable lab scenario catalog preview
│   │   │   ├── LiveLogStreamSection.tsx         # WebSocket terminal simulation preview
│   │   │   ├── SecurityArchitectureSection.tsx  # Zero-Secret policy & network isolation
│   │   │   ├── PricingSection.tsx               # Free / Pro / Enterprise matrix
│   │   │   ├── TestimonialsSection.tsx          # SRE / Dev engineer social proof
│   │   │   ├── FaqSection.tsx                   # Interactive accordion FAQ
│   │   │   ├── CtaBanner.tsx                    # Pre-footer high-impact CTA
│   │   │   └── LandingFooter.tsx                # Comprehensive multi-column footer
│   │   ├── data/
│   │   │   └── landingData.ts                   # Structured mock data, labs, FAQs, stats
│   │   └── types/
│   │       └── landing.types.ts                 # TypeScript interfaces for landing sections
```

---

## 2. Phase-by-Phase Execution Plan

### Phase 1: Data Contracts & Types Definition
- **File**: `frontend/src/features/landing/types/landing.types.ts`
  - Define interfaces for `LabScenarioPreview`, `ContextSourceTab`, `DiagnosisSimulationStep`, `PricingPlan`, `FaqItem`, and `TestimonialItem`.
- **File**: `frontend/src/features/landing/data/landingData.ts`
  - Create rich, production-grade mock data reflecting real scenarios (e.g. `Postgres ECONNREFUSED`, `Nginx 502 Bad Gateway`, `Docker Port 3000 Collision`).

### Phase 2: Navigation & Hero Ecosystem
- **File**: `frontend/src/features/landing/components/LandingHeader.tsx`
  - Sticky glassmorphism header with system status indicator (`Operational`), navigation anchors, and Auth buttons.
- **File**: `frontend/src/features/landing/components/HeroSection.tsx`
  - High-impact headline, subline, glowing animated badge (`"V2 Engine Active — Zero-Secret Safety"`), primary & secondary CTAs.
- **File**: `frontend/src/features/landing/components/InteractiveStudioPreview.tsx`
  - Interactive diagnosis widget with simulated error inputs, live confidence arc gauge, and step-by-step diff remediation preview.

### Phase 3: Core Value Proposition & Engine Showcase
- **File**: `frontend/src/features/landing/components/StatsBanner.tsx`
  - 4 key metrics: `94% MTTR Reduction`, `15+ Chaos Scenarios`, `100% Zero-Secret Redaction`, `< 3s Diagnostic Speed`.
- **File**: `frontend/src/features/landing/components/ContextSourcesShowcase.tsx`
  - 4 interactive tabs (Website URL, File Uploads, GitHub Repo, Deployment Platform) showing how DeployFix correlations work.
- **File**: `frontend/src/features/landing/components/DiagnosisWorkflowSteps.tsx`
  - 3-step visual cards: Ingest Evidence → Correlate & Score → Verifiable Recovery Playbook.

### Phase 4: Labs, Telemetry & Security
- **File**: `frontend/src/features/landing/components/ChaosLabsShowcase.tsx`
  - Filterable interactive scenario cards (Beginner/Intermediate/Advanced) with direct `"Launch Lab"` links.
- **File**: `frontend/src/features/landing/components/LiveLogStreamSection.tsx`
  - Live animated terminal simulator with color-coded log entries and active source filtering.
- **File**: `frontend/src/features/landing/components/SecurityArchitectureSection.tsx`
  - Architecture diagram detailing Docker network isolation, read-only URL health probes, and client-side secret filtering.

### Phase 5: Social Proof, Pricing & FAQ
- **File**: `frontend/src/features/landing/components/PricingSection.tsx`
  - Monthly/Annual billing toggle, feature checks, recommended "Pro Engineer" highlighted card.
- **File**: `frontend/src/features/landing/components/TestimonialsSection.tsx`
  - 3 high-credibility testimonials from DevOps Leads, SREs, and Platform Engineers.
- **File**: `frontend/src/features/landing/components/FaqSection.tsx`
  - Collapsible accordion answering critical developer questions (privacy, self-hosting, Docker requirements).
- **File**: `frontend/src/features/landing/components/CtaBanner.tsx` & `LandingFooter.tsx`
  - High-contrast conversion banner and full footer with legal, docs, and GitHub links.

### Phase 6: Routing & App Assembly
- **File**: `frontend/src/features/landing/LandingPage.tsx`
  - Top-level page combining all sections with smooth scroll anchors.
- **File**: `frontend/src/app/router.tsx`
  - Route `/` renders `<LandingPage />`. Authenticated users can navigate freely to `/dashboard` or directly launch labs via the header.

---

## 3. Verification & Validation Protocol

```bash
# 1. Type-checking Verification
cd frontend
npm run type-check

# 2. Production Build Verification
npm run build

# 3. Development Server Verification
npm run dev
```

### Key Functional Checks
- [ ] Smooth scrolling on all header links (`#features`, `#sources`, `#labs`, `#pricing`, `#faq`).
- [ ] Interactive Diagnosis Studio simulator switches between sample failure scenarios.
- [ ] Context Sources tabs dynamically update simulated evidence payload and completeness gauges.
- [ ] Chaos Labs catalog filters accurately by difficulty level.
- [ ] Pricing billing toggle calculates monthly vs annual discounts.
- [ ] Accordion items open/close independently without layout shifts.
- [ ] Mobile navigation drawer opens and closes smoothly on small viewports (<768px).
