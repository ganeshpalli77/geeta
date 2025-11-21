// API Proxy - Single interface for all backend calls
// Switch between mock and Supabase auth by changing AUTH_MODE in utils/config.ts

import { mockDb } from './mockDb';
import { authHelpers } from './supabaseClient';
import { AUTH_MODE, API_BASE_URL, isMockMode, isSupabaseMode, ADMIN_CREDENTIALS } from './config';

// Derived configuration flags
const USE_MOCK_API = isMockMode();
const USE_SUPABASE_AUTH = isSupabaseMode();
const USE_BACKEND_API = AUTH_MODE === 'nodejs';

// Types
export interface User {
  _id: string;
  email?: string;
  phone?: string;
  profiles: string[]; // Array of profile IDs
  supabaseId?: string; // Supabase Auth user ID
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  _id: string;
  userId: string;
  name: string;
  prn: string;
  dob: string;
  preferredLanguage: string;
  category?: string; // Can be any string (school name, age group, etc.)
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  _id: string;
  profileId: string;
  type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3';
  questions: any[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}

export interface VideoSubmission {
  _id: string;
  profileId: string;
  type: 'shloka' | 'reel';
  url: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SloganSubmission {
  _id: string;
  profileId: string;
  slogan: string;
  status: 'pending' | 'approved' | 'rejected';
  creditScore?: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ImagePart {
  _id: string;
  profileId: string;
  partNumber: number;
  collectedAt: string;
}

export interface LeaderboardEntry {
  profileId: string;
  name: string;
  category: string;
  totalScore: number;
  quizScore: number;
  eventScore: number;
  weeklyScore: number;
  rank: number;
}

// Helper function to make real API calls
async function apiCall<T>(endpoint: string, method: string = 'GET', data?: any, language?: string): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add language parameter to all requests
  if (language) {
    url.searchParams.append('language', language);
  }
  
  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  // Send OTP (supports both mock and Supabase)
  sendOTP: async (email?: string, phone?: string): Promise<{ success: boolean }> => {
    if (USE_MOCK_API) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
    
    if (USE_SUPABASE_AUTH) {
      try {
        if (phone) {
          await authHelpers.sendPhoneOTP(phone);
        } else if (email) {
          await authHelpers.sendEmailOTP(email);
        } else {
          throw new Error('Email or phone required');
        }
        return { success: true };
      } catch (error: any) {
        console.error('Supabase OTP send error:', error);
        throw error;
      }
    }
    
    return apiCall('/auth/send-otp', 'POST', { email, phone });
  },

  // Verify OTP and login/register
  verifyOTP: async (
    identifier: string,
    otp: string,
    type: 'email' | 'phone'
  ): Promise<{ success: boolean; user: User; isNewUser: boolean }> => {
    if (USE_MOCK_API) {
      // Mock OTP check
      if (otp !== '1234') {
        throw new Error('Invalid OTP');
      }

      // Check if user exists
      const filter = type === 'email' ? { email: identifier } : { phone: identifier };
      let user = mockDb.findOne('users', filter) as User | null;
      const isNewUser = !user;

      if (!user) {
        // Create new user
        const userData = type === 'email' 
          ? { email: identifier, profiles: [] }
          : { phone: identifier, profiles: [] };
        user = mockDb.insertOne('users', userData) as User;
      }

      return { success: true, user, isNewUser };
    }
    
    if (USE_SUPABASE_AUTH) {
      try {
        const { session, user: supabaseUser } = await authHelpers.verifyOTP(identifier, otp, type);
        
        if (!session || !supabaseUser) {
          throw new Error('Invalid OTP');
        }

        // Check if user exists in our database
        const filter = type === 'email' ? { email: identifier } : { phone: identifier };
        let user = mockDb.findOne('users', filter) as User | null;
        const isNewUser = !user;

        if (!user) {
          // Create new user in our database
          const userData = type === 'email' 
            ? { email: identifier, profiles: [], supabaseId: supabaseUser.id }
            : { phone: identifier, profiles: [], supabaseId: supabaseUser.id };
          user = mockDb.insertOne('users', userData) as User;
        }

        return { success: true, user, isNewUser };
      } catch (error: any) {
        console.error('Supabase OTP verification error:', error);
        throw error;
      }
    }
    
    return apiCall('/auth/verify-otp', 'POST', { identifier, otp, type });
  },

  // Admin login
  adminLogin: async (username: string, password: string): Promise<{ success: boolean }> => {
    // When using backend API, call the backend
    if (USE_BACKEND_API) {
      try {
        const response = await apiCall<{ success: boolean; message: string; admin?: any }>('/auth/admin-login', 'POST', {
          username,
          password,
        });
        return { success: response.success };
      } catch (error) {
        console.error('Backend admin login error:', error);
        throw new Error('Invalid credentials');
      }
    }
    
    // Fallback to local credentials check for mock/supabase mode
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return { success: true };
    }
    throw new Error('Invalid credentials');
  },

