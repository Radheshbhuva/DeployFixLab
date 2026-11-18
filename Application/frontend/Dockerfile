# Multi-stage Dockerfile for DeployFix Lab Frontend SPA
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production NGINX Static Server
FROM nginx:alpine AS runner

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy production assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized SPA NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 5173

CMD ["nginx", "-g", "daemon off;"]
