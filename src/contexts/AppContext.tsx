import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  authAPI, 
  userAPI, 
  profileAPI, 
  quizAPI, 
  eventAPI, 
  imagePuzzleAPI, 
  leaderboardAPI,
  notificationsAPI,
  achievementsAPI,
  roundsAPI,
  quizQuestionsAPI,
  type User as ApiUser,
  type Profile as ApiProfile,
  type QuizAttempt as ApiQuizAttempt,
  type VideoSubmission as ApiVideoSubmission,
  type SloganSubmission as ApiSloganSubmission,
  type ImagePart as ApiImagePart,
  type LeaderboardEntry as ApiLeaderboardEntry,
  type Notification as ApiNotification,
  type Achievement as ApiAchievement,
  type RoundTask as ApiRoundTask,
  type QuizQuestion as ApiQuizQuestion,
} from '../utils/apiProxy';
import { initializeMockData } from '../utils/initMockData';
import { supabase } from '../utils/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { backendAPI } from '../services/backendAPI';

// Types (keeping backward compatibility with existing components)
export interface UserProfile {
  id: string;
  name: string;
  prn: string;
  dob: string;
  preferredLanguage: string;
  category?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  profiles: UserProfile[];
  currentProfileId?: string;
}

export interface QuizAttempt {
  id: string;
  profileId: string;
  type: 'mock' | 'quiz1' | 'quiz2' | 'quiz3';
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface VideoSubmission {
  id: string;
  profileId: string;
  type: 'shloka' | 'reel';
  url: string;
  platform: string;
  submittedAt: string;
  creditScore?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SloganSubmission {
  id: string;
  profileId: string;
  slogan: string;
  submittedAt: string;
  creditScore?: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ImagePart {
  id: number;
  collected: boolean;
  collectedDate?: string;
}

export interface AppState {
  user: User | null;
  currentProfile: UserProfile | null;
  language: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  quizAttempts: QuizAttempt[];
  videoSubmissions: VideoSubmission[];
  sloganSubmissions: SloganSubmission[];
  imageParts: ImagePart[];
  leaderboard: ApiLeaderboardEntry[];
  quizInProgress: boolean;
  devMode: boolean;
}

export interface LeaderboardEntry {
  profileId: string;
  name: string;
  totalScore: number;
  quizScore: number;
  eventScore: number;
  weeklyScore: number;
  rank: number;
}

interface AppContextType extends AppState {
  login: (email: string, otp: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  createProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  updateProfile: (profileId: string, updates: Partial<UserProfile>) => Promise<void>;
  changeLanguage: (lang: string) => void;
  submitQuiz: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => Promise<void>;
  submitVideo: (submission: Omit<VideoSubmission, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  submitSlogan: (slogan: string) => Promise<void>;
  collectImagePart: () => Promise<boolean>;
  getAvailableQuizzes: () => { 
    mock: { available: boolean; reason?: string }; 
    quiz1: { available: boolean; reason?: string }; 
    quiz2: { available: boolean; reason?: string }; 
    quiz3: { available: boolean; reason?: string }; 
  };
  getTotalScore: () => number;
  loginAsAdmin: (username: string, password: string) => Promise<boolean>;
  refreshLeaderboard: () => Promise<void>;
  setQuizInProgress: (inProgress: boolean) => void;
  toggleDevMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Convert API types to app types
function convertApiUserToUser(apiUser: ApiUser, profiles: ApiProfile[]): User {
  return {
    id: apiUser._id,
    email: apiUser.email,
    phone: apiUser.phone,
    profiles: profiles.map(convertApiProfileToProfile),
    currentProfileId: undefined,
  };
}

function convertApiProfileToProfile(apiProfile: ApiProfile): UserProfile {
  return {
    id: apiProfile._id,
    name: apiProfile.name,
    prn: apiProfile.prn,
    dob: apiProfile.dob,
    preferredLanguage: apiProfile.preferredLanguage,
    category: apiProfile.category,
    createdAt: apiProfile.createdAt,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize mock data on first load
  useEffect(() => {
    initializeMockData();
  }, []);

  const [state, setState] = useState<AppState>({
    user: null,
    currentProfile: null,
    language: 'en',
    isAuthenticated: false,
    isAdmin: false,
    quizAttempts: [],
    videoSubmissions: [],
    sloganSubmissions: [],
    imageParts: Array.from({ length: 45 }, (_, i) => ({ id: i + 1, collected: false })),
    leaderboard: [],
    quizInProgress: false,
    devMode: false,
  });

  const loadProfileData = async (profileId: string) => {
    try {
      const [profile, quizAttempts, videos, slogans, parts] = await Promise.all([
        profileAPI.getProfile(profileId),
        quizAPI.getAttemptsByProfile(profileId),
        eventAPI.getVideosByProfile(profileId),
        eventAPI.getSlogansByProfile(profileId),
        imagePuzzleAPI.getCollectedParts(profileId),
      ]);

      // Convert image parts to app format
      const imageParts: ImagePart[] = Array.from({ length: 45 }, (_, i) => {
        const partNum = i + 1;
        const collected = parts.find(p => p.partNumber === partNum);
        return {
          id: partNum,
          collected: !!collected,
          collectedDate: collected?.collectedAt,
        };
      });

      setState(prev => ({
        ...prev,
        currentProfile: convertApiProfileToProfile(profile),
        language: profile.preferredLanguage,
        quizAttempts: quizAttempts.map(a => ({ ...a, id: a._id })),
        videoSubmissions: videos.map(v => ({ ...v, id: v._id })),
        sloganSubmissions: slogans.map(s => ({ ...s, id: s._id })),
        imageParts,
      }));
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  // Check Supabase auth state on mount and on auth changes
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleSupabaseAuth(session.user, session);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleSupabaseAuth(session.user, session);
      } else {
        // User signed out
        setState(prev => ({
          ...prev,
          user: null,
          currentProfile: null,
          isAuthenticated: false,
          isAdmin: false,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseAuth = async (supabaseUser: SupabaseUser, session: Session) => {
    try {
      // Get user email or phone
      const email = supabaseUser.email;
      const phone = supabaseUser.phone;

      // Register user in MongoDB backend (new separate collections)
      let backendUserId: string | undefined;
      try {
        if (email) {
          // Register with email in email_users collection
          const { user: emailUser } = await backendAPI.registerEmailUser(email);
          backendUserId = emailUser._id;
          console.log('Email user registered in MongoDB:', emailUser);
        } else if (phone) {
          // Register with phone in phone_users collection
          const { user: phoneUser } = await backendAPI.registerPhoneUser(phone);
          backendUserId = phoneUser._id;
          console.log('Phone user registered in MongoDB:', phoneUser);
        }

        // Also register in legacy users collection for backward compatibility
        if (backendUserId) {
          await backendAPI.registerUser({
            userId: supabaseUser.id, // Pass Supabase UUID
            email: email || undefined,
            phone: phone || undefined,
          });
        }
      } catch (error) {
        console.error('Error registering user in MongoDB:', error);
        // Continue even if MongoDB registration fails
      }

      // Create or get user from API
      // Use Supabase user ID as the primary identifier
      let apiUser: ApiUser;
      try {
        // Try to get existing user by Supabase ID
        apiUser = await userAPI.getUser(supabaseUser.id);
        console.log('Found existing user:', apiUser);
        console.log('apiUser._id:', apiUser._id);
        console.log('apiUser:', JSON.stringify(apiUser, null, 2));
      } catch (error) {
        // User doesn't exist in our system yet
        // Create a minimal user object from Supabase data
        console.log('User not found in API, creating minimal user object');
        apiUser = {
          _id: supabaseUser.id,
          email: email || undefined,
          phone: phone || undefined,
          profiles: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Get user's profiles (if any)
      let profiles: ApiProfile[] = [];
      try {
        profiles = await profileAPI.getProfilesByUser(supabaseUser.id);
        // Ensure profiles is an array
        if (!Array.isArray(profiles)) {
          profiles = [];
        }
      } catch (error) {
        // No profiles yet, that's fine
        console.log('No profiles found for user:', error);
        profiles = [];
      }

      const user = convertApiUserToUser(apiUser, profiles);
      console.log('Converted user object:', user);
      console.log('User ID after conversion:', user.id);

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isAdmin: false, // You can add admin check logic here if needed
      }));

      // If user has profiles, load the first one
      if (profiles.length > 0) {
        await loadProfileData(profiles[0]._id);
      }
    } catch (error) {
      console.error('Error handling Supabase auth:', error);
      // Set authenticated state even if profile loading fails
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
      }));
    }
  };

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Check if Supabase is configured
      const { data: { publicUrl } } = await supabase.storage.from('test').getPublicUrl('test');
      const isSupabaseConfigured = publicUrl && !publicUrl.includes('undefined');

      if (!isSupabaseConfigured) {
        // Fallback to mock login if Supabase is not configured
        console.log('Supabase not configured, using mock login');
        
        // Mock user creation
        const mockUserId = `user-${Date.now()}`;
        const mockUser: User = {
          id: mockUserId,
          email,
          profiles: [],
        };

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: mockUser,
        }));

        return true;
      }

      // Verify OTP with Supabase - use 'magiclink' type for email
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'magiclink',
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        // If error is token expired, provide helpful message
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          toast.error('OTP has expired. Please request a new one.');
        }
        return false;
      }

      if (data.user && data.session) {
        // Auth state change will be handled by onAuthStateChange listener
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock login on error
      const mockUserId = `user-${Date.now()}`;
      const mockUser: User = {
        id: mockUserId,
        email,
        profiles: [],
      };

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: mockUser,
      }));

      return true;
    }
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    try {
      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        return false;
      }

