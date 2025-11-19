# 🚀 START HERE - Geeta Olympiad Portal

Welcome! This guide will get you up and running in minutes.

## 🎯 Current Status

✅ **All Critical Errors Fixed**
- ✅ `process is not defined` - FIXED
- ✅ Dialog ref warning - FIXED
- ✅ Mock/demo messages - REMOVED
- ⚠️ Supabase Auth Hook - Needs configuration

## 🚨 Known Issue: Auth Hook Errors

If you're seeing either of these errors when trying to send OTP:
```json
{"code":"unexpected_failure","message":"Hook requires authorization token"}
{"code":"unexpected_failure","message":"Invalid payload sent to hook"}
```

**👉 Quick Fix (5 minutes):** See `/QUICK_FIX.md` or `/AUTH_HOOK_DISABLE_GUIDE.md`

**👉 Run Diagnostic:** See `/DIAGNOSTIC_SCRIPT.md` to identify the exact issue

**TLDR:**
1. Open Supabase Dashboard
2. Go to Authentication → Hooks
3. **Delete all Auth Hooks**
4. Go to Authentication → Providers → Email
5. **Enable Email provider**
6. Done! ✅

## 🏃 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Change Admin Credentials

⚠️ **Important:** Change these before deploying!

Edit `/utils/adminConfig.ts`:
```typescript
export const ADMIN_CONFIG = {
  username: 'your_username',      // ← Change this
  password: 'YourSecurePassword', // ← Change this
};
```

### 3. Configure Supabase (If Using Real Auth)

**Option A: Use Email OTP (Simplest)**
1. Supabase Dashboard → Authentication → Providers → Email
2. Enable "Email provider"
3. Delete any Auth Hooks (Authentication → Hooks)

**Option B: Use Mock Mode (For Testing)**
Edit `/utils/config.ts`:
```typescript
export const AUTH_MODE = 'mock';  // Change from 'supabase'
```
Then use OTP: `1234` for any email/phone.

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

### 5. Test the App
- **Register:** Use email OTP (simplest)
- **Create Profile:** Add your details
- **Take Practice Quiz:** Test the system
- **Admin Login:** Use credentials from step 2

## 📚 Documentation Quick Links

### 🆘 Having Issues?
- **"Hook requires authorization token"** → `/QUICK_FIX.md` (5 min fix)
- **Any Auth error** → `/ERROR_REFERENCE.md` (all errors listed)
- **Testing Supabase** → `/SUPABASE_TEST.md` (test scripts)

### ⚙️ Configuration
- **Main Config** → `/utils/config.ts`
- **Admin Credentials** → `/utils/adminConfig.ts`
- **Configuration Guide** → `/CONFIGURATION_GUIDE.md`

### 🚀 Deployment
- **Quick Summary** → `/DEPLOYMENT_SUMMARY.md`
- **Full Checklist** → `/PRODUCTION_CHECKLIST.md`
- **Production Guide** → `/PRODUCTION_READY.md`
- **Security** → `/GITIGNORE_RECOMMENDATIONS.md`

### 🔧 Supabase Setup
- **Quick Fix** → `/QUICK_FIX.md` (Auth Hook error)
- **Detailed Fix** → `/SUPABASE_AUTH_HOOK_FIX.md`
- **Auth Hooks Guide** → `/SUPABASE_AUTH_HOOKS_GUIDE.md`
- **Test Scripts** → `/SUPABASE_TEST.md`

### 📖 General
- **README** → `/README.md` (overview)
- **Portal Features** → `/PORTAL_README.md`
- **Architecture** → `/BACKEND_ARCHITECTURE.md`

## 🎮 Feature Overview

### For Users:
- ✅ Phone & Email OTP Authentication
- ✅ Multiple profiles per account
- ✅ Practice Quiz (unlimited attempts)
- ✅ Main Quizzes (Quiz 1, 2, 3)
- ✅ Video/Reel Submissions
- ✅ Slogan Creation
- ✅ Daily Puzzle Pieces (45 total)
- ✅ Leaderboard (Overall & Weekly)
- ✅ English & Hindi Language Support
- ✅ Mobile Responsive

### For Admins:
- ✅ Review Video Submissions
- ✅ Review Slogan Submissions
- ✅ Assign Credit Scores
- ✅ View All Quiz Attempts
- ✅ Monitor Leaderboard

## 🔧 Common Tasks

### Test with Mock Data
```typescript
// In /utils/config.ts
export const AUTH_MODE = 'mock';
```
- Use OTP: `1234`
- No Supabase needed
- Perfect for UI testing

### Switch to Real Authentication
```typescript
// In /utils/config.ts
export const AUTH_MODE = 'supabase';
```
- Requires Supabase configuration
- See `/QUICK_FIX.md` for setup