  // Sign out (Supabase)
  signOut: async (): Promise<void> => {
    if (USE_SUPABASE_AUTH) {
      await authHelpers.signOut();
    }
  },
};
// USER API
// ============================================================================

export const userAPI = {
  // Get user by ID
  getUser: async (userId: string): Promise<User> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      const user = mockDb.findById('users', userId) as User | null;
      if (!user) throw new Error('User not found');
      return user;
    }
    const response = await apiCall<{ success: boolean; user: User }>(`/users/${userId}`, 'GET');
    return response.user;
  },

  // Update user
  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      mockDb.updateById('users', userId, { $set: updates });
      return mockDb.findById('users', userId) as User;
    }
    const response = await apiCall<{ success: boolean; user: User }>(`/users/${userId}`, 'PUT', updates);
    return response.user;
  },
};

// PROFILE API
// ============================================================================

export const profileAPI = {
  // Create profile
  createProfile: async (profileData: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>): Promise<Profile> => {
    if (USE_MOCK_API || AUTH_MODE === 'nodejs') {
      // If category not provided, determine based on age
      let category = profileData.category;
      if (!category) {
        const dob = new Date(profileData.dob);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age <= 19) category = 'kids';
        else if (age <= 40) category = 'youth';
        else category = 'senior';
      }

      if (AUTH_MODE === 'nodejs') {
        return apiCall('/profiles', 'POST', { ...profileData, category });
      } else {
        const profile = mockDb.insertOne('profiles', { ...profileData, category }) as Profile;

        // Update user's profiles array
        mockDb.updateById('users', profileData.userId, {
          $push: { profiles: profile._id }
        });

        return profile;
      }
    }
    return apiCall('/profiles', 'POST', profileData);
  },

  // Get profiles by user ID
  getProfilesByUser: async (userId: string): Promise<Profile[]> => {
    if (USE_MOCK_API || AUTH_MODE === 'nodejs') {
      if (AUTH_MODE === 'nodejs') {
        return apiCall(`/profiles/user/${userId}`, 'GET');
      } else {
        return mockDb.find('profiles', { userId }) as Profile[];
      }
    }
    return apiCall(`/profiles/user/${userId}`, 'GET');
  },

  // Get profile by ID
  getProfile: async (profileId: string): Promise<Profile> => {
    if (USE_MOCK_API || AUTH_MODE === 'nodejs') {
      if (AUTH_MODE === 'nodejs') {
        return apiCall(`/profiles/${profileId}`, 'GET');
      } else {
        const profile = mockDb.findById('profiles', profileId) as Profile | null;
        if (!profile) throw new Error('Profile not found');
        return profile;
      }
    }
    return apiCall(`/profiles/${profileId}`, 'GET');
  },

  // Update profile
  updateProfile: async (profileId: string, updates: Partial<Profile>): Promise<Profile> => {
    if (USE_MOCK_API || AUTH_MODE === 'nodejs') {
      if (AUTH_MODE === 'nodejs') {
        return apiCall(`/profiles/${profileId}`, 'PUT', updates);
      } else {
        mockDb.updateById('profiles', profileId, { $set: updates });
        return mockDb.findById('profiles', profileId) as Profile;
      }
    }
    return apiCall(`/profiles/${profileId}`, 'PUT', updates);
  },

  // Delete profile
  deleteProfile: async (profileId: string): Promise<void> => {
    if (USE_MOCK_API || AUTH_MODE === 'nodejs') {
      if (AUTH_MODE === 'nodejs') {
        await apiCall(`/profiles/${profileId}`, 'DELETE');
      } else {
        // Remove profile
        mockDb.deleteById('profiles', profileId);
        // Remove from user's profiles array
        const users = mockDb.find('users', {}) as User[];
        users.forEach(user => {
          if (user.profiles.includes(profileId)) {
            mockDb.updateById('users', user._id, {
              $pull: { profiles: profileId }
            });
          }
        });
      }
    } else {
      await apiCall(`/profiles/${profileId}`, 'DELETE');
    }
  },
};

