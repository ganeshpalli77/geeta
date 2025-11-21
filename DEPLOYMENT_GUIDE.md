# 🚀 Deployment Guide - New Unified Authentication System

## Quick Start

Follow these steps to deploy the new authentication system safely.

---

## ⚠️ IMPORTANT: Backup First!

```bash
# 1. Backup MongoDB database
mongodump --uri="mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geeta-olympiad" --out=backup/$(date +%Y%m%d)

# 2. Commit all code changes
git add .
git commit -m "feat: unified authentication with dual OTP"
git push
```

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB backup completed
- [ ] Code committed to Git
- [ ] Supabase Email OTP configured
- [ ] Supabase Phone OTP configured (Twilio)
- [ ] Environment variables updated
- [ ] Dependencies installed

---

## 🔧 Step-by-Step Deployment

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

### Step 2: Update Environment Variables

**Backend `.env`:**
```env
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://kiaozqbwolqauxjmwlks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Configure Supabase

1. **Enable Email Provider:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Email is enabled by default ✅

2. **Enable Phone Provider:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Click "Phone"
   - Enable Phone provider
   - Add Twilio credentials:
     - Account SID
     - Auth Token
     - Phone Number
   - Save changes

### Step 4: Migrate Database

```bash
cd backend
node migrate-to-unified-users.js
```

**Expected Output:**
```
🚀 Starting MongoDB User Migration...

✅ Connected to MongoDB

📊 Current state:
   - Users collection: 9 documents
   - Email users collection: 4 documents
   - Phone users collection: 4 documents

🔄 Starting migration...

➕ Created new user: user@example.com + +919876543210
✏️  Updated existing user: test@example.com
⏭️  Skipped (already migrated): admin@example.com

✅ Migration completed!
   - New users created: 3
   - Existing users updated: 2
   - Users skipped: 4

📊 Final state:
   - Total users in unified collection: 14

✨ Migration completed successfully!
```

### Step 5: Verify Migration

```bash
# Connect to MongoDB
mongosh "mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geeta-olympiad"

# Check users
db.users.find().pretty()

# Count users with both email and phone
db.users.countDocuments({ 
  email: { $exists: true, $ne: "" },
  phone: { $exists: true, $ne: "" }
})

# This should return most/all users
```

### Step 6: Create Indexes (Optional but Recommended)

```javascript
// In MongoDB shell
use geeta-olympiad

db.users.createIndex({ email: 1 })
db.users.createIndex({ phone: 1 })
db.users.createIndex({ userId: 1 })
db.users.createIndex({ email: 1, phone: 1 })
```

### Step 7: Start Backend Server

```bash
cd backend
npm run dev

# Expected output:
# Server is running on port 5000
# MongoDB connection established
# Health check: http://localhost:5000/health
```

**Test Backend:**
```bash
curl http://localhost:5000/health

# Expected response:
# {
#   "status": "OK",
#   "message": "Geeta Olympiad API is running",
#   "timestamp": "2025-11-21T..."
# }
```

### Step 8: Start Frontend

```bash
# In new terminal
npm run dev

# Expected output:
# VITE v6.3.5  ready in 1234 ms
# ➜  Local:   http://localhost:3000/
```

### Step 9: Test the Flow

1. **Open Browser:** http://localhost:3000
2. **Click Login/Register**
3. **Enter Both Fields:**
   - Email: your-test-email@gmail.com
   - Phone: +919876543210
4. **Click "Send OTP to Both"**
5. **Check Both:**
   - Email inbox for OTP
   - Phone for SMS OTP
6. **Enter Either OTP**
7. **Click "Verify OTP"**
8. **Expected:** Login successful! ✅

---

## 🧪 Testing Scenarios

### Test 1: Email OTP Only
```
Input: test1@example.com + 9876543210
Action: Send OTP
Result: ✅ Email OTP received
Action: Enter email OTP
Result: ✅ Login successful with email
```

### Test 2: Phone OTP Only
```
Input: test2@example.com + 9876543210
Action: Send OTP
Result: ✅ SMS OTP received
Action: Enter phone OTP
Result: ✅ Login successful with phone
```

### Test 3: Both OTPs
```
Input: test3@example.com + 9876543210
Action: Send OTP
Result: ✅ Both OTPs received
Action: Enter email OTP
Result: ✅ Login successful with email
```

### Test 4: Missing Fields
```
Input: (empty email) + 9876543210
Action: Send OTP
Result: ❌ "Please enter your email address"
```

### Test 5: Invalid Format
```
Input: invalid-email + 123
Action: Send OTP
Result: ❌ "Please enter a valid email address"
        ❌ "Please enter a valid phone number"
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start
```bash
# Check MongoDB connection
node test-connection.js

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### Issue: Email OTP not received
**Checklist:**
- ✅ Supabase email provider enabled
- ✅ Email templates configured
- ✅ Check spam folder
- ✅ Verify email in Supabase logs

**Test manually:**
```javascript
// In browser console on your app
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'test@example.com'
})
console.log({ data, error })
```

### Issue: Phone OTP not received
**Checklist:**
- ✅ Twilio credentials correct
- ✅ Phone number format: +countrycode
- ✅ Twilio account has credit
- ✅ Phone number verified in Twilio (if sandbox)

**Test manually:**
```javascript
// In browser console
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+919876543210'
})
console.log({ data, error })
```

### Issue: Migration failed
```bash
# Check MongoDB URI
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"

