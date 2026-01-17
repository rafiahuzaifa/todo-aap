# SPECIFICATION: Task CRUD Operations

**Specification Name:** Task CRUD Operations  
**Specification ID:** task-crud  
**Version:** 1.0.0  
**Phase:** 1 (Console)  
**Status:** READY  
**Author:** AI Code Generator  
**Created:** January 17, 2026  
**Modified:** January 17, 2026  

---

## 1. OVERVIEW

This specification defines the core CRUD (Create, Read, Update, Delete) operations for Task entities in the Evolution of Todo application. These operations form the foundation of all phases and establish the domain model that evolves throughout the project.

### Scope

- Task creation with automatic ID generation
- Task property mutations (title, description, completion status)
- Task deletion from the in-memory store
- Task query and retrieval operations
- Data consistency and validation

### Out of Scope

- Persistence to disk (covered by storage specification)
- Authentication and authorization (Phase 2)
- Multi-user support (Phase 2)
- Task relationships or subtasks (future phases)

---

## 2. DATA MODEL

### 2.1 Task Entity

The Task entity represents a single todo item. All Task instances are immutable once created (functional paradigm preferred).

```python
class Task:
    """
    Represents a single todo item.
    
    Attributes:
        id (str): Unique identifier, auto-generated as UUID
        title (str): Task title (1-200 characters)
        description (str): Optional task details (0-2000 characters)
        completed (bool): Completion status (default: False)
        created_at (datetime): ISO 8601 timestamp of creation
        updated_at (datetime): ISO 8601 timestamp of last modification
    """
    id: str                    # UUID format
    title: str                 # Non-empty, max 200 chars
    description: str           # Optional, max 2000 chars
    completed: bool            # True | False
    created_at: datetime       # UTC timezone
    updated_at: datetime       # UTC timezone
```

### 2.2 Task Constraints

| Constraint | Rule | Violation Behavior |
|-----------|------|-------------------|
| ID | Must be unique UUID v4 | Reject creation |
| Title | 1-200 characters, non-empty, non-whitespace | Raise ValidationError |
| Description | 0-2000 characters, optional | Raise ValidationError |
| Completed | Boolean (True/False) | Raise ValidationError |
| created_at | Read-only, set at creation, UTC | Prevent modification |
| updated_at | Set at creation, updated on every modification | Auto-managed |

### 2.3 Task Serialization

Tasks must be serializable to/from JSON for storage:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project specification",
  "description": "Define all requirements for Phase 1 Console application",
  "completed": false,
  "created_at": "2026-01-17T10:30:00Z",
  "updated_at": "2026-01-17T10:30:00Z"
}
```

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Create Task

**Requirement:** FR-CRUD-001-CREATE

Create a new Task with provided title and optional description.

#### Preconditions
- Title is valid (1-200 characters, non-empty)
- Description is valid (0-2000 characters) if provided

#### Input Parameters
```python
def create_task(
    title: str,                           # Required
    description: str = ""                 # Optional, default empty
) -> Task:
    """Create a new Task with auto-generated ID."""
```

#### Processing Steps
1. Validate title: non-empty, 1-200 characters
2. Validate description: optional, 0-2000 characters
3. Generate UUID v4 for task ID
4. Create Task instance with:
   - id = generated UUID
   - title = provided title
   - description = provided description
   - completed = False
   - created_at = current UTC datetime
   - updated_at = current UTC datetime
5. Return Task instance

#### Output
- Task object with populated fields

#### Error Handling
| Error | Cause | Response |
|-------|-------|----------|
| ValidationError | Title empty or > 200 chars | Raise with message: "Title must be 1-200 characters" |
| ValidationError | Description > 2000 chars | Raise with message: "Description must be 0-2000 characters" |
| ValidationError | Title is whitespace-only | Raise with message: "Title cannot be whitespace only" |

#### Examples
```python
# Valid creation
task1 = create_task("Buy groceries")
# Result: Task(id="...", title="Buy groceries", description="", completed=False, ...)

# Valid creation with description
task2 = create_task(
    "Project deadline",
    "Complete Phase 1 specifications by end of week"
)
# Result: Task(id="...", title="Project deadline", description="...", completed=False, ...)

# Invalid creation - empty title
create_task("")
# Raises: ValidationError("Title must be 1-200 characters")

