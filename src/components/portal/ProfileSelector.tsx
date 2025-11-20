import React, { useState, useEffect } from 'react';
import { backendAPI, type BackendProfile } from '../../services/backendAPI';
import { useApp } from '../../contexts/AppContext';
import { User, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSelectorProps {
  userId: string;
  compact?: boolean;
}

export function ProfileSelector({ userId, compact = false }: ProfileSelectorProps) {
  const { switchProfile, currentProfile } = useApp();
  const [profiles, setProfiles] = useState<BackendProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<BackendProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [userId]);

  const loadProfiles = async () => {
    try {
      const data = await backendAPI.getProfilesByUser(userId);
      setProfiles(data);
      
      const active = data.find(p => p.isActive);
      setActiveProfile(active || null);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      setLoading(true);
      await backendAPI.setActiveProfile(userId, profileId);
      await switchProfile(profileId);
      await loadProfiles();
      setIsOpen(false);
      toast.success('Profile switched successfully');
    } catch (error) {
      console.error('Error switching profile:', error);
      toast.error('Failed to switch profile');
    } finally {
      setLoading(false);
    }
  };

  if (profiles.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {activeProfile?.name || 'Select Profile'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="p-2 space-y-1">
                {profiles.map((profile) => (
                  <button
                    key={profile._id}
                    onClick={() => handleSwitchProfile(profile._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      profile.isActive
                        ? 'bg-orange-50 text-orange-900'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                    disabled={loading}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{profile.name}</p>
                      <p className="text-xs text-gray-500">PRN: {profile.prn}</p>
                    </div>
                    {profile.isActive && (
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Profile</h3>
      
      {activeProfile && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-orange-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{activeProfile.name}</p>
            <p className="text-sm text-gray-500">PRN: {activeProfile.prn}</p>
          </div>
        </div>
      )}

      {profiles.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 mb-2">Switch to:</p>
          {profiles
            .filter(p => !p.isActive)
            .map((profile) => (
              <button
                key={profile._id}
                onClick={() => handleSwitchProfile(profile._id)}
                className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                disabled={loading}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{profile.name}</p>
                  <p className="text-xs text-gray-500">PRN: {profile.prn}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
