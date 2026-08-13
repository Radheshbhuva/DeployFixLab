# 01 — Design System Prompt for Lovable

> **Prerequisite:** Paste `00_MASTER_BRIEF.md` into Lovable first.
> This prompt establishes the full design system — colors, typography, spacing, and reusable component tokens.
> Paste this as the FIRST feature prompt in your Lovable session after the master brief.

---

## PROMPT TO PASTE INTO LOVABLE:

```
I am building the DeployFix Lab frontend — a dark-mode engineering dashboard for production deployment troubleshooting. Set up the complete design system and Tailwind configuration as described below.

---

TAILWIND CONFIG (tailwind.config.js):

Extend the default Tailwind config with these custom tokens:

Colors:
- bg-primary: #0F172A (Slate-900)
- bg-surface: #1E293B (Slate-800)
- bg-raised: #334155 (Slate-700)
- border-default: #475569 (Slate-600)
- brand-primary: #3B82F6 (Blue-500)
- brand-hover: #2563EB (Blue-600)
- status-success: #22C55E (Green-500)
- status-success-dim: #166534 (Green-900)
- status-danger: #EF4444 (Red-500)
- status-danger-dim: #7F1D1D (Red-900)
- status-warning: #F59E0B (Amber-500)
- status-warning-dim: #78350F (Amber-900)
- text-primary: #F1F5F9 (Slate-100)
- text-secondary: #94A3B8 (Slate-400)
- text-muted: #64748B (Slate-500)
- terminal-green: #4ADE80 (Green-400)
- terminal-red: #F87171 (Red-400)
- terminal-amber: #FCD34D (Amber-300)
- terminal-cyan: #67E8F9 (Cyan-300)

Font Families:
- sans: ['Inter', 'sans-serif']
- mono: ['JetBrains Mono', 'Fira Code', 'monospace']

---

GLOBAL CSS (src/index.css or src/app/globals.css):

1. Import Inter from Google Fonts.
2. Import JetBrains Mono from Google Fonts.
3. Set `html { font-family: 'Inter', sans-serif; }`.
4. Set `body { background-color: #0F172A; color: #F1F5F9; }`.
5. Remove all default browser margins/paddings.
6. Set custom scrollbar styles: thin, dark track (#1E293B), thumb (#475569), rounded.

---

DESIGN TOKENS — Component Defaults:

All Card components:
- Background: bg-surface (#1E293B)
- Border: 1px border-default (#475569)
- Border radius: rounded-lg
- Padding: p-6

All Button variants:
- Primary: bg-brand-primary text-white hover:bg-brand-hover
- Danger: bg-status-danger text-white hover:bg-red-600
- Ghost: bg-transparent border border-default text-text-secondary hover:bg-bg-raised
- All buttons: rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150

All Badge variants:
- Success badge: bg-status-success-dim text-status-success text-xs px-2 py-0.5 rounded-full font-medium
- Danger badge: bg-status-danger-dim text-status-danger text-xs px-2 py-0.5 rounded-full font-medium
- Warning badge: bg-status-warning-dim text-status-warning text-xs px-2 py-0.5 rounded-full font-medium
- Info badge: bg-blue-900 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium

All Input fields:
- Background: bg-bg-primary (#0F172A)
- Border: border border-default
- Text: text-text-primary
- Placeholder: placeholder-text-muted
- Focus: focus:ring-2 focus:ring-brand-primary focus:border-transparent
- Rounded: rounded-md
- Padding: px-3 py-2 text-sm

---

COMPONENT FILES TO CREATE:

Create these files inside src/components/ui/:

1. Button.tsx
   - Props: variant ('primary' | 'danger' | 'ghost'), size ('sm' | 'md' | 'lg'), isLoading (boolean), disabled (boolean), onClick, children
   - Show a Lucide Loader2 spinner (spinning animation) when isLoading = true
   - All variants above

2. Badge.tsx
   - Props: variant ('success' | 'danger' | 'warning' | 'info' | 'default'), children, size ('sm' | 'md')
   - Use the badge tokens above

3. Card.tsx
   - Props: title (optional), description (optional), children, className (optional), onClick (optional)
   - Hover state: subtle ring highlight (ring-1 ring-slate-600) if onClick is provided

4. Input.tsx
   - Props: label, placeholder, type, error (string), register (React Hook Form), name, required
   - Show error message in text-status-danger text-xs below the input when error is set

5. Modal.tsx
   - Props: isOpen, onClose, title, children, size ('sm' | 'md' | 'lg')
   - Dark overlay background
   - Animated slide-in from top using CSS transitions (not a library)
   - Close button (X) in top-right corner using Lucide X icon

6. LoadingSpinner.tsx
   - A centered full-screen spinner for page-level loading states
   - Use Lucide Loader2 with spin animation
   - Text below: "Loading..." in text-text-muted

7. StatusDot.tsx
   - Props: status ('healthy' | 'degraded' | 'failed' | 'unknown')
   - A pulsing colored dot
   - healthy = green, degraded = amber, failed = red, unknown = slate

Create these files inside src/components/feedback/:

8. Skeleton.tsx
   - Props: width, height, className
   - Animated shimmer loading skeleton using a CSS animation
   - Background: bg-bg-raised with shimmer gradient

9. ErrorBoundary.tsx
   - React class component error boundary
   - Shows a clean error card with a "Reload Page" button when an unhandled error occurs

---

All components must:
- Be named exports (not default exports)
- Have full TypeScript prop interfaces
- Use only Tailwind CSS classes (no inline styles)
- Include aria-labels on all interactive elements
```

---

## EXPECTED OUTPUT FROM LOVABLE

After this prompt, Lovable should produce:
- `tailwind.config.js` — with all custom tokens
- `src/index.css` — with Google Fonts imports and global reset
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/LoadingSpinner.tsx`
- `src/components/ui/StatusDot.tsx`
- `src/components/feedback/Skeleton.tsx`
- `src/components/feedback/ErrorBoundary.tsx`
