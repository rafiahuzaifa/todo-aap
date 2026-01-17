# Install dependencies guide

## Backend Dependencies

```bash
cd backend/phase-2-web

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all dependencies
pip install -e ".[dev]"
```

### Core Dependencies:
- **FastAPI** 0.115.0 - Web framework
- **Uvicorn** 0.31.0 - ASGI server
- **SQLModel** 0.0.22 - ORM (Pydantic + SQLAlchemy)
- **asyncpg** 0.31.0 - PostgreSQL async driver
- **python-jose** 3.3.0 - JWT token handling
- **passlib** 1.7.4 - Password hashing
- **bcrypt** 4.1.4 - Password algorithm
- **pydantic** 2.10.5 - Data validation
- **python-multipart** 0.0.7 - Form data handling
- **email-validator** 2.2.0 - Email validation

### Development Dependencies:
- **pytest** 8.2.4 - Testing framework
- **pytest-asyncio** 0.25.0 - Async test support
- **httpx** 0.28.1 - HTTP test client

## Frontend Dependencies

```bash
cd frontend/phase-2-web

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Core Dependencies:
- **Next.js** 16.0.0 - React framework
- **React** 19.0.0 - UI library
- **TypeScript** 5.3.3 - Type safety
- **Tailwind CSS** 3.4.4 - Styling
- **Axios** 1.6.0 - HTTP client
- **Zustand** 4.4.0 - State management
- **NextAuth** 5.0.0 - Authentication

### Development Dependencies:
- **typescript** - Type checking
- **eslint** - Code linting
- **tailwindcss** - CSS framework

## Database Setup

### PostgreSQL (Docker)
```bash
docker run -d \
  --name evolution-postgres \
  -e POSTGRES_DB=evolution_todo \
  -e POSTGRES_USER=todo_user \
  -e POSTGRES_PASSWORD=todo_password \
  -p 5432:5432 \
  postgres:16-alpine
```

### PostgreSQL (Local)
```bash
# macOS
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Create Database
```bash
createdb -U postgres evolution_todo

# Or with psql
psql -U postgres
CREATE DATABASE evolution_todo;
```

## Verification

### Backend
```bash
cd backend/phase-2-web
source venv/bin/activate
pytest tests/ -v
```

Expected: All tests pass ✅

### Frontend
```bash
cd frontend/phase-2-web
npm run build
```

Expected: Build succeeds ✅

### Integration
```bash
# Terminal 1 - Backend
cd backend/phase-2-web
uvicorn src.main:app --reload

# Terminal 2 - Frontend
cd frontend/phase-2-web
npm run dev

# Terminal 3 - Test
curl http://localhost:8000/health
```

Expected: `{"status": "ok"}` ✅

## Troubleshooting

### Backend won't start
```bash
# Check Python version (3.11+)
python --version

# Check PostgreSQL connection
psql -U todo_user -h localhost -d evolution_todo

# Recreate venv if issues
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -e ".[dev]"
```

### Frontend build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isrunning

# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://todo_user:todo_password@localhost:5432/evolution_todo
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure database
3. ✅ Set environment variables
4. Run development servers
5. Start developing!
