# 🎨 Visual Fix Guide - Auth Hook Error

Step-by-step visual guide to fix the "Hook requires authorization token" error.

## 🚨 The Error You're Seeing

In your browser console or UI, you see:
```
❌ {"code":"unexpected_failure","message":"Hook requires authorization token"}
```

## ✅ The Solution (5 Minutes)

Follow these screenshots/steps:

---

### Step 1: Open Supabase Dashboard

```
1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select your project: kiaozqbwolqauxjmwlks
```

**You should see:**
```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
│  Project: kiaozqbwolqauxjmwlks         │
│                                         │
│  ├─ Database                           │
│  ├─ Authentication  ← Click here       │
│  ├─ Storage                            │
│  ├─ Edge Functions                     │
│  └─ Settings                           │
└─────────────────────────────────────────┘
```

---

### Step 2: Go to Authentication → Hooks

```
Navigation:
1. Click "Authentication" in left sidebar
2. Click "Hooks" tab at the top
```

**You should see:**
```
┌─────────────────────────────────────────────────────┐
│  Authentication                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Users  Policies  Providers  Hooks  ← Here  │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Auth Hooks                                         │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │ Send SMS Hook                            │     │
│  │ Status: Enabled ✅                       │     │
│  │ URL: https://...                         │     │
│  │ [Edit] [Delete] ← Click Delete           │     │
│  └──────────────────────────────────────────┘     │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │ Send Email Hook                          │     │
│  │ Status: Enabled ✅                       │     │
│  │ URL: https://...                         │     │
│  │ [Edit] [Delete] ← Click Delete           │     │
│  └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

---

### Step 3: Delete All Hooks

```
For each hook listed:
1. Click [Delete] button
2. Confirm deletion
3. Repeat for all hooks
```

**After deletion:**
```
┌─────────────────────────────────────────────────────┐
│  Authentication > Hooks                              │
│                                                      │
│  Auth Hooks                                         │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │  No hooks configured                     │     │
│  │                                          │     │
│  │  Auth hooks allow you to customize      │     │
│  │  the authentication flow.               │     │
│  │                                          │     │
│  │  [+ Add Hook]                           │     │
│  └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

✅ **Good! No hooks = No "Hook requires authorization token" error**

---

### Step 4: Enable Email Provider

```
Navigation:
1. Click "Providers" tab
2. Find "Email" in the list
3. Click to expand
```

**You should see:**
```
┌─────────────────────────────────────────────────────┐
│  Authentication > Providers                          │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │ 📧 Email                                 │     │
│  │                                          │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ Enable Email provider            │   │     │
│  │ │ [ ] Disabled  [✓] Enabled ← On  │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ Confirm email                    │   │     │
│  │ │ [✓] Enabled                      │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ [Save]  ← Click to save                │     │
│  └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

**Important:**
- ✅ "Enable Email provider" should be checked
- ✅ "Confirm email" should be checked
- ✅ Click [Save]

---

### Step 5: (Optional) Enable Phone Provider

Only if you need SMS OTP:

```
Navigation:
1. Still in "Providers" tab
2. Find "Phone" in the list
3. Click to expand
```

**You should see:**
```
┌─────────────────────────────────────────────────────┐
│  Authentication > Providers                          │
│                                                      │
│  ┌──────────────────────────────────────────┐     │
│  │ 📱 Phone                                 │     │
│  │                                          │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ Enable Phone provider            │   │     │
│  │ │ [✓] Enabled  ← Turn on          │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ SMS Provider: [Twilio ▼]               │     │
│  │                                          │     │
│  │ Twilio Account SID                      │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ ACxxxxxxxxxxxxxxxxxxxxxxx        │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ Twilio Auth Token                       │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ ●●●●●●●●●●●●●●●●●●●●●●●●       │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ Twilio Phone Number                     │     │
│  │ ┌──────────────────────────────────┐   │     │
│  │ │ +1234567890                      │   │     │
│  │ └──────────────────────────────────┘   │     │
│  │                                          │     │
│  │ [Save]  ← Click to save                │     │
│  └──────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

**Note:** You need a Twilio account with credentials. See below.

---

### Step 6: Clear Browser Data

```
In your browser console (F12), run:
```

```javascript
// Clear session and cache
sessionStorage.clear();
localStorage.clear();

// Reload page
location.reload();
```

**Or manually:**
```
Chrome/Edge:
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Select "Cookies and other site data"
4. Click "Clear data"

Firefox:
1. Press Ctrl+Shift+Delete
2. Select "Cache"
3. Select "Cookies"
4. Click "Clear Now"

Safari:
1. Safari → Preferences → Privacy
2. Click "Manage Website Data"
3. Click "Remove All"
```

---

### Step 7: Test!

Go back to your app and try to register/login:

```
✅ Expected Result:

1. Enter email address
2. Click "Send OTP"
3. See success message: "OTP sent to your email"
4. Check your email inbox (or spam)
5. Enter the 6-digit OTP
6. Successfully logged in! 🎉
```

---

## 🎯 Visual Comparison

### ❌ Before (With Auth Hooks)

