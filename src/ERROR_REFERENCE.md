# Error Reference Guide

Quick reference for common errors and their solutions.

## Authentication Errors

### ❌ "Hook requires authorization token"

**Error Message:**
```json
{"code":"unexpected_failure","message":"Hook requires authorization token"}
```

**Cause:** Auth Hooks are enabled but not configured to accept anon key authorization.

**Solution:**
1. **Quick Fix (5 min):** See `/QUICK_FIX.md`
2. **Detailed Guide:** See `/SUPABASE_AUTH_HOOK_FIX.md`
3. **Test Script:** See `/SUPABASE_TEST.md`

**Quick Steps:**
- Supabase Dashboard → Authentication → Hooks → Delete all hooks
- Authentication → Providers → Email → Enable
- Clear browser cache and sessionStorage

---

### ❌ "Invalid payload sent to hook"

**Error Message:**
```json
{"code":"unexpected_failure","message":"Invalid payload sent to hook"}
```

**Cause:** Auth Hook is enabled but expecting a different data format than what Supabase is sending.

**Solution:**
**Same as above** - The simplest solution is to delete the Auth Hooks:

1. **Quick Fix (5 min):** See `/QUICK_FIX.md`
2. Supabase Dashboard → Authentication → Hooks → **Delete all hooks**
3. Authentication → Providers → Email → **Enable**
4. Use built-in providers instead of custom hooks

**Why this happens:**
- Your Auth Hook expects specific fields (like `hook_secret`, custom headers, etc.)
- Supabase is sending standard OTP payload
- Hook validation is failing

**Alternative (Advanced):**
If you need to keep the Auth Hook, update it to accept standard Supabase payloads. See `/SUPABASE_AUTH_HOOKS_GUIDE.md` for custom hook implementation.

---

### ❌ "Invalid OTP"

**Error Message:**
```
Invalid OTP
Failed to verify OTP
```

**Causes:**
- OTP expired (valid for 60 seconds)
- Wrong OTP entered
- OTP already used

**Solution:**
- Request a new OTP
- Check email spam folder
- Enter OTP within 60 seconds
- Don't refresh page after requesting OTP

---

### ❌ "Signups not allowed for this instance"

**Error Message:**
```json
{"message": "Signups not allowed for this instance"}
```

**Cause:** Email or Phone provider is not enabled in Supabase.

**Solution:**
1. Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider (for email OTP)
3. Enable **Phone** provider (for SMS OTP)
4. Save settings

---

### ❌ "Invalid phone number format"

**Error Message:**
```
Invalid phone number format
Phone number must be in E.164 format
```

**Cause:** Phone number is not in the correct format.

**Solution:**
Use E.164 format: `+[country code][number]`

**Examples:**
- ✅ Correct: `+919876543210` (India)
- ✅ Correct: `+12025551234` (USA)
- ❌ Wrong: `9876543210` (missing +91)
- ❌ Wrong: `+91 98765 43210` (spaces)
- ❌ Wrong: `09876543210` (leading zero)

---

### ❌ "Failed to send OTP"

**Error Message:**
```
Failed to send OTP
Error sending SMS
```

**Causes:**
1. SMS provider (Twilio) not configured
2. Invalid Twilio credentials
3. Insufficient Twilio balance
4. Phone number blocked/invalid

**Solution:**

**For Email OTP:**
- Verify email provider is enabled
- Check Supabase logs (Dashboard → Logs → Auth)
- Try a different email address

**For Phone OTP:**
1. Verify Phone provider is enabled
2. Check Twilio configuration:
   - Account SID is correct
   - Auth Token is correct
   - Twilio phone number is valid
3. Check Twilio balance
4. Check Twilio logs for delivery status

---

### ❌ "User already registered"

**Error Message:**
```
User already registered
Email already exists
```

**Cause:** Trying to register with an email/phone that's already registered.

**Solution:**
- Use "Login" instead of "Register"
- Or use a different email/phone number

---

## Admin Errors

### ❌ "Invalid credentials"

**Error Message:**
```
Invalid credentials
Admin login failed
```

**Cause:** Wrong admin username or password.

**Solution:**
1. Check credentials in `/utils/adminConfig.ts`
2. Default:
   - Username: `admin`
   - Password: `GeetaOlympiad@2025!`
3. If changed, verify the new credentials
4. Clear browser cache

---

## Quiz Errors

### ❌ "Quiz already completed"

**Error Message:**
```
You have already completed this quiz
Cannot retake quiz
```

**Cause:** User has already taken this quiz with this profile.

**Solution:**
- Quizzes can only be taken once per profile
- Create a new profile to take the quiz again (for testing)
- Or use a different quiz (Practice, Quiz 1, 2, 3)

---

### ❌ "Quiz not unlocked"

**Error Message:**
```
This quiz is not yet unlocked
Complete previous quizzes first
```

**Cause:** Quiz unlock requirements not met.

**Solution:**
- **Quiz 1:** Always unlocked
- **Quiz 2:** Complete Quiz 1 with score ≥ 50%
- **Quiz 3:** Complete Quiz 2 with score ≥ 50%

---

## Event Errors

### ❌ "Already collected today"

**Error Message:**
```
Already collected today
Image part already collected
```

**Cause:** User has already collected today's puzzle piece.

