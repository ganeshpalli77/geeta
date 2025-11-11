import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import {
  Users,
  Video,
  MessageSquare,
  BookOpen,
  BarChart,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
} from 'lucide-react';
import { FeatureFlagsPanel } from '../admin/FeatureFlagsPanel';

export function AdminPanel() {
  const { videoSubmissions, sloganSubmissions, quizAttempts, language } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Get all users
  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];
  
  const totalProfiles = users.reduce((sum: number, user: any) => sum + user.profiles.length, 0);
  const pendingVideos = videoSubmissions.filter(v => v.status === 'pending').length;
  const pendingSlogans = sloganSubmissions.filter(s => s.status === 'pending').length;

  const handleApproveVideo = (videoId: string, score: number) => {
    const appState = localStorage.getItem('geetaOlympiadState');
    if (!appState) return;

    const state = JSON.parse(appState);
    const updatedVideos = state.videoSubmissions.map((v: any) =>
      v.id === videoId ? { ...v, status: 'approved', creditScore: score } : v
    );

    localStorage.setItem(
      'geetaOlympiadState',
      JSON.stringify({ ...state, videoSubmissions: updatedVideos })
    );

    toast.success('Video approved and scored!');
    window.location.reload();
  };

  const handleRejectVideo = (videoId: string) => {
    const appState = localStorage.getItem('geetaOlympiadState');
    if (!appState) return;

    const state = JSON.parse(appState);
    const updatedVideos = state.videoSubmissions.map((v: any) =>
      v.id === videoId ? { ...v, status: 'rejected' } : v
    );

    localStorage.setItem(
      'geetaOlympiadState',
      JSON.stringify({ ...state, videoSubmissions: updatedVideos })
    );

    toast.success('Video rejected');
    window.location.reload();
  };

  const handleApproveSlogan = (sloganId: string, score: number) => {
    const appState = localStorage.getItem('geetaOlympiadState');
    if (!appState) return;

    const state = JSON.parse(appState);
    const updatedSlogans = state.sloganSubmissions.map((s: any) =>
      s.id === sloganId ? { ...s, status: 'approved', creditScore: score } : s
    );

    localStorage.setItem(
      'geetaOlympiadState',
      JSON.stringify({ ...state, sloganSubmissions: updatedSlogans })
    );

    toast.success('Slogan approved and scored!');
    window.location.reload();
  };

  const handleRejectSlogan = (sloganId: string) => {
    const appState = localStorage.getItem('geetaOlympiadState');
    if (!appState) return;

    const state = JSON.parse(appState);
    const updatedSlogans = state.sloganSubmissions.map((s: any) =>
      s.id === sloganId ? { ...s, status: 'rejected' } : s
    );

    localStorage.setItem(
      'geetaOlympiadState',
      JSON.stringify({ ...state, sloganSubmissions: updatedSlogans })
    );

    toast.success('Slogan rejected');
    window.location.reload();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2">Admin Panel</h1>
        <p className="text-sm md:text-base text-[#193C77]">Manage users, events, and submissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-6 bg-gradient-to-br from-[#193C77] to-[#0f2a5a] text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">{totalProfiles}</div>
              <div className="text-sm opacity-90">Total Profiles</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#D55328] to-[#822A12] text-white">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">{quizAttempts.length}</div>
              <div className="text-sm opacity-90">Quiz Attempts</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#E8C56E] to-[#d4b15e] text-[#822A12]">
          <div className="flex items-center justify-between mb-4">
            <Video className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">{pendingVideos}</div>
              <div className="text-sm opacity-90">Pending Videos</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#FFF8ED] to-[#f5ebd8] border-2 border-[#E8C56E]">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-10 h-10 text-[#D55328]" />
            <div className="text-right">
              <div className="text-3xl text-[#D55328] mb-1">{pendingSlogans}</div>
              <div className="text-sm text-[#193C77]">Pending Slogans</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-8">
          <TabsList className="inline-flex md:grid w-auto md:w-full md:grid-cols-5 md:max-w-4xl">
            <TabsTrigger value="overview" className="whitespace-nowrap text-xs md:text-sm">
              <BarChart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="whitespace-nowrap text-xs md:text-sm">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="videos" className="whitespace-nowrap text-xs md:text-sm">
              <Video className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="slogans" className="whitespace-nowrap text-xs md:text-sm">
              <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Slogans
            </TabsTrigger>
            <TabsTrigger value="features" className="whitespace-nowrap text-xs md:text-sm">
              <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Features
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">System Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-2xl text-[#822A12]">{users.length}</div>
                </div>
                <Users className="w-8 h-8 text-[#193C77]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">Video Submissions</div>
                  <div className="text-2xl text-[#822A12]">{videoSubmissions.length}</div>
                </div>
                <Video className="w-8 h-8 text-[#D55328]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
                <div>
                  <div className="text-sm text-gray-600">Slogan Submissions</div>
                  <div className="text-2xl text-[#822A12]">{sloganSubmissions.length}</div>
                </div>
                <MessageSquare className="w-8 h-8 text-[#E8C56E]" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">User Management</h2>
            
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No users registered yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user: any) => (
                  <div key={user.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-[#822A12]">
                          {user.email || user.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.profiles.length} profile(s)
                        </div>
                      </div>
                    </div>
                    {user.profiles.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-[#E8C56E] space-y-2">
                        {user.profiles.map((profile: any) => (
                          <div key={profile.id} className="text-sm">
                            <span className="text-[#193C77]">{profile.name}</span>
                            <span className="text-gray-500">{profile.prn ? ` - ${profile.prn}` : ' (No PRN)'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">Video Submissions</h2>
            
            {videoSubmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No video submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videoSubmissions.map((video) => (
                  <div key={video.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm px-2 py-1 rounded ${
                            video.type === 'shloka' 
                              ? 'bg-[#193C77] text-white'
                              : 'bg-[#D55328] text-white'
                          }`}>
                            {video.type === 'shloka' ? 'Shloka Video' : 'Reel'}
                          </span>
                          <span className="text-sm px-2 py-1 bg-white rounded capitalize">
                            {video.platform}
                          </span>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              video.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : video.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {video.status}
                          </span>
                        </div>
                        <div className="text-sm text-[#193C77] truncate mb-1">
                          {video.url}
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(video.submittedAt).toLocaleString()}
                        </div>
                        {video.creditScore && (
                          <div className="text-sm text-[#D55328] mt-1">
                            Score: {video.creditScore} points
                          </div>
                        )}
                      </div>
                    </div>

                    {video.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Input
                          type="number"
                          placeholder="Score (0-100)"
                          id={`score-${video.id}`}
                          className="flex-1 text-sm"
                          min="0"
                          max="100"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                `score-${video.id}`
                              ) as HTMLInputElement;
                              const score = parseInt(input.value);
                              if (score >= 0 && score <= 100) {
                                handleApproveVideo(video.id, score);
                              } else {
                                toast.error('Please enter a score between 0 and 100');
                              }
                            }}
                            size="sm"
                            className="rounded-[25px] flex-1 sm:flex-initial text-xs md:text-sm"
                            style={{ backgroundColor: '#D55328' }}
                          >
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectVideo(video.id)}
                            size="sm"
                            variant="outline"
                            className="rounded-[25px] flex-1 sm:flex-initial text-xs md:text-sm"
                          >
                            <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Slogans Tab */}
        <TabsContent value="slogans" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">Slogan Submissions</h2>
            
            {sloganSubmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No slogan submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sloganSubmissions.map((slogan) => (
                  <div key={slogan.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            slogan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : slogan.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {slogan.status}
                        </span>
                      </div>
                      <div className="text-[#193C77] mb-2">{slogan.slogan}</div>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(slogan.submittedAt).toLocaleString()}
                      </div>
                      {slogan.creditScore && (
                        <div className="text-sm text-[#D55328] mt-1">
                          Score: {slogan.creditScore} points
                        </div>
                      )}
                    </div>

                    {slogan.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Input
                          type="number"
                          placeholder="Score (0-50)"
                          id={`slogan-score-${slogan.id}`}
                          className="flex-1 text-sm"
                          min="0"
                          max="50"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                `slogan-score-${slogan.id}`
                              ) as HTMLInputElement;
                              const score = parseInt(input.value);
                              if (score >= 0 && score <= 50) {
                                handleApproveSlogan(slogan.id, score);
                              } else {
                                toast.error('Please enter a score between 0 and 50');
                              }
                            }}
                            size="sm"
                            className="rounded-[25px] flex-1 sm:flex-initial text-xs md:text-sm"
                            style={{ backgroundColor: '#D55328' }}
                          >
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectSlogan(slogan.id)}
                            size="sm"
                            variant="outline"
                            className="rounded-[25px] flex-1 sm:flex-initial text-xs md:text-sm"
                          >
                            <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
          <Card className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-2">Feature Management</h2>
              <p className="text-sm md:text-base text-gray-600">Toggle features on/off for all users in this session</p>
            </div>
            <FeatureFlagsPanel />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
