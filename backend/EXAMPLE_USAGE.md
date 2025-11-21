# Example Usage - Multiple Profiles System

## Scenario: Family Account with Multiple Children

### Step 1: Parent Registers with Email

```javascript
// Parent registers
const { user, message } = await backendAPI.registerEmailUser('parent@example.com');

console.log(user);
// Output:
// {
//   _id: '507f1f77bcf86cd799439011',
//   email: 'parent@example.com',
//   registeredAt: '2025-11-20T18:50:00.000Z',
//   lastLogin: '2025-11-20T18:50:00.000Z'
// }
```

### Step 2: Create Profile for First Child

```javascript
const child1Profile = await backendAPI.createProfile({
  userId: user._id,
  name: 'Rahul Kumar',
  prn: 'GBG2024001',
  dob: '2010-05-15',
  preferredLanguage: 'en',
  category: 'General'
});

console.log(child1Profile);
// Output:
// {
//   _id: '507f1f77bcf86cd799439012',
//   userId: '507f1f77bcf86cd799439011',
//   name: 'Rahul Kumar',
//   prn: 'GBG2024001',
//   dob: '2010-05-15',
//   preferredLanguage: 'en',
//   category: 'General',
//   isActive: true,  // ← Automatically active (first profile)
//   createdAt: '2025-11-20T18:51:00.000Z',
//   updatedAt: '2025-11-20T18:51:00.000Z'
// }
```

### Step 3: Create Profile for Second Child

```javascript
const child2Profile = await backendAPI.createProfile({
  userId: user._id,
  name: 'Priya Kumar',
  prn: 'GBG2024002',
  dob: '2012-08-20',
  preferredLanguage: 'hi',
  category: 'OBC'
});

console.log(child2Profile);
// Output:
// {
//   _id: '507f1f77bcf86cd799439013',
//   userId: '507f1f77bcf86cd799439011',
//   name: 'Priya Kumar',
//   prn: 'GBG2024002',
//   dob: '2012-08-20',
//   preferredLanguage: 'hi',
//   category: 'OBC',
//   isActive: false,  // ← Not active (second profile)
//   createdAt: '2025-11-20T18:52:00.000Z',
//   updatedAt: '2025-11-20T18:52:00.000Z'
// }
```

### Step 4: Create Profile for Third Child

```javascript
const child3Profile = await backendAPI.createProfile({
  userId: user._id,
  name: 'Amit Kumar',
  prn: 'GBG2024003',
  dob: '2014-03-10',
  preferredLanguage: 'en',
  category: 'General'
});
```

### Step 5: View All Profiles

```javascript
const allProfiles = await backendAPI.getProfilesByUser(user._id);

console.log(allProfiles);
// Output:
// [
//   {
//     _id: '507f1f77bcf86cd799439012',
//     name: 'Rahul Kumar',
//     prn: 'GBG2024001',
//     isActive: true,  // ← Currently active
//     ...
//   },
//   {
//     _id: '507f1f77bcf86cd799439013',
//     name: 'Priya Kumar',
//     prn: 'GBG2024002',
//     isActive: false,
//     ...
//   },
//   {
//     _id: '507f1f77bcf86cd799439014',
//     name: 'Amit Kumar',
//     prn: 'GBG2024003',
//     isActive: false,
//     ...
//   }
// ]
```

### Step 6: Switch to Second Child's Profile

```javascript
// Switch active profile to Priya
await backendAPI.setActiveProfile(user._id, child2Profile._id);

// Verify active profile
const activeProfile = await backendAPI.getActiveProfile(user._id);

console.log(activeProfile);
// Output:
// {
//   _id: '507f1f77bcf86cd799439013',
//   name: 'Priya Kumar',
//   prn: 'GBG2024002',
//   isActive: true,  // ← Now active
//   preferredLanguage: 'hi',
//   ...
// }
```

### Step 7: Count Total Profiles

```javascript
const profileCount = await backendAPI.countProfiles(user._id);

console.log(`Total profiles: ${profileCount}`);
// Output: Total profiles: 3
```