# Invalid creation - title too long
create_task("x" * 201)
# Raises: ValidationError("Title must be 1-200 characters")
```

---

### 3.2 Update Task

**Requirement:** FR-CRUD-002-UPDATE

Update an existing Task's title, description, or completion status.

#### Preconditions
- Task exists in store
- At least one field is provided for update
- New values pass validation

#### Input Parameters
```python
def update_task(
    task_id: str,                         # Required
    title: str = None,                    # Optional
    description: str = None,              # Optional
    completed: bool = None                # Optional
) -> Task:
    """Update Task properties."""
```

#### Processing Steps
1. Validate task_id format (UUID v4)
2. Retrieve Task from store by ID (fail if not found)
3. For each provided parameter:
   - Validate new value
   - Update Task field
4. Set updated_at = current UTC datetime
5. Return updated Task instance

#### Output
- Updated Task object

#### Error Handling
| Error | Cause | Response |
|-------|-------|----------|
| TaskNotFoundError | Task ID not in store | Raise with message: "Task not found: {id}" |
| ValidationError | Title empty or > 200 chars | Raise with message: "Title must be 1-200 characters" |
| ValidationError | Description > 2000 chars | Raise with message: "Description must be 0-2000 characters" |
| ValidationError | Invalid task_id format | Raise with message: "Invalid task ID format" |

#### Examples
```python
# Update title
updated = update_task("550e8400...", title="New title")
# Result: Task with new title and updated_at timestamp

# Update description
updated = update_task("550e8400...", description="Updated description")
# Result: Task with new description and updated_at timestamp

# Mark as complete
updated = update_task("550e8400...", completed=True)
# Result: Task with completed=True and updated_at timestamp

# Update multiple fields
updated = update_task(
    "550e8400...",
    title="Updated title",
    description="Updated description",
    completed=True
)
# Result: Task with all fields updated and updated_at timestamp

# Task not found
update_task("invalid-id")
# Raises: TaskNotFoundError("Task not found: invalid-id")
```

---

### 3.3 Delete Task

**Requirement:** FR-CRUD-003-DELETE

Remove a Task from the store permanently.

#### Preconditions
- Task exists in store

#### Input Parameters
```python
def delete_task(task_id: str) -> None:
    """Delete Task by ID."""
```

#### Processing Steps
1. Validate task_id format (UUID v4)
2. Retrieve Task from store by ID (fail if not found)
3. Remove Task from store
4. Return success (None)

#### Output
- None (side effect: Task removed from store)

#### Error Handling
| Error | Cause | Response |
|-------|-------|----------|
| TaskNotFoundError | Task ID not in store | Raise with message: "Task not found: {id}" |
| ValidationError | Invalid task_id format | Raise with message: "Invalid task ID format" |

#### Examples
```python
# Delete existing task
delete_task("550e8400...")
# Result: Task removed from store

# Delete non-existent task
delete_task("invalid-id")
# Raises: TaskNotFoundError("Task not found: invalid-id")
```

---

### 3.4 List Tasks

**Requirement:** FR-CRUD-004-LIST

Retrieve all Tasks from the store, optionally filtered.

#### Preconditions
- At least zero Tasks exist in store (store may be empty)

#### Input Parameters
```python
def list_tasks(
    completed: bool = None,               # Optional filter
    sort_by: str = "created_at",          # Sort field (created_at|title|updated_at)
    ascending: bool = True                # Sort direction
) -> List[Task]:
    """List Tasks from store with optional filtering."""
```

#### Processing Steps
1. If completed filter provided, validate it's boolean
2. If sort_by provided, validate it's in allowed values (created_at, title, updated_at)
3. Retrieve all Tasks from store
4. Apply completion filter if provided:
   - completed=True: return only tasks where completed==True
   - completed=False: return only tasks where completed==False
   - completed=None: return all tasks
5. Sort by specified field and direction
6. Return list of Task objects

#### Output
- List of Task objects (may be empty)

#### Error Handling
| Error | Cause | Response |
|-------|-------|----------|
| ValidationError | sort_by not in allowed values | Raise with message: "sort_by must be one of: created_at, title, updated_at" |
| ValidationError | completed is not boolean | Raise with message: "completed must be True, False, or None" |

#### Examples
```python
# List all tasks
tasks = list_tasks()
# Result: [Task(...), Task(...), ...]

# List only completed tasks
completed = list_tasks(completed=True)
# Result: [Task(completed=True), Task(completed=True), ...]

# List incomplete tasks sorted by title
incomplete = list_tasks(completed=False, sort_by="title")
# Result: [Task(title="A..."), Task(title="B..."), ...]

