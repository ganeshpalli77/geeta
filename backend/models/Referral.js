import { getDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';

class Referral {
  constructor(referrerUserId, referrerProfileId, referralCode, referredUserId, referredProfileId) {
    this._id = new ObjectId();
    this.referrerUserId = referrerUserId; // User who owns the referral code
    this.referrerProfileId = referrerProfileId; // Profile that owns the referral code
    this.referralCode = referralCode; // The referral code used
    this.referredUserId = referredUserId; // User who used the code
    this.referredProfileId = referredProfileId; // Profile created with the code
    this.creditsAwarded = 100; // Credits given to referrer
    this.bonusCredits = 50; // Credits given to referred user
    this.status = 'active'; // active, inactive
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(referrerUserId, referrerProfileId, referralCode, referredUserId, referredProfileId) {
    const referral = new Referral(referrerUserId, referrerProfileId, referralCode, referredUserId, referredProfileId);
    const db = await getDatabase();
    await db.collection('referrals').insertOne(referral);
    return referral;
  }

  static async findByReferralCode(referralCode) {
    const db = await getDatabase();
    return db.collection('referrals').findOne({ referralCode });
  }

  static async findByReferrerProfileId(referrerProfileId) {
    const db = await getDatabase();
    return db.collection('referrals').find({ referrerProfileId }).toArray();
  }

  static async getReferralStats(profileId) {
    const db = await getDatabase();
    const referrals = await db.collection('referrals').find({ referrerProfileId: profileId }).toArray();
    
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.status === 'active').length;
    const totalCreditsEarned = referrals.reduce((sum, r) => sum + (r.creditsAwarded || 0), 0);

    return {
      totalReferrals,
      activeReferrals,
      totalCreditsEarned,
    };
  }

  // Generate referral code from user and profile IDs
  static generateReferralCode(userId, profileId) {
    const userPart = userId.substring(0, 4).toUpperCase();
    const profilePart = profileId.substring(profileId.length - 4).toUpperCase();
    return `GEETA-${userPart}-${profilePart}`;
  }

  // Find profile by referral code
  static async findProfileByReferralCode(referralCode) {
    const db = await getDatabase();
    
    // Parse the referral code to extract user and profile parts
    const parts = referralCode.split('-');
    if (parts.length !== 3 || parts[0] !== 'GEETA') {
      return null;
    }
    
    const userPart = parts[1];
    const profilePart = parts[2];
    
    // Find the profile that matches this pattern
    const profiles = await db.collection('profiles').find({}).toArray();
    
    for (const profile of profiles) {
      const userId = profile.userId;
      const profileId = profile._id.toString();
      
      // Check if this profile's code matches
      if (userId.substring(0, 4).toUpperCase() === userPart &&
          profileId.substring(profileId.length - 4).toUpperCase() === profilePart) {
        return profile;
      }
    }
    
    return null;
  }
}

export default Referral;

