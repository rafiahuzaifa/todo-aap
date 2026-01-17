# Phase 2: Deployment Specification

**Status**: READY  
**Container**: Docker  
**Orchestration**: Docker Compose (local), Kubernetes (Phase 3+)  
**CI/CD**: GitHub Actions  

---

## 1. Overview

### Deployment Architecture

```
Developer
    ↓
Push to GitHub
    ↓
GitHub Actions CI/CD
    ├─ Run tests
    ├─ Build Docker images
    ├─ Push to registry
    └─ Deploy to production
    ↓
Production Environment
    ├─ Backend (FastAPI + Uvicorn)
    ├─ Frontend (Next.js on Vercel or self-hosted)
    ├─ Database (Neon PostgreSQL)
    └─ Reverse proxy (Nginx)
```

---

## 2. Docker Configuration

### 2.1 Backend Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
# Build stage
FROM python:3.13-slim as builder

WORKDIR /build

# Install uv package manager
RUN pip install uv

# Copy project files
COPY pyproject.toml uv.lock ./

# Create virtual environment
RUN uv venv /opt/venv
RUN /opt/venv/bin/uv pip install -e .

# Runtime stage
FROM python:3.13-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY backend/ .

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build & Run**:
```bash
docker build -t evolution-todo-backend:latest -f backend/Dockerfile .
docker run -p 8000:8000 -e DATABASE_URL=postgresql://... evolution-todo-backend:latest
```

---

### 2.2 Frontend Dockerfile

**File**: `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /build

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ .

# Build Next.js
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /build/node_modules ./node_modules

# Copy built application
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/public ./public
COPY --from=builder /build/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=https://api.example.com

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
```

**Build & Run**:
```bash
docker build -t evolution-todo-frontend:latest -f frontend/Dockerfile .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 evolution-todo-frontend:latest
```

---

### 2.3 Nginx Configuration (Reverse Proxy)

**File**: `docker/nginx/nginx.conf`

```nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

---

## 3. Docker Compose

### 3.1 Local Development

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: evolution-todo-db
    environment:
      POSTGRES_USER: ${DB_USER:-todouser}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-todopass}
      POSTGRES_DB: ${DB_NAME:-evolution_todo_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: evolution-todo-backend
    environment:
      DATABASE_URL: postgresql://${DB_USER:-todouser}:${DB_PASSWORD:-todopass}@postgres:5432/${DB_NAME:-evolution_todo_db}
      AUTH_SECRET: ${AUTH_SECRET:-dev_secret_key_min_32_chars}
      JWT_SECRET: ${JWT_SECRET:-dev_jwt_secret_key_min_32_chars}
      ENV: development
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: evolution-todo-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
      NODE_ENV: development
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - backend
    command: npm run dev

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: evolution-todo-proxy
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:

networks:
  default:
    name: evolution-todo-network
```

**Commands**:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

---

## 4. Environment Configuration

### 4.1 Environment Variables

**File**: `.env` (local development)

```env
# Database
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/evolution_todo_db
DB_USER=todouser
DB_PASSWORD=todopass
DB_NAME=evolution_todo_db

# Backend
AUTH_SECRET=dev_secret_key_min_32_chars_exactly
JWT_SECRET=dev_jwt_secret_key_min_32_chars_exactly
JWT_EXPIRY=86400
JWT_REFRESH_EXPIRY=2592000
ENV=development
LOG_LEVEL=debug

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_LOG_LEVEL=debug

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**File**: `.env.production` (production)

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neon_user:password@neon-host.neon.tech:5432/evolution_todo_db?sslmode=require

# Backend
AUTH_SECRET=production_secret_key_min_32_chars_must_be_different
JWT_SECRET=production_jwt_secret_key_min_32_chars_must_be_different
JWT_EXPIRY=86400
JWT_REFRESH_EXPIRY=2592000
ENV=production
LOG_LEVEL=info

# Frontend
NEXT_PUBLIC_API_URL=https://api.evolution-todo.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_LOG_LEVEL=warn

# OAuth
GOOGLE_CLIENT_ID=production_google_client_id
GOOGLE_CLIENT_SECRET=production_google_client_secret
GITHUB_CLIENT_ID=production_github_client_id
GITHUB_CLIENT_SECRET=production_github_client_secret
```

---

## 5. GitHub Actions CI/CD

### 5.1 Test & Build Pipeline

**File**: `.github/workflows/test-build.yml`

```yaml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Backend Tests
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.13'

      - name: Install dependencies
        run: |
          pip install uv
          cd backend
          uv venv
          source .venv/bin/activate
          uv pip install -e ".[dev]"

      - name: Run tests
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
        run: |
          cd backend
          source .venv/bin/activate
          pytest --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml

      - name: Type check
        run: |
          cd backend
          source .venv/bin/activate
          mypy src --strict

  # Frontend Tests
  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Lint
        run: |
          cd frontend
          npm run lint

      - name: Type check
        run: |
          cd frontend
          npm run type-check

      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage

  # Build Docker Images
  build:
    needs: [backend-tests, frontend-tests]
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./backend/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/evolution-todo-backend:latest
            ${{ secrets.DOCKER_REGISTRY }}/evolution-todo-backend:${{ github.sha }}

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: |
            ${{ secrets.DOCKER_REGISTRY }}/evolution-todo-frontend:latest
            ${{ secrets.DOCKER_REGISTRY }}/evolution-todo-frontend:${{ github.sha }}
```