export const quizAPI = {
  // Submit quiz attempt
  submitQuiz: async (attemptData: Omit<QuizAttempt, '_id'>): Promise<QuizAttempt> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.insertOne('quizAttempts', attemptData) as QuizAttempt;
    }
    return apiCall('/quiz/submit', 'POST', attemptData);
  },

  // Get quiz attempts by profile
  getAttemptsByProfile: async (profileId: string): Promise<QuizAttempt[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('quizAttempts', { profileId }) as QuizAttempt[];
    }
    return apiCall(`/quiz/attempts/profile/${profileId}`, 'GET');
  },

  // Get all quiz attempts (admin)
  getAllAttempts: async (): Promise<QuizAttempt[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('quizAttempts', {}) as QuizAttempt[];
    }
    return apiCall('/quiz/attempts', 'GET');
  },
};

// ============================================================================
// EVENT API
// ============================================================================

export const eventAPI = {
  // Submit video
  submitVideo: async (submissionData: Omit<VideoSubmission, '_id' | 'status' | 'submittedAt'>): Promise<VideoSubmission> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.insertOne('videoSubmissions', {
        ...submissionData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }) as VideoSubmission;
    }
    return apiCall('/events/video', 'POST', submissionData);
  },

  // Get video submissions by profile
  getVideosByProfile: async (profileId: string): Promise<VideoSubmission[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('videoSubmissions', { profileId }) as VideoSubmission[];
    }
    return apiCall(`/events/videos/profile/${profileId}`, 'GET');
  },

  // Submit slogan
  submitSlogan: async (profileId: string, slogan: string): Promise<SloganSubmission> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.insertOne('sloganSubmissions', {
        profileId,
        slogan,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }) as SloganSubmission;
    }
    return apiCall('/events/slogan', 'POST', { profileId, slogan });
  },

  // Get slogan submissions by profile
  getSlogansByProfile: async (profileId: string): Promise<SloganSubmission[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('sloganSubmissions', { profileId }) as SloganSubmission[];
    }
    return apiCall(`/events/slogans/profile/${profileId}`, 'GET');
  },

  // Get all video submissions (admin)
  getAllVideos: async (): Promise<VideoSubmission[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('videoSubmissions', {}) as VideoSubmission[];
    }
    return apiCall('/events/videos', 'GET');
  },

  // Get all slogan submissions (admin)
  getAllSlogans: async (): Promise<SloganSubmission[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('sloganSubmissions', {}) as SloganSubmission[];
    }
    return apiCall('/events/slogans', 'GET');
  },

  // Review video submission (admin)
  reviewVideo: async (
    submissionId: string,
    status: 'approved' | 'rejected',
    creditScore?: number
  ): Promise<VideoSubmission> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      mockDb.updateById('videoSubmissions', submissionId, {
        $set: {
          status,
          creditScore,
          reviewedAt: new Date().toISOString(),
        }
      });
      return mockDb.findById('videoSubmissions', submissionId) as VideoSubmission;
    }
    return apiCall(`/events/videos/${submissionId}/review`, 'PUT', { status, creditScore });
  },

  // Review slogan submission (admin)
  reviewSlogan: async (
    submissionId: string,
    status: 'approved' | 'rejected',
    creditScore?: number
  ): Promise<SloganSubmission> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      mockDb.updateById('sloganSubmissions', submissionId, {
        $set: {
          status,
          creditScore,
          reviewedAt: new Date().toISOString(),
        }
      });
      return mockDb.findById('sloganSubmissions', submissionId) as SloganSubmission;
    }
    return apiCall(`/events/slogans/${submissionId}/review`, 'PUT', { status, creditScore });
  },
};

// ============================================================================
// IMAGE PUZZLE API
// ============================================================================

