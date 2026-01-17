@echo off
REM Setup script for Evolution of Todo (Windows)

echo.
echo ============================================
echo Evolution of Todo - Windows Setup
echo ============================================
echo.

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

REM Check Node
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 20+
    pause
    exit /b 1
)

echo [1/3] Setting up Backend...
cd backend\phase-2-web

if not exist venv (
    python -m venv venv
)

call venv\Scripts\activate.bat

pip install --upgrade pip >nul 2>&1
pip install -e .[dev] >nul 2>&1

if not exist .env (
    (
        echo DATABASE_URL=postgresql+asyncpg://todo_user:todo_password@localhost:5432/evolution_todo
        echo JWT_SECRET=your-secret-key-change-in-production
        echo JWT_ALGORITHM=HS256
        echo ALLOWED_ORIGINS=http://localhost:3000
    ) > .env
    echo Created .env file
)

cd ..\..

echo [2/3] Setting up Frontend...
cd frontend\phase-2-web

call npm install >nul 2>&1

if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 > .env.local
    echo Created .env.local file
)

cd ..\..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd backend\phase-2-web
echo    venv\Scripts\activate.bat
echo    uvicorn src.main:app --reload
echo.
echo 2. Start Frontend (new terminal):
echo    cd frontend\phase-2-web
echo    npm run dev
echo.
echo 3. Open http://localhost:3000
echo.
echo Optional - Setup Database (Docker):
echo    docker run -d --name evolution-postgres ^
echo      -e POSTGRES_DB=evolution_todo ^
echo      -e POSTGRES_USER=todo_user ^
echo      -e POSTGRES_PASSWORD=todo_password ^
echo      -p 5432:5432 postgres:16-alpine
echo.
pause
