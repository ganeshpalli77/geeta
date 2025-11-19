# Supabase Auth Hooks Configuration Guide

## Overview
Your Geeta Olympiad portal supports both **Mock Authentication** (for development) and **Supabase Auth Hooks** (for production).

## Quick Start - Use Mock Mode (Recommended for Development)

1. Open `/utils/config.ts`
2. Set `AUTH_MODE` to `'mock'`
3. Use demo OTP: **1234**
4. All data persists in localStorage

## Current Error: "Hook requires authorization token"

This error occurs when:
1. `AUTH_MODE` is set to `'supabase'`
2. Your Supabase Auth Hook requires an authorization token
3. The token is not being provided in the request

## Solution Options

### Option 1: Configure Auth Hook to NOT Require Authorization Token

1. Go to your Supabase Dashboard: https://kiaozqbwolqauxjmwlks.supabase.co
2. Navigate to **Database** > **Functions** or **Edge Functions**
3. Find your Auth Hook function
4. Edit the hook to remove the authorization token requirement OR make it optional
5. The hook should allow requests with the standard Supabase anon key

### Option 2: Add Authorization Token to Frontend Requests

If your Auth Hook must have an authorization token, you need to provide it. Update `/utils/supabaseClient.ts`:

```typescript
// Add custom header with authorization token
export const authHelpers = {
  sendPhoneOTP: async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            source: 'geeta-olympiad',
            // Add your authorization token here
            authToken: 'YOUR_CUSTOM_AUTH_TOKEN',
          },
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Phone OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },
  // ... other methods
};
```

### Option 3: Use Supabase Service Role Key (Server-Side Only)

If your Auth Hook requires elevated permissions, you may need to use the service_role key. **WARNING: Never expose this key in frontend code!**

This should only be done in a backend/server environment.

## Phone Number Format

Based on your curl request, you're sending: `"phone":"7760532406"`

Make sure:
1. Phone numbers are in E.164 format (e.g., `+917760532406` for India)
2. Update the AuthPage to add country code automatically

## Configuration

All configuration is now centralized in `/utils/config.ts`:

```typescript
// In /utils/config.ts
export const AUTH_MODE: 'mock' | 'supabase' = 'mock'; // Change this!
```

### Mock Mode (Current - Default)
- **AUTH_MODE**: `'mock'`
- **OTP**: Always `1234`
- **Storage**: localStorage
- **Best for**: Development and testing

### Supabase Mode (Production)
- **AUTH_MODE**: `'supabase'`
- **OTP**: Real OTP sent via SMS/Email
- **Storage**: Supabase + sessionStorage
- **Best for**: Production deployment

To switch modes, just change `AUTH_MODE` in `/utils/config.ts`

## Testing Steps

### 1. Test with Email OTP (Usually easier to set up)
- Email OTP typically doesn't require custom hooks
- Switch to email login in the UI
- Try sending an OTP

### 2. Configure Phone Provider
Since the error was "phone_provider_disabled":
- Go to **Authentication** > **Providers** > **Phone**
- Enable a phone provider (Twilio, Messagebird, etc.)
- Add your provider's credentials

### 3. Configure Auth Hooks
If using custom Auth Hooks:
- Go to **Authentication** > **Hooks**
- Check what hooks are enabled
- Review the hook code
- Ensure the hook doesn't require additional authorization

## Common Auth Hook Patterns

### Pattern 1: Custom User Data Hook
```javascript
// This runs after successful auth
export const handler = async (event) => {
  const { user } = event;
  
  // No additional authorization needed
  // Just process the user
  
  return {
    user: {
      ...user,
      app_metadata: {
        source: 'geeta-olympiad'
      }
    }
  };
};
```

### Pattern 2: Pre-Sign Up Hook with Validation
```javascript
// This runs BEFORE user creation
export const handler = async (event) => {
  // Don't require authorization token
  // Use the standard JWT from the request
  
  const { user } = event;
  
  // Validate user data
  if (!user.phone && !user.email) {
    throw new Error('Phone or email required');
  }
  
  return {
    decision: 'continue'
  };
};
```

## Debugging Tips

1. **Check Supabase Logs**
   - Go to **Logs** > **Auth Logs** in Supabase Dashboard
   - Look for the exact error message
   - Check what data is being sent/received

2. **Check Network Tab**
   - Open browser DevTools > Network tab
   - Filter for "supabase.co"
   - Look at the request payload and response
   - Verify headers are being sent

3. **Test with cURL**
   ```bash
   curl 'https://kiaozqbwolqauxjmwlks.supabase.co/auth/v1/otp' \
     -H 'apikey: YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     --data '{"phone":"+917760532406","create_user":true,"channel":"sms"}'
   ```

## Phone Number Format Fix

Update `/components/portal/AuthPage.tsx` to ensure proper phone format:

```typescript
const handleSendOTP = async () => {
  // ... validation
  
  let formattedPhone = phone;
  // If phone doesn't start with +, add +91 (India)
  if (loginMethod === 'phone' && !phone.startsWith('+')) {
    formattedPhone = '+91' + phone;
  }
  
  await authAPI.sendOTP(undefined, formattedPhone);
};
```

## Contact

If you continue to have issues:
1. Check your Auth Hook code in Supabase
2. Verify phone provider is properly configured
3. Test with email OTP first (simpler setup)
4. Review Supabase Auth logs for detailed errors
