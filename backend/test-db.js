import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0';

async function testDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const questionDb = client.db('questiondatabase');
    const collection = questionDb.collection('english');
    
    // Check total count
    const total = await collection.countDocuments();
    console.log(`\n📊 Total documents: ${total}`);
    
    // Get a sample document to see the structure
    const sample = await collection.findOne();
    console.log('\n📄 Sample document:');
    console.log(JSON.stringify(sample, null, 2));
    
    // Check difficulty field values
    const difficulties = await collection.distinct('difficulty');
    console.log('\n🎯 Unique difficulty values:', difficulties);
    
    // Count by each difficulty
    for (const diff of difficulties) {
      const count = await collection.countDocuments({ difficulty: diff });
      console.log(`   ${diff}: ${count} questions`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testDatabase();
