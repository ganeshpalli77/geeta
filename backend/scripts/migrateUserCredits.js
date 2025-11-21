import { getDatabase } from '../config/database.js';
import UserCredits from '../models/UserCredits.js';

/**
 * Migration Script: Initialize User Credits for Existing Profiles
 * 
 * This script:
 * 1. Finds all existing profiles
 * 2. Creates user credits entries for profiles that don't have one
 * 3. Syncs existing credit data from profiles collection
 */

async function migrateUserCredits() {
  console.log('🚀 Starting User Credits Migration...\n');
  
  try {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');
    const userCreditsCollection = db.collection('user credits');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();
    console.log(`📋 Found ${profiles.length} profiles to process\n`);

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const profile of profiles) {
      try {
        const profileId = profile._id.toString();
        const userId = profile.userId;
        const profileName = profile.name || 'Unknown';
        const profilePRN = profile.prn || '';

        console.log(`\n📝 Processing: ${profileName} (${profilePRN})`);
        console.log(`   Profile ID: ${profileId}`);
        console.log(`   User ID: ${userId}`);

        // Check if user credits entry already exists
        const existingCredits = await userCreditsCollection.findOne({
          userId,
          profileId: profile._id
        });

        if (existingCredits) {
          console.log(`   ⏭️  User credits entry already exists - updating...`);
          
          // Update with latest profile data
          const profileCredits = profile.credits || {};
          await userCreditsCollection.updateOne(
            { userId, profileId: profile._id },
            {
              $set: {
                profileName,
                profilePRN,
                totalCredits: profileCredits.total || 0,
                availableCredits: profileCredits.available || 0,
                spentCredits: profileCredits.spent || 0,
                earnedBy: profileCredits.earned || {
                  referrals: 0,
                  quizzes: 0,
                  slogans: 0,
                  puzzles: 0,
                  videos: 0,
                  events: 0,
                  dailyQuiz: 0,
                  mockTest: 0,
                },
                updatedAt: new Date(),
              }
            }
          );
          
          console.log(`   ✅ Updated existing entry`);
          updated++;
        } else {
          console.log(`   🆕 Creating new user credits entry...`);
          
          // Get credits from profile
          const profileCredits = profile.credits || {};
          const totalCredits = profileCredits.total || 0;
          const availableCredits = profileCredits.available || 0;
          const spentCredits = profileCredits.spent || 0;
          const earnedBy = profileCredits.earned || {};

          // Create new user credits document
          const newCredits = {
            userId,
            profileId: profile._id,
            profileName,
            profilePRN,
            totalCredits,
            availableCredits,
            spentCredits,
            earnedBy: {
              referrals: earnedBy.referrals || 0,
              quizzes: earnedBy.quizzes || 0,
              slogans: earnedBy.slogans || 0,
              puzzles: earnedBy.puzzles || 0,
              videos: earnedBy.videos || 0,
              events: earnedBy.events || 0,
              dailyQuiz: earnedBy.dailyQuiz || 0,
              mockTest: earnedBy.mockTest || 0,
            },
            transactions: [],
            createdAt: profile.createdAt || new Date(),
            updatedAt: new Date(),
          };

          await userCreditsCollection.insertOne(newCredits);
          
          console.log(`   ✅ Created new entry with ${totalCredits} credits`);
          created++;
        }

      } catch (profileError) {
        console.error(`   ❌ Error processing profile ${profile.name}:`, profileError.message);
        errors++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Created:  ${created} new entries`);
    console.log(`🔄 Updated:  ${updated} existing entries`);
    console.log(`⏭️  Skipped:  ${skipped} entries`);
    console.log(`❌ Errors:   ${errors} errors`);
    console.log(`📋 Total:    ${profiles.length} profiles processed`);
    console.log('='.repeat(60));

    // Verify results
    const totalUserCredits = await userCreditsCollection.countDocuments();
    console.log(`\n✅ Total user credits entries in database: ${totalUserCredits}`);

    console.log('\n🎉 Migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateUserCredits()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
