# Quick Start - MongoDB Connection

Your MongoDB Atlas database is ready to connect!

## Your Database Details

- **Connection String**: `mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geetaOlympiad?retryWrites=true&w=majority&appName=Cluster0`
- **Database Name**: `geetaOlympiad`
- **Cluster**: `cluster0.ixnaagr.mongodb.net`

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install the `mongodb` package (version 6.3.0) along with all other dependencies.

### 2. Verify Configuration

The connection is already configured in `src/config/database.ts`. No additional setup needed!

### 3. Test Connection

Run the application:

```bash
npm run dev
```

The app will automatically test the MongoDB connection on startup.

### 4. Initialize Database

The database will be automatically initialized with:
- All required collections
- Proper indexes for performance
- Round task definitions (Rounds 1-7)

## What's Configured

### Collections Created:
- ✅ `users` - User accounts
- ✅ `profiles` - User profiles  
- ✅ `roundTasks` - Task tracking (Round 1-7)
- ✅ `quizAttempts` - Quiz records
- ✅ `videoSubmissions` - Video submissions
- ✅ `sloganSubmissions` - Slogan submissions
- ✅ `imageParts` - Puzzle pieces
- ✅ `notifications` - User notifications
- ✅ `achievements` - Unlocked achievements

### Round Tasks Configured:

**Round 1:**
1. Daily Quiz (100 points)
2. Collect Today's Puzzle Piece (50 points)
3. Create a Slogan (75 points)
4. Create a Reel (100 points)

**Rounds 2-7:**
- Each has: Daily Quiz + Puzzle Piece + 1 additional task

## Verify in MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Login with your credentials
3. Click on "Browse Collections"
4. You should see the `geetaOlympiad` database
5. View the collections and data

## Troubleshooting

### If connection fails:

1. **Check IP Whitelist**:
   - Go to MongoDB Atlas → Network Access
   - Ensure your IP is whitelisted (or use 0.0.0.0/0 for development)

2. **Verify Credentials**:
   - Username: `admin`
   - Password: `admin123`
   - These are configured in `src/config/database.ts`

3. **Check Cluster Status**:
   - Ensure your cluster is running in MongoDB Atlas
   - Free tier clusters may pause after inactivity

### View Logs

Check the browser console for connection status:
- ✅ "Connected to MongoDB successfully!"
- ✅ "Indexes created successfully!"

## Using MongoDB Compass (Optional)

Download MongoDB Compass for a GUI interface:

1. Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Connect using: `mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/`
3. Select `geetaOlympiad` database
4. Browse and query your data visually

## Security Note

⚠️ **Important**: The credentials are currently hardcoded for development. For production:

1. Use environment variables
2. Change the password to something more secure
3. Restrict IP access to specific addresses
4. Enable additional security features in MongoDB Atlas

## Next Steps

1. Run `npm install`
2. Run `npm run dev`
3. Check browser console for "✅ Connected to MongoDB successfully!"
4. Start using the application with MongoDB backend!

## Support

If you encounter any issues:
- Check the browser console for error messages
- Verify MongoDB Atlas cluster is running
- Ensure network access is configured
- Check the `MONGODB_SETUP.md` file for detailed troubleshooting
