# Phase 2: REST API Specification

**Status**: READY  
**Framework**: FastAPI 0.100+  
**Python**: 3.13+  
**ORM**: SQLModel  
**Database**: Neon PostgreSQL  

---

## 1. API Overview

### Base URL
```
http://localhost:8000/api/v1
https://api.evolution-todo.com/api/v1  # Production
```

### Authentication
- **Header**: `Authorization: Bearer <jwt_token>`
- **Provider**: BetterAuth with JWT
- **Expiry**: 24 hours (configurable)
- **Refresh**: Via refresh token (7 days)

### Response Format (Standard)
```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-01-17T10:30:00Z",
  "request_id": "uuid"
}
```

### Error Format (Standard)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field validation failed",
    "details": {
      "field": ["error message"]
    }
  },
  "timestamp": "2026-01-17T10:30:00Z",
  "request_id": "uuid"
}
```

---

## 2. Authentication Endpoints

### POST /auth/register
**Description**: Register new user with email and password

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2026-01-17T10:30:00Z"
    },
    "token": "jwt_token",
    "refresh_token": "refresh_jwt"
  }
}
```

**Errors**:
- 400: Email already exists
- 422: Invalid email format / weak password

**Validation**:
- Email: RFC 5322 format, unique
- Password: ≥8 chars, 1 uppercase, 1 number, 1 special char
- Name: 2-100 characters

---

### POST /auth/login
**Description**: Authenticate user and return JWT tokens

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token",
    "refresh_token": "refresh_jwt"
  }
}
```

**Errors**:
- 401: Invalid credentials
- 404: User not found

---

### POST /auth/refresh
**Description**: Refresh expired access token

**Request**:
```json
{
  "refresh_token": "refresh_jwt"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refresh_token": "new_refresh_jwt"
  }
}
```

**Errors**:
- 401: Invalid refresh token
- 401: Refresh token expired

---

### POST /auth/logout
**Description**: Invalidate user session

**Auth**: Required (Bearer token)

**Response** (200):
```json
{
  "success": true,
  "data": null
}
```

---

### GET /auth/me
**Description**: Get current authenticated user

**Auth**: Required (Bearer token)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-01-17T10:30:00Z",
    "updated_at": "2026-01-17T10:30:00Z"
  }
}
```

**Errors**:
- 401: Unauthorized

---

## 3. Task Endpoints

### POST /tasks
**Description**: Create new task

**Auth**: Required

**Request**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "due_date": "2026-02-01T00:00:00Z"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high",
    "due_date": "2026-02-01T00:00:00Z",
    "created_at": "2026-01-17T10:30:00Z",
    "updated_at": "2026-01-17T10:30:00Z"
  }
}
```

**Validation**:
- Title: 1-200 characters (required)
- Description: 0-2000 characters (optional)
- Priority: "low" | "medium" | "high" (default: "medium")
- Due_date: ISO 8601 datetime (optional, future date)

**Errors**:
- 400: Validation error
- 401: Unauthorized
- 422: Invalid field

---

### GET /tasks
**Description**: List all tasks with filtering and pagination

**Auth**: Required

**Query Parameters**:
```
?status=pending          # pending|completed|all (default: all)
?priority=high           # low|medium|high (optional)
?sort_by=created_at      # created_at|title|due_date|priority (default: created_at)
?sort_dir=asc            # asc|desc (default: desc)
?page=1                  # Page number (default: 1)
&limit=20                # Items per page (default: 20, max: 100)
&search=query            # Search in title/description (optional)
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "completed": false,
        "priority": "high",
        "due_date": "2026-02-01T00:00:00Z",
        "created_at": "2026-01-17T10:30:00Z",
        "updated_at": "2026-01-17T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

**Errors**:
- 401: Unauthorized
- 400: Invalid query parameter

---

### GET /tasks/{task_id}
**Description**: Get single task details

