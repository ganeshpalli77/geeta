import { getDatabase, connectToDatabase } from '../config/database.js';
import { logger } from '../middleware/logger.js';

/**
 * Fix empty userEmail fields in slogans collection
 * Updates slogans with empty emails to use phone number or 'N/A'
 */

async function fixEmptyEmails() {
  try {
    console.log('🔧 Fixing empty userEmail fields in slogans...\n');

    await connectToDatabase();
    const db = await getDatabase();

    const slogansCollection = db.collection('slogans');
    const usersCollection = db.collection('users');

    // Find all slogans with empty userEmail
    const slogansWithEmptyEmail = await slogansCollection.find({
      $or: [
        { userEmail: '' },
        { userEmail: { $exists: false } }
      ]
    }).toArray();

    console.log(`📝 Found ${slogansWithEmptyEmail.length} slogans with empty email\n`);

    if (slogansWithEmptyEmail.length === 0) {
      console.log('✅ No slogans to fix!');
      process.exit(0);
    }

    let fixed = 0;
    for (const slogan of slogansWithEmptyEmail) {
      // Get user details
      const user = await usersCollection.findOne({ _id: slogan.userId });
      
      if (user) {
        const newEmail = user.email || user.phone || 'N/A';
        
        await slogansCollection.updateOne(
          { _id: slogan._id },
          { $set: { userEmail: newEmail } }
        );
        
        console.log(`✅ Fixed slogan ${slogan._id}: ${slogan.userEmail || '(empty)'} → ${newEmail}`);
        fixed++;
      } else {
        console.log(`⚠️  User not found for slogan ${slogan._id}`);
      }
    }

    console.log(`\n✨ Fixed ${fixed}/${slogansWithEmptyEmail.length} slogans`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing emails:', error);
    logger.error('Fix empty emails failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

fixEmptyEmails();
