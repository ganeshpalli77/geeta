import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
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
import { toast } from 'sonner';
import {
  Video,
  MessageSquare,
  Puzzle,
  Send,
  CheckCircle,
  Film,
  ArrowLeft,
} from 'lucide-react';

// Puzzle Task Page
export function PuzzleTaskPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { currentProfile, user } = useApp();
  const [collectedPieces, setCollectedPieces] = useState<any[]>([]);
  const [puzzleConfig, setPuzzleConfig] = useState({ totalPieces: 35, imageData: null, creditsPerPiece: 50 });
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState(false);
  
  // Load puzzle config and user's collected pieces
  useEffect(() => {
    loadPuzzleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, user]);

  const loadPuzzleData = async () => {
    if (!currentProfile || !user) {
      console.log('Cannot load puzzle data: missing profile or user');
      return;
    }
    
    try {
      console.log('Loading puzzle data for user:', user.id, 'profile:', currentProfile.id);
      
      // Load puzzle configuration
      const configRes = await fetch('http://localhost:5000/api/puzzle/config');
      if (!configRes.ok) {
        throw new Error(`Config fetch failed: ${configRes.status}`);
      }
      const configData = await configRes.json();
      console.log('Puzzle config loaded:', configData);
      
      if (configData.success) {
        setPuzzleConfig(configData.config);
      }

      // Load user's collected pieces
      const piecesRes = await fetch(`http://localhost:5000/api/puzzle/pieces/${user.id}/${currentProfile.id}`);
      if (!piecesRes.ok) {
        throw new Error(`Pieces fetch failed: ${piecesRes.status}`);
      }
      const piecesData = await piecesRes.json();
      console.log('Collected pieces loaded:', piecesData);
      
      if (piecesData.success) {
        setCollectedPieces(piecesData.pieces);
      }
    } catch (error) {
      console.error('Error loading puzzle data:', error);
      toast.error('Failed to load puzzle data');
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <Puzzle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl text-gray-900 mb-2">No Profile Selected</h2>
          <p className="text-gray-600">Please create or select a profile</p>
        </Card>
      </div>
    );
  }

  const totalPieces = puzzleConfig.totalPieces;

  // Create array of puzzle pieces
  const puzzlePieces = Array.from({ length: totalPieces }, (_, i) => {
    const pieceNumber = i + 1;
    const collected = collectedPieces.some(p => p.pieceNumber === pieceNumber);
    return { id: pieceNumber, collected };
  });

  const collectedParts = collectedPieces.length;

  const handleCollectPuzzlePiece = async (pieceNumber: number) => {
    // Check if already collected
    if (puzzlePieces.find(p => p.id === pieceNumber)?.collected) {
      toast.info(`Piece ${pieceNumber} is already collected!`);
      return;
    }

    if (!user) {
      toast.error('Please log in to collect puzzle pieces');
      return;
    }

    setCollecting(true);
    try {
      console.log('Collecting piece:', pieceNumber, 'for user:', user.id, 'profile:', currentProfile.id);
      
      const response = await fetch('http://localhost:5000/api/puzzle/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileId: currentProfile.id,
          pieceNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Collect response:', data);

      if (data.success) {
        toast.success(`🎉 Piece ${pieceNumber} collected! +${puzzleConfig.creditsPerPiece} credits`);
        // Reload puzzle data
        await loadPuzzleData();
      } else {
        toast.error(data.message || 'Failed to collect piece');
      }
    } catch (error) {
      console.error('Error collecting piece:', error);
      toast.error('Failed to collect puzzle piece: ' + (error as Error).message);
    } finally {
      setCollecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => onNavigate?.('round-1')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Round 1
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collect Today's Puzzle Piece</h1>
        <p className="text-gray-600">
          Complete the 35-day challenge! Collect one puzzle piece every day to complete the Bhagavad Geeta image. Each piece earns you 50 credits!
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Puzzle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Puzzle Collection</h2>
            <p className="text-gray-600">{collectedParts} / {totalPieces} pieces collected</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Your Progress</span>
            <span className="text-sm font-semibold text-purple-600">{Math.round((collectedParts / totalPieces) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${(collectedParts / totalPieces) * 100}%` }}
            />
          </div>
        </div>

        {/* Puzzle Image with Revealed Pieces */}
        {puzzleConfig.imageData && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Progress - Image Reveal</h3>
            <div className="relative w-full max-w-lg mx-auto">
              <img
                src={puzzleConfig.imageData}
                alt="Puzzle"
                className="w-full h-auto rounded-lg"
                style={{
                  filter: collectedParts === 0 ? 'blur(20px) brightness(0.3)' : 'none',
                }}
              />
              {/* Overlay grid showing collected/uncollected pieces */}
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(totalPieces))}, 1fr)` }}>
                {puzzlePieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="border border-white/20"
                    style={{
                      backgroundColor: piece.collected ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: piece.collected ? 'none' : 'blur(10px)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Puzzle Grid - Collection Interface */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{totalPieces} Days Challenge - Click to collect (1 per day)</h3>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-4 border-gray-300">
            <div className="flex flex-wrap gap-3">
              {puzzlePieces.map((piece) => (
                <button
                  key={piece.id}
                  onClick={() => handleCollectPuzzlePiece(piece.id)}
                  className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center font-bold transition-all flex-shrink-0 ${
                    piece.collected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-600 text-white shadow-lg cursor-default'
                      : 'bg-white border-gray-300 text-gray-400 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transform hover:scale-105'
                  }`}
                  title={piece.collected ? `Piece ${piece.id} collected` : `Click to collect Piece ${piece.id}`}
                  disabled={piece.collected || collecting}
                >
                  {piece.collected ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <>
                      <span className="text-[10px] leading-none">Piece</span>
                      <span className="text-sm font-bold leading-none mt-1">{piece.id}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border-2 border-gray-300"></div>
              <span className="text-xs text-gray-600">Not Collected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-gray-600">Collected</span>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {collectedParts === totalPieces && (
          <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200 mb-6">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <h3 className="text-xl font-bold text-green-800 mb-2">{totalPieces}-Day Challenge Complete! 🎉</h3>
            <p className="text-green-700">Congratulations! You've collected all {totalPieces} pieces and revealed the complete image!</p>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>How to collect:</strong> You can collect ONE piece per day. Click on any piece to collect it. Once collected, it will turn purple with a checkmark ✓ and reveal that part of the image. Complete all {totalPieces} pieces to see the full artwork! Each piece earns you {puzzleConfig.creditsPerPiece} credits.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Slogan Task Page
export function SloganTaskPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { currentProfile, user } = useApp();
  const [slogan, setSlogan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [profileSlogans, setProfileSlogans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: Log profile info - MUST be before other useEffects
  useEffect(() => {
    console.log('Current Profile:', currentProfile);
    console.log('Profile ID:', currentProfile?.id);
    console.log('User:', user);
  }, [currentProfile, user]);

  // Load user's previous slogans
  useEffect(() => {
    if (currentProfile && user) {
      loadSlogans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, user]);

  const loadSlogans = async () => {
    const profileId = currentProfile?.id || (currentProfile as any)?._id;
    
    if (!profileId) {
      console.log('Cannot load slogans: profile ID is missing', { currentProfile, hasId: !!currentProfile?.id, has_id: !!(currentProfile as any)?._id });
      setLoading(false);
      return;
    }
    
    console.log('Loading slogans for profile:', profileId);
    
    try {
      const response = await fetch(`http://localhost:5000/api/slogan/profile/${profileId}`);
      const data = await response.json();
      
      console.log('Slogans loaded:', data);
      
      if (data.success) {
        setProfileSlogans(data.data);
      }
    } catch (error) {
      console.error('Error loading slogans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl text-gray-900 mb-2">No Profile Selected</h2>
          <p className="text-gray-600">Please create or select a profile</p>
        </Card>
      </div>
    );
  }

  const handleSloganSubmit = async () => {
    if (!slogan || slogan.trim().length < 10) {
      toast.error('Please enter a slogan (minimum 10 characters)');
      return;
    }

    if (!user) {
      toast.error('Please log in to submit a slogan');
      return;
    }

    // Handle both id and _id (MongoDB uses _id, but we convert to id)
    const profileId = currentProfile.id || (currentProfile as any)._id;
    
    if (!profileId) {
      console.error('Profile issue:', { currentProfile, hasId: !!currentProfile?.id, has_id: !!(currentProfile as any)?._id });
      toast.error('Profile not loaded. Please refresh the page.');
      return;
    }

    console.log('Submitting slogan with:', {
      userId: user.id,
      profileId: profileId,
      slogan: slogan.trim(),
      round: 1,
    });

    setSubmitting(true);
    try {
      const payload = {
        userId: user.id,
        profileId: profileId,
        slogan: slogan.trim(),
        round: 1,
      };

      console.log('Payload:', payload);

      const response = await fetch('http://localhost:5000/api/slogan/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        toast.success('Slogan submitted successfully! +75 credits awarded.');
        setSlogan('');
        // Reload slogans
        await loadSlogans();
      } else {
        toast.error(data.message || 'Failed to submit slogan');
      }
    } catch (error) {
      console.error('Error submitting slogan:', error);
      toast.error('Failed to submit slogan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => onNavigate?.('round-1')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Round 1
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Slogan</h1>
        <p className="text-gray-600">
          Create an inspiring slogan based on the teachings of the Bhagavad Geeta. Be creative and meaningful!
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Slogan Creation</h2>
            <p className="text-gray-600">Share your wisdom in a few words</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="slogan">Your Slogan</Label>
            <Textarea
              id="slogan"
              placeholder="Enter your inspiring slogan here... (minimum 10 characters)"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              rows={4}
              className="resize-none focus:ring-purple-600 focus:border-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">{slogan.length} characters</p>
          </div>

          <Button
            onClick={handleSloganSubmit}
            disabled={slogan.length < 10 || submitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Slogan (+75 Credits)'}
          </Button>
        </div>

        {/* Examples */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">💡 Example Slogans:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>"Do your duty without attachment to results"</li>
            <li>"Be a warrior of peace, like Arjuna"</li>
            <li>"Find your purpose, fulfill your dharma"</li>
          </ul>
        </div>
      </Card>

      {/* Previous Submissions */}
      {profileSlogans.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Previous Submissions</h3>
          <div className="space-y-3">
            {profileSlogans.slice(-5).reverse().map((submission, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{submission.slogan}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Round {submission.round} • {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                    submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Reel Task Page
export function ReelTaskPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { user, currentProfile } = useApp();
  const [reelURL, setReelURL] = useState('');
  const [reelPlatform, setReelPlatform] = useState('youtube');
  const [submitting, setSubmitting] = useState(false);
  const [profileReels, setProfileReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentProfile?.id) {
      loadPreviousSubmissions();
    }
  }, [currentProfile?.id]);

  const loadPreviousSubmissions = async () => {
    if (!currentProfile?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/reel/profile/${currentProfile.id}`);
      const data = await response.json();

      if (data.success) {
        setProfileReels(data.data || []);
      }
    } catch (error) {
      console.error('Error loading previous submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReelSubmit = async () => {
    if (!user || !currentProfile) {
      toast.error('Please login and select a profile first');
      return;
    }

    if (!reelURL.trim()) {
      toast.error('Please enter a reel URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(reelURL);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/reel/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileId: currentProfile.id,
          reelUrl: reelURL.trim(),
          platform: reelPlatform,
          description: '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Reel submitted successfully! 🎉');
        setReelURL('');
        loadPreviousSubmissions();
      } else {
        toast.error(data.message || 'Failed to submit reel');
      }
    } catch (error) {
      console.error('Error submitting reel:', error);
      toast.error('Failed to submit reel. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentProfile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a profile to submit a reel</p>
        <Button onClick={() => onNavigate?.('home')} className="mt-4">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => onNavigate?.('round-1')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Round 1
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Reel</h1>
        <p className="text-gray-600">
          Create a short video reel sharing your understanding of the Bhagavad Geeta. Upload to YouTube, Instagram, or Facebook and share the link here.
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reel Submission</h2>
            <p className="text-gray-600">Share your creative video</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={reelPlatform} onValueChange={setReelPlatform}>
              <SelectTrigger id="platform" className="focus:ring-purple-600">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reel-url">Video URL</Label>
            <Input
              id="reel-url"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={reelURL}
              onChange={(e) => setReelURL(e.target.value)}
              className="focus:ring-purple-600 focus:border-purple-600"
            />
          </div>

          <Button
            onClick={handleReelSubmit}
            disabled={!reelURL || submitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Reel (+100 Credits)'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">📹 Video Guidelines:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Keep it short: 30-60 seconds</li>
            <li>Share a key teaching or your understanding</li>
            <li>Be authentic and creative</li>
            <li>Make sure the video is public</li>
          </ul>
        </div>
      </Card>

      {/* Previous Submissions */}
      {profileReels.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Previous Submissions</h3>
          <div className="space-y-3">
            {profileReels.slice(-5).reverse().map((submission: any, index: number) => (
              <div key={submission._id || index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={submission.reelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium break-all"
                    >
                      {submission.reelUrl}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      {submission.platform.charAt(0).toUpperCase() + submission.platform.slice(1)} • {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                    submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {submission.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Shloka Task Page
export function ShlokaTaskPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { currentProfile, submitVideo, videoSubmissions } = useApp();
  const [shlokaURL, setShlokaURL] = useState('');
  const [shlokaPlatform, setShlokaPlatform] = useState('youtube');

  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <Film className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl text-gray-900 mb-2">No Profile Selected</h2>
          <p className="text-gray-600">Please create or select a profile</p>
        </Card>
      </div>
    );
  }

  const profileShlokas = videoSubmissions.filter(v => v.profileId === currentProfile.id && v.type === 'shloka');

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

    toast.success('Shloka video submitted successfully! +100 credits awarded.');
    setShlokaURL('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => onNavigate?.('round-1')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Round 1
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Shloka Video</h1>
        <p className="text-gray-600">
          Record yourself reciting a shloka from the Bhagavad Geeta. Upload to YouTube, Instagram, or Facebook and share the link here.
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Film className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shloka Video Submission</h2>
            <p className="text-gray-600">Recite a verse from the Geeta</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="shloka-platform">Platform</Label>
            <Select value={shlokaPlatform} onValueChange={setShlokaPlatform}>
              <SelectTrigger id="shloka-platform" className="focus:ring-purple-600">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="shloka-url">Video URL</Label>
            <Input
              id="shloka-url"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={shlokaURL}
              onChange={(e) => setShlokaURL(e.target.value)}
              className="focus:ring-purple-600 focus:border-purple-600"
            />
          </div>

          <Button
            onClick={handleShlokaSubmit}
            disabled={!shlokaURL}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Shloka Video (+100 Credits)
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">🎬 Recording Guidelines:</p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Choose any shloka from the Bhagavad Geeta</li>
            <li>Recite clearly and with devotion</li>
            <li>Video length: 1-2 minutes</li>
            <li>Make sure the video is public</li>
            <li>Optional: Add Sanskrit text or translation in video</li>
          </ul>
        </div>
      </Card>

      {/* Previous Submissions */}
      {profileShlokas.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Previous Submissions</h3>
          <div className="space-y-3">
            {profileShlokas.slice(-5).reverse().map((submission, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {submission.url}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      {submission.platform} • {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                    submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

