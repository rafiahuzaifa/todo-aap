from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID
from jose import jwt, JWTError
from passlib.context import CryptContext
from src.config import settings
from src.models.schemas import User, TokenPayload

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: UUID, email: str, name: str) -> str:
    """Create JWT access token"""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=settings.JWT_EXPIRY)
    
    payload = {
        "sub": str(user_id),
        "email": email,
        "name": name,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "iss": "evolution-todo",
        "aud": "evolution-todo-api",
        "jti": str(UUID(int=abs(hash(f"{user_id}{now}")) % (2**32))),
    }
    
    token = jwt.encode(
        payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return token


def create_refresh_token(user_id: UUID) -> str:
    """Create JWT refresh token"""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=settings.JWT_REFRESH_EXPIRY)
    
    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "iss": "evolution-todo",
        "jti": str(UUID(int=abs(hash(f"{user_id}{now}refresh")) % (2**32))),
    }
    
    token = jwt.encode(
        payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
    )
    return token


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def is_token_expired(exp: int) -> bool:
    """Check if token is expired"""
    now = datetime.now(timezone.utc)
    return now.timestamp() > exp
