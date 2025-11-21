# API 404 Errors - Fixed

## Problem Summary

The application was encountering multiple 404 errors when the frontend tried to call backend API endpoints that didn't exist:

### Errors Encountered:
1. ❌ `GET /api/leaderboard/overall` - 404 Not Found
2. ❌ `POST /api/auth/admin-login` - 404 Not Found

### Root Cause:
The app is configured with `AUTH_MODE = 'nodejs'` in `src/utils/config.ts`, which means it uses the backend API for most operations. However, the backend (`backend/server.js`) was missing several critical routes:

**Backend Routes Status (Before Fix):**
- ✅ `/api/users` - Exists
- ✅ `/api/profiles` - Exists
- ✅ `/api/quiz` - Exists
- ✅ `/api/logins` - Exists
- ❌ `/api/leaderboard` - **MISSING**
- ❌ `/api/auth` - **MISSING**

## Solution Implemented

### 1. Created Missing Backend Routes

#### A. Leaderboard Routes (`backend/routes/leaderboard.js`)

Created comprehensive leaderboard functionality:

```javascript
// Endpoints created:
GET  /api/leaderboard/overall          - Overall leaderboard (all profiles)
GET  /api/leaderboard/weekly           - Weekly leaderboard (last 7 days)
GET  /api/leaderboard/rank/:profileId  - Get specific profile rank
GET  /api/leaderboard/category/:category - Category-specific leaderboard
```

**Features:**
- Calculates scores from multiple sources:
  - Quiz attempts
  - Approved video submissions
  - Approved slogan submissions
  - Image puzzle pieces (10 points each + 100 bonus for completion)
- Ranks profiles by total score or weekly score
- Returns profile name, category, and score breakdowns

#### B. Authentication Routes (`backend/routes/auth.js`)

Created authentication endpoints:

```javascript
// Endpoints created:
POST /api/auth/send-otp      - Send OTP for login/registration
POST /api/auth/verify-otp    - Verify OTP and authenticate user
POST /api/auth/admin-login   - Admin login with credentials
POST /api/auth/logout        - Logout endpoint
```

**Security Notes:**
- Admin credentials should be stored in environment variables:
  - `ADMIN_USERNAME` (default: 'admin')
  - `ADMIN_PASSWORD` (default: 'admin123')
- ⚠️ **IMPORTANT**: Change default credentials before production deployment!
- OTP verification is placeholder - implement actual SMS/Email service in production

### 2. Updated Backend Server Registration

Updated `backend/server.js` to register the new routes:

```javascript
import leaderboardRouter from './routes/leaderboard.js';
import authRouter from './routes/auth.js';

app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/auth', authRouter);
```

### 3. Fixed Frontend API Response Handling

Updated `src/utils/apiProxy.ts` to properly parse backend responses:

**Before:**
```typescript
return apiCall(`/leaderboard/${type}`, 'GET');
```

**After:**
```typescript
const response = await apiCall<{ success: boolean; leaderboard: LeaderboardEntry[] }>(`/leaderboard/${type}`, 'GET');
return response.leaderboard;
```

## Testing the Fix

### 1. Start the Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
Connected to MongoDB Atlas
MongoDB connection established
Server is running on port 5000
Health check: http://localhost:5000/health
```

### 2. Test Leaderboard Endpoint

```bash
# Test overall leaderboard
curl http://localhost:5000/api/leaderboard/overall

# Expected response:
{
  "success": true,
  "leaderboard": [
    {
      "profileId": "...",
      "name": "John Doe",
      "category": "youth",
      "totalScore": 450,
      "quizScore": 300,
      "eventScore": 150,
      "weeklyScore": 50,
      "rank": 1
    }
  ],
  "count": 10
}
```

### 3. Test Admin Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected response:
{
  "success": true,
  "message": "Admin login successful"
}
```

### 4. Test Auth Endpoints

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP (placeholder - accepts any 4-digit OTP)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","otp":"1234","type":"email"}'
```

## Frontend Integration

The frontend (`src/utils/apiProxy.ts`) already has the correct logic:

```typescript
// When AUTH_MODE = 'nodejs', it calls the backend API
export const AUTH_MODE: 'mock' | 'supabase' | 'nodejs' = 'nodejs';

// Leaderboard calls backend when not in mock/supabase mode
if (USE_MOCK_API || USE_SUPABASE_AUTH) {
  // Use mock data
} else {
  // Call backend API
  const response = await apiCall(`/leaderboard/${type}`, 'GET');
  return response.leaderboard;
}
```

## Database Schema

The routes use the following MongoDB collections:

- `profiles` - User profiles
- `quizAttempts` - Quiz attempt records
- `videoSubmissions` - Video submission records (with status and creditScore)
- `sloganSubmissions` - Slogan submission records (with status and creditScore)
- `imageParts` - Collected puzzle pieces

**Database:** `geeta-olympiad` (MongoDB Atlas)

## Configuration

### Environment Variables

Create/update `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### Frontend Configuration

In `src/utils/config.ts`:

```typescript
export const AUTH_MODE: 'mock' | 'supabase' | 'nodejs' = 'nodejs';
export const API_BASE_URL = 'http://localhost:5000/api';
```

## Verification Checklist

- ✅ Backend routes created: `leaderboard.js` and `auth.js`
- ✅ Routes registered in `server.js`
- ✅ Database functions use correct `getDatabase()` method
- ✅ Frontend properly parses backend responses
- ✅ All endpoints return consistent JSON format
- ✅ Error handling implemented in all routes

## Next Steps

1. **Test the application**: Restart both backend and frontend
2. **Verify leaderboard loads**: Check that leaderboard displays without 404 errors
3. **Test admin login**: Ensure admin can log in successfully
4. **Monitor console**: No more 404 errors should appear

## Production Deployment Notes

Before deploying to production:

1. ✅ Update admin credentials in environment variables
2. ✅ Implement real OTP service (Twilio, SendGrid, etc.)
3. ✅ Add proper authentication middleware (JWT tokens)
4. ✅ Add rate limiting for auth endpoints
5. ✅ Enable HTTPS
6. ✅ Add request validation and sanitization
7. ✅ Implement proper session management
8. ✅ Add logging and monitoring

## Files Modified

### Created:
- `backend/routes/leaderboard.js` - Leaderboard endpoints
- `backend/routes/auth.js` - Authentication endpoints
- `API_404_ERRORS_FIX.md` - This documentation

### Modified:
- `backend/server.js` - Registered new routes
- `src/utils/apiProxy.ts` - Fixed response parsing for backend mode

## Status

🟢 **All 404 errors should now be resolved!**

The application now has complete backend API coverage for all frontend requests when running in `nodejs` mode.

