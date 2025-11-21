import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Plus, Crown, Coins, Check, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { backendAPI, type BackendProfile } from '../../services/backendAPI';
import { toast } from 'sonner';
import { ProfileCreationForm } from './ProfileCreationForm';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../ui/alert-dialog';

export function ProfileSelectionPage() {
  const { user, switchProfile, currentProfile } = useApp();
  const [profiles, setProfiles] = useState<BackendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<BackendProfile | null>(null);

  // Initialize selected profile with current active profile
  useEffect(() => {
    loadProfiles();
  }, [user?.id]);

  // Add refresh button handler
  const handleRefresh = async () => {
    console.log(' Manually refreshing profiles...');
    await loadProfiles();
    toast.success('Profiles refreshed!');
  };

  useEffect(() => {
    if (currentProfile?.id) {
      setSelectedProfileId(currentProfile.id);
    }
  }, [currentProfile?.id]);

  useEffect(() => {
    console.log('ProfileSelectionPage - User state:', user);
    console.log('ProfileSelectionPage - User ID:', user?.id);
    
    if (user?.id) {
      console.log('Loading profiles for user:', user.id);
      loadProfiles();
    } else if (user !== undefined) {
      // User object exists but no ID - shouldn't happen but handle it
      console.log('User exists but no ID');
      setLoading(false);
    }
  }, [user?.id]);

  const loadProfiles = async () => {
    if (!user?.id) {
      console.log('No user ID available for loading profiles');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching profiles for user ID:', user.id);
      
      // Add cache-busting parameter to force fresh data
      const timestamp = Date.now();
      const data = await backendAPI.getProfilesByUser(user.id);
      console.log('Profiles fetched from backend:', data);
      console.log('Profile credits:', data.map(p => ({ name: p.name, credits: p.credits?.total || 0 })));
      
      // Ensure data is an array
      const profilesArray = Array.isArray(data) ? data : [];
      console.log('Profiles array:', profilesArray);
      console.log('Number of profiles:', profilesArray.length);
      
      setProfiles(profilesArray);
      
      // Set the active profile if it exists
      if (currentProfile?.id) {
        setSelectedProfileId(currentProfile.id);
      }
      
      // Don't auto-show create form, let user click the button
      // This gives them a choice to see the empty state first
    } catch (error) {
      console.error('Error loading profiles:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      setProfiles([]);
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
    
    // Set selected state immediately for visual feedback
    setSelectedProfileId(profileId);
    
    try {
      await backendAPI.setActiveProfile(user.id, profileId);
      await switchProfile(profileId);
      toast.success('Profile activated! 🎮');
      
      // Navigate to dashboard after successful selection
      setTimeout(() => {
        window.location.hash = '#dashboard';
      }, 1000);
    } catch (error) {
      console.error('Error selecting profile:', error);
      toast.error('Failed to select profile');
      setSelectedProfileId(null);
    }
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleProfileCreated = () => {
    setShowCreateForm(false);
    loadProfiles();
  };

  const handleDeleteClick = (profile: BackendProfile, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setProfileToDelete(profile);
    setShowDeleteDialog(true);
  };

  const handleDeleteProfile = async () => {
    if (!profileToDelete || !user?.id) return;
    
    try {
      await backendAPI.deleteProfile(profileToDelete._id);
      toast.success('Profile deleted successfully!');
      
      // Reload profiles
      await loadProfiles();
      
      // If deleted profile was active, clear selection
      if (currentProfile?.id === profileToDelete._id) {
        setSelectedProfileId(null);
      }
      
      setShowDeleteDialog(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  // Color schemes for profile cards - professional gradients
  const colorSchemes = [
    { bgGradient: 'linear-gradient(135deg, #FFE135 0%, #FFC635 100%)', text: 'text-gray-800', shadow: 'shadow-yellow-200' }, // Yellow Gradient
    { bgGradient: 'linear-gradient(135deg, #FF7C35 0%, #FF5E35 100%)', text: 'text-gray-800', shadow: 'shadow-orange-200' }, // Orange Gradient
    { bgGradient: 'linear-gradient(135deg, #70DBFF 0%, #50C5FF 100%)', text: 'text-gray-800', shadow: 'shadow-blue-200' },   // Blue Gradient
  ];

  const getColorScheme = (index: number) => {
    return colorSchemes[index % colorSchemes.length];
  };

  // Get credits from profile data
  const getCredits = (profile: BackendProfile) => {
    return profile.credits?.total || 0;
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setShowCreateForm(false);
              if (profiles.length === 0) {
                toast.info('Please create a profile to continue');
              }
            }}
            className="mb-6 px-4 py-2 !bg-gray-500 hover:!bg-gray-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-semibold"
            style={{ backgroundColor: '#6B7280' }}
            disabled={profiles.length === 0}
          >
            ← Back to Profiles
          </button>
          <ProfileCreationForm onSuccess={handleProfileCreated} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no profiles
  if (!loading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            No Profiles Yet
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create your first profile to get started
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            Logged in as: {user?.email && !user.email.includes('placeholder') ? user.email : user?.phone || 'user-' + user?.id?.substring(0, 8)}
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-black text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Profile
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Select Your Profile
            </h1>
            <p className="text-base text-gray-600 font-normal">
              Choose a profile to continue
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.email && !user.email.includes('placeholder') ? user.email : user?.phone || 'User ID: ' + user?.id?.substring(0, 12)}
            </p>
          </div>
        </motion.div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {profiles.map((profile, index) => {
            const colors = getColorScheme(index);
            // Check if this profile is active using both currentProfile and selectedProfileId
            const isActive = 
              currentProfile?.id === profile._id || 
              selectedProfileId === profile._id ||
              currentProfile?.prn === profile.prn; // Also check by PRN as fallback
            const credits = getCredits(profile);

            return (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer"
              >
                <div 
                  className={`relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all h-[200px] flex flex-col ${colors.shadow}`}
                  style={{ backgroundImage: colors.bgGradient }}
                >
                  {/* Active Badge - Top Left */}
                  {isActive && (
                    <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-purple-200 z-10">
                      <Crown className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-bold text-purple-600">Active</span>
                    </div>
                  )}

                  {/* Delete Button - Top Right */}
                  <button
                    onClick={(e) => handleDeleteClick(profile, e)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 transition-all group z-20"
                    title="Delete profile"
                    style={{ right: '12px', top: '12px' }}
                  >
                    <Trash2 className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors drop-shadow-lg" />
                  </button>

                  {/* Content */}
                  <div className="mb-4 flex items-center gap-3">
                    {/* Profile Photo */}
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white/50">
                      <span className="text-2xl font-bold text-black">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Name and PRN */}
                    <div className="flex-1 min-w-0">
                      <h2 className={`text-xl font-bold mb-0.5 ${colors.text} truncate`}>
                        {profile.name}
                      </h2>
                      <p className={`text-sm font-medium ${colors.text} opacity-70`}>
                        PRN: {profile.prn}
                      </p>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className={`mb-4 flex items-center gap-2 ${colors.text}`}>
                    <Coins className="w-4 h-4" />
                    <span className="text-sm font-medium">Credits: {credits}</span>
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectProfile(profile._id)}
                    disabled={isActive}
                    className="w-full !bg-black hover:!bg-gray-900 !text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all opacity-80 hover:opacity-100 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-100"
                    style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                  >
                    {isActive && <Check className="w-5 h-5" />}
                    {isActive ? 'Profile Selected' : 'Select Profile'}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Create New Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: profiles.length * 0.05 }}
            onClick={handleCreateNew}
            className="cursor-pointer"
          >
            <div className="relative rounded-2xl p-6 shadow-md hover:shadow-xl transition-all h-[200px] flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50/30">
              <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center mb-4 shadow-sm">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Create New Profile
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Add another profile
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{profileToDelete?.name}</strong>? 
              This action cannot be undone and all progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProfile}
              className="!bg-red-600 hover:!bg-red-700 !text-white"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
