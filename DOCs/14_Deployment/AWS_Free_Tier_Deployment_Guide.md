# DeployFix Lab — AWS Free Tier Deployment Guide & Runbook

**Document ID:** DFIX-DEP-004  
**Target Platform:** Amazon Web Services (AWS) 12-Month Free Tier  
**Estimated Cost:** **$0.00 / month** (Guaranteed within Free Tier limits)  
**Status:** Approved & Production-Ready  

---

## 📑 Table of Contents

1. [Architecture & Free Tier Limits](#1-architecture--free-tier-limits)
2. [Cost Protection: Zero-Spend Budget Alert](#2-cost-protection-zero-spend-budget-alert)
3. [Method 1: 1-Click Cloud-Init Automated Launch (Recommended)](#3-method-1-1-click-cloud-init-automated-launch-recommended)
4. [Method 2: AWS CloudFormation Infrastructure-as-Code](#4-method-2-aws-cloudformation-infrastructure-as-code)
5. [Method 3: Hands-On SSH Terminal Deployment](#5-method-3-hands-on-ssh-terminal-deployment)
6. [Free SSL / TLS Configuration with Let's Encrypt](#6-free-ssl--tls-configuration-with-lets-encrypt)
7. [Operational Verification & Pre-Seeded Accounts](#7-operational-verification--pre-seeded-accounts)
8. [Performance Optimization & Low-RAM Tuning](#8-performance-optimization--low-ram-tuning)

---

## 1. Architecture & Free Tier Limits

DeployFix Lab runs as an all-in-one containerized stack on an **AWS EC2 `t2.micro` or `t3.micro`** instance.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AWS EC2 Free Tier Host Instance                       │
│                        (t2.micro / t3.micro — 1 vCPU, 1 GB RAM)                 │
│                      + 4GB Linux Swapfile on 30GB gp3 EBS Root Disk             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 Port 80 (HTTP)                  Port 443 (HTTPS)
                         │                               │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │    Frontend NGINX Reverse Proxy       │
                     │    (SPA Static Assets + API Gateway)  │
                     └───────────────────┬───────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
     Static Assets & SPA        /api/v1 REST Calls          /logs/stream WebSockets
     (React 18 Dashboard)       (Express API Engine)        (Chaos Terminal Stream)
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                 PostgreSQL 16 Alpine             Redis 7 Alpine
                 (Persistent pgdata volume)       (Live Telemetry Store)
```

### AWS 12-Month Free Tier Budget Allocations

| AWS Resource | Free Tier Monthly Allowance | DeployFix Lab Usage | Cost |
|---|---|---|---|
| **EC2 Compute** | 750 hours/month of `t2.micro` or `t3.micro` | 1 instance running 24/7 (744 hrs) | **$0.00** |
| **EBS Storage** | 30 GB/month of gp2 / gp3 General Purpose SSD | 30 GB gp3 root disk (OS + Docker + DB) | **$0.00** |
| **Public IPv4** | 750 hours/month included in EC2 Free Tier | 1 auto-assigned Public IPv4 | **$0.00** |
| **Data Transfer Out** | 100 GB/month to internet | ~5–10 GB/month | **$0.00** |

> [!IMPORTANT]
> **Why 4GB Swap is Critical**: `t2.micro` and `t3.micro` provide 1 GB of physical RAM. Running Node.js, Prisma ORM, PostgreSQL, Redis, and NGINX simultaneously will trigger the Linux Out-Of-Memory (OOM) killer without swap. Our automated bootstrap scripts allocate a **4 GB swapfile** directly on the 30 GB gp3 EBS root volume, ensuring seamless builds and rock-solid 24/7 uptime.

---

## 2. Cost Protection: Zero-Spend Budget Alert

Before launching any resources, set up a zero-dollar budget alert so AWS emails you if any unexpected cost ever exceeds $0.01:

1. Open the [AWS Billing & Cost Management Console](https://console.aws.amazon.com/billing/).
2. In the left navigation, click **Budgets** -> **Create budget**.
3. Choose **Zero spend budget** template.
4. Name the budget: `deployfix-zero-spend-alert`.
5. Enter your email address for threshold notifications.
6. Click **Create budget**.

---

## 3. Method 1: 1-Click Cloud-Init Automated Launch (Recommended)

This method automates the entire provisioning process: OS setup, swap creation, Docker installation, git clone, container build, database migration, and account seeding.

### Step-by-Step Instructions:

1. **Log in to the AWS Management Console**:
   - Go to [EC2 Console](https://console.aws.amazon.com/ec2/).
   - Choose your closest region (e.g., `us-east-1` N. Virginia, `eu-west-1` Ireland, `ap-south-1` Mumbai).

2. **Click "Launch Instance"**:
   - **Name:** `DeployFix-Lab-Server`
   - **Application and OS Images (AMI):** Select **Ubuntu**, then choose **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (marked *(Free tier eligible)*).
   - **Architecture:** `64-bit (x86)`.

3. **Instance Type**:
   - Select **`t2.micro`** (or **`t3.micro`** depending on region availability; ensure it has the *(Free tier eligible)* badge).

4. **Key Pair (Login)**:
   - Select an existing key pair or click **Create new key pair**.
   - Key pair type: `RSA`, Private key format: `.pem`.
   - Download and save the `.pem` file safely.

5. **Network Settings**:
   - Click **Edit** (top right of Network Settings):
   - **Auto-assign public IP:** `Enable`
   - **Firewall (Security Groups):** Select **Create security group**.
   - Check the following inbound rules:
     - [x] **Allow SSH traffic from:** `Anywhere (0.0.0.0/0)` (or `My IP` for enhanced security)
     - [x] **Allow HTTP traffic from the internet** (Port 80)
     - [x] **Allow HTTPS traffic from the internet** (Port 443)

6. **Configure Storage**:
   - Change the root volume size from `8` GiB to **`30` GiB** (Volume Type: `gp3`).
   - *30 GiB is 100% free under the AWS Free Tier.*

7. **Advanced Details -> User Data**:
   - Scroll down to the **Advanced details** section.
   - Scroll to the bottom to the **User data - optional** text box.
   - Paste the entire content of [`deployment/aws/ec2-user-data.sh`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/deployment/aws/ec2-user-data.sh):

```bash
#!/bin/bash
set -euo pipefail

# 1. Configure 4GB Swap Space (Essential for t2.micro/t3.micro 1GB RAM)
fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
sysctl vm.swappiness=20
echo 'vm.swappiness=20' >> /etc/sysctl.conf

# 2. Update and Install Prerequisites
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg lsb-release git ufw

# 3. Install Docker Engine and Compose Plugin
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable docker
systemctl start docker

# 4. Configure UFW Firewall
ufw --force reset || true
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 5. Clone and Launch DeployFix Lab
APP_DIR="/opt/deployfixlab"
git clone https://github.com/Radheshbhuva/DeployFixLab.git "$APP_DIR"
cd "$APP_DIR"

cp .env.example .env
JWT_SEC=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 48)
JWT_REF_SEC=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 48)
sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SEC}|g" .env
sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=${JWT_REF_SEC}|g" .env
sed -i "s|NODE_ENV=.*|NODE_ENV=production|g" .env
sed -i "s|VITE_ENVIRONMENT=.*|VITE_ENVIRONMENT=production|g" .env

# 6. Launch Containers
docker compose up -d --build

# 7. Database Migration & Seed
sleep 15
docker compose exec -T backend npx prisma migrate deploy || true
docker compose exec -T backend npx prisma db seed || true
```

8. **Click "Launch Instance"**:
   - Wait 2–3 minutes for the instance to initialize and run the bootstrap script.
   - Go to **EC2 Instances**, select `DeployFix-Lab-Server`, and copy the **Public IPv4 address**.
   - Open your browser and navigate to: `http://<YOUR_EC2_PUBLIC_IP>`

---

## 4. Method 2: AWS CloudFormation Infrastructure-as-Code

If you prefer Infrastructure-as-Code:

1. Open the [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/).
2. Click **Create stack** -> **With new resources (standard)**.
3. Select **Upload a template file** and upload [`deployment/aws/deployfix-cloudformation.yaml`](file:///c:/House_of_Growth/DeployFix_Lab-Trial/deployment/aws/deployfix-cloudformation.yaml).
4. Enter Stack Name: `deployfix-lab-stack`.
5. Select your existing EC2 `KeyName`.
6. Click **Next** -> **Next** -> **Submit**.
7. Once status reaches `CREATE_COMPLETE`, view the **Outputs** tab for your live `ApplicationURL`.

---

## 5. Method 3: Hands-On SSH Terminal Deployment

If you want to manually configure and observe the deployment step-by-step:

### 1. Connect via SSH:
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### 2. Configure 4GB Swap Space:
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=20
```

### 3. Install Docker & Docker Compose:
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu
```

*(Log out and log back in for docker group permissions to take effect)*

### 4. Clone DeployFix Lab & Configure Environment:
```bash
git clone https://github.com/Radheshbhuva/DeployFixLab.git
cd DeployFixLab
cp .env.example .env
nano .env
```

### 5. Launch Application:
```bash
docker compose up -d --build
```

### 6. Run Prisma Migrations and Seed:
```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

---

## 6. Free SSL / TLS Configuration with Let's Encrypt

If you have a domain pointing to your EC2 Public IP (e.g., `lab.yourdomain.com` or a free DNS provider like DuckDNS / FreeDNS):

1. Connect to your EC2 instance via SSH.
2. Install Certbot:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   ```
3. Generate the certificate (standalone mode):
   ```bash
   # Temporarily pause the container on port 80
   docker compose stop frontend

   # Request certificate
   sudo certbot certonly --standalone -d lab.yourdomain.com

   # Restart frontend
   docker compose start frontend
   ```
4. Mount the generated certificates into `docker-compose.yml` or use Certbot's automated renewal hook.

---

## 7. Operational Verification & Pre-Seeded Accounts

### Health Verification Probes:
```bash
# Verify backend API liveness
curl -I http://<YOUR_EC2_PUBLIC_IP>/health

# Verify frontend bundle
curl -I http://<YOUR_EC2_PUBLIC_IP>/
```

### Pre-Seeded Credentials for Testing:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Platform Commander** | `admin@deployfix.lab` | `Password123!` | Full Admin & Chaos Control |
| **Lead Instructor** | `instructor@deployfix.lab` | `Password123!` | Scenario Management & Chaos Control |
| **Student Engineer** | `student@deployfix.lab` | `Password123!` | Incident Troubleshooting & Recovery |

---

## 8. Performance Optimization & Low-RAM Tuning

To inspect real-time resource utilization on the `t2.micro` / `t3.micro` instance:

```bash
# View RAM and Swap utilization
free -h

# View container CPU and Memory usage
docker stats --no-stream

# View live container logs
docker compose logs -f backend
```

DeployFix Lab will utilize approximately **550–650 MB of physical RAM**, with remaining processes gracefully backed by the fast 4GB NVMe swapfile, keeping your instance responsive, stable, and completely free.