# Check collections exist
db.getCollectionNames()

# Re-run with verbose logging
NODE_ENV=development node migrate-to-unified-users.js
```

### Issue: Users can't login after migration
```bash
# Check user data
db.users.findOne({ email: "user@example.com" })

# Verify userId field
db.users.find({ userId: { $exists: false } })

# Update if needed
db.users.updateMany(
  { userId: { $exists: false } },
  { $set: { userId: null } }
)
```

---

## 📊 Monitoring

### Check Registration Metrics

```javascript
// In MongoDB shell
use geeta-olympiad

// Total users
db.users.countDocuments()

// Verified by email
db.users.countDocuments({ emailVerified: true })

// Verified by phone
db.users.countDocuments({ phoneVerified: true })

// Recent registrations (last 24 hours)
db.users.countDocuments({
  registeredAt: { 
    $gte: new Date(Date.now() - 24*60*60*1000) 
  }
})

// Group by verification method
db.users.aggregate([
  { $group: { 
    _id: "$verifiedWith", 
    count: { $sum: 1 } 
  }}
])
```

### Check Backend Logs

```bash
# Backend logs
cd backend
npm run dev 2>&1 | tee logs.txt

# Watch for errors
tail -f logs.txt | grep -i error
```

### Check Frontend Console

```javascript
// In browser console
// Check for errors
console.log('Auth State:', localStorage.getItem('supabase.auth.token'))

// Check API calls
// Open Network tab in DevTools
// Filter by "users" or "register"
```

---

## 🔄 Rollback Procedure

If something goes wrong:

### 1. Stop Services
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)
```

### 2. Restore Database
```bash
# Restore from backup
mongorestore --uri="mongodb+srv://..." backup/20251121/

# Verify restoration
mongosh "$MONGODB_URI"
db.users.countDocuments()
```

### 3. Revert Code
```bash
# Checkout previous version
git log --oneline
git checkout <previous-commit-hash>

# Or reset to previous commit
git reset --hard HEAD~1
```

### 4. Restart Services
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
npm install
npm run dev
```

---

## 🎯 Post-Deployment Tasks

- [ ] Monitor error logs for 24 hours
- [ ] Check user registration rate
- [ ] Verify OTP delivery success rate
- [ ] Collect user feedback
- [ ] Update documentation if needed
- [ ] Clean up old collections (optional)
- [ ] Create database indexes
- [ ] Set up monitoring alerts
- [ ] Update team about changes

---

## 📧 Cleanup (After 7 Days)

Once you've verified everything works:

```javascript
// In MongoDB shell
use geeta-olympiad

// Backup old collections first
mongodump --collection=email_users
mongodump --collection=phone_users

// Then delete
db.email_users.drop()
db.phone_users.drop()

// Verify
db.getCollectionNames()
```

---

## 🆘 Support

If you encounter issues:

1. **Check Logs:** Backend console and browser console
2. **Check MongoDB:** Verify data structure
3. **Check Supabase:** Dashboard → Authentication → Logs
4. **Review Documentation:** `NEW_AUTH_SYSTEM.md`
5. **Rollback if Critical:** Follow rollback procedure

---

## ✅ Success Criteria

Deployment is successful when:

- ✅ Backend starts without errors
- ✅ Frontend loads correctly
- ✅ Registration form shows both fields
- ✅ OTP sent to both email and phone
- ✅ User can login with either OTP
- ✅ User data saved correctly in MongoDB
- ✅ No console errors
- ✅ Migration completed successfully
- ✅ All existing users still accessible

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Rollback Tested:** ☐ Yes ☐ No  
**Monitoring Active:** ☐ Yes ☐ No  

---

*Good luck with your deployment! 🚀*
