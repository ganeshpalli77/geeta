// Optimized AppContext - Fast profile loading and auto-refresh
import React, { useRef } from 'react';

// Add these utilities to the existing AppContext

// Cache for user profiles (in-memory, session-based)
const profileCache = new Map<string, { profiles: any[], timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

// Debounce profile fetching to prevent multiple simultaneous calls
let profileFetchPromise: Promise<any> | null = null;

export const fetchProfilesOptimized = async (userId: string, forceRefresh = false): Promise<any[]> => {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ Using cached profiles');
      return cached.profiles;
    }
  }

  // If already fetching, wait for that promise
  if (profileFetchPromise) {
    console.log('⏳ Waiting for existing profile fetch...');
    return profileFetchPromise;
  }

  // Fetch profiles
  profileFetchPromise = (async () => {
    try {
      const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/profiles/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.status}`);
      }

      const data = await response.json();
      const profiles = Array.isArray(data.profiles) ? data.profiles : [];
      
      // Update cache
      profileCache.set(userId, {
        profiles,
        timestamp: Date.now()
      });

      console.log(`✅ Fetched ${profiles.length} profiles`);
      return profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    } finally {
      profileFetchPromise = null;
    }
  })();

  return profileFetchPromise;
};

// Clear profile cache (call this when profiles are created/updated)
export const clearProfileCache = (userId: string) => {
  profileCache.delete(userId);
  console.log('🗑️ Profile cache cleared for user:', userId);
};

// Auto-refresh profiles every 60 seconds (optional, for real-time updates)
export const startProfileAutoRefresh = (userId: string, callback: (profiles: any[]) => void) => {
  const intervalId = setInterval(async () => {
    const profiles = await fetchProfilesOptimized(userId, true);
    callback(profiles);
  }, 60000); // 60 seconds

  return () => clearInterval(intervalId);
};

