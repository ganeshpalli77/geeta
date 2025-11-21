import express from 'express';
import UserCredits from '../models/UserCredits.js';

const router = express.Router();

/**
 * GET /api/user-credits/:userId/:profileId
 * Get credits for a specific user profile
 */
router.get('/:userId/:profileId', async (req, res) => {
  try {
    const { userId, profileId } = req.params;

    console.log(`📊 Fetching credits for user ${userId}, profile ${profileId}`);

    const credits = await UserCredits.getCredits(userId, profileId);

    res.json({
      success: true,
      credits,
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credits',
      message: error.message,
    });
  }
});

/**
 * GET /api/user-credits/:userId/total
 * Get total credits across all profiles for a user
 */
router.get('/:userId/total', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`📊 Fetching total credits for user ${userId}`);

    const totalCredits = await UserCredits.getUserTotalCredits(userId);

    res.json({
      success: true,
      totalCredits,
    });
  } catch (error) {
    console.error('Error fetching total user credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch total credits',
      message: error.message,
    });
  }
});

/**
 * GET /api/user-credits/:userId/:profileId/transactions
 * Get transaction history for a user profile
 */
router.get('/:userId/:profileId/transactions', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    console.log(`📜 Fetching transaction history for user ${userId}, profile ${profileId}`);

    const transactions = await UserCredits.getTransactionHistory(userId, profileId, limit);

    res.json({
      success: true,
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history',
      message: error.message,
    });
  }
});

/**
 * GET /api/user-credits/leaderboard
 * Get credits leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;

    console.log(`🏆 Fetching credits leaderboard (top ${limit})`);

    const leaderboard = await UserCredits.getLeaderboard(limit);

    res.json({
      success: true,
      leaderboard,
      count: leaderboard.length,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard',
      message: error.message,
    });
  }
});

/**
 * POST /api/user-credits/:userId/:profileId/add
 * Manually add credits (admin only)
 */
router.post('/:userId/:profileId/add', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    const { amount, source, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    console.log(`💰 Manually adding ${amount} credits to user ${userId}, profile ${profileId}`);

    const result = await UserCredits.addCredits(
      userId,
      profileId,
      amount,
      source || 'manual',
      description || 'Manual credit addition'
    );

    res.json({
      success: true,
      message: 'Credits added successfully',
      credits: {
        totalCredits: result.totalCredits,
        availableCredits: result.availableCredits,
      },
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add credits',
      message: error.message,
    });
  }
});

/**
 * POST /api/user-credits/:userId/:profileId/deduct
 * Manually deduct credits (admin only)
 */
router.post('/:userId/:profileId/deduct', async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    console.log(`💸 Manually deducting ${amount} credits from user ${userId}, profile ${profileId}`);

    const result = await UserCredits.deductCredits(
      userId,
      profileId,
      amount,
      reason || 'Manual deduction'
    );

    res.json({
      success: true,
      message: 'Credits deducted successfully',
      credits: {
        totalCredits: result.totalCredits,
        availableCredits: result.availableCredits,
      },
    });
  } catch (error) {
    console.error('Error deducting credits:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/user-credits/sync/:profileId
 * Sync credits from profile to user credits collection
 */
router.post('/sync/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;

    console.log(`🔄 Syncing credits for profile ${profileId}`);

    await UserCredits.syncFromProfile(profileId);

    res.json({
      success: true,
      message: 'Credits synced successfully',
    });
  } catch (error) {
    console.error('Error syncing credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync credits',
      message: error.message,
    });
  }
});

/**
 * POST /api/user-credits/migrate-all
 * Migrate all existing profiles to user credits collection
 */
router.post('/migrate-all', async (req, res) => {
  try {
    console.log('🚀 Starting migration of all existing profiles...');

    const { getDatabase } = await import('../config/database.js');
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');
    const userCreditsCollection = db.collection('user credits');

    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();
    console.log(`📋 Found ${profiles.length} profiles to migrate`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const profile of profiles) {
      try {
        const profileId = profile._id.toString();
        const userId = profile.userId;

        // Check if user credits entry already exists
        const existingCredits = await userCreditsCollection.findOne({
          userId,
          profileId: profile._id
        });

        if (existingCredits) {
          // Update existing entry
          const profileCredits = profile.credits || {};
          await userCreditsCollection.updateOne(
            { userId, profileId: profile._id },
            {
              $set: {
                profileName: profile.name || 'Unknown',
                profilePRN: profile.prn || '',
                totalCredits: profileCredits.total || 0,
                availableCredits: profileCredits.available || 0,
                spentCredits: profileCredits.spent || 0,
                earnedBy: profileCredits.earned || {},
                updatedAt: new Date(),
              }
            }
          );
          updated++;
        } else {
          // Create new entry
          await UserCredits.getOrCreateUserCredits(userId, profileId);
          
          // Sync credits from profile
          const profileCredits = profile.credits || {};
          if (profileCredits.total > 0) {
            await userCreditsCollection.updateOne(
              { userId, profileId: profile._id },
              {
                $set: {
                  totalCredits: profileCredits.total || 0,
                  availableCredits: profileCredits.available || 0,
                  spentCredits: profileCredits.spent || 0,
                  earnedBy: profileCredits.earned || {},
                }
              }
            );
          }
          created++;
        }
      } catch (profileError) {
        console.error(`Error migrating profile ${profile.name}:`, profileError);
        errors++;
      }
    }

    const summary = {
      totalProfiles: profiles.length,
      created,
      updated,
      errors,
    };

    console.log('✅ Migration completed:', summary);

    res.json({
      success: true,
      message: 'Migration completed successfully',
      summary,
    });
  } catch (error) {
    console.error('Error during migration:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message,
    });
  }
});

export default router;
