from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from src.db import get_session
from src.models.schemas import User, UserStats
from src.services.auth_service import TaskService
from src.api.v1.auth import get_current_user

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary", response_model=dict)
async def get_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Get user task statistics"""
    try:
        stats = await TaskService.get_user_stats(current_user.id, session)
        return {
            "success": True,
            "data": stats,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.get("/trends", response_model=dict)
async def get_trends(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Get task completion trends for the last N days"""
    try:
        from sqlalchemy import select, and_
        from src.models.schemas import Task
        
        trends = []
        for i in range(days):
            day = datetime.utcnow() - timedelta(days=i)
            start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
            
            stmt = select(Task).where(
                and_(
                    Task.user_id == current_user.id,
                    Task.completed_at >= start,
                    Task.completed_at < end,
                    Task.deleted_at.is_(None),
                )
            )
            result = await session.execute(stmt)
            completed = len(result.scalars().all())
            
            trends.append({
                "date": start.date().isoformat(),
                "completed": completed,
            })
        
        return {
            "success": True,
            "data": list(reversed(trends)),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
