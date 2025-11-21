import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class SloganModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('slogans');
  }

  /**
   * Create a new slogan submission
   */
  static async createSlogan(sloganData) {
    const collection = await this.getCollection();
    
    const slogan = {
      userId: sloganData.userId,           // Supabase user ID
      profileId: new ObjectId(sloganData.profileId), // MongoDB profile ID
      userName: sloganData.userName,       // Cached for display
      userEmail: sloganData.userEmail,     // Cached for admin search
      slogan: sloganData.slogan,           // The actual slogan text
      round: sloganData.round || 1,        // Round number
      credits: sloganData.credits || 75,   // Credits awarded
      status: 'pending',                   // pending, approved, rejected
      isVisible: true,                     // Admin can hide/show
      adminNotes: '',                      // Admin feedback
      likes: 0,                            // For future voting
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(slogan);
    return { _id: result.insertedId, ...slogan };
  }

  /**
   * Find slogan by ID
   */
  static async findSloganById(sloganId) {
    const collection = await this.getCollection();
    if (!ObjectId.isValid(sloganId)) {
      throw new Error('Invalid slogan ID format');
    }
    return await collection.findOne({ _id: new ObjectId(sloganId) });
  }

  /**
   * Find all slogans by user ID
   */
  static async findSlogansByUserId(userId) {
    const collection = await this.getCollection();
    return await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  /**
   * Find all slogans by profile ID
   */
  static async findSlogansByProfileId(profileId) {
    const collection = await this.getCollection();
    return await collection.find({ 
      profileId: new ObjectId(profileId) 
    }).sort({ createdAt: -1 }).toArray();
  }

  /**
   * Get all slogans with filters and pagination (for admin)
   */
  static async getAllSlogans(filters = {}, options = {}) {
    const collection = await this.getCollection();
    
    const {
      round,
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = -1,
    } = options;

    // Build query
    const query = {};
    
    if (round) {
      query.round = parseInt(round);
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { slogan: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await collection.countDocuments(query);
    
    // Get paginated results
    const skip = (page - 1) * limit;
    const slogans = await collection
      .find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      slogans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }

  /**
   * Get slogan statistics (for admin dashboard)
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
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
        }
      }
    ]).toArray();

    return stats.length > 0 ? stats[0] : {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
  }

  /**
   * Update slogan status (approve/reject)
   */
  static async updateSloganStatus(sloganId, status, adminNotes = '') {
    const collection = await this.getCollection();
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be: pending, approved, or rejected');
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(sloganId) },
      {
        $set: {
          status,
          adminNotes,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Update slogan details
   */
  static async updateSlogan(sloganId, updates) {
    const collection = await this.getCollection();
    
    const allowedUpdates = {
      isVisible: updates.isVisible,
      adminNotes: updates.adminNotes,
      status: updates.status,
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(sloganId) },
      {
        $set: {
          ...allowedUpdates,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  /**
   * Delete a slogan
   */
  static async deleteSlogan(sloganId) {
    const collection = await this.getCollection();
    return await collection.deleteOne({ _id: new ObjectId(sloganId) });
  }

  /**
   * Get approved slogans for a specific round (public view)
   */
  static async getApprovedSlogans(round, limit = 50) {
    const collection = await this.getCollection();
    return await collection
      .find({ 
        round: parseInt(round), 
        status: 'approved',
        isVisible: true,
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  /**
   * Check if user has already submitted a slogan for a round
   */
  static async hasUserSubmittedForRound(userId, profileId, round) {
    const collection = await this.getCollection();
    const count = await collection.countDocuments({
      userId,
      profileId: new ObjectId(profileId),
      round: parseInt(round),
    });
    return count > 0;
  }

  /**
   * Increment likes for a slogan
   */
  static async incrementLikes(sloganId) {
    const collection = await this.getCollection();
    return await collection.findOneAndUpdate(
      { _id: new ObjectId(sloganId) },
      { 
        $inc: { likes: 1 },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
  }
}
