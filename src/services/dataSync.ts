/**
 * Data Synchronization Service
 * Manages efficient data flow between Supabase (Auth) and MongoDB (Data Storage)
 */

import { supabase } from '../utils/supabaseClient';
import { backendAPI } from './backendAPI';

// Cache configuration
const CACHE_CONFIG = {
  USER_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  PROFILE_CACHE_DURATION: 2 * 60 * 1000, // 2 minutes
  DATA_CACHE_DURATION: 1 * 60 * 1000, // 1 minute
};

// In-memory cache with timestamps
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class DataSyncService {
  private userCache = new Map<string, CacheEntry<any>>();
  private profileCache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Get cached data or fetch if expired
   */
  private async getCached<T>(
    key: string,
    cache: Map<string, CacheEntry<T>>,
    fetchFn: () => Promise<T>,
    duration: number
  ): Promise<T> {
    // Check cache first
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      console.log(`✅ Cache HIT for ${key}`);
      return cached.data;
    }

    // Check if request is already pending
    const pendingKey = `${key}_pending`;
    if (this.pendingRequests.has(pendingKey)) {
      console.log(`⏳ Waiting for pending request: ${key}`);
      return this.pendingRequests.get(pendingKey)!;
    }

    // Fetch data
    console.log(`🔄 Cache MISS for ${key} - Fetching...`);
    const promise = fetchFn();
    this.pendingRequests.set(pendingKey, promise);

    try {
      const data = await promise;
      
      // Update cache
      cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration,
      });

      return data;
    } finally {
      this.pendingRequests.delete(pendingKey);
    }
  }

  /**
   * Sync user data between Supabase and MongoDB
   */
  async syncUser(supabaseUserId: string) {
    return this.getCached(
      `user_${supabaseUserId}`,
      this.userCache,
      async () => {
        // Get Supabase user
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (!supabaseUser || supabaseUser.id !== supabaseUserId) {
          throw new Error('User not authenticated');
        }

        // Check if user exists in MongoDB
        try {
          const mongoUser = await backendAPI.getUser(supabaseUserId);
          return {
            supabaseUser,
            mongoUser,
            synced: true,
          };
        } catch (error) {
          // User doesn't exist in MongoDB, create it
          const email = supabaseUser.email || '';
          const phone = supabaseUser.phone || '';
          
          if (!email && !phone) {
            throw new Error('User must have email or phone');
          }

          const verifiedWith = email && !phone ? 'email' : 
                              !email && phone ? 'phone' : 
                              email ? 'email' : null;

          const { user: mongoUser } = await backendAPI.registerUser({
            userId: supabaseUserId,
            email: email || `user-${supabaseUserId}@placeholder.com`,
            phone: phone || `+1000000${supabaseUserId.substring(0, 4)}`,
            emailVerified: !!email && verifiedWith === 'email',
            phoneVerified: !!phone && verifiedWith === 'phone',
            verifiedWith: verifiedWith as 'email' | 'phone' | null,
          });

          return {
            supabaseUser,
            mongoUser,
            synced: true,
            newUser: true,
          };
        }
      },
      CACHE_CONFIG.USER_CACHE_DURATION
    );
  }

  /**
   * Get user profiles with caching
   */
  async getUserProfiles(userId: string, forceRefresh = false) {
    if (forceRefresh) {
      this.profileCache.delete(`profiles_${userId}`);
    }

    return this.getCached(
      `profiles_${userId}`,
      this.profileCache,
      async () => {
        const profiles = await backendAPI.getProfilesByUser(userId);
        return Array.isArray(profiles) ? profiles : [];
      },
      CACHE_CONFIG.PROFILE_CACHE_DURATION
    );
  }

  /**
   * Clear all caches
   */
  clearAllCaches() {
    this.userCache.clear();
    this.profileCache.clear();
    this.pendingRequests.clear();
    console.log('🧹 All caches cleared');
  }

  /**
   * Clear specific user cache
   */
  clearUserCache(userId: string) {
    this.userCache.delete(`user_${userId}`);
    this.profileCache.delete(`profiles_${userId}`);
    console.log(`🧹 Cache cleared for user: ${userId}`);
  }

  /**
   * Prefetch data for better performance
   */
  async prefetchUserData(userId: string) {
    console.log(`🚀 Prefetching data for user: ${userId}`);
    
    // Prefetch in parallel
    await Promise.all([
      this.syncUser(userId),
      this.getUserProfiles(userId),
    ]);

    console.log(`✅ Prefetch complete for user: ${userId}`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      userCacheSize: this.userCache.size,
      profileCacheSize: this.profileCache.size,
      pendingRequests: this.pendingRequests.size,
    };
  }
}

// Export singleton instance
export const dataSyncService = new DataSyncService();
