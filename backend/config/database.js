import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0';

// Optimized MongoDB client options with connection pooling
const clientOptions = {
  maxPoolSize: 50, // Maximum number of connections in the pool
  minPoolSize: 10, // Minimum number of connections to maintain
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Timeout for socket operations
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 10000, // Connection timeout
  family: 4, // Use IPv4, skip trying IPv6
};

const client = new MongoClient(uri, clientOptions);

let db = null;
let isConnecting = false;
let connectionPromise = null;

export async function connectToDatabase() {
  try {
    // Return existing connection if available
    if (db) {
      return db;
    }

    // Wait for existing connection attempt
    if (isConnecting && connectionPromise) {
      return await connectionPromise;
    }

    // Start new connection
    isConnecting = true;
    connectionPromise = (async () => {
      try {
        await client.connect();
        
        // Verify connection with ping
        await client.db('admin').command({ ping: 1 });
        
        console.log('✅ Connected to MongoDB Atlas with connection pooling');
        console.log(`📊 Pool size: ${clientOptions.minPoolSize}-${clientOptions.maxPoolSize} connections`);
        
        db = client.db('geeta-olympiad');
        
        // Create indexes for better performance
        await createIndexes(db);
        
        return db;
      } finally {
        isConnecting = false;
        connectionPromise = null;
      }
    })();

    return await connectionPromise;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnecting = false;
    connectionPromise = null;
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    db = null;
    isConnecting = false;
    connectionPromise = null;
    console.log('🔌 MongoDB connection closed');
  }
}

// Create indexes for better query performance
async function createIndexes(database) {
  try {
    // Users collection indexes
    await database.collection('users').createIndex({ userId: 1 }, { unique: true, sparse: true });
    await database.collection('users').createIndex({ email: 1 }, { sparse: true });
    await database.collection('users').createIndex({ phone: 1 }, { sparse: true });
    await database.collection('users').createIndex({ createdAt: -1 });

    // Profiles collection indexes
    await database.collection('profiles').createIndex({ userId: 1 });
    await database.collection('profiles').createIndex({ referralCode: 1 }, { unique: true, sparse: true });
    await database.collection('profiles').createIndex({ prn: 1, userId: 1 });
    await database.collection('profiles').createIndex({ isActive: 1, userId: 1 });

    // Referrals collection indexes
    await database.collection('referrals').createIndex({ referrerProfileId: 1 });
    await database.collection('referrals').createIndex({ referredProfileId: 1 });
    await database.collection('referrals').createIndex({ referralCode: 1 });
    await database.collection('referrals').createIndex({ createdAt: -1 });

    // Logins collection indexes
    await database.collection('logins').createIndex({ userId: 1, loginAt: -1 });
    await database.collection('logins').createIndex({ loginAt: -1 });

    // Pending registrations collection indexes
    await database.collection('pending_registrations').createIndex({ email: 1 });
    await database.collection('pending_registrations').createIndex({ phone: 1 });
    await database.collection('pending_registrations').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    console.log('📑 Database indexes created successfully');
  } catch (error) {
    // Indexes might already exist, that's okay
    console.log('ℹ️  Database indexes already exist or error creating them');
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    if (!db) {
      return { healthy: false, message: 'Database not connected' };
    }
    
    await db.admin().ping();
    return { healthy: true, message: 'Database connection is healthy' };
  } catch (error) {
    return { healthy: false, message: error.message };
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received, closing database connection...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received, closing database connection...');
  await closeDatabase();
  process.exit(0);
});
