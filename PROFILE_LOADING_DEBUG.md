# Profile Loading Debug Guide

## Issue Description
Profiles are not loading correctly on the profile selection page. The page shows "No Profiles Yet" even when profiles exist in the database for the user.

## Debugging Steps Added

### Frontend Logging (ProfileSelectionPage.tsx)
Added comprehensive console logging to track:
1. User state when component mounts
2. User ID being used for profile fetching
3. API response from backend
4. Number of profiles returned
5. Profile array contents

**Check Console For:**
```
ProfileSelectionPage - User state: {id, email, phone, profiles}
ProfileSelectionPage - User ID: <uuid>
Loading profiles for user: <uuid>
Fetching profiles for user ID: <uuid>
Profiles fetched from backend: <array>
Profiles array: <array>
Number of profiles: <number>
```

### Backend Logging (profiles.js)
Added logging to track profile queries:
```
📋 Fetching profiles for userId: <uuid>
📋 Found profiles: <count>
📋 Profile details: [{id, name, userId}, ...]
📋 Returning serialized profiles: <count>
```

### AppContext Logging
Added logging to track auth flow:
```
🔍 Fetching profiles for Supabase user ID: <uuid>
🔍 Profiles fetched: <count>
🔍 Converted user object: {id, email, phone, profileCount}
```

## Common Issues to Check

### 1. User ID Mismatch
**Problem:** The userId stored in profiles doesn't match the Supabase user ID.

**Check:**
- Open browser console
- Look for the user ID in logs
- Compare with MongoDB profiles collection userId field
- Ensure they match exactly (case-sensitive)

**Fix:** If mismatch found, update profiles in MongoDB:
```javascript
db.profiles.updateMany(
  { userId: "old-id" },
  { $set: { userId: "correct-supabase-id" } }
)
```

### 2. Placeholder Email Display
**Problem:** User sees "user-046893b4...@placeholder.com" instead of real email.

**Solution:** Already fixed - now shows:
- Real email if available and not placeholder
- Phone number if available
- Shortened user ID as fallback

### 3. Profiles Not Fetched
**Problem:** API call fails or returns empty array.

**Check:**
- Network tab in browser DevTools
- Look for `/api/profiles/user/<userId>` request
- Check response status and body
- Verify backend is running on port 5000

### 4. Cache Issues
**Problem:** Old profile data cached.

**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check profile cache duration (30 seconds)

## Testing Checklist

1. **Check Browser Console**
   - [ ] User object has valid ID
   - [ ] Profile fetch API call succeeds
   - [ ] Profiles array is populated
   - [ ] No JavaScript errors

2. **Check Backend Logs**
   - [ ] Profile query receives correct userId
   - [ ] MongoDB query returns profiles
   - [ ] Profiles are serialized correctly

3. **Check Database**
   ```javascript
   // In MongoDB shell
   db.profiles.find({ userId: "<supabase-user-id>" })
   ```
   - [ ] Profiles exist for the user
   - [ ] userId field matches Supabase user ID

4. **Check Network**
   - [ ] API request sent to correct endpoint
   - [ ] Response status is 200
   - [ ] Response contains profiles array

## Quick Fixes

### If Profiles Exist But Don't Show:

1. **Clear Profile Cache:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

2. **Force Profile Refresh:**
   - Navigate away from profile selection
   - Navigate back
   - Should trigger fresh fetch

3. **Check User Session:**
   - Log out completely
   - Log back in
   - Should re-fetch everything

### If User ID is Wrong:

1. **Get Correct Supabase User ID:**
   - Check browser console for Supabase user object
   - Copy the `id` field

2. **Update MongoDB Profiles:**
   ```javascript
   db.profiles.updateMany(
     { userId: "wrong-id" },
     { $set: { userId: "correct-supabase-id" } }
   )
   ```

3. **Verify Update:**
   ```javascript
   db.profiles.find({ userId: "correct-supabase-id" })
   ```

## Expected Console Output

### Successful Profile Load:
```
ProfileSelectionPage - User state: {id: "046893b4-dc7c-4a9d-91d5-238ddf30995d", ...}
ProfileSelectionPage - User ID: 046893b4-dc7c-4a9d-91d5-238ddf30995d
Loading profiles for user: 046893b4-dc7c-4a9d-91d5-238ddf30995d
Fetching profiles for user ID: 046893b4-dc7c-4a9d-91d5-238ddf30995d
📋 Fetching profiles for userId: 046893b4-dc7c-4a9d-91d5-238ddf30995d
📋 Found profiles: 2
📋 Profile details: [{id: "...", name: "John Doe", userId: "046893b4..."}]
Profiles fetched from backend: [{_id: "...", name: "John Doe", ...}]
Number of profiles: 2
```

### Failed Profile Load:
```
ProfileSelectionPage - User ID: 046893b4-dc7c-4a9d-91d5-238ddf30995d
Fetching profiles for user ID: 046893b4-dc7c-4a9d-91d5-238ddf30995d
📋 Fetching profiles for userId: 046893b4-dc7c-4a9d-91d5-238ddf30995d
📋 Found profiles: 0
Number of profiles: 0
```

## Next Steps

1. **Run the application** and check browser console
2. **Check backend terminal** for profile fetch logs
3. **Compare user IDs** between frontend and database
4. **Verify profiles exist** in MongoDB for that user
5. **Report findings** with console logs and network requests

## Files Modified

- `src/components/portal/ProfileSelectionPage.tsx` - Added frontend logging
- `backend/routes/profiles.js` - Added backend logging
- `src/contexts/AppContext.tsx` - Added auth flow logging

All logging can be removed once issue is resolved by searching for emoji prefixes:
- 🔍 (magnifying glass) - AppContext logs
- 📋 (clipboard) - Backend profile logs
