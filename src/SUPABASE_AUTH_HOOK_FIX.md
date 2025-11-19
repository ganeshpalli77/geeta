# Fixing "Hook requires authorization token" Error

## Problem
When trying to send OTP via phone or email, you're getting this error:
```json
{"code":"unexpected_failure","message":"Hook requires authorization token"}
```

## Root Cause
This error occurs because the Supabase Auth Hook is not properly configured to accept requests with the anon key, or the Auth Hook URL is misconfigured.

## Solutions

### Solution 1: Disable Auth Hooks (Recommended for Quick Fix)

If you're using Auth Hooks for custom OTP providers and they're not critical, you can temporarily disable them:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Hooks**
3. **Disable or delete** the "Send SMS" and "Send Email" hooks
4. Test OTP again

**After disabling hooks:**
- Supabase will use the default email provider (built-in)
- For SMS, you'll need to configure Twilio/MessageBird directly in Supabase

### Solution 2: Fix Auth Hook Configuration

If you need to keep Auth Hooks enabled:

#### Step 1: Check Hook Configuration

1. Go to Supabase Dashboard → **Authentication** → **Hooks**
2. Click on your "Send SMS" or "Send Email" hook
3. Verify the configuration

#### Step 2: Update Hook to Accept Anon Key

Your Auth Hook should be configured to accept requests with the `apikey` header.

**If using Supabase Edge Function as Hook:**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Get the authorization header
  const authHeader = req.headers.get('authorization')
  const apikey = req.headers.get('apikey')
  
  // Accept both Authorization and apikey headers
  if (!authHeader && !apikey) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Your SMS/Email sending logic here
  const { user, sms, email } = await req.json()
  
  // Send OTP via your provider (Twilio, SendGrid, etc.)
  // ...

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

**If using external webhook:**
- Ensure your webhook accepts the `Authorization: Bearer <anon_key>` header
- Or configure it to accept the `apikey: <anon_key>` header

#### Step 3: Test Hook Manually

Test your Auth Hook with curl:

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/otp \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210"
  }'
```

### Solution 3: Use Built-in Providers (Simplest)

Instead of Auth Hooks, use Supabase's built-in providers:

#### For Email OTP:

1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Confirm email"
3. Configure email templates
4. **No Auth Hook needed** ✅

#### For Phone/SMS OTP:

1. Go to **Authentication** → **Providers** → **Phone**
2. Enable Phone provider
3. Choose your SMS provider:
   - **Twilio** (recommended)
   - **MessageBird**
   - **Vonage**
4. Enter your provider credentials:
   - Account SID
   - Auth Token
   - Phone Number (From)
5. **No Auth Hook needed** ✅

### Solution 4: Check Supabase Project Settings

1. **Verify API Keys**
   - Go to **Settings** → **API**
   - Copy the `anon` `public` key
   - Update `/utils/config.ts` with the correct key

2. **Check Project URL**
   - Verify the URL in `/utils/config.ts` matches your Supabase project URL
   - Format: `https://xxxxxxxxxxxxx.supabase.co`

3. **RLS Policies**
   - Ensure RLS is not blocking auth requests
   - Auth requests should bypass RLS

## Implementation Steps

### Option A: Using Built-in Twilio (Recommended)

This is the simplest approach and doesn't require Auth Hooks.

**1. Set up Twilio Account**
- Sign up at https://www.twilio.com
- Get your Account SID and Auth Token
- Buy a phone number with SMS capability

**2. Configure in Supabase**
1. Supabase Dashboard → **Authentication** → **Providers** → **Phone**
2. Enable Phone provider
3. Select "Twilio" as SMS Provider
4. Enter:
   - Account SID: `ACxxxxxxxxxxxxxxxxx`
   - Auth Token: `xxxxxxxxxxxxxxxxx`
   - Twilio Phone Number: `+1234567890`
5. Save settings

**3. Disable Auth Hooks**
1. Go to **Authentication** → **Hooks**
2. Disable/Delete "Send SMS" hook
3. Disable/Delete "Send Email" hook (if using built-in email)

**4. Test**
```typescript
// Your code already handles this correctly!
await supabase.auth.signInWithOtp({
  phone: '+919876543210'
})
```

### Option B: Using Built-in Email (Free)

**1. Configure Email Provider**
1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Enable Email provider
3. Confirm email is enabled
4. Customize email templates (optional)

