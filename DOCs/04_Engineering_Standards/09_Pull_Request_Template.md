# 09 — Pull Request Template Standard

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Pull Request Template Standard                                    |
| **Document ID**     | DFIX-ENG-009                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Lead DevOps Engineer                                              |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-06                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Purpose & Standardization

This template standard defines the mandatory structure for all Pull Requests (PRs) opened in the **DeployFix Lab** repository. Adopting a standardized PR format ensures clear context for reviewers, fast review cycles, and reliable auditability.

---

# 2. Standard Pull Request Template Body

```markdown
## Description
Brief summary of the changes introduced by this PR.

## Related Requirement / Issue
- Requirement ID: `FR-XXX` / `NFR-XXX`
- GitHub Issue: #`[Issue Number]`

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] ⚡ Performance optimization
- [ ] 🐳 Docker / Infrastructure update

## Proposed Changes
- Change 1
- Change 2
- Change 3

## Verification & Testing
Describe the tests executed to verify changes:
- [ ] Unit Tests Passed (`npm test`)
- [ ] E2E / Integration Probes Verified
- [ ] Manual Smoke Test Performed in Docker Compose

## Checklist
- [ ] My code follows the project's Coding & Naming Standards.
- [ ] I have performed a self-review of my own code.
- [ ] I have updated relevant documentation (`DOCs/`).
- [ ] I have verified zero secrets or credentials are included in this PR.
- [ ] Target branch is set to `main` or designated release branch.
```
