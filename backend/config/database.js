import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db = null;

export async function connectToDatabase() {
  try {
    if (db) {
      return db;
    }

    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    db = client.db('geeta-olympiad');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
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
    console.log('MongoDB connection closed');
  }
}

// Handle application termination
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});
