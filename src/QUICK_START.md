# Quick Start Guide

## ✅ All Errors Fixed!

The following issues have been resolved:
1. ✅ Dialog ref warning - Updated `DialogOverlay` to use `React.forwardRef`
2. ✅ Auth Hook authorization error - Switched to mock mode by default

## Current Setup

Your application is now running in **Mock Mode**:
- 🔧 No external dependencies required
- 🔐 Demo OTP: **1234**
- 💾 Data stored in browser localStorage
- 👨‍💼 Admin login: `admin` / `admin123`

## Try It Now

1. **Register/Login:**
   - Click "Register" button
   - Choose Email or Phone
   - Enter any email/phone
   - Use OTP: **1234**

2. **Create Profile:**
   - Fill in your details
   - PRN, Date of Birth, Language
   - Click "Create Profile"

3. **Take Mock Quiz:**
   - Go to Dashboard
   - Click "Start Mock Quiz"
   - Answer 10 questions
   - See your score!

4. **Admin Panel:**
   - Click "Login as Admin"
   - Username: `admin`
   - Password: `admin123`
   - Review submissions and manage scores

## Configuration

All settings are in `/utils/config.ts`. Key settings:

```typescript
// Authentication mode
export const AUTH_MODE = 'mock'; // 'mock' or 'supabase'

// Quiz timing
quiz1Time: 1800, // 30 minutes

// Default country code for phone
DEFAULT_COUNTRY_CODE = '+91'
```

## Switch to Supabase (Production)

When ready to use real authentication:

1. **Configure Supabase:**
   - Enable Phone/Email provider
   - Configure SMS service
   - Set up Auth Hooks properly

2. **Update Config:**
   ```typescript
   // In /utils/config.ts
   export const AUTH_MODE = 'supabase';
   ```

3. **Test:**
   - Start with email OTP (easier)
   - Then configure phone OTP
   - Check Supabase logs for any errors

See `CONFIGURATION_GUIDE.md` for detailed instructions.

## File Structure

```
/utils/config.ts          - ⚙️ Main configuration (change AUTH_MODE here!)
/utils/apiProxy.ts        - 🔄 API routing
/utils/supabaseClient.ts  - 📡 Supabase setup
/utils/mockDb.ts          - 💾 Mock database

/components/portal/       - 📱 All portal pages
/components/ui/          - 🎨 UI components
/contexts/AppContext.tsx - 🌐 Global state
```

## Common Tasks

### Change Quiz Time Limit
Edit `/utils/config.ts`:
```typescript
quiz1Time: 3600, // Change to 60 minutes
```

### Change Country Code
Edit `/utils/config.ts`:
```typescript
DEFAULT_COUNTRY_CODE = '+1' // USA instead of India
```

### Switch Authentication Mode
Edit `/utils/config.ts`:
```typescript
AUTH_MODE = 'supabase' // Switch from mock to real
```

## Troubleshooting

### Can't Login?
- Make sure you're using OTP: **1234** (in mock mode)
- Clear browser cache/localStorage
- Check console for errors

### Dialog Warning?
- This has been fixed in the latest version
- If you still see it, clear browser cache

### Want to Reset Everything?
Open browser console and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Next Steps

1. ✅ Test all features in mock mode
2. 📝 Customize quiz questions in `/utils/quizData.ts`
3. 🎨 Adjust styling if needed
4. 🚀 When ready, switch to Supabase mode
5. 📊 Monitor usage and performance

## Support

- **Configuration Issues:** See `CONFIGURATION_GUIDE.md`
- **Supabase Setup:** See `SUPABASE_AUTH_HOOKS_GUIDE.md`
- **Architecture:** See `BACKEND_ARCHITECTURE.md`
- **Portal Features:** See `PORTAL_README.md`

Happy testing! 🎉
