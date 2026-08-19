# DeployFix Lab — Auth Design System & Layout Specification

> **Document ID:** `DFIX-AUTH-DESIGN-002`  
> **Status:** Production Specification  
> **Styling Framework:** Tailwind CSS 3.4+ / Vanilla CSS Tokens

---

## 🎨 1. Color Palette & Typography Tokens

| Token Name | Hex Value | Tailwind Class | UI Usage |
|---|---|---|---|
| **Background Dark** | `#070A11` | `bg-[#070A11]` | Master full-viewport background |
| **Card Surface** | `#0F172A` (90% alpha) | `bg-slate-900/90` | Auth card & sidebar surface |
| **Input Background** | `#020617` (80% alpha) | `bg-slate-950/80` | Form input fields and code blocks |
| **Border Default** | `#1E293B` | `border-slate-800` | Standard card and section borders |
| **Border Active / Glow** | `#06B6D4` (40% alpha) | `border-cyan-500/40` | Focused inputs, primary card highlights |
| **Cyan Brand Accent** | `#06B6D4` | `text-cyan-400`, `bg-cyan-500` | Primary buttons, active tabs, badges |
| **Emerald Success** | `#10B981` | `text-emerald-400`, `bg-emerald-500` | Operational status, met password rules |
| **Rose Error** | `#F43F5E` | `text-rose-400`, `bg-rose-500/10` | Validation errors, failed credentials |
| **Amber Warning** | `#F59E0B` | `text-amber-400`, `bg-amber-500/10` | Moderate password strength |

### Typography Rules:
- **Heading & UI Copy**: Inter / Sans-Serif (`font-sans`), font weights 600 (semibold) and 800 (extrabold).
- **Telemetry, Code & Badges**: JetBrains Mono / Fira Code (`font-mono`), font weights 500 (medium) and 700 (bold).

---

## 🖥️ 2. Split-Screen Layout Grid Rules

### Desktop Viewports ($\ge$ 1024px):
- **Container**: Max-width `7xl` (`1280px`), min-height `85vh`, rounded-3xl with `border border-slate-800/80 bg-slate-900/40 backdrop-blur-2xl shadow-2xl`.
- **Left Column (5 cols / 42% width)**:
  - Background: `bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/20`.
  - Border: Right border `border-r border-slate-800/80`.
  - Padding: `p-8 lg:p-10`.
  - Displays platform branding, live telemetry terminal, security badges, and SRE testimonial quote.
- **Right Column (7 cols / 58% width)**:
  - Background: `bg-slate-950/60`.
  - Padding: `p-8 lg:p-12`.
  - Centers the authentication form with max-width `md` (`448px`).

### Mobile & Tablet Viewports (< 1024px):
- **Left Column**: Hidden on `< 1024px` to maximize form usability and minimize mobile scrolling.
- **Form Card**: Centered horizontally and vertically with full-width padding (`px-4 py-8`).

---

## 🔘 3. Input & Control Anatomy

### 1. Form Text Input (`<Input />`):
```html
<div className="space-y-1.5 text-left">
  <label className="block text-xs font-mono font-medium text-slate-300">
    Email Address <span className="text-rose-400">*</span>
  </label>
  <div className="relative">
    <input
      type="email"
      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
      placeholder="engineer@company.com"
    />
  </div>
  <!-- Error Helper -->
  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
    <span>● Enter a valid email address</span>
  </p>
</div>
```

### 2. Primary Submit Button:
```html
<button
  type="submit"
  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  <span>Sign In to Workspace</span>
  <ArrowRight className="w-4 h-4" />
</button>
```

### 3. Password Strength Meter Bar:
- 4 Segmented Bars:
  - Score 1 (25%): 1 red bar (`bg-rose-500`) $\rightarrow$ *"Weak"*
  - Score 2 (50%): 2 amber bars (`bg-amber-500`) $\rightarrow$ *"Fair"*
  - Score 3 (75%): 3 blue bars (`bg-blue-500`) $\rightarrow$ *"Good"*
  - Score 4 (100%): 4 emerald bars (`bg-emerald-500`) $\rightarrow$ *"Strong & Secure"*
