# .gitignore Recommendations

## For Production Deployment

To keep your production credentials secure, add these entries to your `.gitignore` file:

```gitignore
# Production admin credentials (if using local override)
/utils/adminConfig.local.ts

# Production environment files
.env.production
.env.local

# Build outputs
dist/
build/

# Dependencies
node_modules/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
.cache/
```

## Security Best Practices

### Option 1: Local Override File (Recommended)

1. Create `/utils/adminConfig.local.ts`:
   ```typescript
   export const ADMIN_CONFIG = {
     username: 'your_production_username',
     password: 'your_very_secure_production_password',
   };
   ```

2. Add to `.gitignore`:
   ```gitignore
   /utils/adminConfig.local.ts
   ```

3. Update `/utils/config.ts` to use local if available:
   ```typescript
   try {
     import { ADMIN_CONFIG } from './adminConfig.local';
   } catch {
     import { ADMIN_CONFIG } from './adminConfig';
   }
   ```

### Option 2: Direct File Edit (Simple but less secure)

1. Edit `/utils/adminConfig.ts` directly
2. Change username and password
3. **Do NOT commit** this file after changes
4. Use `git update-index --skip-worktree utils/adminConfig.ts`

### Option 3: Build-Time Configuration

1. Keep default credentials in repo
2. Use build scripts to replace at deployment time
3. Different builds for dev/staging/production

## Current Setup

- **Default credentials** are in `/utils/adminConfig.ts`
- **Production credentials** should be changed before deployment
- **Current defaults**:
  - Username: `admin`
  - Password: `GeetaOlympiad@2025!`

⚠️ **IMPORTANT**: These default credentials are for initial setup only. Change them immediately for production use!

## Deployment Platforms

### Netlify / Vercel
- Use environment variables in the platform dashboard
- Access via build scripts

### Traditional Hosting
- Use server-side configuration files
- Set restrictive file permissions (e.g., 600)
- Keep config files outside web root

### Docker
- Use Docker secrets
- Environment variables in docker-compose
- Separate config for different environments

## Checking for Exposed Credentials

Before committing:
```bash
# Check if credentials are in your commit
git diff --cached

# Search for password patterns
git grep -i "password"

# Check git history for sensitive data
git log -p | grep -i "password"
```

## Recovery from Accidental Commit

If you accidentally committed credentials:

1. **Change the credentials immediately**
2. **Remove from git history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch utils/adminConfig.ts" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (if already pushed):
   ```bash
   git push origin --force --all
   ```
4. **Notify team members** to re-clone

## Recommended .gitignore Template

Create `.gitignore` in your project root:

```gitignore
# Geeta Olympiad - Security
/utils/adminConfig.local.ts
.env.production
.env.local

# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
/dist
/build
/.next/
/out/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
/.vscode
/.idea
*.swp
*.swo
*.swn

# OS
.DS_Store
Thumbs.db

# Testing
/coverage
/.nyc_output

# Misc
*.log
.cache
.temp
```

## Additional Security Measures

1. **Never log credentials** in console or error messages
2. **Use HTTPS** for all production deployments
3. **Enable rate limiting** on admin login
4. **Monitor failed login attempts**
5. **Regular credential rotation** (change every 3-6 months)
6. **Two-factor authentication** (consider adding)
7. **IP whitelisting** for admin access (optional)

## Questions?

- Review `/PRODUCTION_CHECKLIST.md` for full security checklist
- See `/PRODUCTION_READY.md` for deployment guide
- Check `/CONFIGURATION_GUIDE.md` for configuration options
