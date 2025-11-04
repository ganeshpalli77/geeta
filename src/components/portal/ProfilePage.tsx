import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { User, Plus, Edit, UserCircle } from 'lucide-react';

export function ProfilePage() {
  const {
    user,
    currentProfile,
    createProfile,
    switchProfile,
    updateProfile,
    language,
  } = useApp();
  const t = useTranslation(language);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    prn: currentProfile?.prn || '',
    dob: currentProfile?.dob || '',
    preferredLanguage: currentProfile?.preferredLanguage || 'en',
  });

  const handleCreateProfile = () => {
    if (!formData.name || !formData.prn || !formData.dob) {
      toast.error('Please fill all fields');
      return;
    }

    createProfile(formData);
    toast.success('Profile created successfully!');
    setIsCreating(false);
    setFormData({ name: '', prn: '', dob: '', preferredLanguage: 'en' });
  };

  const handleUpdateProfile = () => {
    if (!currentProfile) return;
    
    if (!formData.name || !formData.prn || !formData.dob) {
      toast.error('Please fill all fields');
      return;
    }

    updateProfile(currentProfile.id, formData);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleSwitchProfile = (profileId: string) => {
    switchProfile(profileId);
    toast.success('Profile switched successfully!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl text-[#822A12] mb-2">{t('profile')}</h1>
          <p className="text-gray-600">Manage your profiles and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Current Profile */}
          <Card className="p-6 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl text-[#822A12]">Current Profile</h2>
              {currentProfile && (
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-[25px] border-[#D55328] text-[#D55328] hover:bg-[#D55328] hover:text-white"
                      onClick={() => {
                        setFormData({
                          name: currentProfile.name,
                          prn: currentProfile.prn,
                          dob: currentProfile.dob,
                          preferredLanguage: currentProfile.preferredLanguage,
                        });
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-[#822A12]">{t('editProfile')}</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-gray-700">{t('name')}</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-prn" className="text-gray-700">{t('prn')}</Label>
                        <Input
                          id="edit-prn"
                          value={formData.prn}
                          onChange={(e) =>
                            setFormData({ ...formData, prn: e.target.value })
                          }
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-dob" className="text-gray-700">{t('dob')}</Label>
                        <Input
                          id="edit-dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) =>
                            setFormData({ ...formData, dob: e.target.value })
                          }
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lang" className="text-gray-700">{t('preferredLanguage')}</Label>
                        <Select
                          value={formData.preferredLanguage}
                          onValueChange={(value) =>
                            setFormData({ ...formData, preferredLanguage: value })
                          }
                        >
                          <SelectTrigger id="edit-lang" className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleUpdateProfile}
                        className="w-full rounded-[25px] bg-[#D55328] text-white hover:bg-[#C44820]"
                      >
                        {t('saveProfile')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {currentProfile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D55328] flex items-center justify-center">
                    <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl text-[#822A12]">{currentProfile.name}</h3>
                    <p className="text-gray-600">{currentProfile.prn}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">{t('dob')}:</span>
                    <span className="text-gray-800">
                      {new Date(currentProfile.dob).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">{t('preferredLanguage')}:</span>
                    <span className="text-gray-800">
                      {currentProfile.preferredLanguage === 'en' ? 'English' : 'हिंदी'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-800">
                      {new Date(currentProfile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">{t('noProfile')}</p>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                  <DialogTrigger asChild>
                    <Button className="rounded-[25px] bg-[#D55328] text-white hover:bg-[#C44820]">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('createProfile')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-[#822A12]">{t('createProfile')}</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Create a new profile to start participating
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">{t('name')}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your name"
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prn" className="text-gray-700">{t('prn')}</Label>
                        <Input
                          id="prn"
                          value={formData.prn}
                          onChange={(e) =>
                            setFormData({ ...formData, prn: e.target.value })
                          }
                          placeholder="Enter your PRN"
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-gray-700">{t('dob')}</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dob}
                          onChange={(e) =>
                            setFormData({ ...formData, dob: e.target.value })
                          }
                          className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lang" className="text-gray-700">{t('preferredLanguage')}</Label>
                        <Select
                          value={formData.preferredLanguage}
                          onValueChange={(value) =>
                            setFormData({ ...formData, preferredLanguage: value })
                          }
                        >
                          <SelectTrigger id="lang" className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCreateProfile}
                        className="w-full rounded-[25px] bg-[#D55328] text-white hover:bg-[#C44820]"
                      >
                        {t('createProfile')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </Card>

          {/* All Profiles */}
          <Card className="p-6 bg-white border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl text-[#822A12]">All Profiles</h2>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[25px] border-[#D55328] text-[#D55328] hover:bg-[#D55328] hover:text-white"
                    onClick={() => {
                      setFormData({ name: '', prn: '', dob: '', preferredLanguage: 'en' });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-[#822A12]">{t('createProfile')}</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Create a new profile to start participating
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name" className="text-gray-700">{t('name')}</Label>
                      <Input
                        id="new-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-prn" className="text-gray-700">{t('prn')}</Label>
                      <Input
                        id="new-prn"
                        value={formData.prn}
                        onChange={(e) =>
                          setFormData({ ...formData, prn: e.target.value })
                        }
                        placeholder="Enter your PRN"
                        className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-dob" className="text-gray-700">{t('dob')}</Label>
                      <Input
                        id="new-dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="border-gray-300 focus:border-[#D55328] focus:ring-[#D55328]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-lang" className="text-gray-700">{t('preferredLanguage')}</Label>
                      <Select
                        value={formData.preferredLanguage}
                        onValueChange={(value) =>
                          setFormData({ ...formData, preferredLanguage: value })
                        }
                      >
                        <SelectTrigger id="new-lang" className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleCreateProfile}
                      className="w-full rounded-[25px] bg-[#D55328] text-white hover:bg-[#C44820]"
                    >
                      {t('createProfile')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {user && user.profiles.length > 0 ? (
              <div className="space-y-3">
                {user.profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      currentProfile?.id === profile.id
                        ? 'border-[#D55328] bg-[#FFF8F5] shadow-sm'
                        : 'border-gray-200 hover:border-[#D55328] hover:shadow-sm'
                    }`}
                    onClick={() => handleSwitchProfile(profile.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          currentProfile?.id === profile.id
                            ? 'bg-[#D55328]'
                            : 'bg-gray-200'
                        }`}
                      >
                        <UserCircle
                          className={`w-8 h-8 ${
                            currentProfile?.id === profile.id ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[#822A12]">{profile.name}</h3>
                        <p className="text-sm text-gray-600">{profile.prn}</p>
                      </div>
                      {currentProfile?.id === profile.id && (
                        <div className="px-3 py-1 bg-[#D55328] text-white rounded-full text-sm">
                          Active
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No profiles created yet</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
