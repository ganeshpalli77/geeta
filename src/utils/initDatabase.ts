// Database Initialization Script
// Run this to set up your MongoDB database with initial data

import { connectToDatabase, createIndexes } from './mongodb';

/**
 * Initialize the database with collections and indexes
 */
export async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB successfully!');

    console.log('🔄 Creating indexes...');
    await createIndexes();
    console.log('✅ Indexes created successfully!');

    console.log('✅ Database initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Test the database connection
 */
export async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    const db = await connectToDatabase();
    
    // Test by listing collections
    const collections = await db.listCollections().toArray();
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    return false;
  }
}

// Auto-initialize when imported (optional)
if (import.meta.env.DEV) {
  // Only auto-connect in development mode
  testConnection().catch(console.error);
}
