// MongoDB Service for Round Tasks
// This service handles all database operations for round tasks

import { ObjectId } from 'mongodb';
import {
  getRoundTasksCollection,
  getProfilesCollection,
  type RoundTaskDocument,
} from '../utils/mongodb';

export interface RoundTask {
  id: string;
  roundNumber: number;
  title: string;
  description: string;
  type: 'quiz' | 'video' | 'slogan' | 'essay' | 'creative' | 'puzzle';
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  points: number;
  dueDate?: string;
  unlockDate?: string;
}

// Default task definitions for each round
const ROUND_TASK_DEFINITIONS: Record<number, Omit<RoundTask, 'id' | 'status'>[]> = {
  1: [
    {
      roundNumber: 1,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 1,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 1,
      title: 'Create a Slogan',
      description: 'Create an inspiring slogan based on Bhagavad Geeta',
      type: 'slogan',
      points: 75,
    },
    {
      roundNumber: 1,
      title: 'Create a Reel',
      description: 'Create a short video reel sharing your understanding',
      type: 'video',
      points: 100,
    },
  ],
  2: [
    {
      roundNumber: 2,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 2,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 2,
      title: 'Essay Writing',
      description: 'Write an essay on your favorite verse',
      type: 'essay',
      points: 150,
    },
  ],
  3: [
    {
      roundNumber: 3,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 3,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 3,
      title: 'Creative Task',
      description: 'Express your creativity with a Geeta-inspired project',
      type: 'creative',
      points: 125,
    },
  ],
  4: [
    {
      roundNumber: 4,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 4,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 4,
      title: 'Video Submission',
      description: 'Share your understanding through a video',
      type: 'video',
      points: 100,
    },
  ],
  5: [
    {
      roundNumber: 5,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 5,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 5,
      title: 'Slogan Creation',
      description: 'Create a meaningful slogan inspired by the Geeta',
      type: 'slogan',
      points: 75,
    },
  ],
  6: [
    {
      roundNumber: 6,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 6,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 6,
      title: 'Essay Writing',
      description: 'Write a reflective essay on Geeta teachings',
      type: 'essay',
      points: 150,
    },
  ],
  7: [
    {
      roundNumber: 7,
      title: 'Daily Quiz',
      description: 'Complete today\'s daily quiz challenge',
      type: 'quiz',
      points: 100,
    },
    {
      roundNumber: 7,
      title: 'Collect Today\'s Puzzle Piece',
      description: 'Collect your daily puzzle piece to complete the image',
      type: 'puzzle',
      points: 50,
    },
    {
      roundNumber: 7,
      title: 'Final Creative Project',
      description: 'Complete your final creative project showcasing your journey',
      type: 'creative',
      points: 200,
    },
  ],
};

/**
 * Get tasks for a specific round and profile
 */
export async function getRoundTasks(
  roundNumber: number,
  profileId: string
): Promise<RoundTask[]> {
  const taskDefinitions = ROUND_TASK_DEFINITIONS[roundNumber] || [];
  const collection = getRoundTasksCollection();

  // Get task statuses from database
  const taskStatuses = await collection
    .find({
      profileId: new ObjectId(profileId),
      roundNumber,
    })
    .toArray();

  // Merge definitions with statuses
  return taskDefinitions.map((def, index) => {
    const taskId = `r${roundNumber}-t${index + 1}`;
    const status = taskStatuses.find((s) => s.taskId === taskId);

    return {
      id: taskId,
      ...def,
      status: status?.status || 'unlocked',
    };
  });
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  profileId: string,
  taskId: string,
  status: RoundTask['status']
): Promise<void> {
  const collection = getRoundTasksCollection();
  const roundNumber = parseInt(taskId.split('-')[0].substring(1));

  const now = new Date();
  const update: Partial<RoundTaskDocument> = {
    status,
    updatedAt: now,
  };

  if (status === 'in-progress' && !await collection.findOne({ profileId: new ObjectId(profileId), taskId })) {
    update.startedAt = now;
  }

  if (status === 'completed') {
    update.completedAt = now;
  }

  await collection.updateOne(
    {
      profileId: new ObjectId(profileId),
      taskId,
    },
    {
      $set: update,
      $setOnInsert: {
        profileId: new ObjectId(profileId),
        roundNumber,
        taskId,
        createdAt: now,
      },
    },
    { upsert: true }
  );
}

/**
 * Get all tasks for a profile across all rounds
 */
export async function getAllTasksForProfile(profileId: string): Promise<RoundTask[]> {
  const allTasks: RoundTask[] = [];

  for (let roundNumber = 1; roundNumber <= 7; roundNumber++) {
    const tasks = await getRoundTasks(roundNumber, profileId);
    allTasks.push(...tasks);
  }

  return allTasks;
}

/**
 * Get task completion statistics for a profile
 */
export async function getTaskStats(profileId: string): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  locked: number;
  unlocked: number;
}> {
  const collection = getRoundTasksCollection();

  const tasks = await collection
    .find({ profileId: new ObjectId(profileId) })
    .toArray();

  // Count total possible tasks
  const totalTasks = Object.values(ROUND_TASK_DEFINITIONS).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const locked = tasks.filter((t) => t.status === 'locked').length;
  const unlocked = totalTasks - completed - inProgress - locked;

  return {
    total: totalTasks,
    completed,
    inProgress,
    locked,
    unlocked,
  };
}

/**
 * Initialize tasks for a new profile
 */
export async function initializeTasksForProfile(profileId: string): Promise<void> {
  const collection = getRoundTasksCollection();

  // Check if tasks already exist
  const existingTasks = await collection.countDocuments({
    profileId: new ObjectId(profileId),
  });

  if (existingTasks > 0) {
    return; // Tasks already initialized
  }

  // Create initial task records (all unlocked for Round 1)
  const now = new Date();
  const initialTasks: Omit<RoundTaskDocument, '_id'>[] = [];

  // Initialize Round 1 tasks as unlocked
  ROUND_TASK_DEFINITIONS[1].forEach((def, index) => {
    initialTasks.push({
      profileId: new ObjectId(profileId),
      roundNumber: 1,
      taskId: `r1-t${index + 1}`,
      status: 'unlocked',
      createdAt: now,
      updatedAt: now,
    });
  });

  // Initialize other rounds as locked
  for (let roundNumber = 2; roundNumber <= 7; roundNumber++) {
    ROUND_TASK_DEFINITIONS[roundNumber]?.forEach((def, index) => {
      initialTasks.push({
        profileId: new ObjectId(profileId),
        roundNumber,
        taskId: `r${roundNumber}-t${index + 1}`,
        status: 'locked',
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  if (initialTasks.length > 0) {
    await collection.insertMany(initialTasks);
  }
}

/**
 * Unlock next round for a profile
 */
export async function unlockNextRound(profileId: string, currentRound: number): Promise<boolean> {
  const nextRound = currentRound + 1;
  if (nextRound > 7) {
    return false; // No more rounds
  }

  const collection = getRoundTasksCollection();

  await collection.updateMany(
    {
      profileId: new ObjectId(profileId),
      roundNumber: nextRound,
    },
    {
      $set: {
        status: 'unlocked',
        updatedAt: new Date(),
      },
    }
  );

  return true;
}
