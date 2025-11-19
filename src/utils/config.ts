/**
 * Geeta Olympiad Configuration
 * 
 * This file centralizes all configuration settings for the application.
 */

import { ADMIN_CONFIG } from './adminConfig';

// ============================================================================
// AUTHENTICATION CONFIGURATION
// ============================================================================

/**
 * Authentication Mode
 * 
 * - 'mock': Uses localStorage for data persistence with demo OTP (1234)
 * - 'supabase': Uses Supabase Auth Hooks for real authentication
 * 
 * IMPORTANT: Before switching to 'supabase', ensure:
 * 1. Phone/Email provider is enabled in Supabase Dashboard
 * 2. Auth Hooks are properly configured (see SUPABASE_AUTH_HOOKS_GUIDE.md)
 * 3. Test with email OTP first (simpler setup)
 */
export const AUTH_MODE: 'mock' | 'supabase' | 'nodejs'= 'nodejs';

/**
 * Supabase Configuration
 * Only used when AUTH_MODE = 'supabase'
 * 
 * IMPORTANT: Verify these values in Supabase Dashboard → Settings → API
 * 
 * Common Issues:
 * - "Hook requires authorization token" → Disable Auth Hooks or configure properly
 * - See SUPABASE_AUTH_HOOK_FIX.md for detailed troubleshooting
 */
export const SUPABASE_CONFIG = {
  url: 'https://kiaozqbwolqauxjmwlks.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYW96cWJ3b2xxYXV4am13bGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE1MTMsImV4cCI6MjA3Nzg1NzUxM30.b6BT2te0Rdu9j-UHoUKhBpp5E4vLUrSXpp5YSbQqo_U',
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Backend API URL
 * Only used when implementing a custom backend
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================================================
// PHONE CONFIGURATION
// ============================================================================

/**
 * Default country code for phone numbers
 */
export const DEFAULT_COUNTRY_CODE = '+91'; // India

/**
 * Phone number validation regex
 * Current: Indian phone numbers (10 digits)
 */
export const PHONE_REGEX = /^[6-9]\d{9}$/;

// ============================================================================
// QUIZ CONFIGURATION
// ============================================================================

/**
 * Quiz timing and scoring settings
 */
export const QUIZ_CONFIG = {
  // Total time limit for each quiz (in seconds)
  mockQuizTime: 600, // 10 minutes
  quiz1Time: 1800, // 30 minutes
  quiz2Time: 1800, // 30 minutes
  quiz3Time: 1800, // 30 minutes
  
  // Number of questions per quiz
  mockQuizQuestions: 10,
  quiz1Questions: 30,
  quiz2Questions: 30,
  quiz3Questions: 30,
  
  // Points per difficulty level
  easyPoints: 10,
  mediumPoints: 20,
  hardPoints: 30,
};

// ============================================================================
// GAMIFICATION CONFIGURATION
// ============================================================================

/**
 * Image puzzle settings
 */
export const PUZZLE_CONFIG = {
  totalParts: 45,
  pointsPerPart: 10,
  completionBonus: 100,
};

/**
 * Event scoring
 */
export const EVENT_SCORING = {
  videoSubmission: {
    min: 50,
    max: 100,
  },
  sloganSubmission: {
    min: 30,
    max: 70,
  },
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/**
 * Toast notification position
 */
export const TOAST_POSITION = 'bottom-right' as const;

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Available languages
 */
export const AVAILABLE_LANGUAGES = ['en', 'hi'] as const;

// ============================================================================
// DEVELOPMENT CONFIGURATION
// ============================================================================

/**
 * Enable development mode features
 * Set enabled to false for production
 */
export const DEV_MODE = {
  enabled: false, // Set to true for development mode
  showMockOTP: false, // Disabled for production
  showDebugInfo: false,
};

// ============================================================================
// ADMIN CONFIGURATION
// ============================================================================

/**
 * Admin credentials
 * IMPORTANT: Change these in /utils/adminConfig.ts before deploying to production!
 * 
 * See adminConfig.ts for security best practices and configuration options.
 */
export const ADMIN_CREDENTIALS = ADMIN_CONFIG;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if app is in mock mode
 */
export const isMockMode = () => AUTH_MODE === 'mock';

/**
 * Check if app is using Supabase
 */
export const isSupabaseMode = () => AUTH_MODE === 'supabase';

/**
 * Get configuration summary for debugging
 */
export const getConfigSummary = () => {
  return {
    authMode: AUTH_MODE,
    environment: DEV_MODE.enabled ? 'development' : 'production',
    apiUrl: API_BASE_URL,
  };
};
