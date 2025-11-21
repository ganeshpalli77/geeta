import express from 'express';
import { ProfileModel } from '../models/Profile.js';
import Referral from '../models/Referral.js';

const router = express.Router();

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const { userId, name, prn, dob, preferredLanguage, category, referralCode } = req.body;

    console.log('Create profile request:', { userId, name, prn, dob, preferredLanguage, category, referralCode });

    if (!userId || !name || !prn || !dob || !preferredLanguage) {
      console.error('Missing required fields:', { userId: !!userId, name: !!name, prn: !!prn, dob: !!dob, preferredLanguage: !!preferredLanguage });
      return res.status(400).json({ 
        error: 'Missing required fields: userId, name, prn, dob, preferredLanguage' 
      });
    }

    // Check if profile with same PRN already exists for this user
    // Only check if PRN is not empty and not a generic value
    const existingProfiles = await ProfileModel.findProfilesByUserId(userId);
    console.log('Existing profiles for user:', existingProfiles.length);
    
    // Only validate duplicate PRN if it's a meaningful value (not just numbers like "123")
    if (prn && prn.length > 3) {
      const duplicatePRN = existingProfiles.find(p => p.prn === prn);
      if (duplicatePRN) {
        console.log('Duplicate PRN found:', prn);
        return res.status(400).json({
          error: 'A profile with this PRN already exists for this user'
        });
      }
    }

    // Validate referral code if provided
    let referrerProfile = null;
    if (referralCode && referralCode.trim()) {
      console.log('🔍 Validating referral code:', referralCode.trim().toUpperCase());
      referrerProfile = await Referral.findProfileByReferralCode(referralCode.trim());
      if (!referrerProfile) {
        console.log('❌ Invalid referral code:', referralCode);
        return res.status(400).json({
          error: 'Invalid referral code'
        });
      }
      console.log('✅ Valid referral code from profile:', referrerProfile._id, 'Name:', referrerProfile.name);
    } else {
      console.log('ℹ️ No referral code provided');
    }

    const profile = await ProfileModel.createProfile({
      userId,
      name,
      prn,
      dob,
      preferredLanguage,
      category,
    });

    console.log('Profile created in DB:', profile);
    console.log('Profile _id:', profile._id);
    console.log('Profile _id type:', typeof profile._id);

    // Initialize user credits entry for new profile
    try {
      console.log('💳 Initializing user credits for new profile...');
      const UserCredits = (await import('../models/UserCredits.js')).default;
      
      // Create user credits entry with 0 credits initially
      await UserCredits.getOrCreateUserCredits(userId, profile._id.toString());
      console.log('✅ User credits entry created');
    } catch (creditsError) {
      console.error('❌ Error initializing user credits:', creditsError);
      // Continue anyway - don't fail profile creation
    }

    // If referral code was used, create referral record and award credits
    let referralCreated = false;
    if (referrerProfile) {
      try {
        console.log('🎁 Processing referral rewards...');
        const { getDatabase } = await import('../config/database.js');
        const db = await getDatabase();
        
        // Create referral record in 'referrals score' collection
        const referralRecord = {
          referrerUserId: referrerProfile.userId,
          referrerProfileId: referrerProfile._id,
          referralCode: referralCode.trim().toUpperCase(),
          referredUserId: userId,
          referredProfileId: profile._id,
          referrerCredits: 100, // Credits for referrer
          referredCredits: 50,  // Credits for new user
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        console.log('💾 Inserting referral record:', referralRecord);
        const insertResult = await db.collection('referrals score').insertOne(referralRecord);
        console.log('✅ Referral record inserted with ID:', insertResult.insertedId);
        
        // Award 100 credits to referrer
        console.log('💰 Awarding 100 credits to referrer:', referrerProfile._id.toString());
        await ProfileModel.addCredits(referrerProfile._id.toString(), 100, 'referrals');
        console.log('✅ Referrer credits awarded');
        
        // Award 50 credits to new profile
        console.log('💰 Awarding 50 credits to new user:', profile._id.toString());
        await ProfileModel.addCredits(profile._id.toString(), 50, 'referrals');
        console.log('✅ New user credits awarded');
        
        referralCreated = true;
        console.log('🎉 Referral record created and credits awarded successfully!');
      } catch (referralError) {
        console.error('❌ Error creating referral record:', referralError);
        console.error('❌ Error stack:', referralError.stack);
        // Continue anyway - don't fail profile creation due to referral issues
      }
    }

    // Get updated profile with credits
    const updatedProfile = await ProfileModel.findProfileById(profile._id.toString());
    
    res.status(201).json({
      success: true,
      profile: {
        _id: profile._id.toString(), // Convert ObjectId to string
        userId: profile.userId,
        name: profile.name,
        prn: profile.prn,
        dob: profile.dob,
        preferredLanguage: profile.preferredLanguage,
        category: profile.category,
        referralCode: profile.referralCode,
        isActive: profile.isActive,
        credits: updatedProfile?.credits || profile.credits, // Include updated credits
        createdAt: profile.createdAt,
      },
      referralApplied: referralCreated,
      creditsAwarded: referralCreated ? 50 : 0,
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ 
      error: 'Failed to create profile',
      message: error.message 
    });
  }
});

