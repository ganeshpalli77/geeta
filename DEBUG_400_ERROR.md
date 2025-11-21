# Debugging 400 Bad Request Error

## Error Message
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Error creating profile: Error: API call failed: Bad Request
```

## Possible Causes

### 1. **Duplicate PRN** (Most Likely)
You're trying to create a profile with a PRN that already exists for this user.

**Check:**
- Look at your existing profiles
- Are you using the same PRN (e.g., "1234") multiple times?

**Solution:**
- Use a unique PRN for each profile
- The error message will now show: "A profile with this PRN already exists for this user"

### 2. **Missing Required Fields**
One of the required fields is not being sent.

**Required Fields:**
- userId ✅
- name ✅
- prn ✅
- dob ✅
- preferredLanguage ✅

**Check Backend Console:**
The backend will now log which fields are missing:
```
Missing required fields: { userId: true, name: true, prn: false, dob: true, preferredLanguage: true }
```

## How to Debug

### Step 1: Check Backend Console
Look for these logs:
```
Create profile request: { userId: '...', name: '...', prn: '...', dob: '...', preferredLanguage: '...', category: '...' }
Existing profiles for user: 10
Duplicate PRN found: 1234
```

### Step 2: Check Your Profiles
In the profile selection page, look at the PRN values:
```
Profile 1: PRN: 1234
Profile 2: PRN: 1234  ← Duplicate!
Profile 3: PRN: 5678
```

### Step 3: Use Unique PRNs
When creating a new profile, use a PRN that doesn't exist yet:
```
✅ Good: PRN: 12345
✅ Good: PRN: STUDENT001
✅ Good: PRN: ABC123

❌ Bad: PRN: 1234 (if already exists)
```

## Updated Error Messages

### Frontend
Now shows the actual error from backend:
```
Before: "Failed to create profile. Please try again."
After: "A profile with this PRN already exists for this user"
```

### Backend Logs
```
Create profile request: { userId: '0cd2cad8-...', name: 'sai', prn: '1234', ... }
Existing profiles for user: 10
Duplicate PRN found: 1234
```

## Solution

### Option 1: Delete Duplicate Profiles
If you have many duplicate profiles, delete them from MongoDB:

```javascript
// In MongoDB Compass or Shell
db.profiles.find({ userId: '0cd2cad8-893d-42ee-81df-3db16cb83804' })

// Delete duplicates
db.profiles.deleteMany({ 
  userId: '0cd2cad8-893d-42ee-81df-3db16cb83804',
  prn: '1234'
})
```

### Option 2: Use Unique PRNs
When creating new profiles, use different PRNs:
- Profile 1: PRN: STUDENT001
- Profile 2: PRN: STUDENT002
- Profile 3: PRN: STUDENT003

## Testing

1. **Check existing profiles:**
   ```
   GET /api/profiles/user/0cd2cad8-893d-42ee-81df-3db16cb83804
   ```

2. **Try creating with duplicate PRN:**
   ```
   POST /api/profiles
   { userId: '...', name: 'Test', prn: '1234', ... }
   
   Response: 400 Bad Request
   { error: 'A profile with this PRN already exists for this user' }
   ```

3. **Create with unique PRN:**
   ```
   POST /api/profiles
   { userId: '...', name: 'Test', prn: '9999', ... }
   
   Response: 201 Created
   { success: true, profile: { ... } }
   ```

## Files Modified

1. ✅ `backend/routes/profiles.js`
   - Added detailed logging
   - Shows which fields are missing
   - Logs duplicate PRN detection

2. ✅ `geeta/src/components/portal/ProfileCreationForm.tsx`
   - Shows actual error message from backend
   - Removes "API call failed:" prefix

## Next Steps

1. **Check backend console** for the actual error
2. **Look at existing profiles** to see PRN values
3. **Use unique PRN** when creating new profile
4. **Delete duplicates** if needed

The error message will now be much clearer! 🎯
