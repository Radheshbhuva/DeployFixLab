# Requirement ID Standard

**Document Name:** Requirement ID Standard\
**Document ID:** ENG-STD-002\
**Version:** 1.0.0\
**Category:** Engineering Standards\
**Status:** Approved\
**Repository:** DeployFix Lab

------------------------------------------------------------------------

# 1. Purpose

Define a unified identification and traceability system for all
engineering artifacts in DeployFix Lab.

# 2. General Format

    <PREFIX>-<NUMBER>

Example:

-   FR-001
-   NFR-001
-   API-001
-   DB-001

# 3. Numbering Rules

-   IDs start at `001`
-   Always use three digits
-   IDs are sequential
-   Never reuse deleted IDs
-   One artifact = One ID

# 4. Prefix Standards

  Prefix   Description
  -------- ----------------------------
  BR       Business Requirement
  FR       Functional Requirement
  NFR      Non-Functional Requirement
  US       User Story
  UC       Use Case
  FEAT     Feature
  UI       User Interface
  BE       Backend Module
  API      API Endpoint
  DB       Database Object
  DOCKER   Docker Artifact
  DEP      Deployment
  CICD     CI/CD Pipeline
  SEC      Security
  MON      Monitoring
  LOG      Logging
  PERF     Performance
  ADR      Architecture Decision
  TEST     Test Case
  BUG      Bug
  TASK     Sprint Task
  DOC      Documentation

# 5. Traceability

Every requirement should be linked across implementation.

Example:

FR-001 → US-001 → API-001 → DB-001 → TEST-001 → BUG-001

# 6. Requirement Status

-   Draft
-   Approved
-   In Progress
-   Implemented
-   Verified
-   Deprecated
-   Rejected

# 7. Best Practices

-   Never modify an existing ID.
-   Never duplicate IDs.
-   Always maintain cross references.
-   Record IDs in documentation and code where appropriate.

# 8. Validation Checklist

-   Correct prefix
-   Unique number
-   Three-digit format
-   Traceability maintained
-   Status assigned

# 9. References

-   IEEE 29148
-   DeployFix Lab Documentation Template Standard
-   DeployFix Lab Engineering Documentation Standard
