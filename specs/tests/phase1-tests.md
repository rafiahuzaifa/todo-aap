# SPECIFICATION: Phase 1 Test Suite

**Specification Name:** Phase 1 Test Suite  
**Specification ID:** phase1-tests  
**Version:** 1.0.0  
**Phase:** 1 (Console)  
**Status:** READY  
**Author:** AI Code Generator  
**Created:** January 17, 2026  
**Modified:** January 17, 2026  

---

## 1. OVERVIEW

This specification defines comprehensive test coverage for Phase 1 (Console Todo Application). Tests verify correctness of the Task CRUD operations and CLI interface through unit, integration, and end-to-end testing.

### Scope

- Unit tests for Task model
- Unit tests for TaskService CRUD operations
- Unit tests for CLI command handlers
- Integration tests for CLI workflows
- End-to-end tests for complete user journeys

### Out of Scope

- Performance benchmarking (separate specification)
- Load testing (future phases)
- UI rendering tests (covered by CLI tests)

---

## 2. TEST STRATEGY

### 2.1 Testing Pyramid

```
         E2E Tests
        (10 tests)
         /     \
    Integration Tests
      (30 tests)
       /       \
    Unit Tests
    (100+ tests)
```

### 2.2 Coverage Requirements

| Category | Target | Minimum |
|----------|--------|---------|
| Line Coverage | 95% | 85% |
| Branch Coverage | 90% | 80% |
| Function Coverage | 100% | 90% |
| Type Coverage | 95% | 90% |

### 2.3 Test Framework

- **Framework:** pytest v7.4+
- **Fixtures:** pytest fixtures for setup/teardown
- **Mocking:** unittest.mock for external dependencies
- **Coverage:** pytest-cov for coverage reports
- **TypeScript Checks:** mypy for type validation

### 2.4 Test Execution

```bash
# Run all tests
pytest -v

# Run with coverage report
pytest --cov=backend/phase-1-console/src --cov-report=html

# Run specific test file
pytest tests/test_task_service.py

# Run tests matching pattern
pytest -k "test_create" -v
```

---

## 3. UNIT TESTS

### 3.1 Task Model Tests

**File:** `backend/phase-1-console/tests/test_task_model.py`

Test the Task data class initialization, properties, and serialization.

#### Test Cases

##### test_create_task_with_all_fields
**Objective:** Verify Task creation with all fields provided

```python
def test_create_task_with_all_fields():
    """Should create Task with all fields populated"""
    task = Task(
        id="550e8400-e29b-41d4-a716-446655440000",
        title="Test Task",
        description="Test Description",
        completed=False,
        created_at=datetime(2026, 1, 17, 10, 30, 0),
        updated_at=datetime(2026, 1, 17, 10, 30, 0)
    )
    
    assert task.id == "550e8400-e29b-41d4-a716-446655440000"
    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.completed is False
    assert task.created_at.year == 2026
    assert task.updated_at.year == 2026
```

**Assertions:**
- All fields assigned correctly
- No field mutations
- Types preserved

---

##### test_task_serialization_to_dict
**Objective:** Verify Task serializes to dictionary for storage

```python
def test_task_serialization_to_dict():
    """Should serialize Task to dictionary"""
    task = Task(...)
    task_dict = task.to_dict()
    
    assert isinstance(task_dict, dict)
    assert task_dict["id"] == task.id
    assert task_dict["title"] == task.title
    assert "created_at" in task_dict
```

**Assertions:**
- Dict contains all fields
- Types correct in dict
- No extra fields

---

##### test_task_deserialization_from_dict
**Objective:** Verify Task deserializes from dictionary

```python
def test_task_deserialization_from_dict():
    """Should deserialize Task from dictionary"""
    data = {
        "id": "550e8400...",
        "title": "Test Task",
        "description": "Description",
        "completed": False,
        "created_at": "2026-01-17T10:30:00Z",
        "updated_at": "2026-01-17T10:30:00Z"
    }
    
    task = Task.from_dict(data)
    assert task.title == "Test Task"
```

**Assertions:**
- Deserialized fields match original
- Timestamps parsed correctly
- All fields present

---

##### test_task_json_serialization
**Objective:** Verify Task serializes to/from JSON

```python
def test_task_json_serialization():
    """Should serialize Task to JSON and back"""
    task = Task(...)
    json_str = task.to_json()
    task_restored = Task.from_json(json_str)
    
    assert task_restored.id == task.id
    assert task_restored.title == task.title
```

