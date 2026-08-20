# CI/CD GitHub Actions Specification — Automated Test & Deploy Pipelines

**Document Name:** CI/CD GitHub Actions Specification  
**Document ID:** DEP-PROMPT-006  
**Version:** 1.0.0  
**Category:** Continuous Integration & Delivery  
**Status:** Approved  

---

## 1. Automated Pull Request CI Workflow (`.github/workflows/ci.yml`)

Runs on every Pull Request to ensure zero regressions in TypeScript types, unit tests, and production bundles.

```yaml
name: DeployFix Lab CI Suite

on:
  pull_request:
    branches: [main, master-trial.Radhesh, "master(trial)"]
  push:
    branches: [main, master-trial.Radhesh, "master(trial)"]

jobs:
  validate-frontend:
    name: Frontend Type-Check & Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install Frontend Dependencies
        working-directory: frontend
        run: npm ci

      - name: TypeScript Type-Check
        working-directory: frontend
        run: npm run type-check

      - name: Production Bundle Verification
        working-directory: frontend
        run: npm run build

  validate-backend:
    name: Backend Test Suite & Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json

      - name: Install Backend Dependencies
        working-directory: backend
        run: npm ci

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run Backend Unit & Integration Tests
        working-directory: backend
        run: npm test -- --coverage
```

---

## 2. Automated Production Deployment Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Production (Vercel & Render)

on:
  push:
    branches: [main, master-trial.Radhesh]

jobs:
  deploy-frontend:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment Information
        working-directory: frontend
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        working-directory: frontend
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        working-directory: frontend
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    name: Trigger Render Backend Deploy
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```
