# Phase 2: Authentication Specification

**Status**: READY  
**Provider**: BetterAuth  
**Protocol**: OAuth 2.0 + JWT  
**Storage**: Sessions table + LocalStorage (client)  

---

## 1. Overview

### Authentication Flow
```
User → Login Form → Backend /api/v1/auth/login → JWT Token
                     ↓
                  Validate credentials
                  ↓
                  Generate access + refresh tokens
                  ↓
                  Store session in DB
                  ↓
                  Return tokens to client
```

### Token Types
- **Access Token**: Short-lived (24 hours), read operations
- **Refresh Token**: Long-lived (30 days), obtain new access token

---

## 2. BetterAuth Configuration

### Server Setup

**Installation**:
```bash
pip install better-auth-python
```

**Environment Variables**:
```env
# Auth Configuration
AUTH_SECRET=your_secret_key_min_32_chars
AUTH_URL=http://localhost:8000
AUTH_COOKIE_MAX_AGE=86400  # 24 hours
AUTH_COOKIE_SECURE=false   # true in production
AUTH_COOKIE_SAME_SITE=Lax
AUTH_COOKIE_NAME=auth_token

# JWT Configuration
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_ALGORITHM=HS256
JWT_EXPIRY=86400  # 24 hours (access token)
JWT_REFRESH_EXPIRY=2592000  # 30 days (refresh token)

# OAuth Providers (Optional - Phase 2b)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Database
DATABASE_URL=postgresql://user:pass@host:5432/evolution_todo_db
```

### Python Configuration
```python
from better_auth import BetterAuth

auth = BetterAuth(
    database_url=os.getenv("DATABASE_URL"),
    secret=os.getenv("AUTH_SECRET"),
    jwt={
        "secret": os.getenv("JWT_SECRET"),
        "algorithm": "HS256",
        "expiry": 86400,  # 24h
        "refresh_expiry": 2592000,  # 30d
    },
    cookies={
        "secure": os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true",
        "same_site": "Lax",
        "max_age": 86400,
    },
)
```

---

## 3. JWT Token Structure

### Access Token Payload

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (24h expiry):
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user_id (UUID)
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1700000000,                                // issued at
  "exp": 1700086400,                                // expires at (24h)
  "iss": "evolution-todo",                          // issuer
  "aud": "evolution-todo-api",                      // audience
  "jti": "550e8400-e29b-41d4-a716-446655440001"    // JWT ID (unique)
}
```

**Signature**:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  AUTH_SECRET
)
```

### Refresh Token Payload

**Payload** (30d expiry):
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // user_id
  "type": "refresh",                                // token type
  "iat": 1700000000,
  "exp": 1702592000,                                // expires at (30d)
  "iss": "evolution-todo",
  "jti": "550e8400-e29b-41d4-a716-446655440002"
}
```

---

## 4. Authentication Endpoints

### 4.1 User Registration

**Endpoint**: `POST /api/v1/auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation**:
- Email: Valid RFC 5322 format, unique
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Name: 2-100 characters

**Response** (201 Created):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "is_verified": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email or weak password
- `409 Conflict`: Email already registered

---

### 4.2 User Login

**Endpoint**: `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "is_verified": true,
    "last_login_at": "2024-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 86400,
    "token_type": "Bearer"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Brute force protection (5 attempts/15min)

---

### 4.3 Refresh Access Token

**Endpoint**: `POST /api/v1/auth/refresh`

**Request**:
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "expires_in": 86400,
  "token_type": "Bearer"
}
```

**Error Responses**:
- `401 Unauthorized`: Refresh token expired or invalid
- `401 Unauthorized`: Refresh token revoked

---

### 4.4 Logout

**Endpoint**: `POST /api/v1/auth/logout`

**Headers**:
```
Authorization: Bearer eyJhbGc...
```

**Request**: (empty body)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Backend Action**:
- Update `sessions.revoked_at` = NOW()
- Clear user's cookies
- Remove session tokens

---

### 4.5 Verify Session

**Endpoint**: `GET /api/v1/auth/me`

