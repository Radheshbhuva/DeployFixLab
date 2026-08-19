# 07 — DeployFix Lab: Pricing, Testimonials & FAQ Specification

---

## Document Metadata

| Field | Value |
|---|---|
| **Document Name** | Pricing, Testimonials & FAQ Specification |
| **Document ID** | DFIX-SPEC-021-07 |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Components** | `PricingSection.tsx`, `TestimonialsSection.tsx`, `FaqSection.tsx` |

---

## 1. Pricing Tier Matrix (`PricingSection.tsx`)

### Pricing Models & Data Structure

```typescript
export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Community Developer',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Essential deployment troubleshooting for individual developers and students.',
    features: [
      '5 standard Docker & DB chaos scenarios',
      'Client-side multi-source evidence audit',
      'Local container execution sandbox',
      'Standard diagnostic confidence metrics',
      'Community Discord support'
    ],
    ctaLabel: 'Get Started Free',
    ctaHref: '/register'
  },
  {
    id: 'pro',
    name: 'Pro Engineer',
    badge: 'MOST POPULAR',
    isPopular: true,
    priceMonthly: 29,
    priceAnnual: 24,
    description: 'Complete diagnostic suite with unlimited AI root-cause correlation and live telemetry.',
    features: [
      'All 15+ containerized chaos scenarios',
      'Unlimited 4-source AI diagnostic runs',
      'Real-time WebSocket log stream with filters',
      'Automated code diff patch generation',
      'Zero-secret regex redaction engine',
      'Interactive guided recovery playbooks',
      'Priority incident support'
    ],
    ctaLabel: 'Launch Pro Sandbox',
    ctaHref: '/register?plan=pro'
  },
  {
    id: 'team',
    name: 'Team & Enterprise',
    priceMonthly: 99,
    priceAnnual: 79,
    description: 'Advanced incident training and custom failure injection for engineering teams.',
    features: [
      'Everything in Pro for entire team',
      'Custom chaos scenario builder & injector',
      'Cohort & student progress telemetry',
      'CI/CD automated incident replay runner',
      'Role-based access control (Admin / Instructor)',
      'SAML SSO & Audit logging',
      'Dedicated SRE support & custom integrations'
    ],
    ctaLabel: 'Contact Enterprise',
    ctaHref: 'mailto:enterprise@deployfixlab.io'
  }
];
```

---

## 2. Developer Testimonials Section (`TestimonialsSection.tsx`)

```typescript
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  metricHighlight: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Sarah Chen',
    role: 'Principal SRE',
    company: 'CloudScale Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    quote: 'DeployFix Lab cut our junior onboarding time in half. Instead of explaining network bridge errors repeatedly, new hires diagnose container crash loops in realistic sandboxes.',
    metricHighlight: '70% Faster SRE Onboarding'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Lead DevOps Architect',
    company: 'Nexus FinTech',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    quote: 'The 4-source correlation engine is revolutionary. It caught a subtle Nginx upstream timeout caused by Docker internal DNS in seconds—an error that took our team 3 hours during our last outage.',
    metricHighlight: '3hr Outage Resolved in 30s'
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Fullstack Engineering Lead',
    company: 'Veloce Data',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    quote: 'Zero-Secret filtering was our non-negotiable requirement. DeployFix guarantees our AWS keys and DB tokens never leak, while delivering accurate code diff patches.',
    metricHighlight: '100% Secret-Safe Diagnosis'
  }
];
```

---

## 3. Technical FAQ Accordion Section (`FaqSection.tsx`)

```typescript
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does DeployFix Lab protect sensitive environment secrets?',
    answer: 'DeployFix Lab utilizes a multi-layer regex redaction engine on the client side before any payload is submitted. Variables such as DATABASE_URL, AWS_SECRET_ACCESS_KEY, JWT_SECRET, and private keys are matched against strict patterns and replaced with sanitized placeholders like [REDACTED_32_BYTES]. Raw credentials never leave your browser.',
    category: 'Security'
  },
  {
    id: 'faq-2',
    question: 'How is DeployFix Lab different from ChatGPT or generic LLMs?',
    answer: 'Generic LLMs only see raw text pasted into a chat prompt and frequently hallucinate confident but ungrounded advice. DeployFix Lab correlates 4 structured layers (Website URL probes, Docker configurations, git commit histories, and deployment logs) using deterministic rules and mathematical evidence scoring. Every diagnosis includes verifiable evidence and capped confidence bounds.',
    category: 'Engine'
  },
  {
    id: 'faq-3',
    question: 'Can I run DeployFix Lab entirely on my local machine?',
    answer: 'Yes! DeployFix Lab is built with full local Docker Compose support. You can clone the repository, run `docker-compose up`, and execute complete failure injection labs and diagnostic flows within your local container network.',
    category: 'Deployment'
  },
  {
    id: 'faq-4',
    question: 'What deployment platforms and technologies are supported?',
    answer: 'DeployFix Lab supports Node.js, Express, React, Vite, Next.js, Python FastAPI, PostgreSQL, Redis, Nginx, Docker Compose, AWS ECS, Vercel, and Kubernetes pod logs.',
    category: 'Compatibility'
  },
  {
    id: 'faq-5',
    question: 'What is the Capped Confidence Score?',
    answer: 'Confidence scores represent mathematical evidence sufficiency. If only 1 source is provided (e.g. only a URL error), the score is capped at 60% (Moderate). Providing 3 or more correlated sources unlocks high confidence (>90%) with concrete code diff remediation.',
    category: 'Engine'
  }
];
```
