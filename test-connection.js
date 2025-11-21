// Simple MongoDB Connection Test Script
// Run this with: node test-connection.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geetaOlympiad?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('Connecting to:', MONGODB_URI.replace(/admin123/, '****'));
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected successfully!\n');
    
    // Get database
    const db = client.db('geetaOlympiad');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collection(s):`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Test a simple operation
    console.log('\n🔄 Testing write operation...');
    const testCollection = db.collection('test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful!' 
    });
    console.log('✅ Write operation successful!');
    
    // Read back the test document
    const doc = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful!');
    console.log('   Document:', doc);
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful!');
    
    console.log('\n✅ All tests passed! MongoDB is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Tip: Check your username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Tip: Check your internet connection and cluster URL');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Tip: Add your IP address to MongoDB Atlas Network Access');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

// Run the test
testConnection();
