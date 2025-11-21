import express from 'express';
import { getDatabase } from '../config/database.js';
import { ObjectId } from 'mongodb';
import { ProfileModel } from '../models/Profile.js';

const router = express.Router();

/**
 * GET /api/referrals/code/:profileId
 * Get referral code for a profile
 */
router.get('/code/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    
    const db = await getDatabase();
    const profile = await db.collection('profiles').findOne({ _id: new ObjectId(profileId) });
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    
    res.json({
      success: true,
      referralCode: profile.referralCode,
      profileId: profile._id,
      name: profile.name,
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/referrals/validate
 * Validate a referral code
 */
router.post('/validate', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({ success: false, error: 'Referral code is required' });
    }
    
    const db = await getDatabase();
    const profile = await db.collection('profiles').findOne({ referralCode: referralCode.toUpperCase() });
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Invalid referral code' });
    }
    
    res.json({
      success: true,
      valid: true,
      referrerName: profile.name,
      referrerProfileId: profile._id,
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/referrals/apply
 * Apply referral code when creating a new profile
 */
router.post('/apply', async (req, res) => {
  try {
    const { referralCode, newProfileId, newUserId } = req.body;
    
    if (!referralCode || !newProfileId || !newUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Referral code, new profile ID, and new user ID are required' 
      });
    }
    
    const db = await getDatabase();
    
    // Find the referrer profile
    const referrerProfile = await db.collection('profiles').findOne({ 
      referralCode: referralCode.toUpperCase() 
    });
    
    if (!referrerProfile) {
      return res.status(404).json({ success: false, error: 'Invalid referral code' });
    }
    
    // Check if this profile already used a referral code
    const existingReferral = await db.collection('referrals score').findOne({
      referredProfileId: new ObjectId(newProfileId)
    });
    
    if (existingReferral) {
      return res.status(400).json({ 
        success: false, 
        error: 'This profile has already used a referral code' 
      });
    }
    
    // Create referral record in 'referrals score' collection
    const referralRecord = {
      referrerUserId: referrerProfile.userId,
      referrerProfileId: referrerProfile._id,
      referralCode: referralCode.toUpperCase(),
      referredUserId: newUserId,
      referredProfileId: new ObjectId(newProfileId),
      referrerCredits: 100, // Credits for referrer
      referredCredits: 50,  // Credits for new user
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection('referrals score').insertOne(referralRecord);
    
    // Award 100 credits to referrer
    await ProfileModel.addCredits(referrerProfile._id.toString(), 100, 'referrals');
    
    // Award 50 credits to new profile
    await ProfileModel.addCredits(newProfileId, 50, 'referrals');
    
    res.json({
      success: true,
      message: 'Referral applied successfully!',
      referrerCredits: 100,
      yourCredits: 50,
    });
  } catch (error) {
    console.error('Error applying referral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/referrals/stats/:profileId
 * Get referral statistics for a profile
 */
router.get('/stats/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    
    const db = await getDatabase();
    const referrals = await db.collection('referrals score')
      .find({ referrerProfileId: new ObjectId(profileId) })
      .toArray();
    
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.status === 'active').length;
    const totalCreditsEarned = referrals.reduce((sum, r) => sum + (r.referrerCredits || 0), 0);
    
    // Get referred users' names
    const referredProfiles = await Promise.all(
      referrals.map(async (ref) => {
        const profile = await db.collection('profiles').findOne({ _id: ref.referredProfileId });
        return {
          name: profile?.name || 'Unknown',
          date: ref.createdAt,
          credits: ref.referrerCredits,
          status: ref.status,
        };
      })
    );
    
    res.json({
      success: true,
      stats: {
        totalReferrals,
        activeReferrals,
        totalCreditsEarned,
        referrals: referredProfiles,
      },
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/referrals/leaderboard
 * Get top referrers leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const db = await getDatabase();
    
    // Aggregate referral counts per profile
    const leaderboard = await db.collection('referrals score').aggregate([
      {
        $group: {
          _id: '$referrerProfileId',
          totalReferrals: { $sum: 1 },
          totalCredits: { $sum: '$referrerCredits' },
        }
      },
      { $sort: { totalReferrals: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    // Get profile details
    const leaderboardWithNames = await Promise.all(
      leaderboard.map(async (entry) => {
        const profile = await db.collection('profiles').findOne({ _id: entry._id });
        return {
          profileId: entry._id,
          name: profile?.name || 'Unknown',
          totalReferrals: entry.totalReferrals,
          totalCredits: entry.totalCredits,
        };
      })
    );
    
    res.json({
      success: true,
      leaderboard: leaderboardWithNames,
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
