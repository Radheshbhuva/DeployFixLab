# Volume Management

# Phase 2 -- DeployFix Lab

## Purpose

Define how persistent storage is managed across Docker containers to
prevent data loss and simplify recovery.

## Objectives

-   Persist PostgreSQL data
-   Store application logs
-   Preserve configuration where required
-   Understand Docker volume lifecycle

## Types of Storage

### Named Volumes

Recommended for production data.

Example: - postgres_data

### Bind Mounts

Useful during development for source code or configuration files.

### Anonymous Volumes

Temporary container storage.

## Planned Volumes

  Volume          Purpose
  --------------- -------------------------
  postgres_data   Database persistence
  nginx_logs      Access and error logs
  app_logs        Backend logs (optional)

## Data Flow

``` text
Container
    │
Docker Volume
    │
Host Storage
```

## Backup Strategy

-   Database dump
-   Volume snapshot
-   Restore validation

## Best Practices

-   Never store database data inside the container filesystem
-   Separate logs from application code
-   Keep configuration under version control
-   Clean unused volumes periodically

## Common Problems

-   Permission denied
-   Missing volume
-   Data loss after container removal
-   Incorrect mount path
-   Disk space exhaustion

## Validation Checklist

-   Data survives container restart
-   Data survives image rebuild
-   Logs persist
-   Volume mounts correctly
-   Database initializes successfully

## Deliverables

-   Named volumes
-   Volume documentation
-   Backup guide
-   Restore guide
