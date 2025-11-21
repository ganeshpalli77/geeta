import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import {
  Users,
  Video,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export function AdminStats() {
  const { videoSubmissions, sloganSubmissions, quizAttempts } = useApp();

  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];
  
  const totalProfiles = users.reduce((sum: number, user: any) => sum + user.profiles.length, 0);
  const approvedVideos = videoSubmissions.filter(v => v.status === 'approved').length;
  const approvedSlogans = sloganSubmissions.filter(s => s.status === 'approved').length;
  const totalSubmissions = videoSubmissions.length + sloganSubmissions.length;
  
  // Calculate average quiz score
  const avgQuizScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
    : 0;

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentUsers = users.filter((u: any) => 
    u.profiles.some((p: any) => new Date(p.createdAt || 0) > sevenDaysAgo)
  ).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl text-[#193C77] mb-6">System Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Users</div>
              <Users className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{users.length}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Profiles</div>
              <Users className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{totalProfiles}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">New Users (7 days)</div>
              <TrendingUp className="w-5 h-5 text-[#D55328]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{recentUsers}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Quiz Attempts</div>
              <BookOpen className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{quizAttempts.length}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Quiz Score</div>
              <Award className="w-5 h-5 text-[#E8C56E]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{avgQuizScore}%</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Submissions</div>
              <TrendingUp className="w-5 h-5 text-[#D55328]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{totalSubmissions}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Video Submissions</div>
              <Video className="w-5 h-5 text-[#D55328]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{videoSubmissions.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {approvedVideos} approved
            </div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Slogan Submissions</div>
              <MessageSquare className="w-5 h-5 text-[#E8C56E]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{sloganSubmissions.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {approvedSlogans} approved
            </div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Approval Rate</div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">
              {totalSubmissions > 0 
                ? Math.round(((approvedVideos + approvedSlogans) / totalSubmissions) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Timeline */}
      <Card className="p-6">
        <h2 className="text-xl text-[#193C77] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {quizAttempts.slice(-5).reverse().map((attempt) => (
            <div key={attempt.id} className="flex items-center justify-between p-3 bg-[#FFF8ED] rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#193C77]" />
                <div>
                  <div className="text-sm text-[#822A12]">Quiz Completed</div>
                  <div className="text-xs text-gray-500">
                    {new Date(attempt.completedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold text-[#D55328]">
                {attempt.score}%
              </div>
            </div>
          ))}
          {quizAttempts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
