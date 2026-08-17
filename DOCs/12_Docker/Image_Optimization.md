# 06 — Docker Image Optimization Guide

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Docker Image Optimization Guide                                   |
| **Document ID**     | DFIX-DOC-006                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | DevOps Lead                                                       |
| **Reviewer**        | Full Engineering Team                                             |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Image Size Reduction & Layer Caching Techniques

| Optimization Rule | Action | Impact |
|---|---|---|
| **Alpine Base Images** | Use `node:20-alpine` instead of full Debian `node:20`. | Image size drops from 1.1GB to ~110MB. |
| **Prune Dev Dependencies** | Execute `npm prune --production` in builder stage. | Excludes TypeScript compiler & test runners from runner stage. |
| **Layer Ordering** | Copy `package.json` and run `npm ci` before copying source code. | Maximizes Docker build cache hits when source code changes. |
| **`.dockerignore` Rules** | Exclude `node_modules`, `.git`, `.env`, build artifacts (`dist`). | Prevents context upload overhead during `docker build`. |
