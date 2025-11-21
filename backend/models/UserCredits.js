import { getDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';

/**
 * UserCredits Model
 * Centralized credit tracking for all users
 * Stores credit history and current balance
 */
class UserCredits {
  /**
   * Get or create user credits document
   * @param {string} userId - User ID
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object>} User credits document
   */
  static async getOrCreateUserCredits(userId, profileId) {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    // Try to find existing document
    let userCredits = await collection.findOne({
      userId,
      profileId: new ObjectId(profileId)
    });

    // Create if doesn't exist
    if (!userCredits) {
      // Get profile name from profiles collection
      const profilesCollection = db.collection('profiles');
      const profile = await profilesCollection.findOne({ _id: new ObjectId(profileId) });
      
      const profileName = profile?.name || 'Unknown';
      const profilePRN = profile?.prn || '';

      const newCredits = {
        userId,
        profileId: new ObjectId(profileId),
        profileName,        // ✅ Store profile name
        profilePRN,         // ✅ Store profile PRN
        totalCredits: 0,
        availableCredits: 0,
        spentCredits: 0,
        earnedBy: {
          referrals: 0,
          quizzes: 0,
          slogans: 0,
          puzzles: 0,
          videos: 0,
          events: 0,
          dailyQuiz: 0,
          mockTest: 0,
        },
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newCredits);
      userCredits = { _id: result.insertedId, ...newCredits };
      console.log(`✅ Created new user credits document for ${profileName} (${userId})`);
    }

    return userCredits;
  }

  /**
   * Add credits to user account
   * @param {string} userId - User ID
   * @param {string} profileId - Profile ID
   * @param {number} amount - Amount of credits to add
   * @param {string} source - Source of credits (referrals, quizzes, etc.)
   * @param {string} description - Description of transaction
   * @returns {Promise<Object>} Updated credits document
   */
  static async addCredits(userId, profileId, amount, source = 'other', description = '') {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    console.log(`💰 Adding ${amount} credits to user ${userId}, profile ${profileId}, source: ${source}`);

    // Ensure user credits document exists
    await this.getOrCreateUserCredits(userId, profileId);

    // Create transaction record
    const transaction = {
      type: 'credit',
      amount,
      source,
      description: description || `Earned ${amount} credits from ${source}`,
      timestamp: new Date(),
    };

    // Update credits
    const result = await collection.findOneAndUpdate(
      {
        userId,
        profileId: new ObjectId(profileId)
      },
      {
        $inc: {
          totalCredits: amount,
          availableCredits: amount,
          [`earnedBy.${source}`]: amount,
        },
        $push: {
          transactions: {
            $each: [transaction],
            $slice: -100 // Keep last 100 transactions
          }
        },
        $set: {
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    console.log(`✅ Credits added successfully. New balance: ${result.totalCredits}`);
    return result;
  }

  /**
   * Deduct credits from user account
   * @param {string} userId - User ID
   * @param {string} profileId - Profile ID
   * @param {number} amount - Amount of credits to deduct
   * @param {string} reason - Reason for deduction
   * @returns {Promise<Object>} Updated credits document
   */
  static async deductCredits(userId, profileId, amount, reason = 'Purchase') {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    console.log(`💸 Deducting ${amount} credits from user ${userId}, profile ${profileId}`);

    // Check if user has enough credits
    const userCredits = await this.getOrCreateUserCredits(userId, profileId);
    
    if (userCredits.availableCredits < amount) {
      throw new Error(`Insufficient credits. Available: ${userCredits.availableCredits}, Required: ${amount}`);
    }

    // Create transaction record
    const transaction = {
      type: 'debit',
      amount: -amount,
      source: 'purchase',
      description: reason,
      timestamp: new Date(),
    };

    // Update credits
    const result = await collection.findOneAndUpdate(
      {
        userId,
        profileId: new ObjectId(profileId)
      },
      {
        $inc: {
          availableCredits: -amount,
          spentCredits: amount,
        },
        $push: {
          transactions: {
            $each: [transaction],
            $slice: -100
          }
        },
        $set: {
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    console.log(`✅ Credits deducted successfully. New balance: ${result.availableCredits}`);
    return result;
  }

  /**
   * Get user credits summary
   * @param {string} userId - User ID
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object>} Credits summary
   */
  static async getCredits(userId, profileId) {
    const userCredits = await this.getOrCreateUserCredits(userId, profileId);
    
    return {
      totalCredits: userCredits.totalCredits || 0,
      availableCredits: userCredits.availableCredits || 0,
      spentCredits: userCredits.spentCredits || 0,
      earnedBy: userCredits.earnedBy || {},
      lastUpdated: userCredits.updatedAt,
    };
  }

  /**
   * Get transaction history
   * @param {string} userId - User ID
   * @param {string} profileId - Profile ID
   * @param {number} limit - Number of transactions to return
   * @returns {Promise<Array>} Transaction history
   */
  static async getTransactionHistory(userId, profileId, limit = 50) {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    const userCredits = await collection.findOne({
      userId,
      profileId: new ObjectId(profileId)
    });

    if (!userCredits || !userCredits.transactions) {
      return [];
    }

    // Return most recent transactions
    return userCredits.transactions.slice(-limit).reverse();
  }

  /**
   * Get all users' credits (for leaderboard)
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Top users by credits
   */
  static async getLeaderboard(limit = 100) {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    const leaderboard = await collection
      .find({})
      .sort({ totalCredits: -1 })
      .limit(limit)
      .toArray();

    return leaderboard;
  }

  /**
   * Sync credits from profile to user credits collection
   * This is a migration/sync helper
   * @param {string} profileId - Profile ID
   */
  static async syncFromProfile(profileId) {
    const db = await getDatabase();
    const profilesCollection = db.collection('profiles');
    
    const profile = await profilesCollection.findOne({ _id: new ObjectId(profileId) });
    
    if (!profile) {
      throw new Error('Profile not found');
    }

    const userId = profile.userId;
    const profileCredits = profile.credits || {};

    // Get or create user credits
    await this.getOrCreateUserCredits(userId, profileId);

    // Update with profile data
    const creditsCollection = db.collection('user credits');
    await creditsCollection.updateOne(
      {
        userId,
        profileId: new ObjectId(profileId)
      },
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

    console.log(`✅ Synced credits from profile ${profileId} to user credits collection`);
  }

  /**
   * Get total credits across all profiles for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Aggregated credits
   */
  static async getUserTotalCredits(userId) {
    const db = await getDatabase();
    const collection = db.collection('user credits');

    const result = await collection.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$userId',
          totalCredits: { $sum: '$totalCredits' },
          availableCredits: { $sum: '$availableCredits' },
          spentCredits: { $sum: '$spentCredits' },
          profileCount: { $sum: 1 }
        }
      }
    ]).toArray();

    if (result.length === 0) {
      return {
        totalCredits: 0,
        availableCredits: 0,
        spentCredits: 0,
        profileCount: 0
      };
    }

    return result[0];
  }
}

export default UserCredits;
