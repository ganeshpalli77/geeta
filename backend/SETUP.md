# MongoDB Atlas Setup Guide

## Your Existing MongoDB Atlas Resources

**Project:** geetha (ID: 691f131632a37e11db9c8385)
**Cluster:** Cluster0 (mongodb+srv://cluster0.ixnaagr.mongodb.net)
**Database Users:** 
- pathipatijanesh_db_user (atlasAdmin)
- mcpUser88278 (readWriteAnyDatabase)

## Setup Steps

### 1. Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your "geetha" project
3. Click on "Connect" for Cluster0
4. Choose "Connect your application"
5. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.ixnaagr.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Configure Your Backend

1. Create a `.env` file in the backend folder:
   ```bash
   cd backend
   copy .env.example .env
   ```

2. Edit the `.env` file and add your connection string:
   ```
   MONGODB_URI=mongodb+srv://pathipatijanesh_db_user:<YOUR_PASSWORD>@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```

   Replace `<YOUR_PASSWORD>` with the actual password for your database user.

### 3. Ensure IP Access

Make sure your IP address is whitelisted in MongoDB Atlas:
1. Go to Network Access in MongoDB Atlas
2. Add your current IP address or use `0.0.0.0/0` for development (allow all IPs)

### 4. Install Dependencies and Start Backend

```bash
cd backend
npm install
npm run dev
```

The server will start on http://localhost:5000

### 5. Test the API

Visit http://localhost:5000/health to verify the server is running.

## Database Structure

The backend will automatically create these collections in the `geeta-olympiad` database:

- **users**: Stores user authentication data (email/phone)
- **profiles**: Stores user profile information (name, PRN, DOB, etc.)

## API Endpoints

### User Registration
```
POST http://localhost:5000/api/users/register
Body: { "email": "user@example.com" } or { "phone": "+911234567890" }
```

### Get User
```
GET http://localhost:5000/api/users/:userId
```

### Create Profile
```
POST http://localhost:5000/api/profiles
Body: {
  "userId": "user_id_here",
  "name": "John Doe",
  "prn": "PRN123",
  "dob": "2000-01-01",
  "preferredLanguage": "en"
}
```

### Get User Profiles
```
GET http://localhost:5000/api/profiles/user/:userId
```
