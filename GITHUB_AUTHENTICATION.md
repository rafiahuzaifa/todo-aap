# 🚀 GitHub Push - Complete Authentication Guide

## Issue: Permission Denied (403)

The repository is committed locally but needs authentication to push to GitHub.

---

## QUICK FIX - Option 1: Personal Access Token (PAT) - RECOMMENDED

### Step 1: Create GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. **Token Name:** `evolution-todo-push`
4. **Expiration:** 90 days (or custom)
5. **Scopes:** Check `repo` (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** (won't show again!)

### Step 2: Push with Token

```bash
cd C:\Users\HP\Desktop\HACKATHON2

# Replace <YOUR_TOKEN> with your actual PAT
git remote set-url origin https://rafiahashim:<YOUR_TOKEN>@github.com/rafiahashim/todo-hackathon.git

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote set-url origin https://rafiahashim:ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890@github.com/rafiahashim/todo-hackathon.git
git push -u origin main
```

---

## Option 2: SSH Setup (More Secure - Long Term)

### Step 1: Generate SSH Key
```bash
# Open PowerShell as Administrator
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter 3 times (use default path and no passphrase)
```

### Step 2: Add SSH Key to GitHub
1. Go to: https://github.com/settings/ssh/new
2. Run this to copy SSH key:
```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub | clip
```
3. Paste in GitHub SSH Keys section
4. Name it: `Evolution Todo Push`
5. Click "Add SSH key"

### Step 3: Update Remote & Push
```bash
cd C:\Users\HP\Desktop\HACKATHON2

# Switch to SSH URL
git remote set-url origin git@github.com:rafiahashim/todo-hackathon.git

# Push to GitHub
git push -u origin main
```

---

## Option 3: Use GitHub Desktop App

1. Download: https://desktop.github.com/
2. Sign in with your GitHub account
3. Open repository: `C:\Users\HP\Desktop\HACKATHON2`
4. Click "Publish repository"
5. Follow the prompts

---

## Verify Push Success

After pushing, verify at:
```
https://github.com/rafiahashim/todo-hackathon
```

You should see:
- ✅ 316 files uploaded
- ✅ Main branch active
- ✅ Latest commit: "🚀 Evolution Todo..."

---

## Troubleshooting

**Still getting 403?**
- Check token has `repo` scope
- Token might be expired
- GitHub account might not have write access

**Can't generate SSH key?**
- OpenSSH might not be installed
- Run: `Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'`

**Need more help?**
- GitHub Docs: https://docs.github.com/en/authentication
- Contact GitHub Support

---

## Next Steps

1. ✅ Generate PAT or SSH key
2. ✅ Run push command with authentication
3. ✅ Verify files on GitHub
4. ✅ Share repository link!

**Repository:** https://github.com/rafiahashim/todo-hackathon
