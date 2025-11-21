import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Puzzle, Upload, Image as ImageIcon, Eye, Save, CheckCircle, RefreshCw } from 'lucide-react';

export function PuzzleManagement() {
  const [config, setConfig] = useState({
    totalPieces: 35,
    creditsPerPiece: 50,
    imageData: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load current configuration
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/puzzle/config');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setConfig({
          totalPieces: data.config.totalPieces,
          creditsPerPiece: data.config.creditsPerPiece,
          imageData: data.config.imageData,
        });
        
        if (data.config.imageData) {
          setPreviewUrl(data.config.imageData);
        }
      }
    } catch (error) {
      console.error('Error loading puzzle config:', error);
      toast.error('Failed to load puzzle configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5000/api/puzzle/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Puzzle image uploaded and saved successfully!');
        setConfig(prev => ({ ...prev, imageData: data.imageData }));
        setPreviewUrl(data.imageData);
        setSelectedFile(null);
        await loadConfig();
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload puzzle image: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/puzzle/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPieces: config.totalPieces,
          creditsPerPiece: config.creditsPerPiece,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Puzzle configuration saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save puzzle configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !config.imageData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-600" />
          <p className="text-gray-600">Loading puzzle configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Puzzle Management</h2>
          <p className="text-gray-600">
            Configure the daily puzzle challenge and upload the puzzle image
          </p>
        </div>
        <Button
          onClick={loadConfig}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Reload
        </Button>
      </div>

      {/* Configuration Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Puzzle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Puzzle Configuration</h3>
            <p className="text-sm text-gray-600">Set the number of pieces and credits</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="totalPieces">Total Puzzle Pieces</Label>
            <Input
              id="totalPieces"
              type="number"
              min="10"
              max="50"
              value={config.totalPieces}
              onChange={(e) => setConfig({ ...config, totalPieces: parseInt(e.target.value) })}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Number of days in the challenge (10-50)</p>
          </div>

          <div>
            <Label htmlFor="creditsPerPiece">Credits Per Piece</Label>
            <Input
              id="creditsPerPiece"
              type="number"
              min="10"
              max="200"
              value={config.creditsPerPiece}
              onChange={(e) => setConfig({ ...config, creditsPerPiece: parseInt(e.target.value) })}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Credits earned per collected piece</p>
          </div>
        </div>

        <Button
          onClick={handleSaveConfig}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </Card>

      {/* Image Upload Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Puzzle Image</h3>
            <p className="text-sm text-gray-600">Upload the image that will be revealed piece by piece</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="imageUpload" className="text-base font-semibold">Select and Upload Image</Label>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1 cursor-pointer"
                />
                <Button
                  onClick={handleUploadImage}
                  disabled={!selectedFile || uploading}
                  className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload & Save'}
                </Button>
              </div>
              {selectedFile && (
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <span className="text-sm text-blue-800">
                    Selected: <strong>{selectedFile.name}</strong>
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: Square image, at least 1000x1000px, max 5MB
            </p>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <Label>Current Puzzle Image</Label>
                </div>
                {config.imageData && (
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Saved
                  </span>
                )}
              </div>
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={previewUrl}
                  alt="Puzzle preview"
                  className="w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg"
                />
                <div className="absolute inset-0 grid grid-cols-7 gap-0.5 pointer-events-none">
                  {Array.from({ length: config.totalPieces }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/30 bg-transparent"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">
                This image will be divided into {config.totalPieces} pieces
              </p>
            </div>
          )}

          {!previewUrl && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No image uploaded yet</p>
              <p className="text-sm text-gray-500">Upload an image to see the preview</p>
            </div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Users can collect one puzzle piece per day</li>
          <li>• Each collected piece reveals a portion of the uploaded image</li>
          <li>• Users earn credits for each piece collected</li>
          <li>• The image is automatically divided into the configured number of pieces</li>
          <li>• Users must collect all pieces to see the complete image</li>
        </ul>
      </Card>
    </div>
  );
}
