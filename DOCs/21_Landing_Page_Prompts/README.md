# 21 — DeployFix Lab: Landing Page Specification & Master Prompt Suite

---

## Directory Overview

This directory contains the **complete specification, architectural implementation plan, visual design system, component blueprints, and master prompt suite** for building the official developer landing page for **DeployFix Lab**.

The landing page is designed to convert DevOps engineers, SREs, software developers, and students into active users by demonstrating DeployFix Lab's core differentiator: **evidence-based, deterministic deployment diagnosis and guided recovery without guesswork**.

---

## File Index

| File | Document Name | Purpose |
|---|---|---|
| [00_MASTER_LANDING_PAGE_BRIEF.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/00_MASTER_LANDING_PAGE_BRIEF.md) | Master Brief & Positioning | Product identity, core narrative, target audience personas, value proposition, conversion funnel |
| [01_IMPLEMENTATION_PLAN.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/01_IMPLEMENTATION_PLAN.md) | Engineering Implementation Plan | Atomic checklist, file-by-file scaffolding plan, state strategy, routing integration |
| [02_DESIGN_SYSTEM_AND_ANIMATIONS.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/02_DESIGN_SYSTEM_AND_ANIMATIONS.md) | Design System & Motion | Color tokens, typography, glassmorphism, terminal styling, glow effects, micro-animations |
| [03_HERO_AND_INTERACTIVE_STUDIO_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/03_HERO_AND_INTERACTIVE_STUDIO_SPEC.md) | Hero & Diagnosis Simulator | Hero copy, CTA hierarchy, interactive mock diagnosis studio with live confidence gauge |
| [04_CONTEXT_SOURCES_SHOWCASE_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/04_CONTEXT_SOURCES_SHOWCASE_SPEC.md) | 4-Source Evidence Ingestion | Interactive tabs for URL probes, Dockerfile upload, GitHub repo tree, and deployment logs |
| [05_CHAOS_LABS_CATALOG_PREVIEW_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/05_CHAOS_LABS_CATALOG_PREVIEW_SPEC.md) | Chaos Labs Showcase | Filterable lab scenario cards, failure driver simulation, difficulty badges, verification logs |
| [06_LOG_STREAM_TERMINAL_AND_ARCHITECTURE_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/06_LOG_STREAM_TERMINAL_AND_ARCHITECTURE_SPEC.md) | Log Stream & Security Engine | Interactive WebSocket terminal simulator, network isolation architecture, Zero-Secret security |
| [07_PRICING_TESTIMONIALS_AND_FAQ_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/07_PRICING_TESTIMONIALS_AND_FAQ_SPEC.md) | Pricing, Social Proof & FAQ | Free/Pro/Enterprise tier matrix, developer testimonials, technical FAQ accordion |
| [08_NAVIGATION_HEADER_AND_FOOTER_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/08_NAVIGATION_HEADER_AND_FOOTER_SPEC.md) | Navigation & Footer | Sticky blur header, live status indicator, mobile drawer, social links, footer sitemap |
| [09_ROUTING_AND_APP_INTEGRATION_SPEC.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/09_ROUTING_AND_APP_INTEGRATION_SPEC.md) | Router & App Integration | Route configuration in `router.tsx` (`/` landing vs authenticated `/dashboard`), navigation flow |
| [10_AI_PROMPT_SUITE_MASTER_PROMPT.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/10_AI_PROMPT_SUITE_MASTER_PROMPT.md) | AI Prompt Suite & Code Prompts | Self-contained, prompt-ready instructions for Antigravity / Claude Code / Lovable code generation |

---

## Core Value Proposition at a Glance

```
                         ┌───────────────────────────────────────────────────┐
                         │               DEPLOYFIX LAB LANDING               │
                         └─────────────────────────┬─────────────────────────┘
                                                   │
                ┌──────────────────────────────────┴──────────────────────────────────┐
                ▼                                                                     ▼
    ┌───────────────────────┐                                             ┌───────────────────────┐
    │  DIAGNOSTIC ENGINE    │                                             │   CHAOS LAB SANDBOX   │
    │  • Multi-Source Logs  │                                             │  • Controlled Fails   │
    │  • Zero-Secret Safety │                                             │  • Live Container Sim │
    │  • Capped Confidence  │                                             │  • Instant Reset      │
    │  • Code Diff Patches  │                                             │  • Verification Runs  │
    └───────────────────────┘                                             └───────────────────────┘
```

---

## How to Use This Pack

1. **For Architecture Review**: Read [00_MASTER_LANDING_PAGE_BRIEF.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/00_MASTER_LANDING_PAGE_BRIEF.md) and [01_IMPLEMENTATION_PLAN.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/01_IMPLEMENTATION_PLAN.md).
2. **For Visual Design Implementation**: Review tokens and animations in [02_DESIGN_SYSTEM_AND_ANIMATIONS.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/02_DESIGN_SYSTEM_AND_ANIMATIONS.md).
3. **For Component Scaffolding**: Reference specific specs (03 through 08) and feed [10_AI_PROMPT_SUITE_MASTER_PROMPT.md](file:///c:/House_of_Growth/DeployFix_Lab-Trial/DOCs/21_Landing_Page_Prompts/10_AI_PROMPT_SUITE_MASTER_PROMPT.md) to AI coding agents.
