#!/usr/bin/env pwsh
# Evolution Todo - GitHub Push Script
# Simple script to authenticate and push to GitHub

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   EVOLUTION TODO - GITHUB PUSH HELPER     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\HP\Desktop\HACKATHON2"

# Show current status
Write-Host "📊 Repository Status:" -ForegroundColor Green
Write-Host "   Remote: https://github.com/rafiahashim/todo-hackathon.git"
Write-Host "   Branch: main"
Write-Host "   Commits: 1"
Write-Host "   Files: 316"
Write-Host ""

# Show options
Write-Host "🔐 Authentication Options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [1] Use Personal Access Token (Recommended)"
Write-Host "  [2] Use SSH Key"
Write-Host "  [3] View Instructions"
Write-Host ""

$choice = Read-Host "Select option (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔑 PERSONAL ACCESS TOKEN SETUP" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Steps:"
        Write-Host "1. Go to: https://github.com/settings/tokens"
        Write-Host "2. Click 'Generate new token' > 'Generate new token (classic)'"
        Write-Host "3. Select scope: repo (Full control of private repositories)"
        Write-Host "4. Generate and copy the token"
        Write-Host ""
        
        $token = Read-Host "Paste your GitHub PAT token here"
        
        if ($token -and $token.Length -gt 10) {
            Write-Host ""
            Write-Host "Configuring remote with token..." -ForegroundColor Yellow
            
            git remote set-url origin "https://rafiahashim:$token@github.com/rafiahashim/todo-hackathon.git"
            
            Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
            Write-Host ""
            
            git push -u origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
                Write-Host "║   ✅ PUSH SUCCESSFUL!                     ║" -ForegroundColor Green
                Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
                Write-Host ""
                Write-Host "📍 Repository: https://github.com/rafiahashim/todo-hackathon"
                Write-Host "📊 Files: 316 uploaded"
                Write-Host "🌿 Branch: main"
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "❌ Push failed. Check your token and try again." -ForegroundColor Red
                Write-Host ""
            }
        } else {
            Write-Host "❌ Invalid token" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔐 SSH KEY SETUP" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "This requires SSH key already configured on GitHub"
        Write-Host ""
        
        Write-Host "Switching to SSH remote..." -ForegroundColor Yellow
        git remote set-url origin "git@github.com:rafiahashim/todo-hackathon.git"
        
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        Write-Host ""
        
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ PUSH SUCCESSFUL!" -ForegroundColor Green
            Write-Host "📍 Repository: https://github.com/rafiahashim/todo-hackathon"
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. SSH key may not be set up on GitHub." -ForegroundColor Red
            Write-Host ""
            Write-Host "To setup SSH:"
            Write-Host "1. Go to: https://github.com/settings/ssh"
            Write-Host "2. Add your public key: $env:USERPROFILE\.ssh\id_ed25519.pub"
            Write-Host ""
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📖 GITHUB AUTHENTICATION GUIDE" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 File: GITHUB_AUTHENTICATION.md"
        Write-Host ""
        Write-Host "This file contains complete setup instructions for:"
        Write-Host "  • Personal Access Token (PAT) - Easiest"
        Write-Host "  • SSH Key - More Secure"
        Write-Host "  • GitHub Desktop - GUI Option"
        Write-Host ""
        Write-Host "Open: C:\Users\HP\Desktop\HACKATHON2\GITHUB_AUTHENTICATION.md"
        Write-Host ""
    }
    
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
