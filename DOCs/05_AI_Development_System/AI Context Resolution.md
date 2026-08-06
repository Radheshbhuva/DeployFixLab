# AI Context Resolution

**Document ID:** AI-STD-002

**Version:** 1.0.0

---

# 1. Purpose

This document defines how AI gathers and resolves project context before generating any implementation or documentation.

---

# 2. Context Priority

Priority 1
- Current Sprint

Priority 2
- PRD

Priority 3
- SRS

Priority 4
- Architecture

Priority 5
- Engineering Standards

Priority 6
- Work History

Priority 7
- Previous AI Responses

---

# 3. Context Resolution Workflow

Identify Request

↓

Locate Related Documents

↓

Read Requirements

↓

Read Architecture

↓

Read Work History

↓

Resolve Conflicts

↓

Generate Solution

---

# 4. Required Context

Before implementation, AI must understand:

- Project goals
- Current phase
- Sprint
- Feature requirements
- Related APIs
- Database schema
- Existing code conventions

---

# 5. Conflict Resolution

When conflicts occur:

1. Latest Approved Document
2. Architecture Decision Record
3. PRD
4. SRS
5. Engineering Standards

---

# 6. Missing Context

If information is unavailable:

- Ask for clarification
- Never assume critical architecture
- Document assumptions

---

# 7. Validation

AI should confirm:

- Correct project
- Correct sprint
- Correct module
- Latest documentation
- Relevant Requirement IDs

---

# 8. Output Format

Every AI response should include:

- Context Used
- Assumptions
- Dependencies
- Proposed Solution