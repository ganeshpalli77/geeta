import { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export function LeaderboardPage() {
  const { language, quizAttempts, videoSubmissions, sloganSubmissions, imageParts } = useApp();
  const t = useTranslation(language);

  // Calculate leaderboard data
  const leaderboardData = useMemo(() => {
    const usersData = localStorage.getItem('geetaOlympiadUsers');
    if (!usersData) return [];

    const users = JSON.parse(usersData);
    const scores: Array<{
      profileId: string;
      name: string;
      prn: string;
      totalScore: number;
      quizScore: number;
      eventScore: number;
      weeklyScore: number;
    }> = [];

    users.forEach((user: any) => {
      user.profiles.forEach((profile: any) => {
        const profileQuizzes = quizAttempts.filter(q => q.profileId === profile.id);
        const profileVideos = videoSubmissions.filter(v => v.profileId === profile.id);
        const profileSlogans = sloganSubmissions.filter(s => s.profileId === profile.id);

        const quizScore = profileQuizzes.reduce((sum, q) => sum + q.score, 0);
        const videoScore = profileVideos
          .filter(v => v.creditScore)
          .reduce((sum, v) => sum + (v.creditScore || 0), 0);
        const sloganScore = profileSlogans
          .filter(s => s.creditScore)
          .reduce((sum, s) => sum + (s.creditScore || 0), 0);

        const collectedParts = imageParts.filter(p => p.collected).length;
        const puzzleScore = collectedParts * 10 + (collectedParts === 45 ? 100 : 0);

        const totalScore = quizScore + videoScore + sloganScore + puzzleScore;
        const eventScore = videoScore + sloganScore + puzzleScore;

        // Calculate weekly score (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyQuizScore = profileQuizzes
          .filter(q => new Date(q.completedAt) > oneWeekAgo)
          .reduce((sum, q) => sum + q.score, 0);
        const weeklyVideoScore = profileVideos
          .filter(v => v.creditScore && new Date(v.submittedAt) > oneWeekAgo)
          .reduce((sum, v) => sum + (v.creditScore || 0), 0);
        const weeklySloganScore = profileSlogans
          .filter(s => s.creditScore && new Date(s.submittedAt) > oneWeekAgo)
          .reduce((sum, s) => sum + (s.creditScore || 0), 0);

        const weeklyScore = weeklyQuizScore + weeklyVideoScore + weeklySloganScore;

        if (totalScore > 0) {
          scores.push({
            profileId: profile.id,
            name: profile.name,
            prn: profile.prn,
            totalScore,
            quizScore,
            eventScore,
            weeklyScore,
          });
        }
      });
    });

    return scores;
  }, [quizAttempts, videoSubmissions, sloganSubmissions, imageParts]);

  const overallLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.quizScore !== a.quizScore) return b.quizScore - a.quizScore;
      return b.eventScore - a.eventScore;
    });
  }, [leaderboardData]);

  const weeklyLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => {
      if (b.weeklyScore !== a.weeklyScore) return b.weeklyScore - a.weeklyScore;
      if (b.quizScore !== a.quizScore) return b.quizScore - a.quizScore;
      return b.eventScore - a.eventScore;
    });
  }, [leaderboardData]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <Award className="w-6 h-6 text-gray-300" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-400';
      default:
        return 'bg-[#FFF8ED]';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2 flex items-center gap-2 md:gap-3">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#E8C56E]" />
          {t('leaderboard')}
        </h1>
        <p className="text-sm md:text-base text-[#193C77]">Top performers in the Geeta Olympiad</p>
      </div>

      <Tabs defaultValue="overall" className="space-y-6 md:space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overall" className="text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">{t('overallLeaderboard')}</span>
            <span className="sm:hidden">Overall</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs md:text-sm">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">{t('weeklyLeaderboard')}</span>
            <span className="sm:hidden">Weekly</span>
          </TabsTrigger>
        </TabsList>

        {/* Overall Leaderboard */}
        <TabsContent value="overall">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">
              All-Time Top Performers
            </h2>

            {overallLeaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No participants yet. Be the first to join!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header - Hidden on mobile, shown on larger screens */}
                <div className="hidden md:grid grid-cols-12 gap-2 lg:gap-4 px-2 md:px-4 py-2 text-xs md:text-sm text-gray-600 border-b-2">
                  <div className="col-span-1">{t('rank')}</div>
                  <div className="col-span-4">{t('participant')}</div>
                  <div className="col-span-2 text-center">{t('totalScore')}</div>
                  <div className="col-span-2 text-center">{t('quizScore')}</div>
                  <div className="col-span-3 text-center">{t('eventScore')}</div>
                </div>

                {/* Leaderboard Entries */}
                {overallLeaderboard.map((entry, index) => (
                  <div
                    key={entry.profileId}
                    className={`md:grid md:grid-cols-12 gap-2 lg:gap-4 px-3 md:px-4 py-3 md:py-4 rounded-xl md:items-center ${getRankBgColor(
                      index + 1
                    )}`}
                  >
                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-start gap-3 mb-2">
                      <div className="flex-shrink-0">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#822A12] font-medium">{entry.name}</div>
                        <div className="text-xs text-gray-600">{entry.prn}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-[#D55328] font-medium">{entry.totalScore}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                    <div className="flex md:hidden justify-around text-center text-sm border-t pt-2 mt-2">
                      <div>
                        <div className="text-[#193C77] font-medium">{entry.quizScore}</div>
                        <div className="text-xs text-gray-500">Quiz</div>
                      </div>
                      <div>
                        <div className="text-[#822A12] font-medium">{entry.eventScore}</div>
                        <div className="text-xs text-gray-500">Event</div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block col-span-1">
                      <div className="flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                    </div>
                    <div className="hidden md:block col-span-4">
                      <div className="text-[#822A12]">{entry.name}</div>
                      <div className="text-sm text-gray-600">{entry.prn}</div>
                    </div>
                    <div className="hidden md:block col-span-2 text-center">
                      <div className="text-xl lg:text-2xl text-[#D55328]">
                        {entry.totalScore}
                      </div>
                    </div>
                    <div className="hidden md:block col-span-2 text-center">
                      <div className="text-base lg:text-lg text-[#193C77]">
                        {entry.quizScore}
                      </div>
                    </div>
                    <div className="hidden md:block col-span-3 text-center">
                      <div className="text-base lg:text-lg text-[#822A12]">
                        {entry.eventScore}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Weekly Leaderboard */}
        <TabsContent value="weekly">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h2 className="text-xl md:text-2xl text-[#193C77]">
                This Week's Top Performers
              </h2>
              <div className="text-xs md:text-sm text-gray-600">
                Last 7 days
              </div>
            </div>

            {weeklyLeaderboard.filter(e => e.weeklyScore > 0).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No activity this week yet. Start participating!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-2 lg:gap-4 px-2 md:px-4 py-2 text-xs md:text-sm text-gray-600 border-b-2">
                  <div className="col-span-1">{t('rank')}</div>
                  <div className="col-span-5">{t('participant')}</div>
                  <div className="col-span-3 text-center">Weekly {t('score')}</div>
                  <div className="col-span-3 text-center">{t('totalScore')}</div>
                </div>

                {/* Leaderboard Entries */}
                {weeklyLeaderboard
                  .filter(e => e.weeklyScore > 0)
                  .map((entry, index) => (
                    <div
                      key={entry.profileId}
                      className={`md:grid md:grid-cols-12 gap-2 lg:gap-4 px-3 md:px-4 py-3 md:py-4 rounded-xl md:items-center ${getRankBgColor(
                        index + 1
                      )}`}
                    >
                      {/* Mobile Layout */}
                      <div className="flex md:hidden items-start gap-3 mb-2">
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-[#822A12] font-medium">{entry.name}</div>
                          <div className="text-xs text-gray-600">{entry.prn}</div>
                        </div>
                      </div>
                      <div className="flex md:hidden justify-around text-center text-sm">
                        <div>
                          <div className="text-lg text-[#D55328] font-medium">{entry.weeklyScore}</div>
                          <div className="text-xs text-gray-500">Weekly</div>
                        </div>
                        <div>
                          <div className="text-base text-[#193C77] font-medium">{entry.totalScore}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:block col-span-1">
                        <div className="flex items-center justify-center">
                          {getRankIcon(index + 1)}
                        </div>
                      </div>
                      <div className="hidden md:block col-span-5">
                        <div className="text-[#822A12]">{entry.name}</div>
                        <div className="text-sm text-gray-600">{entry.prn}</div>
                      </div>
                      <div className="hidden md:block col-span-3 text-center">
                        <div className="text-xl lg:text-2xl text-[#D55328]">
                          {entry.weeklyScore}
                        </div>
                      </div>
                      <div className="hidden md:block col-span-3 text-center">
                        <div className="text-base lg:text-lg text-[#193C77]">
                          {entry.totalScore}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 text-center bg-gradient-to-br from-[#FFF8ED] to-white">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-[#E8C56E]" />
          <div className="text-3xl text-[#D55328] mb-1">
            {overallLeaderboard.length}
          </div>
          <div className="text-sm text-gray-600">Total Participants</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-[#FFF8ED] to-white">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#193C77]" />
          <div className="text-3xl text-[#D55328] mb-1">
            {overallLeaderboard[0]?.totalScore || 0}
          </div>
          <div className="text-sm text-gray-600">Highest Score</div>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-[#FFF8ED] to-white">
          <Award className="w-12 h-12 mx-auto mb-3 text-[#822A12]" />
          <div className="text-3xl text-[#D55328] mb-1">
            {Math.round(
              overallLeaderboard.reduce((sum, e) => sum + e.totalScore, 0) /
                (overallLeaderboard.length || 1)
            )}
          </div>
          <div className="text-sm text-gray-600">Average Score</div>
        </Card>
      </div>
    </div>
  );
}
