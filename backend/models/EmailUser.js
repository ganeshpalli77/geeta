import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class EmailUserModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('email_users');
  }

  static async createEmailUser(email) {
    const collection = await this.getCollection();
    const user = {
      email: email,
      registeredAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    };

    const result = await collection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    return await collection.findOne({ email });
  }

  static async findById(userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(userId) });
  }

  static async updateEmailUser(userId, updates) {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
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

  static async updateLastLogin(userId) {
    const collection = await this.getCollection();
    return await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );
  }

  static async findOrCreateEmailUser(email) {
    // Check if user exists
    let user = await this.findByEmail(email);

    // If user doesn't exist, create new user
    if (!user) {
      user = await this.createEmailUser(email);
    }

    return user;
  }

  static async getAllEmailUsers(limit = 100, skip = 0) {
    const collection = await this.getCollection();
    return await collection
      .find({})
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async countEmailUsers() {
    const collection = await this.getCollection();
    return await collection.countDocuments();
  }
}