**Assertions:**
- Round-trip serialization works
- No data loss
- JSON is valid

---

### 3.2 TaskService CRUD Tests

**File:** `backend/phase-1-console/tests/test_task_service.py`

Test all CRUD operations of TaskService.

#### Create Operation Tests

##### test_create_task_valid
**Objective:** Verify successful task creation

```python
def test_create_task_valid():
    """Should create task with valid inputs"""
    service = TaskService()
    task = service.create_task("Buy groceries", "Milk, bread, eggs")
    
    assert task.id is not None
    assert task.title == "Buy groceries"
    assert task.description == "Milk, bread, eggs"
    assert task.completed is False
```

**Assertions:**
- Task ID auto-generated
- Fields assigned correctly
- completed defaults to False

---

##### test_create_task_empty_title
**Objective:** Verify validation rejects empty title

```python
def test_create_task_empty_title():
    """Should reject empty title"""
    service = TaskService()
    
    with pytest.raises(ValidationError) as exc_info:
        service.create_task("", "Description")
    
    assert "Title must be 1-200 characters" in str(exc_info.value)
```

**Assertions:**
- ValidationError raised
- Error message is descriptive
- Task not created

---

##### test_create_task_title_too_long
**Objective:** Verify validation rejects overly long title

```python
def test_create_task_title_too_long():
    """Should reject title > 200 characters"""
    service = TaskService()
    long_title = "x" * 201
    
    with pytest.raises(ValidationError):
        service.create_task(long_title, "Description")
```

**Assertions:**
- ValidationError raised
- Task not created

---

##### test_create_task_whitespace_only_title
**Objective:** Verify validation rejects whitespace-only title

```python
def test_create_task_whitespace_only_title():
    """Should reject whitespace-only title"""
    service = TaskService()
    
    with pytest.raises(ValidationError):
        service.create_task("   \t  \n", "Description")
```

**Assertions:**
- ValidationError raised
- Task not created

---

##### test_create_task_description_too_long
**Objective:** Verify validation rejects overly long description

```python
def test_create_task_description_too_long():
    """Should reject description > 2000 characters"""
    service = TaskService()
    long_desc = "x" * 2001
    
    with pytest.raises(ValidationError):
        service.create_task("Title", long_desc)
```

**Assertions:**
- ValidationError raised
- Task not created

---

##### test_create_task_minimal
**Objective:** Verify task creation with title only

```python
def test_create_task_minimal():
    """Should create task with title only"""
    service = TaskService()
    task = service.create_task("Buy milk")
    
    assert task.title == "Buy milk"
    assert task.description == ""
    assert task.completed is False
```

**Assertions:**
- Task created successfully
- Description defaults to empty string
- Minimal input accepted

---

#### Update Operation Tests

##### test_update_task_title
**Objective:** Verify successful title update

```python
def test_update_task_title():
    """Should update task title"""
    service = TaskService()
    task = service.create_task("Original Title", "Description")
    
    updated = service.update_task(task.id, title="Updated Title")
    
    assert updated.title == "Updated Title"
    assert updated.description == "Description"
    assert updated.updated_at > task.updated_at
```

**Assertions:**
- Title updated
- Other fields unchanged
- updated_at timestamp changed

---

##### test_update_task_description
**Objective:** Verify successful description update

```python
def test_update_task_description():
    """Should update task description"""
    service = TaskService()
    task = service.create_task("Title", "Original Description")
    
    updated = service.update_task(
        task.id,
        description="Updated Description"
    )
    
    assert updated.description == "Updated Description"
    assert updated.title == "Title"
```

**Assertions:**
- Description updated
- Other fields unchanged

---

##### test_update_task_completed
**Objective:** Verify successful completion status update

```python
def test_update_task_completed():
    """Should update task completion status"""
    service = TaskService()
    task = service.create_task("Title", "Description")
    
    updated = service.update_task(task.id, completed=True)
    
    assert updated.completed is True
```

**Assertions:**
- completed flag updated
- Other fields unchanged

---

##### test_update_task_multiple_fields
**Objective:** Verify updating multiple fields simultaneously

