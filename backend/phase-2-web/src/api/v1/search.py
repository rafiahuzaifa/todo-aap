from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_, and_, func
from uuid import UUID

from src.db import get_session
from src.api.v1.auth import get_current_user
from src.models.schemas import User, Task
from src.services.auth_service import TaskService

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/tasks")
async def search_tasks(
    q: str = Query(..., min_length=1),
    priority: str = Query(None),
    status: str = Query(None),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Full-text search for tasks"""
    service = TaskService(session)
    
    # Basic search implementation
    query = session.query(Task).filter(Task.user_id == current_user.id)
    
    # Search in title and description
    query = query.filter(
        or_(
            Task.title.ilike(f"%{q}%"),
            Task.description.ilike(f"%{q}%"),
        )
    )
    
    # Filter by priority
    if priority:
        query = query.filter(Task.priority == priority)
    
    # Filter by status
    if status == "completed":
        query = query.filter(Task.completed == True)
    elif status == "pending":
        query = query.filter(Task.completed == False)
    
    tasks = await session.execute(query)
    results = tasks.scalars().all()
    
    return {
        "success": True,
        "query": q,
        "results": [
            {
                "id": str(t.id),
                "title": t.title,
                "description": t.description,
                "priority": t.priority,
                "completed": t.completed,
            }
            for t in results
        ],
        "total": len(results),
    }

@router.get("/suggestions")
async def search_suggestions(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get search suggestions"""
    query = session.query(Task.title).filter(
        Task.user_id == current_user.id,
        Task.title.ilike(f"%{q}%"),
    ).distinct().limit(5)
    
    results = await session.execute(query)
    suggestions = [row[0] for row in results]
    
    return {
        "success": True,
        "suggestions": suggestions,
    }
