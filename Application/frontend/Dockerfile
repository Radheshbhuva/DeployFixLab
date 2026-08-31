# Multi-stage Dockerfile for DeployFix Lab Frontend SPA
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production NGINX Static Server
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Vite/NGINX port
EXPOSE 80 5173

# Custom NGINX SPA fallback configuration
RUN echo 'server { \
    listen 5173; \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $$uri $$uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
