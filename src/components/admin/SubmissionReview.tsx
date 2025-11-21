import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import {
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
} from 'lucide-react';

export function SubmissionReview() {
  const { videoSubmissions, sloganSubmissions } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

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

  const filteredVideos = filterStatus === 'all' 
    ? videoSubmissions 
    : videoSubmissions.filter(v => v.status === filterStatus);

  const filteredSlogans = filterStatus === 'all'
    ? sloganSubmissions
    : sloganSubmissions.filter(s => s.status === filterStatus);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl text-[#193C77]">Submission Review</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="videos">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos ({filteredVideos.length})
            </TabsTrigger>
            <TabsTrigger value="slogans">
              <MessageSquare className="w-4 h-4 mr-2" />
              Slogans ({filteredSlogans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No video submissions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="p-4 bg-[#FFF8ED]">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
                              video.type === 'shloka' 
                                ? 'bg-[#193C77] text-white'
                                : 'bg-[#D55328] text-white'
                            }`}>
                              {video.type === 'shloka' ? 'Shloka Video' : 'Reel'}
                            </span>
                            <span className="text-xs px-2 py-1 bg-white rounded capitalize">
                              {video.platform}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${
                              video.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : video.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {video.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-[#193C77] break-all mb-2">
                            {video.url}
                          </div>
                          <div className="text-xs text-gray-500">
                            Submitted: {new Date(video.submittedAt).toLocaleString()}
                          </div>
                          {video.creditScore && (
                            <div className="text-sm text-[#D55328] mt-2 font-semibold">
                              Score: {video.creditScore} points
                            </div>
                          )}
                        </div>
                      </div>

                      {video.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
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
                              className="rounded-[25px] flex-1 sm:flex-initial"
                              style={{ backgroundColor: '#D55328' }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectVideo(video.id)}
                              size="sm"
                              variant="outline"
                              className="rounded-[25px] flex-1 sm:flex-initial"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="slogans" className="mt-6">
            {filteredSlogans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No slogan submissions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSlogans.map((slogan) => (
                  <Card key={slogan.id} className="p-4 bg-[#FFF8ED]">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            slogan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : slogan.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {slogan.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[#193C77] text-lg mb-2 font-medium">
                          "{slogan.slogan}"
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(slogan.submittedAt).toLocaleString()}
                        </div>
                        {slogan.creditScore && (
                          <div className="text-sm text-[#D55328] mt-2 font-semibold">
                            Score: {slogan.creditScore} points
                          </div>
                        )}
                      </div>

                      {slogan.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
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
                              className="rounded-[25px] flex-1 sm:flex-initial"
                              style={{ backgroundColor: '#D55328' }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectSlogan(slogan.id)}
                              size="sm"
                              variant="outline"
                              className="rounded-[25px] flex-1 sm:flex-initial"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
