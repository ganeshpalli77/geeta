# Multiple Profiles Feature Guide

## Overview

Users (both email and phone-based) can create **multiple profiles** under a single account. This is useful for:
- Family members sharing one account
- Students taking multiple exams
- Different exam categories or levels

---

## How It Works

### 1. User Registration
Users first register with either email or phone.

### 2. Creating Profiles
Once registered, users can create multiple profiles.

### 3. Active Profile Management
Only **one profile can be active** at a time.

---

## Profile Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to email_user or phone_user
  name: String,               // Full name
  prn: String,                // Personal Registration Number (unique)
  dob: String,                // Date of birth
  preferredLanguage: String,  // Language preference
  category: String,           // Optional category
  isActive: Boolean,          // Only one profile per user can be active
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Profile Management

- `POST /api/profiles` - Create profile
- `GET /api/profiles/:profileId` - Get profile by ID
- `GET /api/profiles/user/:userId` - Get all profiles for user
- `PUT /api/profiles/:profileId` - Update profile
- `DELETE /api/profiles/:profileId` - Delete profile
- `PUT /api/profiles/:profileId/set-active` - Set active profile
- `GET /api/profiles/user/:userId/active` - Get active profile
- `GET /api/profiles/user/:userId/count` - Count profiles

---

## Frontend Usage Examples

### Email User with Multiple Profiles

```typescript
// 1. Register with email
const { user } = await backendAPI.registerEmailUser('parent@example.com');

// 2. Create profiles for family members
const child1 = await backendAPI.createProfile({
  userId: user._id,
  name: 'Child One',
  prn: 'PRN12345',
  dob: '2010-05-15',
  preferredLanguage: 'en',
  category: 'General'
});

const child2 = await backendAPI.createProfile({
  userId: user._id,
  name: 'Child Two',
  prn: 'PRN12346',
  dob: '2012-08-20',
  preferredLanguage: 'hi'
});

// 3. Get all profiles
const profiles = await backendAPI.getProfilesByUser(user._id);

// 4. Switch active profile
await backendAPI.setActiveProfile(user._id, child2._id);

// 5. Get current active profile
const active = await backendAPI.getActiveProfile(user._id);
```

### Phone User with Multiple Profiles

```typescript
// 1. Register with phone
const { user } = await backendAPI.registerPhoneUser('+919876543210');

// 2. Create multiple profiles
const profile1 = await backendAPI.createProfile({
  userId: user._id,
  name: 'Student 1',
  prn: 'PRN1001',
  dob: '2008-01-01',
  preferredLanguage: 'en'
});

// 3. Count profiles
const count = await backendAPI.countProfiles(user._id);
```

---

## Key Features

- **Automatic Active Profile**: First profile is automatically active
- **Unique PRN**: Each profile has unique Personal Registration Number
- **Profile Switching**: Easy switching between profiles
- **Works with Both**: Email and phone users supported
- **Complete CRUD**: Full create, read, update, delete operations
