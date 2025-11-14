# Backend Architecture Documentation

## Overview

The Geeta Olympiad portal uses a **mock MongoDB backend** implemented entirely in the browser using localStorage. This architecture is designed to be easily replaceable with a real Node.js + MongoDB backend.

## Architecture Layers

### 1. **API Proxy Layer** (`/utils/apiProxy.ts`)

**Single source of truth for all backend communication.**

- All API calls go through this file
- Toggle between mock (localStorage) and real API with one flag: `USE_MOCK_API`
- Organized into logical API modules:
  - `authAPI` - Authentication and OTP verification
  - `userAPI` - User management
  - `profileAPI` - Profile CRUD operations
  - `quizAPI` - Quiz submission and retrieval
  - `eventAPI` - Video/Slogan submissions and admin review
  - `imagePuzzleAPI` - Daily puzzle piece collection
  - `leaderboardAPI` - Leaderboard calculations

### 2. **Mock Database Layer** (`/utils/mockDb.ts`)

**MongoDB-like operations using localStorage.**

Implements standard MongoDB operations:
- `find(collection, filter)` - Query documents
- `findOne(collection, filter)` - Find single document
- `findById(collection, id)` - Find by _id
- `insertOne(collection, doc)` - Insert single document
- `insertMany(collection, docs)` - Insert multiple documents
- `updateOne(collection, filter, update)` - Update single document
- `updateById(collection, id, update)` - Update by _id
- `updateMany(collection, filter, update)` - Update multiple documents
- `deleteOne(collection, filter)` - Delete single document
- `deleteById(collection, id)` - Delete by _id
- `deleteMany(collection, filter)` - Delete multiple documents
- `count(collection, filter)` - Count documents

Supports MongoDB operators:
- `$set` - Set field values
- `$push` - Add to array
- `$pull` - Remove from array
- `$inc` - Increment numeric field
- `$gt`, `$lt`, `$gte`, `$lte`, `$ne`, `$in` - Comparison operators

### 3. **Data Initialization** (`/utils/initMockData.ts`)

**Populates the database with sample data on first load.**

Creates:
- 4 sample users (email and phone-based)
- 6 sample profiles across all categories (kids, youth, senior)
- 7 quiz attempts with various scores
- 4 video submissions (some approved, some pending)
- 4 slogan submissions (some approved, some pending)
- Multiple collected puzzle pieces for different profiles

## Database Collections

### `users`
```typescript
{
  _id: string;
  email?: string;
  phone?: string;
  profiles: string[]; // Array of profile _ids
  createdAt: string;
  updatedAt: string;
}
```

### `profiles`
```typescript
{
  _id: string;
  userId: string;
  name: string;
  prn: string; // Participant Registration Number
  dob: string; // Date of birth
  preferredLanguage: 'en' | 'hi';
  category: 'kids' | 'youth' | 'senior'; // Auto-calculated from age
  createdAt: string;
  updatedAt: string;
}
```

### `quizAttempts`
```typescript
{
  _id: string;
  profileId: string;
  type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3';
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: string;
}
```

### `videoSubmissions`
```typescript
{
  _id: string;
  profileId: string;
  url: string;
  platform: string; // YouTube, Instagram, etc.
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string; // Admin user ID
}
```

### `sloganSubmissions`
```typescript
{
  _id: string;
  profileId: string;
  slogan: string;
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
```

### `imageParts`
```typescript
{
  _id: string;
  profileId: string;
  partNumber: number; // 1-45
  collectedAt: string;
}
```

## Switching to Real Backend

To switch from mock to real backend:

### 1. **Update API Proxy Configuration**

In `/utils/apiProxy.ts`:

```typescript
const USE_MOCK_API = false; // Change to false
const API_BASE_URL = 'https://your-backend.com/api'; // Your backend URL
```

### 2. **Backend API Endpoints Required**