**2. Disable Auth Hooks**
1. Go to **Authentication** → **Hooks**
2. Disable/Delete "Send Email" hook

**3. Test**
```typescript
await supabase.auth.signInWithOtp({
  email: 'user@example.com'
})
```

## Verification Steps

After implementing the fix:

1. **Clear browser cache and sessionStorage**
   ```javascript
   sessionStorage.clear()
   localStorage.clear()
   ```

2. **Test Email OTP**
   - Use a real email address
   - Check spam folder
   - OTP should arrive in 1-2 minutes

3. **Test Phone OTP**
   - Use a real phone number with country code (+91...)
   - SMS should arrive in 1-2 minutes
   - Check Twilio logs if not received

4. **Check Supabase Logs**
   - Dashboard → **Logs** → **Auth**
   - Look for OTP send events
   - Check for error messages

## Current Configuration Check

Your current setup in `/utils/config.ts`:
```typescript
SUPABASE_CONFIG = {
  url: 'https://kiaozqbwolqauxjmwlks.supabase.co',
  anonKey: 'eyJhbGci...'
}
```

**To verify this is correct:**
1. Go to Supabase Dashboard
2. Settings → API
3. Compare URL and anon key
4. If different, update `/utils/config.ts`

## Testing Checklist

- [ ] Supabase project URL is correct
- [ ] Supabase anon key is correct and not expired
- [ ] Auth Hooks are disabled (or properly configured)
- [ ] Email provider is enabled (for email OTP)
- [ ] Phone provider is enabled with Twilio/MessageBird (for phone OTP)
- [ ] Twilio credentials are correct (if using phone)
- [ ] Browser cache cleared
- [ ] sessionStorage cleared
- [ ] Test with real email address
- [ ] Test with real phone number (+91...)
- [ ] Check Supabase Auth logs for errors

## Common Mistakes

### ❌ Wrong: Auth Hook without proper authorization
```typescript
// Auth Hook that rejects anon key
if (!req.headers.get('authorization').includes('service_role')) {
  return Response.error(401)
}
```

### ✅ Correct: Auth Hook accepts anon key
```typescript
// Auth Hook that accepts anon key
const authHeader = req.headers.get('authorization') || req.headers.get('apikey')
if (!authHeader) {
  return Response.error(401)
}
```

### ❌ Wrong: Expired or incorrect anon key
```typescript
export const SUPABASE_CONFIG = {
  anonKey: 'old_or_wrong_key'
}
```

### ✅ Correct: Current anon key from dashboard
```typescript
export const SUPABASE_CONFIG = {
  anonKey: 'eyJhbGci...' // Copy from Settings → API
}
```

## Need More Help?

### Check These Logs:

1. **Browser Console**
   - Open DevTools (F12)
   - Look for red errors
   - Check Network tab for failed requests

2. **Supabase Dashboard Logs**
   - Dashboard → Logs → Auth
   - Filter by "OTP" or "SMS"
   - Look for error messages

3. **Twilio Logs** (if using phone)
   - Twilio Console → Monitor → Logs
   - Check if SMS was attempted
   - Look for delivery failures

### Still Not Working?

If you've tried all solutions and still getting errors:

1. **Switch to Email OTP temporarily**
   - Email is free and easier to set up
   - Use for testing and development
   - Add phone later

2. **Use Mock Mode for development**
   ```typescript
   // In /utils/config.ts
   export const AUTH_MODE = 'mock'; // Switch from 'supabase'
   ```
   - Use OTP: `1234` (works for any email/phone)
   - Perfect for testing the UI

3. **Contact Supabase Support**
   - Include error message
   - Include Supabase project ID
   - Include timestamp of error
   - Share Auth Hook configuration (if any)

## Quick Fix Summary

**If you just want it to work right now:**

1. Go to Supabase Dashboard → **Authentication** → **Hooks**
2. **Delete all Auth Hooks**
3. Go to **Authentication** → **Providers** → **Email**
4. **Enable Email provider**
5. Clear browser cache and sessionStorage
6. Try email OTP with a real email address

**For phone OTP:**
1. Set up Twilio account (free trial available)
2. Add Twilio credentials to Supabase → **Authentication** → **Providers** → **Phone**
3. No Auth Hooks needed!

---

**Last Updated:** 2025-11-06
**Status:** Ready to implement
**Estimated Time:** 10-15 minutes
