import React, { useState, useEffect } from 'react';
import { backendAPI, type BackendProfile } from '../../services/backendAPI';
import { useApp } from '../../contexts/AppContext';
import { User, Users, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileManagerProps {
  userId: string;
  onProfileSelect?: (profileId: string) => void;
}

export function ProfileManager({ userId, onProfileSelect }: ProfileManagerProps) {
  const { switchProfile, currentProfile } = useApp();
  const [profiles, setProfiles] = useState<BackendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [userId]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await backendAPI.getProfilesByUser(userId);
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      await backendAPI.setActiveProfile(userId, profileId);
      await switchProfile(profileId);
      await loadProfiles();
      toast.success('Profile switched successfully');
      onProfileSelect?.(profileId);
    } catch (error) {
      console.error('Error switching profile:', error);
      toast.error('Failed to switch profile');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      await backendAPI.deleteProfile(profileId);
      await loadProfiles();
      toast.success('Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            My Profiles ({profiles.length})
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Profile
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No profiles yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Your First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                profile.isActive
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              {profile.isActive && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    <Check className="w-3 h-3" />
                    Active
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-gray-500">PRN: {profile.prn}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">DOB:</span> {profile.dob}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Language:</span>{' '}
                    {profile.preferredLanguage.toUpperCase()}
                  </p>
                  {profile.category && (
                    <p className="text-gray-600">
                      <span className="font-medium">Category:</span>{' '}
                      {profile.category}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  {!profile.isActive && (
                    <button
                      onClick={() => handleSwitchProfile(profile._id)}
                      className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors"
                    >
                      Switch to this profile
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProfile(profile._id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Profile</h3>
            <p className="text-gray-600 mb-4">
              Use the profile creation form to add a new profile.
            </p>
            <button
              onClick={() => setShowAddForm(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