**Headers**:
```
Authorization: Bearer eyJhbGc...
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "is_verified": true,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: No token provided
- `401 Unauthorized`: Token expired
- `401 Unauthorized`: Token invalid

---

## 5. Session Management

### Session Creation
```sql
-- Insert new session on login
INSERT INTO sessions (
    id, user_id, access_token, refresh_token, 
    token_type, expires_at, ip_address, user_agent
) VALUES (
    gen_random_uuid(), $1, $2, $3, 'Bearer', 
    now() + INTERVAL '24 hours', $4, $5
);
```

### Session Validation
```python
def validate_session(token: str) -> dict:
    try:
        # Decode JWT
        payload = jwt.decode(
            token, 
            secret=AUTH_SECRET,
            algorithms=["HS256"]
        )
        
        # Check if session revoked
        session = db.query(Session).filter(
            Session.access_token == token,
            Session.revoked_at.is_(None)
        ).first()
        
        if not session:
            raise InvalidTokenError("Session revoked")
            
        return payload
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError("Token expired")
    except jwt.InvalidTokenError:
        raise InvalidTokenError("Invalid token")
```

### Session Cleanup
```sql
-- Delete expired sessions daily (scheduled job)
DELETE FROM sessions 
WHERE expires_at < now() - INTERVAL '30 days'
  AND revoked_at IS NOT NULL;
```

---

## 6. Token Refresh Flow

### Automatic Refresh (Client)
```
1. Access token expires
2. Client intercepts 401 response
3. Send refresh token → POST /api/v1/auth/refresh
4. Receive new access token
5. Retry original request with new token
```

### Refresh Token Rotation
```python
def refresh_access_token(refresh_token: str) -> dict:
    # Validate refresh token
    payload = validate_token(refresh_token, is_refresh=True)
    
    # Generate new access token
    new_access_token = generate_access_token(payload["sub"])
    
    # Optional: Rotate refresh token (Phase 2b)
    # new_refresh_token = generate_refresh_token(payload["sub"])
    # Update session with new refresh token
    
    return {
        "access_token": new_access_token,
        "expires_in": 86400,
        "token_type": "Bearer"
    }
```

### Max Refresh Age
- Refresh token valid for: 30 days
- After 30 days: User must login again
- After 60 days: Session hard deleted

---

## 7. Security Features

### Password Security
- **Hashing**: bcrypt with salt (cost factor 12)
- **Storage**: password_hash column
- **Never transmitted**: Passwords never logged or cached

### Token Security
- **HTTPS Only**: Tokens over HTTPS only
- **Secure Cookies**: HttpOnly, Secure flags set
- **CSRF Protection**: SameSite=Lax cookie policy
- **Token Rotation**: Optional per-request refresh

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- Token refresh: 10 per minute per user
- Overall: 100 requests per minute per user

### Brute Force Protection
```python
def check_rate_limit(user_id: str, action: str) -> bool:
    key = f"rate_limit:{action}:{user_id}"
    attempts = redis.incr(key)
    
    if attempts == 1:
        redis.expire(key, 900)  # 15 minutes
    
    if attempts > LIMITS[action]:
        raise RateLimitError(f"Too many {action} attempts")
    
    return True
```

### Token Revocation
```sql
-- Revoke all sessions for user (emergency logout)
UPDATE sessions 
SET revoked_at = now() 
WHERE user_id = $1 AND revoked_at IS NULL;
```

---

## 8. OAuth 2.0 Integration (Phase 2b)

### Google OAuth Flow
```
1. User clicks "Login with Google"
2. Redirect to Google authorization
3. User grants permission
4. Google redirects to callback with code
5. Backend exchanges code for ID token
6. Extract email + name from ID token
7. Create/update user in DB
8. Generate session tokens
9. Redirect to dashboard
```

### GitHub OAuth Flow
```
1. User clicks "Login with GitHub"
2. Redirect to GitHub authorization
3. User grants permission
4. GitHub redirects to callback with code
5. Backend exchanges code for access token
6. Fetch user info from /user endpoint
7. Create/update user in DB
8. Generate session tokens
9. Redirect to dashboard
```

---

## 9. Client-Side Token Storage

### Storage Strategy

**LocalStorage** (Recommended):
```javascript
// After login
localStorage.setItem('access_token', response.session.access_token);
localStorage.setItem('refresh_token', response.session.refresh_token);
localStorage.setItem('token_type', 'Bearer');

