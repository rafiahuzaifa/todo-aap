"""Tests for Task model."""

import pytest
from datetime import datetime
from uuid import uuid4

from src.models import Task


class TestTaskCreation:
    """Test Task instantiation and initialization."""

    def test_task_creation_with_all_fields(self) -> None:
        """Task should be created with all required fields."""
        now = datetime.utcnow()
        task = Task(
            id="123",
            title="Test Task",
            description="Test description",
            completed=False,
            created_at=now,
            updated_at=now,
        )

        assert task.id == "123"
        assert task.title == "Test Task"
        assert task.description == "Test description"
        assert task.completed is False
        assert task.created_at == now
        assert task.updated_at == now

    def test_task_is_frozen(self, sample_task: Task) -> None:
        """Task should be immutable (frozen dataclass)."""
        with pytest.raises(AttributeError):
            sample_task.title = "New Title"  # type: ignore

    def test_task_default_values(self) -> None:
        """Task fields should use provided values."""
        now = datetime.utcnow()
        task = Task(
            id="123",
            title="Task",
            description="",
            completed=False,
            created_at=now,
            updated_at=now,
        )

        assert task.description == ""
        assert task.completed is False


class TestTaskSerialization:
    """Test Task to_dict and from_dict methods."""

    def test_task_to_dict(self, sample_task: Task) -> None:
        """Task should convert to dictionary."""
        task_dict = sample_task.to_dict()

        assert task_dict["id"] == sample_task.id
        assert task_dict["title"] == sample_task.title
        assert task_dict["description"] == sample_task.description
        assert task_dict["completed"] == sample_task.completed
        assert "created_at" in task_dict
        assert "updated_at" in task_dict

    def test_task_from_dict(self, sample_task: Task) -> None:
        """Task should be reconstructed from dictionary."""
        task_dict = sample_task.to_dict()
        reconstructed = Task.from_dict(task_dict)

        assert reconstructed.id == sample_task.id
        assert reconstructed.title == sample_task.title
        assert reconstructed.description == sample_task.description
        assert reconstructed.completed == sample_task.completed

    def test_task_roundtrip_dict(self, sample_task: Task) -> None:
        """Task should survive to_dict and from_dict roundtrip."""
        task_dict = sample_task.to_dict()
        reconstructed = Task.from_dict(task_dict)
        final_dict = reconstructed.to_dict()

        assert task_dict == final_dict

    def test_task_from_dict_missing_fields(self) -> None:
        """Task.from_dict should raise KeyError on missing fields."""
        incomplete_dict = {"id": "123", "title": "Task"}
        
        with pytest.raises(KeyError):
            Task.from_dict(incomplete_dict)


class TestTaskJSONSerialization:
    """Test Task JSON serialization."""

    def test_task_to_json(self, sample_task: Task) -> None:
        """Task should convert to JSON string."""
        json_str = sample_task.to_json()

        assert isinstance(json_str, str)
        assert sample_task.id in json_str
        assert sample_task.title in json_str

    def test_task_from_json(self, sample_task: Task) -> None:
        """Task should be reconstructed from JSON string."""
        json_str = sample_task.to_json()
        reconstructed = Task.from_json(json_str)

        assert reconstructed.id == sample_task.id
        assert reconstructed.title == sample_task.title
        assert reconstructed.description == sample_task.description
        assert reconstructed.completed == sample_task.completed

    def test_task_json_roundtrip(self, sample_task: Task) -> None:
        """Task should survive to_json and from_json roundtrip."""
        json_str = sample_task.to_json()
        reconstructed = Task.from_json(json_str)
        final_json = reconstructed.to_json()

        # Parse both to compare content (formatting may differ)
        import json
        original = json.loads(json_str)
        final = json.loads(final_json)
        
        assert original == final

    def test_task_from_invalid_json(self) -> None:
        """Task.from_json should raise on invalid JSON."""
        with pytest.raises(ValueError):
            Task.from_json("not valid json")


class TestTaskEquality:
    """Test Task equality comparison."""

    def test_tasks_with_same_data_are_equal(self) -> None:
        """Tasks with identical data should be equal."""
        now = datetime.utcnow()
        task1 = Task(
            id="123",
            title="Task",
            description="Desc",
            completed=False,
            created_at=now,
            updated_at=now,
        )
        task2 = Task(
            id="123",
            title="Task",
            description="Desc",
            completed=False,
            created_at=now,
            updated_at=now,
        )

        assert task1 == task2

    def test_tasks_with_different_id_not_equal(self, sample_task: Task) -> None:
        """Tasks with different IDs should not be equal."""
        other = Task(
            id="different_id",
            title=sample_task.title,
            description=sample_task.description,
            completed=sample_task.completed,
            created_at=sample_task.created_at,
            updated_at=sample_task.updated_at,
        )

        assert sample_task != other


class TestTaskValidation:
    """Test Task validation during serialization."""

    def test_task_title_length_in_serialization(self) -> None:
        """Task serialization should preserve title constraints."""
        task = Task(
            id="123",
            title="A" * 200,  # Max length
            description="",
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        task_dict = task.to_dict()
        reconstructed = Task.from_dict(task_dict)
        assert len(reconstructed.title) == 200

    def test_task_description_length_in_serialization(self) -> None:
        """Task serialization should preserve description constraints."""
        task = Task(
            id="123",
            title="Task",
            description="A" * 2000,  # Max length
            completed=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        task_dict = task.to_dict()
        reconstructed = Task.from_dict(task_dict)
        assert len(reconstructed.description) == 2000
