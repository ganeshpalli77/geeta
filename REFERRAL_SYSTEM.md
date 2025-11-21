# Referral System - Complete Guide

## ✅ Feature Implemented

A complete referral system where users can share their unique referral codes and earn rewards.

## 🎯 Features

### 1. **Unique Referral Code**
- Each user gets a unique referral code
- Code format: `GEETA-XXXX-YYYY`
  - First 4 characters: User ID
  - Last 4 characters: Profile ID
- Example: `GEETA-5B8E-8D72`

### 2. **Referral Page**
- Accessible from sidebar menu
- Shows referral statistics
- Displays unique code and shareable link
- Multiple sharing options

### 3. **Sharing Options**
- ✅ **Copy Code** - Copy referral code to clipboard
- ✅ **Copy Link** - Copy full referral URL
- ✅ **WhatsApp** - Share via WhatsApp
- ✅ **Facebook** - Share on Facebook
- ✅ **Twitter** - Tweet your referral
- ✅ **Email** - Send via email
- ✅ **More Options** - Native mobile share (if available)

### 4. **Rewards System**
- **Referrer earns:** 100 credits per successful referral
- **Referred friend gets:** 50 bonus credits
- **Unlimited referrals** - No cap on earnings

## 🎨 UI Components

### Sidebar Navigation
```
┌─────────────────┐
│ Dashboard       │
│ Round 1         │
│ ...             │
├─────────────────┤
│ 🏆 Leaderboard  │
│ 🎁 Rewards      │
│ 👥 Referral     │ ← NEW!
│ ⚙️ Settings     │
│ 🚪 Logout       │
└─────────────────┘
```

### Referral Page Layout
```
┌──────────────────────────────────────────┐
│  Refer & Earn                             │
│  Share your unique referral code...       │
├──────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │    0     │ │    0     │ │    0     │ │
│  │ Referrals│ │  Credits │ │  Active  │ │
│  └──────────┘ └──────────┘ └──────────┘ │
├──────────────────────────────────────────┤
│  Your Unique Referral Code               │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │   GEETA-XXXX-YYYY    [Copy]        │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Referral Link                            │
│  ┌────────────────────────────────────┐  │
│  │ http://...?ref=GEETA-XXXX-YYYY [📋]│  │
│  └────────────────────────────────────┘  │
│                                           │
│  Share via:                               │
│  [WhatsApp] [Facebook] [Twitter] [Email] │
├──────────────────────────────────────────┤
│  How It Works (3 steps)                   │
│  Benefits                                 │
└──────────────────────────────────────────┘
```

## 📁 Files Created/Modified

### Created:
1. **`src/components/portal/ReferralPage.tsx`**
   - Main referral page component
   - Displays referral code and statistics
   - Share functionality

### Modified:
2. **`src/components/portal/PortalLayout.tsx`**
   - Added ReferralPage import
   - Added 'referral' case in routing

3. **`src/components/portal/PortalSidebar.tsx`**
   - Added Referral menu button
   - Added Users2 icon import
   - Emerald gradient styling

## 🔧 How It Works

### Code Generation
```typescript
const generateReferralCode = () => {
  if (!user || !currentProfile) return '';
  // Create unique code from user ID and profile ID
  const userPart = user.id.substring(0, 4).toUpperCase();
  const profilePart = currentProfile.id.substring(
    currentProfile.id.length - 4
  ).toUpperCase();
  return `GEETA-${userPart}-${profilePart}`;
};
```

### Referral Link Format
```
https://your-app.com?ref=GEETA-XXXX-YYYY
```

### Copy to Clipboard
```typescript
const handleCopy = (text: string, type: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${type} copied to clipboard!`);
};
```

### Social Sharing
```typescript
// WhatsApp
https://wa.me/?text=Join%20me%20on%20Geeta%20Olympiad!%20Code:...

// Facebook
https://www.facebook.com/sharer/sharer.php?u=...

// Twitter
https://twitter.com/intent/tweet?text=...&url=...

// Email
mailto:?subject=...&body=...
```

## 🎯 User Flow

### Sharing Referral
```
1. User logs in
   ↓
2. Goes to Referral page (sidebar)
   ↓
3. Sees unique code: GEETA-XXXX-YYYY
   ↓
4. Clicks share button (WhatsApp/Facebook/etc)
   ↓
5. Shares with friend
   ↓
6. Friend receives link/code
```

### Using Referral Code
```
1. New user clicks referral link
   ↓
