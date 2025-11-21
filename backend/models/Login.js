import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

export class LoginModel {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('logins');
  }

  static async createLogin(loginData) {
    const collection = await this.getCollection();
    const login = {
      userId: loginData.userId ? new ObjectId(loginData.userId) : null,
      email: loginData.email || null,
      phone: loginData.phone || null,
      loginMethod: loginData.loginMethod, // 'email' or 'phone'
      ipAddress: loginData.ipAddress || null,
      userAgent: loginData.userAgent || null,
      loginAt: new Date(),
      success: loginData.success !== false, // default true
    };

    const result = await collection.insertOne(login);
    return { _id: result.insertedId, ...login };
  }

  static async getLoginsByUser(userId) {
    const collection = await this.getCollection();
    return await collection
      .find({ userId: new ObjectId(userId) })
      .sort({ loginAt: -1 })
      .limit(50)
      .toArray();
  }

  static async getLoginsByEmail(email) {
    const collection = await this.getCollection();
    return await collection
      .find({ email })
      .sort({ loginAt: -1 })
      .limit(50)
      .toArray();
  }

  static async getLoginsByPhone(phone) {
    const collection = await this.getCollection();
    return await collection
      .find({ phone })
      .sort({ loginAt: -1 })
      .limit(50)
      .toArray();
  }

  static async getRecentLogins(limit = 100) {
    const collection = await this.getCollection();
    return await collection
      .find({})
      .sort({ loginAt: -1 })
      .limit(limit)
      .toArray();
  }

  static async getFailedLogins(limit = 50) {
    const collection = await this.getCollection();
    return await collection
      .find({ success: false })
      .sort({ loginAt: -1 })
      .limit(limit)
      .toArray();
  }
}
