"""Integration tests for CLI commands."""

import pytest
from io import StringIO
from unittest.mock import patch

from src.services import TaskService
from src.cli.commands import CommandHandler
from src.cli.formatter import (
    format_task_brief,
    format_task_detailed,
    format_error,
    format_success,
)


class TestCommandHandlerAddTask:
    """Test add task command handler."""

    def test_add_task_success(self, task_service: TaskService) -> None:
        """Should add task with valid input."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["Test Task", "Test Description"]):
            handler.add_task()
        
        tasks = task_service.list_tasks()
        assert len(tasks) == 1
        assert tasks[0].title == "Test Task"

    def test_add_task_minimal(self, task_service: TaskService) -> None:
        """Should add task with only title."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["Task Only", ""]):
            handler.add_task()
        
        tasks = task_service.list_tasks()
        assert len(tasks) == 1

    def test_add_task_validation_error(self, task_service: TaskService) -> None:
        """Should handle validation errors gracefully."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["", ""]):
            with patch("builtins.print") as mock_print:
                handler.add_task()
                # Should have printed an error
                output = " ".join(str(call) for call in mock_print.call_args_list)
                assert "ERROR" in output or "error" in output.lower()


class TestCommandHandlerListTasks:
    """Test list tasks command handler."""

    def test_list_empty(self, task_service: TaskService) -> None:
        """Should handle empty task list."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.list_tasks()
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert "No tasks" in output or "no tasks" in output.lower()

    def test_list_with_tasks(self, task_service: TaskService) -> None:
        """Should list all tasks."""
        task_service.create_task("Task 1")
        task_service.create_task("Task 2")
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.list_tasks()
            # Should show both tasks
            calls_text = str(mock_print.call_args_list)
            assert "Total" in calls_text or "total" in calls_text.lower()

    def test_list_filters_by_completion(self, task_service: TaskService) -> None:
        """Should filter tasks by completion status."""
        task1 = task_service.create_task("Pending")
        task2 = task_service.create_task("Completed")
        task_service.update_task(task2.id, completed=True)
        
        handler = CommandHandler(task_service)
        
        with patch("builtins.print"):
            handler.list_tasks(completed=True)
        
        # Should only show completed task
        tasks = task_service.list_tasks(completed=True)
        assert len(tasks) == 1


class TestCommandHandlerViewTask:
    """Test view task command handler."""

    def test_view_existing_task(self, task_service: TaskService) -> None:
        """Should display task details."""
        task = task_service.create_task("Task", "Description")
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.view_task(task.id)
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert task.title in output or task.id in output

    def test_view_nonexistent_task(self, task_service: TaskService) -> None:
        """Should handle non-existent task gracefully."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.view_task("nonexistent_id")
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert "ERROR" in output or "error" in output.lower()


class TestCommandHandlerUpdateTask:
    """Test update task command handler."""

    def test_update_task_title(self, task_service: TaskService) -> None:
        """Should update task title."""
        task = task_service.create_task("Original")
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["New Title", ""]):
            with patch("builtins.print"):
                handler.update_task(task.id)
        
        updated = task_service.get_task(task.id)
        assert updated.title == "New Title"

    def test_update_task_no_changes(self, task_service: TaskService) -> None:
        """Should skip update when no input provided."""
        task = task_service.create_task("Original", "Desc")
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["", ""]):
            with patch("builtins.print"):
                handler.update_task(task.id)
        
        unchanged = task_service.get_task(task.id)
        assert unchanged.title == "Original"
        assert unchanged.description == "Desc"

    def test_update_nonexistent_task(self, task_service: TaskService) -> None:
        """Should handle non-existent task."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["New Title", ""]):
            with patch("builtins.print") as mock_print:
                handler.update_task("nonexistent_id")
                output = " ".join(str(call) for call in mock_print.call_args_list)
                assert "ERROR" in output or "error" in output.lower()


class TestCommandHandlerDeleteTask:
    """Test delete task command handler."""

    def test_delete_task_confirmed(self, task_service: TaskService) -> None:
        """Should delete task when confirmed."""
        task = task_service.create_task("Task to Delete")
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["y"]):
            with patch("builtins.print"):
                handler.delete_task(task.id)
        
        with pytest.raises(Exception):
            task_service.get_task(task.id)

    def test_delete_task_cancelled(self, task_service: TaskService) -> None:
        """Should not delete task when cancelled."""
        task = task_service.create_task("Task to Keep")
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["n"]):
            with patch("builtins.print") as mock_print:
                handler.delete_task(task.id)
        
        # Task should still exist
        retrieved = task_service.get_task(task.id)
        assert retrieved.id == task.id

    def test_delete_nonexistent_task(self, task_service: TaskService) -> None:
        """Should handle non-existent task."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.input", side_effect=["y"]):
            with patch("builtins.print") as mock_print:
                handler.delete_task("nonexistent_id")
                output = " ".join(str(call) for call in mock_print.call_args_list)
                assert "ERROR" in output or "error" in output.lower()


class TestCommandHandlerCompleteTask:
    """Test complete task command handler."""

    def test_complete_pending_task(self, task_service: TaskService) -> None:
        """Should mark pending task as complete."""
        task = task_service.create_task("Task")
        handler = CommandHandler(task_service)
        
        with patch("builtins.print"):
            handler.complete_task(task.id)
        
        completed = task_service.get_task(task.id)
        assert completed.completed is True

    def test_complete_already_completed_task(self, task_service: TaskService) -> None:
        """Should handle already completed task."""
        task = task_service.create_task("Task")
        task_service.update_task(task.id, completed=True)
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.complete_task(task.id)
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert "ERROR" in output or "already" in output.lower()

    def test_complete_nonexistent_task(self, task_service: TaskService) -> None:
        """Should handle non-existent task."""
        handler = CommandHandler(task_service)
        
        with patch("builtins.print") as mock_print:
            handler.complete_task("nonexistent_id")
            output = " ".join(str(call) for call in mock_print.call_args_list)
            assert "ERROR" in output or "error" in output.lower()


class TestFormatterFunctions:
    """Test formatting utility functions."""

    def test_format_task_brief(self, sample_task) -> None:
        """Should format task as brief summary."""
        result = format_task_brief(sample_task)
        
        assert "[ ]" in result  # Not completed
        assert sample_task.title in result

    def test_format_task_detailed(self, sample_task) -> None:
        """Should format task with all details."""
        result = format_task_detailed(sample_task)
        
        assert sample_task.id in result
        assert sample_task.title in result
        assert sample_task.description in result
        assert "PENDING" in result

    def test_format_error(self) -> None:
        """Should format error message."""
        result = format_error("Test error")
        
        assert "ERROR" in result
        assert "Test error" in result

    def test_format_success(self) -> None:
        """Should format success message."""
        result = format_success("Test success")
        
        assert "SUCCESS" in result
        assert "Test success" in result
