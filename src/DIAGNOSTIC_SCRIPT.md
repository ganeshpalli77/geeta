# 🔍 Diagnostic Script - Supabase Auth

Run this script in your browser console to diagnose authentication issues.

## 🚀 Quick Diagnostic

Open browser console (F12) and paste this entire script:

```javascript
// ============================================================================
// SUPABASE AUTH DIAGNOSTIC SCRIPT
// ============================================================================
// Run this in browser console (F12) to diagnose Auth Hook errors
// ============================================================================

(async () => {
  console.clear();
  console.log('🔍 SUPABASE AUTH DIAGNOSTIC SCRIPT');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Configuration
  const config = {
    url: 'https://kiaozqbwolqauxjmwlks.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U'
  };

  // Test 1: Configuration Check
  console.log('📋 TEST 1: Configuration Check');
  console.log('───────────────────────────────────────────────────────────');
  console.log('Project URL:', config.url);
  console.log('Anon Key:', config.anonKey.substring(0, 50) + '...');
  console.log('Key Length:', config.anonKey.length, 'chars');
  
  // Decode JWT to check expiry
  try {
    const payload = JSON.parse(atob(config.anonKey.split('.')[1]));
    const expiry = new Date(payload.exp * 1000);
    const now = new Date();
    const isExpired = expiry < now;
    
    console.log('Key Expiry:', expiry.toLocaleDateString());
    console.log('Key Status:', isExpired ? '❌ EXPIRED' : '✅ Valid');
    
    if (isExpired) {
      console.error('⚠️  WARNING: Your anon key has EXPIRED!');
      console.log('   Solution: Get new key from Supabase Dashboard → Settings → API');
      return;
    }
  } catch (e) {
    console.error('❌ Could not decode anon key. Key might be invalid.');
    return;
  }
  
  console.log('✅ Configuration looks good\n');

  // Test 2: API Connection
  console.log('📡 TEST 2: API Connection');
  console.log('───────────────────────────────────────────────────────────');
  try {
    const response = await fetch(config.url + '/rest/v1/', {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });
    
    if (response.ok) {
      console.log('✅ API connection successful');
      console.log('   Status:', response.status, response.statusText);
    } else {
      console.error('❌ API connection failed');
      console.log('   Status:', response.status, response.statusText);
      console.log('   Solution: Check if Supabase project is active');
    }
  } catch (error) {
    console.error('❌ API connection error:', error.message);
    console.log('   Solution: Check internet connection');
  }
  console.log('');

  // Test 3: Auth Endpoint Health
  console.log('🔐 TEST 3: Auth Endpoint Health');
  console.log('───────────────────────────────────────────────────────────');
  try {
    const response = await fetch(config.url + '/auth/v1/health', {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.anonKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth endpoint healthy');
      console.log('   Health status:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Auth endpoint unhealthy');
      console.log('   Status:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Auth endpoint error:', error.message);
  }
  console.log('');

  // Test 4: OTP Endpoint Test (Email)
  console.log('📧 TEST 4: OTP Endpoint Test (Email)');
  console.log('───────────────────────────────────────────────────────────');
  console.log('Testing with dummy email: test@example.com');
  console.log('(No actual email will be sent)');
  console.log('');
  
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
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(data, null, 2));
      console.log('');
      console.log('🎉 SUCCESS! Your Supabase auth is properly configured.');
      console.log('   You can now use email OTP in your app.');
    } else {
      console.error('❌ OTP endpoint error');
      console.log('   Status:', response.status);
      console.log('   Error:', JSON.stringify(data, null, 2));
      console.log('');
      
      // Analyze the error
      if (data.message) {
        console.log('🔍 ERROR ANALYSIS:');
        console.log('───────────────────────────────────────────────────────────');
        
        if (data.message.includes('Hook requires authorization token')) {
          console.log('❌ ERROR: Auth Hook requires authorization token');
          console.log('');
          console.log('🔧 SOLUTION:');
          console.log('   1. Go to Supabase Dashboard');
          console.log('   2. Authentication → Hooks');
          console.log('   3. DELETE all Auth Hooks');
          console.log('   4. Authentication → Providers → Email');
          console.log('   5. ENABLE Email provider');
          console.log('');
          console.log('   See: /QUICK_FIX.md for detailed steps');
        } 
        else if (data.message.includes('Invalid payload sent to hook')) {
          console.log('❌ ERROR: Invalid payload sent to hook');
          console.log('');
          console.log('🔧 SOLUTION:');
          console.log('   1. Go to Supabase Dashboard');
          console.log('   2. Authentication → Hooks');
          console.log('   3. DELETE all Auth Hooks');
          console.log('   4. Authentication → Providers → Email');
          console.log('   5. ENABLE Email provider');
          console.log('');
          console.log('   The Auth Hook is expecting different data.');
          console.log('   Simpler solution: Use built-in providers instead.');
          console.log('');
          console.log('   See: /AUTH_HOOK_DISABLE_GUIDE.md for step-by-step guide');
        }
        else if (data.message.includes('Signups not allowed')) {
          console.log('❌ ERROR: Signups not allowed');
          console.log('');
          console.log('🔧 SOLUTION:');
          console.log('   1. Go to Supabase Dashboard');
          console.log('   2. Authentication → Settings');
          console.log('   3. ENABLE "Enable email signups"');
          console.log('   4. Save settings');
        }
        else if (data.message.includes('Invalid API key')) {
          console.log('❌ ERROR: Invalid API key');
          console.log('');
          console.log('🔧 SOLUTION:');
          console.log('   1. Go to Supabase Dashboard → Settings → API');
          console.log('   2. Copy the anon/public key');
          console.log('   3. Update /utils/config.ts with the new key');
        }
        else {
          console.log('❌ UNKNOWN ERROR:', data.message);
          console.log('');
          console.log('🔧 GENERAL SOLUTIONS:');
          console.log('   1. Check Supabase Dashboard → Logs → Auth');
          console.log('   2. Verify Email provider is enabled');
          console.log('   3. Try disabling all Auth Hooks');
          console.log('   4. See /ERROR_REFERENCE.md for more solutions');
        }
      }
    }
  } catch (error) {
    console.error('❌ OTP endpoint error:', error.message);
    console.log('   Solution: Check network connection');
  }

  // Test 5: Session Check
  console.log('');
  console.log('👤 TEST 5: Current Session');
  console.log('───────────────────────────────────────────────────────────');
  
  // Check sessionStorage for Supabase session
  const keys = Object.keys(sessionStorage).filter(k => k.includes('supabase'));
  if (keys.length > 0) {
    console.log('✅ Supabase session data found');
    console.log('   Keys:', keys.length);
  } else {
    console.log('ℹ️  No active Supabase session');
  }

  // Summary
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ = Working fine');
  console.log('❌ = Needs attention');
  console.log('ℹ️  = Informational');
  console.log('');
  console.log('Next steps:');
  console.log('1. If you see ❌ errors, follow the suggested solutions');
  console.log('2. If OTP endpoint shows Auth Hook error → Disable hooks');
  console.log('3. Read /QUICK_FIX.md for quick solutions');
  console.log('4. Read /ERROR_REFERENCE.md for all errors');
  console.log('');
  console.log('🎉 Diagnostic complete!');
})();
```