```python
def test_update_task_multiple_fields():
    """Should update multiple fields at once"""
    service = TaskService()
    task = service.create_task("Original", "Original")
    
    updated = service.update_task(
        task.id,
        title="Updated",
        description="Updated Description",
        completed=True
    )
    
    assert updated.title == "Updated"
    assert updated.description == "Updated Description"
    assert updated.completed is True
```

**Assertions:**
- All fields updated
- No partial updates

---

##### test_update_nonexistent_task
**Objective:** Verify error when updating non-existent task

```python
def test_update_nonexistent_task():
    """Should raise error for non-existent task"""
    service = TaskService()
    
    with pytest.raises(TaskNotFoundError) as exc_info:
        service.update_task("invalid-id", title="New Title")
    
    assert "Task not found" in str(exc_info.value)
```

**Assertions:**
- TaskNotFoundError raised
- Error message is descriptive

---

##### test_update_task_invalid_title
**Objective:** Verify validation during update

```python
def test_update_task_invalid_title():
    """Should validate title during update"""
    service = TaskService()
    task = service.create_task("Title", "Description")
    
    with pytest.raises(ValidationError):
        service.update_task(task.id, title="")
```

**Assertions:**
- ValidationError raised
- Task not modified

---

#### Delete Operation Tests

##### test_delete_task
**Objective:** Verify successful task deletion

```python
def test_delete_task():
    """Should delete task"""
    service = TaskService()
    task = service.create_task("Title", "Description")
    task_id = task.id
    
    service.delete_task(task_id)
    
    with pytest.raises(TaskNotFoundError):
        service.get_task(task_id)
```

**Assertions:**
- Task deleted
- get_task raises error after deletion
- No other tasks affected

---

##### test_delete_nonexistent_task
**Objective:** Verify error when deleting non-existent task

```python
def test_delete_nonexistent_task():
    """Should raise error for non-existent task"""
    service = TaskService()
    
    with pytest.raises(TaskNotFoundError):
        service.delete_task("invalid-id")
```

**Assertions:**
- TaskNotFoundError raised

---

#### List Operation Tests

##### test_list_all_tasks
**Objective:** Verify listing all tasks

```python
def test_list_all_tasks():
    """Should list all tasks"""
    service = TaskService()
    task1 = service.create_task("Task 1", "")
    task2 = service.create_task("Task 2", "")
    
    tasks = service.list_tasks()
    
    assert len(tasks) == 2
    assert task1 in tasks
    assert task2 in tasks
```

**Assertions:**
- All tasks returned
- Correct count
- Tasks present

---

##### test_list_tasks_empty
**Objective:** Verify listing from empty store

```python
def test_list_tasks_empty():
    """Should return empty list for empty store"""
    service = TaskService()
    
    tasks = service.list_tasks()
    
    assert tasks == []
    assert len(tasks) == 0
```

**Assertions:**
- Empty list returned
- No errors

---

##### test_list_tasks_filter_completed
**Objective:** Verify filtering by completion status

```python
def test_list_tasks_filter_completed():
    """Should filter by completed status"""
    service = TaskService()
    task1 = service.create_task("Task 1", "")
    task2 = service.create_task("Task 2", "")
    service.update_task(task1.id, completed=True)
    
    completed = service.list_tasks(completed=True)
    incomplete = service.list_tasks(completed=False)
    
    assert len(completed) == 1
    assert len(incomplete) == 1
    assert task1 in completed
    assert task2 in incomplete
```

**Assertions:**
- Filter returns correct tasks
- Completed tasks separated
- Incomplete tasks separated

---

##### test_list_tasks_sort_by_title
**Objective:** Verify sorting by title

```python
def test_list_tasks_sort_by_title():
    """Should sort tasks by title"""
    service = TaskService()
    service.create_task("Charlie", "")
    service.create_task("Alice", "")
    service.create_task("Bob", "")
    
    tasks = service.list_tasks(sort_by="title")
    
    assert tasks[0].title == "Alice"
    assert tasks[1].title == "Bob"
    assert tasks[2].title == "Charlie"
```

**Assertions:**
- Tasks sorted alphabetically
- Order correct
- No missing tasks

---

##### test_list_tasks_sort_descending
**Objective:** Verify reverse sort order

```python
def test_list_tasks_sort_descending():
    """Should sort descending when specified"""
    service = TaskService()
    service.create_task("Task 1", "")
    service.create_task("Task 2", "")
    
    tasks = service.list_tasks(sort_by="created_at", ascending=False)
    
    assert tasks[0].title == "Task 2"
    assert tasks[1].title == "Task 1"
```

