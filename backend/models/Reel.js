import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class ReelModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('reels');
  }

  /**
   * Create a new reel submission
   */
  static async createReel(reelData) {
    const collection = await this.getCollection();
    
    const reel = {
      userId: reelData.userId,           // Supabase user ID
      profileId: new ObjectId(reelData.profileId), // MongoDB profile ID
      userName: reelData.userName,       // Cached for display
      userEmail: reelData.userEmail,     // Cached for admin search
      reelUrl: reelData.reelUrl,         // The reel link
      platform: reelData.platform,       // youtube, instagram, facebook, tiktok, other
      description: reelData.description || '', // Optional description
      round: reelData.round || 1,        // Round number
      credits: reelData.credits || 100,  // Credits awarded (default 100)
      status: 'pending',                 // pending, approved, rejected
      isVisible: true,                   // Admin can hide/show
      adminNotes: '',                    // Admin feedback
      likes: 0,                          // For future voting
      views: 0,                          // Track views
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(reel);
    return { _id: result.insertedId, ...reel };
  }

  /**
   * Find reel by ID
   */
  static async findReelById(reelId) {
    const collection = await this.getCollection();
    if (!ObjectId.isValid(reelId)) {
      throw new Error('Invalid reel ID format');
    }
    return await collection.findOne({ _id: new ObjectId(reelId) });
  }

  /**
   * Find all reels by user ID
   */
  static async findReelsByUserId(userId) {
    const collection = await this.getCollection();
    return await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Find all reels by profile ID
   */
  static async findReelsByProfileId(profileId) {
    const collection = await this.getCollection();
    return await collection
      .find({ profileId: new ObjectId(profileId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Get all reels with filters and pagination (admin)
   */
  static async getAllReels(filters = {}, options = {}) {
    const collection = await this.getCollection();
    
    const query = {};
    
    // Apply filters
    if (filters.round) {
      query.round = parseInt(filters.round);
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.platform) {
      query.platform = filters.platform;
    }
    
    if (filters.search) {
      query.$or = [
        { userName: { $regex: filters.search, $options: 'i' } },
        { userEmail: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Count total documents
    const total = await collection.countDocuments(query);

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    // Apply sorting
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || -1;
    const sort = { [sortBy]: sortOrder };

    // Fetch reels
    const reels = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      reels,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get approved reels for a specific round (public)
   */
  static async getApprovedReels(round, limit = 50) {
    const collection = await this.getCollection();
    
    const query = {
      status: 'approved',
      isVisible: true,
    };
    
    if (round) {
      query.round = parseInt(round);
    }

    return await collection
      .find(query)
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  /**
   * Update reel status (approve/reject)
   */
  static async updateReelStatus(reelId, status, adminNotes = '') {
    const collection = await this.getCollection();
    
    if (!ObjectId.isValid(reelId)) {
      throw new Error('Invalid reel ID format');
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(reelId) },
      {
        $set: {
          status,
          adminNotes,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Update reel visibility
   */
  static async updateReelVisibility(reelId, isVisible) {
    const collection = await this.getCollection();
    
    if (!ObjectId.isValid(reelId)) {
      throw new Error('Invalid reel ID format');
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(reelId) },
      {
        $set: {
          isVisible,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Increment reel views
   */
  static async incrementViews(reelId) {
    const collection = await this.getCollection();
    
    if (!ObjectId.isValid(reelId)) {
      throw new Error('Invalid reel ID format');
    }

    await collection.updateOne(
      { _id: new ObjectId(reelId) },
      { $inc: { views: 1 } }
    );
  }

  /**
   * Get reel statistics
   */
  static async getStatistics(round = null) {
    const collection = await this.getCollection();
    
    const matchStage = round ? { round: parseInt(round) } : {};

    const stats = await collection.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ]).toArray();

    // Platform breakdown
    const platformStats = await collection.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    return {
      ...(stats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalViews: 0,
        totalLikes: 0,
      }),
      platforms: platformStats.reduce((acc, p) => {
        acc[p._id] = p.count;
        return acc;
      }, {}),
    };
  }

  /**
   * Delete a reel (admin only)
   */
  static async deleteReel(reelId) {
    const collection = await this.getCollection();
    
    if (!ObjectId.isValid(reelId)) {
      throw new Error('Invalid reel ID format');
    }

    const result = await collection.deleteOne({ _id: new ObjectId(reelId) });
    return result.deletedCount > 0;
  }
}
