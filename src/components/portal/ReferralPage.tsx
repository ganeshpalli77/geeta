import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import {
  Copy,
  Share2,
  Users,
  Gift,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/config';

export function ReferralPage() {
  const { user, currentProfile } = useApp();
  const t = useTranslation();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalCreditsEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('=== ReferralPage Debug ===');
    console.log('User:', user);
    console.log('User profiles:', user?.profiles);
    console.log('Current profile:', currentProfile);
    console.log('========================');
  }, [user, currentProfile]);

  // Check if profile is being loaded (show loading only briefly)
  if (!user || (!currentProfile && loading)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D55328] mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading profile...</h2>
          <p className="text-gray-500 mt-2">Please wait while we load your profile data</p>
        </div>
      </div>
    );
  }

  // Check if user has no profiles (only after data is loaded)
  if (user && (!user.profiles || user.profiles.length === 0) && !currentProfile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-2xl font-bold text-[#822A12] mb-3">Create a Profile First</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            You need to create a participant profile before you can access referrals.
            Click the button below to create your profile.
          </p>
          <Button
            onClick={() => window.location.hash = '#profile'}
            className="bg-gradient-to-r from-[#D55328] to-[#822A12] hover:from-[#822A12] hover:to-[#D55328] text-white px-8 py-6 text-lg"
          >
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  // If no current profile but user has profiles, show selection message
  if (!currentProfile && user && user.profiles && user.profiles.length > 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-bold text-[#822A12] mb-3">Select a Profile</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            You need to select a profile to access referrals.
            Click the button below to select your profile.
          </p>
          <Button
            onClick={() => window.location.hash = '#profile-selection'}
            className="bg-gradient-to-r from-[#D55328] to-[#822A12] hover:from-[#822A12] hover:to-[#D55328] text-white px-8 py-6 text-lg"
          >
            Select Profile
          </Button>
        </div>
      </div>
    );
  }

  // Get referral code from profile (it's generated and stored in the backend)
  const [referralCode, setReferralCode] = useState(currentProfile?.referralCode || '');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Load referral code from profile
  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    
    if (currentProfile.referralCode) {
      setReferralCode(currentProfile.referralCode);
      console.log('✅ Referral code loaded from profile:', currentProfile.referralCode);
    } else {
      console.log('⚠️ Profile does not have a referral code yet:', currentProfile.id);
    }
  }, [currentProfile]);

  // Manual generate referral code function
  const handleGenerateCode = async () => {
    if (!currentProfile) {
      toast.error('No profile selected. Please select a profile first.');
      console.error('❌ No currentProfile available');
      return;
    }

    if (!currentProfile.id) {
      toast.error('Profile ID is missing. Please refresh the page.');
      console.error('❌ Profile ID is undefined:', currentProfile);
      return;
    }

    console.log('🔄 Manually generating referral code for profile:', currentProfile.id);
    console.log('Current Profile Object:', currentProfile);
    console.log('User Object:', user);
    
    setCodeLoading(true);
    setCodeError('');
    
    try {
      const url = `${API_BASE_URL}/profiles/${currentProfile.id}/generate-referral-code`;
      console.log('Making API call to:', url);
      
      const response = await fetch(url, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setReferralCode(data.referralCode);
        setCodeLoading(false);
        console.log('✅ Referral code generated:', data.referralCode);
        toast.success('Referral code generated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Failed to generate referral code:', errorData);
        setCodeError(errorData.error || 'Failed to generate referral code');
        setCodeLoading(false);
        toast.error('Failed to generate referral code');
      }
    } catch (error) {
      console.error('❌ Error generating referral code:', error);
      setCodeError('Cannot connect to server. Please check if backend is running.');
      setCodeLoading(false);
      toast.error('Cannot connect to server');
    }
  };

  // Fetch referral stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentProfile) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/profiles/${currentProfile.id}/referrals`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching referral stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentProfile]);

  // Copy to clipboard
  const handleCopy = async () => {
    if (!referralCode) {
      toast.error('Referral code not available');
      console.error('Referral code is empty or undefined:', referralCode);
      return;
    }

    console.log('Attempting to copy referral code:', referralCode);

    try {
      // Try using the Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralCode);
        setCopied(true);
        toast.success('Referral code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = referralCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          toast.success('Referral code copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.error('Failed to copy referral code');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy referral code');
    }
  };

  // Share via different platforms
  const handleShare = (platform: string) => {
    const text = `Join me on Geeta Olympiad! Use my referral code: ${referralCode}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        const fbText = encodeURIComponent(text);
        window.open(`https://www.facebook.com/sharer/sharer.php?quote=${fbText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Join Geeta Olympiad&body=${encodeURIComponent(text)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'Join Geeta Olympiad',
            text: text,
          });
        }
    }
  };

  // Debug info
  useEffect(() => {
    console.log('=== Referral Page Debug Info ===');
    console.log('Current Profile:', currentProfile);
    console.log('Profile ID:', currentProfile?.id);
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('Referral Code:', referralCode);
    console.log('Code Loading:', codeLoading);
    console.log('Code Error:', codeError);
    console.log('API Base URL:', API_BASE_URL);
    console.log('===============================');
  }, [currentProfile, user, referralCode, codeLoading, codeError]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#822A12] mb-2">
          {t.referral.title}
        </h1>
        <p className="text-gray-600">
          {t.referral.description}
        </p>
      </div>

       {/* Referral Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="p-6 bg-gradient-to-br from-[#193C77] to-[#0f2a5a] text-white">
           <div className="flex items-center justify-between mb-4">
             <Users className="w-10 h-10 opacity-80" />
             <div className="text-3xl font-bold">
               {loading ? '...' : stats.totalReferrals}
             </div>
           </div>
           <p className="text-sm opacity-90">{t.referral.stats.total}</p>
         </Card>

         <Card className="p-6 bg-gradient-to-br from-[#D55328] to-[#822A12] text-white">
           <div className="flex items-center justify-between mb-4">
             <Gift className="w-10 h-10 opacity-80" />
             <div className="text-3xl font-bold">
               {loading ? '...' : stats.totalCreditsEarned}
             </div>
           </div>
           <p className="text-sm opacity-90">{t.referral.stats.credits}</p>
         </Card>

         <Card className="p-6 bg-gradient-to-br from-[#E8C56E] to-[#d4b15e] text-[#822A12]">
           <div className="flex items-center justify-between mb-4">
             <Users className="w-10 h-10 opacity-80" />
             <div className="text-3xl font-bold">
               {loading ? '...' : stats.activeReferrals}
             </div>
           </div>
           <p className="text-sm opacity-90">{t.referral.stats.active}</p>
         </Card>
       </div>

       {/* Referral Code Section */}
       <Card className="p-6 md:p-8 mb-8">
         <div className="text-center mb-6">
           <h2 className="text-2xl font-bold text-[#822A12] mb-2">
             {t.referral.yourCode}
           </h2>
           <p className="text-gray-600">
             {t.referral.shareCode}
           </p>
         </div>

         {/* Referral Code Display */}
         <div className="bg-gradient-to-r from-[#FFF8ED] to-[#f5ebd8] border-2 border-[#E8C56E] rounded-lg p-8">
           {codeLoading ? (
             <div className="text-center text-gray-500">
               <div className="flex flex-col items-center gap-3">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D55328]"></div>
                 <p className="text-lg">Generating your referral code...</p>
                 <p className="text-sm">Please wait a moment</p>
               </div>
             </div>
           ) : referralCode ? (
             <div className="flex flex-col items-center justify-center gap-4">
               <div className="text-4xl md:text-5xl font-bold text-[#D55328] tracking-wider break-all text-center">
                 {referralCode}
               </div>
               <Button
                 onClick={handleCopy}
                 className="bg-[#D55328] hover:bg-[#822A12] px-8 py-6 text-lg"
                 size="lg"
               >
                 {copied ? (
                   <>✓ Copied!</>
                 ) : (
                   <>
                     <Copy className="w-5 h-5 mr-2" />
                     {t.referral.copyCode}
                   </>
                 )}
               </Button>
               <p className="text-sm text-gray-600 text-center mt-2">
                 {t.referral.shareCode}
               </p>
               <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                 <p className="text-xs text-green-700 flex items-center gap-2 justify-center">
                   <Gift className="w-4 h-4" />
                   This is your permanent referral code - Share it to earn rewards!
                 </p>
               </div>
             </div>
           ) : (
             <div className="text-center">
               <div className="flex flex-col items-center gap-4">
                 <div className="text-6xl">🎁</div>
                 <h3 className="text-xl font-semibold text-[#822A12]">
                   Generate Your Referral Code
                 </h3>
                 <p className="text-gray-600 max-w-md">
                   Click the button below to generate your unique referral code. 
                   Once generated, you can share it with friends and earn rewards!
                 </p>
                 {codeError && (
                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg max-w-md">
                     <p className="text-sm text-red-600">{codeError}</p>
                   </div>
                 )}
                 <Button
                   onClick={handleGenerateCode}
                   className="bg-gradient-to-r from-[#D55328] to-[#822A12] hover:from-[#822A12] hover:to-[#D55328] text-white px-10 py-6 text-lg font-semibold shadow-lg"
                   size="lg"
                 >
                   <Gift className="w-6 h-6 mr-3" />
                   Generate My Referral Code
                 </Button>
                 <p className="text-xs text-gray-500 italic">
                   * One-time generation - Your code will be saved permanently
                 </p>
               </div>
             </div>
           )}
         </div>

         {/* Share Options */}
         <div className="space-y-4">
           <h3 className="text-lg font-semibold text-center text-gray-700">
             {t.referral.share}
           </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>

            <Button
              onClick={() => handleShare('facebook')}
              className="bg-[#1877F2] hover:bg-[#145dbf] text-white"
            >
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </Button>

            <Button
              onClick={() => handleShare('twitter')}
              className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Twitter
            </Button>

            <Button
              onClick={() => handleShare('email')}
              className="bg-[#EA4335] hover:bg-[#d33426] text-white"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </Button>
          </div>

           {/* Native Share Button (Mobile) */}
           {typeof navigator !== 'undefined' && 'share' in navigator && (
             <Button
               onClick={() => handleShare('native')}
               className="w-full bg-[#193C77] hover:bg-[#0f2a5a] text-white"
             >
               <Share2 className="w-5 h-5 mr-2" />
               {t.referral.share}
             </Button>
           )}
        </div>
      </Card>

       {/* How It Works */}
       <Card className="p-6 md:p-8 mb-8">
         <h2 className="text-2xl font-bold text-[#822A12] mb-6">
           {t.referral.howItWorks.title}
         </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FFF8ED] border-2 border-[#E8C56E] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#D55328]">1</span>
            </div>
             <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
             <p className="text-sm text-gray-600">
               {t.referral.howItWorks.step1}
             </p>
           </div>

           <div className="text-center">
             <div className="w-16 h-16 bg-[#FFF8ED] border-2 border-[#E8C56E] rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl font-bold text-[#D55328]">2</span>
             </div>
             <h3 className="font-semibold text-gray-900 mb-2">2. They Enter Code</h3>
             <p className="text-sm text-gray-600">
               {t.referral.howItWorks.step2}
             </p>
           </div>

           <div className="text-center">
             <div className="w-16 h-16 bg-[#FFF8ED] border-2 border-[#E8C56E] rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl font-bold text-[#D55328]">3</span>
             </div>
             <h3 className="font-semibold text-gray-900 mb-2">3. Earn Rewards</h3>
             <p className="text-sm text-gray-600">
               {t.referral.howItWorks.step3}
             </p>
          </div>
        </div>
      </Card>

       {/* Benefits */}
       <Card className="p-6 md:p-8">
         <h2 className="text-2xl font-bold text-[#822A12] mb-6">
           {t.referral.benefits.title}
         </h2>

         <div className="space-y-4">
           <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-[#FFF8ED] rounded-full flex items-center justify-center flex-shrink-0">
               <Gift className="w-5 h-5 text-[#D55328]" />
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t.referral.benefits.item1.title}
               </h3>
               <p className="text-sm text-gray-600">
                 {t.referral.benefits.item1.description}
               </p>
             </div>
           </div>

           <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-[#FFF8ED] rounded-full flex items-center justify-center flex-shrink-0">
               <Users className="w-5 h-5 text-[#D55328]" />
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t.referral.benefits.item2.title}
               </h3>
               <p className="text-sm text-gray-600">
                 {t.referral.benefits.item2.description}
               </p>
             </div>
           </div>

           <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-[#FFF8ED] rounded-full flex items-center justify-center flex-shrink-0">
               <Gift className="w-5 h-5 text-[#D55328]" />
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-1">
                 {t.referral.benefits.item3.title}
               </h3>
               <p className="text-sm text-gray-600">
                 {t.referral.benefits.item3.description}
               </p>
             </div>
           </div>
         </div>
       </Card>
    </div>
  );
}

