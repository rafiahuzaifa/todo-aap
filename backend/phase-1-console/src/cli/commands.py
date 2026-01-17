"""Command handlers for CLI operations."""

from typing import Optional
from ..services import TaskService
from ..exceptions import ValidationError, TaskNotFoundError
from .formatter import (
    format_table,
    format_task_brief,
    format_task_detailed,
    format_error,
    format_success,
)


class CommandHandler:
    """Handles all CLI commands."""

    def __init__(self, service: TaskService) -> None:
        """
        Initialize command handler with service.
        
        Args:
            service: TaskService instance
        """
        self.service = service

    def add_task(self) -> None:
        """Handle add task command."""
        print("\n--- Add Task ---")
        title = input("Title: ").strip()
        description = input("Description (optional): ").strip()

        try:
            task = self.service.create_task(title, description)
            print(format_success(f"Task created: {task.id}"))
            print(format_task_brief(task))
        except ValidationError as e:
            print(format_error(str(e)))

    def list_tasks(self, completed: Optional[bool] = None) -> None:
        """
        Handle list tasks command.
        
        Args:
            completed: Filter by completion status
        """
        print("\n--- Task List ---")
        
        sort_by = "created_at"
        ascending = True
        
        try:
            tasks = self.service.list_tasks(
                completed=completed,
                sort_by=sort_by,
                ascending=ascending,
            )
            
            if not tasks:
                print("No tasks found.")
                return
            
            # Build table data
            headers = ["ID", "Title", "Status", "Updated"]
            rows = []
            for task in tasks:
                status = "[X]" if task.completed else "[ ]"
                task_id = task.id[:8]
                updated = task.updated_at.strftime("%Y-%m-%d %H:%M")
                rows.append([task_id, task.title, status, updated])
            
            print(format_table(headers, rows))
            print(f"\nTotal: {len(tasks)} task(s)")
            
        except ValidationError as e:
            print(format_error(str(e)))

    def view_task(self, task_id: str) -> None:
        """
        Handle view task details command.
        
        Args:
            task_id: UUID of task to view
        """
        try:
            task = self.service.get_task(task_id)
            print("\n--- Task Details ---")
            print(format_task_detailed(task))
        except TaskNotFoundError as e:
            print(format_error(str(e)))

    def update_task(self, task_id: str) -> None:
        """
        Handle update task command.
        
        Args:
            task_id: UUID of task to update
        """
        print("\n--- Update Task ---")
        
        try:
            # Get current task
            current_task = self.service.get_task(task_id)
            
            # Prompt for updates
            print(f"Current title: {current_task.title}")
            new_title_input = input("New title (press Enter to keep): ").strip()
            new_title = new_title_input if new_title_input else None
            
            print(f"Current description: {current_task.description}")
            new_desc_input = input(
                "New description (press Enter to keep): "
            ).strip()
            new_description = new_desc_input if new_desc_input else None
            
            # Update task
            updated_task = self.service.update_task(
                task_id,
                title=new_title,
                description=new_description,
            )
            
            print(format_success("Task updated"))
            print(format_task_brief(updated_task))
            
        except (TaskNotFoundError, ValidationError) as e:
            print(format_error(str(e)))

    def delete_task(self, task_id: str) -> None:
        """
        Handle delete task command.
        
        Args:
            task_id: UUID of task to delete
        """
        try:
            task = self.service.get_task(task_id)
            confirm = (
                input(f"Delete '{task.title}'? (y/n): ").strip().lower()
            )
            if confirm == "y":
                self.service.delete_task(task_id)
                print(format_success("Task deleted"))
            else:
                print("Cancelled.")
        except TaskNotFoundError as e:
            print(format_error(str(e)))

    def complete_task(self, task_id: str) -> None:
        """
        Handle complete task command.
        
        Args:
            task_id: UUID of task to complete
        """
        try:
            task = self.service.get_task(task_id)
            if task.completed:
                print(format_error("Task already completed"))
            else:
                updated_task = self.service.update_task(
                    task_id, completed=True
                )
                print(format_success("Task marked as completed"))
                print(format_task_brief(updated_task))
        except TaskNotFoundError as e:
            print(format_error(str(e)))
