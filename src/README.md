# Geeta Olympiad Portal

A comprehensive multilingual web portal for the Geeta Olympiad event with interactive quizzes, video/reel submissions, slogan creation, and gamified activities.

## 👉 **NEW USER? START HERE:** [`/START_HERE.md`](START_HERE.md)

## 🚨 Having Auth Hook errors?
**Errors:** "Hook requires authorization token" or "Invalid payload sent to hook"  

### 👉 **SOLUTION (5 MIN):** [`/SOLUTION_NOW.md`](SOLUTION_NOW.md) ← **Click here for instant fix!**

**Other Options:**
- Quick Fix: [`/QUICK_FIX.md`](QUICK_FIX.md)
- Step-by-Step: [`/AUTH_HOOK_DISABLE_GUIDE.md`](AUTH_HOOK_DISABLE_GUIDE.md)  
- Diagnostic: [`/DIAGNOSTIC_SCRIPT.md`](DIAGNOSTIC_SCRIPT.md)

## 📚 **All Documentation:** [`/DOCS_INDEX.md`](DOCS_INDEX.md)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

## ⚙️ Configuration

### 1. Admin Credentials (REQUIRED)

**Before deploying to production, change the admin credentials:**

Edit `/utils/adminConfig.ts`:
```typescript
export const ADMIN_CONFIG = {
  username: 'your_username',        // ← Change this
  password: 'YourSecurePassword',   // ← Change this
};
```

### 2. Authentication Mode

Current mode: **Supabase** (Production)

To change, edit `/utils/config.ts`:
```typescript
export const AUTH_MODE = 'supabase';  // or 'mock' for development
```

### 3. Supabase Setup

Ensure these are configured in your Supabase Dashboard:
- Phone provider (Twilio/Messagebird)
- Email provider
- Auth Hooks (see `/SUPABASE_AUTH_HOOKS_GUIDE.md`)

## 📁 Project Structure

```
├── components/          # React components
│   ├── portal/         # Portal pages (Dashboard, Quiz, etc.)
│   └── ui/             # UI components (shadcn/ui)
├── contexts/           # React contexts (global state)
├── utils/              # Utilities and configuration
│   ├── config.ts       # Main configuration
│   ├── adminConfig.ts  # Admin credentials
│   └── supabaseClient.ts  # Supabase setup
├── styles/             # CSS styles
└── App.tsx             # Main app component
```

## 🎯 Features

- ✅ Phone & Email OTP Authentication
- ✅ Multiple user profiles per account
- ✅ Practice Quiz (10 questions)
- ✅ Main Quizzes (30 questions each)
- ✅ Video/Reel Submissions
- ✅ Slogan Creation
- ✅ Gamified Image Puzzle (45 parts)
- ✅ Leaderboard (Overall & Weekly)
- ✅ Admin Review Panel
- ✅ Multi-language Support (English/Hindi)
- ✅ Mobile Responsive Design

## 📚 Documentation

### Essential Reading
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Quick deployment guide
- **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Production deployment details
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist

### Configuration & Setup
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Configuration options
- **[SUPABASE_AUTH_HOOKS_GUIDE.md](SUPABASE_AUTH_HOOKS_GUIDE.md)** - Supabase setup
- **[GITIGNORE_RECOMMENDATIONS.md](GITIGNORE_RECOMMENDATIONS.md)** - Security best practices

### Additional Resources
- **[PORTAL_README.md](PORTAL_README.md)** - Portal features overview
- **[BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)** - Architecture details
- **[QUICK_START.md](QUICK_START.md)** - Getting started guide

## 🔒 Security

**CRITICAL:** Before deploying to production:

1. Change admin credentials in `/utils/adminConfig.ts`
2. Do NOT commit production credentials to git
3. Enable Row Level Security in Supabase
4. Configure proper CORS settings
5. Review `/GITIGNORE_RECOMMENDATIONS.md`

## 🧪 Testing

### Test User Registration
```
1. Click "Register" button
2. Choose Phone or Email
3. Enter your phone/email
4. Receive OTP via SMS/Email
5. Enter OTP to login
6. Create profile
```

### Test Admin Login
```
1. Click "Login as Admin"
2. Username: admin (or your custom username)
3. Password: GeetaOlympiad@2025! (or your custom password)
```

**Note:** Change these credentials before production!

## 🏗️ Build for Production

```bash
# Build the application
npm run build
# or
yarn build

# The build output will be in /dist or /build directory
```

## 🚀 Deployment

### Recommended Platforms
- Netlify
- Vercel
- GitHub Pages
- AWS Amplify

### Steps
1. Change admin credentials
2. Build the application
3. Upload build folder to hosting platform
4. Configure custom domain (optional)
5. Test all features

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Hook requires authorization token" error
- **Solution:** See `/SUPABASE_AUTH_HOOK_FIX.md` for detailed fix
- **Quick Fix:** Disable Auth Hooks in Supabase Dashboard
- Use built-in Email/Phone providers instead

**Issue:** Can't login with OTP
- Verify Supabase phone/email provider is enabled
- Check Supabase logs for errors
- Try email OTP as alternative
- Run test script in `/SUPABASE_TEST.md`

**Issue:** Admin login fails
- Verify credentials in `/utils/adminConfig.ts`
- Clear browser cache/localStorage
- Check browser console for errors

**Issue:** Build errors
- Delete `node_modules` and reinstall
- Clear build cache
- Check for TypeScript errors

See documentation files for detailed troubleshooting.

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

### Tech Stack
- React 18
- TypeScript
- Tailwind CSS v4
- Supabase (Authentication & Database)
- shadcn/ui Components
- Lucide Icons

## 📊 Configuration Options

All configuration is in `/utils/config.ts`:

```typescript
// Authentication mode
AUTH_MODE: 'supabase' | 'mock'

// Quiz settings
QUIZ_CONFIG: {
  quiz1Time: 1800,  // 30 minutes
  quiz1Questions: 30,
  // ... more settings
}

// Country code
DEFAULT_COUNTRY_CODE: '+91'  // India
```

## 🌐 Multi-language

Supports:
- English (en)
- Hindi (hi)

Add more languages in `/utils/translations.ts`

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors]

## 🆘 Support

For issues and questions:
1. Check documentation files
2. Review Supabase logs
3. Check browser console
4. Contact support team

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** 2025-11-05
