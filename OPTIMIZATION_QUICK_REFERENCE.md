# Optimization Quick Reference

## 🚀 Quick Commands

### Clear Cache
```typescript
// Clear specific user
dataSyncService.clearUserCache(userId);

// Clear everything
dataSyncService.clearAllCaches();
```

### Force Refresh
```typescript
// Bypass cache and fetch fresh data
await dataSyncService.getUserProfiles(userId, true);
```

### Prefetch Data
```typescript
// Load data before user needs it
await dataSyncService.prefetchUserData(userId);
```

### Check Cache Stats
```typescript
const stats = dataSyncService.getCacheStats();
console.log(stats);
```

---

## 📊 Console Messages Explained

| Message | Meaning | Action |
|---------|---------|--------|
| `✅ Cache HIT` | Data served from cache | Good! Fast response |
| `🔄 Cache MISS` | Fetching fresh data | Normal for first request |
| `⏳ Waiting for pending` | Request deduplicated | Good! Preventing duplicates |
| `💾 Cached` | Response stored in cache | Good! Future requests faster |
| `⚠️ Slow request` | Request took > 1s | Investigate if frequent |
| `🧹 Cache cleared` | Manual cache invalidation | Expected after data changes |
| `⏭️ Skipping duplicate` | Auth already processing | Good! Preventing duplicates |

---

## 🎯 Performance Tips

### DO ✅
- Use `dataSyncService` for all user/profile data
- Clear cache after creating/updating data
- Let the system handle caching automatically
- Monitor console for slow requests

### DON'T ❌
- Bypass the data sync service
- Forget to clear cache after updates
- Make duplicate simultaneous requests
- Ignore slow request warnings

---

## 🔍 Troubleshooting

### Stale Data?
```typescript
// Force refresh
dataSyncService.clearUserCache(userId);
await dataSyncService.getUserProfiles(userId, true);
```

### Too Many Requests?
```
Check console for:
- ⏳ Waiting for pending request (deduplication working)
- ⏭️ Skipping duplicate (auth protection working)
```

### Slow Performance?
```
Check console for:
- ⚠️ Slow request warnings
- Cache hit rate (should be > 80%)
```

---

## 📈 Expected Performance

- **User Sync:** ~300ms (first time), ~50ms (cached)
- **Profile Load:** ~200ms (first time), ~30ms (cached)
- **Cache Hit Rate:** 80-90%
- **Duplicate Requests:** 0

---

## 🛠️ Common Scenarios

### User Logs In
```
🔐 Starting optimized auth flow
✅ User synced: Existing user
📋 Profiles loaded: 2
🎯 Loading profile data
✅ Auth flow complete
```

### Creating Profile
```
Creating profile for user: 123
Profile created: {...}
🧹 Cache cleared for user: 123
🔄 Cache MISS - Fetching fresh profiles
✅ Profile created successfully!
```

### Switching Profiles
```
🎯 Loading profile data for: 456
No quiz attempts yet (expected)
No videos yet (expected)
✅ Profile switched
```

---

## 🎨 Cache Strategy

```
┌─────────────────────────────────────┐
│         User Logs In                │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Sync User (5 min cache)           │
│   ✅ Cache HIT or 🔄 Fetch          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Load Profiles (2 min cache)       │
│   ✅ Cache HIT or 🔄 Fetch          │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Load Profile Data (1 min cache)   │
│   Quiz, Videos, Slogans, Puzzle     │
└─────────────────────────────────────┘
```

---

## 🔧 Advanced Usage

### Batch Profile Updates
```typescript
// Clear cache for multiple users
userIds.forEach(id => dataSyncService.clearUserCache(id));
```

### Preload for Better UX
```typescript
// On app start
if (user) {
  dataSyncService.prefetchUserData(user.id);
}
```

### Monitor Performance
```typescript
// Check cache effectiveness
setInterval(() => {
  const stats = dataSyncService.getCacheStats();
  console.log('Cache stats:', stats);
}, 60000); // Every minute
```
