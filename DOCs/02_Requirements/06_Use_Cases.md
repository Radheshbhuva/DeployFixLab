# 06_Use_Cases.md

# DeployFix Lab — Use Cases

**Document ID:** UC-001
**Version:** 1.0.0
**Status:** Draft

# Chapter 15 — Use Cases

## 15.1 Purpose

This document defines the primary use cases for DeployFix Lab. Each use case describes how an actor interacts with the system to accomplish a goal.

## Use Case Template

- Use Case ID
- Title
- Primary Actor
- Supporting Actors
- Preconditions
- Trigger
- Main Flow
- Alternate Flow
- Exception Flow
- Postconditions
- Related Functional Requirements

---

# UC-001 User Registration

Primary Actor: Guest

Preconditions:
- User is not authenticated.

Main Flow:
1. Open registration page.
2. Enter required details.
3. Submit form.
4. System validates data.
5. Account created successfully.

Postconditions:
- User account exists.

Related Requirements:
- FR-001
- FR-002

---

# UC-002 User Login

Primary Actor: Registered User

Main Flow:
1. Enter credentials.
2. Validate credentials.
3. Generate JWT.
4. Redirect to dashboard.

Related Requirements:
- FR-003
- FR-004

---

# UC-003 Create Task

Primary Actor: Authenticated User

Main Flow:
1. Open task page.
2. Click create.
3. Enter task details.
4. Save task.

Related Requirements:
- Task Management FRs

---

# UC-004 Edit Task

Primary Actor: Authenticated User

Main Flow:
1. Select task.
2. Update information.
3. Save changes.

---

# UC-005 Delete Task

Primary Actor: Authenticated User

Main Flow:
1. Select task.
2. Confirm deletion.
3. Remove task.

---

# UC-006 View Dashboard

Primary Actor: Authenticated User

Main Flow:
1. Login.
2. Open dashboard.
3. View metrics.
4. Review deployment status.

---

# UC-007 View Deployment Status

Primary Actor: DevOps Engineer

Main Flow:
1. Open deployment page.
2. Review deployment history.
3. Inspect latest deployment.

---

# UC-008 Monitor Application

Primary Actor: DevOps Engineer

Main Flow:
1. Open monitoring dashboard.
2. View health.
3. View metrics.
4. Inspect logs.

---

# UC-009 Troubleshoot Deployment Failure

Primary Actor: Developer

Main Flow:
1. View deployment error.
2. Inspect logs.
3. Review root cause.
4. Apply recovery.
5. Verify deployment.

---

# UC-010 Generate Engineering Documentation

Primary Actor: Technical Lead

Main Flow:
1. Open documentation.
2. Update project documents.
3. Save revisions.

---

# Use Case Relationships

Authentication
 -> Dashboard
 -> Task Management
 -> Deployment
 -> Monitoring
 -> Troubleshooting

# Acceptance

Each use case is complete when:
- Preconditions satisfied
- Main flow implemented
- Alternate scenarios handled
- Related functional requirements satisfied
- Documentation updated
