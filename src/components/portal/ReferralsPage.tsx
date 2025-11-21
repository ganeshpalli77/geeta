import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gift, Copy, Users, TrendingUp, Check, Coins, Share2, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { referralService, type ReferralStats } from '../../services/referralService';
import { toast } from 'sonner';

export function ReferralsPage() {
  const { currentProfile } = useApp();
  const [referralCode, setReferralCode] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentProfile?.id) {
      loadReferralData();
    }
  }, [currentProfile?.id]);

  const loadReferralData = async () => {
    if (!currentProfile?.id) return;

    try {
      setLoading(true);
      
      // Load referral code
      const codeData = await referralService.getReferralCode(currentProfile.id);
      setReferralCode(codeData.referralCode);

      // Load stats
      const statsData = await referralService.getReferralStats(currentProfile.id);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    const shareText = `Join Geeta Olympiad using my referral code ${referralCode} and get 50 bonus credits! 🎁`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Geeta Olympiad',
          text: shareText,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      copyReferralCode();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading referral data...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Please select a profile first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Gift className="w-10 h-10 text-purple-600" />
            Referral Program
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Invite friends and earn rewards together!
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <Coins className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">100 Credits</h3>
            <p className="text-purple-100">Per Referral</p>
            <p className="text-sm text-purple-200 mt-2">
              Earn 100 credits every time someone signs up using your code
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <Gift className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">50 Credits</h3>
            <p className="text-pink-100">For Your Friend</p>
            <p className="text-sm text-pink-200 mt-2">
              Your referred friend also receives 50 bonus credits to start
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Unlimited</h3>
            <p className="text-orange-100">Referrals</p>
            <p className="text-sm text-orange-200 mt-2">
              No limit on how many people you can refer. More referrals = More rewards!
            </p>
          </motion.div>
        </div>

        {/* Referral Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-purple-600" />
            Your Referral Code
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  readOnly
                  className="w-full px-6 py-4 text-2xl font-bold text-center bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-xl border-2 border-purple-300 dark:border-purple-600"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={copyReferralCode}
                className="flex items-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={shareReferral}
                className="flex items-center gap-2 px-6 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {stats?.totalReferrals || 0}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Total Referrals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {stats?.activeReferrals || 0}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Active Referrals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {stats?.totalCreditsEarned || 0}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Credits Earned</p>
          </motion.div>
        </div>

        {/* Referral History */}
        {stats && stats.referrals && stats.referrals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Your Referrals
            </h2>
            
            <div className="space-y-4">
              {stats.referrals.map((referral, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {referral.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{referral.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(referral.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      +{referral.credits}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {referral.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {stats && stats.referrals && stats.referrals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl text-center"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Referrals Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Share your referral code with friends to start earning rewards!
            </p>
            <button
              onClick={shareReferral}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
            >
              <Share2 className="w-5 h-5" />
              Share Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
