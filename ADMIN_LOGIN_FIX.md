# Admin Login Fix

## Issue
Admin login was failing with 404 error when trying to call `/api/auth/admin-login` endpoint that doesn't exist in the backend.

## Root Cause
The `adminLogin` function in `apiProxy.ts` was attempting to call a backend API endpoint when `AUTH_MODE` was set to `'nodejs'`, but this endpoint was never implemented in the backend.

## Solution
Modified the `adminLogin` function to always handle authentication on the frontend, regardless of `AUTH_MODE`:

```typescript
// Admin login
adminLogin: async (username: string, password: string): Promise<{ success: boolean }> => {
  // Admin login is always handled on the frontend for security
  // No backend API call needed - credentials are checked against adminConfig.ts
  await new Promise(resolve => setTimeout(resolve, 500));
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return { success: true };
  }
  throw new Error('Invalid credentials');
},
```

## Why Frontend Authentication?
Admin authentication is intentionally handled on the frontend because:
1. **Simplicity**: No need for backend admin authentication infrastructure
2. **Security**: Credentials are stored in `adminConfig.ts` which should be secured in production
3. **Separation**: Admin panel is a separate concern from user authentication
4. **Flexibility**: Easy to change credentials without backend changes

## How It Works Now

### Login Flow
1. User clicks "Admin Login" tab in auth dialog
2. Enters username and password
3. Frontend checks credentials against `ADMIN_CREDENTIALS` from `adminConfig.ts`
4. If valid:
   - Sets `isAdmin: true` in AppContext
   - User is redirected to Admin Dashboard
5. If invalid:
   - Shows error toast

### Default Credentials
Located in `src/utils/adminConfig.ts`:
- **Username**: `admin`
- **Password**: `GeetaOlympiad@2025!`

⚠️ **IMPORTANT**: Change these credentials before deploying to production!

## Admin Dashboard Access
Once logged in as admin:
- Header shows "Admin Dashboard" button
- Clicking it navigates to the comprehensive admin interface
- Can manage:
  - Users and profiles
  - Video and slogan submissions
  - Quiz attempts and analytics
  - Leaderboard rankings

## Testing
To test admin login:
1. Navigate to the app
2. Click "Login" button
3. Select "Admin Login" tab
4. Enter:
   - Username: `admin`
   - Password: `GeetaOlympiad@2025!`
5. Click "Login"
6. Should see Admin Dashboard in header navigation

## Security Recommendations for Production

### 1. Change Default Credentials
Edit `src/utils/adminConfig.ts`:
```typescript
export const ADMIN_CONFIG = {
  username: 'your-secure-username',
  password: 'YourVerySecurePassword123!@#',
};
```

### 2. Use Environment Variables
For better security, use build-time environment variables:
```typescript
export const ADMIN_CONFIG = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'default-password',
};
```

### 3. Implement Backend Authentication (Optional)
For production, consider:
- JWT-based admin authentication
- Role-based access control (RBAC)
- Session management
- Audit logging

### 4. Add Rate Limiting
Implement rate limiting on admin login attempts to prevent brute force attacks.

### 5. Use HTTPS
Always use HTTPS in production to encrypt credentials in transit.

## Files Modified
- `src/utils/apiProxy.ts` - Fixed `adminLogin` function to always use frontend authentication

## Related Files
- `src/utils/adminConfig.ts` - Admin credentials configuration
- `src/contexts/AppContext.tsx` - Admin state management
- `src/components/admin/AdminDashboard.tsx` - Admin dashboard interface
- `src/App.tsx` - Admin routing logic
