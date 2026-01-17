"""Phase 1 Console Application - Evolution of Todo."""

__version__ = "1.0.0"
__author__ = "Hackathon Team"

from .services import TaskService
from .models import Task
from .exceptions import ValidationError, TaskNotFoundError
from .cli import run_console

__all__ = [
    "TaskService",
    "Task",
    "ValidationError",
    "TaskNotFoundError",
    "run_console",
]
