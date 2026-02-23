# Quick Git Reference Card 🚀

## TL;DR - Push to GitHub in 5 Commands

```bash
# 1. Check what will be committed (verify .env is NOT listed)
git status

# 2. Create feature branch
git checkout -b feature/personalized-learning

# 3. Add all files (respecting .gitignore)
git add .

# 4. Commit with message
git commit -m "feat: Add personalized learning flow and dashboard improvements"

# 5. Push to GitHub
git push -u origin feature/personalized-learning
```

## Before You Push - Critical Checks ⚠️

```bash
# Verify .env is NOT being tracked
git status | grep .env
# Should return nothing

# Verify node_modules is NOT being tracked
git status | grep node_modules
# Should return nothing

# See what files will be committed
git status
```

## First Time Setup

```bash
# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify it was added
git remote -v
```

## Common Commands

```bash
# See current branch
git branch

# Switch to existing branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# See what changed
git diff

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## Emergency: Remove Sensitive File

```bash
# If you accidentally added .env
git rm --cached server/.env
git commit -m "chore: Remove .env from tracking"
git push

# Then IMMEDIATELY rotate your API keys!
```

## Files That Should NOT Be Committed

❌ `server/.env` - Contains API keys  
❌ `node_modules/` - Too large  
❌ `dist/` - Build artifacts  
❌ `.DS_Store` - macOS files  
❌ `*.log` - Log files  

## Files That SHOULD Be Committed

✅ Source code (`.tsx`, `.ts`, `.js`)  
✅ Documentation (`.md`)  
✅ Configuration (`package.json`, `vite.config.ts`)  
✅ `.gitignore` file  

## Troubleshooting

### Problem: Can't push
```bash
# Pull latest changes first
git pull origin feature/personalized-learning --rebase
git push
```

### Problem: Wrong commit message
```bash
# Change last commit message
git commit --amend -m "New message"
git push --force
```

### Problem: Forgot to create branch
```bash
# Create branch from current state
git checkout -b feature/personalized-learning
git push -u origin feature/personalized-learning
```

## After Pushing

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Fill in PR details
4. Request reviewers
5. Wait for approval
6. Merge to main

## Need More Details?

- **Complete guide**: See `GIT_COMMANDS.md`
- **Feature documentation**: See `BRANCH_README.md`
- **Full checklist**: See `GITHUB_PUSH_CHECKLIST.md`

---

**Remember**: Always check `git status` before committing! 🔍
