# New Unified Authentication System

## Overview

The authentication system has been completely redesigned to require **both email and phone** during registration, send **dual OTPs**, and allow verification with **either one**.

---

## 🎯 Key Changes

### Previous System
- ❌ User chooses either email OR phone
- ❌ Separate `email_users` and `phone_users` collections
- ❌ OTP sent to only one method
- ❌ Users fragmented across collections

### New System
- ✅ User must provide BOTH email AND phone
- ✅ Single unified `users` collection
- ✅ OTP sent to BOTH email and phone simultaneously
- ✅ User can verify with EITHER email or phone OTP
- ✅ All users in one place for easy management

---

## 📋 Registration Flow

### Step 1: User Input
```
┌─────────────────────────────┐
│  Email: user@example.com *  │
│  Phone: +91 9876543210   *  │
│  [Send OTP to Both] button  │
└─────────────────────────────┘
```
- Both fields are **required**
- Email and phone validated on frontend and backend
- Cannot proceed without both

### Step 2: Dual OTP Sending
```
Frontend → Supabase → Send Email OTP ✉️
                   → Send SMS OTP   📱
```
- System attempts to send OTP to both
- Success if AT LEAST ONE succeeds
- User informed which methods received OTP

### Step 3: OTP Verification
```
┌─────────────────────────────┐
│  Email OTP: [______] ✅     │
│  Phone OTP: [______] ✅     │
│  [Verify OTP] button        │
└─────────────────────────────┘
```
- User enters OTP from either field
- System tries email OTP first (if provided)
- Falls back to phone OTP if email fails
- Success if EITHER OTP is valid

### Step 4: Database Registration
```
MongoDB users collection:
{
  _id: ObjectId,
  userId: "supabase-uuid",
  email: "user@example.com",     // Required
  phone: "+919876543210",         // Required
  emailVerified: true,            // Which method succeeded
  phoneVerified: false,
  verifiedWith: "email",          // 'email' or 'phone'
  registeredAt: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🗄️ Database Structure

### New Unified Schema

```javascript
// users collection (PRIMARY)
{
  _id: ObjectId,
  userId: String,              // Supabase UUID (optional)
  email: String,               // REQUIRED ✅
  phone: String,               // REQUIRED ✅
  emailVerified: Boolean,      // Email OTP verified
  phoneVerified: Boolean,      // Phone OTP verified
  verifiedWith: String,        // 'email' | 'phone' | 'both'
  registeredAt: Date,          // First registration
  lastLogin: Date,             // Most recent login
  createdAt: Date,
  updatedAt: Date
}
```

### Old Collections (Deprecated)
```javascript
// email_users (LEGACY - can be deleted after migration)
// phone_users (LEGACY - can be deleted after migration)
```

---

## 🔄 Migration Process

### 1. Run Migration Script
```bash
cd backend
node migrate-to-unified-users.js
```

This script:
- ✅ Merges `email_users` and `phone_users` into `users`
- ✅ Attempts to match users with same profiles
- ✅ Preserves all verification status
- ✅ Maintains backward compatibility
- ⚠️ Does NOT delete old collections (manual cleanup)

### 2. Verify Migration
```bash
# Connect to MongoDB
mongosh "mongodb+srv://..."

# Check unified users collection
use geeta-olympiad
db.users.find().pretty()
db.users.countDocuments()

# Verify all users have email and phone
db.users.find({ 
  $or: [
    { email: { $exists: false } },
    { phone: { $exists: false } }
  ]
})
```

### 3. Cleanup (Optional)
```bash
# After verifying migration success
db.email_users.drop()
db.phone_users.drop()
```

---

## 💻 Backend Changes

### Modified Files

#### 1. `backend/models/User.js`
- ✅ Added validation for both email and phone
- ✅ New fields: `emailVerified`, `phoneVerified`, `verifiedWith`
- ✅ `findUserByEmailOrPhone()` method
- ✅ `updateVerification()` method

#### 2. `backend/routes/users.js`
- ✅ Updated `/register` to require both fields
- ✅ New `/verify` endpoint for verification status
- ✅ Email and phone format validation
- ✅ Better error messages

---

## 🎨 Frontend Changes

### Modified Files

#### 1. `src/components/portal/AuthPage.tsx`
**Removed:**
- ❌ Toggle buttons between email/phone
- ❌ Single OTP input field
- ❌ `loginMethod` state

**Added:**
- ✅ Both email and phone input fields (always visible)
- ✅ Separate OTP fields for email and phone
- ✅ Dual OTP sending logic
- ✅ Either-or verification logic
- ✅ Visual indicators for OTP status

#### 2. `src/contexts/AppContext.tsx`
- ✅ Updated `handleSupabaseAuth` for dual registration
- ✅ Calls unified `registerUser` with both fields
- ✅ Verification status tracking

#### 3. `src/services/backendAPI.ts`
- ✅ Updated `BackendUser` interface
- ✅ Updated `registerUser` method signature
- ✅ New `verifyUser` method

---

## 🧪 Testing

### Test Scenarios

#### ✅ Happy Path - Email OTP
1. Enter valid email and phone
2. Click "Send OTP to Both"
3. Check both email and phone for OTPs
4. Enter email OTP only
5. Click "Verify OTP"
6. **Expected:** Login successful with email verification

#### ✅ Happy Path - Phone OTP
1. Enter valid email and phone
2. Click "Send OTP to Both"
3. Check both email and phone for OTPs
4. Enter phone OTP only
5. Click "Verify OTP"
6. **Expected:** Login successful with phone verification

#### ✅ Partial Failure - Email Only Sent
1. Enter valid email and invalid/unreachable phone
2. Click "Send OTP to Both"
3. **Expected:** "OTP sent to your email" message
4. Enter email OTP
5. **Expected:** Login successful

#### ✅ Partial Failure - Phone Only Sent
1. Enter invalid email and valid phone
2. Click "Send OTP to Both"
3. **Expected:** "OTP sent to your phone" message
4. Enter phone OTP
5. **Expected:** Login successful

#### ❌ Error Cases
1. **Missing email:** "Please enter your email address"
2. **Missing phone:** "Please enter your phone number"
3. **Invalid email format:** "Please enter a valid email address"
4. **Invalid phone format:** "Please enter a valid phone number"
5. **Both OTPs fail:** "Failed to send OTP to both email and phone"
6. **Wrong OTP:** "Invalid OTP. Please try again."

---

## 🔧 Configuration

### Environment Variables

#### Backend (`.env`)
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
```

