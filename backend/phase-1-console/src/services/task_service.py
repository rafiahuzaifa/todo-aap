"""TaskService: CRUD operations for Task management."""

from datetime import datetime
from typing import Dict, List, Optional
from uuid import uuid4

from ..models import Task
from ..exceptions import ValidationError, TaskNotFoundError


class TaskService:
    """
    Service for Task CRUD operations.
    
    Manages in-memory task store and provides all CRUD operations
    with validation and error handling.
    """

    def __init__(self) -> None:
        """Initialize TaskService with empty in-memory store."""
        self._tasks: Dict[str, Task] = {}

    def create_task(self, title: str, description: str = "") -> Task:
        """
        Create a new Task with auto-generated UUID.
        
        Args:
            title: Task title (1-200 characters, required)
            description: Optional task details (0-2000 characters)
            
        Returns:
            Task instance with populated fields
            
        Raises:
            ValidationError: If title is invalid or description too long
        """
        # Validate title
        if not title or len(title.strip()) == 0:
            raise ValidationError("Title must be 1-200 characters")
        
        if len(title) > 200:
            raise ValidationError("Title must be 1-200 characters")
        
        if title.strip() != title:
            # Check if title is effectively whitespace-only after stripping
            if len(title.strip()) == 0:
                raise ValidationError("Title cannot be whitespace only")
        
        # Validate description
        if len(description) > 2000:
            raise ValidationError("Description must be 0-2000 characters")
        
        # Generate UUID and timestamps
        task_id = str(uuid4())
        now = datetime.utcnow()
        
        # Create Task
        task = Task(
            id=task_id,
            title=title,
            description=description,
            completed=False,
            created_at=now,
            updated_at=now,
        )
        
        # Store task
        self._tasks[task_id] = task
        
        return task

    def update_task(
        self,
        task_id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        completed: Optional[bool] = None,
    ) -> Task:
        """
        Update an existing Task's properties.
        
        Args:
            task_id: UUID of task to update
            title: New title (optional)
            description: New description (optional)
            completed: New completion status (optional)
            
        Returns:
            Updated Task instance
            
        Raises:
            TaskNotFoundError: If task not found
            ValidationError: If new values invalid
        """
        # Validate task exists
        if task_id not in self._tasks:
            raise TaskNotFoundError(task_id)
        
        current_task = self._tasks[task_id]
        
        # Prepare updated values
        new_title = title if title is not None else current_task.title
        new_description = (
            description
            if description is not None
            else current_task.description
        )
        new_completed = (
            completed if completed is not None else current_task.completed
        )
        
        # Validate title if provided
        if title is not None:
            if not title or len(title.strip()) == 0:
                raise ValidationError("Title must be 1-200 characters")
            if len(title) > 200:
                raise ValidationError("Title must be 1-200 characters")
        
        # Validate description if provided
        if description is not None:
            if len(description) > 2000:
                raise ValidationError("Description must be 0-2000 characters")
        
        # Create updated task
        updated_task = Task(
            id=current_task.id,
            title=new_title,
            description=new_description,
            completed=new_completed,
            created_at=current_task.created_at,
            updated_at=datetime.utcnow(),
        )
        
        # Store updated task
        self._tasks[task_id] = updated_task
        
        return updated_task

    def delete_task(self, task_id: str) -> None:
        """
        Delete a Task from the store.
        
        Args:
            task_id: UUID of task to delete
            
        Raises:
            TaskNotFoundError: If task not found
        """
        if task_id not in self._tasks:
            raise TaskNotFoundError(task_id)
        
        del self._tasks[task_id]

    def list_tasks(
        self,
        completed: Optional[bool] = None,
        sort_by: str = "created_at",
        ascending: bool = True,
    ) -> List[Task]:
        """
        List all Tasks with optional filtering and sorting.
        
        Args:
            completed: Filter by completion status (None = all)
            sort_by: Sort field (created_at, title, updated_at)
            ascending: Sort direction (True = ascending)
            
        Returns:
            List of Task objects
            
        Raises:
            ValidationError: If sort_by invalid or completed not boolean
        """
        # Validate sort_by
        allowed_sorts = {"created_at", "title", "updated_at"}
        if sort_by not in allowed_sorts:
            raise ValidationError(
                f"sort_by must be one of: {', '.join(allowed_sorts)}"
            )
        
        # Get all tasks
        tasks = list(self._tasks.values())
        
        # Apply completion filter
        if completed is not None:
            tasks = [t for t in tasks if t.completed == completed]
        
        # Sort tasks
        reverse = not ascending
        if sort_by == "created_at":
            tasks.sort(key=lambda t: t.created_at, reverse=reverse)
        elif sort_by == "title":
            tasks.sort(key=lambda t: t.title, reverse=reverse)
        elif sort_by == "updated_at":
            tasks.sort(key=lambda t: t.updated_at, reverse=reverse)
        
        return tasks

    def get_task(self, task_id: str) -> Task:
        """
        Retrieve a single Task by ID.
        
        Args:
            task_id: UUID of task to retrieve
            
        Returns:
            Task instance
            
        Raises:
            TaskNotFoundError: If task not found
        """
        if task_id not in self._tasks:
            raise TaskNotFoundError(task_id)
        
        return self._tasks[task_id]

    def clear(self) -> None:
        """Clear all tasks from store (utility for testing)."""
        self._tasks.clear()
