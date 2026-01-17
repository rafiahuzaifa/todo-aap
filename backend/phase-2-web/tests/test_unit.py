import pytest


def test_imports():
    """Test basic imports"""
    from src.config import settings
    from src.db import engine, async_session_factory
    from src.security import hash_password, verify_password
    from src.models.schemas import User, Task, Session
    from src.main import app
    
    assert settings is not None
    assert engine is not None
    assert app is not None


def test_config():
    """Test configuration"""
    from src.config import settings
    
    assert settings.PROJECT_NAME == "Evolution of Todo - Phase 2"
    assert settings.VERSION == "2.0.0"
    assert settings.JWT_ALGORITHM == "HS256"
    assert settings.JWT_EXPIRY == 86400  # 24 hours
    assert settings.JWT_REFRESH_EXPIRY == 2592000  # 30 days
