import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { BookOpen, TrendingUp, Award, Clock } from 'lucide-react';

export function QuizManagement() {
  const { quizAttempts } = useApp();

  const usersData = localStorage.getItem('geetaOlympiadUsers');
  const users = usersData ? JSON.parse(usersData) : [];

  // Calculate statistics
  const avgScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
    : 0;

  const avgTime = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum, q) => sum + q.timeSpent, 0) / quizAttempts.length)
    : 0;

  const highestScore = quizAttempts.length > 0
    ? Math.max(...quizAttempts.map(q => q.score))
    : 0;

  // Group by quiz type
  const quizTypes = {
    mock: quizAttempts.filter(q => q.type === 'mock'),
    quiz1: quizAttempts.filter(q => q.type === 'quiz1'),
    quiz2: quizAttempts.filter(q => q.type === 'quiz2'),
    quiz3: quizAttempts.filter(q => q.type === 'quiz3'),
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl text-[#193C77] mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Quiz Management
        </h2>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Attempts</div>
              <BookOpen className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{quizAttempts.length}</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Average Score</div>
              <TrendingUp className="w-5 h-5 text-[#D55328]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{avgScore}%</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Highest Score</div>
              <Award className="w-5 h-5 text-[#E8C56E]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">{highestScore}%</div>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Time (min)</div>
              <Clock className="w-5 h-5 text-[#193C77]" />
            </div>
            <div className="text-3xl text-[#822A12] font-bold">
              {Math.round(avgTime / 60)}
            </div>
          </div>
        </div>

        {/* Quiz Type Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg text-[#193C77] mb-4">Quiz Type Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(quizTypes).map(([type, attempts]) => (
              <div key={type} className="p-4 bg-[#FFF8ED] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600 capitalize">
                    {type === 'mock' ? 'Mock Test' : `Quiz ${type.slice(-1)}`}
                  </div>
                  <div className="text-2xl text-[#822A12] font-bold">{attempts.length}</div>
                </div>
                {attempts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Avg: {Math.round(attempts.reduce((sum, q) => sum + q.score, 0) / attempts.length)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attempts */}
        <div>
          <h3 className="text-lg text-[#193C77] mb-4">Recent Quiz Attempts</h3>
          {quizAttempts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No quiz attempts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quizAttempts.slice(-10).reverse().map((attempt) => {
                const profile = users
                  .flatMap((u: any) => u.profiles)
                  .find((p: any) => p.id === attempt.profileId);

                return (
                  <div key={attempt.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-[#822A12] font-semibold mb-1">
                          {profile?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {attempt.type === 'mock' ? 'Mock Test' : `Quiz ${attempt.type.slice(-1)}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(attempt.completedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl text-[#D55328] font-bold">
                            {attempt.score}%
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg text-[#193C77] font-semibold">
                            {attempt.correctAnswers}/{attempt.totalQuestions}
                          </div>
                          <div className="text-xs text-gray-500">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg text-[#822A12] font-semibold">
                            {Math.round(attempt.timeSpent / 60)}m
                          </div>
                          <div className="text-xs text-gray-500">Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