**Assertions:**
- Reverse sort works
- Most recent first

---

#### Get Operation Tests

##### test_get_task
**Objective:** Verify retrieving single task

```python
def test_get_task():
    """Should retrieve task by ID"""
    service = TaskService()
    task = service.create_task("Title", "Description")
    
    retrieved = service.get_task(task.id)
    
    assert retrieved.id == task.id
    assert retrieved.title == "Title"
```

**Assertions:**
- Correct task retrieved
- All fields match

---

##### test_get_nonexistent_task
**Objective:** Verify error for non-existent task

```python
def test_get_nonexistent_task():
    """Should raise error for non-existent task"""
    service = TaskService()
    
    with pytest.raises(TaskNotFoundError):
        service.get_task("invalid-id")
```

**Assertions:**
- TaskNotFoundError raised

---

### 3.3 Utility Tests

#### test_uuid_validation
**Objective:** Verify UUID validation

```python
def test_uuid_validation():
    """Should validate UUID format"""
    from backend.phase_1_console.src.utils import is_valid_uuid
    
    assert is_valid_uuid("550e8400-e29b-41d4-a716-446655440000") is True
    assert is_valid_uuid("invalid") is False
```

---

## 4. INTEGRATION TESTS

### 4.1 CLI Command Integration Tests

**File:** `backend/phase-1-console/tests/test_cli_integration.py`

Test complete command workflows through the CLI interface.

#### test_add_task_workflow
**Objective:** Verify complete add task workflow

```python
def test_add_task_workflow():
    """Should complete full add task workflow"""
    cli = ConsoleApp()
    
    # Simulate user input
    inputs = ["a", "Buy groceries", "Milk and bread\n"]
    with mock.patch("builtins.input", side_effect=inputs):
        cli.run()
    
    # Verify task created
    tasks = cli.service.list_tasks()
    assert len(tasks) == 1
    assert tasks[0].title == "Buy groceries"
```

---

#### test_list_and_filter_workflow
**Objective:** Verify list workflow with filtering

```python
def test_list_and_filter_workflow():
    """Should list and filter tasks"""
    cli = ConsoleApp()
    
    # Create test data
    task1 = cli.service.create_task("Task 1")
    task2 = cli.service.create_task("Task 2")
    cli.service.update_task(task1.id, completed=True)
    
    # List all
    all_tasks = cli.service.list_tasks()
    assert len(all_tasks) == 2
    
    # List completed
    completed = cli.service.list_tasks(completed=True)
    assert len(completed) == 1
```

---

#### test_complete_task_workflow
**Objective:** Verify marking task complete workflow

```python
def test_complete_task_workflow():
    """Should complete task via CLI"""
    cli = ConsoleApp()
    task = cli.service.create_task("Task")
    
    # Complete task
    cli.service.update_task(task.id, completed=True)
    task = cli.service.get_task(task.id)
    
    assert task.completed is True
```

---

#### test_delete_task_workflow
**Objective:** Verify delete task workflow

```python
def test_delete_task_workflow():
    """Should delete task via CLI"""
    cli = ConsoleApp()
    task = cli.service.create_task("Task")
    task_id = task.id
    
    # Delete
    cli.service.delete_task(task_id)
    
    # Verify deleted
    with pytest.raises(TaskNotFoundError):
        cli.service.get_task(task_id)
```

---

### 4.2 Error Handling Integration Tests

#### test_invalid_input_handling
**Objective:** Verify graceful handling of invalid input

```python
def test_invalid_input_handling():
    """Should handle invalid input gracefully"""
    cli = ConsoleApp()
    
    # Simulate invalid input
    inputs = ["invalid", "a", "Task Title", ""]
    with mock.patch("builtins.input", side_effect=inputs):
        cli.run()
    
    # Application should recover and continue
    tasks = cli.service.list_tasks()
    assert len(tasks) == 1
```

---

#### test_task_not_found_handling
**Objective:** Verify error display for missing task

```python
def test_task_not_found_handling():
    """Should display error for missing task"""
    cli = ConsoleApp()
    
    # Try to access non-existent task
    with pytest.raises(TaskNotFoundError):
        cli.service.get_task("invalid-id")
```

---

## 5. END-TO-END TESTS

### 5.1 User Journey Tests

**File:** `backend/phase-1-console/tests/test_e2e.py`

