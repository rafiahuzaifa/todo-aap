# Phase 2: Database Schema Specification

**Status**: READY  
**Database**: Neon PostgreSQL  
**ORM**: SQLModel  
**Migrations**: Alembic  

---

## 1. Overview

### Database Connection
```
postgresql://user:password@host:5432/evolution_todo_db
```

### Neon Branch Support
- Development: branch `dev`
- Staging: branch `staging`
- Production: branch `main`

### Multi-branch Strategy
Each branch has isolated database for safe testing and schema evolution.

---

## 2. Core Tables

### 2.1 Users Table

**Purpose**: Store user accounts and authentication

**Schema**:
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_users_deleted_at ON public.users(deleted_at);
```

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| email | VARCHAR(255) | UNIQUE, NOT NULL | RFC 5322 format |
| name | VARCHAR(100) | NOT NULL | 2-100 chars |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| is_active | BOOLEAN | DEFAULT true | Soft deactivation |
| is_verified | BOOLEAN | DEFAULT false | Email verification |
| email_verified_at | TIMESTAMP | NULL | When email verified |
| last_login_at | TIMESTAMP | NULL | For analytics |
| created_at | TIMESTAMP | DEFAULT now() | Account creation |
| updated_at | TIMESTAMP | DEFAULT now() | Last modification |
| deleted_at | TIMESTAMP | NULL | Soft delete flag |

---

### 2.2 Tasks Table

**Purpose**: Store user tasks

**Schema**:
```sql
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    
    priority VARCHAR(20) DEFAULT 'medium' NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_user_id_completed ON public.tasks(user_id, completed);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_priority ON public.tasks(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_deleted_at ON public.tasks(deleted_at);
```

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| user_id | UUID | FK users | Required owner |
| title | VARCHAR(200) | NOT NULL | 1-200 chars |
| description | TEXT | NULL | 0-2000 chars |
| completed | BOOLEAN | DEFAULT false | Task status |
| priority | VARCHAR(20) | DEFAULT 'medium' | low\|medium\|high |
| due_date | TIMESTAMP | NULL | Future date only |
| completed_at | TIMESTAMP | NULL | When completed |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |
| updated_at | TIMESTAMP | DEFAULT now() | Last edit |
| deleted_at | TIMESTAMP | NULL | Soft delete |

**Constraints**:
- Title: NOT NULL, length 1-200
- Description: length 0-2000
- Priority: ENUM (low, medium, high)
- Due_date: Must be future date
- Completed_at: Set when completed=true

---

### 2.3 Sessions Table

**Purpose**: Store user sessions and JWT tokens

**Schema**:
```sql
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    access_token VARCHAR(1024) NOT NULL,
    refresh_token VARCHAR(1024) NOT NULL,
    token_type VARCHAR(20) DEFAULT 'Bearer' NOT NULL,
    
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_access_token ON public.sessions(access_token);
CREATE INDEX idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX idx_sessions_revoked_at ON public.sessions(revoked_at);
CREATE INDEX idx_sessions_created_at ON public.sessions(created_at DESC);
```

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| user_id | UUID | FK users | Session owner |
| access_token | VARCHAR(1024) | NOT NULL | JWT token |
| refresh_token | VARCHAR(1024) | NOT NULL | Refresh token |
| token_type | VARCHAR(20) | DEFAULT 'Bearer' | Token type |
| expires_at | TIMESTAMP | NOT NULL | Token expiry (24h) |
| revoked_at | TIMESTAMP | NULL | Revocation time |
| ip_address | INET | NULL | Client IP |
| user_agent | TEXT | NULL | Browser/device info |
| created_at | TIMESTAMP | DEFAULT now() | Session creation |
| updated_at | TIMESTAMP | DEFAULT now() | Last activity |

---

### 2.4 Audit Log Table

**Purpose**: Track all user actions for compliance

**Schema**:
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    
    changes JSONB,
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
```

**Fields**:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| user_id | UUID | FK users | Who performed action |
| action | VARCHAR(50) | NOT NULL | create\|update\|delete |
| resource_type | VARCHAR(50) | NOT NULL | Task\|User\|etc |
| resource_id | UUID | NOT NULL | Which resource |
| changes | JSONB | NULL | Field changes |
| old_values | JSONB | NULL | Before values |
| new_values | JSONB | NULL | After values |
| ip_address | INET | NULL | Request origin |
| user_agent | TEXT | NULL | Client info |
| created_at | TIMESTAMP | DEFAULT now() | Action time |

**Actions**:
- `user.created` - New account
- `user.login` - User login
- `user.updated` - Profile change
- `task.created` - Task added
- `task.updated` - Task modified
- `task.completed` - Task marked done
- `task.deleted` - Task removed

---

## 3. Relationships

### Diagram

```
Users (1) ────────────────(N) Tasks
  │
  ├─────────────────────────→ Sessions
  │
  └─────────────────────────→ AuditLogs


Foreign Keys:
- tasks.user_id → users.id (CASCADE DELETE)
- sessions.user_id → users.id (CASCADE DELETE)
- audit_logs.user_id → users.id (SET NULL)
```

---

## 4. Constraints & Validations

### Data Integrity
```sql
-- Email uniqueness (case-insensitive)
CREATE UNIQUE INDEX idx_users_email_lower ON public.users(LOWER(email));

-- Task title not empty or whitespace
ALTER TABLE public.tasks ADD CONSTRAINT task_title_not_empty 
    CHECK (LENGTH(TRIM(title)) > 0);

-- Priority enum values
ALTER TABLE public.tasks ADD CONSTRAINT task_priority_enum 
    CHECK (priority IN ('low', 'medium', 'high'));

-- Due date must be future
ALTER TABLE public.tasks ADD CONSTRAINT task_due_date_future 
    CHECK (due_date IS NULL OR due_date > now());

-- Completed date only when completed
ALTER TABLE public.tasks ADD CONSTRAINT task_completed_logic 
    CHECK ((completed = true AND completed_at IS NOT NULL) 
           OR (completed = false AND completed_at IS NULL));
```

---

## 5. Indexes Strategy

### Primary Indexes
- `id` - Primary key (auto)
- `user_id` - Foreign key filtering

### Search Indexes
- `tasks.user_id, completed` - List pending tasks
- `tasks.created_at DESC` - Chronological ordering
- `tasks.due_date` - Due date filtering
- `users.email` - Login lookups

### Performance Indexes
- `tasks.priority` - Priority filtering
- `sessions.expires_at` - Session cleanup
- `audit_logs.created_at DESC` - Recent actions

### Full Text Search (Phase 2b)
```sql
CREATE INDEX idx_tasks_title_description_fts ON public.tasks 
    USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

---

## 6. Views (Optional)

### User Statistics View
```sql
CREATE VIEW public.vw_user_stats AS
SELECT 
    u.id,
    u.email,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.completed THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN NOT t.completed THEN t.id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN t.priority = 'high' AND NOT t.completed THEN t.id END) as high_priority_pending,
    COUNT(DISTINCT CASE WHEN t.due_date < now() AND NOT t.completed THEN t.id END) as overdue_tasks,
    MAX(t.created_at) as last_task_created,
    MAX(u.last_login_at) as last_login