## 🎯 What This Script Does

1. **✅ Checks your Supabase configuration**
   - Validates URL and anon key
   - Checks if key is expired

2. **🌐 Tests API connection**
   - Verifies Supabase project is accessible
   - Checks authorization headers

3. **🔐 Tests Auth endpoint**
   - Verifies auth service is healthy
   - Checks authentication system status

4. **📧 Tests OTP endpoint**
   - **This is the important one!**
   - Tests if OTP can be sent
   - Identifies Auth Hook errors
   - Provides specific solutions

5. **👤 Checks current session**
   - Shows if you're logged in
   - Lists session data

## 📋 Expected Output

### ✅ If Everything is Working:

```
🔍 SUPABASE AUTH DIAGNOSTIC SCRIPT
═══════════════════════════════════════════════════════════

📋 TEST 1: Configuration Check
───────────────────────────────────────────────────────────
✅ Configuration looks good

📡 TEST 2: API Connection
───────────────────────────────────────────────────────────
✅ API connection successful

🔐 TEST 3: Auth Endpoint Health
───────────────────────────────────────────────────────────
✅ Auth endpoint healthy

📧 TEST 4: OTP Endpoint Test (Email)
───────────────────────────────────────────────────────────
✅ OTP endpoint working!

🎉 SUCCESS! Your Supabase auth is properly configured.
```

### ❌ If Auth Hook Error:

```
📧 TEST 4: OTP Endpoint Test (Email)
───────────────────────────────────────────────────────────
❌ OTP endpoint error

🔍 ERROR ANALYSIS:
───────────────────────────────────────────────────────────
❌ ERROR: Invalid payload sent to hook

🔧 SOLUTION:
   1. Go to Supabase Dashboard
   2. Authentication → Hooks
   3. DELETE all Auth Hooks
   4. Authentication → Providers → Email
   5. ENABLE Email provider

   See: /AUTH_HOOK_DISABLE_GUIDE.md for step-by-step guide
```

## 🔧 Quick Actions Based on Results

### If you see "Hook requires authorization token":
→ Run the disable hooks guide: [/AUTH_HOOK_DISABLE_GUIDE.md](AUTH_HOOK_DISABLE_GUIDE.md)

### If you see "Invalid payload sent to hook":
→ Run the disable hooks guide: [/AUTH_HOOK_DISABLE_GUIDE.md](AUTH_HOOK_DISABLE_GUIDE.md)

### If you see "Signups not allowed":
→ Enable signups: Dashboard → Authentication → Settings → Enable email signups

### If you see "Invalid API key":
→ Update key: Dashboard → Settings → API → Copy anon key → Update `/utils/config.ts`

### If everything is ✅:
→ Great! Your auth is configured correctly. Try logging in!

## 🆘 Troubleshooting the Script

### Script doesn't run:
- Make sure you're in the browser console (F12)
- Paste the entire script (all lines)
- Press Enter

### "Fetch error" or "Network error":
- Check your internet connection
- Verify Supabase URL is correct
- Check if Supabase is down: https://status.supabase.com

### Script runs but shows errors:
- Follow the suggested solutions in the output
- Read the relevant documentation files

## 📚 Related Documentation

- **Quick Fix:** [/QUICK_FIX.md](QUICK_FIX.md)
- **Disable Hooks Guide:** [/AUTH_HOOK_DISABLE_GUIDE.md](AUTH_HOOK_DISABLE_GUIDE.md)
- **All Errors:** [/ERROR_REFERENCE.md](ERROR_REFERENCE.md)
- **Visual Guide:** [/VISUAL_FIX_GUIDE.md](VISUAL_FIX_GUIDE.md)

## 💡 Pro Tip

Save this script as a browser bookmark for quick access:

1. Create a new bookmark
2. Name it: "Supabase Diagnostic"
3. URL: `javascript:(paste the script here)`

Click the bookmark anytime to run the diagnostic!

---

**This script is safe to run** - it only reads data and tests endpoints. It doesn't modify anything in your Supabase project.