export const imagePuzzleAPI = {
  // Collect today's image part
  collectPart: async (profileId: string): Promise<{ success: boolean; partNumber: number }> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      const today = new Date().toDateString();
      const lastCollected = localStorage.getItem('lastImagePartCollected');
      
      if (lastCollected === today) {
        throw new Error('Already collected today');
      }

      // Get already collected parts for this profile
      const collected = mockDb.find('imageParts', { profileId }) as ImagePart[];
      const collectedNumbers = collected.map(p => p.partNumber);

      // Find available part
      const availableParts = Array.from({ length: 45 }, (_, i) => i + 1)
        .filter(n => !collectedNumbers.includes(n));

      if (availableParts.length === 0) {
        throw new Error('All parts collected');
      }

      // Random part from available
      const partNumber = availableParts[Math.floor(Math.random() * availableParts.length)];

      mockDb.insertOne('imageParts', {
        profileId,
        partNumber,
        collectedAt: new Date().toISOString(),
      });

      localStorage.setItem('lastImagePartCollected', today);

      return { success: true, partNumber };
    }
    return apiCall('/puzzle/collect', 'POST', { profileId });
  },

  // Get collected parts by profile
  getCollectedParts: async (profileId: string): Promise<ImagePart[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('imageParts', { profileId }) as ImagePart[];
    }
    return apiCall(`/puzzle/parts/${profileId}`, 'GET');
  },
};

// ============================================================================
// LEADERBOARD API
// ============================================================================

export const leaderboardAPI = {
  // Get leaderboard (overall or weekly)
  getLeaderboard: async (type: 'overall' | 'weekly' = 'overall'): Promise<LeaderboardEntry[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Calculate scores for all profiles
      const profiles = mockDb.find('profiles', {}) as Profile[];
      const entries: LeaderboardEntry[] = [];

      for (const profile of profiles) {
        // Quiz score
        const quizAttempts = mockDb.find('quizAttempts', { profileId: profile._id }) as QuizAttempt[];
        const quizScore = quizAttempts.reduce((sum, a) => sum + a.score, 0);

        // Event score
        const videos = mockDb.find('videoSubmissions', { 
          profileId: profile._id, 
          status: 'approved' 
        }) as VideoSubmission[];
        const slogans = mockDb.find('sloganSubmissions', { 
          profileId: profile._id,
          status: 'approved' 
        }) as SloganSubmission[];
        
        const videoScore = videos.reduce((sum, v) => sum + (v.creditScore || 0), 0);
        const sloganScore = slogans.reduce((sum, s) => sum + (s.creditScore || 0), 0);

        // Puzzle score
        const parts = mockDb.find('imageParts', { profileId: profile._id }) as ImagePart[];
        const puzzleScore = parts.length * 10 + (parts.length === 45 ? 100 : 0);

        const eventScore = videoScore + sloganScore + puzzleScore;
        const totalScore = quizScore + eventScore;

        // Weekly score (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const recentAttempts = quizAttempts.filter(a => a.completedAt >= weekAgo);
        const weeklyScore = recentAttempts.reduce((sum, a) => sum + a.score, 0);

        entries.push({
          profileId: profile._id,
          name: profile.name,
          category: profile.category || 'General',
          totalScore,
          quizScore,
          eventScore,
          weeklyScore,
          rank: 0,
        });
      }

      // Sort by total score (or weekly for weekly leaderboard)
      const sortKey = type === 'weekly' ? 'weeklyScore' : 'totalScore';
      entries.sort((a, b) => b[sortKey] - a[sortKey]);

      // Assign ranks
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return entries;
    }
    
    // Backend API call
    const response = await apiCall<{ success: boolean; leaderboard: LeaderboardEntry[] }>(`/leaderboard/${type}`, 'GET');
    return response.leaderboard;
  },

  // Get profile rank
  getProfileRank: async (profileId: string): Promise<{ rank: number; totalParticipants: number }> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      const leaderboard = await leaderboardAPI.getLeaderboard('overall');
      const entry = leaderboard.find(e => e.profileId === profileId);
      return {
        rank: entry?.rank || 0,
        totalParticipants: leaderboard.length,
      };
    }
    
    // Backend API call
    const response = await apiCall<{ success: boolean; rank: number; totalParticipants: number }>(`/leaderboard/rank/${profileId}`, 'GET');
    return { rank: response.rank, totalParticipants: response.totalParticipants };
  },
};

// ============================================================================
// QUIZ QUESTIONS API
// ============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  chapter?: number;
}