FROM public.users u
LEFT JOIN public.tasks t ON u.id = t.user_id AND t.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email;
```

---

## 7. Sequence Management

### Task IDs
- UUID v4 (auto-generated)
- No sequential IDs for security

### Audit Log IDs
- UUID v4 (auto-generated)

---

## 8. Backup & Recovery

### Backup Strategy
- Neon automated backups (daily)
- Point-in-time recovery (7 days)
- Retention: 30 days

### Disaster Recovery
- RTO: 1 hour
- RPO: 1 day
- Replicas: Multi-region (Phase 3+)

---

## 9. Performance Optimization

### Query Optimization
- Use `user_id + completed` index for list queries
- Use `created_at DESC` for chronological ordering
- Avoid full table scans with proper WHERE clauses

### Connection Pooling
- Min connections: 5
- Max connections: 20
- Idle timeout: 30 minutes

### Caching Strategy
- User profile: 1 hour
- Task list: 5 minutes
- Statistics: 15 minutes

---

## 10. Migration Strategy

### Versioning
- Format: `001_initial_schema.sql`
- Tool: Alembic (Python)
- History: Tracked in migrations folder

### Zero-Downtime Migrations
- Add columns with defaults
- Create indexes CONCURRENTLY
- Use NOT VALID constraints
- Multi-phase approach

### Rollback Plan
- Every migration has down() function
- Test rollback in dev
- Keep migration history

---

## 11. Data Types Reference

### Field Types
- **UUID**: `UUID` or `CHAR(36)`
- **Strings**: `VARCHAR(n)` or `TEXT`
- **Booleans**: `BOOLEAN`
- **Timestamps**: `TIMESTAMP WITH TIME ZONE`
- **IP Address**: `INET`
- **JSON**: `JSONB` (indexed)

### Default Values
```
created_at: CURRENT_TIMESTAMP
updated_at: CURRENT_TIMESTAMP
is_active: true
completed: false
priority: 'medium'
```

---

## 12. Security Considerations

### PII Protection
- Passwords: bcrypt hashed
- Emails: Unique constraint
- IP addresses: Anonymized (last octet)

### Access Control
- Users can only access own data
- RLS (Row Level Security) policy:
  ```sql
  ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  CREATE POLICY task_owner_policy ON tasks
    USING (auth.uid() = user_id);
  ```

### Compliance
- GDPR: Right to erasure (soft delete)
- Audit trails: All actions logged
- Data retention: 90 days for deleted data

---

## 13. Capacity Planning

### Current Capacity
- Users: 10,000
- Tasks per user: 1,000
- Total tasks: 10M records
- Storage: ~5GB

### Scale to 1M Users
- Database: Partitioning by user_id
- Sharding: If needed (Phase 4+)
- Replicas: Read replicas (Phase 3+)

---

## 14. Monitoring

### Metrics
- Query performance (slow queries)
- Connection pool usage
- Replication lag
- Backup status

### Alerts
- High query time (>1s)
- Connection pool exhaustion
- Backup failures
- Disk space usage

---

## 15. Testing Database

### Test Fixtures
- Pre-populated test users
- Sample tasks in different states
- Test sessions with various expirations

### Seeding Script
```python
# Python script to seed test data
- Create 10 test users
- Create 100 tasks per user
- Generate historical data (90 days)
- Create expired sessions
```
