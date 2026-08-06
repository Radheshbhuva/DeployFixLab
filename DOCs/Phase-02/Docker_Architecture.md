# Docker Architecture

## Purpose

Define the container architecture for DeployFix Lab to ensure a
reproducible, production-like environment.

## Objectives

-   Isolate services
-   Simplify deployment
-   Ensure portability
-   Enable troubleshooting

## Architecture

``` text
                Browser
                   │
                   ▼
              Nginx Container
             /               \
            ▼                 ▼
 Frontend Container     Backend Container
                               │
                               ▼
                    PostgreSQL Container
```

## Containers

### Frontend

-   React + Vite
-   Static production build
-   Communicates only with Nginx

### Backend

-   Express API
-   JWT Authentication
-   Connects to PostgreSQL

### PostgreSQL

-   Persistent data
-   Mounted volume
-   Internal network only

### Nginx

-   Reverse proxy
-   Static asset delivery
-   API routing

## Networks

-   deployfix-network (bridge)
-   Internal container communication via service names

## Volumes

-   postgres_data
-   nginx_logs (optional)
-   app_logs (optional)

## Build Flow

1.  Build frontend image
2.  Build backend image
3.  Pull PostgreSQL image
4.  Build Nginx image
5.  Start services with Docker Compose

## Security

-   Environment variables
-   No secrets in images
-   Least privilege
-   Internal database access only

## Health Checks

-   Frontend
-   Backend
-   PostgreSQL
-   Nginx

## Deliverables

-   Architecture diagram
-   Docker images
-   Networks
-   Volumes
-   Compose configuration