# List all tasks sorted by updated_at descending
recent = list_tasks(sort_by="updated_at", ascending=False)
# Result: [Task(most recent), Task(...), Task(oldest)]

# Empty store
tasks = list_tasks()
# Result: []
```

---

### 3.5 Get Task

**Requirement:** FR-CRUD-005-GET

Retrieve a single Task by ID.

#### Preconditions
- Task may or may not exist in store

#### Input Parameters
```python
def get_task(task_id: str) -> Task:
    """Retrieve a single Task by ID."""
```

#### Processing Steps
1. Validate task_id format (UUID v4)
2. Search store for Task with matching ID
3. Return Task if found, raise error if not found

#### Output
- Task object if found

#### Error Handling
| Error | Cause | Response |
|-------|-------|----------|
| TaskNotFoundError | Task ID not in store | Raise with message: "Task not found: {id}" |
| ValidationError | Invalid task_id format | Raise with message: "Invalid task ID format" |

#### Examples
```python
# Get existing task
task = get_task("550e8400...")
# Result: Task(...)

# Get non-existent task
get_task("invalid-id")
# Raises: TaskNotFoundError("Task not found: invalid-id")
```

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance

| Operation | Target | Notes |
|-----------|--------|-------|
| create_task() | < 5ms | UUID generation + object creation |
| update_task() | < 5ms | Single object lookup + update |
| delete_task() | < 5ms | Object removal from in-memory store |
| list_tasks() | < 50ms | For 1000 tasks, full scan + sort |
| get_task() | < 5ms | Single object lookup |

### 4.2 Reliability

- All Task CRUD operations are atomic
- No partial updates (all-or-nothing)
- Errors never leave store in inconsistent state

### 4.3 Type Safety

- All Python code uses type hints (PEP 484)
- Type checking with mypy in strict mode
- No implicit `Any` types
- Runtime type validation for user inputs

---

## 5. DEPENDENCIES

### Specification Dependencies
- None (foundational specification)

### External Dependencies
- Python 3.13+ standard library only
- uuid (stdlib) — UUID generation
- datetime (stdlib) — Timestamp management
- typing (stdlib) — Type hints

---

## 6. ACCEPTANCE CRITERIA

- ✅ create_task() creates Task with all required fields
- ✅ create_task() validates title and description
- ✅ create_task() generates unique UUIDs
- ✅ update_task() modifies only specified fields
- ✅ update_task() raises TaskNotFoundError for missing tasks
- ✅ update_task() validates all input parameters
- ✅ update_task() updates timestamps correctly
- ✅ delete_task() removes Task from store
- ✅ delete_task() raises TaskNotFoundError for missing tasks
- ✅ list_tasks() returns all tasks when no filter provided
- ✅ list_tasks() filters by completion status when specified
- ✅ list_tasks() sorts by requested field and direction
- ✅ list_tasks() handles empty store gracefully
- ✅ get_task() retrieves correct Task by ID
- ✅ get_task() raises TaskNotFoundError for missing tasks
- ✅ All operations execute within performance targets
- ✅ 100% type coverage with mypy strict mode
- ✅ All error messages are descriptive and actionable

---

## 7. GENERATED ARTIFACTS

These artifacts will be generated by Spec-Kit Plus:

```
backend/phase-1-console/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py                 # Task data class
│   ├── exceptions/
│   │   ├── __init__.py
│   │   ├── validation_error.py     # ValidationError exception
│   │   └── task_error.py           # TaskNotFoundError exception
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py         # TaskService with CRUD operations
│   └── __init__.py
└── tests/
    ├── __init__.py
    ├── test_task_model.py          # Task model tests
    └── test_task_service.py        # TaskService CRUD tests
```

---

## 8. IMPLEMENTATION NOTES

### Design Patterns
- **Value Object Pattern** — Task is immutable after creation
- **Exception-based Error Handling** — Errors raise typed exceptions
- **Functional Paradigm** — Pure functions with no side effects (except store mutation)

### Python Standards
- Follow PEP 8 style guide
- Use type hints for all parameters and returns
- Use dataclasses or NamedTuple for Task entity
- Generate comprehensive docstrings (Google style)
- No mutable default arguments

### Store Implementation
Store is abstracted but defaults to in-memory dictionary:
```python
_tasks: Dict[str, Task] = {}
```

---

## 9. AMENDMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 17, 2026 | Initial specification |

---

**Specification v1.0.0 — Ready for Code Generation**
