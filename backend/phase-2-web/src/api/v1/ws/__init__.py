from fastapi import APIRouter, WebSocket, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import json
from datetime import datetime
from typing import Dict, Set
import logging

from src.db import get_session
from src.security import verify_token
from src.models.schemas import User, Task

logger = logging.getLogger(__name__)

# Store active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[UUID, Set[WebSocket]] = {}
        self.user_presence: Dict[UUID, dict] = {}
    
    async def connect(self, user_id: UUID, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        self.user_presence[user_id] = {
            "id": str(user_id),
            "status": "online",
            "last_seen": datetime.utcnow().isoformat(),
        }
    
    async def disconnect(self, user_id: UUID, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                self.user_presence[user_id]["status"] = "offline"
    
    async def broadcast_task_update(self, task_id: UUID, action: str, data: dict):
        """Broadcast task update to all connected users"""
        message = {
            "type": "task_update",
            "action": action,
            "task_id": str(task_id),
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        for user_connections in self.active_connections.values():
            for connection in list(user_connections):
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting: {e}")
    
    async def send_notification(self, user_id: UUID, notification: dict):
        """Send notification to specific user"""
        if user_id not in self.active_connections:
            return
        
        message = {
            "type": "notification",
            "data": notification,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        for connection in self.active_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error sending notification: {e}")

manager = ConnectionManager()

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/connect/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, session: AsyncSession = Depends(get_session)):
    """WebSocket endpoint for real-time updates"""
    # Verify token
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Invalid token")
        return
    
    user_id = UUID(payload.get("sub"))
    await manager.connect(user_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            
            elif data.get("type") == "task_status":
                # Broadcast task status change
                await manager.broadcast_task_update(
                    UUID(data.get("task_id")),
                    "status_changed",
                    {"status": data.get("status")},
                )
            
            elif data.get("type") == "presence":
                # Update user presence
                manager.user_presence[user_id] = {
                    "id": str(user_id),
                    "status": "online",
                    "last_seen": datetime.utcnow().isoformat(),
                }
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await manager.disconnect(user_id, websocket)
