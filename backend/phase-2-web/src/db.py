from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel
from src.config import settings
from typing import AsyncGenerator


# Create async engine - use SQLite for local dev if no postgres available
db_url = settings.DATABASE_URL
if "postgresql" in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")
else:
    db_url = "sqlite+aiosqlite:///./evolution_todo.db"

engine = create_async_engine(
    db_url,
    echo=settings.DB_ECHO,
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {},
)

# Create async session factory
async_session_factory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False, future=True
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get database session"""
    async with async_session_factory() as session:
        yield session


async def init_db() -> None:
    """Initialize database"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """Close database"""
    await engine.dispose()
