"""Pytest fixtures and configuration for Phase 1 tests."""

import pytest
from datetime import datetime
from uuid import uuid4

from src.models import Task
from src.services import TaskService
from src.exceptions import ValidationError, TaskNotFoundError


@pytest.fixture
def task_service() -> TaskService:
    """Provide a clean TaskService instance for each test."""
    return TaskService()


@pytest.fixture
def sample_task() -> Task:
    """Provide a sample task for testing."""
    return Task(
        id=str(uuid4()),
        title="Sample Task",
        description="Sample description",
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )


@pytest.fixture
def sample_completed_task() -> Task:
    """Provide a completed sample task for testing."""
    return Task(
        id=str(uuid4()),
        title="Completed Task",
        description="Completed description",
        completed=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
