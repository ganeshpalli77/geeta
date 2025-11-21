// MongoDB Connection and Schema Definitions
// This file provides MongoDB integration for the Geeta Olympiad application

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { DATABASE_CONFIG } from '../config/database';

// MongoDB connection configuration
const MONGODB_URI = DATABASE_CONFIG.MONGODB_URI;
const DB_NAME = DATABASE_CONFIG.DB_NAME;

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Close MongoDB connection
 */
export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}

// ============================================================================
// COLLECTION INTERFACES
// ============================================================================

export interface UserDocument {
  _id?: ObjectId;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDocument {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  prn: string;
  dob: string;
  preferredLanguage: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttemptDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3';
  questions: any[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  createdAt: Date;
}

export interface VideoSubmissionDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  type: 'shloka' | 'reel';
  url: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SloganSubmissionDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  slogan: string;
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImagePartDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  partNumber: number;
  collectedAt: Date;
  createdAt: Date;
}

export interface RoundTaskDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  roundNumber: number;
  taskId: string;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  type: 'quiz' | 'event' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface AchievementDocument {
  _id?: ObjectId;
  profileId: ObjectId;
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  category: 'quiz' | 'events' | 'puzzle' | 'streak';
  unlockedAt: Date;
  createdAt: Date;
}

// ============================================================================
// COLLECTION HELPERS
// ============================================================================

export function getUsersCollection(): Collection<UserDocument> {
  return getDatabase().collection<UserDocument>('users');
}

export function getProfilesCollection(): Collection<ProfileDocument> {
  return getDatabase().collection<ProfileDocument>('profiles');
}

export function getQuizAttemptsCollection(): Collection<QuizAttemptDocument> {
  return getDatabase().collection<QuizAttemptDocument>('quizAttempts');
}

export function getVideoSubmissionsCollection(): Collection<VideoSubmissionDocument> {
  return getDatabase().collection<VideoSubmissionDocument>('videoSubmissions');
}

export function getSloganSubmissionsCollection(): Collection<SloganSubmissionDocument> {
  return getDatabase().collection<SloganSubmissionDocument>('sloganSubmissions');
}

export function getImagePartsCollection(): Collection<ImagePartDocument> {
  return getDatabase().collection<ImagePartDocument>('imageParts');
}

export function getRoundTasksCollection(): Collection<RoundTaskDocument> {
  return getDatabase().collection<RoundTaskDocument>('roundTasks');
}

export function getNotificationsCollection(): Collection<NotificationDocument> {
  return getDatabase().collection<NotificationDocument>('notifications');
}

export function getAchievementsCollection(): Collection<AchievementDocument> {
  return getDatabase().collection<AchievementDocument>('achievements');
}

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

/**
 * Create indexes for better query performance
 */
export async function createIndexes(): Promise<void> {
  const db = getDatabase();

  // Users indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
  await db.collection('users').createIndex({ phone: 1 }, { unique: true, sparse: true });

  // Profiles indexes
  await db.collection('profiles').createIndex({ userId: 1 });
  await db.collection('profiles').createIndex({ prn: 1 }, { unique: true });

  // Quiz attempts indexes
  await db.collection('quizAttempts').createIndex({ profileId: 1 });
  await db.collection('quizAttempts').createIndex({ completedAt: -1 });

  // Video submissions indexes
  await db.collection('videoSubmissions').createIndex({ profileId: 1 });
  await db.collection('videoSubmissions').createIndex({ status: 1 });

  // Slogan submissions indexes
  await db.collection('sloganSubmissions').createIndex({ profileId: 1 });
  await db.collection('sloganSubmissions').createIndex({ status: 1 });

  // Image parts indexes
  await db.collection('imageParts').createIndex({ profileId: 1 });
  await db.collection('imageParts').createIndex({ profileId: 1, partNumber: 1 }, { unique: true });

  // Round tasks indexes
  await db.collection('roundTasks').createIndex({ profileId: 1 });
  await db.collection('roundTasks').createIndex({ profileId: 1, roundNumber: 1 });
  await db.collection('roundTasks').createIndex({ profileId: 1, taskId: 1 }, { unique: true });

  // Notifications indexes
  await db.collection('notifications').createIndex({ profileId: 1 });
  await db.collection('notifications').createIndex({ read: 1 });
  await db.collection('notifications').createIndex({ createdAt: -1 });

  // Achievements indexes
  await db.collection('achievements').createIndex({ profileId: 1 });
  await db.collection('achievements').createIndex({ profileId: 1, achievementId: 1 }, { unique: true });

  console.log('✅ Database indexes created');
}

/**
 * Initialize database with default data
 */
export async function initializeDatabase(): Promise<void> {
  await connectToDatabase();
  await createIndexes();
  console.log('✅ Database initialized');
}
