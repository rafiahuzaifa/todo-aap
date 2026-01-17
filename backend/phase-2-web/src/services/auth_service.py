from uuid import UUID
from datetime import datetime
from sqlalchemy import select, func
from sqlmodel import Session, and_
from src.models.schemas import User, Task, Session as SessionModel
from src.security import hash_password, verify_password, create_access_token, create_refresh_token
from src.db import async_session_factory
from sqlalchemy.ext.asyncio import AsyncSession


class AuthService:
    """Authentication service"""
    
    @staticmethod
    async def register_user(
        email: str, password: str, name: str, session: AsyncSession
    ) -> tuple[User, str, str]:
        """Register new user"""
        # Check if user exists
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        if result.scalars().first():
            raise ValueError("Email already registered")
        
        # Create user
        user = User(
            email=email,
            name=name,
            password_hash=hash_password(password),
        )
        session.add(user)
        await session.flush()
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email, user.name)
        refresh_token = create_refresh_token(user.id)
        
        # Store session
        db_session = SessionModel(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=datetime.utcnow() + __import__('datetime').timedelta(days=1),
        )
        session.add(db_session)
        await session.commit()
        
        return user, access_token, refresh_token
    
    @staticmethod
    async def login_user(
        email: str, password: str, session: AsyncSession
    ) -> tuple[User, str, str]:
        """Login user"""
        # Find user
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        user = result.scalars().first()
        
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials")
        
        # Update last login
        user.last_login_at = datetime.utcnow()
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email, user.name)
        refresh_token = create_refresh_token(user.id)
        
        # Store session
        db_session = SessionModel(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=datetime.utcnow() + __import__('datetime').timedelta(days=1),
        )
        session.add(db_session)
        await session.commit()
        
        return user, access_token, refresh_token
    
    @staticmethod
    async def get_current_user(
        token: str, session: AsyncSession
    ) -> User:
        """Get current user from token"""
        from src.security import verify_token
        
        payload = verify_token(token)
        if not payload:
            raise ValueError("Invalid token")
        
        user_id = UUID(payload.get("sub"))
        
        # Verify session not revoked
        stmt = select(SessionModel).where(
            and_(
                SessionModel.access_token == token,
                SessionModel.revoked_at.is_(None),
            )
        )
        result = await session.execute(stmt)
        db_session = result.scalars().first()
        
        if not db_session:
            raise ValueError("Session revoked")
        
        # Get user
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        user = result.scalars().first()
        
        if not user:
            raise ValueError("User not found")
        
        return user


class TaskService:
    """Task service"""
    
    @staticmethod
    async def create_task(
        user_id: UUID, title: str, description: str | None,
        priority: str, due_date: datetime | None, session: AsyncSession
    ) -> Task:
        """Create task"""
        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            priority=priority,
            due_date=due_date,
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task
    
    @staticmethod
    async def list_tasks(
        user_id: UUID, completed: bool | None = None,
        priority: str | None = None, session: AsyncSession | None = None
    ) -> list[Task]:
        """List tasks"""
        if session is None:
            async with async_session_factory() as session:
                return await TaskService.list_tasks(user_id, completed, priority, session)
        
        stmt = select(Task).where(
            and_(
                Task.user_id == user_id,
                Task.deleted_at.is_(None),
            )
        )
        
        if completed is not None:
            stmt = stmt.where(Task.completed == completed)
        if priority is not None:
            stmt = stmt.where(Task.priority == priority)
        
        stmt = stmt.order_by(Task.created_at.desc())
        result = await session.execute(stmt)
        return result.scalars().all()
    
    @staticmethod
    async def get_task(
        task_id: UUID, user_id: UUID, session: AsyncSession
    ) -> Task:
        """Get task by ID"""
        stmt = select(Task).where(
            and_(
                Task.id == task_id,
                Task.user_id == user_id,
                Task.deleted_at.is_(None),
            )
        )
        result = await session.execute(stmt)
        task = result.scalars().first()
        
        if not task:
            raise ValueError("Task not found")
        
        return task
    
    @staticmethod
    async def update_task(
        task_id: UUID, user_id: UUID, **kwargs: dict
    ) -> Task:
        """Update task"""
        async with async_session_factory() as session:
            task = await TaskService.get_task(task_id, user_id, session)
            
            for key, value in kwargs.items():
                if value is not None:
                    setattr(task, key, value)
            
            task.updated_at = datetime.utcnow()
            session.add(task)
            await session.commit()
            await session.refresh(task)
            return task
    
    @staticmethod
    async def delete_task(
        task_id: UUID, user_id: UUID, session: AsyncSession
    ) -> None:
        """Soft delete task"""
        task = await TaskService.get_task(task_id, user_id, session)
        task.deleted_at = datetime.utcnow()
        session.add(task)
        await session.commit()
    
    @staticmethod
    async def complete_task(
        task_id: UUID, user_id: UUID, session: AsyncSession
    ) -> Task:
        """Mark task as complete"""
        task = await TaskService.get_task(task_id, user_id, session)
        task.completed = True
        task.completed_at = datetime.utcnow()
        task.updated_at = datetime.utcnow()
        session.add(task)
        await session.commit()
        await session.refresh(task)
        return task
    
    @staticmethod
    async def get_user_stats(
        user_id: UUID, session: AsyncSession
    ) -> dict:
        """Get user task statistics"""
        stmt = select(Task).where(
            and_(
                Task.user_id == user_id,
                Task.deleted_at.is_(None),
            )
        )
        result = await session.execute(stmt)
        tasks = result.scalars().all()
        
        total = len(tasks)
        completed = sum(1 for t in tasks if t.completed)
        pending = total - completed
        high_priority_pending = sum(
            1 for t in tasks if t.priority == "high" and not t.completed
        )
        overdue = sum(
            1 for t in tasks
            if t.due_date and t.due_date < datetime.utcnow() and not t.completed
        )
        
        return {
            "total_tasks": total,
            "completed_tasks": completed,
            "pending_tasks": pending,
            "high_priority_pending": high_priority_pending,
            "overdue_tasks": overdue,
        }
