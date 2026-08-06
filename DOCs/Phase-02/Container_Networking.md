# Container Networking

# Phase 2 -- DeployFix Lab

## Purpose

Define the networking architecture that allows Docker containers to
communicate securely, reliably, and predictably.

## Objectives

-   Understand Docker bridge networks
-   Enable service-to-service communication
-   Isolate internal services
-   Prepare for production deployment

## Network Architecture

``` text
Internet
   │
Browser
   │
Nginx
   │
Backend
   │
PostgreSQL
```

All services communicate through a dedicated Docker bridge network named
`deployfix-network`.

## Network Design

### External Access

-   Browser → Nginx

### Internal Access

-   Nginx → Backend
-   Backend → PostgreSQL

The database is never exposed directly to the public.

## Communication Rules

  Source    Destination   Purpose
  --------- ------------- ------------------
  Browser   Nginx         User requests
  Nginx     Frontend      Static assets
  Nginx     Backend       API proxy
  Backend   PostgreSQL    Database queries

## DNS Resolution

Containers communicate using service names instead of IP addresses.

Example: - backend - postgres - nginx

## Security Principles

-   Private internal network
-   Least privilege
-   No direct database exposure
-   Controlled port publishing

## Common Issues

-   Wrong service names
-   Missing network
-   Port conflicts
-   DNS failures
-   Firewall restrictions
-   Network isolation errors

## Validation Checklist

-   Containers resolve each other
-   Backend reaches database
-   Nginx reaches backend
-   Browser reaches Nginx
-   No public database access

## Deliverables

-   Docker network
-   Network documentation
-   Connectivity tests
-   Troubleshooting guide
