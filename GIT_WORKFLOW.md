# Git Workflow & Branch Management for Join-1325

## Branch Structure

### Core Branches
- **main** - Production-ready code (protected)
- **develop** - Integration branch for all features
- **staging** - Pre-production testing environment

### Feature Branches
- **feature/authentication** - User registration, login, logout, guest access
- **feature/dashboard** - Summary page with task counts and time-based greetings
- **feature/task-management** - Add/edit/delete tasks, drag & drop, subtasks
- **feature/contacts** - Contact management (CRUD operations)
- **feature/search** - Search functionality for tasks and contacts
- **feature/mobile-responsive** - Mobile optimization and touch interactions
- **feature/form-validation** - Input validation across all forms
- **feature/legal-pages** - Privacy policy and legal notice pages

### Current Remote Branches
- **origin/feature/board** - Board functionality (existing)
- **origin/koko** - Colleague's branch

## Git Workflow Process

### 1. Starting New Work
```bash
# Always start from the latest develop branch
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/your-feature-name
```

### 2. Working on Features
```bash
# Make your changes and commit regularly
git add .
git commit -m "Add: meaningful commit message

🤖 Generated with Claude Code"

# Push to remote when ready
git push -u origin feature/your-feature-name
```

### 3. Integration Process
```bash
# When feature is complete, merge back to develop
git checkout develop
git pull origin develop
git merge feature/your-feature-name

# Test on staging
git checkout staging
git merge develop

# Clean up feature branch after successful merge
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### 4. Release Process
```bash
# Create release branch from develop
git checkout develop
git checkout -b release/v1.0

# Final testing and bug fixes only
# When ready for production:
git checkout main
git merge release/v1.0
git tag v1.0
git push origin main --tags
```

## Commit Message Convention

### Format:
```
Type: Brief description (50 chars max)

Longer description if needed (72 chars per line)

🤖 Generated with Claude Code
```

### Types:
- **Add**: New feature or functionality
- **Update**: Enhancement to existing feature
- **Fix**: Bug fix
- **Style**: CSS/styling changes
- **Refactor**: Code improvement without feature change
- **Docs**: Documentation updates

### Examples:
```
Add: User registration form with validation

Add: Task drag and drop functionality
- Implement HTML5 drag and drop API
- Add visual feedback during drag
- Update task status on drop

🤖 Generated with Claude Code
```

## Branch Naming Convention

### Feature Branches
- `feature/feature-name` - New functionality
- `feature/dashboard` - Summary page
- `feature/user-auth` - Authentication system

### Bug Fix Branches
- `bugfix/issue-description` - Non-critical bug fixes
- `hotfix/critical-issue` - Emergency production fixes

### Release Branches
- `release/v1.0` - Release preparation
- `release/v1.1` - Minor version updates

## Team Collaboration Rules

### Before Starting Work:
1. Always pull latest changes from develop
2. Create feature branch from develop
3. Communicate with team about overlapping features

### During Development:
1. Commit frequently with clear messages
2. Push to remote regularly to avoid data loss
3. Keep feature branches focused on single functionality

### Code Integration:
1. Test your feature thoroughly before merging
2. Resolve merge conflicts locally before pushing
3. Use pull requests for code review (if using GitHub/GitLab)
4. Delete feature branches after successful merge

### Conflict Resolution:
```bash
# If conflicts occur during merge:
git status
# Edit conflicted files manually
git add .
git commit -m "Resolve: merge conflicts in [file names]"
```

## Project-Specific Considerations

### Firebase Integration:
- Test database changes carefully on develop branch
- Keep Firebase config consistent across branches
- Document database schema changes

### Multi-Page Architecture:
- Coordinate changes to shared assets (CSS, JS utils)
- Test navigation between pages after merges
- Maintain consistent styling across all pages

### Mobile Responsiveness:
- Test responsive changes on multiple screen sizes
- Coordinate with mobile-responsive branch for CSS conflicts
- Verify touch interactions work correctly

## Quick Reference Commands

```bash
# Check current status
git status
git branch

# Switch branches
git checkout branch-name

# Update current branch
git pull origin branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Merge branch into current branch
git merge branch-name

# View commit history
git log --oneline

# Push all local branches to remote
git push --all origin
```

## Emergency Procedures

### Urgent Bug Fix:
```bash
git checkout main
git checkout -b hotfix/critical-issue
# Fix the issue
git add .
git commit -m "Fix: critical issue description"
git checkout main
git merge hotfix/critical-issue
git push origin main
```

### Recover Accidentally Deleted Work:
```bash
git reflog
git checkout commit-hash
git checkout -b recovery-branch
```

This workflow ensures clean collaboration, maintains code quality, and supports the specific requirements of your Join Kanban project.