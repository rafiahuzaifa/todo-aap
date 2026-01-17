"""Tests for TaskService CRUD operations."""

import pytest
from datetime import datetime

from src.services import TaskService
from src.models import Task
from src.exceptions import ValidationError, TaskNotFoundError


class TestTaskServiceCreate:
    """Test create_task operation."""

    def test_create_task_with_valid_data(self, task_service: TaskService) -> None:
        """Should create task with valid title and description."""
        task = task_service.create_task("Test Task", "Test description")

        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.completed is False
        assert task.created_at is not None
        assert task.updated_at is not None

    def test_create_task_minimal(self, task_service: TaskService) -> None:
        """Should create task with only title."""
        task = task_service.create_task("Minimal Task")

        assert task.title == "Minimal Task"
        assert task.description == ""

    def test_create_task_generates_unique_ids(self, task_service: TaskService) -> None:
        """Should generate unique IDs for each task."""
        task1 = task_service.create_task("Task 1")
        task2 = task_service.create_task("Task 2")

        assert task1.id != task2.id

    def test_create_task_empty_title_fails(self, task_service: TaskService) -> None:
        """Should fail with empty title."""
        with pytest.raises(ValidationError):
            task_service.create_task("")

    def test_create_task_whitespace_only_title_fails(self, task_service: TaskService) -> None:
        """Should fail with whitespace-only title."""
        with pytest.raises(ValidationError):
            task_service.create_task("   ")

    def test_create_task_title_too_long_fails(self, task_service: TaskService) -> None:
        """Should fail with title over 200 characters."""
        long_title = "A" * 201
        with pytest.raises(ValidationError):
            task_service.create_task(long_title)

    def test_create_task_description_too_long_fails(self, task_service: TaskService) -> None:
        """Should fail with description over 2000 characters."""
        long_desc = "A" * 2001
        with pytest.raises(ValidationError):
            task_service.create_task("Task", long_desc)

    def test_create_task_max_title_length(self, task_service: TaskService) -> None:
        """Should succeed with exactly 200 character title."""
        title = "A" * 200
        task = task_service.create_task(title)

        assert len(task.title) == 200

    def test_create_task_max_description_length(self, task_service: TaskService) -> None:
        """Should succeed with exactly 2000 character description."""
        desc = "A" * 2000
        task = task_service.create_task("Task", desc)

        assert len(task.description) == 2000

    def test_create_task_stores_in_service(self, task_service: TaskService) -> None:
        """Should store created task in service."""
        task = task_service.create_task("Stored Task")
        retrieved = task_service.get_task(task.id)

        assert retrieved.id == task.id
        assert retrieved.title == task.title


class TestTaskServiceUpdate:
    """Test update_task operation."""

    def test_update_task_title(self, task_service: TaskService) -> None:
        """Should update task title."""
        import time
        task = task_service.create_task("Original Title")
        time.sleep(0.01)  # Small delay to ensure timestamp difference
        updated = task_service.update_task(task.id, title="New Title")

        assert updated.title == "New Title"
        assert updated.id == task.id
        assert updated.updated_at >= task.updated_at

    def test_update_task_description(self, task_service: TaskService) -> None:
        """Should update task description."""
        task = task_service.create_task("Task", "Original description")
        updated = task_service.update_task(task.id, description="New description")

        assert updated.description == "New description"

    def test_update_task_completion_status(self, task_service: TaskService) -> None:
        """Should update completion status."""
        task = task_service.create_task("Task")
        updated = task_service.update_task(task.id, completed=True)

        assert updated.completed is True

    def test_update_task_multiple_fields(self, task_service: TaskService) -> None:
        """Should update multiple fields at once."""
        task = task_service.create_task("Task", "Desc")
        updated = task_service.update_task(
            task.id,
            title="New Title",
            description="New Desc",
            completed=True,
        )

        assert updated.title == "New Title"
        assert updated.description == "New Desc"
        assert updated.completed is True

    def test_update_task_partial_update(self, task_service: TaskService) -> None:
        """Should only update specified fields."""
        task = task_service.create_task("Title", "Desc")
        updated = task_service.update_task(task.id, title="New Title")

        assert updated.title == "New Title"
        assert updated.description == "Desc"  # Unchanged

    def test_update_task_nonexistent_fails(self, task_service: TaskService) -> None:
        """Should fail when updating non-existent task."""
        with pytest.raises(TaskNotFoundError):
            task_service.update_task("nonexistent_id")

    def test_update_task_invalid_title_fails(self, task_service: TaskService) -> None:
        """Should fail with invalid title update."""
        task = task_service.create_task("Task")
        with pytest.raises(ValidationError):
            task_service.update_task(task.id, title="")

    def test_update_task_invalid_description_fails(self, task_service: TaskService) -> None:
        """Should fail with invalid description update."""
        task = task_service.create_task("Task")
        with pytest.raises(ValidationError):
            task_service.update_task(task.id, description="A" * 2001)

    def test_update_task_preserves_created_at(self, task_service: TaskService) -> None:
        """Should preserve created_at timestamp."""
        task = task_service.create_task("Task")
        original_created = task.created_at
        updated = task_service.update_task(task.id, title="New Title")

        assert updated.created_at == original_created


