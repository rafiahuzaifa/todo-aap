"""Task data model for Phase 1 Console Application."""

from dataclasses import dataclass, asdict, field
from datetime import datetime
from uuid import UUID
import json
from typing import Optional, Dict, Any


@dataclass(frozen=True)
class Task:
    """
    Represents a single todo item.
    
    Immutable value object using frozen dataclass.
    
    Attributes:
        id: Unique identifier (UUID format)
        title: Task title (1-200 characters)
        description: Optional task details (0-2000 characters)
        completed: Completion status (default: False)
        created_at: ISO 8601 timestamp of creation (UTC)
        updated_at: ISO 8601 timestamp of last modification (UTC)
    """

    id: str
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    def to_dict(self) -> Dict[str, Any]:
        """
        Serialize Task to dictionary.
        
        Returns:
            Dictionary representation with ISO 8601 timestamps
        """
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Task":
        """
        Deserialize Task from dictionary.
        
        Args:
            data: Dictionary with task fields and ISO 8601 timestamps
            
        Returns:
            Task instance
        """
        return cls(
            id=data["id"],
            title=data["title"],
            description=data["description"],
            completed=data["completed"],
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]),
        )

    def to_json(self) -> str:
        """
        Serialize Task to JSON string.
        
        Returns:
            JSON string representation
        """
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> "Task":
        """
        Deserialize Task from JSON string.
        
        Args:
            json_str: JSON string representation
            
        Returns:
            Task instance
        """
        data = json.loads(json_str)
        return cls.from_dict(data)
