import { useState, useEffect } from 'react';
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

interface SloganSubmission {
  _id: string;
  id?: string;
  userId: string;
  profileId: string;
  userName: string;
  userEmail: string;
  slogan: string;
  round: number;
  credits: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  creditScore?: number;
}

interface ReelSubmission {
  _id: string;
  id?: string;
  userId: string;
  profileId: string;
  userName: string;
  userEmail: string;
  reelUrl: string;
  platform: string;
  description?: string;
  round: number;
  credits: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  views: number;
  likes: number;
}

export function SubmissionReview() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sloganSubmissions, setSloganSubmissions] = useState<SloganSubmission[]>([]);
  const [reelSubmissions, setReelSubmissions] = useState<ReelSubmission[]>([]);
  const [videoSubmissions, setVideoSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load all submissions for admin
  useEffect(() => {
    loadAllSubmissions();
  }, []);
  
  const loadAllSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch all slogans from admin endpoint
      const sloganResponse = await fetch('http://localhost:5000/api/slogan/admin/all');
      const sloganData = await sloganResponse.json();
      
      console.log('🔍 Admin - Loaded slogans:', sloganData);
      
      if (sloganData.success && sloganData.data) {
        // Admin endpoint returns { data: { slogans: [...], pagination: {...}, stats: {...} } }
        const slogans = sloganData.data.slogans || [];
        console.log('🔍 Admin - Extracted slogans array:', slogans);
        
        // Map the data to include id and submittedAt for compatibility
        const mappedSlogans = slogans.map((s: any) => ({
          ...s,
          id: s._id,
          submittedAt: s.createdAt,
        }));
        setSloganSubmissions(mappedSlogans);
      }
      
      // Fetch all reels from admin endpoint
      const reelResponse = await fetch('http://localhost:5000/api/reel/admin/all');
      const reelData = await reelResponse.json();
      
      console.log('🔍 Admin - Loaded reels:', reelData);
      
      if (reelData.success && reelData.data) {
        const reels = reelData.data.reels || [];
        console.log('🔍 Admin - Extracted reels array:', reels);
        
        // Map the data to include id and submittedAt for compatibility
        const mappedReels = reels.map((r: any) => ({
          ...r,
          id: r._id,
          submittedAt: r.createdAt,
        }));
        setReelSubmissions(mappedReels);
      }
      
      // TODO: Add video submissions endpoint when available
      setVideoSubmissions([]);
      
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

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

  const handleApproveSlogan = async (sloganId: string, score: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/slogan/admin/${sloganId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminNotes: `Approved with score: ${score}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Slogan approved! Score: ${score}`);
        // Reload submissions to show updated status
        await loadAllSubmissions();
      } else {
        toast.error(data.message || 'Failed to approve slogan');
      }
    } catch (error) {
      console.error('Error approving slogan:', error);
      toast.error('Failed to approve slogan');
    }
  };

  const handleRejectSlogan = async (sloganId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/slogan/admin/${sloganId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNotes: 'Rejected by admin',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Slogan rejected');
        // Reload submissions to show updated status
        await loadAllSubmissions();
      } else {
        toast.error(data.message || 'Failed to reject slogan');
      }
    } catch (error) {
      console.error('Error rejecting slogan:', error);
      toast.error('Failed to reject slogan');
    }
  };

  const handleApproveReel = async (reelId: string, score: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reel/admin/${reelId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminNotes: `Approved with score: ${score}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Reel approved! Score: ${score}`);
        await loadAllSubmissions();
      } else {
        toast.error(data.message || 'Failed to approve reel');
      }
    } catch (error) {
      console.error('Error approving reel:', error);
      toast.error('Failed to approve reel');
    }
  };

  const handleRejectReel = async (reelId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reel/admin/${reelId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNotes: 'Rejected by admin',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reel rejected');
        await loadAllSubmissions();
      } else {
        toast.error(data.message || 'Failed to reject reel');
      }
    } catch (error) {
      console.error('Error rejecting reel:', error);
      toast.error('Failed to reject reel');
    }
  };

  const filteredVideos = filterStatus === 'all' 
    ? videoSubmissions 
    : videoSubmissions.filter(v => v.status === filterStatus);

  const filteredSlogans = filterStatus === 'all'
    ? sloganSubmissions
    : sloganSubmissions.filter(s => s.status === filterStatus);

  const filteredReels = filterStatus === 'all'
    ? reelSubmissions
    : reelSubmissions.filter(r => r.status === filterStatus);

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

        <Tabs defaultValue="reels">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="reels">
              <Video className="w-4 h-4 mr-2" />
              Reels ({filteredReels.length})
            </TabsTrigger>
            <TabsTrigger value="slogans">
              <MessageSquare className="w-4 h-4 mr-2" />
              Slogans ({filteredSlogans.length})
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos ({filteredVideos.length})
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

          <TabsContent value="reels" className="mt-6">
            {filteredReels.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No reel submissions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReels.map((reel) => (
                  <Card key={reel.id} className="p-4 bg-[#FFF8ED]">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${
                            reel.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : reel.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {reel.status.toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-semibold">
                            {reel.platform.toUpperCase()}
                          </span>
                        </div>
                        <div className="mb-2">
                          <a
                            href={reel.reelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium break-all"
                          >
                            {reel.reelUrl}
                          </a>
                        </div>
                        {reel.description && (
                          <div className="text-sm text-gray-700 mb-2">
                            {reel.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 flex items-center gap-4">
                          <span>Submitted: {new Date(reel.submittedAt || reel.createdAt).toLocaleString()}</span>
                          <span>Views: {reel.views || 0}</span>
                          <span>Likes: {reel.likes || 0}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          By: {reel.userName} ({reel.userEmail})
                        </div>
                      </div>

                      {reel.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                          <Input
                            type="number"
                            placeholder="Score (0-100)"
                            id={`reel-score-${reel.id}`}
                            className="flex-1 text-sm"
                            min="0"
                            max="100"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const input = document.getElementById(
                                  `reel-score-${reel.id}`
                                ) as HTMLInputElement;
                                const score = parseInt(input.value);
                                if (score >= 0 && score <= 100) {
                                  handleApproveReel(reel.id || reel._id, score);
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
                              onClick={() => handleRejectReel(reel.id || reel._id)}
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
