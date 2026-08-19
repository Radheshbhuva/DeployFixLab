# DeployFix Lab — Auth Security & Validation Specification

> **Document ID:** `DFIX-AUTH-SEC-006`  
> **Target Subsystem:** `frontend/src/features/auth/`, `frontend/src/utils/`

---

## 🛡️ 1. Input Sanitization & Normalization

All authentication inputs must pass through client-side normalization before validation or network transmission:

| Field | Normalization Rules | Purpose |
|---|---|---|
| **Email Address** | `.trim()`, `.toLowerCase()` | Prevents accidental duplicate accounts via whitespace or casing mismatches (`User@App.io` vs `user@app.io`). |
| **Full Name** | `.trim()`, regex replacement of multi-spaces to single space | Ensures clean display names across dashboards and certificates. |
| **Password** | Unaltered, strictly preserved exact unicode string | Avoids breaking valid complex passwords. |

---

## 📊 2. Password Strength & Entropy Engine

The `<PasswordStrengthMeter />` computes score ($0 - 4$) and percentage ($0 - 100\%$) evaluated against 4 deterministic criteria:

```typescript
export interface PasswordCriterion {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

export const evaluatePassword = (password: string) => {
  const criteria: PasswordCriterion[] = [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/, met: false },
    { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', regex: /[A-Z]/, met: false },
    { id: 'number', label: 'At least one number (0-9)', regex: /[0-9]/, met: false },
    { id: 'special', label: 'At least one symbol (!@#$%^&*)', regex: /[^A-Za-z0-9]/, met: false },
  ];

  criteria.forEach((c) => {
    c.met = c.regex.test(password);
  });

  const metCount = criteria.filter((c) => c.met).length;
  const score = metCount; // 0 - 4
  const percentage = (metCount / criteria.length) * 100; // 0 - 100%

  let label = 'Weak';
  let color = 'bg-rose-500';

  if (score === 2) {
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (score === 3) {
    label = 'Good';
    color = 'bg-blue-500';
  } else if (score === 4) {
    label = 'Strong & Secure';
    color = 'bg-emerald-500';
  }

  return { criteria, score, percentage, label, color, isValid: score >= 3 };
};
```

---

## 🔒 3. Rate Limiting & Zero-Secret Console Logging

1. **Client-Side Cooldown Engine**:
   - If a user submits invalid credentials 5 times in under 2 minutes, the UI engages a 30-second countdown lock on the submit button.
   - Button text displays: *"Too many attempts. Retry in 28s..."*.

2. **Zero-Secret Logging Mandate**:
   - Authentication passwords and tokens MUST NEVER be passed to `console.log()`, `console.error()`, or telemetry analytics.
   - Error messages returned from the API must be sanitized before rendering into the DOM.
