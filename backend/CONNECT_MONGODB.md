# Connect MongoDB - Final Steps

## ✅ What's Already Done
- Backend API created with MongoDB integration
- User and Profile models configured
- API routes set up
- Frontend configured to auto-save users to MongoDB
- `.env` file created

## 🔧 What You Need to Do Now

### 1. Get Your MongoDB Connection String

1. Go to https://cloud.mongodb.com
2. Click on your **"geetha"** project
3. Click **"Connect"** on **Cluster0**
4. Choose **"Connect your application"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://pathipatijanesh_db_user:<password>@cluster0.ixnaagr.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Update the `.env` File

Open `backend/.env` and replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://pathipatijanesh_db_user:YOUR_ACTUAL_PASSWORD@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Important:** 
- Replace `YOUR_ACTUAL_PASSWORD` with your database password
- Keep `/geeta-olympiad` at the end (this is your database name)

### 3. Whitelist Your IP Address

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. For development, add **`0.0.0.0/0`** (allows all IPs)
4. Or add your specific IP address

### 4. Install Dependencies & Start Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Connected to MongoDB Atlas
MongoDB connection established
Server is running on port 5000
```

### 5. Test the Connection

Open a new terminal and run:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Geeta Olympiad API is running",
  "timestamp": "2025-11-20T..."
}
```

### 6. Test User Registration

```bash
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
```

Expected response:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

### 7. Verify in MongoDB Atlas

1. Go to MongoDB Atlas
2. Click **"Browse Collections"**
3. Select **`geeta-olympiad`** database
4. Check **`users`** collection
5. You should see your test user!

## 🎉 That's It!

Now when users register in your app:
1. They enter email/phone
2. Verify OTP with Supabase
3. **Automatically saved to MongoDB** ✨

## Troubleshooting

**"MongoServerError: bad auth"**
- Check your password in `.env` is correct
- Make sure there are no extra spaces

**"Connection timeout"**
- Check your IP is whitelisted in Network Access
- Verify internet connection

**"ECONNREFUSED"**
- Backend is not running
- Start it with `npm run dev`

## Your MongoDB Details

- **Project:** geetha (691f131632a37e11db9c8385)
- **Cluster:** Cluster0
- **Database:** geeta-olympiad
- **Collections:** users, profiles
- **Connection:** mongodb+srv://cluster0.ixnaagr.mongodb.net