**Solution:**
- Can only collect 1 puzzle piece per day
- Come back tomorrow for the next piece
- Total: 45 pieces over 45 days

---

### ❌ "All parts collected"

**Error Message:**
```
All parts collected
Puzzle complete
```

**Cause:** User has collected all 45 puzzle pieces.

**Solution:**
- Congratulations! Puzzle is complete
- Bonus points awarded automatically
- Nothing more to collect

---

## Network Errors

### ❌ "Failed to fetch"

**Error Message:**
```
Failed to fetch
Network request failed
```

**Causes:**
- No internet connection
- Supabase service is down
- CORS issue
- Firewall/proxy blocking

**Solution:**
1. Check internet connection
2. Try refreshing the page
3. Check Supabase status: https://status.supabase.com
4. Disable VPN/proxy temporarily
5. Check browser console for CORS errors

---

### ❌ CORS Error

**Error Message:**
```
Access to fetch has been blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

**Cause:** CORS is blocking the request (usually in development).

**Solution:**
1. Verify Supabase URL is correct
2. Check if you're using localhost or 127.0.0.1
3. For production: Add your domain to Supabase allowed origins
4. Supabase Dashboard → Settings → API → Site URL

---

## Configuration Errors

### ❌ "process is not defined"

**Error Message:**
```
ReferenceError: process is not defined
```

**Cause:** Code is trying to access `process.env` which doesn't exist in browser.

**Solution:**
✅ **Already fixed!** This should not appear anymore.

If you still see it:
1. Check `/utils/config.ts` for any `process.env` references
2. Use direct values instead
3. See commit history for the fix

---

### ❌ "Cannot find module"

**Error Message:**
```
Cannot find module '@supabase/supabase-js'
Module not found
```

**Cause:** Dependencies not installed.

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or with yarn
rm -rf node_modules
yarn install
```

---

## Session/Storage Errors

### ❌ "Session expired"

**Error Message:**
```
Session expired
Please login again
```

**Cause:** Auth session has expired.

**Solution:**
- Login again with OTP
- Sessions are valid for 7 days
- Can configure in Supabase Dashboard → Authentication → Settings

---

### ❌ "localStorage is full"

**Error Message:**
```
QuotaExceededError
localStorage is full
```

**Cause:** Too much data in localStorage (rare).

**Solution:**
```javascript
// Clear old data
localStorage.clear();
sessionStorage.clear();

// Reload page
location.reload();
```

---

## Build Errors

### ❌ TypeScript Errors

**Error Message:**
```
TS2304: Cannot find name 'X'
TS2339: Property 'X' does not exist
```

**Solution:**
1. Check for typos in variable/property names
2. Ensure imports are correct
3. Check TypeScript version compatibility
4. Clear build cache and rebuild

---

### ❌ "Build failed"

**Error Message:**
```
Build failed
Compilation error
```

**Solution:**
1. Check error details in console
2. Fix any TypeScript errors
3. Ensure all dependencies are installed
4. Try:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

---

## Browser-Specific Errors

### ❌ Safari Private Mode

**Issue:** Auth doesn't work in Safari Private Mode

**Cause:** Safari blocks sessionStorage in private mode.

**Solution:**
- Use regular (non-private) browsing mode
- Or use a different browser (Chrome, Firefox, Edge)

---

### ❌ Ad Blockers

**Issue:** OTP not sending, random failures

**Cause:** Ad blocker interfering with requests.

**Solution:**
- Disable ad blocker for your site
- Add site to ad blocker whitelist

---

## Supabase-Specific Errors

### ❌ "Invalid API key"

**Error Message:**
```
Invalid API key
Invalid Supabase key
```

**Cause:** Anon key is wrong or expired.

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the correct `anon` `public` key
3. Update `/utils/config.ts`:
   ```typescript
   export const SUPABASE_CONFIG = {
     url: 'your-project-url',
     anonKey: 'your-new-anon-key',
   };
   ```

---

### ❌ "Project not found"

**Error Message:**
```
Project not found
Invalid project URL
```

**Cause:** Supabase URL is incorrect.

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the correct Project URL
3. Update `/utils/config.ts`:
   ```typescript
   export const SUPABASE_CONFIG = {
     url: 'https://xxxxx.supabase.co',  // ← Correct URL
     anonKey: '...',
   };
   ```

---

## Getting More Help

### Check These First:
1. **Browser Console** (F12) - See error details
2. **Network Tab** - Check failed requests
3. **Supabase Logs** - Dashboard → Logs → Auth
4. **This Guide** - Search for your error message

### Documentation:
- `/QUICK_FIX.md` - Quick solutions
- `/SUPABASE_AUTH_HOOK_FIX.md` - Auth Hook issues
- `/SUPABASE_TEST.md` - Testing scripts
- `/DEPLOYMENT_SUMMARY.md` - Configuration reference
- `/README.md` - General documentation

### Debug Mode:
Enable in `/utils/config.ts`:
```typescript
export const DEV_MODE = {
  enabled: true,  // Show debug info
  showDebugInfo: true,  // More details
};
```

### Mock Mode (for testing):
```typescript
// In /utils/config.ts
export const AUTH_MODE = 'mock';  // Use mock data
```
Use OTP: `1234` for any email/phone.

---

**Last Updated:** 2025-11-06
**Need to add an error?** Edit this file and add it to the appropriate section.
