#!/bin/bash
# ==============================================================================
# DeployFix Lab — AWS EC2 Free Tier Automated Bootstrap Script (Cloud-Init)
# Compatible with: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS (t2.micro / t3.micro)
# ==============================================================================

set -euo pipefail

echo "=================================================="
echo "🚀 Starting DeployFix Lab AWS EC2 Initialization..."
echo "=================================================="

# 1. Configure 4GB Swap Space (Essential for t2.micro/t3.micro 1GB RAM)
if [ ! -f /swapfile ]; then
    echo "📦 Creating 4GB swapfile to prevent OOM errors..."
    fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    # Optimize swappiness for low-memory container hosts
    sysctl vm.swappiness=20
    echo 'vm.swappiness=20' >> /etc/sysctl.conf
    echo "✔ Swap configured successfully."
fi

# 2. Update System Packages
echo "🔄 Updating apt packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg lsb-release git ufw

# 3. Install Docker Engine and Docker Compose v2
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Enable Docker to start on boot
    systemctl enable docker
    systemctl start docker

    # Add ubuntu user to docker group
    usermod -aG docker ubuntu || true
    echo "✔ Docker installed successfully."
fi

# 4. Configure Firewall (UFW)
echo "🛡️ Configuring UFW Firewall..."
ufw --force reset || true
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP (DeployFix Lab)'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
echo "✔ UFW Firewall enabled (Ports 22, 80, 443)."

# 5. Clone and Launch DeployFix Lab
APP_DIR="/opt/deployfixlab"
echo "📂 Setting up application directory at ${APP_DIR}..."

if [ ! -d "${APP_DIR}" ]; then
    git clone https://github.com/Radheshbhuva/DeployFixLab.git "${APP_DIR}"
else
    cd "${APP_DIR}"
    git pull origin main || true
fi

cd "${APP_DIR}"

# 6. Create Production .env file
if [ ! -f .env ]; then
    echo "⚙️ Creating production .env file..."
    cp .env.example .env

    # Generate secure random JWT secrets
    JWT_SEC=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 48)
    JWT_REF_SEC=$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 48)

    sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SEC}|g" .env
    sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=${JWT_REF_SEC}|g" .env
    sed -i "s|NODE_ENV=.*|NODE_ENV=production|g" .env
    sed -i "s|VITE_ENVIRONMENT=.*|VITE_ENVIRONMENT=production|g" .env
    sed -i "s|@localhost:5432|@postgres:5432|g" .env
fi
# Ensure database host is always postgres container in existing .env
sed -i "s|@localhost:5432|@postgres:5432|g" .env || true

# 7. Launch Containerized Multi-Service Stack
echo "🚀 Building and starting DeployFix Lab containers..."
docker compose up -d --build

# 8. Run Database Migrations and Seed RBAC Accounts
echo "🌱 Running database migrations and seed..."
sleep 15
docker compose exec -T backend npx prisma migrate deploy || true
docker compose exec -T backend npm run db:seed || true

echo "=================================================="
echo "✨ DeployFix Lab successfully deployed on AWS EC2!"
echo "🌐 Access via: http://$(curl -s http://checkip.amazonaws.com)"
echo "=================================================="

