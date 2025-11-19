# Supabase Connection Test

## Quick Test Script

Open your browser console (F12) and run this script to test your Supabase configuration:

```javascript
// Test Supabase Configuration
(async () => {
  console.log('🧪 Testing Supabase Configuration...\n');
  
  // 1. Check configuration
  const config = {
    url: 'https://kiaozqbwolqauxjmwlks.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U'
  };
  
  console.log('✅ Configuration:');
  console.log('  URL:', config.url);
  console.log('  Anon Key:', config.anonKey.substring(0, 20) + '...');
  
  // 2. Test API connection
  console.log('\n🌐 Testing API connection...');
  try {
    const response = await fetch(config.url + '/rest/v1/', {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });
    
    if (response.ok) {
      console.log('✅ API connection successful');
    } else {
      console.error('❌ API connection failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ API connection error:', error.message);
  }
  
  // 3. Test Auth endpoint
  console.log('\n🔐 Testing Auth endpoint...');
  try {
    const response = await fetch(config.url + '/auth/v1/health', {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth endpoint healthy:', data);
    } else {
      console.error('❌ Auth endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Auth endpoint error:', error.message);
  }
  
  // 4. Test OTP endpoint (this will fail without a valid phone/email, but shows if auth hook is the issue)
  console.log('\n📧 Testing OTP endpoint...');
  try {
    const response = await fetch(config.url + '/auth/v1/otp', {
      method: 'POST',
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ OTP endpoint working!');
      console.log('  Response:', data);
    } else {
      console.error('❌ OTP endpoint error:', response.status);
      console.error('  Error details:', data);
      
      if (data.message && data.message.includes('Hook requires authorization token')) {
        console.log('\n🔧 SOLUTION:');
        console.log('  The error "Hook requires authorization token" means:');
        console.log('  1. Auth Hooks are enabled but not configured correctly');
        console.log('  2. Go to Supabase Dashboard → Authentication → Hooks');
        console.log('  3. DISABLE or DELETE all Auth Hooks');
        console.log('  4. Use built-in providers instead (Settings → Auth → Providers)');
        console.log('\n  See SUPABASE_AUTH_HOOK_FIX.md for detailed steps');
      }
    }
  } catch (error) {
    console.error('❌ OTP endpoint error:', error.message);
  }
  
  console.log('\n✨ Test complete!');
})();
```

## Manual Test Steps

### 1. Test Email OTP (Simplest)

```javascript
// In browser console
const { createClient } = await import('@supabase/supabase-js');

const supabase = createClient(
  'https://kiaozqbwolqauxjmwlks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U'
);

// Test email OTP
const result = await supabase.auth.signInWithOtp({
  email: 'your.email@example.com'
});

console.log('Result:', result);
```

### 2. Test Phone OTP

```javascript
// Test phone OTP
const result = await supabase.auth.signInWithOtp({
  phone: '+919876543210'  // Use your real phone number
});

console.log('Result:', result);
```

## Expected Responses

### ✅ Success Response
```json
{
  "data": {},
  "error": null
}
```

### ❌ Auth Hook Error
```json
{
  "data": null,
  "error": {
    "message": "Hook requires authorization token",
    "status": 500
  }
}
```

**Solution:** Disable Auth Hooks (see SUPABASE_AUTH_HOOK_FIX.md)

### ❌ Provider Not Enabled
```json
{
  "error": {
    "message": "Signups not allowed for this instance"
  }
}
```

**Solution:** Enable Email/Phone provider in Supabase Dashboard

### ❌ Invalid Phone Format
```json
{
  "error": {
    "message": "Invalid phone number format"
  }
}
```

**Solution:** Use E.164 format (+country code + number)

## Supabase Dashboard Checks

### Check 1: API Keys
1. Go to: Settings → API
2. Verify:
   - Project URL matches config
   - anon/public key matches config
   - Keys are not expired

### Check 2: Auth Providers
1. Go to: Authentication → Providers
2. Enable:
   - ✅ Email (for email OTP)
   - ✅ Phone (for SMS OTP)
3. Configure:
   - Phone → Add Twilio/MessageBird credentials

### Check 3: Auth Hooks
1. Go to: Authentication → Hooks
2. Check if any hooks are enabled:
   - Send SMS Hook
   - Send Email Hook
3. **If enabled and causing errors:**
   - Delete or disable them
   - Use built-in providers instead

### Check 4: Auth Logs
1. Go to: Logs → Auth Logs
2. Look for:
   - OTP send attempts
   - Error messages
   - Timestamp of errors

## Common Issues and Solutions

### Issue: "Hook requires authorization token"

**Quick Fix:**
1. Dashboard → Authentication → Hooks
2. Delete ALL hooks
3. Dashboard → Authentication → Providers → Email
4. Enable Email provider
5. Test with email OTP

**Why:** Auth Hooks require proper configuration. Built-in providers are simpler.

### Issue: "Failed to send OTP"

**Check:**
1. Is the provider enabled? (Email/Phone)
2. For phone: Are Twilio credentials correct?
3. For email: Is email provider enabled?
4. Check Supabase logs for details

### Issue: OTP not received

**Email:**
- Check spam folder
- Use a different email provider (Gmail, Outlook)
- Check Supabase logs

**Phone:**
- Verify phone number format (+91...)
- Check Twilio logs and balance
- Try a different phone number

## Testing Checklist

Run through this checklist:

- [ ] Project URL is correct in config
- [ ] Anon key is correct and not expired
- [ ] Auth Hooks are disabled (or properly configured)
- [ ] Email provider is enabled
- [ ] Phone provider is enabled (if using SMS)
- [ ] Twilio credentials are set (if using SMS)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows auth requests with 200 status
- [ ] Supabase logs show no errors

## Need Help?

1. **Check error message in browser console**
2. **Check Supabase Auth logs** (Dashboard → Logs)
3. **Read SUPABASE_AUTH_HOOK_FIX.md** for detailed solutions
4. **Try email OTP first** (simpler than phone)
5. **Use mock mode temporarily** (`AUTH_MODE = 'mock'` in config)

## Quick Debug Commands

```javascript
// Check if Supabase is loaded
console.log('Supabase client:', supabase);

// Check current session
const { data } = await supabase.auth.getSession();
console.log('Current session:', data);

// Check configuration
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Has anon key:', !!supabase.supabaseKey);

// Clear session
await supabase.auth.signOut();
sessionStorage.clear();
console.log('Session cleared');
```

---

**Quick Summary:**
- Run the test script above in browser console
- If you see "Hook requires authorization token" → Disable Auth Hooks
- Use built-in Email/Phone providers instead
- See SUPABASE_AUTH_HOOK_FIX.md for step-by-step instructions
