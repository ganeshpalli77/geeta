# ⚡ Quick Fix - "Hook requires authorization token"

## 🚨 Errors You Might Be Seeing

Any of these Auth Hook errors:
```
{"code":"unexpected_failure","message":"Hook requires authorization token"}
{"code":"unexpected_failure","message":"Invalid payload sent to hook"}
```

**Both have the same solution:** Delete Auth Hooks and use built-in providers.

## ✅ 5-Minute Fix

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Navigate to Auth Hooks
Click: **Authentication** → **Hooks**

### Step 3: Delete/Disable All Hooks
- Find "Send SMS" hook → **Delete it**
- Find "Send Email" hook → **Delete it**

### Step 4: Enable Built-in Providers

#### For Email OTP:
1. Click: **Authentication** → **Providers** → **Email**
2. Toggle ON: **Enable Email provider**
3. Toggle ON: **Confirm email**
4. Click: **Save**

#### For Phone OTP (Optional):
1. Click: **Authentication** → **Providers** → **Phone**
2. Toggle ON: **Enable Phone provider**
3. Select: **Twilio** (or your SMS provider)
4. Enter your Twilio credentials:
   - Account SID
   - Auth Token
   - Phone Number (your Twilio number)
5. Click: **Save**

### Step 5: Clear Browser Data
1. Open browser console (F12)
2. Run:
   ```javascript
   sessionStorage.clear();
   localStorage.clear();
   location.reload();
   ```

### Step 6: Test Again
- Try email OTP first (simpler)
- Use your real email address
- Check spam folder for OTP

## 🎯 That's It!

Your OTP should now work without the "Hook requires authorization token" error.

## 💡 Why This Works

- **Auth Hooks** require custom configuration and authorization setup
- **Built-in Providers** handle authentication automatically
- No custom hooks = No authorization token errors

## 📱 Need Phone OTP?

You need a Twilio account:
1. Sign up: https://www.twilio.com (free trial available)
2. Get Account SID and Auth Token
3. Buy a phone number with SMS capability
4. Add credentials to Supabase (step 4 above)

## 🆘 Still Not Working?

### Option 1: Use Email OTP Only
Email is free and works immediately. Skip phone OTP for now.

### Option 2: Use Mock Mode (Development)
Edit `/utils/config.ts`:
```typescript
export const AUTH_MODE = 'mock';  // Change from 'supabase'
```
Then use OTP: `1234` for any email/phone.

### Option 3: Read Full Guide
See `/SUPABASE_AUTH_HOOK_FIX.md` for detailed troubleshooting.

## ✨ Quick Test

After the fix, test in browser console (F12):
```javascript
// Test if it's working
const testEmail = 'your.email@example.com';  // Use your real email

fetch('https://kiaozqbwolqauxjmwlks.supabase.co/auth/v1/otp', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: testEmail })
})
.then(r => r.json())
.then(d => console.log('✅ Success!', d))
.catch(e => console.error('❌ Error:', e));
```

**Expected result:** `✅ Success! {}`

---

**Time to fix:** 5 minutes
**Difficulty:** Easy
**Cost:** Free (Email), ~$15/month (Twilio for SMS)

**Questions?** See full docs:
- `/SUPABASE_AUTH_HOOK_FIX.md` - Detailed solutions
- `/SUPABASE_TEST.md` - Testing guide
- `/README.md` - Full documentation
