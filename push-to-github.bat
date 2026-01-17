@echo off
REM Evolution Todo - GitHub Push Script
REM This script helps you authenticate and push to GitHub

echo.
echo ========================================
echo   EVOLUTION TODO - GITHUB PUSH HELPER
echo ========================================
echo.

cd C:\Users\HP\Desktop\HACKATHON2

echo 📋 Current Git Status:
git status --short | head -5
echo.

echo Choose authentication method:
echo.
echo [1] Personal Access Token (Recommended)
echo [2] SSH Key
echo [3] GitHub Desktop (Manual)
echo [4] View current remote
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🔑 PERSONAL ACCESS TOKEN METHOD
    echo.
    echo Go to: https://github.com/settings/tokens
    echo Create token with 'repo' scope
    echo.
    set /p token="Paste your PAT token: "
    set /p username="Enter GitHub username (default: rafiahashim): "
    if "%username%"=="" set username=rafiahashim
    
    echo.
    echo Setting up remote with PAT...
    git remote set-url origin https://%username%:%token%@github.com/rafiahashim/todo-hackathon.git
    
    echo Pushing to GitHub...
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo ❌ Push failed. Check your token and try again.
    ) else (
        echo.
        echo ✅ Push successful!
        echo Repository: https://github.com/rafiahashim/todo-hackathon
    )
)

if "%choice%"=="2" (
    echo.
    echo 🔐 SSH KEY METHOD
    echo.
    echo Checking for SSH key...
    if exist "%USERPROFILE%\.ssh\id_ed25519.pub" (
        echo ✅ SSH key found
        echo.
        echo Adding SSH key to GitHub:
        echo 1. Go to: https://github.com/settings/ssh/new
        echo 2. Paste this key:
        echo.
        type "%USERPROFILE%\.ssh\id_ed25519.pub"
        echo.
        echo 3. Save the key
        echo 4. Press any key to continue...
        pause
    ) else (
        echo ❌ SSH key not found
        echo.
        echo Generating new SSH key...
        ssh-keygen -t ed25519 -C "evolution-todo-push" -N "" -f "%USERPROFILE%\.ssh\id_ed25519"
        echo ✅ SSH key generated
        echo.
        echo Add this key to GitHub: https://github.com/settings/ssh/new
        echo Key file: %USERPROFILE%\.ssh\id_ed25519.pub
    )
    
    echo.
    echo Switching to SSH remote...
    git remote set-url origin git@github.com:rafiahashim/todo-hackathon.git
    
    echo Pushing to GitHub...
    git push -u origin main
    
    if errorlevel 1 (
        echo.
        echo ❌ Push failed. Ensure SSH key is added to GitHub.
    ) else (
        echo.
        echo ✅ Push successful!
        echo Repository: https://github.com/rafiahashim/todo-hackathon
    )
)

if "%choice%"=="3" (
    echo.
    echo Opening GitHub Desktop...
    echo Download from: https://desktop.github.com/
    echo.
    echo Manual steps:
    echo 1. Open GitHub Desktop
    echo 2. Sign in with your GitHub account
    echo 3. Add local repository: C:\Users\HP\Desktop\HACKATHON2
    echo 4. Click "Publish repository"
    echo 5. Follow the prompts
)

if "%choice%"=="4" (
    echo.
    echo 📍 Current Remote URL:
    git remote -v
    echo.
)

echo.
echo For more help, see: GITHUB_AUTHENTICATION.md
echo.
pause
