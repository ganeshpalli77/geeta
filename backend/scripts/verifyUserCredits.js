import { getDatabase } from '../config/database.js';

/**
 * Verification Script: Check User Credits Sync
 * 
 * This script verifies that:
 * 1. All profiles have corresponding user credits entries
 * 2. Credits match between profiles and user credits collections
 * 3. Identifies any discrepancies
 */

async function verifyUserCredits() {
  console.log('🔍 Starting User Credits Verification...\n');
  
  try {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');
    const userCreditsCollection = db.collection('user credits');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();
    console.log(`📋 Found ${profiles.length} profiles\n`);

    let matched = 0;
    let mismatched = 0;
    let missing = 0;

    for (const profile of profiles) {
      const profileId = profile._id.toString();
      const userId = profile.userId;
      const profileName = profile.name || 'Unknown';
      const profileCredits = profile.credits?.total || 0;

      console.log(`\n📝 Checking: ${profileName} (${profile.prn})`);
      console.log(`   Profile ID: ${profileId}`);
      console.log(`   User ID: ${userId}`);
      console.log(`   Profile Credits: ${profileCredits}`);

      // Check if user credits entry exists
      const userCredits = await userCreditsCollection.findOne({
        userId,
        profileId: profile._id
      });

      if (!userCredits) {
        console.log(`   ❌ MISSING: No user credits entry found`);
        missing++;
        continue;
      }

      const userCreditsTotal = userCredits.totalCredits || 0;
      console.log(`   User Credits: ${userCreditsTotal}`);

      if (profileCredits === userCreditsTotal) {
        console.log(`   ✅ MATCHED: Credits are in sync`);
        matched++;
      } else {
        console.log(`   ⚠️  MISMATCH: Profile has ${profileCredits}, User Credits has ${userCreditsTotal}`);
        console.log(`   Difference: ${Math.abs(profileCredits - userCreditsTotal)}`);
        mismatched++;
      }

      // Show earned breakdown
      if (userCredits.earnedBy) {
        const earnedSources = Object.entries(userCredits.earnedBy)
          .filter(([_, amount]) => amount > 0)
          .map(([source, amount]) => `${source}: ${amount}`)
          .join(', ');
        if (earnedSources) {
          console.log(`   💰 Earned from: ${earnedSources}`);
        }
      }

      // Show recent transactions
      if (userCredits.transactions && userCredits.transactions.length > 0) {
        console.log(`   📜 Transactions: ${userCredits.transactions.length}`);
        const lastTransaction = userCredits.transactions[userCredits.transactions.length - 1];
        console.log(`   Last: ${lastTransaction.type} ${lastTransaction.amount} from ${lastTransaction.source}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Verification Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Matched:    ${matched} profiles`);
    console.log(`⚠️  Mismatched: ${mismatched} profiles`);
    console.log(`❌ Missing:    ${missing} profiles`);
    console.log(`📋 Total:      ${profiles.length} profiles`);
    console.log('='.repeat(60));

    // Check for orphaned user credits (credits without profiles)
    const allUserCredits = await userCreditsCollection.find({}).toArray();
    const profileIds = new Set(profiles.map(p => p._id.toString()));
    const orphaned = allUserCredits.filter(uc => !profileIds.has(uc.profileId.toString()));

    if (orphaned.length > 0) {
      console.log(`\n⚠️  Found ${orphaned.length} orphaned user credits entries (no matching profile)`);
      orphaned.forEach(uc => {
        console.log(`   - Profile ID: ${uc.profileId}, Name: ${uc.profileName}, Credits: ${uc.totalCredits}`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (missing > 0) {
      console.log(`   - Run migration script to create missing user credits entries`);
      console.log(`     Command: npm run migrate:credits`);
    }
    if (mismatched > 0) {
      console.log(`   - Sync mismatched profiles using the sync endpoint`);
      console.log(`     POST /api/user-credits/sync/:profileId`);
    }
    if (matched === profiles.length) {
      console.log(`   ✅ All profiles are properly synced!`);
    }

    console.log('\n✅ Verification complete!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    throw error;
  }
}

// Run verification
verifyUserCredits()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
