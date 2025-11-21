import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Test different connection strings
const testConnections = [
  {
    name: 'Current .env URI',
    uri: process.env.MONGODB_URI
  },
  {
    name: 'Alternative user (geethadatabase01)',
    uri: 'mongodb+srv://geethadatabase01:Geethadatabase@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0'
  },
  {
    name: 'Alternative user (pathipatijanesh_db_user) - needs password',
    uri: 'mongodb+srv://pathipatijanesh_db_user:YOUR_PASSWORD@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0'
  }
];

async function testConnection(uri, name) {
  console.log(`\n🔍 Testing: ${name}`);
  console.log(`   URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
  
  if (uri.includes('YOUR_PASSWORD')) {
    console.log('   ⚠️  Skipped - Password placeholder detected\n');
    return false;
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    await client.db().admin().ping();
    console.log('   ✅ Connection successful!\n');
    await client.close();
    return true;
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  MongoDB Connection Test');
  console.log('═══════════════════════════════════════════════════');
  
  let successfulConnection = null;
  
  for (const test of testConnections) {
    const success = await testConnection(test.uri, test.name);
    if (success) {
      successfulConnection = test;
      break;
    }
  }
  
  console.log('═══════════════════════════════════════════════════');
  
  if (successfulConnection) {
    console.log('✅ SUCCESS! Found working connection');
    console.log(`\nUpdate your .env file with this URI:`);
    console.log(successfulConnection.uri);
  } else {
    console.log('❌ All connection attempts failed\n');
    console.log('📋 Next Steps:');
    console.log('1. Go to https://cloud.mongodb.com');
    console.log('2. Navigate to your "geetha" project');
    console.log('3. Click "Database Access" → Verify your database users');
    console.log('4. Click "Network Access" → Add 0.0.0.0/0 to allow all IPs');
    console.log('5. Click "Connect" on Cluster0 → Get your connection string');
    console.log('6. Update the .env file with correct credentials\n');
    console.log('Common Issues:');
    console.log('- Wrong password');
    console.log('- User doesn\'t exist');
    console.log('- IP address not whitelisted');
    console.log('- Special characters in password (need URL encoding)');
  }
  
  console.log('═══════════════════════════════════════════════════\n');
}

main().catch(console.error);

