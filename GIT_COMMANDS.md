# Git Commands for Pushing to GitHub

## Prerequisites Checklist

Before running these commands, ensure:

- ✅ `.gitignore` file is created (excludes sensitive files)
- ✅ `server/.env` file is NOT being tracked (contains API keys)
- ✅ All code changes are complete and tested
- ✅ You have a GitHub repository URL ready

## Step-by-Step Git Workflow

### 1. Check Current Status

First, verify what files will be committed:

```bash
git status
```

**Expected Output**: Should NOT show:
- `server/.env`
- `node_modules/`
- `dist/`
- `.DS_Store`

If you see these files, the `.gitignore` is not working properly.

### 2. Initialize Git (If Not Already Done)

If this is a new repository:

```bash
git init
```

### 3. Add Remote Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub details:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Or if using SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Verify remote was added**:
```bash
git remote -v
```

### 4. Create and Switch to Feature Branch

```bash
git checkout -b feature/personalized-learning
```

### 5. Add All Files (Respecting .gitignore)

```bash
git add .
```

**Important**: The `.gitignore` file will automatically exclude:
- `server/.env` (CRITICAL - contains API keys)
- `node_modules/`
- `dist/`
- Build artifacts
- Log files

### 6. Verify What Will Be Committed

Double-check that sensitive files are excluded:

```bash
git status
```

**Look for these files** (they should appear):
- ✅ `.gitignore`
- ✅ `BRANCH_README.md`
- ✅ `GIT_COMMANDS.md`
- ✅ Source code files
- ✅ Documentation files

**These should NOT appear**:
- ❌ `server/.env`
- ❌ `node_modules/`
- ❌ `dist/`

### 7. Commit Changes

```bash
git commit -m "feat: Add personalized learning flow and dashboard improvements

- Implement dynamic AI responses based on user progress
- Add RAG pipeline with topic filtering
- Enhance quiz generation system
- Update dashboard with progress tracking
- Add comprehensive documentation and tests"
```

### 8. Push to GitHub

**First time pushing this branch**:

```bash
git push -u origin feature/personalized-learning
```

**Subsequent pushes**:

```bash
git push
```

## Alternative: Push to Main Branch

If you want to push directly to main (not recommended for features):

```bash
# Make sure you're on main branch
git checkout main

# Add and commit
git add .
git commit -m "feat: Add personalized learning flow and dashboard improvements"

# Push to main
git push -u origin main
```

## Creating a Pull Request

After pushing your branch:

1. Go to your GitHub repository
2. Click "Compare & pull request" button
3. Fill in the PR details:
   - **Title**: "Add Personalized Learning Flow and Dashboard Improvements"
   - **Description**: Copy content from `BRANCH_README.md`
4. Request reviewers (if applicable)
5. Click "Create pull request"

## Troubleshooting

### Problem: `.env` file is being tracked

**Solution**:
```bash
# Remove .env from Git tracking (but keep the file locally)
git rm --cached server/.env

# Commit the removal
git commit -m "chore: Remove .env from version control"

# Push changes
git push
```

### Problem: `node_modules/` is being tracked

**Solution**:
```bash
# Remove node_modules from Git tracking
git rm -r --cached node_modules/
git rm -r --cached server/node_modules/

# Commit the removal
git commit -m "chore: Remove node_modules from version control"

# Push changes
git push
```

### Problem: Remote already exists

**Solution**:
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Problem: Branch already exists on remote

**Solution**:
```bash
# Force push (use with caution!)
git push -f origin feature/personalized-learning
```

### Problem: Merge conflicts

**Solution**:
```bash
# Pull latest changes
git pull origin main

# Resolve conflicts in your editor
# After resolving, add the files
git add .

# Commit the merge
git commit -m "chore: Resolve merge conflicts"

# Push changes
git push
```

## Verifying the Push

After pushing, verify on GitHub:

1. Go to your repository URL
2. Switch to the `feature/personalized-learning` branch
3. Check that:
   - ✅ All source files are present
   - ✅ Documentation files are present
   - ❌ `server/.env` is NOT visible
   - ❌ `node_modules/` is NOT visible

## Environment Variables Setup for Team

Since `.env` is not committed, team members need to create their own:

**Share this template** (via secure channel, not Git):

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Instructions for team**:
1. Create `server/.env` file
2. Copy the template above
3. Replace placeholder values with actual credentials
4. Never commit this file to Git

## Quick Reference

```bash
# Check status
git status

# Create and switch to branch
git checkout -b feature/personalized-learning

# Add all files
git add .

# Commit with message
git commit -m "feat: Add personalized learning flow"

# Push to remote
git push -u origin feature/personalized-learning

# Check what's being tracked
git ls-files

# Check if .env is tracked (should return nothing)
git ls-files | grep .env
```

## Security Reminders

🔒 **NEVER commit these files**:
- `server/.env` - Contains API keys
- `.env` - Any environment files
- `node_modules/` - Dependencies (too large)
- `dist/` - Build artifacts (regenerated)
- API keys or secrets in code

🔒 **If you accidentally commit secrets**:
1. Immediately rotate/regenerate the API keys
2. Remove from Git history using `git filter-branch` or BFG Repo-Cleaner
3. Force push the cleaned history
4. Update `.gitignore` to prevent future accidents

## Next Steps

After successfully pushing:

1. ✅ Create a Pull Request on GitHub
2. ✅ Add reviewers
3. ✅ Run CI/CD tests (if configured)
4. ✅ Address review comments
5. ✅ Merge to main branch
6. ✅ Deploy to production (if applicable)

---

**Need Help?**
- Check GitHub documentation: https://docs.github.com
- Git documentation: https://git-scm.com/doc
- Contact your team lead or DevOps engineer
