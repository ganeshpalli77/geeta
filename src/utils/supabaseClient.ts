import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, DEFAULT_COUNTRY_CODE } from './config';

// Create Supabase client with explicit configuration
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configure storage to use sessionStorage instead of localStorage
    storage: {
      getItem: (key) => {
        return sessionStorage.getItem(key);
      },
      setItem: (key, value) => {
        sessionStorage.setItem(key, value);
      },
      removeItem: (key) => {
        sessionStorage.removeItem(key);
      },
    },
  },
  global: {
    headers: {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
    },
  },
});

// Auth helper functions for working with Auth Hooks
export const authHelpers = {
  // Send OTP via phone
  sendPhoneOTP: async (phone: string) => {
    try {
      // Ensure phone is in E.164 format (+country code + number)
      let formattedPhone = phone.trim();
      
      // If phone doesn't start with +, add default country code
      if (!formattedPhone.startsWith('+')) {
        // Remove any leading zeros
        formattedPhone = formattedPhone.replace(/^0+/, '');
        // Add country code
        formattedPhone = DEFAULT_COUNTRY_CODE + formattedPhone;
      }

      console.log('Sending OTP to phone:', formattedPhone);

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          // Add any custom data that your Auth Hook might need
          data: {
            source: 'geeta-olympiad',
          },
        },
      });

      if (error) {
        console.error('Supabase phone OTP error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        // Provide user-friendly error messages
        if (error.message.includes('Hook requires authorization token')) {
          throw new Error('Auth Hook Error: Please disable Auth Hooks in Supabase Dashboard (Authentication → Hooks) and use built-in providers instead. See /QUICK_FIX.md');
        }
        
        if (error.message.includes('Invalid payload sent to hook')) {
          throw new Error('Auth Hook Error: Invalid configuration. Please disable Auth Hooks in Supabase Dashboard (Authentication → Hooks) and use built-in providers instead. See /QUICK_FIX.md');
        }
        
        throw error;
      }
      
      console.log('OTP sent successfully to phone');
      return { success: true, data };
    } catch (error: any) {
      console.error('Phone OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Send OTP via email
  sendEmailOTP: async (email: string) => {
    try {
      console.log('Sending OTP to email:', email);

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Add any custom data that your Auth Hook might need
          data: {
            source: 'geeta-olympiad',
          },
          // Optional: Add email redirect URL
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Supabase email OTP error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        // Provide user-friendly error messages
        if (error.message.includes('Hook requires authorization token')) {
          throw new Error('Auth Hook Error: Please disable Auth Hooks in Supabase Dashboard (Authentication → Hooks) and use built-in providers instead. See /QUICK_FIX.md');
        }
        
        if (error.message.includes('Invalid payload sent to hook')) {
          throw new Error('Auth Hook Error: Invalid configuration. Please disable Auth Hooks in Supabase Dashboard (Authentication → Hooks) and use built-in providers instead. See /QUICK_FIX.md');
        }
        
        throw error;
      }
      
      console.log('OTP sent successfully to email');
      return { success: true, data };
    } catch (error: any) {
      console.error('Email OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOTP: async (identifier: string, token: string, type: 'phone' | 'email') => {
    try {
      const verifyOptions = type === 'phone' 
        ? { phone: identifier, token, type: 'sms' as const }
        : { email: identifier, token, type: 'email' as const };

      const { data, error } = await supabase.auth.verifyOtp(verifyOptions);

      if (error) throw error;
      return { success: true, session: data.session, user: data.user };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error: any) {
      console.error('Get session error:', error);
      return null;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error: any) {
      console.error('Get user error:', error);
      return null;
    }
  },
};
