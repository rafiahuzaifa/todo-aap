from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Project
    PROJECT_NAME: str = "Evolution of Todo - Phase 2"
    VERSION: str = "2.0.0"
    ENV: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/evolution_todo_db"
    DB_ECHO: bool = False
    
    # Authentication
    AUTH_SECRET: str = "dev_secret_key_min_32_chars_exactly"
    JWT_SECRET: str = "dev_jwt_secret_key_min_32_chars_exactly"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY: int = 86400  # 24 hours
    JWT_REFRESH_EXPIRY: int = 2592000  # 30 days
    
    # Security
    BCRYPT_ROUNDS: int = 12
    
    # API
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost"]
    
    # OAuth (optional)
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
