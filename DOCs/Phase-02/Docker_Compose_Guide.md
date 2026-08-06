# Docker Compose Guide

# Purpose

This guide defines how Docker Compose orchestrates all DeployFix Lab
services into a single reproducible environment.

## Objectives

-   Start the complete application with one command
-   Manage multi-container dependencies
-   Centralize configuration
-   Simplify local development

## Services

-   frontend
-   backend
-   postgres
-   nginx

## Compose Responsibilities

-   Build images
-   Create networks
-   Mount volumes
-   Inject environment variables
-   Configure restart policies
-   Control startup order

## Recommended Structure

``` text
docker/
├── compose.yaml
├── .env.example
├── frontend/
├── backend/
├── nginx/
└── postgres/
```

## Networks

-   deployfix-network (bridge)

All services communicate using service names instead of IP addresses.

## Volumes

-   postgres_data
-   nginx_logs (optional)
-   app_logs (optional)

## Environment Variables

Frontend: - VITE_API_URL

Backend: - PORT - DATABASE_URL - JWT_SECRET - LOG_LEVEL

Database: - POSTGRES_DB - POSTGRES_USER - POSTGRES_PASSWORD

## Useful Commands

``` bash
docker compose up
docker compose up -d
docker compose down
docker compose ps
docker compose logs
docker compose logs backend
docker compose restart backend
docker compose build
docker compose pull
```

## Startup Flow

1.  Create network
2.  Create volumes
3.  Start PostgreSQL
4.  Start Backend
5.  Start Frontend
6.  Start Nginx
7.  Verify health endpoints

## Validation Checklist

-   All containers running
-   Database connected
-   API reachable
-   Frontend loads
-   Nginx proxies correctly
-   Data persists after restart

## Common Issues

-   Port conflicts
-   Missing .env values
-   Incorrect service names
-   Volume permission problems
-   Database startup timing
-   Build cache issues
