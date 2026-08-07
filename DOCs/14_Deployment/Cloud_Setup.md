# 02 — Cloud Host Provisioning & Security Setup

---

## Document Metadata

| Field               | Value                                                             |
|---------------------|-------------------------------------------------------------------|
| **Document Name**   | Cloud Host Provisioning & Security Setup                          |
| **Document ID**     | DFIX-DEP-002                                                      |
| **Version**         | 1.0.0                                                             |
| **Status**          | Approved                                                          |
| **Owner**           | Cloud Architect                                                   |
| **Reviewer**        | DevOps Lead                                                       |
| **Classification**  | Internal — Confidential                                           |
| **Created Date**    | 2026-08-02                                                        |
| **Last Updated**    | 2026-08-07                                                        |
| **Project**         | DeployFix Lab                                                     |
| **Project Code**    | DFIX                                                              |

---

# 1. Cloud Host Provisioning & Firewall Rules

1. **Host Specifications:** Minimum 1 vCPU, 2.0 GB RAM, 20 GB SSD (Ubuntu 22.04 LTS).
2. **UFW Firewall Rules:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. **SSL / Certbot Setup:** Generate free Let's Encrypt TLS certificates:
   ```bash
   sudo certbot --nginx -d deployfix.lab.com
   ```
