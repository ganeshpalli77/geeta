# Database Structure - Geeta Olympiad

## Database: `geeta-olympiad`

This application uses MongoDB with separate collections for different types of users and data.

---

## Collections Overview

### 1. **email_users** - Email-based User Registration
Stores users who register/login using email addresses.

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  registeredAt: Date,
  updatedAt: Date,
  lastLogin: Date | null
}
```

**Endpoints:**
- `POST /api/email-users/register` - Register or login with email
- `GET /api/email-users/:userId` - Get user by ID
- `GET /api/email-users/email/:email` - Get user by email
- `GET /api/email-users?limit=100&skip=0` - Get all email users (paginated)
- `PUT /api/email-users/:userId` - Update email user

**Features:**
- Automatic user creation if email doesn't exist
- Tracks last login timestamp
- Email validation
- Pagination support

---

### 2. **phone_users** - Phone-based User Registration
Stores users who register/login using phone numbers.

**Schema:**
```javascript
{
  _id: ObjectId,
  phone: String (unique),
  registeredAt: Date,
  updatedAt: Date,
  lastLogin: Date | null
}
```

**Endpoints:**
- `POST /api/phone-users/register` - Register or login with phone
- `GET /api/phone-users/:userId` - Get user by ID
- `GET /api/phone-users/phone/:phone` - Get user by phone
- `GET /api/phone-users?limit=100&skip=0` - Get all phone users (paginated)
- `PUT /api/phone-users/:userId` - Update phone user

**Features:**
- Automatic user creation if phone doesn't exist
- Tracks last login timestamp
- Phone number validation
- Pagination support

---

### 3. **users** (Legacy) - Combined User Collection
Original collection that stores users with either email or phone.

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String | null,
  phone: String | null,
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** This collection is maintained for backward compatibility.

---

### 4. **profiles** - User Profile Information (MULTIPLE PROFILES SUPPORTED)
Stores detailed profile information for users. **Each user can have multiple profiles** (e.g., family members, different exam attempts).

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to user),
  name: String,
  prn: String (Personal Registration Number - unique),
  dob: String (Date of Birth),
  preferredLanguage: String,
  category: String (optional),
  isActive: Boolean (only one profile per user can be active),
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- **Multiple profiles per user** - Create unlimited profiles under one account
- **Active profile management** - Only one profile active at a time
- **First profile auto-active** - First created profile is automatically set as active
- **Unique PRN** - Each profile has a unique Personal Registration Number

**Endpoints:**
- `POST /api/profiles` - Create profile
- `GET /api/profiles/:profileId` - Get profile by ID
- `GET /api/profiles/user/:userId` - Get all profiles for a user
- `PUT /api/profiles/:profileId` - Update profile
- `DELETE /api/profiles/:profileId` - Delete profile
- `PUT /api/profiles/:profileId/set-active` - Set active profile
- `GET /api/profiles/user/:userId/active` - Get active profile
- `GET /api/profiles/user/:userId/count` - Count profiles for user

---

### 5. **logins** - Login Activity Tracking
Audit log for all login attempts and activities.

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId | null,
  email: String | null,
  phone: String | null,
  loginMethod: String ('email' | 'phone'),
  ipAddress: String | null,
  userAgent: String | null,
  loginAt: Date,
  success: Boolean (default: true)
}
```

**Endpoints:**
- `POST /api/logins` - Create login record
- `GET /api/logins/user/:userId` - Get logins by user
- `GET /api/logins/recent?limit=100` - Get recent logins

---

## Key Differences: New vs Old Structure

### Old Structure (users collection)
- Single collection for all users
- Mixed email and phone in same document
- Less organized for analytics

### New Structure (email_users & phone_users)
- **Separate collections** for email and phone users
- **Better organization** for user management
- **Easier analytics** - can quickly count email vs phone users
- **Cleaner queries** - no need to check which field exists
- **Better indexing** - each collection optimized for its identifier
- **Tracks last login** automatically

---

## Usage Examples

### Register with Email
```javascript
// Frontend
const result = await backendAPI.registerEmailUser('user@example.com');
console.log(result.message); // "New user registered" or "User logged in"
console.log(result.user._id);
```

### Register with Phone
```javascript
// Frontend
const result = await backendAPI.registerPhoneUser('+1234567890');
console.log(result.message); // "New user registered" or "User logged in"
console.log(result.user._id);
```

### Get All Email Users
```javascript
// Frontend
const { users, pagination } = await backendAPI.getAllEmailUsers(50, 0);
console.log(`Total: ${pagination.total}`);
console.log(`Has more: ${pagination.hasMore}`);
```

---

## Migration Notes

If you want to migrate existing users from the `users` collection to the new structure:

1. Users with email → migrate to `email_users`
2. Users with phone → migrate to `phone_users`
3. Update profile references if needed
4. Keep old `users` collection for backward compatibility

---

## Indexes (Recommended)

For optimal performance, create these indexes:

```javascript
// Email users
db.email_users.createIndex({ email: 1 }, { unique: true });
db.email_users.createIndex({ registeredAt: -1 });

// Phone users
db.phone_users.createIndex({ phone: 1 }, { unique: true });
db.phone_users.createIndex({ registeredAt: -1 });

// Profiles
db.profiles.createIndex({ userId: 1 });
db.profiles.createIndex({ prn: 1 }, { unique: true });

// Logins
db.logins.createIndex({ userId: 1 });
db.logins.createIndex({ loginAt: -1 });
```