class TestTaskServiceDelete:
    """Test delete_task operation."""

    def test_delete_task_success(self, task_service: TaskService) -> None:
        """Should delete existing task."""
        task = task_service.create_task("Task to Delete")
        task_service.delete_task(task.id)

        with pytest.raises(TaskNotFoundError):
            task_service.get_task(task.id)

    def test_delete_nonexistent_task_fails(self, task_service: TaskService) -> None:
        """Should fail when deleting non-existent task."""
        with pytest.raises(TaskNotFoundError):
            task_service.delete_task("nonexistent_id")

    def test_delete_task_removes_from_list(self, task_service: TaskService) -> None:
        """Should remove task from list after deletion."""
        task = task_service.create_task("Task")
        task_service.delete_task(task.id)
        tasks = task_service.list_tasks()

        assert len(tasks) == 0


class TestTaskServiceList:
    """Test list_tasks operation."""

    def test_list_empty_service(self, task_service: TaskService) -> None:
        """Should return empty list when no tasks exist."""
        tasks = task_service.list_tasks()

        assert tasks == []

    def test_list_single_task(self, task_service: TaskService) -> None:
        """Should list single task."""
        task = task_service.create_task("Task")
        tasks = task_service.list_tasks()

        assert len(tasks) == 1
        assert tasks[0].id == task.id

    def test_list_multiple_tasks(self, task_service: TaskService) -> None:
        """Should list all tasks."""
        task1 = task_service.create_task("Task 1")
        task2 = task_service.create_task("Task 2")
        task3 = task_service.create_task("Task 3")

        tasks = task_service.list_tasks()

        assert len(tasks) == 3

    def test_list_filter_by_completed_true(self, task_service: TaskService) -> None:
        """Should filter tasks by completed=True."""
        task1 = task_service.create_task("Completed")
        task2 = task_service.create_task("Pending")
        task_service.update_task(task1.id, completed=True)

        completed_tasks = task_service.list_tasks(completed=True)

        assert len(completed_tasks) == 1
        assert completed_tasks[0].id == task1.id

    def test_list_filter_by_completed_false(self, task_service: TaskService) -> None:
        """Should filter tasks by completed=False."""
        task1 = task_service.create_task("Completed")
        task2 = task_service.create_task("Pending")
        task_service.update_task(task1.id, completed=True)

        pending_tasks = task_service.list_tasks(completed=False)

        assert len(pending_tasks) == 1
        assert pending_tasks[0].id == task2.id

    def test_list_sort_by_created_at_ascending(self, task_service: TaskService) -> None:
        """Should sort by created_at ascending."""
        import time
        task1 = task_service.create_task("Task 1")
        time.sleep(0.01)
        task2 = task_service.create_task("Task 2")
        time.sleep(0.01)
        task3 = task_service.create_task("Task 3")

        tasks = task_service.list_tasks(sort_by="created_at", ascending=True)

        assert tasks[0].id == task1.id
        assert tasks[1].id == task2.id
        assert tasks[2].id == task3.id

    def test_list_sort_by_created_at_descending(self, task_service: TaskService) -> None:
        """Should sort by created_at descending."""
        import time
        task1 = task_service.create_task("Task 1")
        time.sleep(0.01)
        task2 = task_service.create_task("Task 2")
        time.sleep(0.01)
        task3 = task_service.create_task("Task 3")

        tasks = task_service.list_tasks(sort_by="created_at", ascending=False)

        assert tasks[0].id == task3.id
        assert tasks[1].id == task2.id
        assert tasks[2].id == task1.id

    def test_list_sort_by_title_ascending(self, task_service: TaskService) -> None:
        """Should sort by title ascending."""
        task1 = task_service.create_task("Zebra Task")
        task2 = task_service.create_task("Apple Task")
        task3 = task_service.create_task("Middle Task")

        tasks = task_service.list_tasks(sort_by="title", ascending=True)

        assert tasks[0].title == "Apple Task"
        assert tasks[1].title == "Middle Task"
        assert tasks[2].title == "Zebra Task"

    def test_list_sort_by_title_descending(self, task_service: TaskService) -> None:
        """Should sort by title descending."""
        task1 = task_service.create_task("Zebra Task")
        task2 = task_service.create_task("Apple Task")
        task3 = task_service.create_task("Middle Task")

        tasks = task_service.list_tasks(sort_by="title", ascending=False)

        assert tasks[0].title == "Zebra Task"
        assert tasks[1].title == "Middle Task"
        assert tasks[2].title == "Apple Task"

    def test_list_invalid_sort_by_fails(self, task_service: TaskService) -> None:
        """Should fail with invalid sort_by parameter."""
        with pytest.raises(ValidationError):
            task_service.list_tasks(sort_by="invalid_field")

    def test_list_filter_and_sort_combined(self, task_service: TaskService) -> None:
        """Should apply filter and sort together."""
        task1 = task_service.create_task("Zebra")
        task2 = task_service.create_task("Apple")
        task3 = task_service.create_task("Middle")
        task_service.update_task(task1.id, completed=True)
        task_service.update_task(task3.id, completed=True)

        completed = task_service.list_tasks(
            completed=True, sort_by="title", ascending=True
        )

        assert len(completed) == 2
        assert completed[0].title == "Middle"
        assert completed[1].title == "Zebra"


class TestTaskServiceGet:
    """Test get_task operation."""

    def test_get_existing_task(self, task_service: TaskService) -> None:
        """Should retrieve existing task."""
        task = task_service.create_task("Test Task")
        retrieved = task_service.get_task(task.id)

        assert retrieved.id == task.id
        assert retrieved.title == task.title

    def test_get_nonexistent_task_fails(self, task_service: TaskService) -> None:
        """Should fail when getting non-existent task."""
        with pytest.raises(TaskNotFoundError):
            task_service.get_task("nonexistent_id")
