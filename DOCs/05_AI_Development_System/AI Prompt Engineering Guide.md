# AI Prompt Engineering Guide

**Document ID:** AI-STD-003

**Version:** 1.0.0

---

# 1. Purpose

Provide a standardized approach for writing prompts used during AI-assisted development.

---

# 2. Prompt Structure

Every prompt should contain:

1. Objective
2. Project
3. Current Phase
4. Current Sprint
5. Context
6. Requirements
7. Constraints
8. Expected Output
9. Acceptance Criteria

---

# 3. Standard Prompt Template

## Objective

Describe the task.

## Project Context

Project name

Current Phase

Current Sprint

Current Module

---

## Requirements

Functional requirements

Non-functional requirements

---

## Constraints

Technologies

Coding Standards

Architecture Standards

Security Standards

---

## Expected Deliverables

Code

Documentation

Tests

Updated Work History

---

## Definition of Done

Acceptance criteria.

---

# 4. Good Prompt Characteristics

- Clear
- Specific
- Context-rich
- References Requirement IDs
- One objective per prompt

---

# 5. Poor Prompt Examples

"Create login."

"Fix everything."

"Improve backend."

---

# 6. Good Prompt Examples

"Implement JWT authentication for Sprint 1.2 following BE-001, API-003, and Coding Standards using Express, Prisma, bcrypt, and Zod."

---

# 7. Best Practices

- One feature at a time.
- Provide architecture context.
- Reference documentation.
- Define expected outputs.
- Request incremental implementation.

---

# 8. Prompt Review Checklist

- Objective clear
- Context included
- Requirements referenced
- Constraints specified
- Deliverables defined
- Acceptance criteria included