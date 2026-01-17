"""Custom exceptions for Phase 1 Console Application."""

from .validation_error import ValidationError
from .task_error import TaskNotFoundError

__all__ = [
    "ValidationError",
    "TaskNotFoundError",
]
