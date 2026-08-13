# 08 — Navigation & App Layout Module Specification for Antigravity

> **Prerequisites:** Specifications 00–07 must be reviewed first.
> This specification details the App Shell: sidebar navigation, top header, breadcrumbs, user profile dropdown, and responsive mobile layout to implement in Antigravity.

---

## ANTIGRAVITY DIRECT IMPLEMENTATION BLUEPRINT:

```
Build the App Layout shell for DeployFix Lab. This is the persistent layout wrapping all authenticated pages: sidebar navigation, top header bar, breadcrumbs, user profile dropdown, and responsive mobile behavior.

---

APP LAYOUT (src/layouts/AppLayout.tsx):

Props: children: React.ReactNode

Layout structure:
  - Fixed left sidebar (240px wide, full viewport height)
  - Top header (56px tall, spans the remaining width to the right of sidebar)
  - Main content area (scrollable, fills remaining space below header)

Desktop layout (≥ lg breakpoint):
  ┌──────────────┬─────────────────────────────────┐
  │              │  HEADER (56px)                  │
  │  SIDEBAR     ├─────────────────────────────────┤
  │  (240px)     │                                 │
  │              │  MAIN CONTENT (scrollable)      │
  │              │                                 │
  └──────────────┴─────────────────────────────────┘

Mobile layout (< lg breakpoint):
  - Sidebar hidden by default
  - Hamburger menu (☰) in header opens a slide-over drawer sidebar (overlay)
  - Content is full width

---

SIDEBAR (src/layouts/components/Sidebar.tsx):

Background: bg-surface (#1E293B)
Right border: border-r border-default
Fixed position, full height

LOGO SECTION (top, h-14):
  - Lucide Terminal icon (Blue-500, 20px) + "DeployFix Lab" in font-bold text-text-primary
  - Below: "Engineering Platform" in text-xs text-text-muted
  - Bottom separator line

NAVIGATION SECTION (middle, scrollable):

  Label above nav groups: "MAIN" in text-xs font-semibold text-text-muted uppercase tracking-widest px-4 mb-2

  Navigation items (NavItem component):
    Props: icon, label, path, badge (optional: count or text)
    
    Visual:
    - Inactive: text-text-secondary, hover:bg-bg-raised hover:text-text-primary
    - Active (current route matches): bg-blue-600/15 text-brand-primary border-l-2 border-brand-primary (use NavLink from React Router to detect active)
    - Icon on left (Lucide, 18px), label in text-sm
    - Optional badge on right (e.g., "NEW" or a number count)
    - Transition: 150ms ease

  Navigation items in order:
  
  Group 1: MAIN
  1. Dashboard — LayoutDashboard icon — /dashboard
  2. Labs — FlaskConical icon — /labs — badge: "10" (lab count)
  3. AI Diagnosis — Brain icon — /diagnosis — badge: "NEW" (in Blue-500 bg)
  4. Log Viewer — Terminal icon — /logs

  Divider line

  Group 2: WORKSPACE
  Label: "WORKSPACE" in text-xs uppercase text-text-muted

  5. (appears only for ADMIN/INSTRUCTOR roles) Chaos Control — Zap icon — /admin/chaos — badge: dynamic active count in Red-500 bg

  Divider line

  Group 3: SUPPORT (bottom of nav list)
  6. Documentation — BookOpen icon — external link (opens docs)
  7. Settings — Settings icon — /settings (placeholder page, future)

USER PROFILE SECTION (bottom of sidebar):
  - Fixed at bottom above nothing
  - Thin separator line above
  - User avatar: initials circle (bg-blue-600 text-white, 32px circle) with user's initials from fullName
  - Next to avatar: fullName in text-sm font-medium text-text-primary + role in text-xs text-text-muted
  - LogOut icon button (far right, Ghost icon, 20px) — calls authStore.clearAuth() + navigate('/login')
  - Tooltip on logout icon: "Sign Out"

---

HEADER (src/layouts/components/Header.tsx):

Background: bg-surface
Border: border-b border-default
Height: h-14 (56px)
Sticky at top within the main content area

Left side:
  - Hamburger menu button (Menu icon, Lucide) — visible only on mobile (lg:hidden)
  - On desktop: Breadcrumb trail (BreadcrumbNav component, see below)

Right side (actions row):
  - Environment badge: "DEVELOPMENT" (amber) or "PRODUCTION" (green) or "STAGING" (blue) — reads from VITE_ENVIRONMENT env var
  - Notification bell (Bell icon, Ghost icon button) with a subtle dot if unread notifications
  - User avatar circle (same as sidebar) — clicking opens a dropdown:
    Dropdown menu items:
      - User's email (static, not clickable, text-text-muted)
      - Divider
      - "Profile Settings" — Settings icon — (future feature, placeholder)
      - "Sign Out" — LogOut icon — red text-status-danger — calls logout

---

BREADCRUMB NAV (src/layouts/components/BreadcrumbNav.tsx):

Reads the current React Router location and generates breadcrumbs:

Route → Breadcrumb:
  /dashboard → Home > Dashboard
  /labs → Home > Labs
  /labs/:id → Home > Labs > Lab #[id]
  /logs → Home > Logs
  /diagnosis → Home > Diagnosis
  /admin/chaos → Home > Admin > Chaos Control

Visual:
  - Items separated by ChevronRight icon (14px, text-text-muted)
  - Last item: text-text-primary, not a link
  - Other items: text-text-secondary, clickable links (hover: text-text-primary)
  - text-sm

---

MOBILE SIDEBAR DRAWER:

When hamburger is clicked on mobile:
  - A dark overlay appears (bg-black/60, full screen, z-40)
  - Sidebar slides in from left (translateX animation, 250ms ease)
  - Clicking overlay or pressing Escape closes the drawer
  - Close button (X icon) inside the drawer at top-right

---

PAGE WRAPPER (inside main content area):

All pages rendered inside AppLayout get a standard content wrapper:
  - Padding: px-8 py-6 on desktop, px-4 py-4 on mobile
  - Max width: max-w-[1400px] mx-auto (for ultra-wide screens)

---

NOTIFICATION SYSTEM (basic setup):

Create a simple toast notification system (src/components/ui/Toast.tsx):
  Props: type ('success' | 'error' | 'warning' | 'info'), message, duration (default: 4000ms)
  
  Visual:
  - Fixed top-right position (top-4 right-4 z-50)
  - Slide in from right, fade out
  - Types:
    - success: bg-status-success-dim border border-status-success, CheckCircle icon green
    - error: bg-status-danger-dim border border-status-danger, XCircle icon red
    - warning: bg-status-warning-dim border border-status-warning, AlertTriangle icon amber
    - info: bg-blue-900/60 border border-blue-500, Info icon blue
  - Auto-dismiss after duration
  - Manual close button (X)
  
  Create a useToast() hook (src/hooks/useToast.ts) to trigger toasts from anywhere in the app.

---

404 NOT FOUND PAGE (src/pages/NotFoundPage.tsx):

  Full-screen centered layout on bg-primary:
  - Large "404" in text-8xl font-black text-slate-700
  - Below: terminal prompt visual: "> error: route not found" in terminal green mono font
  - Subtitle: "The page you're looking for doesn't exist or you don't have access." in text-text-secondary
  - Button: "Return to Dashboard" — Primary variant — links to /dashboard
  - Subtle animated background (floating particles or terminal cursor blink effect)

---

VISUAL POLISH:
- Sidebar active item glow: a very subtle box-shadow: 2px 0 8px rgba(59, 130, 246, 0.1) on active NavItem
- Header has a very subtle backdrop-blur effect (if bg is translucent)
- Page transitions: all route changes use a fade transition (opacity 0→1, 200ms)
- The sidebar logo area can have a very faint gradient shimmer on brand name (CSS gradient animation, subtle)
```

---

## TARGET FILES TO BUILD IN ANTIGRAVITY

Antigravity will construct:
- `src/layouts/AppLayout.tsx`
- `src/layouts/components/Sidebar.tsx`
- `src/layouts/components/Header.tsx`
- `src/layouts/components/BreadcrumbNav.tsx`
- `src/layouts/components/NavItem.tsx`
- `src/components/ui/Toast.tsx`
- `src/hooks/useToast.ts`
- `src/pages/NotFoundPage.tsx`
