from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from datetime import datetime, timedelta

from src.db import get_session
from src.api.v1.auth import get_current_user
from src.models.schemas import User, Task

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get comprehensive dashboard statistics"""
    # Get total tasks
    total_query = session.query(func.count(Task.id)).filter(Task.user_id == current_user.id)
    total_result = await session.execute(total_query)
    total_tasks = total_result.scalar() or 0
    
    # Get completed tasks
    completed_query = session.query(func.count(Task.id)).filter(
        Task.user_id == current_user.id,
        Task.completed == True,
    )
    completed_result = await session.execute(completed_query)
    completed_tasks = completed_result.scalar() or 0
    
    # Get completion rate
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Get pending high-priority tasks
    high_priority_query = session.query(func.count(Task.id)).filter(
        Task.user_id == current_user.id,
        Task.completed == False,
        Task.priority == "high",
    )
    high_priority_result = await session.execute(high_priority_query)
    high_priority_tasks = high_priority_result.scalar() or 0
    
    return {
        "success": True,
        "stats": {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": total_tasks - completed_tasks,
            "completion_rate": round(completion_rate, 2),
            "high_priority_pending": high_priority_tasks,
        },
    }

@router.get("/completion-trends")
async def get_completion_trends(
    days: int = 7,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get task completion trends"""
    trends = []
    for i in range(days):
        date = datetime.utcnow() - timedelta(days=i)
        query = session.query(func.count(Task.id)).filter(
            Task.user_id == current_user.id,
            Task.completed == True,
            func.date(Task.completed_at) == date.date(),
        )
        result = await session.execute(query)
        count = result.scalar() or 0
        trends.append({"date": date.date().isoformat(), "completed": count})
    
    return {
        "success": True,
        "trends": list(reversed(trends)),
    }

@router.get("/priority-distribution")
async def get_priority_distribution(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get task distribution by priority"""
    priorities = ["low", "medium", "high"]
    distribution = {}
    
    for priority in priorities:
        query = session.query(func.count(Task.id)).filter(
            Task.user_id == current_user.id,
            Task.priority == priority,
        )
        result = await session.execute(query)
        distribution[priority] = result.scalar() or 0
    
    return {
        "success": True,
        "distribution": distribution,
    }
