# Profile Creation Fix - Supabase UUID Support

## Problem
Users were getting 500 Internal Server Error when trying to create profiles. The error occurred because:

1. **Supabase uses UUID strings** for user IDs (e.g., `0cd2cad8-893d-42ee-81df-3db16cb83804`)
2. **MongoDB Profile model was trying to convert** these UUIDs to MongoDB ObjectId
3. **ObjectId conversion failed** because UUIDs are not valid ObjectIds

## Root Cause
```javascript
// OLD CODE (BROKEN)
const profile = {
  userId: new ObjectId(profileData.userId), // ❌ Fails for UUID strings
  // ...
};
```

## Solution
Changed the backend to store `userId` as a **string** instead of converting to ObjectId.

### Files Modified

#### 1. `backend/models/Profile.js`
**Changes:**
- Store `userId` as string (Supabase UUID)
- Remove ObjectId conversion for userId in all methods
- Keep ObjectId only for `_id` and `profileId` fields

```javascript
// NEW CODE (FIXED)
const profile = {
  userId: profileData.userId, // ✅ Store as string
  // ...
};
```

**Methods Updated:**
- `createProfile()` - Store userId as string
- `findProfilesByUserId()` - Query by string userId
- `countProfilesByUserId()` - Count by string userId
- `setActiveProfile()` - Use string userId
- `getActiveProfile()` - Use string userId

#### 2. `backend/models/User.js`
**Changes:**
- Added `userId` field to store Supabase UUID
- Support both MongoDB ObjectId and UUID string lookups
- Fallback mechanism for backward compatibility

```javascript
// Support both ObjectId and UUID
static async findUserById(userId) {
  try {
    // Try ObjectId first
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (user) return user;
  } catch (e) {
    // Not a valid ObjectId
  }
  // Try UUID string
  return await collection.findOne({ userId: userId });
}
```

**Methods Updated:**
- `createUser()` - Store userId field
- `findUserById()` - Support both ObjectId and UUID
- `updateUser()` - Support both ObjectId and UUID
- `findOrCreateUser()` - Check userId first

#### 3. `backend/routes/users.js`
**Changes:**
- Accept `userId` in registration endpoint
- Include `userId` in responses

```javascript
// Accept userId parameter
router.post('/register', async (req, res) => {
  const { userId, email, phone } = req.body;
  // ...
});
```

#### 4. `geeta/src/services/backendAPI.ts`
**Changes:**
- Updated `registerUser` type to include `userId`

```typescript
async registerUser(data: { 
  userId?: string;  // Added
  email?: string; 
  phone?: string; 
}): Promise<BackendUser>
```

#### 5. `geeta/src/contexts/AppContext.tsx`
**Changes:**
- Pass Supabase UUID when registering users

```typescript
await backendAPI.registerUser({
  userId: supabaseUser.id, // Pass Supabase UUID
  email: email || undefined,
  phone: phone || undefined,
});
```

## Database Schema Changes

### Before (Broken)
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // ❌ Can't store UUID here
  name: "John Doe",
  // ...
}
```

### After (Fixed)
```javascript
{
  _id: ObjectId("..."),
  userId: "0cd2cad8-893d-42ee-81df-3db16cb83804", // ✅ UUID as string
  name: "John Doe",
  // ...
}
```

## Testing

### Test Profile Creation
1. Login with email/phone
2. Click "Create Profile" or "Create New Warrior"
3. Fill in profile details:
   - Name
   - PRN/Student ID
   - Date of Birth
   - School/Category (optional)
   - Preferred Language
4. Submit

### Expected Result
- ✅ Profile created successfully
- ✅ No 500 errors
- ✅ Profile appears in profile list
- ✅ Can switch between profiles

### Error Logs (Before Fix)
```
Failed to load resource: 500 (Internal Server Error)
/api/users/0cd2cad8-893d-42ee-81df-3db16cb83804
/api/profiles/user/0cd2cad8-893d-42ee-81df-3db16cb83804
Error creating profile: Error: API call failed: Internal Server Error
```

### Success Logs (After Fix)
```
Profile created successfully
User registered in MongoDB
Email user registered in MongoDB
```

## Backward Compatibility

The fix maintains backward compatibility:

1. **Existing MongoDB ObjectId users** - Still work via fallback mechanism
2. **New Supabase UUID users** - Work with string userId
3. **Profile IDs** - Still use MongoDB ObjectId
4. **Mixed environment** - Both types can coexist

## Migration Notes

### For Existing Data
No migration needed! The system supports both:
- Old users with MongoDB ObjectId
- New users with Supabase UUID strings

### For New Deployments
1. Restart backend server to load new code
2. Test profile creation with Supabase auth
3. Verify profiles are created successfully

## Summary

**Problem:** UUID strings couldn't be converted to MongoDB ObjectId  
**Solution:** Store userId as string instead of ObjectId  
**Result:** Profile creation now works with Supabase authentication  
**Impact:** All profile-related features now functional  

## Files Changed
- ✅ `backend/models/Profile.js` - Store userId as string
- ✅ `backend/models/User.js` - Support UUID strings
- ✅ `backend/routes/users.js` - Accept userId parameter
- ✅ `geeta/src/services/backendAPI.ts` - Update type definition
- ✅ `geeta/src/contexts/AppContext.tsx` - Pass Supabase UUID

## Status
🎉 **FIXED** - Profile creation now works with Supabase authentication!
