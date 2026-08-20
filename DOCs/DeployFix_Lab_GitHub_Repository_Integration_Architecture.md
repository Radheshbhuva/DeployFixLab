# DeployFix Lab — GitHub Repository Integration Architecture

## Document Status

**Purpose:** Define how DeployFix Lab, as a website/SaaS product, connects to GitHub repositories, retrieves project information, builds structured project context, and feeds that context into the analysis and Flares engines.

**Current Product Scope:** Website/SaaS only. No desktop application, mobile application, or locally installed DeployFix Lab agent is required for the current phase.

---

# 1. Product Scope: Website/SaaS Only

DeployFix Lab is a **web-based SaaS platform**.

For the current version:

- Users interact with DeployFix Lab through a web browser.
- There is no desktop application.
- There is no mobile application.
- There is no software that the user needs to install on their machine.
- GitHub integration happens through the DeployFix Lab website and its backend.
- The user's repository remains hosted on GitHub.
- DeployFix Lab acts as a secure bridge between the user's browser, GitHub, repository-analysis services, and the DeployFix Lab backend.

The basic model is:

```text
User
  │
  ▼
DeployFix Lab Website
  │
  ▼
DeployFix Lab Backend
  │
  ▼
GitHub
```

---

# 2. Why GitHub Integration Is Important

GitHub is the primary project-context source for DeployFix Lab.

The purpose of the integration is not merely to display a GitHub repository URL.

DeployFix Lab needs to understand the project sufficiently to diagnose deployment, configuration, infrastructure, CI/CD, and related problems.

The GitHub integration should therefore allow DeployFix Lab to obtain relevant information such as:

- Repository metadata
- Repository structure
- Branch information
- Relevant source files
- Configuration files
- Package manifests
- Docker configuration
- Nginx configuration
- Database configuration
- Prisma schema
- GitHub Actions workflows
- README and project documentation
- Relevant commit/change information
- Later, CI/CD results and related repository events

The retrieved information is transformed into a structured **Project Context** that can be consumed by DeployFix Lab's analysis engines.

---

# 3. High-Level Architecture

```text
                         DEPLOYFIX LAB
                           WEBSITE
                              │
                              ▼
                       React Frontend
                              │
                              ▼
                      Node/Express Backend
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              ▼              ▼
          GitHub App      Website URL     ZIP Upload
               │              │              │
               ▼              ▼              ▼
          GitHub API       Safe HTTP       Upload
               │              │              │
               └──────────────┼──────────────┘
                              ▼
                     Project Ingestion
                              │
                              ▼
                  Security / File Filtering
                              │
                              ▼
                   Project Context Engine
                              │
                              ▼
                    Analysis / Rules Engine
                              │
                              ▼
                         Flares Engine
                              │
                              ▼
                      DeployFix Dashboard
```

GitHub is the **primary** project-context source.

Website URL inspection and ZIP upload are alternative/fallback project-context methods.

---

# 4. Recommended GitHub Integration Approach

The recommended production architecture is:

> **GitHub App + GitHub API + Repository Snapshot/Git Access + Webhooks + Project Context Engine**

The flow is:

```text
User
 │
 ▼
DeployFix Lab Website
 │
 │ Click "Connect GitHub"
 ▼
GitHub Authorization / App Installation
 │
 ▼
Repository Selection
 │
 ▼
DeployFix Backend
 │
 ├── GitHub API
 ├── Repository Snapshot / Git Access
 └── Webhooks
 │
 ▼
Repository Ingestion
 │
 ▼
Security / File Filtering
 │
 ▼
Project Context
 │
 ▼
Analysis Engine
 │
 ▼
Flares
```

This architecture keeps DeployFix Lab entirely web-based while allowing it to securely interact with GitHub from the backend.

---

# 5. User Experience

## 5.1 Connect GitHub

The DeployFix Lab dashboard can provide:

```text
┌─────────────────────────────────────────────────┐
│ DeployFix Lab                                   │
│                                                 │
│ Add Project                                     │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🔗 Connect GitHub Repository                │ │
│ │                                             │ │
│ │ Analyze your repository automatically.      │ │
│ │                                             │ │
│ │              [ Connect GitHub ]             │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

The user clicks **Connect GitHub**.

DeployFix Lab redirects the user to GitHub's authorization/install flow.

---

# 6. GitHub App Installation

The preferred authorization model is a **GitHub App**.

The user should be able to select which repositories the DeployFix Lab GitHub App can access.

For the initial implementation, prefer:

> **Only selected repositories**

rather than automatically requesting access to all repositories.

Conceptually:

```text
Install DeployFix Lab

Repository access

○ All repositories
● Only select repositories

Repositories:
☑ DeployFix-Lab
☐ Other Project
☐ Another Project

Permissions:
Repository metadata     Read
Repository contents      Read

[Install]
```

The initial permission model should follow least privilege.

---

# 7. Initial GitHub Permissions

Start with the smallest useful permission set.

## Required initially

- Repository metadata — Read
- Repository contents — Read

Potential future permissions may include:

- Pull requests — Read
- Issues — Read
- Actions — Read
- Checks — Read
- Deployments — Read

Do not request all future permissions during the first implementation unless they are actually required.

The goal is to make the initial integration read-only and narrowly scoped.

---

# 8. Important Security Boundary

The browser must not directly use a privileged GitHub integration token to access repositories.

Avoid:

```text
React Browser
      │
      └──────────► GitHub API
```

Prefer:

```text
React Website
      │
      ▼
DeployFix Backend
      │
      ▼
GitHub API
```

The backend acts as the secure bridge.

GitHub credentials, installation tokens, secrets, and integration configuration must remain server-side.

Never expose privileged GitHub tokens to frontend JavaScript.

---

# 9. Authorization and Callback Flow

Conceptual flow:

```text
1. User clicks "Connect GitHub"
             │
             ▼
2. DeployFix starts GitHub App authorization/install
             │
             ▼
3. User authorizes DeployFix on GitHub
             │
             ▼
4. GitHub returns control to DeployFix
             │
             ▼
5. DeployFix backend records the GitHub installation
             │
             ▼
6. DeployFix retrieves available repositories
             │
             ▼
7. User selects a repository
             │
             ▼
8. DeployFix starts the initial repository scan
```

The backend should store the minimum information required to manage the integration.

Example conceptual record:

```text
github_connections
────────────────────────────
id
user_id
github_installation_id
github_account
created_at
```

---

# 10. Repository Selection

After authorization, DeployFix can show the repositories available to the installation.

Example:

```text
Select Repository

┌────────────────────────────────────────────┐
│ 🔵 DeployFix-Lab                           │
│ Radhesh/DeployFix-Lab                      │
│ TypeScript • React • Node.js               │
│                                            │
│                 [Analyze Repository]        │
└────────────────────────────────────────────┘
```

The selected repository becomes a DeployFix project-context source.

Example conceptual record:

```text
repositories
────────────────────────────
id
connection_id
github_repo_id
owner
name
default_branch
visibility
url
last_synced_at
```

---

# 11. How DeployFix Actually Gets Repository Information

GitHub does not automatically send the entire repository to DeployFix just because the user connects it.

DeployFix's backend must request the information.

The backend can use GitHub's supported APIs and Git access mechanisms to retrieve:

- Repository metadata
- Directory/file contents
- Repository snapshots
- Relevant branches
- Relevant commits
- Other permitted repository information

The core flow is:

```text
DeployFix Backend
       │
       ▼
GitHub API / Git Access
       │
       ▼
Repository Information
       │
       ▼
Repository Ingestion
```

---

# 12. Method A — GitHub REST API

The GitHub API can be used for targeted repository inspection.

Conceptually:

```text
DeployFix Backend
       │
       ▼
