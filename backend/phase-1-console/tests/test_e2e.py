"""End-to-end tests for complete workflows."""

import pytest
from unittest.mock import patch

from src.services import TaskService
from src.cli.commands import CommandHandler


class TestE2EWorkflows:
    """Test complete user workflows."""

    def test_e2e_create_and_list(self, task_service: TaskService) -> None:
        """Complete flow: create tasks and list them."""
        task_service.create_task("First Task", "First description")
        task_service.create_task("Second Task", "Second description")
        
        tasks = task_service.list_tasks()
        
        assert len(tasks) == 2
        assert all(t.completed is False for t in tasks)

    def test_e2e_create_update_complete(self, task_service: TaskService) -> None:
        """Complete flow: create, update, and complete task."""
        task = task_service.create_task("Original Title", "Original Desc")
        
        updated = task_service.update_task(
            task.id,
            title="New Title",
            description="New Desc"
        )
        assert updated.title == "New Title"
        
        completed = task_service.update_task(task.id, completed=True)
        assert completed.completed is True

    def test_e2e_create_delete_verify(self, task_service: TaskService) -> None:
        """Complete flow: create, delete, and verify removal."""
        task1 = task_service.create_task("Task 1")
        task2 = task_service.create_task("Task 2")
        
        task_service.delete_task(task1.id)
        
        remaining = task_service.list_tasks()
        assert len(remaining) == 1
        assert remaining[0].id == task2.id

    def test_e2e_filter_and_sort(self, task_service: TaskService) -> None:
        """Complete flow: create mixed tasks, filter and sort."""
        task_service.create_task("Zebra Task")
        task_service.create_task("Apple Task")
        
        task1 = task_service.create_task("Middle Task")
        task_service.update_task(task1.id, completed=True)
        
        # Filter completed and sort by title
        completed = task_service.list_tasks(
            completed=True,
            sort_by="title",
            ascending=True
        )
        
        assert len(completed) == 1
        assert completed[0].title == "Middle Task"

    def test_e2e_cli_create_and_view(self, task_service: TaskService) -> None:
        """CLI flow: create task via command handler and view it."""
        handler = CommandHandler(task_service)
        
        # Create task
        with patch("builtins.input", side_effect=["CLI Task", "CLI Description"]):
            handler.add_task()
        
        tasks = task_service.list_tasks()
        assert len(tasks) == 1
        
        # View task
        with patch("builtins.print") as mock_print:
            handler.view_task(tasks[0].id)
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert "CLI Task" in output or tasks[0].id in output

    def test_e2e_cli_complete_workflow(self, task_service: TaskService) -> None:
        """Complete CLI workflow: add, list, complete, delete."""
        handler = CommandHandler(task_service)
        
        # Add task
        with patch("builtins.input", side_effect=["Workflow Task", ""]):
            handler.add_task()
        
        task = task_service.list_tasks()[0]
        
        # Complete task
        with patch("builtins.print"):
            handler.complete_task(task.id)
        
        # Verify completion
        completed_task = task_service.get_task(task.id)
        assert completed_task.completed is True
        
        # Delete task
        with patch("builtins.input", side_effect=["y"]):
            with patch("builtins.print"):
                handler.delete_task(task.id)
        
        # Verify deletion
        remaining = task_service.list_tasks()
        assert len(remaining) == 0

    def test_e2e_bulk_operations(self, task_service: TaskService) -> None:
        """E2E: bulk create and filter operations."""
        # Create 10 tasks
        for i in range(10):
            task_service.create_task(f"Task {i+1}")
        
        # Mark half as complete
        all_tasks = task_service.list_tasks()
        for task in all_tasks[:5]:
            task_service.update_task(task.id, completed=True)
        
        # Verify counts
        pending = task_service.list_tasks(completed=False)
        completed = task_service.list_tasks(completed=True)
        
        assert len(pending) == 5
        assert len(completed) == 5
        assert len(pending) + len(completed) == 10

    def test_e2e_validation_and_recovery(self, task_service: TaskService) -> None:
        """E2E: attempt invalid operations and verify recovery."""
        from src.exceptions import ValidationError, TaskNotFoundError
        
        # Try invalid creation
        with pytest.raises(ValidationError):
            task_service.create_task("")
        
        # Should still be able to create valid task
        task = task_service.create_task("Valid Task")
        assert task.id is not None
        
        # Try invalid update
        with pytest.raises(ValidationError):
            task_service.update_task(task.id, title="")
        
        # Try accessing non-existent
        with pytest.raises(TaskNotFoundError):
            task_service.get_task("invalid_id")
        
        # Original task should still be retrievable
        retrieved = task_service.get_task(task.id)
        assert retrieved.title == "Valid Task"