### Step 8: Update a Profile

```javascript
// Update Rahul's language preference
await backendAPI.updateProfile(child1Profile._id, {
  preferredLanguage: 'hi'
});
```

### Step 9: Delete a Profile

```javascript
// Delete Amit's profile
await backendAPI.deleteProfile(child3Profile._id);

// Verify count
const newCount = await backendAPI.countProfiles(user._id);
console.log(`Remaining profiles: ${newCount}`);
// Output: Remaining profiles: 2
```

---

## Scenario: Phone User with Multiple Exam Attempts

### Step 1: Student Registers with Phone

```javascript
const { user } = await backendAPI.registerPhoneUser('+919876543210');

console.log(user);
// Output:
// {
//   _id: '507f1f77bcf86cd799439020',
//   phone: '+919876543210',
//   registeredAt: '2025-11-20T19:00:00.000Z',
//   lastLogin: '2025-11-20T19:00:00.000Z'
// }
```

### Step 2: Create Profile for First Exam

```javascript
const exam1Profile = await backendAPI.createProfile({
  userId: user._id,
  name: 'Suresh Patel',
  prn: 'GBG2024101',
  dob: '2009-12-05',
  preferredLanguage: 'gu',
  category: 'General'
});
```

### Step 3: Create Profile for Second Exam (Different Category)

```javascript
const exam2Profile = await backendAPI.createProfile({
  userId: user._id,
  name: 'Suresh Patel',
  prn: 'GBG2024102',
  dob: '2009-12-05',
  preferredLanguage: 'gu',
  category: 'PWD'  // Different category for same person
});
```

### Step 4: Switch Between Exam Profiles

```javascript
// For first exam
await backendAPI.setActiveProfile(user._id, exam1Profile._id);

// Later, for second exam
await backendAPI.setActiveProfile(user._id, exam2Profile._id);
```

---

## Complete React Component Example

```tsx
import React, { useState, useEffect } from 'react';
import { backendAPI } from '../services/backendAPI';

function ProfileManager({ userId }) {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, [userId]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await backendAPI.getProfilesByUser(userId);
      setProfiles(data);
      
      const active = data.find(p => p.isActive);
      setActiveProfile(active);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchProfile = async (profileId) => {
    try {
      await backendAPI.setActiveProfile(userId, profileId);
      await loadProfiles();
    } catch (error) {
      console.error('Error switching profile:', error);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await backendAPI.deleteProfile(profileId);
        await loadProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  if (loading) return <div>Loading profiles...</div>;

  return (
    <div className="profile-manager">
      <h2>Manage Profiles ({profiles.length})</h2>
      
      <div className="profile-list">
        {profiles.map(profile => (
          <div 
            key={profile._id}
            className={`profile-card ${profile.isActive ? 'active' : ''}`}
          >
            <h3>{profile.name}</h3>
            <p>PRN: {profile.prn}</p>
            <p>DOB: {profile.dob}</p>
            <p>Language: {profile.preferredLanguage}</p>
            <p>Category: {profile.category || 'N/A'}</p>
            
            {profile.isActive ? (
              <span className="badge">✓ Active</span>
            ) : (
              <button onClick={() => handleSwitchProfile(profile._id)}>
                Switch to this profile
              </button>
            )}
            
            <button 
              onClick={() => handleDeleteProfile(profile._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      <button className="add-profile-btn">
        + Add New Profile
      </button>
    </div>
  );
}

export default ProfileManager;
```

---

## API Response Examples

### Successful Profile Creation
```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Rahul Kumar",
    "prn": "GBG2024001",
    "dob": "2010-05-15",
    "preferredLanguage": "en",
    "category": "General",
    "isActive": true,
    "createdAt": "2025-11-20T18:51:00.000Z"
  }
}
```

### Get All Profiles Response
```json
{
  "success": true,
  "profiles": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Rahul Kumar",
      "isActive": true,
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Priya Kumar",
      "isActive": false,
      ...
    }
  ]
}
```

### Profile Count Response
```json
{
  "success": true,
  "count": 3
}
```