---

### 5.2 Deploy Pipeline

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
            cd /app/evolution-todo
            git pull origin main
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend alembic upgrade head
          EOF

      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 6. Database Migrations

### 6.1 Alembic Setup

**File**: `backend/alembic.ini`

```ini
[alembic]
sqlalchemy.url = driver://user:pass@localhost/dbname

[loggers]
keys = root,sqlalchemy

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### 6.2 Migration on Deploy

```bash
# Run migrations before starting application
docker-compose exec backend alembic upgrade head

# Or in Docker entrypoint
#!/bin/bash
set -e

echo "Running migrations..."
alembic upgrade head

echo "Starting application..."
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 7. Monitoring & Logging

### 7.1 Health Checks

**Backend Health Endpoint**:
```python
@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": await check_database_connection(),
    }
```

### 7.2 Logging Configuration

**File**: `backend/logging.yaml`

```yaml
version: 1
disable_existing_loggers: false

formatters:
  default:
    format: '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
  json:
    format: '{"time": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}'

handlers:
  console:
    class: logging.StreamHandler
    level: DEBUG
    formatter: default
    stream: ext://sys.stdout

  file:
    class: logging.handlers.RotatingFileHandler
    level: INFO
    formatter: json
    filename: logs/app.log
    maxBytes: 10485760  # 10MB
    backupCount: 5

root:
  level: INFO
  handlers: [console, file]

loggers:
  uvicorn:
    level: INFO
  fastapi:
    level: DEBUG
```

---

## 8. Performance Optimization

### 8.1 Caching

**Redis Setup** (optional for Phase 2b):
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

**Backend Integration**:
```python
from redis import Redis
from functools import wraps

redis_client = Redis(host='redis', port=6379, decode_responses=True)

def cached(ttl: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            cached_value = redis_client.get(cache_key)
            
            if cached_value:
                return json.loads(cached_value)
            
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## 9. Security Considerations

### 9.1 SSL/TLS Certificates

**Let's Encrypt with Certbot**:
```bash
docker run --rm --it \
  -v /path/to/certs:/etc/letsencrypt \
  -v /path/to/www:/var/www \
  certbot/certbot \
  certonly --webroot -w /var/www -d example.com
```

### 9.2 Secrets Management

**GitHub Secrets**:
- `DOCKER_REGISTRY` - Docker registry URL
- `DOCKER_USERNAME` - Docker registry username
- `DOCKER_PASSWORD` - Docker registry password
- `DEPLOY_KEY` - SSH private key for deployment
- `DEPLOY_HOST` - Production server hostname
- `DEPLOY_USER` - SSH user for deployment
- `SLACK_WEBHOOK` - Slack webhook for notifications

---

## 10. Rollback Strategy

### 10.1 Version Tagging

```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Create release
docker build -t evolution-todo-backend:v1.0.0 .
```

### 10.2 Rollback Process

```bash
# SSH to production
ssh user@host

# Stop current deployment
docker-compose down

# Check out previous tag
git checkout v0.9.0

# Restore previous image
docker pull registry/evolution-todo-backend:v0.9.0

# Restart services
docker-compose up -d
```

---

## 11. Backup & Disaster Recovery

### 11.1 Database Backups

**Automated Backup**:
```bash
# Daily backup (3AM UTC)
0 3 * * * docker-compose exec -T postgres pg_dump -U $DB_USER $DB_NAME | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

**Backup to Cloud** (S3):
```bash
aws s3 cp /backups/db-$(date +%Y%m%d).sql.gz s3://backup-bucket/evolution-todo/
```

### 11.2 Recovery Procedure

```bash
# Restore from backup
gunzip < /backups/db-20240101.sql.gz | docker-compose exec -T postgres psql -U $DB_USER $DB_NAME

# Verify restore
docker-compose exec postgres psql -U $DB_USER $DB_NAME -c "SELECT COUNT(*) FROM users;"
```

---

## 12. Scaling Strategy (Phase 3+)

### 12.1 Horizontal Scaling

**Load Balancing**:
```nginx
upstream backend {
    server backend-1:8000;
    server backend-2:8000;
    server backend-3:8000;
}
```

### 12.2 Database Scaling

- Read replicas (Neon built-in)
- Connection pooling (PgBouncer)
- Caching layer (Redis)

---

## 13. Deployment Checklist

- [ ] All tests passing
- [ ] Docker images build successfully
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] SSL certificates valid
- [ ] Health checks configured
- [ ] Monitoring alerts set up
- [ ] Backups configured
- [ ] Rollback procedure documented
- [ ] Team notified
