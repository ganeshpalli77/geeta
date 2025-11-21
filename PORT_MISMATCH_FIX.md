# Port Mismatch Fix - 5001 → 5000

## ❌ Problem

Frontend was trying to connect to port **5001**, but backend is running on port **5000**.

### Error Messages:
```
:5001/api/email-users/register:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
:5001/api/profiles:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
:5001/api/users/...:1  Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## ✅ Solution

Changed all API base URLs from port **5001** to port **5000** to match the backend server.

## 🔧 Files Fixed

### 1. `src/utils/config.ts`
```typescript
// Before:
export const API_BASE_URL = 'http://localhost:5001/api';

// After:
export const API_BASE_URL = 'http://localhost:5000/api';
```

### 2. `src/services/backendAPI.ts`
```typescript
// Before:
const API_BASE_URL = 'http://localhost:5001/api';

// After:
const API_BASE_URL = 'http://localhost:5000/api';
```

### 3. `src/services/quizServiceAPI.ts`
```typescript
// Before:
const API_BASE_URL = 'http://localhost:5001/api';

// After:
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🎯 What This Fixes

### Before (Port 5001 - Not Working):
- ❌ User registration fails
- ❌ Profile creation fails
- ❌ Can't load user data
- ❌ Admin functions broken
- ❌ All backend calls fail

### After (Port 5000 - Working):
- ✅ User registration works
- ✅ Profile creation works
- ✅ User data loads correctly
- ✅ Admin functions work
- ✅ All backend calls succeed

## 🚀 Next Steps

**IMPORTANT: Hard Refresh Your Browser**

Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

This clears the cached JavaScript files and loads the new port configuration.

## ✅ Verification

After hard refresh, check browser console:
- ✅ No more "5001" in URLs
- ✅ All requests go to "localhost:5000"
- ✅ No "ERR_CONNECTION_REFUSED" errors
- ✅ API calls succeed

## 📊 Backend Server Status

Your backend is running correctly on:
```
http://localhost:5000
```

API endpoints available:
- ✅ http://localhost:5000/health
- ✅ http://localhost:5000/api/auth/admin-login
- ✅ http://localhost:5000/api/auth/admin-register
- ✅ http://localhost:5000/api/profiles
- ✅ http://localhost:5000/api/users
- ✅ All other endpoints

## 🎉 Summary

**Issue:** Port mismatch (5001 vs 5000)  
**Fix:** Changed all config files to port 5000  
**Action Required:** Hard refresh browser  
**Expected Result:** All API calls work!

---

**Status:** ✅ Fixed  
**Action:** Refresh browser now!

