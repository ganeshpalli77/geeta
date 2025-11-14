# Feature Flags System

This document explains how to enable/disable features in the Geeta Olympiad app after login.

## Available Features

The app now has feature flags for the following sections:

- **dashboard** - Dashboard page
- **quiz** - Quiz page
- **events** - Events page
- **leaderboard** - Leaderboard page
- **imagePuzzle** - Image puzzle collection
- **videoSubmission** - Video submission feature
- **sloganSubmission** - Slogan submission feature

## Default State

By default, **all features are ENABLED** when a user logs in. This means all pages (Dashboard, Quiz, Events, Leaderboard) are accessible.

## How to Toggle Features

### Via Browser Console (Dev Tools)

Open your browser's developer console (F12) and use:

```javascript
// Get the app instance
const { toggleFeatureFlag } = __REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.[0]?.idMap;

// Toggle a specific feature
// Example: Disable quiz
localStorage.geetaOlympiadSession = JSON.stringify({
  ...JSON.parse(localStorage.geetaOlympiadSession || '{}'),
  featureFlags: {
    ...JSON.parse(localStorage.geetaOlympiadSession || '{}').featureFlags,
    quiz: false
  }
});
window.location.reload();
```

### Via Code/Admin Panel

Add a button in a component to toggle features:

```tsx
import { useApp } from '../contexts/AppContext';

export function FeatureTogglePanel() {
  const { featureFlags, toggleFeatureFlag } = useApp();

  return (
    <div className="p-4 border rounded">
      <h3>Feature Flags</h3>
      {Object.entries(featureFlags).map(([feature, enabled]) => (
        <button key={feature} onClick={() => toggleFeatureFlag(feature as any)}>
          {feature}: {enabled ? '✅ ON' : '❌ OFF'}
        </button>
      ))}
    </div>
  );
}
```

## Implementation Details

### AppContext Changes

Added to `AppState`:
```tsx
featureFlags: FeatureFlags;

interface FeatureFlags {
  dashboard: boolean;
  quiz: boolean;
  events: boolean;
  leaderboard: boolean;
  imagePuzzle: boolean;
  videoSubmission: boolean;
  sloganSubmission: boolean;
}
```

Added to `AppContextType`:
```tsx
toggleFeatureFlag: (feature: keyof FeatureFlags) => void;
```

### App.tsx Changes

Pages are now conditionally rendered based on feature flags:

```tsx
{featureFlags.dashboard && currentPage === 'dashboard' && <DashboardPage />}
{featureFlags.quiz && currentPage === 'quiz' && <QuizPage />}
{featureFlags.events && currentPage === 'events' && <EventsPage />}
{featureFlags.leaderboard && currentPage === 'leaderboard' && <LeaderboardPage />}
```

## Persistence

Feature flags are stored in `sessionStorage` as part of the app state, so they persist during a user session.

To make permanent changes, you would need to:
1. Store in a database/backend
2. Load when user logs in
3. Update `handleSupabaseAuth` in AppContext to fetch and set flags

## Future Enhancements

- Store feature flags in database (per user or global)
- Add admin panel UI for managing feature flags
- Add scheduled enable/disable (e.g., enable quiz on a specific date)
- Use Supabase feature flags service (PostHog, LaunchDarkly, etc.)
