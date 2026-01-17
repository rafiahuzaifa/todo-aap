# Phase 1 Quick Reference Guide

## Installation & Setup

```bash
# Navigate to project
cd backend/phase-1-console

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"
```

## Running the Application

```bash
# Start console application
python -m src.cli.console

# Example session:
# Choose command: A
# Title: My first task
# Description: This is a test
# SUCCESS: Task created
# Choose command: L
# Filter by status: [A]ll
# ... task list displayed ...
# Choose command: Q
# Goodbye!
```

## Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src

# Run specific test file
pytest tests/test_task_service.py -v

# Run specific test
pytest tests/test_task_model.py::TestTaskCreation::test_task_creation_with_all_fields -v
```

## Code Quality Checks

```bash
# Type checking
mypy src/ --ignore-missing-imports

# Expected: Success: no issues found in 13 source files
```

## Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 22 |
| Source Lines | ~400 SLOC |
| Test Lines | ~500 SLOC |
| Total Tests | 79 |
| Test Pass Rate | 100% |
| Code Coverage | 74.65% |
| Type Coverage | 100% |

## File Structure

```
src/
├── models/
│   └── task.py           # Task dataclass
├── services/
│   └── task_service.py   # CRUD operations
├── exceptions/
│   ├── validation_error.py
│   └── task_error.py
└── cli/
    ├── console.py        # Main menu
    ├── commands.py       # Command handlers
    ├── menu.py           # Menu display
    └── formatter.py      # Output formatting

tests/
├── test_task_model.py
├── test_task_service.py
├── test_cli_integration.py
├── test_e2e.py
└── conftest.py           # Fixtures
```

## API Reference

### TaskService

```python
from src.services import TaskService

service = TaskService()

# Create
task = service.create_task("Buy milk", "From grocery store")

# Read
task = service.get_task(task_id)
tasks = service.list_tasks(completed=False, sort_by="title")

# Update
updated = service.update_task(task_id, title="Buy milk and eggs")

# Delete
service.delete_task(task_id)

# List options
all_tasks = service.list_tasks()                      # All tasks
pending = service.list_tasks(completed=False)        # Pending only
completed = service.list_tasks(completed=True)       # Completed only
sorted_asc = service.list_tasks(sort_by="title", ascending=True)
sorted_desc = service.list_tasks(sort_by="created_at", ascending=False)
```

### Task Model

```python
from src.models import Task
from datetime import datetime

task = Task(
    id="uuid-string",
    title="Task title",
    description="Task description",
    completed=False,
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

# Serialization
dict_repr = task.to_dict()
json_str = task.to_json()

# Deserialization
task = Task.from_dict(dict_repr)
task = Task.from_json(json_str)
```

### Exception Handling

```python
from src.exceptions import ValidationError, TaskNotFoundError
from src.services import TaskService

service = TaskService()

try:
    task = service.create_task("")  # Invalid: empty title
except ValidationError as e:
    print(f"Validation error: {e}")

try:
    task = service.get_task("invalid-id")
except TaskNotFoundError as e:
    print(f"Task error: {e}")
```

## CLI Commands Reference

### [A] Add Task
```
Command: A
Title: Task title (required, 1-200 chars)
Description: Task description (optional, 0-2000 chars)
→ Creates new task with UUID
```

### [L] List Tasks
```
Command: L
Filter: [A]ll / [P]ending / [C]ompleted
→ Shows filtered task list with status, date
```

### [V] View Task
```
Command: V
Enter task ID: <UUID or first 8 chars>
→ Shows full task details (title, description, status, timestamps)
```

### [U] Update Task
```
Command: U
Enter task ID: <UUID>
New title: (press Enter to keep current)
New description: (press Enter to keep current)
→ Updates task with new values
```

### [D] Delete Task
```
Command: D
Enter task ID: <UUID>
Confirm: (y/n)
→ Permanently removes task
```

### [C] Complete Task
```
Command: C
Enter task ID: <UUID>
→ Marks task as completed (changes status to [X])
```

### [Q] Quit
```
Command: Q
→ Exits application (data lost - Phase 2 for persistence)
```

## Test Categories

### Unit Tests (16 tests)
- Task model creation
- Task serialization/deserialization
- Task immutability
- Equality comparison

### Service Tests (47 tests)
- Create: validation, uniqueness, constraints
- Read: retrieval, filtering, sorting
- Update: partial updates, timestamp management
- Delete: removal, error handling
- List: filter combinations, sort combinations

### Integration Tests (8 tests)
- Command handler workflows
- Input/output formatting
- Error message display
- User interaction flows

### E2E Tests (8 tests)
- Complete task workflows
- Multi-step operations
- Validation and recovery
- Bulk operations

## Troubleshooting

### Tests Fail
```bash
# Verify environment
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -e ".[dev]"

# Run specific test with verbose output
pytest tests/test_task_service.py::TestTaskServiceCreate -vv
```

### Type Errors
```bash
# Check type coverage
mypy src/ --ignore-missing-imports --show-error-codes

# Usually due to missing type hints in new code
# Add type hints: `def func(x: str) -> Task:`
```

### Import Errors
```bash
# Verify package is installed
python -c "from src.services import TaskService"

# Reinstall if needed
pip install -e .
```

## Performance Tips

### For 1000+ Tasks
1. Consider Phase 2 (database) for better performance
2. Implement pagination in list_tasks()
3. Add indexing for sort_by fields
4. Consider caching frequently accessed tasks

### For Concurrent Access
1. Phase 1 is single-threaded (uses dict)
2. Phase 2 will use database with proper locking
3. Phase 3 will add REST API with async support

## Common Workflows

### Workflow: Add and Complete Task
```python
from src.services import TaskService

service = TaskService()
task = service.create_task("Buy milk")
updated = service.update_task(task.id, completed=True)
print(f"Task {task.id} completed!")
```

### Workflow: List Pending Tasks Sorted by Title
```python
from src.services import TaskService

service = TaskService()
pending = service.list_tasks(
    completed=False,
    sort_by="title",
    ascending=True
)
for task in pending:
    print(f"- {task.title}")
```

### Workflow: Find and Update Task
```python
from src.services import TaskService
from src.exceptions import TaskNotFoundError

service = TaskService()
try:
    task = service.get_task(task_id)
    updated = service.update_task(
        task_id,
        title="New title",
        description="New description"
    )
except TaskNotFoundError:
    print(f"Task {task_id} not found")
```

## Resources

- **Specifications**: `specs/features/task-crud.md`, `specs/cli/console.md`, `specs/tests/phase1-tests.md`
- **Main README**: `backend/phase-1-console/README.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY_PHASE1.md`
- **Source Code**: `backend/phase-1-console/src/`
- **Tests**: `backend/phase-1-console/tests/`

## Contact & Support

- Review specifications for detailed requirements
- Check test cases for implementation examples
- Run full test suite to verify environment
- Check README for additional documentation

---

**Quick Stats**: 22 files | 79 tests | 74.65% coverage | 100% type safe | 0 errors
