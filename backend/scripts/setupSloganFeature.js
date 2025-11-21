import { getDatabase, connectToDatabase } from '../config/database.js';
import { logger } from '../middleware/logger.js';

/**
 * Setup script for Slogan Feature
 * This script will:
 * 1. Create indexes for slogans collection
 * 2. Migrate existing profiles to include credits structure
 */

async function setupSloganFeature() {
  try {
    console.log('🚀 Starting Slogan Feature Setup...\n');

    // Connect to database
    await connectToDatabase();
    const db = await getDatabase();

    // ========================================================================
    // STEP 1: Create Slogans Collection Indexes
    // ========================================================================
    console.log('📊 Creating indexes for slogans collection...');
    const slogansCollection = db.collection('slogans');

    // Index for user queries
    await slogansCollection.createIndex({ userId: 1, round: 1 });
    console.log('✅ Created index: { userId: 1, round: 1 }');

    // Index for profile queries
    await slogansCollection.createIndex({ profileId: 1 });
    console.log('✅ Created index: { profileId: 1 }');

    // Index for admin filtering
    await slogansCollection.createIndex({ round: 1, status: 1 });
    console.log('✅ Created index: { round: 1, status: 1 }');

    // Index for sorting by date
    await slogansCollection.createIndex({ createdAt: -1 });
    console.log('✅ Created index: { createdAt: -1 }');

    // Text index for search functionality
    await slogansCollection.createIndex(
      { userName: 'text', userEmail: 'text', slogan: 'text' },
      { name: 'slogan_text_search' }
    );
    console.log('✅ Created text index for search\n');

    // ========================================================================
    // STEP 2: Migrate Existing Profiles to Include Credits
    // ========================================================================
    console.log('💳 Migrating existing profiles to include credits structure...');
    const profilesCollection = db.collection('profiles');

    // Check how many profiles need migration
    const profilesWithoutCredits = await profilesCollection.countDocuments({
      credits: { $exists: false }
    });

    console.log(`📝 Found ${profilesWithoutCredits} profiles without credits structure`);

    if (profilesWithoutCredits > 0) {
      // Update all profiles that don't have credits field
      const result = await profilesCollection.updateMany(
        { credits: { $exists: false } },
        {
          $set: {
            credits: {
              total: 0,
              available: 0,
              earned: {
                slogans: 0,
                quizzes: 0,
                puzzles: 0,
                reels: 0,
                shlokas: 0,
                referrals: 0,
              },
              spent: 0,
            },
            updatedAt: new Date(),
          }
        }
      );

      console.log(`✅ Migrated ${result.modifiedCount} profiles with credits structure\n`);
    } else {
      console.log('✅ All profiles already have credits structure\n');
    }

    // ========================================================================
    // STEP 3: Verify Setup
    // ========================================================================
    console.log('🔍 Verifying setup...');

    // Check indexes
    const indexes = await slogansCollection.indexes();
    console.log(`✅ Slogans collection has ${indexes.length} indexes`);

    // Check profiles
    const totalProfiles = await profilesCollection.countDocuments({});
    const profilesWithCredits = await profilesCollection.countDocuments({
      credits: { $exists: true }
    });
    console.log(`✅ ${profilesWithCredits}/${totalProfiles} profiles have credits structure\n`);

    // ========================================================================
    // STEP 4: Display Summary
    // ========================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✨ SLOGAN FEATURE SETUP COMPLETE! ✨');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n📋 Summary:');
    console.log(`   • Slogans collection indexes: ${indexes.length}`);
    console.log(`   • Profiles migrated: ${profilesWithCredits}/${totalProfiles}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Users can now submit slogans in Round 1');
    console.log('   3. Admins can manage slogans in the admin panel');
    console.log('\n💡 Test the feature:');
    console.log('   • User: Navigate to Round 1 → Create a Slogan');
    console.log('   • Admin: Open Slogan Management panel');
    console.log('═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during setup:', error);
    logger.error('Slogan feature setup failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Run the setup
setupSloganFeature();