export const quizQuestionsAPI = {
  // Get quiz questions
  getQuestions: async (
    type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3' | 'daily',
    language: string = 'english'
  ): Promise<QuizQuestion[]> => {
    // Try MongoDB first for daily quiz
    if (type === 'daily') {
      try {
        const { getDailyQuizQuestions } = await import('../services/quizService');
        const questions = await getDailyQuizQuestions();
        console.log('✅ Loaded daily quiz questions from MongoDB');
        return questions;
      } catch (error) {
        console.warn('⚠️ Failed to load from MongoDB, falling back to mock data:', error);
      }
    }

    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Import quiz data
      const { getQuizQuestions } = await import('./mockQuizData');
      
      // Determine count and difficulty based on type
      let count = 10;
      let difficulty: 'easy' | 'medium' | 'hard' | 'expert' | undefined;
      
      if (type === 'daily') {
        count = 5;
        difficulty = 'easy';
      } else if (type === 'mock') {
        count = 10;
        difficulty = 'easy';
      } else if (type === 'quiz1') {
        count = 30;
        difficulty = 'medium';
      } else if (type === 'quiz2') {
        count = 30;
        difficulty = 'hard';
      } else if (type === 'quiz3') {
        count = 30;
        difficulty = 'expert';
      }

      return getQuizQuestions(language as any, { count, difficulty });
    }
    return apiCall(`/quiz/questions/${type}`, 'GET', undefined, language);
  },

  // Get daily quiz questions (5 mixed difficulty questions)
  getDailyQuestions: async (): Promise<QuizQuestion[]> => {
    try {
      const { getDailyQuizQuestions } = await import('../services/quizService');
      return await getDailyQuizQuestions();
    } catch (error) {
      console.error('Error fetching daily quiz questions:', error);
      // Fallback to mock data
      const { getQuizQuestions } = await import('./mockQuizData');
      return getQuizQuestions('english', { count: 5, difficulty: 'easy' });
    }
  },
};

// ============================================================================
// ROUNDS/TASKS API
// ============================================================================

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

export const roundsAPI = {
  // Get tasks for a specific round
  getRoundTasks: async (roundNumber: number, profileId: string): Promise<RoundTask[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Mock round tasks based on round number
      const roundTasks: Record<number, RoundTask[]> = {
        1: [
          {
            id: 'r1-t1',
            roundNumber: 1,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r1-t2',
            roundNumber: 1,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r1-t3',
            roundNumber: 1,
            title: 'Create a Slogan',
            description: 'Create an inspiring slogan based on Bhagavad Geeta',
            type: 'slogan',
            status: 'unlocked',
            points: 75,
          },
          {
            id: 'r1-t4',
            roundNumber: 1,
            title: 'Create a Reel',
            description: 'Create a short video reel sharing your understanding',
            type: 'video',
            status: 'unlocked',
            points: 100,
          },
        ],
        2: [
          {
            id: 'r2-t1',
            roundNumber: 2,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r2-t2',
            roundNumber: 2,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r2-t3',
            roundNumber: 2,
            title: 'Essay Writing',
            description: 'Write an essay on your favorite verse',
            type: 'essay',
            status: 'unlocked',
            points: 150,
          },
        ],
        3: [
          {
            id: 'r3-t1',
            roundNumber: 3,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r3-t2',
            roundNumber: 3,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r3-t3',
            roundNumber: 3,
            title: 'Creative Task',
            description: 'Express your creativity with a Geeta-inspired project',
            type: 'creative',
            status: 'unlocked',
            points: 125,
          },
        ],
        4: [
          {
            id: 'r4-t1',
            roundNumber: 4,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r4-t2',
            roundNumber: 4,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r4-t3',
            roundNumber: 4,
            title: 'Video Submission',
            description: 'Share your understanding through a video',
            type: 'video',
            status: 'unlocked',
            points: 100,
          },
        ],
        5: [
          {
            id: 'r5-t1',
            roundNumber: 5,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r5-t2',
            roundNumber: 5,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r5-t3',
            roundNumber: 5,
            title: 'Slogan Creation',
            description: 'Create a meaningful slogan inspired by the Geeta',
            type: 'slogan',
            status: 'unlocked',
            points: 75,
          },
        ],
        6: [
          {
            id: 'r6-t1',
            roundNumber: 6,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r6-t2',
            roundNumber: 6,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r6-t3',
            roundNumber: 6,
            title: 'Essay Writing',
            description: 'Write a reflective essay on Geeta teachings',
            type: 'essay',
            status: 'unlocked',
            points: 150,
          },
        ],
        7: [
          {
            id: 'r7-t1',
            roundNumber: 7,
            title: 'Daily Quiz',
            description: 'Complete today\'s daily quiz challenge',
            type: 'quiz',
            status: 'unlocked',
            points: 100,
          },
          {
            id: 'r7-t2',
            roundNumber: 7,
            title: 'Collect Today\'s Puzzle Piece',
            description: 'Collect your daily puzzle piece to complete the image',
            type: 'puzzle',
            status: 'unlocked',
            points: 50,
          },
          {
            id: 'r7-t3',
            roundNumber: 7,
            title: 'Final Creative Project',
            description: 'Complete your final creative project showcasing your journey',
            type: 'creative',
            status: 'unlocked',
            points: 200,
          },
        ],
      };

      return roundTasks[roundNumber] || [];
    }
    return apiCall(`/rounds/${roundNumber}/tasks/${profileId}`, 'GET');
  },

  // Update task status
  updateTaskStatus: async (taskId: string, status: RoundTask['status']): Promise<void> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Mock implementation - store in localStorage
      const tasksKey = 'roundTaskStatuses';
      const statuses = JSON.parse(localStorage.getItem(tasksKey) || '{}');
      statuses[taskId] = status;
      localStorage.setItem(tasksKey, JSON.stringify(statuses));
      return;
    }
    await apiCall(`/rounds/tasks/${taskId}/status`, 'PUT', { status });
  },
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export interface Notification {
  id: string;
  profileId: string;
  type: 'quiz' | 'event' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const notificationsAPI = {
  // Get notifications for a profile
  getNotifications: async (profileId: string): Promise<Notification[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: 'n1',
          profileId,
          type: 'quiz',
          title: 'New Quiz Available!',
          message: 'Quiz Battle 2 is now unlocked. Test your knowledge!',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/quiz',
        },
        {
          id: 'n2',
          profileId,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: 'You earned the "Quiz Master" badge for scoring 90%+',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'n3',
          profileId,
          type: 'event',
          title: 'Video Approved!',
          message: 'Your shloka recitation video was approved. You earned 50 points!',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      return mockNotifications;
    }
    return apiCall(`/notifications/${profileId}`, 'GET');
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Mock implementation
      return;
    }
    await apiCall(`/notifications/${notificationId}/read`, 'PUT');
  },

  // Mark all as read
  markAllAsRead: async (profileId: string): Promise<void> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Mock implementation
      return;
    }
    await apiCall(`/notifications/${profileId}/read-all`, 'PUT');
  },
};