Get Repository
       │
       ▼
Repository Metadata
```

Possible metadata includes:

- Repository name
- Owner
- Default branch
- Visibility
- Description
- Repository URL
- Language information
- Last update information

DeployFix can then inspect repository contents.

Conceptually:

```text
Repository
│
├── frontend/
├── backend/
├── database/
├── docker/
├── nginx/
├── .github/
├── package.json
└── README.md
```

The API approach is useful when DeployFix only needs particular files or needs incremental retrieval.

---

# 13. Method B — Repository Snapshot

For an initial repository analysis, a repository archive/snapshot is a strong approach.

Flow:

```text
DeployFix Backend
       │
       ▼
GitHub Repository Snapshot
       │
       ▼
Temporary Analysis Workspace
       │
       ▼
Repository Scanner
       │
       ▼
Project Context
```

Conceptually:

```text
1. Get repository
2. Determine default branch/ref
3. Retrieve repository snapshot
4. Extract to temporary workspace
5. Classify files
6. Analyze relevant files
7. Build structured Project Context
8. Delete temporary workspace
```

This is useful because the analyzer can inspect a complete repository snapshot without making a separate request for every file.

---

# 14. Method C — Authenticated Git Access / Clone

Another option is authenticated Git access:

```text
DeployFix Backend
       │
       ▼
Authenticated Git Access
       │
       ▼
Temporary Clone
       │
       ▼
Repository Analyzer
```

This provides a normal filesystem-like repository workspace:

```text
/tmp/deployfix/project/
```

The analyzer can then inspect:

```text
.git/
package.json
Dockerfile
compose.yaml
nginx.conf
.env.example
.github/workflows/
prisma/
src/
frontend/
backend/
```

However, repository code must never be blindly executed simply because it has been downloaded.

The analysis environment should be isolated and should treat repository contents as untrusted input.

---

# 15. Recommended Initial Retrieval Strategy

Use a combination rather than forcing one mechanism to handle every situation.

## Initial scan

Prefer:

```text
GitHub App
    ↓
Repository selection
    ↓
Repository metadata
    ↓
Repository snapshot / safe Git access
    ↓
Initial analysis
```

## Targeted/incremental scan

Use:

```text
GitHub API
    ↓
Retrieve relevant changed files
    ↓
Incremental analysis
```

This reduces unnecessary repository processing.

---

# 16. Method D — GitHub Webhooks

Webhooks allow DeployFix Lab to learn that a connected repository has changed.

Example:

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    │ webhook event
    ▼
DeployFix Backend
    │
    ▼
Repository synchronization
    │
    ▼
Re-analysis
```

Conceptually:

```text
GitHub Push
     │
     ▼
DeployFix webhook endpoint
     │
     ▼
Determine changed commit/files
     │
     ▼
Retrieve relevant information
     │
     ▼
Update Project Context
     │
     ▼
Run analysis
     │
     ▼
Update Flares
```

This allows DeployFix to evolve from a one-time repository scanner into a continuously updated project-context system.

---

# 17. Example Webhook Scenario

Suppose a developer changes:

```text
backend/src/config/database.ts
docker/compose.yaml
backend/.env.example
```

and pushes the commit.

GitHub sends a push event.

DeployFix determines:

```text
Changed:
backend/src/config/database.ts
docker/compose.yaml
backend/.env.example
```

DeployFix can then:

```text
Changed files
      │
      ▼
Relevant configuration analysis
      │
      ▼
Database / Docker / Environment checks
      │
      ▼
Potential issue
      │
      ▼
Flare
```

Example Flare:

```text
🔴 Database Connection Configuration

Severity: High

The backend database configuration does not appear
to match the database service configuration.

Affected:
backend/src/config/database.ts
docker/compose.yaml

[View Issue]
[Explain]
[Suggested Fix]
```

The exact diagnosis must be based on actual repository evidence; DeployFix should not invent a problem merely because files exist.

