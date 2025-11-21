import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class ProfileModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('profiles');
  }

  static async createProfile(profileData) {
    const collection = await this.getCollection();
    
    // Check if this is the first profile for the user
    const existingProfilesCount = await this.countProfilesByUserId(profileData.userId);
    const isFirstProfile = existingProfilesCount === 0;
    
    const profile = {
      userId: profileData.userId, // Store as string (Supabase UUID)
      name: profileData.name,
      prn: profileData.prn,
      dob: profileData.dob,
      preferredLanguage: profileData.preferredLanguage,
      category: profileData.category || null,
      isActive: isFirstProfile, // First profile is automatically active
      referralCode: '', // Will be set after insertion
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(profile);
    const profileId = result.insertedId.toString();
    
    // Generate unique referral code based on userId and profileId
    const userPart = profileData.userId.substring(0, 4).toUpperCase();
    const profilePart = profileId.substring(profileId.length - 4).toUpperCase();
    const referralCode = `GEETA-${userPart}-${profilePart}`;
    
    // Update the profile with the referral code
    await collection.updateOne(
      { _id: result.insertedId },
      { $set: { referralCode: referralCode } }
    );
    
    return { _id: result.insertedId, ...profile, referralCode };
  }

  static async findProfileById(profileId) {
    const collection = await this.getCollection();
    // Validate profileId before creating ObjectId
    if (!profileId || !ObjectId.isValid(profileId)) {
      throw new Error('Invalid profile ID format');
    }
    return await collection.findOne({ _id: new ObjectId(profileId) });
  }

  static async findProfilesByUserId(userId) {
    const collection = await this.getCollection();
    return await collection.find({ userId: userId }).toArray();
  }

  static async updateProfile(profileId, updates) {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(profileId) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  static async deleteProfile(profileId) {
    const collection = await this.getCollection();
    return await collection.deleteOne({ _id: new ObjectId(profileId) });
  }

  static async countProfilesByUserId(userId) {
    const collection = await this.getCollection();
    return await collection.countDocuments({ userId: userId });
  }

  static async findProfileByPRN(prn) {
    const collection = await this.getCollection();
    return await collection.findOne({ prn });
  }

  static async setActiveProfile(userId, profileId) {
    const collection = await this.getCollection();
    
    // First, unset all active profiles for this user
    await collection.updateMany(
      { userId: userId },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    // Then set the specified profile as active
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(profileId), userId: userId },
      { 
        $set: { 
          isActive: true,
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  static async getActiveProfile(userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ 
      userId: userId, 
      isActive: true 
    });
  }

  /**
   * Add credits to a profile
   * @param {string} profileId - Profile ID
   * @param {number} amount - Amount of credits to add
   * @param {string} source - Source of credits (slogans, quizzes, puzzles, etc.)
   */
  static async addCredits(profileId, amount, source = 'slogans') {
    const collection = await this.getCollection();
    
    const validSources = ['slogans', 'quizzes', 'puzzles', 'reels', 'shlokas', 'referrals'];
    if (!validSources.includes(source)) {
      throw new Error(`Invalid credit source. Must be one of: ${validSources.join(', ')}`);
    }

    const updateFields = {
      $inc: {
        'credits.total': amount,
        'credits.available': amount,
        [`credits.earned.${source}`]: amount,
      },
      $set: {
        updatedAt: new Date(),
      }
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(profileId) },
      updateFields,
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Deduct credits from a profile
   * @param {string} profileId - Profile ID
   * @param {number} amount - Amount of credits to deduct
   */
  static async deductCredits(profileId, amount) {
    const collection = await this.getCollection();
    
    // First check if profile has enough credits
    const profile = await this.findProfileById(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const availableCredits = profile.credits?.available || 0;
    if (availableCredits < amount) {
      throw new Error(`Insufficient credits. Available: ${availableCredits}, Required: ${amount}`);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(profileId) },
      {
        $inc: {
          'credits.available': -amount,
          'credits.spent': amount,
        },
        $set: {
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Get profile credits summary
   * @param {string} profileId - Profile ID
   */
  static async getCredits(profileId) {
    const profile = await this.findProfileById(profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile.credits || {
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
    };
  }
}
