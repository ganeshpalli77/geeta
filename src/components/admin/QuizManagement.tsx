import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BookOpen, TrendingUp, Award, Clock, Settings, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getQuizConfig, updateQuizConfig } from '../../services/dailyQuizService';

export function QuizManagement() {
  const { quizAttempts } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Quiz configuration state
  const [config, setConfig] = useState({
    dailyQuizQuestionCount: 10,
    easyPercentage: 40,
    mediumPercentage: 40,
    hardPercentage: 20,
  });

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

  // Load quiz configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const fetchedConfig = await getQuizConfig();
      setConfig(fetchedConfig);
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Failed to load quiz configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    // Validate percentages
    const total = config.easyPercentage + config.mediumPercentage + config.hardPercentage;
    if (total !== 100) {
      toast.error('Percentages must add up to 100%');
      return;
    }

    if (config.dailyQuizQuestionCount < 5 || config.dailyQuizQuestionCount > 50) {
      toast.error('Question count must be between 5 and 50');
      return;
    }

    setIsSaving(true);
    try {
      await updateQuizConfig(config);
      toast.success('Quiz configuration updated successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to update quiz configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigChange = (field: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateDistribution = () => {
    const total = config.dailyQuizQuestionCount;
    const easy = Math.round((total * config.easyPercentage) / 100);
    const medium = Math.round((total * config.mediumPercentage) / 100);
    const hard = total - easy - medium;
    return { easy, medium, hard };
  };

  const distribution = calculateDistribution();

  return (
    <div className="space-y-6">
      {/* Daily Quiz Configuration */}
      <Card className="p-6">
        <h2 className="text-2xl text-[#193C77] mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Daily Quiz Configuration
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionCount" className="text-[#193C77]">
                Number of Questions per Daily Quiz
              </Label>
              <Input
                id="questionCount"
                type="number"
                min="5"
                max="50"
                value={config.dailyQuizQuestionCount}
                onChange={(e) => handleConfigChange('dailyQuizQuestionCount', parseInt(e.target.value) || 10)}
                className="mt-2"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Range: 5-50 questions</p>
            </div>

            <div className="space-y-3">
              <Label className="text-[#193C77]">Difficulty Distribution (%)</Label>
              
              <div>
                <Label htmlFor="easyPercent" className="text-sm text-gray-600">
                  Easy Questions
                </Label>
                <Input
                  id="easyPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={config.easyPercentage}
                  onChange={(e) => handleConfigChange('easyPercentage', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="mediumPercent" className="text-sm text-gray-600">
                  Medium Questions
                </Label>
                <Input
                  id="mediumPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={config.mediumPercentage}
                  onChange={(e) => handleConfigChange('mediumPercentage', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="hardPercent" className="text-sm text-gray-600">
                  Hard Questions
                </Label>
                <Input
                  id="hardPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={config.hardPercentage}
                  onChange={(e) => handleConfigChange('hardPercentage', parseInt(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div className="text-sm">
                Total: <span className={`font-bold ${
                  config.easyPercentage + config.mediumPercentage + config.hardPercentage === 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {config.easyPercentage + config.mediumPercentage + config.hardPercentage}%
                </span>
                {config.easyPercentage + config.mediumPercentage + config.hardPercentage !== 100 && (
                  <span className="text-red-600 ml-2">(Must equal 100%)</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveConfig}
                disabled={isSaving || isLoading}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: '#D55328' }}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
              <Button
                onClick={loadConfig}
                disabled={isLoading}
                variant="outline"
                className="rounded-[25px]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#FFF8ED] p-6 rounded-xl">
            <h3 className="text-lg text-[#193C77] mb-4 font-semibold">Question Distribution Preview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Total Questions:</span>
                <span className="text-2xl font-bold text-[#822A12]">{config.dailyQuizQuestionCount}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <div className="text-sm font-semibold text-green-700">Easy</div>
                    <div className="text-xs text-gray-600">{config.easyPercentage}%</div>
                  </div>
                  <div className="text-xl font-bold text-green-700">{distribution.easy}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <div className="text-sm font-semibold text-yellow-700">Medium</div>
                    <div className="text-xs text-gray-600">{config.mediumPercentage}%</div>
                  </div>
                  <div className="text-xl font-bold text-yellow-700">{distribution.medium}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <div className="text-sm font-semibold text-red-700">Hard</div>
                    <div className="text-xs text-gray-600">{config.hardPercentage}%</div>
                  </div>
                  <div className="text-xl font-bold text-red-700">{distribution.hard}</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> All users will receive the same questions for each day. 
                  Questions are randomly selected using a date-based seed to ensure consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quiz Statistics */}
      <Card className="p-6">
        <h2 className="text-2xl text-[#193C77] mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Quiz Statistics
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