**Auth**: Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high",
    "due_date": "2026-02-01T00:00:00Z",
    "created_at": "2026-01-17T10:30:00Z",
    "updated_at": "2026-01-17T10:30:00Z"
  }
}
```

**Errors**:
- 401: Unauthorized
- 404: Task not found
- 403: Forbidden (not owner)

---

### PATCH /tasks/{task_id}
**Description**: Update task (partial update)

**Auth**: Required

**Request** (one or more):
```json
{
  "title": "Buy groceries and cook",
  "completed": true,
  "priority": "medium",
  "due_date": "2026-02-02T00:00:00Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Buy groceries and cook",
    "completed": true,
    "priority": "medium",
    "due_date": "2026-02-02T00:00:00Z",
    "updated_at": "2026-01-17T10:35:00Z"
  }
}
```

**Validation**:
- Same as POST /tasks
- Completed: Boolean toggle
- Cannot update other user's task

**Errors**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Task not found
- 422: Invalid field

---

### DELETE /tasks/{task_id}
**Description**: Delete task

**Auth**: Required

**Response** (200):
```json
{
  "success": true,
  "data": null
}
```

**Errors**:
- 401: Unauthorized
- 403: Forbidden
- 404: Task not found

---

## 4. Statistics Endpoints

### GET /stats/summary
**Description**: Get task statistics summary

**Auth**: Required

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total_tasks": 42,
    "completed_tasks": 15,
    "pending_tasks": 27,
    "completion_rate": 35.7,
    "high_priority": 5,
    "medium_priority": 20,
    "low_priority": 17,
    "overdue_tasks": 3,
    "tasks_due_today": 2,
    "tasks_due_this_week": 8
  }
}
```

---

### GET /stats/trends
**Description**: Get completion trends (last 30 days)

**Auth**: Required

**Query Parameters**:
```
?days=30     # 7|14|30|90 (default: 30)
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "period": "2025-12-18 - 2026-01-17",
    "daily": [
      {
        "date": "2026-01-17",
        "created": 2,
        "completed": 1,
        "total": 42
      }
    ],
    "weekly": [
      {
        "week": "2026-W03",
        "created": 10,
        "completed": 7,
        "total": 42
      }
    ]
  }
}
```

---

## 5. Export Endpoints

### GET /tasks/export/csv
**Description**: Export tasks as CSV

**Auth**: Required

**Query Parameters**:
```
?status=pending          # Optional filter
?priority=high           # Optional filter
```

**Response** (200):
```
Content-Type: text/csv
Content-Disposition: attachment; filename="tasks-2026-01-17.csv"

id,title,description,completed,priority,due_date,created_at
uuid1,Buy groceries,Milk eggs bread,false,high,2026-02-01T00:00:00Z,2026-01-17T10:30:00Z
...
```

---

### GET /tasks/export/json
**Description**: Export tasks as JSON

**Auth**: Required

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "priority": "high",
      "due_date": "2026-02-01T00:00:00Z",
      "created_at": "2026-01-17T10:30:00Z"
    }
  ]
}
```

---

## 6. Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| VALIDATION_ERROR | 422 | Field validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Not authorized for resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| RATE_LIMITED | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |

---

## 7. Rate Limiting

**Limits** (per user, per hour):
- Authentication: 10 requests
- API: 1000 requests
- Export: 50 requests
- File uploads: 20 requests

**Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1642427400
```

---

## 8. Pagination

**Standard pagination**:
- Default limit: 20
- Max limit: 100
- Default page: 1

**Response**:
```json
{
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

## 9. API Versioning

**Current**: v1

**Header support**:
```
Accept: application/json; version=1.0
```

---

## 10. CORS & Security

**CORS Headers**:
```
Access-Control-Allow-Origin: https://app.evolution-todo.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

**Security Headers**:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 11. Logging & Monitoring

**Logged Fields**:
- Request ID (uuid)
- User ID (authenticated)
- Endpoint
- Method
- Status code
- Response time (ms)
- Error details (if error)

**Metrics**:
- Request count
- Error rate
- Response time (p50, p95, p99)
- Active users
- Database query time

---

## 12. API Testing

**Test Framework**: pytest + httpx

**Test Categories**:
- Unit tests for business logic
- Integration tests for endpoints
- Authentication tests
- Error handling tests
- Rate limiting tests
- Performance tests

**Minimum Coverage**: 85%
