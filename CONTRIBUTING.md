# Contributing Guide

## Development Setup

Follow [INSTALL.md](./INSTALL.md) for local setup.

## Code Style

### Python (Backend)

```python
# Follow PEP 8
# Line length: 100 characters max
# Type hints required for all functions

def create_task(title: str, priority: TaskPriority) -> TaskResponse:
    """Create a new task.
    
    Args:
        title: Task title
        priority: Task priority level
        
    Returns:
        Created task response
    """
    pass
```

Run linting:
```bash
cd backend/phase-2-web
black src/ tests/
flake8 src/ tests/
mypy src/
```

### TypeScript (Frontend)

```typescript
// Use TypeScript strict mode
// Interfaces for props
// Arrow functions preferred
// Comments for complex logic

interface TaskProps {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

const TaskComponent: React.FC<TaskProps> = ({ id, title, priority }) => {
  // Component implementation
};
```

## Testing

### Backend Tests

```python
# File: tests/api/test_tasks.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_task(client: AsyncClient, user_token: str):
    """Test creating a task"""
    response = await client.post(
        "/tasks",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"title": "Test", "priority": "high"}
    )
    assert response.status_code == 201
```

Run tests:
```bash
cd backend/phase-2-web
pytest tests/ -v --cov=src
```

### Frontend Tests

```typescript
// Use React Testing Library
import { render, screen } from '@testing-library/react';
import { TaskComponent } from '@/components/TaskComponent';

test('renders task title', () => {
  render(<TaskComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## Commit Messages

Follow conventional commits:

```
feat: add real-time notifications
fix: resolve WebSocket connection leak
docs: update API documentation
refactor: simplify task filtering logic
test: add integration tests for auth

Format: <type>(<scope>): <subject>
Types: feat, fix, docs, style, refactor, test, chore
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Add tests for new functionality
4. Update documentation
5. Commit with meaningful messages
6. Push to origin
7. Open Pull Request with description

### PR Title Format
```
[Phase/Component] Brief description
[Phase 3/WebSocket] Add real-time task sync
[Phase 2/Frontend] Fix login form validation
```

### PR Description Template
```markdown
## Description
Brief overview of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## Adding New Features

### Phase 2 Example: New API Endpoint

1. **Define schema** in `src/models/schemas.py`:
```python
class NewFeatureRead(SQLModel):
    id: UUID
    data: str
    created_at: datetime
```

2. **Create service** in `src/services/`:
```python
async def process_feature(data: str) -> NewFeatureRead:
    # Business logic
    pass
```

3. **Add endpoint** in `src/api/v1/endpoints/`:
```python
@router.post("/features")
async def create_feature(
    req: FeatureCreate,
    current_user: User = Depends(get_current_user)
) -> NewFeatureRead:
    return await feature_service.process_feature(req.data)
```

4. **Add tests** in `tests/api/`:
```python
@pytest.mark.asyncio
async def test_create_feature(client: AsyncClient):
    response = await client.post(
        "/features",
        headers={"Authorization": f"Bearer {token}"},
        json={"data": "test"}
    )
    assert response.status_code == 201
```

5. **Update docs** in [API.md](./docs/API.md)

### Phase 3 Example: WebSocket Handler

1. **Define message schema** in `src/models/schemas.py`:
```python
class WSMessage(BaseModel):
    type: str
    data: dict
    timestamp: datetime
```

2. **Add handler** in `src/api/v1/ws/__init__.py`:
```python
async def handle_task_update(
    manager: ConnectionManager,
    message: WSMessage
):
    await manager.broadcast(message.dict())
```

3. **Add frontend hook** in `src/hooks/`:
```typescript
export const useFeature = () => {
  // Hook implementation
};
```

## Database Migrations

### Phase 2: Auto-migrations
```bash
# SQLModel auto-creates tables on startup
# Just ensure DATABASE_URL is set
```

### Phase 3: Manual Migrations
```python
# For complex changes, create migration script
# File: backend/phase-2-web/src/migrations/001_add_feature.sql

ALTER TABLE tasks ADD COLUMN new_field VARCHAR;
CREATE INDEX idx_tasks_new_field ON tasks(new_field);
```

## Debugging

### Backend
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run with debugger
python -m pdb -m uvicorn src.main:app

# Or use VS Code debugger with launch.json
```

### Frontend
```bash
# Chrome DevTools
# F12 or Cmd+Option+I

# Zustand DevTools
import { useShallow } from 'zustand/react/shallow';

# React DevTools
# Install Chrome extension
```

### Database
```bash
# Connect to PostgreSQL
psql -U todo_user -h localhost -d evolution_todo

# Check tables
\dt

# Run queries
SELECT * FROM tasks WHERE user_id = 'uuid';
```

## Performance Optimization

### Backend
- Use database indexes on frequently queried fields
- Implement caching for expensive operations
- Use connection pooling (configured in SQLAlchemy)
- Profile with: `python -m cProfile -s cumtime src/main.py`

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Code-split with dynamic imports
- Profile with Chrome DevTools

## Documentation

- Update [README.md](../README.md) for major changes
- Update [API.md](./API.md) for endpoint changes
- Update [INSTALL.md](./INSTALL.md) for setup changes
- Add docstrings to all functions
- Include examples in complex areas

## Release Checklist

Before releasing:
- [ ] All tests passing
- [ ] No linting warnings
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Environment variables documented
- [ ] Database schema documented

## Questions?

1. Check existing documentation
2. Review similar existing code
3. Open discussion on GitHub
4. Create issue if bug found

---

Happy coding! 🚀
