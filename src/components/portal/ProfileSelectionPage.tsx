import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Plus, Crown, Star, Trophy, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { backendAPI, type BackendProfile } from '../../services/backendAPI';
import { toast } from 'sonner';
import { ProfileCreationForm } from './ProfileCreationForm';

export function ProfileSelectionPage() {
  const { user, switchProfile, currentProfile } = useApp();
  const [profiles, setProfiles] = useState<BackendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfiles();
    } else if (user !== undefined) {
      // User object exists but no ID - shouldn't happen but handle it
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfiles = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await backendAPI.getProfilesByUser(user.id);
      console.log('Loaded profiles:', data);
      // Ensure data is an array
      const profilesArray = Array.isArray(data) ? data : [];
      setProfiles(profilesArray);
      
      // Don't auto-show create form, let user click the button
      // This gives them a choice to see the empty state first
    } catch (error) {
      console.error('Error loading profiles:', error);
      // Even on error, set empty array so we don't stay in loading state
      setProfiles([]);
      // Don't show error toast if it's just a 404 (no profiles found)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('404')) {
        toast.error('Failed to load profiles');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = async (profileId: string) => {
    if (!user?.id) return;
    
    try {
      await backendAPI.setActiveProfile(user.id, profileId);
      await switchProfile(profileId);
      toast.success('Profile activated! 🎮');
      
      // Navigate to dashboard after successful selection
      setTimeout(() => {
        window.location.hash = '#dashboard';
      }, 500);
    } catch (error) {
      console.error('Error selecting profile:', error);
      toast.error('Failed to select profile');
    }
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleProfileCreated = () => {
    setShowCreateForm(false);
    loadProfiles();
  };

  // Color schemes for profile cards
  const colorSchemes = [
    { bg: 'from-red-500 to-red-600', border: 'border-red-400', text: 'text-red-50' },
    { bg: 'from-yellow-500 to-yellow-600', border: 'border-yellow-400', text: 'text-yellow-50' },
    { bg: 'from-teal-500 to-teal-600', border: 'border-teal-400', text: 'text-teal-50' },
    { bg: 'from-blue-500 to-blue-600', border: 'border-blue-400', text: 'text-blue-50' },
    { bg: 'from-purple-500 to-purple-600', border: 'border-purple-400', text: 'text-purple-50' },
    { bg: 'from-pink-500 to-pink-600', border: 'border-pink-400', text: 'text-pink-50' },
    { bg: 'from-green-500 to-green-600', border: 'border-green-400', text: 'text-green-50' },
    { bg: 'from-orange-500 to-orange-600', border: 'border-orange-400', text: 'text-orange-50' },
  ];

  const getColorScheme = (index: number) => {
    return colorSchemes[index % colorSchemes.length];
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setShowCreateForm(false);
              if (profiles.length === 0) {
                // If no profiles, user must create one
                toast.info('Please create a profile to continue');
              }
            }}
            className="mb-6 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={profiles.length === 0}
          >
            ← Back to Profiles
          </button>
          <ProfileCreationForm />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no profiles
  if (!loading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-2xl">
            <User className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
            No Profiles Yet! 🎮
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Create your first warrior profile to begin your journey in the Elite Arena
          </p>
          
          {user?.email && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Logged in as: {user.email || user.phone}
            </p>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black py-4 px-10 rounded-xl shadow-2xl hover:from-orange-600 hover:to-pink-700 transition-colors text-lg"
          >
            <Plus className="w-6 h-6" />
            CREATE YOUR FIRST PROFILE
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
            Select Your Warrior 🎮
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold">
            Choose a profile to enter the Elite Arena
          </p>
          {user?.email && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Logged in as: {user.email || user.phone}
            </p>
          )}
          
          {/* Add Profile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNew}
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black py-3 px-8 rounded-xl shadow-lg hover:from-orange-600 hover:to-pink-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            ADD NEW PROFILE
          </motion.button>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {profiles.map((profile, index) => {
            const colors = getColorScheme(index);
            const isActive = currentProfile?.id === profile._id;

            return (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectProfile(profile._id)}
                className="cursor-pointer"
              >
                <div className={`relative rounded-3xl bg-gradient-to-br ${colors.bg} p-8 shadow-2xl border-4 ${colors.border} overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                      backgroundSize: '40px 40px'
                    }} />
                  </div>

                  {/* Active Badge */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
                    >
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-black text-gray-900">ACTIVE</span>
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/50 dark:bg-gray-600/50 backdrop-blur-sm flex items-center justify-center text-4xl font-black text-gray-900">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <h2 className={`text-3xl font-black mb-2 ${colors.text}`}>
                      {profile.name}
                    </h2>
                    <p className={`text-sm font-semibold mb-4 ${colors.text} opacity-80`}>
                      PRN: {profile.prn}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                        <Trophy className={`w-5 h-5 mx-auto mb-1 ${colors.text}`} />
                        <p className={`text-xs font-bold ${colors.text}`}>Level 1</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                        <Star className={`w-5 h-5 mx-auto mb-1 ${colors.text}`} />
                        <p className={`text-xs font-bold ${colors.text}`}>0 XP</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                        <Zap className={`w-5 h-5 mx-auto mb-1 ${colors.text}`} />
                        <p className={`text-xs font-bold ${colors.text}`}>Rank -</p>
                      </div>
                    </div>

                    {/* Select Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 w-full bg-white/90 backdrop-blur-sm text-gray-900 font-black py-3 rounded-xl shadow-lg hover:bg-white transition-colors"
                    >
                      {isActive ? '✓ SELECTED' : 'SELECT WARRIOR'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add New Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: profiles.length * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNew}
            className="cursor-pointer"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-8 shadow-2xl border-4 border-gray-400 dark:border-gray-600 overflow-hidden h-full flex items-center justify-center min-h-[400px]">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/50 dark:bg-gray-600/50 backdrop-blur-sm border-4 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center"
                >
                  <Plus className="w-16 h-16 text-gray-600 dark:text-gray-300" />
                </motion.div>

                <h2 className="text-3xl font-black text-gray-700 dark:text-gray-200 mb-2">
                  Create New Warrior
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  Add another profile
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black py-3 px-8 rounded-xl shadow-lg hover:from-orange-600 hover:to-pink-700 transition-colors"
                >
                  + CREATE PROFILE
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              <span className="text-2xl mr-2">ℹ️</span>
              You can create multiple warrior profiles for the same account. Each profile has its own progress and achievements!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
