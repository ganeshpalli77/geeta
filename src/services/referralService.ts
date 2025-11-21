import { apiCall } from '../utils/apiProxy';

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCreditsEarned: number;
  referrals: Array<{
    name: string;
    date: string;
    credits: number;
    status: string;
  }>;
}

export interface ReferralCode {
  referralCode: string;
  profileId: string;
  name: string;
}

export const referralService = {
  /**
   * Get referral code for a profile
   */
  async getReferralCode(profileId: string): Promise<ReferralCode> {
    return apiCall(`/referrals/code/${profileId}`, 'GET');
  },

  /**
   * Validate a referral code
   */
  async validateReferralCode(referralCode: string): Promise<{
    valid: boolean;
    referrerName?: string;
    referrerProfileId?: string;
  }> {
    return apiCall('/referrals/validate', 'POST', { referralCode });
  },

  /**
   * Apply referral code
   */
  async applyReferralCode(
    referralCode: string,
    newProfileId: string,
    newUserId: string
  ): Promise<{
    success: boolean;
    message: string;
    referrerCredits: number;
    yourCredits: number;
  }> {
    return apiCall('/referrals/apply', 'POST', {
      referralCode,
      newProfileId,
      newUserId,
    });
  },

  /**
   * Get referral statistics for a profile
   */
  async getReferralStats(profileId: string): Promise<{ stats: ReferralStats }> {
    return apiCall(`/referrals/stats/${profileId}`, 'GET');
  },

  /**
   * Get referral leaderboard
   */
  async getLeaderboard(): Promise<{
    leaderboard: Array<{
      profileId: string;
      name: string;
      totalReferrals: number;
      totalCredits: number;
    }>;
  }> {
    return apiCall('/referrals/leaderboard', 'GET');
  },
};
