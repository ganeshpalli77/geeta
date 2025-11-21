# User Credits Migration Guide

## Overview

This guide explains how to migrate existing profiles to the new `user credits` collection system.

---

## What Gets Migrated?

For each existing profile, the migration will:

1. ✅ Create an entry in `user credits` collection
2. ✅ Copy profile name and PRN
3. ✅ Copy all credit data from `profiles` collection
4. ✅ Copy credit breakdown by source (referrals, quizzes, etc.)
5. ✅ Initialize transaction tracking

---

## Migration Methods

### Method 1: Run Migration Script (Recommended)

**Command:**
```bash
cd backend
npm run migrate:credits
```

**What it does:**
- Processes all profiles in the database
- Creates user credits entries for profiles without one
- Updates existing entries with latest data
- Shows detailed progress and summary

**Output Example:**
```
🚀 Starting User Credits Migration...

📋 Found 10 profiles to process

📝 Processing: Janesh (2433)
   Profile ID: 69206b14e59162e2b4b6091d
   User ID: 74610bdd-29e1-41b2-ad5e-70dfeeafc70b
   🆕 Creating new user credits entry...
   ✅ Created new entry with 270 credits

📝 Processing: Ganesh (2343)
   Profile ID: 69206b14e59162e2b4b6091e
   User ID: 74610bdd-29e1-41b2-ad5e-70dfeeafc70b
   🆕 Creating new user credits entry...
   ✅ Created new entry with 225 credits

============================================================
📊 Migration Summary:
============================================================
✅ Created:  8 new entries
🔄 Updated:  2 existing entries
⏭️  Skipped:  0 entries
❌ Errors:   0 errors
📋 Total:    10 profiles processed
============================================================

✅ Total user credits entries in database: 10

🎉 Migration completed successfully!
```

---

### Method 2: API Endpoint

**Endpoint:**
```
POST http://localhost:5000/api/user-credits/migrate-all
```

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/user-credits/migrate-all
```

**Using Postman:**
1. Method: POST
2. URL: `http://localhost:5000/api/user-credits/migrate-all`
3. Click Send

**Response:**
```json
{
  "success": true,
  "message": "Migration completed successfully",
  "summary": {
    "totalProfiles": 10,
    "created": 8,
    "updated": 2,
    "errors": 0
  }
}
```

---

### Method 3: Sync Individual Profile

**Endpoint:**
```
POST http://localhost:5000/api/user-credits/sync/:profileId
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/user-credits/sync/69206b14e59162e2b4b6091d
```

---

## Before Migration

**Existing Data Structure:**

`profiles` collection:
```javascript
{
  _id: ObjectId("69206b14e59162e2b4b6091d"),
  userId: "74610bdd-...",
  name: "Janesh",
  prn: "2433",
  credits: {
    total: 270,
    available: 270,
    spent: 0,
    earned: {
      referrals: 100,
      quizzes: 150,
      slogans: 20
    }
  }
}
```

`user credits` collection: **EMPTY** ❌

---

## After Migration

**New Data Structure:**

`profiles` collection: **UNCHANGED** ✅
```javascript
{
  _id: ObjectId("69206b14e59162e2b4b6091d"),
  userId: "74610bdd-...",
  name: "Janesh",
  prn: "2433",
  credits: {
    total: 270,
    available: 270,
    spent: 0,
    earned: {
      referrals: 100,
      quizzes: 150,
      slogans: 20
    }
  }
}
```

`user credits` collection: **POPULATED** ✅
```javascript
{
  _id: ObjectId("..."),
  userId: "74610bdd-...",
  profileId: ObjectId("69206b14e59162e2b4b6091d"),
  profileName: "Janesh",        // ✅ Added
  profilePRN: "2433",            // ✅ Added
  totalCredits: 270,             // ✅ Copied
  availableCredits: 270,         // ✅ Copied
  spentCredits: 0,               // ✅ Copied
  earnedBy: {                    // ✅ Copied
    referrals: 100,
    quizzes: 150,
    slogans: 20,
    puzzles: 0,
    videos: 0,
    events: 0,
    dailyQuiz: 0,
    mockTest: 0
  },
  transactions: [],              // ✅ Initialized
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## Verification

### Check Migration Status

**Query all user credits:**
```javascript
db.getCollection('user credits').find({})
```

**Count entries:**
```javascript
db.getCollection('user credits').countDocuments()
```

**Compare with profiles:**
```javascript
db.getCollection('profiles').countDocuments()
```

**Find profiles without user credits:**
```javascript
// Get all profile IDs
const profileIds = db.getCollection('profiles').distinct('_id');

// Get all user credit profile IDs
const creditProfileIds = db.getCollection('user credits').distinct('profileId');

// Find missing
profileIds.filter(id => !creditProfileIds.includes(id));
```

---

## Troubleshooting

### Issue: Some profiles not migrated

**Solution:**
```bash
# Re-run migration
npm run migrate:credits
```

The script is idempotent - it won't duplicate entries.

---

### Issue: Credits don't match

**Solution:**
```bash
# Sync specific profile
curl -X POST http://localhost:5000/api/user-credits/sync/PROFILE_ID
```

---

### Issue: Migration script fails

**Check:**
1. MongoDB connection is working
2. Database name is correct
3. Collections exist
4. User has write permissions

**Logs:**
Check console output for specific error messages.

---

## Post-Migration

### Automatic Sync

After migration, all future credit operations automatically sync:

```javascript
// Add credits to profile
await ProfileModel.addCredits(profileId, 100, 'quizzes');

// ✅ Automatically syncs to user credits collection
```

### New Profiles

All new profiles automatically get user credits entry on creation.

---

## Rollback

If needed, you can delete the user credits collection:

```javascript
db.getCollection('user credits').drop()
```

Then re-run migration when ready.

**Note:** This won't affect the `profiles` collection.

---

## Summary

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npm run migrate:credits` | Migrate all existing profiles |
| 2 | Check logs | Verify success |
| 3 | Query database | Confirm entries created |
| 4 | Test app | Ensure everything works |

---

## Support

If you encounter issues:
1. Check backend logs
2. Verify MongoDB connection
3. Re-run migration script
4. Contact support with error logs

---

**Migration is safe and can be run multiple times!** ✅