// ============================================================================
// ACHIEVEMENTS/REWARDS API
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quiz' | 'events' | 'puzzle' | 'streak';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export const achievementsAPI = {
  // Get achievements for a profile
  getAchievements: async (profileId: string): Promise<Achievement[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // Calculate achievements based on profile data
      const quizAttempts = mockDb.find('quizAttempts', { profileId }) as QuizAttempt[];
      const videos = mockDb.find('videoSubmissions', { profileId, status: 'approved' }) as VideoSubmission[];
      const parts = mockDb.find('imageParts', { profileId }) as ImagePart[];

      const achievements: Achievement[] = [
        {
          id: 'a1',
          name: 'First Steps',
          description: 'Complete your first quiz',
          icon: '🎯',
          category: 'quiz',
          unlocked: quizAttempts.length > 0,
          unlockedAt: quizAttempts[0]?.completedAt,
        },
        {
          id: 'a2',
          name: 'Quiz Master',
          description: 'Score 90% or higher in any quiz',
          icon: '🏆',
          category: 'quiz',
          unlocked: quizAttempts.some(a => (a.correctAnswers / a.totalQuestions) >= 0.9),
        },
        {
          id: 'a3',
          name: 'Video Star',
          description: 'Submit your first video',
          icon: '🎬',
          category: 'events',
          unlocked: videos.length > 0,
          unlockedAt: videos[0]?.submittedAt,
        },
        {
          id: 'a4',
          name: 'Puzzle Hunter',
          description: 'Collect 10 puzzle pieces',
          icon: '🧩',
          category: 'puzzle',
          unlocked: parts.length >= 10,
          progress: parts.length,
          maxProgress: 10,
        },
        {
          id: 'a5',
          name: 'Puzzle Master',
          description: 'Collect all 45 puzzle pieces',
          icon: '🏅',
          category: 'puzzle',
          unlocked: parts.length === 45,
          progress: parts.length,
          maxProgress: 45,
        },
        {
          id: 'a6',
          name: 'Dedicated Learner',
          description: 'Complete 5 quizzes',
          icon: '📚',
          category: 'quiz',
          unlocked: quizAttempts.length >= 5,
          progress: quizAttempts.length,
          maxProgress: 5,
        },
      ];

      return achievements;
    }
    return apiCall(`/achievements/${profileId}`, 'GET');
  },
};