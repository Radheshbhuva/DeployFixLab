# 08 — DeployFix Lab: Navigation Header & Footer Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Navigation Header & Footer Specification |
| **Document ID** | DFIX-SPEC-021-08 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Components** | `LandingHeader.tsx`, `LandingFooter.tsx` |

---

## 1. Sticky Navigation Header (`LandingHeader.tsx`)

### Layout & Visual Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ DeployFix Lab [v2.0]  ● Operational  │  Features  Sources  Chaos Labs  Pricing  FAQ  Docs  │ [Sign In] [Launch Platform] │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key UI Features
1. **Brand Identity**: Logo with pulsing cyan lightning/terminal icon, title "DeployFix Lab", and subtle version pill `v2.0`.
2. **Live Operational Indicator**: Animated emerald status dot (`<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />`) with text `"All Systems Operational"`.
3. **Anchor Navigation Links**:
   - `Features` (`#features` or `#how-it-works`)
   - `Context Sources` (`#sources`)
   - `Chaos Labs` (`#labs`)
   - `Pricing` (`#pricing`)
   - `FAQ` (`#faq`)
4. **Auth Actions**:
   - `Sign In` link navigating to `/login`
   - `Launch Platform` / `Get Started` button navigating to `/register` or `/dashboard`
5. **Mobile Responsiveness**: Clean hamburger menu with sliding backdrop blur drawer for screens `< 768px`.

---

## 2. Comprehensive Multi-Column Footer (`LandingFooter.tsx`)

### Column Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ⚡ DEPLOYFIX LAB              PLATFORM               RESOURCES              COMMUNITY & SOCIAL          │
│ Evidence-Based Production    • Diagnosis Engine     • Architecture Docs    • GitHub Repository         │
│ Deployment Troubleshooting    • Chaos Sandbox        • API Handover Spec    • Discord Community         │
│ & Guided Recovery.           • Live Log Streaming   • Context Source V2    • Twitter / X Updates       │
│                              • Scenario Catalog     • Zero-Secret Policy   • SRE Incident Newsletter   │
│                              • Telemetry Health     • Docker Guide         • Status Page (99.98%)      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ © 2026 DeployFix Lab. All rights reserved.           [Privacy Policy]  [Terms of Service]  [Security]  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Pre-Footer High-Impact CTA Banner (`CtaBanner.tsx`)

Located immediately above the footer, this banner drives final conversions:

```tsx
<div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-12 md:p-16 text-center overflow-hidden shadow-2xl">
  {/* Radial glow background */}
  <div className="relative z-10 max-w-3xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-bold text-slate-50 tracking-tight">
      Ready to Resolve Incidents in Seconds?
    </h2>
    <p className="text-slate-400 mt-4 text-lg">
      Join hundreds of DevOps engineers and developers practicing real deployment troubleshooting with evidence-backed AI diagnosis.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-base shadow-lg shadow-cyan-400/25 transition-all">
        Launch Free Incident Sandbox
      </Link>
      <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all">
        Sign In to Dashboard
      </Link>
    </div>
  </div>
</div>
```
