# Configuration Guide

## Quick Configuration Change

To switch between Mock and Supabase authentication:

1. Open `/utils/config.ts`
2. Find the `AUTH_MODE` setting
3. Change it to your desired mode

```typescript
// For development/testing (uses demo OTP: 1234)
export const AUTH_MODE: 'mock' | 'supabase' = 'mock';

// For production (uses real Supabase Auth)
export const AUTH_MODE: 'mock' | 'supabase' = 'supabase';
```

## Authentication Modes

### Mock Mode (Default)
✅ **Currently Active**

**Features:**
- No external dependencies
- Demo OTP: `1234`
- Data stored in localStorage
- Perfect for development and testing
- No API costs

**Admin Login:**
- Username: `admin`
- Password: `admin123`

### Supabase Mode

**Requirements:**
1. Supabase project configured
2. Phone/Email provider enabled
3. Auth Hooks properly configured (see below)

**Before Switching:**
- [ ] Phone provider enabled in Supabase Dashboard
- [ ] SMS service configured (Twilio, Messagebird, etc.)
- [ ] Auth Hooks configured to NOT require additional authorization
- [ ] Tested with email OTP first

## Supabase Auth Hooks Issues

### Error: "Hook requires authorization token"

**Cause:** Your Auth Hook expects an authorization token that isn't being sent.

**Solutions:**

#### Option 1: Disable Authorization Requirement (Recommended)
Edit your Auth Hook in Supabase to accept requests with just the anon key.

#### Option 2: Use Email Instead of Phone
Email OTP typically doesn't require Auth Hooks and works out-of-the-box:
1. Enable Email provider in Supabase
2. Click "Email" button in login page
3. Use your real email address

#### Option 3: Stay in Mock Mode
Keep `AUTH_MODE = 'mock'` until Supabase is fully configured.

### Error: "phone_provider_disabled"

**Cause:** Phone authentication not enabled in Supabase.

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Phone**
3. Enable it and configure a provider (Twilio recommended)
4. Add your provider's API credentials

## Common Configuration Tasks

### Change Default Country Code
In `/utils/config.ts`:
```typescript
export const DEFAULT_COUNTRY_CODE = '+1'; // Change from +91 to +1 for USA
```

### Adjust Quiz Time Limits
In `/utils/config.ts`:
```typescript
export const QUIZ_CONFIG = {
  quiz1Time: 2400, // Change from 1800 (30 min) to 2400 (40 min)
  // ...
};
```

### Change Toast Position
In `/utils/config.ts`:
```typescript
export const TOAST_POSITION = 'top-right' as const; // or 'bottom-right'
```

## Development vs Production

### Development Mode
- Uses mock authentication by default
- Shows debug information
- Uses demo credentials
- No API costs

### Production Mode
To prepare for production:

1. **Set AUTH_MODE to 'supabase'**
   ```typescript
   export const AUTH_MODE = 'supabase';
   ```

2. **Update Supabase Configuration**
   - Ensure all providers are enabled
   - Configure rate limiting
   - Set up proper error handling

3. **Security Checklist**
   - [ ] Change admin credentials
   - [ ] Enable RLS (Row Level Security) in Supabase
   - [ ] Configure proper CORS
   - [ ] Set up monitoring and logging
   - [ ] Test all authentication flows

## Troubleshooting

### Can't Login with Phone
1. Check `AUTH_MODE` is set correctly
2. If using Supabase, verify phone provider is enabled
3. Check phone number format (should be 10 digits without country code)
4. Try email login instead

### OTP Not Received
1. **Mock Mode:** OTP is always `1234`
2. **Supabase Mode:** 
   - Check Supabase logs for errors
   - Verify SMS provider credentials
   - Check phone number format
   - Try email OTP instead

### Data Not Persisting
1. **Mock Mode:** Check browser localStorage is enabled
2. **Supabase Mode:** Check database permissions and RLS policies

### Dialog Ref Warning
This has been fixed by updating `/components/ui/dialog.tsx` to use `React.forwardRef`.

## Getting Help

1. Check error logs in browser console
2. Review Supabase logs if using Supabase mode
3. Read `SUPABASE_AUTH_HOOKS_GUIDE.md` for detailed Supabase setup
4. Ensure all prerequisites are met for your chosen mode

## Configuration Files

- **`/utils/config.ts`** - Main configuration (start here!)
- **`/utils/apiProxy.ts`** - API routing logic
- **`/utils/supabaseClient.ts`** - Supabase client setup
- **`/utils/mockDb.ts`** - Mock database for development
