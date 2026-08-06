# API Specification

# Phase 1 -- DevOps Task Manager

## Purpose

Define the REST API contract between the React frontend and Express
backend.

## Base URL

``` text
/api/v1
```

## Authentication

### Register

POST /auth/register

Request

``` json
{
  "name":"John Doe",
  "email":"john@example.com",
  "password":"Password123"
}
```

Response - 201 Created

------------------------------------------------------------------------

### Login

POST /auth/login

Returns JWT access token.

------------------------------------------------------------------------

### Current User

GET /auth/me

Authorization: Bearer Token

------------------------------------------------------------------------

## Tasks

### Get Tasks

GET /tasks

### Get Task

GET /tasks/{id}

### Create Task

POST /tasks

``` json
{
  "title":"Deploy Docker",
  "description":"Containerize backend",
  "priority":"HIGH"
}
```

### Update Task

PUT /tasks/{id}

### Delete Task

DELETE /tasks/{id}

------------------------------------------------------------------------

## Dashboard

GET /dashboard

Returns: - Total Tasks - Completed Tasks - Pending Tasks - Overdue Tasks

------------------------------------------------------------------------

## Health

GET /health

Returns

``` json
{
  "status":"UP"
}
```

GET /ready

GET /live

------------------------------------------------------------------------

## HTTP Status Codes

-   200 OK
-   201 Created
-   204 No Content
-   400 Bad Request
-   401 Unauthorized
-   403 Forbidden
-   404 Not Found
-   409 Conflict
-   500 Internal Server Error

------------------------------------------------------------------------

## Error Response

``` json
{
  "success":false,
  "message":"Validation Failed",
  "errors":[]
}
```

------------------------------------------------------------------------

## Security

-   JWT Authentication
-   HTTPS Ready
-   Rate Limiting
-   Input Validation
-   CORS

------------------------------------------------------------------------

## Versioning

Current Version

v1

Future

v2
