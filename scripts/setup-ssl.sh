#!/bin/bash
# ==============================================================================
# DeployFix Lab — Automated Let's Encrypt SSL/TLS Certificate Setup
# Domain: deployfixlab.devlinktech.online
# ==============================================================================

set -euo pipefail

DOMAIN="deployfixlab.devlinktech.online"
APP_DIR="/opt/deployfixlab"

echo "=================================================="
echo "🔒 Setting up SSL/HTTPS for ${DOMAIN}..."
echo "=================================================="

# 1. Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    sudo apt-get update -y
    sudo apt-get install -y certbot
fi

# 2. Temporarily stop the frontend container so Certbot can bind port 80
echo "⏸️ Temporarily stopping frontend container to verify domain..."
cd "${APP_DIR}"
sudo docker compose stop frontend || true

# 3. Obtain SSL certificate via Standalone mode
echo "📜 Requesting SSL certificate from Let's Encrypt..."
sudo certbot certonly \
    --standalone \
    -d "${DOMAIN}" \
    --non-interactive \
    --agree-tos \
    --register-unsafely-without-email \
    --keep-until-expiring

# 4. Ensure permissions for Docker volume
sudo chmod -R 755 /etc/letsencrypt/archive /etc/letsencrypt/live || true

# 5. Switch NGINX to the SSL-enabled configuration
echo "⚙️ Activating SSL configuration in NGINX..."
cp "${APP_DIR}/Application/frontend/nginx.ssl.conf" "${APP_DIR}/Application/frontend/nginx.conf"

# 6. Rebuild and launch frontend with port 443 active
echo "🚀 Rebuilding and launching frontend on HTTPS (Port 443)..."
sudo docker compose up -d --build frontend

# 7. Setup automatic renewal hook
echo "🔄 Configuring automatic renewal hook..."
echo "0 3 * * * root certbot renew --pre-hook 'docker compose -f ${APP_DIR}/docker-compose.yml stop frontend' --post-hook 'docker compose -f ${APP_DIR}/docker-compose.yml start frontend' --quiet" | sudo tee /etc/cron.d/certbot-deployfixlab > /dev/null

echo "=================================================="
echo "✨ HTTPS is now ACTIVE for https://${DOMAIN}"
echo "=================================================="