      if (data.user && data.session) {
        // Auth state change will be handled by onAuthStateChange listener
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAsAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await authAPI.adminLogin(username, password);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isAdmin: true,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setState(prev => ({
      ...prev,
      user: null,
      currentProfile: null,
      isAuthenticated: false,
      isAdmin: false,
      quizAttempts: [],
      videoSubmissions: [],
      sloganSubmissions: [],
      imageParts: Array.from({ length: 45 }, (_, i) => ({ id: i + 1, collected: false })),
    }));
  };

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    if (!state.user) {
      console.error('No user found in state');
      return;
    }

    try {
      console.log('Creating profile for user:', state.user.id);
      
      const newProfile = await profileAPI.createProfile({
        userId: state.user.id,
        name: profileData.name,
        prn: profileData.prn,
        dob: profileData.dob,
        preferredLanguage: profileData.preferredLanguage,
        category: profileData.category,
      });

      console.log('Profile created:', newProfile);
      
      // Handle both response formats: direct profile or wrapped in {success, profile}
      const actualProfile = (newProfile as any).profile || newProfile;
      console.log('Actual profile object:', actualProfile);
      console.log('Profile _id:', actualProfile._id);
      
      // Always redirect to profile selection, even if _id is missing
      // The profile selection page will reload all profiles from the server
      toast.success('');
      
      // Redirect to profile selection page to show all profiles
      setTimeout(() => {
        window.location.hash = '#profile-selection';
        // Reload the page to ensure fresh data
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const switchProfile = async (profileId: string) => {
    if (!state.user) return;

    try {
      await loadProfileData(profileId);
    } catch (error) {
      console.error('Error switching profile:', error);
    }
  };

  const updateProfile = async (profileId: string, updates: Partial<UserProfile>) => {
    try {
      await profileAPI.updateProfile(profileId, updates);
      
      // Reload profile data
      if (state.currentProfile?.id === profileId) {
        await loadProfileData(profileId);
      }

      // Update user's profiles list
      if (state.user) {
        const profiles = await profileAPI.getProfilesByUser(state.user.id);
        setState(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            profiles: profiles.map(convertApiProfileToProfile),
          } : null,
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const changeLanguage = (lang: string) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const submitQuiz = async (attemptData: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    try {
      const newAttempt = await quizAPI.submitQuiz({
        profileId: attemptData.profileId,
        type: attemptData.type,
        questions: attemptData.questions,
        answers: attemptData.answers,
        score: attemptData.score,
        totalQuestions: attemptData.totalQuestions,
        correctAnswers: attemptData.correctAnswers,
        timeSpent: attemptData.timeSpent,
        completedAt: new Date().toISOString(),
      });

      setState(prev => ({
        ...prev,
        quizAttempts: [...prev.quizAttempts, { ...newAttempt, id: newAttempt._id }],
      }));
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  };

  const submitVideo = async (submissionData: Omit<VideoSubmission, 'id' | 'submittedAt' | 'status'>) => {
    try {
      const newSubmission = await eventAPI.submitVideo(submissionData);

      setState(prev => ({
        ...prev,
        videoSubmissions: [...prev.videoSubmissions, { ...newSubmission, id: newSubmission._id }],
      }));
    } catch (error) {
      console.error('Error submitting video:', error);
      throw error;
    }
  };

  const submitSlogan = async (slogan: string) => {
    if (!state.currentProfile) return;

    try {
      const newSubmission = await eventAPI.submitSlogan(state.currentProfile.id, slogan);

      setState(prev => ({
        ...prev,
        sloganSubmissions: [...prev.sloganSubmissions, { ...newSubmission, id: newSubmission._id }],
      }));
    } catch (error) {
      console.error('Error submitting slogan:', error);
      throw error;
    }
  };

  const collectImagePart = async (): Promise<boolean> => {
    if (!state.currentProfile) return false;

    try {
      const result = await imagePuzzleAPI.collectPart(state.currentProfile.id);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          imageParts: prev.imageParts.map(part =>
            part.id === result.partNumber
              ? { ...part, collected: true, collectedDate: new Date().toISOString() }
              : part
          ),
        }));
        return true;
      }
      return false;
    } catch (error) {
      // Only log unexpected errors (not "already collected" errors)
      if (error instanceof Error && !error.message.includes('Already collected today')) {
        console.error('Error collecting image part:', error);
      }
      return false;
    }
  };

  const getAvailableQuizzes = () => {
    if (!state.currentProfile) {
      return { 
        mock: { available: false, reason: 'No profile selected' },
        quiz1: { available: false, reason: 'No profile selected' },
        quiz2: { available: false, reason: 'No profile selected' },
        quiz3: { available: false, reason: 'No profile selected' },
      };
    }

    const profileAttempts = state.quizAttempts.filter(
      a => a.profileId === state.currentProfile!.id
    );

    // Check if each quiz has been attempted
    const mockAttempted = profileAttempts.some(a => a.type === 'mock');
    const quiz1Attempted = profileAttempts.some(a => a.type === 'quiz1');
    const quiz2Attempted = profileAttempts.some(a => a.type === 'quiz2');
    const quiz3Attempted = profileAttempts.some(a => a.type === 'quiz3');

    // Check date restrictions (Dec 1 for quiz2, Dec 15 for quiz3)
    const today = new Date();
    const quiz2UnlockDate = new Date('2025-12-01');
    const quiz3UnlockDate = new Date('2025-12-15');

    // In dev mode, all quizzes are available (except already attempted ones)
    if (state.devMode) {
      return {
        mock: { available: !mockAttempted },
        quiz1: { available: !quiz1Attempted },
        quiz2: { available: !quiz2Attempted },
        quiz3: { available: !quiz3Attempted },
      };
    }

    // Production mode rules
    return {
      mock: { available: !mockAttempted },
      quiz1: { 
        available: !quiz1Attempted && mockAttempted,
        reason: !mockAttempted ? 'Complete mock quiz first' : quiz1Attempted ? 'Already attempted' : undefined
      },
      quiz2: { 
        available: !quiz2Attempted && mockAttempted && today >= quiz2UnlockDate,
        reason: !mockAttempted ? 'Complete mock quiz first' : 
                today < quiz2UnlockDate ? 'Available from Dec 1, 2025' :
                quiz2Attempted ? 'Already attempted' : undefined
      },
      quiz3: { 
        available: !quiz3Attempted && mockAttempted && today >= quiz3UnlockDate,
        reason: !mockAttempted ? 'Complete mock quiz first' :
                today < quiz3UnlockDate ? 'Available from Dec 15, 2025' :
                quiz3Attempted ? 'Already attempted' : undefined
      },
    };
  };

  const getTotalScore = (): number => {
    if (!state.currentProfile) return 0;

    // Don't count mock quiz in total score
    const quizScore = state.quizAttempts
      .filter(a => a.profileId === state.currentProfile!.id && a.type !== 'mock')
      .reduce((sum, a) => sum + a.score, 0);

    const videoScore = state.videoSubmissions
      .filter(s => s.profileId === state.currentProfile!.id && s.creditScore)
      .reduce((sum, s) => sum + (s.creditScore || 0), 0);

    const sloganScore = state.sloganSubmissions
      .filter(s => s.profileId === state.currentProfile!.id && s.creditScore)
      .reduce((sum, s) => sum + (s.creditScore || 0), 0);

    const collectedParts = state.imageParts.filter(p => p.collected).length;
    const imageScore = collectedParts * 10 + (collectedParts === 45 ? 100 : 0);

    return quizScore + videoScore + sloganScore + imageScore;
  };

  const refreshLeaderboard = async () => {
    try {
      const leaderboard = await leaderboardAPI.getLeaderboard('overall');
      setState(prev => ({ ...prev, leaderboard }));
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
    }
  };

  const setQuizInProgress = (inProgress: boolean) => {
    setState(prev => ({ ...prev, quizInProgress: inProgress }));
  };

  const toggleDevMode = () => {
    setState(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const value: AppContextType = {
    ...state,
    login,
    loginWithPhone,
    logout,
    createProfile,
    switchProfile,
    updateProfile,
    changeLanguage,
    submitQuiz,
    submitVideo,
    submitSlogan,
    collectImagePart,
    getAvailableQuizzes,
    getTotalScore,
    loginAsAdmin,
    refreshLeaderboard,
    setQuizInProgress,
    toggleDevMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}