### Supabase Setup
1. **Email OTP:** Enabled by default
2. **Phone OTP:** Requires Twilio configuration
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Phone provider
   - Add Twilio credentials

---

## 📊 API Endpoints

### POST `/api/users/register`
**Request:**
```json
{
  "userId": "supabase-uuid",
  "email": "user@example.com",
  "phone": "+919876543210",
  "emailVerified": false,
  "phoneVerified": false
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "userId": "...",
    "email": "user@example.com",
    "phone": "+919876543210",
    "emailVerified": false,
    "phoneVerified": false,
    "verifiedWith": null,
    "createdAt": "2025-11-21T..."
  },
  "message": "User registered successfully"
}
```

### POST `/api/users/verify`
**Request:**
```json
{
  "userId": "user-id",
  "verificationType": "email"  // or "phone"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "emailVerified": true,
    "phoneVerified": false,
    "verifiedWith": "email"
  },
  "message": "email verified successfully"
}
```

---

## 🎯 Benefits

### For Users
- ✅ More secure (two-factor by default)
- ✅ Flexibility (choose which OTP to use)
- ✅ Backup (if one method fails, use the other)

### For Admins
- ✅ Single source of truth for users
- ✅ Better analytics (all users in one place)
- ✅ Easier user management
- ✅ Better data integrity

### For Developers
- ✅ Cleaner codebase
- ✅ No need to check multiple collections
- ✅ Easier to add new features
- ✅ Better TypeScript support

---

## 🚨 Important Notes

1. **Backward Compatibility:** Old users will be automatically migrated on next login
2. **Supabase Config:** Phone OTP requires Twilio setup in Supabase
3. **Testing:** Test thoroughly before deploying to production
4. **Database Backup:** Always backup before running migration
5. **Indexes:** Create indexes after migration for performance

### Recommended Indexes
```javascript
// In MongoDB shell
use geeta-olympiad

// Email and phone should be indexed
db.users.createIndex({ email: 1 })
db.users.createIndex({ phone: 1 })

// Composite index for lookups
db.users.createIndex({ email: 1, phone: 1 })

// userId for Supabase lookups
db.users.createIndex({ userId: 1 })
```

---

## 📞 Troubleshooting

### Issue: Phone OTP not sending
**Solution:** 
- Check Supabase Phone provider is enabled
- Verify Twilio credentials
- Check phone number format (+countrycode)

### Issue: Email OTP not sending
**Solution:**
- Check Supabase Email templates
- Verify sender email is configured
- Check spam folder

### Issue: Migration script fails
**Solution:**
- Check MongoDB connection string
- Ensure collections exist
- Run with `--verbose` flag for details

### Issue: Users can't login after migration
**Solution:**
- Check `userId` field mapping
- Verify Supabase UUID matches
- Check profile references

---

## 🔄 Rollback Plan

If needed, you can rollback by:

1. **Restore database backup:**
   ```bash
   mongorestore --uri="mongodb+srv://..." backup/
   ```

2. **Revert code changes:**
   ```bash
   git checkout <previous-commit>
   ```

3. **Re-deploy frontend and backend**

4. **Clear user sessions:**
   ```javascript
   // In Supabase dashboard or via API
   supabase.auth.signOut({ scope: 'global' })
   ```

---

## ✅ Deployment Checklist

- [ ] Backup MongoDB database
- [ ] Test on staging environment
- [ ] Run migration script
- [ ] Verify all users migrated correctly
- [ ] Test registration flow end-to-end
- [ ] Test login flow end-to-end
- [ ] Check console for errors
- [ ] Monitor error logs
- [ ] Update documentation
- [ ] Notify users of changes

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [MongoDB Aggregation Pipeline](https://www.mongodb.com/docs/manual/aggregation/)
- [Twilio SMS Setup](https://www.twilio.com/docs/sms)

---

## 🎉 Success Metrics

After deployment, monitor:
- ✅ User registration rate
- ✅ OTP delivery success rate
- ✅ Login success rate
- ✅ Error rates
- ✅ User feedback

**Expected improvements:**
- 📈 Higher user completion rate
- 📉 Fewer support tickets
- 📊 Better data quality
- 🚀 Faster queries

---

*Last updated: November 21, 2025*
