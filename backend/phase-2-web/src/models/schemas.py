from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr


# Database Models (with table=True)
class User(SQLModel, table=True):
    """User model with database representation"""
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: EmailStr = Field(index=True, unique=True)
    name: str = Field(min_length=2, max_length=100)
    password_hash: str
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    email_verified_at: Optional[datetime] = Field(default=None)
    last_login_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user", cascade_delete=True)
    sessions: list["Session"] = Relationship(back_populates="user", cascade_delete=True)
    audit_logs: list["AuditLog"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """Task model with database representation"""
    __tablename__ = "tasks"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", max_length=10)
    due_date: Optional[datetime] = Field(default=None)
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="tasks")


class Session(SQLModel, table=True):
    """Session/Token model"""
    __tablename__ = "sessions"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    access_token: str = Field(max_length=1024)
    refresh_token: str = Field(max_length=1024)
    token_type: str = Field(default="Bearer", max_length=20)
    expires_at: datetime
    revoked_at: Optional[datetime] = Field(default=None, index=True)
    ip_address: Optional[str] = Field(default=None)
    user_agent: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="sessions")


class AuditLog(SQLModel, table=True):
    """Audit log model for tracking actions"""
    __tablename__ = "audit_logs"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: Optional[UUID] = Field(default=None, foreign_key="users.id", index=True)
    action: str = Field(max_length=50, index=True)
    resource_type: str = Field(max_length=50, index=True)
    resource_id: UUID = Field(index=True)
    changes: Optional[str] = Field(default=None)
    old_values: Optional[str] = Field(default=None)
    new_values: Optional[str] = Field(default=None)
    ip_address: Optional[str] = Field(default=None)
    user_agent: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="audit_logs")


# Response/Request schemas (no table=True)
class UserBase(SQLModel):
    """Base user model for requests"""
    email: EmailStr
    name: str


class UserRead(UserBase):
    """User response model"""
    id: UUID
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    """User creation model"""
    password: str


class TaskBase(SQLModel):
    """Base task model"""
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None
    completed: bool = False


class TaskRead(TaskBase):
    """Task response model"""
    id: UUID
    user_id: UUID
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    """Task creation model"""
    pass


class TaskUpdate(SQLModel):
    """Task update model"""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


class AuthResponse(SQLModel):
    """Authentication response"""
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str


class TokenPayload(SQLModel):
    """JWT token payload"""
    sub: str  # subject (user_id)
    email: str
    name: str
    iat: int  # issued at
    exp: int  # expires at
    iss: str  # issuer
    aud: str  # audience


class UserStats(SQLModel):
    """User statistics"""
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    high_priority_pending: int
    overdue_tasks: int
    last_task_created: Optional[datetime]
    last_login: Optional[datetime]
