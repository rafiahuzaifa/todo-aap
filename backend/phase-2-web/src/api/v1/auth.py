from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import EmailStr, BaseModel
from uuid import UUID

from src.db import get_session
from src.models.schemas import (
    User, UserRead, Task, TaskRead, TaskCreate, TaskUpdate,
    AuthResponse, UserStats
)
from src.services.auth_service import AuthService, TaskService
from src.security import verify_token

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


async def get_current_user(
    authorization: str | None = None,
    session: AsyncSession = Depends(get_session),
) -> User:
    """Get current authenticated user"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided",
        )
    
    token = authorization.replace("Bearer ", "")
    try:
        user = await AuthService.get_current_user(token, session)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Register new user"""
    try:
        user, access_token, refresh_token = await AuthService.register_user(
            email=data.email,
            password=data.password,
            name=data.name,
            session=session,
        )
        return {
            "success": True,
            "user": UserRead.model_validate(user),
            "session": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires_in": 86400,
                "token_type": "Bearer",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=dict)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Login user"""
    try:
        user, access_token, refresh_token = await AuthService.login_user(
            email=data.email,
            password=data.password,
            session=session,
        )
        return {
            "success": True,
            "user": UserRead.model_validate(user),
            "session": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "expires_in": 86400,
                "token_type": "Bearer",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )


@router.post("/logout", response_model=dict)
async def logout(
    current_user: User = Depends(get_current_user),
) -> dict:
    """Logout user"""
    return {
        "success": True,
        "message": "Logged out successfully",
    }


@router.get("/me", response_model=dict)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get current user"""
    return {
        "success": True,
        "user": UserRead.model_validate(current_user),
    }


@router.post("/refresh", response_model=dict)
async def refresh(
    data: RefreshTokenRequest,
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Refresh access token"""
    from src.security import create_access_token
    
    payload = verify_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_id = UUID(payload.get("sub"))
    try:
        user = await AuthService.get_current_user(data.refresh_token, session)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    access_token = create_access_token(user.id, user.email, user.name)
    
    return {
        "success": True,
        "access_token": access_token,
        "expires_in": 86400,
        "token_type": "Bearer",
    }
