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
    const { ObjectId } = await import('mongodb');
    
    // Query the 'referrals score' collection for this profile's referrals
    const referrals = await db.collection('referrals score').find({ 
      referrerProfileId: new ObjectId(profileId) 
    }).toArray();
    
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.status === 'active').length;
    
    // Calculate total credits earned (100 per referral for the referrer)
    const totalCreditsEarned = referrals.reduce((sum, r) => sum + (r.referrerCredits || 100), 0);

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
    
    // Validate referral code format
    const parts = referralCode.split('-');
    if (parts.length !== 3 || parts[0] !== 'GEETA') {
      console.log('❌ Invalid referral code format:', referralCode);
      return null;
    }
    
    // Query the database directly using the referralCode field
    const profile = await db.collection('profiles').findOne({ 
      referralCode: referralCode.toUpperCase() 
    });
    
    if (profile) {
      console.log('✅ Found profile for referral code:', referralCode, 'Profile ID:', profile._id);
    } else {
      console.log('❌ No profile found for referral code:', referralCode);
    }
    
    return profile;
  }
}

export default Referral;

