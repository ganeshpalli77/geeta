// API Proxy - Single interface for all backend calls
// Switch between mock and Supabase auth by changing AUTH_MODE in utils/config.ts

import { mockDb } from './mockDb';
import { authHelpers } from './supabaseClient';
import { AUTH_MODE, API_BASE_URL, isMockMode, isSupabaseMode, ADMIN_CREDENTIALS } from './config';

// Derived configuration flags
const USE_MOCK_API = isMockMode();
const USE_SUPABASE_AUTH = isSupabaseMode();

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
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        return { success: true };
      }
      throw new Error('Invalid credentials');
    }
    return apiCall('/auth/admin-login', 'POST', { username, password });
  },

  // Sign out (Supabase)
  signOut: async (): Promise<void> => {
    if (USE_SUPABASE_AUTH) {
      await authHelpers.signOut();
    }
  },
};

// ============================================================================
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
    return apiCall(`/users/${userId}`, 'GET');
  },

  // Update user
  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      mockDb.updateById('users', userId, { $set: updates });
      return mockDb.findById('users', userId) as User;
    }
    return apiCall(`/users/${userId}`, 'PUT', updates);
  },
};

// ============================================================================
// PROFILE API
// ============================================================================

export const profileAPI = {
  // Create profile
  createProfile: async (profileData: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>): Promise<Profile> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      // If category not provided, determine based on age
      let category = profileData.category;
      if (!category) {
        const dob = new Date(profileData.dob);
        const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age <= 19) category = 'kids';
        else if (age <= 40) category = 'youth';
        else category = 'senior';
      }

      const profile = mockDb.insertOne('profiles', { ...profileData, category }) as Profile;

      // Update user's profiles array
      mockDb.updateById('users', profileData.userId, {
        $push: { profiles: profile._id }
      });

      return profile;
    }
    return apiCall('/profiles', 'POST', profileData);
  },

  // Get profiles by user ID
  getProfilesByUser: async (userId: string): Promise<Profile[]> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      return mockDb.find('profiles', { userId }) as Profile[];
    }
    return apiCall(`/profiles/user/${userId}`, 'GET');
  },

  // Get profile by ID
  getProfile: async (profileId: string): Promise<Profile> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      const profile = mockDb.findById('profiles', profileId) as Profile | null;
      if (!profile) throw new Error('Profile not found');
      return profile;
    }
    return apiCall(`/profiles/${profileId}`, 'GET');
  },

  // Update profile
  updateProfile: async (profileId: string, updates: Partial<Profile>): Promise<Profile> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
      mockDb.updateById('profiles', profileId, { $set: updates });
      return mockDb.findById('profiles', profileId) as Profile;
    }
    return apiCall(`/profiles/${profileId}`, 'PUT', updates);
  },

  // Delete profile
  deleteProfile: async (profileId: string): Promise<void> => {
    if (USE_MOCK_API || USE_SUPABASE_AUTH) {
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
    } else {
      await apiCall(`/profiles/${profileId}`, 'DELETE');
    }
  },
};

// ============================================================================
// QUIZ API
// ============================================================================

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
    return apiCall(`/leaderboard/${type}`, 'GET');
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
    return apiCall(`/leaderboard/rank/${profileId}`, 'GET');
  },
};