# MongoDB Integration Setup Guide

This guide will help you set up MongoDB for the Geeta Olympiad application.

## Prerequisites

- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

## Option 1: Local MongoDB Setup

### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard
- MongoDB will run as a Windows service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Verify MongoDB is Running

```bash
mongosh
# You should see the MongoDB shell prompt
```

### 3. Create Environment File

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MONGODB_URI=mongodb://localhost:27017/geetaOlympiad
```

## Option 2: MongoDB Atlas (Cloud) Setup

### 1. Create MongoDB Atlas Account

- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for a free account
- Create a new cluster (Free tier available)

### 2. Configure Database Access

- Go to "Database Access" in the left sidebar
- Click "Add New Database User"
- Create a username and password
- Grant "Read and write to any database" permissions

### 3. Configure Network Access

- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Or add your specific IP address

### 4. Get Connection String

- Go to "Database" in the left sidebar
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

### 5. Create Environment File

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geetaOlympiad?retryWrites=true&w=majority
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install the `mongodb` package along with other dependencies.

### 2. Initialize Database

The database will be automatically initialized when you first run the application. The system will:
- Create necessary collections
- Set up indexes for optimal performance
- Initialize default data

### 3. Run the Application

```bash
npm run dev
```

## Database Collections

The application uses the following MongoDB collections:

- **users** - User authentication and account data
- **profiles** - User profiles (students can have multiple profiles)
- **quizAttempts** - Quiz submission records
- **videoSubmissions** - Video submission records
- **sloganSubmissions** - Slogan submission records
- **imageParts** - Puzzle piece collection records
- **roundTasks** - Task status tracking for each profile
- **notifications** - User notifications
- **achievements** - Unlocked achievements

## Round Tasks Structure

### Round 1 Tasks:
1. Daily Quiz (100 points)
2. Collect Today's Puzzle Piece (50 points)
3. Create a Slogan (75 points)
4. Create a Reel (100 points)

### Rounds 2-7 Tasks:
Each round has:
1. Daily Quiz (100 points)
2. Collect Today's Puzzle Piece (50 points)
3. Additional task specific to the round (varies)

## API Endpoints (Backend Required)

To fully integrate MongoDB, you'll need a backend API server. Here are the recommended endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Profiles
- `GET /api/profiles/:userId` - Get user profiles
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:profileId` - Update profile

### Round Tasks
- `GET /api/rounds/:roundNumber/tasks/:profileId` - Get tasks for a round
- `PUT /api/rounds/tasks/:taskId/status` - Update task status

### Quiz
- `GET /api/quiz/questions/:type` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz attempt

### Events
- `POST /api/events/videos` - Submit video
- `POST /api/events/slogans` - Submit slogan
- `POST /api/puzzle/collect` - Collect puzzle piece

### Leaderboard
- `GET /api/leaderboard/overall` - Get overall leaderboard
- `GET /api/leaderboard/weekly` - Get weekly leaderboard

## Troubleshooting

### Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your username and password in the connection string
- Ensure the database user has proper permissions

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- Verify MongoDB is running: `mongosh` or check MongoDB service
- Check if the port (27017) is correct
- Check firewall settings

### Performance Issues

- Ensure indexes are created (run `createIndexes()` function)
- Monitor query performance in MongoDB Compass
- Consider upgrading to a larger Atlas tier if using cloud

## Development Tools

### MongoDB Compass (GUI)
- Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect using your connection string
- Visualize and query your data

### MongoDB Shell (mongosh)
```bash
mongosh "mongodb://localhost:27017/geetaOlympiad"
```

Useful commands:
```javascript
// Show all collections
show collections

// Query tasks
db.roundTasks.find({ profileId: ObjectId("...") })

// Count documents
db.roundTasks.countDocuments()

// Create index
db.roundTasks.createIndex({ profileId: 1, roundNumber: 1 })
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Enable SSL/TLS** for connections
5. **Regular backups** of your database
6. **Monitor access logs** in MongoDB Atlas

## Migration from Mock DB

If you're migrating from the localStorage mock database:

1. Export existing data from localStorage
2. Transform data to match MongoDB schema
3. Import using MongoDB import tools or scripts
4. Update `USE_MOCK_API` flag in `config.ts` to `false`

## Support

For issues or questions:
- MongoDB Documentation: [docs.mongodb.com](https://docs.mongodb.com)
- MongoDB University: [university.mongodb.com](https://university.mongodb.com)
- MongoDB Community Forums: [community.mongodb.com](https://community.mongodb.com)