```
Your App → Supabase Auth → Auth Hook → ❌ Error!
                              ↓
                    "Hook requires authorization token"
```

### ✅ After (Built-in Provider)

```
Your App → Supabase Auth → Built-in Email Provider → ✅ Success!
                              ↓
                        OTP sent via email
```

---

## 📱 Setting Up Twilio (For Phone OTP)

### Visual Steps:

#### 1. Sign Up for Twilio

```
Go to: https://www.twilio.com/try-twilio
Fill out the form:
┌────────────────────────────────┐
│ First Name: [Your Name      ] │
│ Last Name:  [Your Name      ] │
│ Email:      [your@email.com ] │
│ Password:   [●●●●●●●●●●●●●] │
│                                │
│ [Sign Up]                      │
└────────────────────────────────┘
```

#### 2. Get Your Credentials

After signing up:
```
Twilio Console:
┌─────────────────────────────────────┐
│ Account Info                        │
│                                     │
│ Account SID                         │
│ ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│ [Copy]                              │
│                                     │
│ Auth Token                          │
│ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●  │
│ [Show] [Copy]                       │
└─────────────────────────────────────┘
```

#### 3. Buy a Phone Number

```
Twilio Console → Phone Numbers → Buy a Number

┌─────────────────────────────────────┐
│ Buy a Phone Number                  │
│                                     │
│ Capabilities:                       │
│ ☑ SMS                               │
│ ☐ Voice                             │
│ ☐ MMS                               │
│                                     │
│ Country: [United States ▼]         │
│                                     │
│ [Search]                            │
│                                     │
│ Available Numbers:                  │
│ +1 (234) 567-8901  [Buy] $1/month │
│ +1 (234) 567-8902  [Buy] $1/month │
│ +1 (234) 567-8903  [Buy] $1/month │
└─────────────────────────────────────┘
```

#### 4. Add to Supabase

Copy the credentials to Supabase (Step 5 above).

---

## 🧪 Testing Visual Guide

### Test in Browser Console:

```javascript
// Open console (F12) and run this:

const testEmail = 'your.email@example.com';

fetch('https://kiaozqbwolqauxjmwlks.supabase.co/auth/v1/otp', {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: testEmail })
})
.then(r => r.json())
.then(data => {
  console.log('✅ SUCCESS!', data);
  console.log('Check your email for OTP');
})
.catch(err => {
  console.error('❌ ERROR:', err);
});
```

**Expected Console Output:**
```
✅ SUCCESS! {}
Check your email for OTP
```

---

## 📊 Troubleshooting Checklist

```
┌─────────────────────────────────────────┐
│ Pre-Flight Checklist                    │
│                                         │
│ ☑ Supabase Dashboard opened             │
│ ☑ All Auth Hooks deleted                │
│ ☑ Email provider enabled                │
│ ☑ Phone provider enabled (optional)     │
│ ☑ Twilio credentials added (for phone)  │
│ ☑ Browser cache cleared                 │
│ ☑ sessionStorage cleared                │
│ ☑ Page reloaded                         │
│                                         │
│ Ready to test! ✅                       │
└─────────────────────────────────────────┘
```

---

## 🎉 Success Indicators

### ✅ You'll Know It's Working When:

1. **No error in console**
   ```
   ✅ No red errors
   ✅ No "Hook requires authorization token"
   ```

2. **Success message in UI**
   ```
   ✅ "OTP sent successfully"
   ✅ "Check your email for OTP"
   ```

3. **Email received**
   ```
   ✅ Email in inbox (or spam folder)
   ✅ 6-digit OTP code visible
   ✅ From: Supabase or your project name
   ```

4. **Network tab shows success**
   ```
   F12 → Network Tab:
   POST /auth/v1/otp
   Status: 200 ✅
   ```

---

## 💡 Pro Tips

### Tip 1: Test Email First
```
Email OTP is:
✅ Free
✅ Easier to set up
✅ No Twilio needed
✅ Works immediately

Start here!
```

### Tip 2: Check Spam Folder
```
Can't find the email?
→ Check spam/junk folder
→ Wait 1-2 minutes
→ Check Supabase logs
```

### Tip 3: Use Mock Mode for Development
```typescript
// In /utils/config.ts
export const AUTH_MODE = 'mock';
```
```
Use OTP: 1234
Perfect for testing UI without Supabase!
```

---

## 📞 Need More Help?

### Quick Links:
- **Text Guide:** [QUICK_FIX.md](QUICK_FIX.md)
- **Detailed Guide:** [SUPABASE_AUTH_HOOK_FIX.md](SUPABASE_AUTH_HOOK_FIX.md)
- **Test Scripts:** [SUPABASE_TEST.md](SUPABASE_TEST.md)
- **All Errors:** [ERROR_REFERENCE.md](ERROR_REFERENCE.md)

### Still Stuck?
1. Check browser console for exact error
2. Check Supabase logs (Dashboard → Logs → Auth)
3. Search error in [ERROR_REFERENCE.md](ERROR_REFERENCE.md)
4. Try mock mode temporarily

---

**Time to complete:** 5-10 minutes  
**Difficulty:** Easy  
**Success rate:** 99%  

**You've got this! 🚀**
