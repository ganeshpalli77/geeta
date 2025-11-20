import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import {
  Video,
  MessageSquare,
  Puzzle,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Film,
} from 'lucide-react';

export function EventsPage() {
  const {
    currentProfile,
    language,
    submitVideo,
    submitSlogan,
    videoSubmissions,
    sloganSubmissions,
    imageParts,
    collectImagePart,
  } = useApp();
  const t = useTranslation(language);

  const [shlokaURL, setShlokaURL] = useState('');
  const [shlokaPlatform, setShlokaPlatform] = useState('youtube');
  const [reelURL, setReelURL] = useState('');
  const [reelPlatform, setReelPlatform] = useState('youtube');
  const [slogan, setSlogan] = useState('');

  if (!currentProfile) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
        <Card className="p-6 md:p-12 text-center">
          <Puzzle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl md:text-2xl text-[#822A12] mb-2">No Profile Selected</h2>
          <p className="text-sm md:text-base text-[#193C77]">Please create or select a profile to participate in events</p>
        </Card>
      </div>
    );
  }

  const handleShlokaSubmit = () => {
    if (!shlokaURL) {
      toast.error('Please enter a video URL');
      return;
    }

    submitVideo({
      profileId: currentProfile.id,
      type: 'shloka',
      url: shlokaURL,
      platform: shlokaPlatform,
    });

    toast.success('Shloka video submitted successfully! Awaiting admin review.');
    setShlokaURL('');
  };

  const handleReelSubmit = () => {
    if (!reelURL) {
      toast.error('Please enter a reel URL');
      return;
    }

    submitVideo({
      profileId: currentProfile.id,
      type: 'reel',
      url: reelURL,
      platform: reelPlatform,
    });

    toast.success('Reel submitted successfully! Awaiting admin review.');
    setReelURL('');
  };

  const handleSloganSubmit = () => {
    if (!slogan || slogan.trim().length < 10) {
      toast.error('Please enter a slogan (minimum 10 characters)');
      return;
    }

    submitSlogan(slogan);
    toast.success('Slogan submitted successfully! Awaiting admin review.');
    setSlogan('');
  };

  const handleCollectPuzzlePiece = () => {
    const success = collectImagePart();
    if (success) {
      toast.success('🎉 You collected a new puzzle piece! +10 points');
    } else {
      toast.error('You have already collected today\'s piece. Come back tomorrow!');
    }
  };

  const profileShlokaVideos = videoSubmissions.filter(v => v.profileId === currentProfile.id && v.type === 'shloka');
  const profileReels = videoSubmissions.filter(v => v.profileId === currentProfile.id && v.type === 'reel');
  const profileSlogans = sloganSubmissions.filter(s => s.profileId === currentProfile.id);
  const collectedParts = imageParts.filter(p => p.collected).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-6 md:py-12">
      <div className="mb-6 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#822A12] mb-2">{t('events')}</h1>
        <p className="text-sm md:text-base text-[#193C77]">Participate in various events and earn points</p>
      </div>

      <Tabs defaultValue="shloka" className="space-y-6 md:space-y-8">
        <TabsList className="flex flex-col md:grid w-full md:grid-cols-4 md:max-w-4xl h-auto md:h-10">
          <TabsTrigger value="shloka" className="w-full justify-start md:justify-center">
            <Video className="w-4 h-4 mr-2" />
            <span>Shloka Video</span>
          </TabsTrigger>
          <TabsTrigger value="reel" className="w-full justify-start md:justify-center">
            <Film className="w-4 h-4 mr-2" />
            <span>Reel</span>
          </TabsTrigger>
          <TabsTrigger value="slogan" className="w-full justify-start md:justify-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>Slogan</span>
          </TabsTrigger>
          <TabsTrigger value="puzzle" className="w-full justify-start md:justify-center">
            <Puzzle className="w-4 h-4 mr-2" />
            <span>Puzzle</span>
          </TabsTrigger>
        </TabsList>

        {/* Shloka Chanting Video Event */}
        <TabsContent value="shloka" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 flex items-center gap-2">
                <Video className="w-6 h-6 text-[#D55328]" />
                {t('submitShloka')}
              </h2>
              <p className="text-gray-600 mb-6">
                Share your Shloka chanting videos from the Bhagavad Geeta. Videos will be reviewed by admins and awarded points.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shlokaPlatform">{t('platform')}</Label>
                  <Select value={shlokaPlatform} onValueChange={setShlokaPlatform}>
                    <SelectTrigger id="shlokaPlatform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shlokaURL">{t('videoURL')}</Label>
                  <Input
                    id="shlokaURL"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={shlokaURL}
                    onChange={(e) => setShlokaURL(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleShlokaSubmit}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t('submitShloka')}
                </Button>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4">Your Shloka Videos</h2>
              
              {profileShlokaVideos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No shloka videos submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {profileShlokaVideos.map((video) => (
                    <div key={video.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-gray-600 mb-1">
                            Platform: <span className="capitalize">{video.platform}</span>
                          </div>
                          <div className="text-sm text-[#193C77] truncate">{video.url}</div>
                        </div>
                        <div className="ml-2">
                          {video.status === 'pending' && (
                            <div className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock className="w-4 h-4" />
                              {t('pending')}
                            </div>
                          )}
                          {video.status === 'approved' && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              {t('approved')}
                            </div>
                          )}
                          {video.status === 'rejected' && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                              <XCircle className="w-4 h-4" />
                              {t('rejected')}
                            </div>
                          )}
                        </div>
                      </div>
                      {video.creditScore && (
                        <div className="text-sm text-[#D55328]">
                          Credit Score: +{video.creditScore} points
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(video.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Reel Event */}
        <TabsContent value="reel" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 flex items-center gap-2">
                <Film className="w-6 h-6 text-[#D55328]" />
                {t('submitReel')}
              </h2>
              <p className="text-gray-600 mb-6">
                Share your creative reels about the Bhagavad Geeta. Reels will be reviewed by admins and awarded points.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reelPlatform">{t('platform')}</Label>
                  <Select value={reelPlatform} onValueChange={setReelPlatform}>
                    <SelectTrigger id="reelPlatform">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube Shorts</SelectItem>
                      <SelectItem value="instagram">Instagram Reels</SelectItem>
                      <SelectItem value="facebook">Facebook Reels</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reelURL">{t('videoURL')}</Label>
                  <Input
                    id="reelURL"
                    type="url"
                    placeholder="https://instagram.com/reel/..."
                    value={reelURL}
                    onChange={(e) => setReelURL(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleReelSubmit}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t('submitReel')}
                </Button>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4">Your Reels</h2>
              
              {profileReels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Film className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No reels submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {profileReels.map((video) => (
                    <div key={video.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-gray-600 mb-1">
                            Platform: <span className="capitalize">{video.platform}</span>
                          </div>
                          <div className="text-sm text-[#193C77] truncate">{video.url}</div>
                        </div>
                        <div className="ml-2">
                          {video.status === 'pending' && (
                            <div className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock className="w-4 h-4" />
                              {t('pending')}
                            </div>
                          )}
                          {video.status === 'approved' && (
                            <div className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              {t('approved')}
                            </div>
                          )}
                          {video.status === 'rejected' && (
                            <div className="flex items-center gap-1 text-red-600 text-sm">
                              <XCircle className="w-4 h-4" />
                              {t('rejected')}
                            </div>
                          )}
                        </div>
                      </div>
                      {video.creditScore && (
                        <div className="text-sm text-[#D55328]">
                          Credit Score: +{video.creditScore} points
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(video.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Slogan Event */}
        <TabsContent value="slogan" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#D55328]" />
                {t('submitSlogan')}
              </h2>
              <p className="text-gray-600 mb-6">
                Create inspiring slogans based on the teachings of the Bhagavad Geeta. You can submit multiple slogans.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slogan">{t('yourSlogan')}</Label>
                  <Textarea
                    id="slogan"
                    placeholder="Enter your creative slogan here..."
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    rows={4}
                    maxLength={200}
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {slogan.length}/200 characters
                  </div>
                </div>

                <Button
                  onClick={handleSloganSubmit}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t('submitSlogan')}
                </Button>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl text-[#193C77] mb-4">Your Slogans</h2>
              
              {profileSlogans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No slogans submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {profileSlogans.map((item) => (
                    <div key={item.id} className="p-4 bg-[#FFF8ED] rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[#193C77] flex-1">{item.slogan}</p>
                        <div className="ml-2">
                          {item.status === 'pending' && (
                            <div className="flex items-center gap-1 text-yellow-600 text-sm whitespace-nowrap">
                              <Clock className="w-4 h-4" />
                              {t('pending')}
                            </div>
                          )}
                          {item.status === 'approved' && (
                            <div className="flex items-center gap-1 text-green-600 text-sm whitespace-nowrap">
                              <CheckCircle className="w-4 h-4" />
                              {t('approved')}
                            </div>
                          )}
                          {item.status === 'rejected' && (
                            <div className="flex items-center gap-1 text-red-600 text-sm whitespace-nowrap">
                              <XCircle className="w-4 h-4" />
                              {t('rejected')}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.creditScore && (
                        <div className="text-sm text-[#D55328]">
                          Credit Score: +{item.creditScore} points
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(item.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Image Puzzle Event */}
        <TabsContent value="puzzle" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl text-[#193C77] mb-4 flex items-center gap-2">
              <Puzzle className="w-8 h-8 text-[#D55328]" />
              {t('imageRevealGame')}
            </h2>
            <p className="text-gray-600 mb-8">
              Collect one puzzle piece each day! Complete all 45 pieces to reveal the hidden image and earn a bonus 100 points.
            </p>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">{t('partsCollected')}</div>
                  <div className="text-3xl md:text-4xl text-[#D55328]">{collectedParts}/45</div>
                </div>
                <Button
                  onClick={handleCollectPuzzlePiece}
                  className="rounded-[25px] w-full sm:w-auto"
                  style={{ backgroundColor: collectedParts === 45 ? '#ccc' : '#D55328' }}
                  disabled={collectedParts === 45}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {collectedParts === 45 ? 'Complete!' : t('collectToday')}
                </Button>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-[#D55328] to-[#E8C56E] h-4 rounded-full transition-all"
                  style={{ width: `${(collectedParts / 45) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 text-right">
                {Math.round((collectedParts / 45) * 100)}% Complete
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 sm:gap-2 mb-6 md:mb-8">
              {imageParts.map((part) => (
                <div
                  key={part.id}
                  className={`aspect-square rounded-md sm:rounded-lg transition-all flex items-center justify-center ${
                    part.collected
                      ? 'bg-gradient-to-br from-[#E8C56E] to-[#D55328] shadow-md'
                      : 'bg-gray-200 border-2 border-dashed border-gray-300'
                  }`}
                  title={
                    part.collected
                      ? `Collected on ${new Date(part.collectedDate!).toLocaleDateString()}`
                      : 'Not collected yet'
                  }
                >
                  {part.collected && (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
              ))}
            </div>

            {collectedParts === 45 && (
              <div className="text-center p-6 bg-gradient-to-br from-[#FFF8ED] to-[#E8C56E] rounded-2xl border-2 border-[#D55328]">
                <Puzzle className="w-16 h-16 mx-auto mb-4 text-[#D55328]" />
                <h3 className="text-2xl text-[#822A12] mb-2">🎉 Puzzle Complete!</h3>
                <p className="text-[#193C77] mb-2">
                  Congratulations! You've collected all 45 pieces.
                </p>
                <p className="text-[#D55328]">
                  Bonus reward: +100 points
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-[#FFF8ED] rounded-xl">
              <h4 className="text-lg text-[#193C77] mb-2">Scoring:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Each piece collected: +10 points</li>
                <li>• Complete all 45 pieces: +100 bonus points</li>
                <li>• One piece can be collected per day</li>
                <li>• Total possible points: 550 (45 × 10 + 100)</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}