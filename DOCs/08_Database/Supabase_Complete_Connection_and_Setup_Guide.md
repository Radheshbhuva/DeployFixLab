# DeployFix Lab — Complete Supabase Setup & Connection Guide

This guide is designed for **first-time Supabase users**. It explains step-by-step how to set up a cloud PostgreSQL database on Supabase, configure your local DeployFix Lab environment, push your Prisma database schema, seed initial data, and verify the connection.

---

## 📌 Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Step 1: Create a Free Supabase Project](#step-1-create-a-free-supabase-project)
3. [Step 2: Collect Required Connection Keys from Supabase](#step-2-collect-required-connection-keys-from-supabase)
4. [Step 3: Configure Environment Variables in DeployFix Lab](#step-3-configure-environment-variables-in-deployfix-lab)
5. [Step 4: Push the Prisma Schema to Supabase](#step-4-push-the-prisma-schema-to-supabase)
6. [Step 5: Verify Tables in Supabase Dashboard](#step-5-verify-tables-in-supabase-dashboard)
7. [Step 6: Start and Test the Full-Stack Application](#step-6-start-and-test-the-full-stack-application)
8. [⚠️ Common First-Time Pitfalls & Solutions](#-common-first-time-pitfalls--solutions)

---

## 1. Overview & Architecture

DeployFix Lab uses **PostgreSQL** as its primary relational database. 

Instead of requiring every team member to install and run PostgreSQL locally or manage Docker containers manually, **Supabase** provides a fully managed, high-performance PostgreSQL database in the cloud for free.

```
┌─────────────────────────────────┐
│     DeployFix Lab Backend       │
│     (Node.js + Express)         │
└────────────────┬────────────────┘
                 │ Prisma ORM
     ┌───────────┴───────────┐
     │                       │
     ▼ (Port 6543)           ▼ (Port 5432)
Transaction Pooler       Direct Connection
(Runtime Queries)        (Prisma Schema Push)
     │                       │
     └───────────┬───────────┘
                 ▼
    ┌─────────────────────────┐
    │  Supabase Cloud Database│
    │  (PostgreSQL Instance)  │
    └─────────────────────────┘
```

### Why Two URLs?
- **`DATABASE_URL` (Port 6543 + PgBouncer Pooler)**: Used for running your backend server. Supabase's transaction pooler prevents connection exhaustion when handling multiple concurrent requests.
- **`DIRECT_URL` (Port 5432 Direct Connection)**: Used exclusively by Prisma CLI when creating tables or applying migrations (`npx prisma db push`).

---

## Step 1: Create a Free Supabase Project

1. Navigate to **[https://supabase.com](https://supabase.com)** and click **Sign In** or **Start your project**.
2. Sign in using your **GitHub account**.
3. Click **New Project** in your Supabase dashboard organization.
4. Fill in the project details:
   - **Name**: `deployfix-lab` (or any name you prefer)
   - **Database Password**: 
     > 💡 **Tip:** Generate a strong password using letters and numbers (e.g., `DeployFixSecretPass2026`). Avoid special characters like `@`, `#`, `:`, `/` or `%` as they can cause URI parsing errors. **Copy this password and save it somewhere safe!**
   - **Region**: Select the region closest to you (e.g. `ap-south-1 (Mumbai)`, `ap-southeast-1 (Singapore)`, etc.).
   - **Pricing Plan**: Free.
5. Click **Create new project** and wait ~1–2 minutes while Supabase provisions your PostgreSQL instance.

---

## Step 2: Collect Required Connection Keys from Supabase

Once your project is provisioned:

### A. Get Database Connection Strings (For Backend)
1. In the left sidebar of your Supabase dashboard, click **Project Settings** (gear icon at the bottom).
2. Click **Database** under Configuration.
3. Scroll down to the **Connection string** section:
   - Select the **URI** tab.
   - Set **Mode** to **Transaction** (Port `6543`).
   - Copy the URI string. It looks like:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Now switch **Mode** to **Session** or select **Direct connection** (Port `5432`).
   - Copy the direct URI string. It looks like:
     ```text
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
   - In both strings, replace `[YOUR-PASSWORD]` with the actual database password you created in Step 1.

### B. Get API Keys (For Frontend)
1. Still under **Project Settings**, click **API**.
2. Copy:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **Project API Keys -> `anon` / `public`** (a long string starting with `eyJ...`)

---

## Step 3: Configure Environment Variables in DeployFix Lab

Now open your local DeployFix Lab codebase in VS Code or Antigravity IDE.

### 1. Configure Backend `.env`
Inside `Application/backend/`, create a `.env` file (or copy from `.env.example`):

Path: `Application/backend/.env`
```env
PORT=5000
NODE_ENV=development

# Paste your Supabase Transaction Pooler URL (Port 6543)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-REAL-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Paste your Supabase Direct URL (Port 5432)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-REAL-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:5432/postgres"

# JWT Auth Secrets (leave default or generate 64-char random hex string)
JWT_SECRET="deployfix_lab_dev_jwt_secret_change_in_production_min_64chars"
JWT_REFRESH_SECRET="deployfix_lab_dev_jwt_refresh_secret_change_in_production_min_64chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS configuration
CORS_ORIGIN="http://localhost:5173"
```

### 2. Configure Frontend `.env`
Inside `Application/frontend/`, create a `.env` file:

Path: `Application/frontend/.env`
```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Supabase Public Keys
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR-ANON-PUBLIC-KEY]
```

---

## Step 4: Push the Prisma Schema to Supabase

Now push all table definitions from `Application/backend/prisma/schema.prisma` directly into your Supabase database:

1. Open a terminal and navigate to the backend directory:
   ```powershell
   cd "Application/backend"
   ```

2. Run the Prisma push command:
   ```powershell
   npx prisma db push
   ```

3. **Expected Output:**
   ```text
   Environment variables loaded from .env
   Prisma schema loaded from prisma\schema.prisma
   Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-0-..."

   🚀  Your database is now in sync with your Prisma schema. Done in 2.3s
   ```

4. Generate the updated Prisma client types:
   ```powershell
   npx prisma generate
   ```

---

## Step 5: Verify Tables in Supabase Dashboard

To visually confirm that all tables and relationships were created:
1. Open your **Supabase Dashboard**.
2. In the left navigation menu, click **Table Editor** (grid icon).
3. You should see all DeployFix Lab tables created under the `public` schema:
   - `users`
   - `refresh_tokens`
   - `tasks`
   - `lab_scenarios`
   - `chaos_failures`
   - `user_lab_progress`
   - `verification_logs`
   - `audit_logs`
   - `github_connections`
   - `repositories`
   - `repository_scans`
   - `project_contexts`
   - `diagnostics`

---

## Step 6: Start and Test the Full-Stack Application

### 1. Start Backend
In terminal 1:
```powershell
cd "Application/backend"
npm run dev
```
You should see:
```text
[Server] DeployFix Backend listening on port 5000 in development mode
[WebSocket] Live WebSocket log stream ready at ws://localhost:5000/logs/stream
```

### 2. Start Frontend
In terminal 2:
```powershell
cd "Application/frontend"
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Verify End-to-End Registration & Persistence:
1. Click **Sign Up** on `http://localhost:5173/signup`.
2. Register a new test account (e.g., `admin@deployfix.io` / `Password123!`).
3. Log in and create a new task in the Dashboard or start an SRE Lab.
4. Refresh the Supabase **Table Editor** in your browser — you will immediately see your newly registered user in the `users` table and task entries in the `tasks` table!

---

## ⚠️ Common First-Time Pitfalls & Solutions

### Pitfall 1: Password contains special characters
- **Symptom:** `Error: P1013: The provided database string is invalid` or connection timeout.
- **Fix:** If your password has characters like `#`, `@`, `:`, `%`, you must either URL-encode them (`@` $\rightarrow$ `%40`, `#` $\rightarrow$ `%23`) or reset your database password in **Supabase Dashboard ➔ Project Settings ➔ Database ➔ Reset Password** using an alphanumeric string.

### Pitfall 2: Connection pooler port mismatch
- **Symptom:** `Prepared statement "s0" already exists` or schema push hangs.
- **Fix:** Ensure:
  - `DATABASE_URL` points to port `6543` with `?pgbouncer=true`.
  - `DIRECT_URL` points to port `5432` without `?pgbouncer=true`.

### Pitfall 3: IPv6 vs IPv4 Connectivity
- **Symptom:** Backend times out trying to reach `db.xxx.supabase.co`.
- **Fix:** Always use the pooler domain format provided by Supabase: `aws-0-[region].pooler.supabase.com`, which automatically handles IPv4 routing.
