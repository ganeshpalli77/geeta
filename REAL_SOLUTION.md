# ✅ REAL SOLUTION: Pending Registration in MongoDB

## Problem

Supabase metadata doesn't persist when user verifies OTP. When logging in with phone OTP, Supabase only has the phone number, not the email.

## Solution

**Store pending registration in MongoDB BEFORE sending OTP, retrieve it AFTER OTP verification.**

---

## How It Works

### **Flow:**

```
1. User enters email + phone
   ↓
2. Store in MongoDB pending_registrations collection ✅
   ↓
3. Send OTP to both email and phone
   ↓
4. User verifies with either OTP
   ↓
5. Retrieve pending registration from MongoDB ✅
   ↓
6. Register user with BOTH email and phone ✅
```

---

## What Was Changed

### **Backend:**

#### 1. New Route: `backend/routes/pendingRegistrations.js`
- `POST /api/pending-registrations/store` - Store email + phone before OTP
- `POST /api/pending-registrations/retrieve` - Get email + phone after OTP

#### 2. `backend/server.js`
- Registered new pending registrations route

### **Frontend:**

#### 1. `src/components/portal/AuthPage.tsx`
- Stores pending registration in MongoDB BEFORE sending OTP
- API call to `/api/pending-registrations/store`

#### 2. `src/contexts/AppContext.tsx`
- Retrieves pending registration from MongoDB AFTER OTP verification
- API call to `/api/pending-registrations/retrieve`
- Uses retrieved email + phone to register user

---

## Database Collections

### **New Collection:**
- `pending_registrations` - Temporary storage for email + phone
  - Expires after 15 minutes
  - Auto-cleanup available

### **Existing:**
- `users` - Final user storage with both email and phone

---

## Restart & Test

### **1. Restart Backend (REQUIRED!)**
```bash
cd backend
npm run dev
```

### **2. Test Registration**
1. Open: http://localhost:3000
2. Enter email: test@example.com
3. Enter phone: 9876543210
4. Click "Send OTP to Both"
5. Check console:
   ```
   ✅ Pending registration stored in MongoDB
   ✅ OTP sent to email
   ✅ OTP sent to phone
   ```
6. Enter phone OTP
7. Check console:
   ```
   ✅ Retrieved pending registration from MongoDB: {
     email: "test@example.com",
     phone: "+919876543210"
   }
   ✅ User registered in unified MongoDB collection
   ```

### **3. Verify in Database**
```javascript
// Check pending registrations
db.pending_registrations.find().pretty()

// Check users
db.users.find().sort({ createdAt: -1 }).limit(1).pretty()

// Should see:
{
  email: "test@example.com",    // ✅
  phone: "+919876543210",       // ✅
  emailVerified: false,
  phoneVerified: true,
  verifiedWith: "phone"
}
```

---

## Expected Console Logs

```
// When clicking "Send OTP"
✅ Pending registration stored in MongoDB
✅ OTP sent to email: test@example.com
✅ OTP sent to phone: +919876543210

// When entering phone OTP
Trying phone OTP verification...
✅ Phone OTP verified successfully
✅ Retrieved pending registration from MongoDB: { email: "test@example.com", phone: "+919876543210" }
🔐 Handling Supabase auth: { email: "test@example.com", phone: "+919876543210", userId: "..." }
✅ User registered in unified MongoDB collection
✅ Verification status updated: phone
```

---

## Why This Works

1. **MongoDB stores email + phone** - Temporary but persistent
2. **Works with any OTP method** - Email or phone, doesn't matter
3. **No localStorage** - All data in MongoDB only
4. **No Supabase DB** - Supabase only for authentication
5. **Clean architecture** - Pending data expires automatically

---

## Architecture

```
Components:
- Supabase: Authentication (OTP sending/verification)
- MongoDB: ALL data storage (pending + final)
- No localStorage
- No Supabase database

Flow:
Frontend → MongoDB (store pending)
Frontend → Supabase (send OTP)
User → Supabase (verify OTP)
Frontend → MongoDB (retrieve pending)
Frontend → MongoDB (save final user)
```

---

## Files Created/Modified

### Created:
1. `backend/routes/pendingRegistrations.js`

### Modified:
1. `backend/server.js`
2. `src/components/portal/AuthPage.tsx`
3. `src/contexts/AppContext.tsx`

---

## Success Criteria

✅ Backend restarts without errors  
✅ Pending registration stored in MongoDB  
✅ OTPs sent to both email and phone  
✅ User can login with either OTP  
✅ Pending registration retrieved from MongoDB  
✅ User registered with BOTH email and phone  
✅ No "Both email and phone are required" error  
✅ User appears in `users` collection with both fields  

---

**Restart backend and test now!** 🚀
