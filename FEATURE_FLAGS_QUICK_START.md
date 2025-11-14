# Feature Flags Quick Reference

## What Changed?

The navigation menu now **respects feature flags** and shows/hides Dashboard, Quiz, Events, and Leaderboard based on the `featureFlags` state in AppContext.

## Status

✅ **All features are ENABLED by default** - Dashboard, Quiz, Events, and Leaderboard are now visible in the navigation menu after login.

## How to Toggle Features

### 1. **Using FeatureFlagsPanel Component** (Recommended)

Add this to your admin panel or settings:

```tsx
import { FeatureFlagsPanel } from '../admin/FeatureFlagsPanel';

export function AdminPage() {
  return (
    <div>
      <h1>Admin Settings</h1>
      <FeatureFlagsPanel />
    </div>
  );
}
```

### 2. **Using useApp() Hook in Code**

```tsx
import { useApp } from '../contexts/AppContext';

export function MyComponent() {
  const { featureFlags, toggleFeatureFlag } = useApp();

  return (
    <div>
      <button onClick={() => toggleFeatureFlag('quiz')}>
        Toggle Quiz: {featureFlags.quiz ? 'ON' : 'OFF'}
      </button>
      <button onClick={() => toggleFeatureFlag('leaderboard')}>
        Toggle Leaderboard: {featureFlags.leaderboard ? 'ON' : 'OFF'}
      </button>
      {/* ... more buttons for other features ... */}
    </div>
  );
}
```

### 3. **Via Browser Console (Dev Testing)**

```javascript
// Access from browser console after app is loaded
// Reload page to reset
```

## Features That Can Be Toggled

| Feature | ID | Description |
|---------|----|----|
| Dashboard | `dashboard` | Dashboard page |
| Quiz | `quiz` | Quiz/exam features |
| Events | `events` | Events and submissions |
| Leaderboard | `leaderboard` | Leaderboard rankings |
| Image Puzzle | `imagePuzzle` | Image puzzle collection |
| Video Submission | `videoSubmission` | Video submission feature |
| Slogan Submission | `sloganSubmission` | Slogan submission feature |

## Files Modified

1. **src/contexts/AppContext.tsx**
   - Added `FeatureFlags` interface
   - Added `featureFlags` to `AppState`
   - Added `toggleFeatureFlag()` function

2. **src/App.tsx**
   - Pages conditionally render based on flags
   - Example: `{featureFlags.quiz && currentPage === 'quiz' && <QuizPage />}`

3. **src/components/Header.tsx**
   - Navigation items now filter based on `featureFlags`
   - Shows/hides Dashboard, Quiz, Events, Leaderboard links

4. **src/components/admin/FeatureFlagsPanel.tsx** (NEW)
   - Pre-built UI component for toggling all flags
   - Shows ON/OFF status for each feature

## Persistence

- Feature flags are stored in **sessionStorage** during the user session
- Persists across page reloads within the same session
- Resets when the browser tab is closed or when user logs out
- To persist across sessions, store in database/backend

## Next Steps (Optional)

To make feature flags permanent:

1. Add a `feature_flags` table in Supabase:
```sql
create table feature_flags (
  id serial primary key,
  user_id text not null,
  feature_id text not null,
  enabled boolean default true,
  created_at timestamp default now(),
  unique(user_id, feature_id)
);
```

2. Load flags in `AppContext` on login:
```tsx
const refreshPermissions = async (userId?: string) => {
  // Fetch from Supabase or API
  const { data } = await supabase
    .from('feature_flags')
    .select('feature_id, enabled')
    .eq('user_id', userId);
  
  // Update featureFlags state
};
```

3. Call `refreshPermissions()` in `handleSupabaseAuth()`
