import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class PhoneUserModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('phone_users');
  }

  static async createPhoneUser(phone) {
    const collection = await this.getCollection();
    const user = {
      phone: phone,
      registeredAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
    };

    const result = await collection.insertOne(user);
    return { _id: result.insertedId, ...user };
  }

  static async findByPhone(phone) {
    const collection = await this.getCollection();
    return await collection.findOne({ phone });
  }

  static async findById(userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(userId) });
  }

  static async updatePhoneUser(userId, updates) {
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

  static async findOrCreatePhoneUser(phone) {
    // Check if user exists
    let user = await this.findByPhone(phone);

    // If user doesn't exist, create new user
    if (!user) {
      user = await this.createPhoneUser(phone);
    }

    return user;
  }

  static async getAllPhoneUsers(limit = 100, skip = 0) {
    const collection = await this.getCollection();
    return await collection
      .find({})
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async countPhoneUsers() {
    const collection = await this.getCollection();
    return await collection.countDocuments();
  }
}