// Get profile by ID
router.get('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await ProfileModel.findProfileById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      profile: {
        _id: profile._id.toString(),
        userId: profile.userId,
        name: profile.name,
        prn: profile.prn,
        dob: profile.dob,
        preferredLanguage: profile.preferredLanguage,
        category: profile.category,
        referralCode: profile.referralCode,
        isActive: profile.isActive,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile',
      message: error.message 
    });
  }
});

// Get all profiles for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📋 Fetching profiles for userId:', userId);
    
    const profiles = await ProfileModel.findProfilesByUserId(userId);
    console.log('📋 Found profiles:', profiles.length);
    console.log('📋 Profile details:', profiles.map(p => ({ id: p._id.toString(), name: p.name, userId: p.userId })));

    // Serialize profiles to ensure _id is a string and include credits
    const serializedProfiles = profiles.map(profile => ({
      _id: profile._id.toString(),
      userId: profile.userId,
      name: profile.name,
      prn: profile.prn,
      dob: profile.dob,
      preferredLanguage: profile.preferredLanguage,
      category: profile.category,
      referralCode: profile.referralCode,
      isActive: profile.isActive,
      credits: profile.credits || { total: 0, available: 0, spent: 0, earned: {} }, // ✅ Include credits
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }));

    console.log('📋 Returning serialized profiles:', serializedProfiles.length);

    res.status(200).json({
      success: true,
      profiles: serializedProfiles,
    });
  } catch (error) {
    console.error('❌ Get profiles error:', error);
    res.status(500).json({ 
      error: 'Failed to get profiles',
      message: error.message 
    });
  }
});

// Update profile
router.put('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const updates = req.body;

    const profile = await ProfileModel.updateProfile(profileId, updates);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

// Delete profile
router.delete('/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const result = await ProfileModel.deleteProfile(profileId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ 
      error: 'Failed to delete profile',
      message: error.message 
    });
  }
});

// Set active profile for a user
router.put('/:profileId/set-active', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const profile = await ProfileModel.setActiveProfile(userId, profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found or does not belong to user' });
    }

    res.status(200).json({
      success: true,
      profile,
      message: 'Active profile updated successfully',
    });
  } catch (error) {
    console.error('Set active profile error:', error);
    res.status(500).json({ 
      error: 'Failed to set active profile',
      message: error.message 
    });
  }
});

// Get active profile for a user
router.get('/user/:userId/active', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await ProfileModel.getActiveProfile(userId);

    if (!profile) {
      return res.status(404).json({ 
        error: 'No active profile found',
        message: 'User has no active profile set'
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get active profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get active profile',
      message: error.message 
    });
  }
});

// Count profiles for a user
router.get('/user/:userId/count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await ProfileModel.countProfilesByUserId(userId);

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Count profiles error:', error);
    res.status(500).json({ 
      error: 'Failed to count profiles',
      message: error.message 
    });
  }
});

// Get referral stats for a profile
router.get('/:profileId/referrals', async (req, res) => {
  try {
    const { profileId } = req.params;
    
    // Validate profileId
    if (!profileId || profileId === 'undefined' || profileId === 'null') {
      return res.status(400).json({ 
        error: 'Invalid profile ID',
        message: 'Profile ID is required and must be valid'
      });
    }

    const stats = await Referral.getReferralStats(profileId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({ 
      error: 'Failed to get referral stats',
      message: error.message 
    });
  }
});

// Generate referral code for existing profiles (migration helper)
router.post('/:profileId/generate-referral-code', async (req, res) => {
  try {
    const { profileId } = req.params;
    const profile = await ProfileModel.findProfileById(profileId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if profile already has a referral code
    if (profile.referralCode) {
      return res.json({ 
        success: true, 
        referralCode: profile.referralCode,
        message: 'Profile already has a referral code' 
      });
    }

    // Generate referral code
    const userPart = profile.userId.substring(0, 4).toUpperCase();
    const profileIdStr = profile._id.toString();
    const profilePart = profileIdStr.substring(profileIdStr.length - 4).toUpperCase();
    const referralCode = `GEETA-${userPart}-${profilePart}`;

    // Update profile with referral code
    await ProfileModel.updateProfile(profileId, { referralCode });

    res.json({
      success: true,
      referralCode,
      message: 'Referral code generated successfully'
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    res.status(500).json({ 
      error: 'Failed to generate referral code',
      message: error.message 
    });
  }
});

export default router;
