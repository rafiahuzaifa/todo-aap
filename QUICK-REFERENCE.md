# Evolution of Todo - Quick Reference Card

## 🚀 One-Line Setup
```bash
# Mac/Linux
chmod +x setup.sh && ./setup.sh

# Windows
setup.bat

# Docker (easiest)
docker-compose up -d
```

## 📍 Key URLs
| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Demo credentials |
| Backend API | http://localhost:8000 | JWT tokens |
| API Docs | http://localhost:8000/docs | Auto-generated |
| Database | postgresql://localhost:5432 | todo_user / todo_password |

## 📁 Important Files
| Path | Purpose |
|------|---------|
| `README.md` | Project overview |
| `docs/API.md` | API reference |
| `docs/INSTALL.md` | Setup guide |
| `CONTRIBUTING.md` | Dev guidelines |
| `docker-compose.yml` | Full stack in one file |

## 🔑 API Tokens
```bash
# Login to get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Use in requests
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/v1/tasks
```

## 🧪 Test Commands
```bash
# Backend tests
cd backend/phase-2-web
pytest tests/ -v --cov=src

# Frontend build
cd frontend/phase-2-web
npm run build

# Full stack health check
curl http://localhost:8000/health
```

## 🛠️ Common Tasks

### Create a Task
```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task desc",
    "priority": "high"
  }'
```

### List Tasks
```bash
curl -X GET "http://localhost:8000/api/v1/tasks?limit=10" \
  -H "Authorization: Bearer <token>"
```

### Search Tasks
```bash
curl -X GET "http://localhost:8000/api/v1/search?q=keyword" \
  -H "Authorization: Bearer <token>"
```

### Get Statistics
```bash
curl -X GET http://localhost:8000/api/v1/stats/dashboard \
  -H "Authorization: Bearer <token>"
```

## 📊 Database Quick Reference
```sql
-- Connect
psql -U todo_user -h localhost -d evolution_todo

-- List tables
\dt

-- Check user tasks
SELECT * FROM task WHERE user_id = '<uuid>';

-- Delete everything (careful!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Change `--port 9000` in uvicorn command |
| Port 3000 in use | Change `PORT=9000` before `npm run dev` |
| DB connection fails | Check PostgreSQL running: `psql --version` |
| Venv not activating | Use full path: `source venv/bin/activate` |
| Dependencies fail | Try: `pip install --upgrade pip` then retry |

## 📱 Frontend Components
```typescript
// Main pages
- src/app/page.tsx          // Landing
- src/app/login/page.tsx    // Login
- src/app/dashboard/page.tsx // Main app

// Components
- TaskList.tsx              // Task display
- CreateTaskForm.tsx        // Create task
- Header.tsx                // Navigation
```

## 🔌 Backend Endpoints
```
Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout
  GET    /auth/me

Tasks:
  GET    /tasks
  POST   /tasks
  PUT    /tasks/{id}
  DELETE /tasks/{id}

Stats:
  GET    /stats/summary
  GET    /stats/trends

Real-Time:
  WS     /ws
  GET    /search
```

## 🗂️ Directory Structure
```
HACKATHON2/
├── backend/phase-2-web/     # FastAPI backend
├── frontend/phase-2-web/    # Next.js frontend
├── docs/                    # Documentation
├── docker-compose.yml       # Stack orchestration
├── setup.sh / setup.bat     # Setup scripts
└── README.md               # Main overview
```

## 🔐 Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📚 Documentation
| Doc | Lines | Purpose |
|-----|-------|---------|
| API.md | 500+ | Full API reference |
| INSTALL.md | 250+ | Setup instructions |
| PHASE3-SPEC.md | 3,500+ | Advanced features |
| README.md | 400+ | Project overview |

## 🚢 Deployment (Docker)
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 📦 Key Technologies
| Layer | Tech | Version |
|-------|------|---------|
| Frontend | Next.js | 16.0 |
| Backend | FastAPI | 0.115 |
| Database | PostgreSQL | 16 |
| ORM | SQLModel | 0.0.22 |
| State | Zustand | 4.4 |
| Styling | Tailwind | 3.4 |

## 💡 Tips
- Use `--reload` flag in uvicorn for hot reload
- Check `http://localhost:8000/docs` for interactive API docs
- Frontend auto-refreshes on file changes
- Database persists between Docker restarts
- Use `pytest -k "test_name"` to run specific tests

## 🆘 Get Help
1. Read relevant doc in `docs/` folder
2. Check API documentation at `/docs` endpoint
3. Review code examples in existing tests
4. Check CONTRIBUTING.md for patterns

---
**Version:** Phase 3 Complete | **Updated:** Latest Session
