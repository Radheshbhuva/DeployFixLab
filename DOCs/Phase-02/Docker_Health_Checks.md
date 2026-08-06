# Docker Health Checks

# Phase 2 -- DeployFix Lab

## Purpose

Define a health check strategy to ensure all containers are operational
and ready to serve requests.

## Objectives

-   Detect unhealthy containers
-   Improve reliability
-   Enable automated recovery
-   Prepare for production monitoring

## Health Check Endpoints

### Frontend

-   HTTP response available
-   Static assets accessible

### Backend

-   GET /health
-   GET /ready
-   GET /live

### PostgreSQL

-   Database accepts connections

### Nginx

-   Responds on HTTP port
-   Routes requests correctly

## Health Check Strategy

-   Startup checks
-   Readiness checks
-   Liveness checks
-   Periodic monitoring

## Validation Checklist

-   All containers report healthy
-   Health endpoints return success
-   Failed services are detected
-   Restart policy works

## Common Issues

-   Slow startup
-   Incorrect endpoint
-   Database unavailable
-   Port mismatch
-   Reverse proxy failure

## Deliverables

-   Health check configuration
-   Monitoring guide
-   Validation report