---

# 18. What Information Can DeployFix Obtain?

## Repository metadata

```text
Owner
Repository name
Repository URL
Visibility
Default branch
Branches
Last relevant commit
```

## Project structure

```text
frontend/
backend/
database/
docker/
nginx/
tests/
.github/
```

## Application configuration

```text
package.json
tsconfig.json
vite.config.*
eslint configuration
.env.example
```

## Deployment configuration

```text
Dockerfile
compose.yaml
docker-compose.yml
nginx.conf
.github/workflows/*.yml
```

## Database-related configuration

```text
prisma/schema.prisma
migrations/
DATABASE_URL references
database configuration files
```

## CI/CD configuration

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
```

## Documentation

```text
README.md
docs/
CONTRIBUTING.md
```

---

# 19. Repository Ingestion Pipeline

The repository should not simply be dumped into the database.

Use an ingestion pipeline:

```text
GitHub
  │
  ▼
Repository Retrieval
  │
  ▼
Temporary Workspace
  │
  ▼
File Classification
  │
  ▼
Security / Sensitive-File Filtering
  │
  ▼
Relevant File Parsing
  │
  ▼
Technology / Configuration Detection
  │
  ▼
Structured Project Context
  │
  ▼
Analysis Engine
```

This gives DeployFix a controlled, explainable pipeline.

---

# 20. Sensitive File and Secret Handling

Repositories must be treated as untrusted input.

Potentially sensitive content can include:

```text
.env
private keys
certificates
credentials
API tokens
service credentials
production secrets
```

DeployFix should not simply copy such content into its database.

The ingestion system should include:

```text
Repository
   │
   ▼
File Classification
   │
   ├── Safe to analyze
   │
   └── Sensitive / restricted
          │
          ▼
     Filter / redact / avoid persistence