```
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/admin-login

GET    /api/users/:userId
PUT    /api/users/:userId

POST   /api/profiles
GET    /api/profiles/user/:userId
GET    /api/profiles/:profileId
PUT    /api/profiles/:profileId
DELETE /api/profiles/:profileId

POST   /api/quiz/submit
GET    /api/quiz/attempts/profile/:profileId
GET    /api/quiz/attempts

POST   /api/events/video
GET    /api/events/videos/profile/:profileId
GET    /api/events/videos
PUT    /api/events/videos/:id/review

POST   /api/events/slogan
GET    /api/events/slogans/profile/:profileId
GET    /api/events/slogans
PUT    /api/events/slogans/:id/review

POST   /api/puzzle/collect
GET    /api/puzzle/parts/:profileId

GET    /api/leaderboard/overall
GET    /api/leaderboard/weekly
GET    /api/leaderboard/rank/:profileId
```

### 3. **Sample Backend Implementation (Node.js + Express + MongoDB)**

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/geetaOlympiad');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const quizRoutes = require('./routes/quiz');
const eventRoutes = require('./routes/events');
const puzzleRoutes = require('./routes/puzzle');
const leaderboardRoutes = require('./routes/leaderboard');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/puzzle', puzzleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(5180, () => {
  console.log('Server running on port 5000');
});
```

### 4. **MongoDB Schema Examples**

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  phone: String,
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// models/Profile.js
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  prn: String,
  dob: Date,
  preferredLanguage: String,
  category: { type: String, enum: ['kids', 'youth', 'senior'] },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
```

## Testing the Mock Database

### Test Data Login Credentials

**Demo Users (OTP: 1234)**
- Email: `demo@example.com`
- Email: `john@example.com`
- Email: `priya@example.com`
- Phone: `+919876543210`

**Admin Login**
- Username: `admin`
- Password: `admin123`

### Reset Mock Data

To reset the database to initial state:

```javascript
import { resetMockData } from './utils/initMockData';
resetMockData();
```

### View Database Contents

Open browser console and run:

```javascript
// View all users
localStorage.getItem('geetaOlympiadDB_users');

// View all profiles
localStorage.getItem('geetaOlympiadDB_profiles');

// View all quiz attempts
localStorage.getItem('geetaOlympiadDB_quizAttempts');
```

## Security Considerations

### Current Mock Implementation
- ⚠️ **NOT SECURE** - All data stored in browser localStorage
- ⚠️ **NO ENCRYPTION** - Data is plain text
- ⚠️ **NO AUTHENTICATION** - OTP always accepts "1234"
- ⚠️ **CLIENT-SIDE ONLY** - No server validation

### Real Backend Requirements
- ✅ Implement proper OTP service (Twilio, AWS SNS, etc.)
- ✅ Add JWT or session-based authentication
- ✅ Validate all inputs on server-side
- ✅ Use HTTPS for all communications
- ✅ Implement rate limiting
- ✅ Add CORS restrictions
- ✅ Hash/encrypt sensitive data
- ✅ Add logging and monitoring

## Performance Considerations

### Mock Database
- Fast for < 1000 records per collection
- All operations are synchronous
- No indexing (O(n) queries)

### Production Database
- Add indexes on frequently queried fields
- Use aggregation pipelines for leaderboard
- Cache leaderboard results
- Paginate large result sets
- Use connection pooling

## API Response Format

All API responses follow this format:

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development Tips

1. **Use mock API for development** - Fast iteration without backend setup
2. **Test with real API early** - Catch integration issues
3. **Keep apiProxy.ts as single source** - Never bypass it
4. **Monitor localStorage size** - Browser limits ~5-10MB
5. **Add TypeScript types** - Ensure type safety across layers

## Future Enhancements

- [ ] Real-time leaderboard updates (WebSockets)
- [ ] File upload for video submissions
- [ ] Email/SMS notifications
- [ ] Analytics and reporting
- [ ] Multi-language content management
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Data export functionality
