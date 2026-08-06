# Container Security Guide

## Purpose

Define security best practices for Docker containers used in DeployFix
Lab.

## Objectives

-   Minimize attack surface
-   Secure images
-   Protect secrets
-   Secure networking
-   Prepare for production

## Image Security

-   Use official images
-   Pin versions
-   Scan for vulnerabilities
-   Remove unused packages

## Runtime Security

-   Run as non-root
-   Resource limits
-   Read-only filesystem where possible
-   Restart policies

## Secrets

Never hardcode: - JWT_SECRET - DATABASE_URL - API Keys Use environment
variables and future secret managers.

## Network Security

-   Private bridge network
-   Internal database only
-   Expose only required ports

## Volume Security

-   Restrict permissions
-   Backup critical data
-   Protect sensitive files

## Monitoring

-   Security logs
-   Failed logins
-   Unexpected restarts

## Checklist

-   Updated images
-   Non-root user
-   Secure env vars
-   Health checks
-   Minimal exposed ports

## Deliverables

-   Hardened Dockerfiles
-   Security checklist
-   Documentation