// On app load
const token = localStorage.getItem('access_token');
if (token) {
  // Set Authorization header
}
```

**Pros**: Persists across page reloads  
**Cons**: XSS vulnerable (if compromised, attacker gets tokens)

**Alternative: Secure HttpOnly Cookie** (Phase 2b)
```javascript
// Backend sets cookie automatically
// Frontend doesn't handle tokens directly
// Browser sends automatically with requests
// XSS-resistant
```

---

## 10. API Authentication Middleware

### Middleware Implementation
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Verify session not revoked
        session = db.query(Session).filter(
            Session.access_token == token,
            Session.revoked_at.is_(None)
        ).first()
        
        if not session:
            raise HTTPException(status_code=401, detail="Session revoked")
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Usage in endpoints
@app.get("/api/v1/tasks")
async def list_tasks(user_id: str = Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == user_id).all()
```

---

## 11. Error Handling

### Auth Errors

| Error | Status | Message | Action |
|-------|--------|---------|--------|
| Invalid credentials | 401 | "Invalid email or password" | Retry login |
| Token expired | 401 | "Token expired" | Use refresh token |
| Invalid token | 401 | "Invalid token" | Redirect to login |
| Session revoked | 401 | "Session revoked" | Redirect to login |
| Rate limit exceeded | 429 | "Too many attempts" | Wait 15 minutes |
| Email taken | 409 | "Email already registered" | Use different email |
| Weak password | 400 | "Password too weak" | Change password |

---

## 12. Compliance & Privacy

### GDPR Compliance
- User can request data export: `GET /api/v1/auth/export`
- User can delete account: `DELETE /api/v1/auth/account`
- All user data deleted from DB
- Soft delete: kept for 90 days, then purged

### CCPA Compliance
- Privacy policy accessible at `/privacy`
- User data transparency: `/api/v1/auth/data`
- Opt-out of analytics: `PATCH /api/v1/auth/me` with analytics=false

### Encryption
- Passwords: bcrypt (one-way)
- At-rest: Database encryption (Neon default)
- In-transit: HTTPS only

---

## 13. Testing Strategy

### Unit Tests
```python
# test_auth_endpoints.py
def test_register_success():
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!",
        "name": "Test User"
    })
    assert response.status_code == 201
    assert response.json()["user"]["email"] == "test@example.com"
    assert "access_token" in response.json()["session"]

def test_register_duplicate_email():
    # Create user 1
    # Create user 2 with same email
    # Should fail with 409
    
def test_login_invalid_credentials():
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "WrongPassword"
    })
    assert response.status_code == 401

def test_refresh_token_expired():
    # Create token, wait for expiry
    # Try to refresh
    # Should fail with 401
    
def test_logout_revokes_session():
    # Login
    # Logout
    # Try to use old token
    # Should fail with 401
```

### Integration Tests
```python
# test_auth_flow.py
def test_complete_auth_flow():
    # Register → Login → Use token → Refresh → Logout
    
def test_concurrent_sessions():
    # User logs in from 2 devices
    # Both sessions should work independently
    
def test_token_expiry_handling():
    # Make request with expiring token
    # Should get 401
    # Refresh and retry
    # Should succeed
```

---

## 14. Monitoring & Logging

### Audit Logging
```python
# Log all auth events
def log_auth_event(
    user_id: str,
    action: str,
    status: str,
    ip_address: str,
    user_agent: str
):
    audit_log.create(
        user_id=user_id,
        action=f"auth.{action}",
        resource_type="User",
        resource_id=user_id,
        status=status,
        ip_address=ip_address,
        user_agent=user_agent
    )
```

**Events**:
- `auth.register` - New user registration
- `auth.login_success` - Successful login
- `auth.login_failed` - Failed login attempt
- `auth.token_refresh` - Token refreshed
- `auth.logout` - User logged out
- `auth.session_revoked` - Session revoked

### Security Alerts
- Multiple failed logins (5+ in 15 min)
- Token refresh from new IP
- Logout from all devices triggered
- Password changed

---

## 15. Multi-Tenancy (Future)

### Tenant Support (Phase 3+)
```json
{
  "sub": "user-id",
  "tenant_id": "tenant-id",
  "email": "user@example.com",
  "roles": ["admin", "editor"],
  "permissions": ["tasks:read", "tasks:write"]
}
```

### Scope-based Access Control
```python
def require_permission(required_permission: str):
    async def verify_permission(token_payload = Depends(get_token)):
        if required_permission not in token_payload.get("permissions", []):
            raise HTTPException(status_code=403, detail="Permission denied")
        return token_payload
    return verify_permission
```
