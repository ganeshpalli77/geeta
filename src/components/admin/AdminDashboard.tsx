import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Users,
  Video,
  MessageSquare,
  BookOpen,
  BarChart,
  Trophy,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { AdminStats } from './AdminStats';
import { UserManagement } from './UserManagement';
import { SubmissionReview } from './SubmissionReview';
import { QuizManagement } from './QuizManagement';
import { LeaderboardManagement } from './LeaderboardManagement';

export function AdminDashboard() {
  const { videoSubmissions, sloganSubmissions, quizAttempts } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Get all users
  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];
  
  const totalProfiles = users.reduce((sum: number, user: any) => sum + user.profiles.length, 0);
  const pendingVideos = videoSubmissions.filter(v => v.status === 'pending').length;
  const pendingSlogans = sloganSubmissions.filter(s => s.status === 'pending').length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base text-[#193C77]">
          Comprehensive management and analytics
        </p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-6 bg-gradient-to-br from-[#193C77] to-[#0f2a5a] text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{totalProfiles}</div>
              <div className="text-sm opacity-90">Total Profiles</div>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#D55328] to-[#822A12] text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{quizAttempts.length}</div>
              <div className="text-sm opacity-90">Quiz Attempts</div>
            </div>
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#E8C56E] to-[#d4b15e] text-[#822A12]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-1">{pendingVideos}</div>
              <div className="text-sm opacity-90">Pending Videos</div>
            </div>
            <Video className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#FFF8ED] to-[#f5ebd8] border-2 border-[#E8C56E]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-[#D55328] mb-1">{pendingSlogans}</div>
              <div className="text-sm text-[#193C77]">Pending Slogans</div>
            </div>
            <MessageSquare className="w-12 h-12 text-[#D55328]" />
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-8">
          <TabsList className="inline-flex md:grid w-auto md:w-full md:grid-cols-5 md:max-w-4xl">
            <TabsTrigger value="overview" className="whitespace-nowrap text-xs md:text-sm">
              <BarChart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="whitespace-nowrap text-xs md:text-sm">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="submissions" className="whitespace-nowrap text-xs md:text-sm">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="quiz" className="whitespace-nowrap text-xs md:text-sm">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="whitespace-nowrap text-xs md:text-sm">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4 md:mt-6">
          <AdminStats />
        </TabsContent>

        <TabsContent value="users" className="mt-4 md:mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="submissions" className="mt-4 md:mt-6">
          <SubmissionReview />
        </TabsContent>

        <TabsContent value="quiz" className="mt-4 md:mt-6">
          <QuizManagement />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-4 md:mt-6">
          <LeaderboardManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
