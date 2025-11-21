import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export function LeaderboardManagement() {
  const { quizAttempts, videoSubmissions, sloganSubmissions } = useApp();

  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];

  // Calculate scores for each profile
  const profileScores = users.flatMap((user: any) =>
    user.profiles.map((profile: any) => {
      // Quiz scores
      const profileQuizzes = quizAttempts.filter(q => q.profileId === profile.id);
      const quizScore = profileQuizzes.reduce((sum, q) => sum + q.score, 0);

      // Video scores
      const profileVideos = videoSubmissions.filter(
        v => v.profileId === profile.id && v.status === 'approved'
      );
      const videoScore = profileVideos.reduce((sum, v) => sum + (v.creditScore || 0), 0);

      // Slogan scores
      const profileSlogans = sloganSubmissions.filter(
        s => s.profileId === profile.id && s.status === 'approved'
      );
      const sloganScore = profileSlogans.reduce((sum, s) => sum + (s.creditScore || 0), 0);

      const totalScore = quizScore + videoScore + sloganScore;

      return {
        profileId: profile.id,
        name: profile.name,
        prn: profile.prn,
        quizScore,
        videoScore,
        sloganScore,
        totalScore,
        quizCount: profileQuizzes.length,
        videoCount: profileVideos.length,
        sloganCount: profileSlogans.length,
      };
    })
  );

  // Sort by total score
  const sortedProfiles = profileScores.sort((a: any, b: any) => b.totalScore - a.totalScore);

  // Get top performers
  const topPerformers = sortedProfiles.slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl text-[#193C77] mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Leaderboard Management
        </h2>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Participants</div>
              <TrendingUp className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">
              {profileScores.length}
            </div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Highest Score</div>
              <Award className="w-5 h-5 text-[#E8C56E]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">
              {sortedProfiles.length > 0 ? sortedProfiles[0].totalScore : 0}
            </div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Average Score</div>
              <Medal className="w-5 h-5 text-[#D55328]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">
              {profileScores.length > 0
                ? Math.round(
                    profileScores.reduce((sum: number, p: any) => sum + p.totalScore, 0) /
                      profileScores.length
                  )
                : 0}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <h3 className="text-lg text-[#193C77] mb-4">Top 10 Performers</h3>
          {topPerformers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No participants yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((profile: any, index: number) => (
                <div
                  key={profile.profileId}
                  className={`p-4 rounded-xl ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-200 to-gray-50 border-2 border-gray-400'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-400'
                      : 'bg-[#FFF8ED]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {index === 0 ? (
                        <Trophy className="w-8 h-8 text-yellow-600" />
                      ) : index === 1 ? (
                        <Medal className="w-8 h-8 text-gray-600" />
                      ) : index === 2 ? (
                        <Award className="w-8 h-8 text-orange-600" />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center bg-[#193C77] text-white rounded-full font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-[#822A12] font-bold text-lg">
                            {profile.name}
                          </div>
                          <div className="text-sm text-gray-600">PRN: {profile.prn}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-[#D55328] font-bold">
                            {profile.totalScore}
                          </div>
                          <div className="text-xs text-gray-500">Total Points</div>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold text-[#193C77]">
                            {profile.quizScore}
                          </span>{' '}
                          Quiz ({profile.quizCount})
                        </div>
                        <div>
                          <span className="font-semibold text-[#D55328]">
                            {profile.videoScore}
                          </span>{' '}
                          Video ({profile.videoCount})
                        </div>
                        <div>
                          <span className="font-semibold text-[#E8C56E]">
                            {profile.sloganScore}
                          </span>{' '}
                          Slogan ({profile.sloganCount})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Leaderboard */}
        {sortedProfiles.length > 10 && (
          <div className="mt-8">
            <h3 className="text-lg text-[#193C77] mb-4">All Participants</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {sortedProfiles.slice(10).map((profile: any, index: number) => (
                <div key={profile.profileId} className="p-3 bg-[#FFF8ED] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
                        {index + 11}
                      </div>
                      <div>
                        <div className="text-[#822A12] font-semibold">{profile.name}</div>
                        <div className="text-xs text-gray-500">{profile.prn}</div>
                      </div>
                    </div>
                    <div className="text-[#D55328] font-bold">{profile.totalScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
