import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class UserModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('users');
  }

  static async createUser(userData) {
    const collection = await this.getCollection();
    const user = {
      userId: userData.userId || null, // Store Supabase UUID
      email: userData.email || null,
      phone: userData.phone || null,
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

  static async findOrCreateUser(identifier) {
    const collection = await this.getCollection();
    
    // Check if user exists by userId (Supabase UUID), email, or phone
    let user = null;
    if (identifier.userId) {
      user = await this.findUserById(identifier.userId);
    }
    if (!user && identifier.email) {
      user = await this.findUserByEmail(identifier.email);
    }
    if (!user && identifier.phone) {
      user = await this.findUserByPhone(identifier.phone);
    }

    // If user doesn't exist, create new user
    if (!user) {
      user = await this.createUser(identifier);
    }

    return user;
  }
}
