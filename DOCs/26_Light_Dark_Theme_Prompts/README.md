# DeployFix Lab — Light & Dark Theme System Specifications & Master Prompt Suite

> **Document ID:** `DFIX-THEME-SUITE-001`  
> **Status:** Production Specification & Master Prompt Suite  
> **Target Subsystems:** `frontend/src/index.css`, `frontend/tailwind.config.js`, `frontend/src/store/themeStore.ts`, `frontend/src/components/theme/`, `frontend/src/layouts/`

---

## 🎯 Overview

This directory contains the authoritative architecture, design system specifications, implementation plan, and the complete 7-part Master AI Prompt Suite for building a **zero-glitch, production-grade Light & Dark Theme System** in **DeployFix Lab**.

DeployFix Lab supports high-intensity engineering workflows (troubleshooting, terminal log streaming, AI reasoning, chaos orchestration). The theming engine is designed for maximum visual ergonomics in both day and night environments:
- **Light Theme**: A crisp, modern, ultra-clean Slate & White palette (`#F8FAFC` base canvas, `#FFFFFF` card surfaces, `#E2E8F0` borders, `#0F172A` high-contrast typography) with zero washed-out elements.
- **Dark Theme**: A deep, immersive Cyberpunk/Slate palette (`#0F172A` / `#0B0F19` base canvas, `#1E293B` card surfaces, `#334155` borders, `#F8FAFC` crisp typography) with luminous status accents.

---

## 📑 Specification Index

| File | Document ID | Description |
|---|---|---|
| [`00_MASTER_THEME_BRIEF.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/00_MASTER_THEME_BRIEF.md) | `DFIX-THEME-BRIEF-001` | Core philosophy, WCAG 2.2 AA contrast rules, anti-flash guarantees, and palette definitions. |
| [`01_IMPLEMENTATION_PLAN.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/01_IMPLEMENTATION_PLAN.md) | `DFIX-THEME-PLAN-001` | Full-stack frontend implementation roadmap across tokens, provider, and components. |
| [`02_DESIGN_TOKENS_AND_COLOR_SYSTEM_SPEC.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/02_DESIGN_TOKENS_AND_COLOR_SYSTEM_SPEC.md) | `DFIX-THEME-TOKENS-002` | Exact CSS variable token mappings, surface elevations, and typography contrast ratios. |
| [`03_THEME_PROVIDER_AND_STATE_SPEC.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/03_THEME_PROVIDER_AND_STATE_SPEC.md) | `DFIX-THEME-STATE-003` | Zustand `themeStore`, `ThemeProvider`, anti-FOIT inline bootstrapper, and system listeners. |
| [`04_COMPONENT_THEMING_AND_CONTRAST_SPEC.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/04_COMPONENT_THEMING_AND_CONTRAST_SPEC.md) | `DFIX-THEME-COMP-004` | Guidelines for theming cards, tables, modals, terminals, confidence gauges, and charts. |
| [`05_MASTER_PROMPT_SUITE.md`](file:///c:/House_of_Growth/DeployFix_Lab/DOCs/26_Light_Dark_Theme_Prompts/05_MASTER_PROMPT_SUITE.md) | `DFIX-THEME-PROMPTS-005` | The 7-part sequential, copy-pasteable Master AI Prompt Suite for automated code generation. |

---

## 🛡️ Zero-Glitch Guarantees

1. **Anti-FOIT (Flash of Incorrect Theme)**: An inline script in `index.html` resolves the stored theme or OS preference before React renders, ensuring zero white/dark screen flicker during reload.
2. **CSS Variable Tokenization**: All Tailwind color classes (`bg-primary`, `bg-surface`, `text-primary`, `border-default`) reference CSS custom properties, enabling instantaneous theme switching with 0ms delay and zero layout shifting.
3. **Dedicated Terminal Contrast**: Live logs and simulated terminal outputs maintain dark, syntax-highlighted surfaces even in Light Mode to preserve developer authenticity and readability.
