import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

/**
 * Admin panel for toggling feature flags
 * Add this to your admin panel or dev mode menu
 */
export function FeatureFlagsPanel() {
  const { featureFlags, toggleFeatureFlag } = useApp();

  const features = [
    { key: 'dashboard' as const, label: 'Dashboard', description: 'User dashboard page' },
    { key: 'quiz' as const, label: 'Quiz', description: 'Quiz/exam features' },
    { key: 'events' as const, label: 'Events', description: 'Events and submissions' },
    { key: 'leaderboard' as const, label: 'Leaderboard', description: 'Leaderboard rankings' },
    { key: 'imagePuzzle' as const, label: 'Image Puzzle', description: 'Image puzzle collection' },
    { key: 'videoSubmission' as const, label: 'Video Submission', description: 'Video submission feature' },
    { key: 'sloganSubmission' as const, label: 'Slogan Submission', description: 'Slogan submission feature' },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>Enable or disable features for the current session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex flex-col">
                <span className="font-medium text-sm">{label}</span>
                <span className="text-xs text-gray-500">{description}</span>
              </div>
              <Button
                variant={featureFlags[key] ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleFeatureFlag(key)}
                className={featureFlags[key] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400'}
              >
                {featureFlags[key] ? '✓ ON' : '✗ OFF'}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">💡 Note:</p>
          <p>Changes are stored in the current session only. Refresh the page to reset to defaults.</p>
        </div>
      </CardContent>
    </Card>
  );
}
