# Docker Debugging Guide

## Purpose

Provide a systematic approach to debugging Docker issues.

## Debugging Workflow

Problem → Logs → Inspect → Diagnose → Fix → Verify → Document

## Useful Commands

``` bash
docker ps
docker ps -a
docker logs <container>
docker exec -it <container> sh
docker inspect <container>
docker network ls
docker volume ls
docker compose ps
docker compose logs
docker compose up --build
```

## Common Issues

-   Build failures
-   Missing environment variables
-   Port conflicts
-   Database connection errors
-   DNS resolution problems
-   Nginx proxy errors

## Troubleshooting Checklist

-   Container running
-   Ports mapped
-   Volumes mounted
-   Networks attached
-   Environment variables loaded
-   Health endpoints working

## Root Cause Template

-   Problem
-   Symptoms
-   Investigation
-   Root Cause
-   Resolution
-   Prevention

## Deliverables

-   Debugging playbook
-   Command reference
-   Incident documentation
