# Fix MongoDB Authentication Error

## The Problem
You're getting: `MongoServerError: bad auth : Authentication failed.`

This means the username/password in your `.env` file doesn't match what's in MongoDB Atlas.

## Quick Fix - Use the Correct Connection String

### Option 1: Use Your New Database User

Based on the screenshot you shared, your new user is:
- **Username:** `geethadatabase01`
- **Password:** `Geethadatabase`

**Update your `.env` file to:**
```env
MONGODB_URI=mongodb+srv://geethadatabase01:Geethadatabase@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

### Option 2: Use Your Existing Working User

You already have a working user: `pathipatijanesh_db_user`

**Update your `.env` file to:**
```env
MONGODB_URI=mongodb+srv://pathipatijanesh_db_user:YOUR_PASSWORD@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

Replace `YOUR_PASSWORD` with the actual password for this user.

## Step-by-Step Fix

### 1. Verify Database User Exists

1. Go to https://cloud.mongodb.com
2. Click on your **"geetha"** project
3. Click **"Database Access"** in the left sidebar
4. You should see your database users listed

### 2. Get the Correct Password

If you forgot the password:
1. Click "Edit" on the user
2. Click "Edit Password"
3. Set a new simple password (e.g., `Getha2024`)
4. Click "Update User"

### 3. Update .env File

Open `backend/.env` and paste the correct connection string.

**Important:** 
- Make sure there are NO spaces before or after the `=` sign
- Make sure the password is correct
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `!` → `%21`
  - `$` → `%24`

### 4. Save and Test

1. Save the `.env` file
2. Nodemon will automatically restart
3. You should see:
   ```
   ✓ Connected to MongoDB Atlas
   ✓ MongoDB connection established
   ✓ Server is running on port 5000
   ```

## What's Been Added

### ✅ New Collections Created:
1. **users** - Stores user email/phone
2. **profiles** - Stores user profile data
3. **logins** - Tracks all login attempts (NEW!)

### ✅ Login Tracking Features:
- Every successful login is recorded
- Tracks email/phone, timestamp, IP address
- Can view login history per user
- Admin can see all recent logins

### ✅ API Endpoints Added:
```
POST   /api/logins              - Create login record
GET    /api/logins/user/:userId - Get user's login history
GET    /api/logins/recent       - Get recent logins (admin)
GET    /api/logins/failed       - Get failed logins (admin)
```

## Test After Fixing

Once the server starts successfully:

### 1. Test Health Check
```bash
curl http://localhost:5000/health
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
```

### 3. Test Login Tracking
```bash
curl -X POST http://localhost:5000/api/logins -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"loginMethod\":\"email\",\"success\":true}"
```

### 4. View in MongoDB Atlas
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select `geeta-olympiad` database
4. You should see three collections:
   - `users`
   - `profiles`
   - `logins`

## Still Having Issues?

### Check Network Access
1. MongoDB Atlas → Network Access
2. Make sure `0.0.0.0/0` is in the IP Access List
3. Or add your specific IP address

### Check Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@cluster0.ixnaagr.mongodb.net/DATABASE?options
```

- `USERNAME` = your database username
- `PASSWORD` = your database password (URL encoded if needed)
- `cluster0.ixnaagr.mongodb.net` = your cluster address
- `DATABASE` = `geeta-olympiad`

### Common Mistakes
❌ Extra spaces in .env file
❌ Wrong password
❌ Special characters not URL encoded
❌ IP not whitelisted
❌ User doesn't have correct permissions

## Need a Fresh Start?

Create a brand new database user:
1. MongoDB Atlas → Database Access
2. Add New Database User
3. Username: `geethauser`
4. Password: `Getha2024` (simple, no special chars)
5. Privileges: **Atlas Admin**
6. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0
   ```

That should work! 🚀
