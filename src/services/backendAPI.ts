// Backend API Service for MongoDB integration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

export interface BackendUser {
  _id: string;
  userId?: string;
  email: string;
  phone: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  verifiedWith?: 'email' | 'phone' | null;
  lastLogin?: string;
  registeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendProfile {
  _id: string;
  userId: string;
  name: string;
  prn: string;
  dob: string;
  preferredLanguage: string;
  category?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailUser {
  _id: string;
  email: string;
  registeredAt: string;
  lastLogin: string | null;
}

export interface PhoneUser {
  _id: string;
  phone: string;
  registeredAt: string;
  lastLogin: string | null;
}

class BackendAPIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        console.error('Backend error response:', error);
        const errorMessage = error.error || error.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // User endpoints
  async registerUser(data: {
    userId?: string;
    email: string;
    phone: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    verifiedWith?: 'email' | 'phone' | null;
  }): Promise<{ user: BackendUser; message: string }> {
    const response = await this.request<{ success: boolean; user: BackendUser; message: string }>(
      '/users/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return { user: response.user, message: response.message };
  }

  async verifyUser(userId: string, verificationType: 'email' | 'phone'): Promise<BackendUser> {
    const response = await this.request<{ success: boolean; user: BackendUser; message: string }>(
      '/users/verify',
      {
        method: 'POST',
        body: JSON.stringify({ userId, verificationType }),
      }
    );
    return response.user;
  }

  async getUser(userId: string): Promise<BackendUser> {
    const response = await this.request<{ success: boolean; user: BackendUser }>(
      `/users/${userId}`
    );
    return response.user;
  }

  async getUserByEmail(email: string): Promise<BackendUser> {
    const response = await this.request<{ success: boolean; user: BackendUser }>(
      `/users/email/${encodeURIComponent(email)}`
    );
    return response.user;
  }

  async getUserByPhone(phone: string): Promise<BackendUser> {
    const response = await this.request<{ success: boolean; user: BackendUser }>(
      `/users/phone/${encodeURIComponent(phone)}`
    );
    return response.user;
  }

  async updateUser(userId: string, updates: Partial<BackendUser>): Promise<BackendUser> {
    const response = await this.request<{ success: boolean; user: BackendUser }>(
      `/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
    return response.user;
  }

  // Profile endpoints
  async createProfile(data: {
    userId: string;
    name: string;
    prn: string;
    dob: string;
    preferredLanguage: string;
    category?: string;
  }): Promise<BackendProfile> {
    const response = await this.request<{ success: boolean; profile: BackendProfile }>(
      '/profiles',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    console.log('Backend API createProfile full response:', response);
    console.log('Backend API response.profile:', response.profile);
    console.log('Profile _id:', response.profile?._id);
    
    // Make sure we return the profile object, not the wrapper
    if (response.profile) {
      console.log('Returning profile with _id:', response.profile._id);
      return response.profile;
    }
    
    // Fallback if response structure is different
    console.error('Unexpected response structure:', response);
    throw new Error('Profile creation failed: unexpected response structure');
  }

  async getProfile(profileId: string): Promise<BackendProfile> {
    const response = await this.request<{ success: boolean; profile: BackendProfile }>(
      `/profiles/${profileId}`
    );
    return response.profile;
  }

  async getProfilesByUser(userId: string): Promise<BackendProfile[]> {
    const response = await this.request<{ success: boolean; profiles: BackendProfile[] }>(
      `/profiles/user/${userId}`
    );
    // Ensure we always return an array
    return Array.isArray(response.profiles) ? response.profiles : [];
  }

  async updateProfile(profileId: string, updates: Partial<BackendProfile>): Promise<BackendProfile> {
    const response = await this.request<{ success: boolean; profile: BackendProfile }>(
      `/profiles/${profileId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
    return response.profile;
  }

  async deleteProfile(profileId: string): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/profiles/${profileId}`,
      {
        method: 'DELETE',
      }
    );
  }

  async setActiveProfile(userId: string, profileId: string): Promise<BackendProfile> {
    const response = await this.request<{ success: boolean; profile: BackendProfile; message: string }>(
      `/profiles/${profileId}/set-active`,
      {
        method: 'PUT',
        body: JSON.stringify({ userId }),
      }
    );
    return response.profile;
  }

  async getActiveProfile(userId: string): Promise<BackendProfile> {
    const response = await this.request<{ success: boolean; profile: BackendProfile }>(
      `/profiles/user/${userId}/active`
    );
    return response.profile;
  }

  async countProfiles(userId: string): Promise<number> {
    const response = await this.request<{ success: boolean; count: number }>(
      `/profiles/user/${userId}/count`
    );
    return response.count;
  }

  // Login tracking endpoints
  async createLoginRecord(data: {
    userId?: string;
    email?: string;
    phone?: string;
    loginMethod: 'email' | 'phone';
    success?: boolean;
  }): Promise<any> {
    const response = await this.request<{ success: boolean; login: any }>(
      '/logins',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.login;
  }

  async getLoginsByUser(userId: string): Promise<any[]> {
    const response = await this.request<{ success: boolean; logins: any[] }>(
      `/logins/user/${userId}`
    );
    return response.logins;
  }

  async getRecentLogins(limit: number = 100): Promise<any[]> {
    const response = await this.request<{ success: boolean; logins: any[] }>(
      `/logins/recent?limit=${limit}`
    );
    return response.logins;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  }

  // Email Users endpoints
  async registerEmailUser(email: string): Promise<{ user: EmailUser; message: string }> {
    const response = await this.request<{ success: boolean; user: EmailUser; message: string }>(
      '/email-users/register',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
    return { user: response.user, message: response.message };
  }

  async getEmailUser(userId: string): Promise<EmailUser> {
    const response = await this.request<{ success: boolean; user: EmailUser }>(
      `/email-users/${userId}`
    );
    return response.user;
  }

  async getEmailUserByEmail(email: string): Promise<EmailUser> {
    const response = await this.request<{ success: boolean; user: EmailUser }>(
      `/email-users/email/${encodeURIComponent(email)}`
    );
    return response.user;
  }

  async getAllEmailUsers(limit: number = 100, skip: number = 0): Promise<{ users: EmailUser[]; pagination: any }> {
    const response = await this.request<{ success: boolean; users: EmailUser[]; pagination: any }>(
      `/email-users?limit=${limit}&skip=${skip}`
    );
    return { users: response.users, pagination: response.pagination };
  }

  // Phone Users endpoints
  async registerPhoneUser(phone: string): Promise<{ user: PhoneUser; message: string }> {
    const response = await this.request<{ success: boolean; user: PhoneUser; message: string }>(
      '/phone-users/register',
      {
        method: 'POST',
        body: JSON.stringify({ phone }),
      }
    );
    return { user: response.user, message: response.message };
  }

  async getPhoneUser(userId: string): Promise<PhoneUser> {
    const response = await this.request<{ success: boolean; user: PhoneUser }>(
      `/phone-users/${userId}`
    );
    return response.user;
  }

  async getPhoneUserByPhone(phone: string): Promise<PhoneUser> {
    const response = await this.request<{ success: boolean; user: PhoneUser }>(
      `/phone-users/phone/${encodeURIComponent(phone)}`
    );
    return response.user;
  }

  async getAllPhoneUsers(limit: number = 100, skip: number = 0): Promise<{ users: PhoneUser[]; pagination: any }> {
    const response = await this.request<{ success: boolean; users: PhoneUser[]; pagination: any }>(
      `/phone-users?limit=${limit}&skip=${skip}`
    );
    return { users: response.users, pagination: response.pagination };
  }
}

export const backendAPI = new BackendAPIService();