Complete user workflows from application start to exit.

#### test_complete_user_journey
**Objective:** Verify complete usage scenario

```python
def test_complete_user_journey():
    """Should support complete user journey"""
    cli = ConsoleApp()
    
    # User adds 3 tasks
    task1 = cli.service.create_task("Buy groceries", "Milk, bread, eggs")
    task2 = cli.service.create_task("Complete specs", "Phase 1 specifications")
    task3 = cli.service.create_task("Review PR", "Check pull requests")
    
    # User lists all tasks
    all_tasks = cli.service.list_tasks()
    assert len(all_tasks) == 3
    
    # User completes one task
    cli.service.update_task(task1.id, completed=True)
    
    # User lists completed tasks
    completed = cli.service.list_tasks(completed=True)
    assert len(completed) == 1
    
    # User lists incomplete tasks
    incomplete = cli.service.list_tasks(completed=False)
    assert len(incomplete) == 2
    
    # User updates a task
    cli.service.update_task(task2.id, description="All Phase 1 specs complete")
    
    # User deletes a task
    cli.service.delete_task(task3.id)
    
    # Verify final state
    final_tasks = cli.service.list_tasks()
    assert len(final_tasks) == 2
```

---

#### test_data_persistence_across_operations
**Objective:** Verify data consistency across operations

```python
def test_data_persistence_across_operations():
    """Should maintain data consistency"""
    service = TaskService()
    
    # Create and modify multiple tasks
    for i in range(10):
        task = service.create_task(f"Task {i}", f"Description {i}")
        service.update_task(task.id, completed=(i % 2 == 0))
    
    # Verify consistency
    all_tasks = service.list_tasks()
    assert len(all_tasks) == 10
    
    completed = service.list_tasks(completed=True)
    assert len(completed) == 5
```

---

## 6. TEST CONFIGURATION

### 6.1 Pytest Configuration

**File:** `backend/phase-1-console/pytest.ini`

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --strict-markers --tb=short
markers =
    unit: Unit tests
    integration: Integration tests
    e2e: End-to-end tests
```

### 6.2 Coverage Configuration

**File:** `backend/phase-1-console/.coveragerc`

```ini
[run]
source = src
omit =
    */tests/*
    */site-packages/*

[report]
precision = 2
show_missing = True
skip_covered = False
```

---

## 7. TEST FIXTURES

### 7.1 TaskService Fixture

```python
@pytest.fixture
def task_service():
    """Provide clean TaskService instance"""
    service = TaskService()
    yield service
    # Cleanup
    service.clear()
```

### 7.2 Sample Task Fixture

```python
@pytest.fixture
def sample_task():
    """Provide pre-built Task instance"""
    return Task(
        id="550e8400-e29b-41d4-a716-446655440000",
        title="Sample Task",
        description="Sample Description",
        completed=False,
        created_at=datetime(2026, 1, 17, 10, 30, 0),
        updated_at=datetime(2026, 1, 17, 10, 30, 0)
    )
```

---

## 8. ACCEPTANCE CRITERIA

- ✅ 100+ unit tests all passing
- ✅ 30+ integration tests all passing
- ✅ 10+ end-to-end tests all passing
- ✅ Line coverage ≥ 85%
- ✅ Branch coverage ≥ 80%
- ✅ Function coverage = 100%
- ✅ Type coverage ≥ 90%
- ✅ Zero test failures in CI
- ✅ All edge cases covered
- ✅ All error paths tested
- ✅ Performance targets verified
- ✅ Test execution time < 30 seconds

---

## 9. GENERATED ARTIFACTS

These artifacts will be generated by Spec-Kit Plus:

```
backend/phase-1-console/
├── tests/
│   ├── __init__.py
│   ├── test_task_model.py           # Task model tests (~30 tests)
│   ├── test_task_service.py         # TaskService tests (~60 tests)
│   ├── test_cli_integration.py      # CLI integration tests (~30 tests)
│   ├── test_e2e.py                  # End-to-end tests (~10 tests)
│   ├── conftest.py                  # Pytest fixtures and config
│   └── __init__.py
├── pytest.ini                        # Pytest configuration
├── .coveragerc                       # Coverage configuration
└── pyproject.toml                    # Test dependencies
```

---

## 10. AMENDMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 17, 2026 | Initial specification |

---

**Specification v1.0.0 — Ready for Code Generation**
