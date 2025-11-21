import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class UserModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('users');
  }

  static async createUser(userData) {
    const collection = await this.getCollection();
    
    // NEW: Both email and phone are now REQUIRED
    if (!userData.email || !userData.phone) {
      throw new Error('Both email and phone are required');
    }

    const user = {
      userId: userData.userId || null, // Store Supabase UUID
      email: userData.email, // Required
      phone: userData.phone, // Required
      emailVerified: userData.emailVerified || false,
      phoneVerified: userData.phoneVerified || false,
      verifiedWith: userData.verifiedWith || null, // 'email' | 'phone' | 'both'
      lastLogin: userData.lastLogin || null,
      registeredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }

  static async findUserByEmail(email) {
    const collection = await this.getCollection();
    return await collection.findOne({ email });
  }

  static async findUserByPhone(phone) {
    const collection = await this.getCollection();
    return await collection.findOne({ phone });
  }

  static async findUserById(userId) {
    const collection = await this.getCollection();
    // Try to find by _id first (for MongoDB ObjectId)
    // If that fails, try to find by a custom userId field (for Supabase UUID)
    try {
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      if (user) return user;
    } catch (e) {
      // Not a valid ObjectId, might be a UUID string
    }
    // Try finding by userId field (for Supabase UUIDs stored as string)
    return await collection.findOne({ userId: userId });
  }

  static async updateUser(userId, updates) {
    const collection = await this.getCollection();
    // Try ObjectId first, then UUID string
    let query;
    try {
      query = { _id: new ObjectId(userId) };
    } catch (e) {
      query = { userId: userId };
    }
    
    const result = await collection.findOneAndUpdate(
      query,
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

  // NEW: Find user by email OR phone
  static async findUserByEmailOrPhone(email, phone) {
    const collection = await this.getCollection();
    
    // Build query conditions only for non-empty values
    const orConditions = [];
    if (email) {
      orConditions.push({ email: email });
    }
    if (phone) {
      orConditions.push({ phone: phone });
    }
    
    // If no conditions, return null
    if (orConditions.length === 0) {
      return null;
    }
    
    return await collection.findOne({
      $or: orConditions
    });
  }

  // NEW: Find or create user with BOTH email and phone
  static async findOrCreateUser(identifier) {
    const collection = await this.getCollection();
    
    // Both email and phone must be provided
    if (!identifier.email || !identifier.phone) {
      throw new Error('Both email and phone are required');
    }

    // Check if user exists with either email OR phone
    let user = await this.findUserByEmailOrPhone(identifier.email, identifier.phone);

    // If user doesn't exist, create new user
    if (!user) {
      user = await this.createUser(identifier);
    } else {
      // Update existing user with new information if needed
      const updates = {};
      if (user.email !== identifier.email) updates.email = identifier.email;
      if (user.phone !== identifier.phone) updates.phone = identifier.phone;
      if (identifier.userId && user.userId !== identifier.userId) {
        updates.userId = identifier.userId;
      }
      
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        await collection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        user = { ...user, ...updates };
      }
    }

    return user;
  }

  // NEW: Update verification status
  static async updateVerification(userId, verificationType) {
    const collection = await this.getCollection();
    let query;
    try {
      query = { _id: new ObjectId(userId) };
    } catch (e) {
      query = { userId: userId };
    }

    const updates = {
      updatedAt: new Date(),
      lastLogin: new Date()
    };

    if (verificationType === 'email') {
      updates.emailVerified = true;
      updates.verifiedWith = 'email';
    } else if (verificationType === 'phone') {
      updates.phoneVerified = true;
      updates.verifiedWith = 'phone';
    }

    const result = await collection.findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: 'after' }
    );

    return result;
  }
}
