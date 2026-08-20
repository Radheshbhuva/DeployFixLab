# Database & Migrations Specification — Supabase PostgreSQL

**Document Name:** Database & Migrations Specification  
**Document ID:** DEP-PROMPT-003  
**Version:** 1.0.0  
**Category:** Database Infrastructure  
**Status:** Approved  

---

## 1. Prisma Connection Architecture with Supabase

Supabase uses **Supavisor / PgBouncer** for high-throughput connection pooling. To prevent prepared statement and connection starvation errors with Prisma ORM in serverless and containerized deployments, two distinct connection strings must be specified:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")  // Transaction Pooler (Port 6543)
  directUrl = env("DIRECT_URL")    // Direct Session Connection (Port 5432)
}
```

### Connection String Rules:
1. **`DATABASE_URL` (Port 6543):**
   - Host: `aws-0-[REGION].pooler.supabase.com`
   - Port: `6543`
   - Parameter: `?pgbouncer=true`
   - Used for: All runtime queries (`findMany`, `create`, `update`, etc.).
2. **`DIRECT_URL` (Port 5432):**
   - Host: `aws-0-[REGION].pooler.supabase.com`
   - Port: `5432`
   - Used for: Prisma migrations (`prisma migrate dev`, `prisma migrate deploy`), shadow database creation, and DDL operations.

---

## 2. Migration Execution Commands

### In Local Development:
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### In Production / CI/CD Pipelines:
```bash
cd backend
# Deploy pending migrations without prompt
npx prisma migrate deploy

# Generate Prisma Client types
npx prisma generate
```

---

## 3. Schema Verification & Healthchecks

To verify database connectivity from the backend deployment:
```typescript
// backend/src/config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Database health check failed:', err);
    return false;
  }
}
```
