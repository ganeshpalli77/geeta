# Geeta Olympiad Backend

Backend API for the Geeta Olympiad application with MongoDB integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and add your MongoDB connection string.

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### User Registration
- `POST /api/users/register` - Register a new user with email or phone

### User Authentication
- `POST /api/users/login` - Login with email/phone and OTP
- `POST /api/users/verify-otp` - Verify OTP

### Profile Management
- `GET /api/profiles/:userId` - Get user profiles
- `POST /api/profiles` - Create a new profile
- `PUT /api/profiles/:profileId` - Update a profile

### Login Tracking (NEW!)
- `POST /api/logins` - Create a login record
- `GET /api/logins/user/:userId` - Get login history for a user
- `GET /api/logins/email/:email` - Get login history by email
- `GET /api/logins/phone/:phone` - Get login history by phone
- `GET /api/logins/recent` - Get recent logins (admin)
- `GET /api/logins/failed` - Get failed login attempts (admin)

## Database Schema

### Users Collection
- `_id`: ObjectId
- `email`: String (optional)
- `phone`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

### Profiles Collection
- `_id`: ObjectId
- `userId`: ObjectId (reference to Users)
- `name`: String
- `prn`: String
- `dob`: String
- `preferredLanguage`: String
- `category`: String
- `createdAt`: Date
- `updatedAt`: Date

### Logins Collection (NEW!)
- `_id`: ObjectId
- `userId`: ObjectId (reference to Users, optional)
- `email`: String (optional)
- `phone`: String (optional)
- `loginMethod`: String ('email' or 'phone')
- `ipAddress`: String
- `userAgent`: String
- `loginAt`: Date
- `success`: Boolean