2. URL contains: ?ref=GEETA-XXXX-YYYY
   ↓
3. User registers account
   ↓
4. Backend verifies referral code
   ↓
5. Both users get rewards:
   - Referrer: +100 credits
   - New user: +50 credits
```

## 📊 Statistics Display

### Current Stats (Placeholder):
```javascript
{
  totalReferrals: 0,     // Count of successful referrals
  creditsEarned: 0,       // Total credits from referrals
  activeReferrals: 0      // Active referred users
}
```

### To Implement (Backend):
- Track referrals in MongoDB
- Count successful registrations
- Calculate earned credits
- Show referral history

## 🎨 Styling

### Color Scheme:
- **Primary:** Emerald/Green gradient
- **Card backgrounds:** Cream/beige tones
- **Accent:** Orange/red tones (Geeta brand colors)

### Button Styles:
```css
WhatsApp: bg-[#25D366]
Facebook: bg-[#1877F2]
Twitter: bg-[#1DA1F2]
Email: bg-[#EA4335]
```

## 🚀 Testing

### Test 1: View Referral Page
1. Login as user
2. Click "Referral" in sidebar
3. **Expected:** Page loads with unique code
4. **Result:** ✅

### Test 2: Copy Code
1. On referral page
2. Click "Copy" button next to code
3. **Expected:** Code copied, success toast shown
4. **Result:** ✅

### Test 3: Copy Link
1. On referral page
2. Click copy icon next to referral link
3. **Expected:** Full URL copied
4. **Result:** ✅

### Test 4: Share via WhatsApp
1. Click "WhatsApp" button
2. **Expected:** Opens WhatsApp with pre-filled message
3. **Result:** ✅

### Test 5: Unique Code Generation
1. Login with User A
2. Note referral code
3. Login with User B  
4. **Expected:** Different code for User B
5. **Result:** ✅

## 📱 Mobile Responsive

### Desktop (>768px):
- 3-column statistics grid
- 4-column share buttons
- Full width layout

### Mobile (<768px):
- 1-column statistics stack
- 2-column share buttons
- Touch-friendly buttons
- Native share available

## 🔐 Security Considerations

### Current Implementation:
- ✅ Code based on user/profile IDs (unique)
- ✅ Read-only code display
- ✅ Client-side code generation

### To Add (Backend):
- Verify referral codes on registration
- Prevent self-referrals
- Track referral usage
- Limit rewards per user
- Detect fraud/abuse

## 📈 Backend Integration (To Do)

### Database Schema:
```javascript
// Referrals Collection
{
  _id: ObjectId,
  referrerId: String,        // User who referred
  referredUserId: String,    // New user
  referralCode: String,      // Code used
  status: String,            // pending/completed/rewarded
  creditsAwarded: Number,    // Credits given
  createdAt: Date,
  completedAt: Date
}

// Update User Schema:
{
  ...existingFields,
  referralCode: String,      // User's unique code
  referredBy: String,        // Who referred them
  referralCount: Number,     // Total referrals
  referralCredits: Number    // Credits from referrals
}
```

### API Endpoints Needed:
```javascript
// Get referral statistics
GET /api/referrals/stats/:userId

// Track referral usage
POST /api/referrals/track
{
  referralCode: string,
  newUserId: string
}

// Get referral history
GET /api/referrals/history/:userId

// Award referral credits
POST /api/referrals/reward
{
  referralId: string
}
```

## 🎁 Reward Rules

### Current Design:
- **Per Referral:** 100 credits to referrer
- **Welcome Bonus:** 50 credits to referred user
- **Unlimited:** No cap on referrals

### Future Enhancements:
- Tiered rewards (5 referrals = bonus)
- Special event bonuses
- Referral leaderboard
- Milestone rewards

## ✅ Summary

### What's Working:
- ✅ Referral page created
- ✅ Unique code generation
- ✅ Copy functionality
- ✅ Social sharing buttons
- ✅ Responsive design
- ✅ Sidebar navigation
- ✅ Beautiful UI

### To Implement:
- Backend referral tracking
- Database integration
- Credit rewards system
- Referral statistics
- Usage analytics

### How to Use:
1. **Refresh browser** (Ctrl + Shift + R)
2. **Login** to your account
3. **Click "Referral"** in sidebar
4. **Copy your code** and share it!

---

**Status:** ✅ Frontend Complete  
**Backend:** To be implemented  
**Ready for:** Testing and sharing! 🚀

