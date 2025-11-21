import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Trophy,
  BookOpen,
  Video,
  MessageSquare,
  Puzzle,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export function DashboardPage() {
  const {
    currentProfile,
    language,
    quizAttempts,
    videoSubmissions,
    sloganSubmissions,
    imageParts,
    getTotalScore,
    collectImagePart,
  } = useApp();
  const t = useTranslation(language);

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-6 md:p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl md:text-2xl text-[#822A12] mb-2">No Profile Selected</h2>
          <p className="text-[#193C77] mb-6">Please create or select a profile to view your dashboard</p>
        </Card>
      </div>
    );
  }

  const profileQuizzes = quizAttempts.filter(q => q.profileId === currentProfile.id);
  const profileVideos = videoSubmissions.filter(v => v.profileId === currentProfile.id);
  const profileSlogans = sloganSubmissions.filter(s => s.profileId === currentProfile.id);
  const collectedParts = imageParts.filter(p => p.collected).length;
  const totalScore = getTotalScore();

  const handleCollectPart = () => {
    const success = collectImagePart();
    if (success) {
      toast.success('🎉 You collected a new puzzle piece! +10 points');
    } else {
      toast.error('You have already collected today\'s piece. Come back tomorrow!');
    }
  };

  const quizScore = profileQuizzes.reduce((sum, q) => sum + q.score, 0);
  const eventScore = totalScore - quizScore - (collectedParts * 10);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      {/* Welcome Header */}
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2">
          {t('welcomeBack')}, {currentProfile.name}!
        </h1>
        <p className="text-sm md:text-base text-[#193C77]">Here's your Geeta Olympiad performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-12">
        <Card className="p-6 bg-gradient-to-br from-[#D55328] to-[#822A12] text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">{totalScore}</div>
              <div className="text-sm opacity-90">{t('totalScore')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#193C77] to-[#0f2a5a] text-white">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">{profileQuizzes.length}</div>
              <div className="text-sm opacity-90">{t('quizzesAttempted')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#E8C56E] to-[#d4b15e] text-[#822A12]">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <div className="text-right">
              <div className="text-3xl mb-1">
                {profileVideos.length + profileSlogans.length}
              </div>
              <div className="text-sm opacity-90">{t('eventsParticipated')}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#FFF8ED] to-[#f5ebd8] border-2 border-[#E8C56E]">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 text-[#D55328]" />
            <div className="text-right">
              <div className="text-3xl text-[#D55328] mb-1">#-</div>
              <div className="text-sm text-[#193C77]">{t('currentRank')}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
        {/* Image Puzzle Progress */}
        <Card className="p-4 md:p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
            <h2 className="text-xl md:text-2xl text-[#193C77] flex items-center gap-2">
              <Puzzle className="w-5 h-5 md:w-6 md:h-6 text-[#D55328]" />
              {t('imagePuzzle')}
            </h2>
            <div className="text-left sm:text-right">
              <div className="text-xs md:text-sm text-gray-600">{t('partsCollected')}</div>
              <div className="text-xl md:text-2xl text-[#D55328]">{collectedParts}/45</div>
            </div>
          </div>

          <Progress value={(collectedParts / 45) * 100} className="h-4 mb-6" />

          <div className="grid grid-cols-9 gap-1 mb-6">
            {imageParts.map((part) => (
              <div
                key={part.id}
                className={`aspect-square rounded-sm ${
                  part.collected
                    ? 'bg-[#E8C56E]'
                    : 'bg-gray-200'
                }`}
                title={part.collected ? `Collected on ${new Date(part.collectedDate!).toLocaleDateString()}` : 'Not collected'}
              />
            ))}
          </div>

          {collectedParts === 45 ? (
            <div className="text-center p-4 bg-[#FFF8ED] rounded-2xl border-2 border-[#E8C56E]">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-[#D55328]" />
              <p className="text-[#822A12]">{t('puzzleComplete')}</p>
            </div>
          ) : (
            <Button
              onClick={handleCollectPart}
              className="w-full rounded-[25px]"
              style={{ backgroundColor: '#D55328' }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('collectToday')}
            </Button>
          )}
        </Card>

        {/* Quick Stats */}
        <Card className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">Quick Stats</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#193C77] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Quiz Score</div>
                  <div className="text-xl text-[#822A12]">{quizScore}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D55328] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Event Score</div>
                  <div className="text-xl text-[#822A12]">{eventScore}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8C56E] flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-[#193C77]" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Puzzle Score</div>
                  <div className="text-xl text-[#822A12]">
                    {collectedParts * 10 + (collectedParts === 45 ? 100 : 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 md:mb-6">Recent Activity</h2>
        
        <div className="space-y-3">
          {profileQuizzes.length === 0 && profileVideos.length === 0 && profileSlogans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No activity yet. Start participating in events!</p>
            </div>
          )}

          {profileQuizzes.slice(0, 3).map((quiz) => (
            <div key={quiz.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-[#FFF8ED] rounded-xl">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#193C77] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base text-[#822A12]">{quiz.type.toUpperCase()} Completed</div>
                <div className="text-xs md:text-sm text-gray-600">
                  Score: {quiz.score} | Correct: {quiz.correctAnswers}/{quiz.totalQuestions}
                </div>
              </div>
              <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                {new Date(quiz.completedAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          {profileVideos.slice(0, 2).map((video) => (
            <div key={video.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-[#FFF8ED] rounded-xl">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D55328] flex items-center justify-center flex-shrink-0">
                <Video className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base text-[#822A12]">Video Submitted</div>
                <div className="text-xs md:text-sm text-gray-600">Status: {video.status}</div>
              </div>
              <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                {new Date(video.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          {profileSlogans.slice(0, 2).map((slogan) => (
            <div key={slogan.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-[#FFF8ED] rounded-xl">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#E8C56E] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-[#193C77]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base text-[#822A12]">Slogan Submitted</div>
                <div className="text-xs md:text-sm text-gray-600">Status: {slogan.status}</div>
              </div>
              <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                {new Date(slogan.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
