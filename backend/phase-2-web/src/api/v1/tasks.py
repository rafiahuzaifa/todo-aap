from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import io
import csv
import json

from src.db import get_session
from src.models.schemas import User, Task, TaskRead, TaskCreate, TaskUpdate, UserStats
from src.services.auth_service import TaskService
from src.api.v1.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=dict)
async def list_tasks(
    completed: bool | None = Query(None),
    priority: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """List user tasks with filters and pagination"""
    try:
        tasks = await TaskService.list_tasks(
            user_id=current_user.id,
            completed=completed,
            priority=priority,
            session=session,
        )
        
        # Pagination
        total = len(tasks)
        start = (page - 1) * limit
        end = start + limit
        paginated_tasks = tasks[start:end]
        
        return {
            "success": True,
            "data": [TaskRead.model_validate(t) for t in paginated_tasks],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit,
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Create new task"""
    try:
        task = await TaskService.create_task(
            user_id=current_user.id,
            title=data.title,
            description=data.description,
            priority=data.priority,
            due_date=data.due_date,
            session=session,
        )
        return {
            "success": True,
            "task": TaskRead.model_validate(task),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/{task_id}", response_model=dict)
async def get_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Get task by ID"""
    try:
        task = await TaskService.get_task(task_id, current_user.id, session)
        return {
            "success": True,
            "task": TaskRead.model_validate(task),
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.patch("/{task_id}", response_model=dict)
async def update_task(
    task_id: UUID,
    data: TaskUpdate,
    current_user: User = Depends(get_current_user),
) -> dict:
    """Update task"""
    try:
        task = await TaskService.update_task(
            task_id=task_id,
            user_id=current_user.id,
            **data.model_dump(exclude_unset=True),
        )
        return {
            "success": True,
            "task": TaskRead.model_validate(task),
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.delete("/{task_id}", response_model=dict)
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Delete task"""
    try:
        await TaskService.delete_task(task_id, current_user.id, session)
        return {
            "success": True,
            "message": "Task deleted",
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.patch("/{task_id}/complete", response_model=dict)
async def complete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Mark task as complete"""
    try:
        task = await TaskService.complete_task(task_id, current_user.id, session)
        return {
            "success": True,
            "task": TaskRead.model_validate(task),
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )


@router.get("/export/{format}", response_model=None)
async def export_tasks(
    format: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Export tasks as CSV or JSON"""
    if format not in ["csv", "json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format must be csv or json",
        )
    
    try:
        tasks = await TaskService.list_tasks(user_id=current_user.id, session=session)
        
        if format == "csv":
            output = io.StringIO()
            writer = csv.DictWriter(
                output,
                fieldnames=["id", "title", "description", "priority", "completed", "due_date"],
            )
            writer.writeheader()
            for task in tasks:
                writer.writerow({
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description or "",
                    "priority": task.priority,
                    "completed": task.completed,
                    "due_date": task.due_date or "",
                })
            output.seek(0)
            return StreamingResponse(
                iter([output.getvalue()]),
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=tasks.csv"},
            )
        else:  # json
            data = [TaskRead.model_validate(t).model_dump() for t in tasks]
            output = io.BytesIO(json.dumps(data, default=str).encode())
            return StreamingResponse(
                iter([output.getvalue()]),
                media_type="application/json",
                headers={"Content-Disposition": "attachment; filename=tasks.json"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