### Enable Debug Mode
```typescript
// In /utils/config.ts
export const DEV_MODE = {
  enabled: true,
  showDebugInfo: true,
};
```

### Change Quiz Settings
```typescript
// In /utils/config.ts
export const QUIZ_CONFIG = {
  practiceTime: 600,        // 10 minutes
  practiceQuestions: 10,
  quiz1Time: 1800,          // 30 minutes
  quiz1Questions: 30,
  // ... more settings
};
```

### Change Country Code
```typescript
// In /utils/config.ts
export const DEFAULT_COUNTRY_CODE = '+91';  // India
// Change to '+1' for USA, '+44' for UK, etc.
```

## 🐛 Troubleshooting

### Issue: Can't send OTP

**Error:** "Hook requires authorization token"

**Solution:** See `/QUICK_FIX.md` (5-minute fix)

**Quick Steps:**
1. Delete Auth Hooks in Supabase
2. Enable Email provider
3. Test with email OTP

---

### Issue: Admin login fails

**Solution:** Check credentials in `/utils/adminConfig.ts`

Default:
- Username: `admin`
- Password: `GeetaOlympiad@2025!`

---

### Issue: Quiz doesn't load

**Solution:**
1. Check browser console (F12) for errors
2. Verify profile is selected
3. Check quiz unlock requirements

---

### More Issues?

See `/ERROR_REFERENCE.md` for complete error list and solutions.

## 🚀 Ready to Deploy?

Before deploying to production:

### Pre-Deployment Checklist:
- [ ] Change admin credentials (`/utils/adminConfig.ts`)
- [ ] Configure Supabase Auth (or use mock mode)
- [ ] Test all features (quiz, submissions, admin panel)
- [ ] Fix any Auth Hook errors (see `/QUICK_FIX.md`)
- [ ] Build the app (`npm run build`)
- [ ] Test the production build

### Deployment Steps:
1. Build: `npm run build`
2. Upload to hosting (Netlify, Vercel, etc.)
3. Configure custom domain (optional)
4. Test on production URL

See `/DEPLOYMENT_SUMMARY.md` for detailed steps.

## 📊 Project Structure

```
/
├── App.tsx                      # Main app component
├── components/
│   ├── portal/                  # Portal pages
│   │   ├── AuthPage.tsx        # Login/Register
│   │   ├── DashboardPage.tsx   # User dashboard
│   │   ├── QuizPage.tsx        # Quiz interface
│   │   └── AdminPanel.tsx      # Admin panel
│   └── ui/                      # UI components (shadcn)
├── contexts/
│   └── AppContext.tsx           # Global state
├── utils/
│   ├── config.ts               # Main configuration ⚙️
│   ├── adminConfig.ts          # Admin credentials 🔒
│   ├── supabaseClient.ts       # Supabase setup
│   ├── apiProxy.ts             # API interface
│   └── translations.ts         # Language support
└── styles/
    └── globals.css             # Global styles
```

## 💡 Tips

### Development:
- Use mock mode (`AUTH_MODE = 'mock'`) for faster development
- Enable debug mode for detailed logging
- Use browser console (F12) to see errors

### Testing:
- Test with email OTP first (simpler than phone)
- Create multiple profiles to test different scenarios
- Use Practice Quiz for unlimited testing

### Production:
- Always change admin credentials
- Test Auth thoroughly before launch
- Monitor Supabase logs after deployment

## 🆘 Need Help?

### Step 1: Check Error Message
Look in browser console (F12) and find the exact error.

### Step 2: Search Documentation
Search for your error in:
- `/ERROR_REFERENCE.md` - All common errors
- `/QUICK_FIX.md` - Quick solutions
- `/README.md` - General docs

### Step 3: Check Supabase
- Dashboard → Logs → Auth Logs
- Look for failed requests
- Check configuration

### Step 4: Use Mock Mode
If Supabase isn't working:
```typescript
export const AUTH_MODE = 'mock';
```
This lets you test the UI while fixing Auth.

## 📝 Quick Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache (if having issues)
rm -rf node_modules dist
npm install
```

## 🎉 You're Ready!

Follow the Quick Start above and you'll be running in minutes.

**Most Important Files:**
1. `/QUICK_FIX.md` - Fix Auth Hook error (5 min)
2. `/utils/adminConfig.ts` - Change admin password
3. `/utils/config.ts` - Main configuration
4. `/ERROR_REFERENCE.md` - All error solutions

---

**Questions?** Check the documentation links above.

**Errors?** See `/ERROR_REFERENCE.md`

**Ready to deploy?** See `/DEPLOYMENT_SUMMARY.md`

**Let's build something amazing! 🚀**
