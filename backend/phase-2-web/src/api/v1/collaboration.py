from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from src.db import get_session
from src.api.v1.auth import get_current_user
from src.models.schemas import User, TaskCreate, TaskRead
from src.services.auth_service import TaskService

router = APIRouter(prefix="/tasks", tags=["collaboration"])

@router.post("/{task_id}/share/{user_id}")
async def share_task(
    task_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Share task with another user"""
    service = TaskService(session)
    task = await service.get_task(task_id, current_user.id)
    if not task:
        return {"success": False, "message": "Task not found"}
    
    # TODO: Store task_collaborators in database
    return {
        "success": True,
        "message": f"Task shared with user {user_id}",
        "task_id": str(task_id),
        "shared_with": str(user_id),
    }

@router.post("/{task_id}/comments")
async def add_comment(
    task_id: UUID,
    comment_data: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Add comment to task"""
    # TODO: Store task_comments in database
    return {
        "success": True,
        "comment": comment_data.get("content"),
        "task_id": str(task_id),
        "user_id": str(current_user.id),
    }

@router.get("/{task_id}/activity")
async def get_task_activity(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get task activity log"""
    # TODO: Fetch from task_activity table
    return {
        "success": True,
        "task_id": str(task_id),
        "activities": [],
    }
