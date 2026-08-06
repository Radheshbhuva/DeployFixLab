# Dockerfile Guidelines

## Purpose

Define standards for creating secure, efficient, and production-ready
Dockerfiles.

## Principles

-   Small image size
-   Layer caching
-   Multi-stage builds
-   Minimal attack surface
-   Reproducible builds

## General Structure

``` dockerfile
FROM <base-image>

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE <port>

CMD ["npm","start"]
```

## Frontend Dockerfile

-   Multi-stage build
-   Build using Node image
-   Serve static files with Nginx

## Backend Dockerfile

-   Install production dependencies
-   Compile TypeScript
-   Run compiled output
-   Expose API port

## Best Practices

-   Use .dockerignore
-   Pin image versions
-   Avoid root user
-   Copy dependency files first
-   Use production NODE_ENV
-   Keep one responsibility per container

## Environment Variables

Never hardcode: - DATABASE_URL - JWT_SECRET - API URLs - Passwords

Use Docker Compose or runtime injection.

## Image Naming

-   deployfix-frontend
-   deployfix-backend
-   deployfix-nginx

## Common Mistakes

-   Large images
-   Missing .dockerignore
-   Hardcoded secrets
-   Running as root
-   Rebuilding dependencies unnecessarily

## Validation Checklist

-   Image builds successfully
-   Container starts
-   Logs are clean
-   Health endpoint works
-   Image size reviewed
-   No secrets embedded

## Deliverables

-   Frontend Dockerfile
-   Backend Dockerfile
-   Nginx Dockerfile
-   .dockerignore
-   Build documentation
