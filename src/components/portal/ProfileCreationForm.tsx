import React, { useState } from 'react';
import { User, Calendar, IdCard, Globe, School, Gift, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../../utils/config';

interface ProfileCreationFormProps {
  onSuccess?: () => void;
}

export function ProfileCreationForm({ onSuccess }: ProfileCreationFormProps) {
  const { createProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralMessage, setReferralMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    prn: '',
    dob: '',
    category: '',
    referralCode: '',
    preferredLanguage: 'english',
  });

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 10) {
      setReferralValid(null);
      setReferralMessage('');
      return;
    }

    setValidatingReferral(true);
    setReferralValid(null);
    setReferralMessage('Validating...');

    try {
      const response = await fetch(`${API_BASE_URL}/referrals/validate/${code.toUpperCase()}`);
      const data = await response.json();

      if (data.valid) {
        setReferralValid(true);
        setReferralMessage(`✅ Valid! You'll get 50 credits from ${data.referrerName || 'referrer'}`);
        toast.success(`Valid referral code! You'll get 50 bonus credits!`);
      } else {
        setReferralValid(false);
        setReferralMessage('❌ Invalid referral code');
        toast.error('Invalid referral code');
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setReferralValid(false);
      setReferralMessage('❌ Could not validate code');
    } finally {
      setValidatingReferral(false);
    }
  };

  const handleReferralCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setFormData({ ...formData, referralCode: upperValue });
    
    // Auto-validate when code looks complete
    if (upperValue.length >= 14) {
      validateReferralCode(upperValue);
    } else {
      setReferralValid(null);
      setReferralMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.prn.trim()) {
      toast.error('Please enter your PRN/ID');
      return;
    }
    if (!formData.dob) {
      toast.error('Please select your date of birth');
      return;
    }

    // Check referral code validation if provided
    if (formData.referralCode && referralValid === false) {
      toast.error('Please enter a valid referral code or leave it empty');
      return;
    }

    setLoading(true);
    try {
      await createProfile({
        name: formData.name.trim(),
        prn: formData.prn.trim(),
        dob: formData.dob,
        category: formData.category.trim() || 'General',
        preferredLanguage: formData.preferredLanguage,
        referralCode: formData.referralCode.trim() || undefined,
      });
      
      if (formData.referralCode && referralValid) {
        toast.success('✅ Profile created! You received 50 bonus credits!');
      } else {
        toast.success('✅ Profile created successfully!');
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      toast.error(errorMessage.replace('API call failed: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-300 dark:border-purple-800">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Create Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">
            Fill in your details to get started with Geeta Olympiad.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* PRN */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <IdCard className="inline w-4 h-4 mr-2" />
              PRN / Student ID *
            </label>
            <input
              type="text"
              value={formData.prn}
              onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your PRN or Student ID"
              disabled={loading}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors font-semibold"
              disabled={loading}
            />
          </div>

          {/* Category/School */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <School className="inline w-4 h-4 mr-2" />
              School / Category (Optional)
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your school name or category"
              disabled={loading}
            />
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Gift className="inline w-4 h-4 mr-2" />
              Referral Code (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => handleReferralCodeChange(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                  referralValid === true
                    ? 'border-green-500 dark:border-green-500'
                    : referralValid === false
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                } bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none transition-colors font-semibold uppercase`}
                placeholder="GEETA-XXXX-YYYY"
                maxLength={15}
                disabled={loading}
              />
              {/* Validation Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validatingReferral && (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {!validatingReferral && referralValid === true && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {!validatingReferral && referralValid === false && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            {/* Validation Message */}
            {referralMessage && (
              <p className={`text-xs mt-2 font-semibold ${
                referralValid === true
                  ? 'text-green-600 dark:text-green-400'
                  : referralValid === false
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {referralMessage}
              </p>
            )}
            {!referralMessage && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                🎁 Enter a friend's referral code to get 50 bonus credits!
              </p>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="inline w-4 h-4 mr-2" />
              Preferred Language *
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none transition-colors font-semibold"
              disabled={loading}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full !bg-purple-600 hover:!bg-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
              style={{ backgroundColor: '#9333EA' }}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Creating Profile...
                </>
              ) : (
                <>
                  Create Profile
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
