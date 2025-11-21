import { getDatabase } from '../config/database.js';
import UserCredits from '../models/UserCredits.js';

/**
 * Sync Script: Create user credits for profiles that don't have them
 * 
 * This script:
 * 1. Finds profiles without user credits entries
 * 2. Creates user credits entries for them
 * 3. Syncs their current credit balance
 */

async function syncMissingProfiles() {
  console.log('🔄 Starting Sync for Missing Profiles...\n');
  
  try {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');
    const userCreditsCollection = db.collection('user credits');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();
    console.log(`📋 Found ${profiles.length} total profiles\n`);

    let created = 0;
    let alreadyExists = 0;
    let errors = 0;

    for (const profile of profiles) {
      const profileId = profile._id.toString();
      const userId = profile.userId;
      const profileName = profile.name || 'Unknown';
      const profilePRN = profile.prn || '';
      const profileCredits = profile.credits || {};

      // Check if user credits entry exists
      const existingCredits = await userCreditsCollection.findOne({
        userId,
        profileId: profile._id
      });

      if (existingCredits) {
        console.log(`✅ ${profileName} (${profilePRN}) - Already has user credits entry`);
        alreadyExists++;
        continue;
      }

      // Create user credits entry
      try {
        console.log(`\n🆕 Creating user credits for: ${profileName} (${profilePRN})`);
        console.log(`   Profile ID: ${profileId}`);
        console.log(`   User ID: ${userId}`);
        console.log(`   Current Credits: ${profileCredits.total || 0}`);

        // Create entry using UserCredits model
        await UserCredits.getOrCreateUserCredits(userId, profileId);

        // If profile has credits, sync them
        if (profileCredits.total > 0) {
          console.log(`   💰 Syncing ${profileCredits.total} credits...`);
          
          await userCreditsCollection.updateOne(
            { userId, profileId: profile._id },
            {
              $set: {
                totalCredits: profileCredits.total || 0,
                availableCredits: profileCredits.available || 0,
                spentCredits: profileCredits.spent || 0,
                earnedBy: profileCredits.earned || {},
                updatedAt: new Date(),
              }
            }
          );
          console.log(`   ✅ Credits synced successfully`);
        }

        created++;
        console.log(`   ✅ User credits entry created for ${profileName}`);
      } catch (error) {
        console.error(`   ❌ Error creating user credits for ${profileName}:`, error.message);
        errors++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Sync Summary:');
    console.log('='.repeat(60));
    console.log(`🆕 Created:        ${created} new entries`);
    console.log(`✅ Already Exists: ${alreadyExists} entries`);
    console.log(`❌ Errors:         ${errors} errors`);
    console.log(`📋 Total:          ${profiles.length} profiles`);
    console.log('='.repeat(60));

    if (created > 0) {
      console.log(`\n✅ Successfully created ${created} user credits entries!`);
    }
    if (errors > 0) {
      console.log(`\n⚠️  ${errors} profiles had errors during sync`);
    }
    if (created === 0 && errors === 0) {
      console.log(`\n✅ All profiles already have user credits entries!`);
    }

    console.log('\n✅ Sync complete!\n');

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    throw error;
  }
}

// Run sync
syncMissingProfiles()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
