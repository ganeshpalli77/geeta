// MongoDB API Proxy
// This file provides MongoDB-backed implementations of the API functions

import { ObjectId } from 'mongodb';
import {
  getRoundTasksCollection,
  getQuizAttemptsCollection,
  getVideoSubmissionsCollection,
  getSloganSubmissionsCollection,
  getImagePartsCollection,
  getProfilesCollection,
  getUsersCollection,
  type RoundTaskDocument,
} from './mongodb';
import * as roundTasksService from '../services/roundTasksService';
import type { RoundTask } from './apiProxy';

// ============================================================================
// ROUNDS/TASKS API - MongoDB Implementation
// ============================================================================

export const mongoRoundsAPI = {
  /**
   * Get tasks for a specific round from MongoDB
   */
  getRoundTasks: async (roundNumber: number, profileId: string): Promise<RoundTask[]> => {
    try {
      return await roundTasksService.getRoundTasks(roundNumber, profileId);
    } catch (error) {
      console.error('Error fetching round tasks from MongoDB:', error);
      throw error;
    }
  },

  /**
   * Update task status in MongoDB
   */
  updateTaskStatus: async (
    taskId: string,
    status: RoundTask['status'],
    profileId: string
  ): Promise<void> => {
    try {
      await roundTasksService.updateTaskStatus(profileId, taskId, status);
    } catch (error) {
      console.error('Error updating task status in MongoDB:', error);
      throw error;
    }
  },

  /**
   * Get all tasks for a profile
   */
  getAllTasks: async (profileId: string): Promise<RoundTask[]> => {
    try {
      return await roundTasksService.getAllTasksForProfile(profileId);
    } catch (error) {
      console.error('Error fetching all tasks from MongoDB:', error);
      throw error;
    }
  },

  /**
   * Get task statistics
   */
  getTaskStats: async (profileId: string) => {
    try {
      return await roundTasksService.getTaskStats(profileId);
    } catch (error) {
      console.error('Error fetching task stats from MongoDB:', error);
      throw error;
    }
  },

  /**
   * Initialize tasks for a new profile
   */
  initializeTasks: async (profileId: string): Promise<void> => {
    try {
      await roundTasksService.initializeTasksForProfile(profileId);
    } catch (error) {
      console.error('Error initializing tasks in MongoDB:', error);
      throw error;
    }
  },

  /**
   * Unlock next round
   */
  unlockNextRound: async (profileId: string, currentRound: number): Promise<boolean> => {
    try {
      return await roundTasksService.unlockNextRound(profileId, currentRound);
    } catch (error) {
      console.error('Error unlocking next round in MongoDB:', error);
      throw error;
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if MongoDB is connected and available
 */
export async function isMongoDBAvailable(): Promise<boolean> {
  try {
    const collection = getRoundTasksCollection();
    await collection.findOne({});
    return true;
  } catch (error) {
    console.warn('MongoDB not available, falling back to mock data');
    return false;
  }
}

/**
 * Convert MongoDB ObjectId to string
 */
export function objectIdToString(id: ObjectId | string): string {
  return typeof id === 'string' ? id : id.toString();
}

/**
 * Convert string to MongoDB ObjectId
 */
export function stringToObjectId(id: string): ObjectId {
  return new ObjectId(id);
}
