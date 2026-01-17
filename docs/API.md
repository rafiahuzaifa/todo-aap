# API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "User Name"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "User Name",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "User Name"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "User Name",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <token>

Response: 200 OK
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Successfully logged out"
}
```

---

## Task Endpoints

### List Tasks
```http
GET /tasks?skip=0&limit=10&status=active
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Task Title",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-01-15T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "high",
  "due_date": "2024-01-15T00:00:00Z"
}

Response: 201 Created
{
  "id": "uuid",
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-01-15T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Task
```http
GET /tasks/{id}
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-01-15T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Task
```http
PUT /tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "low",
  "status": "in_progress"
}

Response: 200 OK
{
  "id": "uuid",
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "low",
  "due_date": "2024-01-15T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Delete Task
```http
DELETE /tasks/{id}
Authorization: Bearer <token>

Response: 204 No Content
```

### Complete Task
```http
POST /tasks/{id}/complete
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "title": "Task Title",
  "status": "completed",
  "completed_at": "2024-01-01T12:00:00Z"
}
```

---

## Statistics Endpoints

### Task Summary
```http
GET /stats/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "total_tasks": 10,
  "completed_tasks": 3,
  "pending_tasks": 5,
  "in_progress_tasks": 2,
  "overdue_tasks": 1,
  "completion_rate": 30.0
}
```

### Task Trends
```http
GET /stats/trends?days=30
Authorization: Bearer <token>

Response: 200 OK
{
  "period": "30 days",
  "completed_per_day": [1, 2, 1, 3, 0, 2, 1],
  "average_per_day": 1.43,
  "trend": "stable"
}
```

### Analytics Dashboard (Phase 3)
```http
GET /stats/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "summary": { ... },
  "trends": { ... },
  "by_priority": { "high": 2, "medium": 5, "low": 3 },
  "by_status": { "pending": 5, "in_progress": 2, "completed": 3 }
}
```

---

## Real-Time Endpoints (Phase 3)

### WebSocket Connection
```
WS ws://localhost:8000/ws
Authorization: Bearer <token> (in query parameter or header)

Message format:
{
  "type": "task.create|task.update|task.delete|presence.online",
  "data": { ... }
}
```

### Search Tasks
```http
GET /search?q=query&type=title&limit=10
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Matching Task",
    "description": "Description with query",
    "relevance_score": 0.95
  }
]
```

### Share Task
```http
POST /collaborate/{task_id}/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "shared_with": ["user_id_1", "user_id_2"],
  "permission": "view|edit"
}

Response: 201 Created
{
  "task_id": "uuid",
  "shared_with": ["user_id_1", "user_id_2"],
  "permission": "view",
  "shared_at": "2024-01-01T00:00:00Z"
}
```

### Add Comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "task_id": "uuid",
  "content": "Comment text"
}

Response: 201 Created
{
  "id": "uuid",
  "task_id": "uuid",
  "author_id": "uuid",
  "content": "Comment text",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### User Presence
```http
GET /presence
Authorization: Bearer <token>

Response: 200 OK
{
  "online_users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "status": "online",
      "last_activity": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Access denied"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 409 Conflict
```json
{
  "detail": "Resource already exists"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

API has rate limiting (configurable):
- Default: 100 requests per minute per user
- Check response headers:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

List endpoints support pagination:
- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum items to return (default: 10, max: 100)

Example:
```
GET /tasks?skip=20&limit=10
```

---

## Filters

### Task Filters
- `status`: pending|in_progress|completed
- `priority`: low|medium|high
- `due_date_from`: ISO datetime
- `due_date_to`: ISO datetime
- `sort_by`: created_at|due_date|title
- `sort_order`: asc|desc

Example:
```
GET /tasks?status=pending&priority=high&sort_by=due_date&sort_order=asc
```

---

## Example Usage

### cURL
```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","full_name":"User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Create task
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","priority":"high"}'
```

### JavaScript/Fetch
```javascript
// Login
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'pass123'
  })
});

const data = await response.json();
const token = data.access_token;

// Create task
const taskResponse = await fetch('http://localhost:8000/api/v1/tasks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Task',
    priority: 'high'
  })
});
```

### Python/Requests
```python
import requests

# Login
login_response = requests.post(
    'http://localhost:8000/api/v1/auth/login',
    json={
        'email': 'user@example.com',
        'password': 'pass123'
    }
)

token = login_response.json()['access_token']

# Create task
task_response = requests.post(
    'http://localhost:8000/api/v1/tasks',
    headers={'Authorization': f'Bearer {token}'},
    json={
        'title': 'My Task',
        'priority': 'high'
    }
)
```

---

**Last Updated:** Phase 3 Implementation