```

Examples of generally useful analysis targets include:

```text
package.json
README.md
Dockerfile
compose.yaml
tsconfig.json
prisma/schema.prisma
.github/workflows/*.yml
source code
```

The exact sensitive-file policy should be implemented explicitly and validated before production use.

---

# 21. Do Not Execute Repository Code During Basic Ingestion

A critical security rule:

> Downloading a repository does not mean its scripts are safe to execute.

Do not automatically run:

```text
npm install
npm run build
npm test
npm run scripts
Docker build
Docker run
shell scripts
```

against arbitrary repository contents during the initial ingestion phase.

Static inspection should come first.

If dynamic execution is introduced later, it must happen inside a deliberately isolated/sandboxed execution environment with strict resource, network, filesystem, and credential controls.

---

# 22. Project Context

The key output of repository ingestion should be a structured Project Context.

Example:

```json
{
  "language": ["TypeScript", "JavaScript"],
  "frontend": "React",
  "backend": "Node.js + Express",
  "database": "PostgreSQL",
  "orm": "Prisma",
  "buildTool": "Vite",
  "containerization": true,
  "dockerCompose": true,
  "nginx": true,
  "githubActions": true
}
```

This is illustrative only. Real values must be derived from repository evidence.

The Project Context becomes the shared input for downstream DeployFix intelligence.

---

# 23. Suggested Project Context Data Model

The database should store structured metadata and analysis results rather than blindly storing the entire repository.

Possible conceptual tables:

```text
github_connections
────────────────────────────
id
user_id
github_installation_id
github_account
created_at
```

```text
repositories
────────────────────────────
id
connection_id
github_repo_id
owner
name
default_branch
visibility
url
last_synced_at
```

```text
repository_scans
────────────────────────────
id
repository_id
commit_sha
branch
status
started_at
completed_at
```

```text
project_context
────────────────────────────
repository_id
framework
language
database
package_manager
deployment_type
docker_detected
ci_detected
nginx_detected
prisma_detected
```

```text
diagnostics
────────────────────────────
id
repository_id
category
severity
file
line
message
root_cause
recommendation
```

These are conceptual structures. Final schema design should be defined in the database architecture/implementation phase.

---

# 24. Do Not Store the Entire Repository Permanently in PostgreSQL

DeployFix should not make Supabase PostgreSQL a repository-storage system.

Prefer:

```text
GitHub
  │
  ▼
Temporary Analysis Workspace
  │
  ▼
Parser / Analyzer
  │
  ▼
Structured Project Context
  │
  ▼
Supabase PostgreSQL
```

Supabase PostgreSQL should store information such as:

- GitHub connection metadata
- Repository metadata
- Scan status
- Commit references
- Project Context
- Diagnostics
- Flares
- Analysis results

The actual repository remains the source of truth in GitHub.

---

# 25. Database Architecture Relationship

The DeployFix Lab database architecture is:

```text
Database Engine:
PostgreSQL

Cloud Provider:
Supabase PostgreSQL

ORM:
Prisma

Schema:
Prisma schema

Migrations:
Prisma Migrate

Developer GUI:
Prisma Studio

Cloud Database GUI:
Supabase Dashboard / Supabase Studio
```

The GitHub integration should therefore persist structured integration and analysis information through:

```text
DeployFix Backend
       │
       ▼
Prisma
       │
       ▼
Supabase PostgreSQL
```

---

# 26. How GitHub Information Feeds the Flares Engine

The intelligence flow is:

```text
GitHub Repository
       │
       ▼
Repository Ingestion
       │
       ▼
Project Context
       │
       ▼
Analysis Engine
       │
       ▼
Detected Evidence
       │
       ▼
Flares Engine
       │
       ▼
DeployFix Dashboard
```

For example:

```text
Repository:
frontend/
backend/
docker/
nginx/

Detected:
React
Node.js
Docker
Nginx

Observed:
Nginx routing configuration
Docker service configuration
Backend port configuration

Analysis:
Configuration mismatch

Result:
Flare
```

A Flare should always be evidence-backed.

---

# 27. Suggested Builder / Suggested Project Relationship

The same Project Context can eventually support:

```text
Project Context
      │
      ├── Flares
      │
      ├── Suggested Builders
      │
      └── Suggested Projects
```

For example, if the repository context indicates:

```text
React
Node.js
PostgreSQL
Docker
GitHub Actions
```

DeployFix can later use that context to generate relevant recommendations.

The GitHub integration should therefore be designed as a reusable **Project Context source**, not as a feature built only for the Flares screen.

---

# 28. Alternative Integration #1 — Public GitHub Repository URL

Provide a fallback:

```text
[ Analyze Public GitHub Repository ]
```

The user enters:

```text
https://github.com/user/project
```

Flow:

```text
URL
 │
 ▼
DeployFix
 │
 ▼
Public GitHub Repository
 │
 ▼
Repository Analysis
```

Advantages:

- Very simple
- No GitHub authorization for public repository inspection where supported
- Excellent for demos
- Excellent for students
- Easy onboarding

Limitation:

- Private repositories require authenticated access.

This should be a fallback, not the primary private-repository integration.

---

# 29. Alternative Integration #2 — ZIP Upload

Provide:

```text
[ Upload Project ZIP ]
```

Flow:

```text
ZIP Upload
    │
    ▼
Security / Validation
    │
    ▼
Extract to Temporary Workspace
    │
    ▼
File Classification
    │
    ▼
Project Analysis
    │
    ▼
Project Context
```

Useful for:

- Private projects
- Users who do not want GitHub authorization
- Local projects
- Students
- Demonstrations

This method does not provide automatic repository synchronization.

---

# 30. Alternative Integration #3 — GitHub OAuth App

An OAuth-based integration is possible:

```text
GitHub OAuth
     │
     ▼
User Authorization
     │
     ▼
DeployFix
     │
     ▼
GitHub API
```

Advantages:

- Familiar authorization experience
- Can be simpler for some user-centric flows
- Suitable for certain prototypes

Disadvantages:

- Less repository-centric than the preferred GitHub App architecture
- Integration permissions and lifecycle need careful design
- Less aligned with the long-term repository integration model

Recommendation:

> Keep OAuth as an alternative design, not the primary architecture.

---

# 31. Alternative Integration #4 — Fine-Grained Personal Access Token

A prototype could ask the user to provide a GitHub token.

Conceptually:

```text
User
 │
 │ GitHub PAT
 ▼
DeployFix
 │
 ▼
GitHub API
```

Advantages:

- Easy to prototype
- Useful for internal development/testing

Disadvantages:

- Poor SaaS user experience
- Credential-handling responsibility
- User must manually create/configure the token
- More operational/security complexity

Recommendation:

> Development/testing option only; not the preferred production onboarding method.

---

# 32. Alternative Integration #5 — GitHub Actions

A later integration can use GitHub Actions:

```text
Developer Push
      │
      ▼
GitHub Actions
      │
      ├── Build
      ├── Lint
      ├── Test
      └── Project checks
      │
      ▼
DeployFix API
      │
      ▼
Diagnostics / Analysis
```

This can provide information such as:

- Build result
- Test result
- Lint result
- Dependency information
- CI metadata

This is complementary to the GitHub repository connection, not a replacement for it.

---

# 33. Recommended Combination of Methods

Do not force one mechanism to handle every scenario.

Recommended:

## Primary

**GitHub App**

For authenticated repository connection and selected private repositories.

## Fallback

**Public GitHub Repository URL**

For easy analysis of public repositories.

## Fallback

**ZIP Upload**

For users who do not want to connect GitHub.

## Future enhancement

**GitHub Webhooks**

For synchronization when repositories change.

## Future enhancement

**GitHub Actions integration**

For CI/build/test intelligence.

---

# 34. Recommended Phased Implementation

## Phase 1 — Basic GitHub Connection

```text
GitHub App
    ↓
Install
    ↓
Repository selection
    ↓
Save connection
```

Goal:

> Securely connect a user's GitHub repository to DeployFix Lab.

---

## Phase 2 — Initial Repository Ingestion

```text
Repository
    ↓
Metadata
    ↓
Files / Snapshot
    ↓
Configuration detection
    ↓
Project Context
```

Goal:

> Build the first reliable Project Context.

---

## Phase 3 — Repository Synchronization

```text
GitHub Push
    ↓
Webhook
    ↓
DeployFix
    ↓
Incremental synchronization
    ↓
Re-analysis
```

Goal:

> Keep Project Context current.

---

## Phase 4 — CI Intelligence

```text
GitHub Actions
    ↓
Build / Test / Lint
    ↓
DeployFix
    ↓
Analysis
```

Goal:

> Understand not only repository structure but also CI behavior.

---

## Phase 5 — Deployment Intelligence

Eventually:

```text
GitHub
   │
   ├── Repository
   ├── Commits
   ├── Pull Requests
   └── CI
        │
        ▼
DeployFix
        │
        ├── Deployment Platform
        ├── Website URL
        └── Runtime / Deployment Information
```

Goal:

> Correlate source configuration, CI, deployment state, and externally observable behavior.

---

# 35. Final Recommended Architecture

```text
                         DEPLOYFIX LAB
                              │
                        Web Browser
                              │
                              ▼
                     React Frontend
                              │
                              ▼
                    Node/Express API
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   GitHub App            Website URL           ZIP Upload
        │                     │                     │
        ▼                     ▼                     ▼
   GitHub API              Safe HTTP          Temporary File
        │                     │                     │
        ▼                     │                     │
 Repository Snapshot          │                     │
 / Safe Git Access            │                     │
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                     Project Ingestion
                              │
                              ▼
                  Security / File Filtering
                              │
                              ▼
                  Project Context Engine
                              │
                              ▼
                    Analysis / Rules Engine
                              │
                              ▼
                         Flares Engine
                              │
                              ▼
                     DeployFix Dashboard
```

Database relationship:

```text
Project Context / Integration Metadata
                 │
                 ▼
              Prisma
                 │
                 ▼
      Supabase PostgreSQL
```

Continuous update relationship:

```text
GitHub Push
     │
     ▼
Webhook
     │
     ▼
DeployFix Backend
     │
     ▼
Incremental Sync
     │
     ▼
Project Context Update
     │
     ▼
Re-analysis
     │
     ▼
Updated Flares
```

---

# 36. Core Architectural Principle

The most important principle is:

> **DeployFix Lab is the website. GitHub is an external integration and the primary repository/project-context source.**

The user does not install DeployFix Lab.

The browser does not directly hold privileged GitHub credentials.

The DeployFix backend securely communicates with GitHub.

The repository remains hosted on GitHub.

DeployFix retrieves and analyzes relevant repository information.

DeployFix transforms that information into structured Project Context.

Project Context becomes the reusable input for:

- Flares
- Suggested Builders
- Suggested Projects
- Project analytics
- Future deployment diagnostics
- Future CI/CD intelligence

---

# 37. Final Decision

For the current DeployFix Lab website/SaaS architecture, the recommended direction is:

```text
Primary Repository Source
        ↓
GitHub

Primary Integration
        ↓
GitHub App

Backend Communication
        ↓
GitHub API / Safe Git Access

Initial Analysis
        ↓
Repository Snapshot / Temporary Workspace

Continuous Synchronization
        ↓
GitHub Webhooks

Future CI Intelligence
        ↓
GitHub Actions

Alternative Sources
        ↓
Public GitHub URL
ZIP Upload

Structured Output
        ↓
Project Context

Persistence
        ↓
Prisma → Supabase PostgreSQL

Downstream Intelligence
        ↓
Analysis Engine
        ↓
Flares
        ↓
Suggested Builders / Suggested Projects
```

This architecture keeps DeployFix Lab **website-only**, avoids unnecessary desktop/mobile software, supports private and public repositories, provides fallback connection methods, and leaves room for future CI/CD and deployment integrations without forcing a redesign of the core Project Context architecture.

---

# 38. Important Implementation Constraints

1. Do not create a desktop application.
2. Do not create a mobile application.
3. Do not require users to install a DeployFix agent.
4. Do not expose privileged GitHub credentials in the frontend.
5. Do not request broad GitHub permissions unnecessarily.
6. Prefer selected-repository access.
7. Treat repository contents as untrusted input.
8. Do not automatically execute arbitrary repository code during basic ingestion.
9. Do not store the entire repository permanently in PostgreSQL.
10. Keep GitHub as the source of truth for repository source.
11. Store structured project metadata and analysis results in DeployFix's database.
12. Keep the GitHub integration reusable as a general Project Context source.
13. Keep Website URL and ZIP Upload as alternative project-context methods.
14. Add webhooks only after the basic connection and ingestion flow is stable.
15. Add GitHub Actions intelligence as a later enhancement.
16. Keep the architecture compatible with future deployment-platform integration.

---

# 39. Engineering Outcome

When this architecture is implemented correctly, a user should be able to:

```text
Open DeployFix Lab
       ↓
Connect GitHub
       ↓
Authorize selected repository
       ↓
Select project
       ↓
DeployFix scans repository
       ↓
DeployFix understands project structure
       ↓
DeployFix creates Project Context
       ↓
DeployFix analyzes evidence
       ↓
DeployFix generates Flares
       ↓
User sees actionable diagnostics
```

The long-term objective is for DeployFix Lab to move from:

> **"Give me your project and I will inspect it."**

toward:

> **"Connect your project once, and DeployFix continuously understands its source, configuration, CI/CD, deployment state, and observable behavior so it can diagnose problems with evidence."**

That evolution should happen incrementally and should not be implemented as a single large feature.
