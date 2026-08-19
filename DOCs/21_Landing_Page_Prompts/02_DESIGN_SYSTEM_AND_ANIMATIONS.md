# 02 — DeployFix Lab: Landing Page Design System & Motion Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Landing Page Design System & Motion Specification |
| **Document ID** | DFIX-DS-021 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Framework** | Tailwind CSS 3.4 + Pure CSS Keyframe Animations |
| **Fonts** | Inter (Primary Sans) & JetBrains Mono (Code/Telemetry Mono) |

---

## 1. Color Palette Tokens

The landing page extends DeployFix Lab's official **Slate Dark Terminal** design system:

```
/* Base Background Tiers */
--bg-root:         #070A11;   /* Ultra-dark canvas background */
--bg-surface:      #0F172A;   /* Slate-900: Primary container background */
--bg-card:         #1E293B;   /* Slate-800: Secondary card panels */
--bg-elevated:     #334155;   /* Slate-700: Elevated interactive elements */

/* Border & Divider Tokens */
--border-subtle:   #1E293B;   /* Slate-800 */
--border-muted:    #334155;   /* Slate-700 */
--border-glow:     rgba(6, 182, 212, 0.3); /* Cyan Glow border */

/* Brand & Diagnostic Accents */
--accent-cyan:     #06B6D4;   /* Cyan-500: AI Diagnostic Engine & Links */
--accent-emerald:  #10B981;   /* Emerald-500: Healthy, Operational, Passed */
--accent-violet:   #8B5CF6;   /* Violet-500: Chaos Engine & Insights */
--accent-amber:    #F59E0B;   /* Amber-500: Warnings & Degraded State */
--accent-rose:     #F43F5E;   /* Rose-500: Broken Deployments & Errors */

/* Text Hierarchy */
--text-primary:    #F8FAFC;   /* Slate-50: Primary headlines & active text */
--text-secondary:  #94A3B8;   /* Slate-400: Body copy & descriptions */
--text-muted:      #64748B;   /* Slate-500: Captions, timestamps, disabled */
```

---

## 2. Background Grid & Radial Glow Recipes

### Background Mesh Grid Recipe (Tailwind CSS)
```tsx
<div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
```

### Hero Spotlight Radial Glow
```tsx
<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
<div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
```

---

## 3. Glassmorphism Card Recipes

### Standard Glass Card (`CardGlass`)
```tsx
<div className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 shadow-xl hover:border-slate-700/80 transition-all duration-200">
  {children}
</div>
```

### High-Impact Glowing Interactive Card (`CardGlow`)
```tsx
<div className="relative rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl p-8 shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20">
  {children}
</div>
```

---

## 4. Typography Hierarchy

| Style Role | Font Family | Size / Weight | Tailwind Utility | Example Usage |
|---|---|---|---|---|
| **Display Hero** | Inter | 48px–64px / Bold (700) | `text-4xl md:text-6xl font-bold tracking-tight text-slate-50` | Hero Main Hook |
| **Section Title** | Inter | 30px–36px / Bold (700) | `text-3xl md:text-4xl font-bold tracking-tight text-slate-100` | Section Headers |
| **Card Header** | Inter | 18px–20px / SemiBold (600) | `text-lg md:text-xl font-semibold text-slate-100` | Feature/Lab Cards |
| **Body Primary** | Inter | 16px / Regular (400) | `text-base text-slate-400 leading-relaxed` | Descriptions |
| **Terminal Mono** | JetBrains Mono | 13px–14px / Regular (400) | `font-mono text-xs md:text-sm text-slate-300` | Logs, Diffs, Code |
| **Badge / Stat** | JetBrains Mono | 11px–12px / Medium (500) | `font-mono text-xs uppercase tracking-wider` | Health status, tags |

---

## 5. Micro-Animations & CSS Keyframes

Add these utilities inside `frontend/src/index.css` or Tailwind config:

```css
@keyframes pulseGlow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(1000%); }
}

.animate-pulse-glow {
  animation: pulseGlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-scanline {
  animation: scanline 8s linear infinite;
}
```

---

## 6. Lucide Icon Taxonomy for Landing Page

| Section | Recommended Lucide Icon | Icon Color Class |
|---|---|---|
| AI Diagnosis Engine | `<Activity className="w-5 h-5" />`, `<Zap />` | `text-cyan-400` |
| Chaos Injection | `<Flame className="w-5 h-5" />`, `<AlertTriangle />` | `text-violet-400` |
| Live Log Streaming | `<Terminal className="w-5 h-5" />`, `<Radio />` | `text-emerald-400` |
| GitHub Integration | `<GitBranch className="w-5 h-5" />`, `<GitCommit />` | `text-slate-300` |
| Docker / Containers | `<Box className="w-5 h-5" />`, `<Cpu />` | `text-cyan-400` |
| Zero-Secret Security | `<ShieldCheck className="w-5 h-5" />`, `<Lock />` | `text-emerald-400` |
| Confidence Gauge | `<Gauge className="w-5 h-5" />`, `<CheckCircle2 />` | `text-cyan-400` |
| Guided Recovery | `<Wrench className="w-5 h-5" />`, `<CheckSquare />` | `text-amber-400` |
