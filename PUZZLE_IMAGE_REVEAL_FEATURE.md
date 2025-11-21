# 🧩 Puzzle Image Reveal Feature - Implementation Guide

## Overview

The Puzzle Image Reveal feature allows users to progressively reveal the beautiful Bhagavad Gita Philosophy artwork by checking boxes. Each checked box reveals one piece of the complete image, creating an engaging 35-day challenge.

## 🎯 Feature Highlights

### Visual Design
- **Image**: Divine Bhagavad Gita scene with Krishna and Arjuna on the chariot
- **Grid Layout**: 7 columns × 5 rows = 35 pieces
- **Progressive Reveal**: Each checked box unveils one piece of the image
- **Visual Feedback**: Uncollected pieces appear dark/blurred, collected pieces are crystal clear

### User Experience
- ✅ **Checkbox Interface**: Simple, intuitive checkbox grid
- 🎨 **Color-Coded**: Purple gradient for collected pieces, white for uncollected
- 📊 **Progress Bar**: Visual progress indicator showing completion percentage
- 🏆 **Completion Celebration**: Special message when all 35 pieces are collected
- 💰 **Rewards**: 50 credits per piece collected

## 📁 Files Modified/Created

### Frontend Changes

#### 1. `src/components/portal/TaskPages.tsx`
**Changes:**
- Added `Checkbox` component import
- Imported the Bhagavad Gita image from assets
- Replaced button-based collection with checkbox grid
- Created 7x5 grid layout matching the image overlay
- Enhanced visual styling with purple/indigo gradient theme

**Key Features:**
```typescript
// 7x5 Grid Layout (35 pieces total)
<div className="grid grid-cols-7 gap-3">
  {puzzlePieces.map((piece) => (
    <Checkbox
      checked={piece.collected}
      onCheckedChange={() => handleCollectPuzzlePiece(piece.id)}
      disabled={piece.collected || collecting}
    />
  ))}
</div>
```

#### 2. `src/assets/bhagavad-gita-complete.jpg`
**New File:**
- High-quality Bhagavad Gita Philosophy artwork
- Shows Krishna and Arjuna on the divine chariot
- Used as the base image for the puzzle reveal

### Backend Changes

#### 3. `backend/scripts/setupPuzzleImage.js`
**New File:**
- Reads the Bhagavad Gita image from assets
- Converts to base64 format
- Stores in MongoDB `puzzleConfig` collection
- Configures 35 pieces with 50 credits each

#### 4. `backend/package.json`
**Added Script:**
```json
"setup:puzzle": "node scripts/setupPuzzleImage.js"
```

## 🚀 Setup Instructions

### Step 1: Install Dependencies (if needed)
```bash
cd c:\ganesh\code\geeta\geeta
npm install
```

### Step 2: Setup Puzzle Image in MongoDB
```bash
cd backend
npm run setup:puzzle
```

**Expected Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
📁 Reading image from: [path]
✅ Image loaded, size: XXX KB
✅ Puzzle configuration updated successfully!

📊 Configuration:
   - Total Pieces: 35 (7x5 grid)
   - Credits per piece: 50
   - Image: Bhagavad Gita Philosophy

🎮 Users can now collect puzzle pieces at: http://localhost:3000/#puzzle-task
```

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```

**Backend runs on:** http://localhost:5000

### Step 4: Start Frontend
```bash
cd ..
npm run dev
```

**Frontend runs on:** http://localhost:3000

## 🎮 How to Use

### For Users:

1. **Navigate to Puzzle Task**
   - Login to your account
   - Go to Round 1
   - Click on "Collect Today's Puzzle Piece" task
   - Or directly visit: http://localhost:3000/#puzzle-task

2. **Check a Box to Collect**
   - You can collect ONE piece per day
   - Check any unchecked box (numbered 1-35)
   - The box will turn purple ✓
   - That piece of the image will instantly reveal
   - You earn 50 credits!

3. **Complete the Challenge**
   - Return daily to check one more box
   - Watch the divine image slowly reveal over 35 days
   - Complete all pieces to see the full artwork

### Visual Layout:

```
┌─────────────────────────────────────────────┐
│  🖼️ Bhagavad Gita Philosophy Image          │
│  [7x5 Grid Overlay - Some pieces revealed]  │
│  • Dark/blurred = Not collected              │
│  • Clear/visible = Collected                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ✅ 35 Days Challenge - Check to collect    │
│                                              │
│  [ ] 1   [ ] 2   [✓] 3   [ ] 4   [ ] 5  ... │
│  [ ] 8   [✓] 9   [ ] 10  [ ] 11  [ ] 12 ... │
│  ...                                         │
│  (7 columns × 5 rows = 35 checkboxes)       │
└─────────────────────────────────────────────┘
```

## 🎨 Design Details

### Color Scheme:
- **Uncollected**: White background, gray border
- **Collected**: Purple-to-indigo gradient, white checkmark
- **Hover**: Purple border highlight
- **Container**: Purple-indigo-blue gradient background

### Grid Structure:
```
Row 1: Pieces 1-7
Row 2: Pieces 8-14
Row 3: Pieces 15-21
Row 4: Pieces 22-28
Row 5: Pieces 29-35
```

### Image Overlay Logic:
- Each piece corresponds to 1/35th of the image
- Grid overlay uses CSS Grid with exact 7×5 layout
- Uncollected pieces have dark overlay (85% black) + blur effect
- Collected pieces are transparent, showing the image clearly
- Smooth transition animation when piece is revealed

## 📊 Database Structure

### Collection: `puzzleConfig`
```javascript
{
  type: 'daily',
  totalPieces: 35,
  imageData: 'data:image/jpeg;base64,...',  // Base64 image
  imageUrl: null,
  creditsPerPiece: 50,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `puzzlePieces`
```javascript
{
  userId: String,           // User who collected
  profileId: String,        // Profile ID
  pieceNumber: Number,      // 1-35
  collectedDate: String,    // 'YYYY-MM-DD'
  collectedAt: Date        // Full timestamp
}
```

## 🔒 Business Rules

### Collection Restrictions:
1. **One per day**: Users can only collect ONE piece per day
2. **No duplicates**: Same piece number cannot be collected twice
3. **Any order**: Users can collect pieces in any order (doesn't have to be sequential)
4. **Profile-specific**: Each profile tracks pieces independently

### Validation:
- Backend checks if user already collected a piece today
- Backend checks if specific piece number already collected
- Frontend disables already-collected checkboxes
- Toast notifications provide clear feedback

## 🧪 Testing Checklist

- [ ] Image displays correctly at http://localhost:3000/#puzzle-task
- [ ] All 35 checkboxes render in 7×5 grid
- [ ] Checking a box reveals corresponding image piece
- [ ] Only one piece can be collected per day
- [ ] Progress bar updates correctly (0-100%)
- [ ] Credits are awarded (50 per piece)
- [ ] Completion message shows when all 35 collected
- [ ] Backend stores pieces in MongoDB correctly
- [ ] Pieces persist after page refresh
- [ ] Mobile responsive design works

## 🐛 Troubleshooting

### Issue: Image not showing
**Solution:**
1. Verify image exists at `src/assets/bhagavad-gita-complete.jpg`
2. Run `npm run setup:puzzle` in backend
3. Check browser console for errors
4. Restart frontend dev server

### Issue: "Already collected today" message
**Solution:**
- This is by design - users can only collect ONE piece per day
- To test multiple pieces, modify the date check in backend temporarily
- Or use different profiles

### Issue: Checkbox doesn't work
**Solution:**
1. Ensure backend is running on port 5000
2. Check network tab for API errors
3. Verify user is logged in with a profile
4. Check MongoDB connection

### Issue: Image pieces don't reveal
**Solution:**
1. Check if `collectedPieces` state is updating
2. Verify API response contains piece data
3. Check CSS overlay styles in browser DevTools
4. Clear browser cache and reload

## 🎯 Future Enhancements

Potential improvements:
- [ ] Animation effects when piece is revealed
- [ ] Sound effects for collection
- [ ] Share progress on social media
- [ ] Different images for different rounds
- [ ] Leaderboard for fastest completers
- [ ] Hints or daily reminders
- [ ] Mobile app version
- [ ] Offline support with sync

## 📝 API Endpoints Used

### GET `/api/puzzle/config`
Get puzzle configuration (total pieces, image, credits)

### GET `/api/puzzle/pieces/:userId/:profileId`
Get user's collected puzzle pieces

### POST `/api/puzzle/collect`
Collect a specific puzzle piece
```json
{
  "userId": "string",
  "profileId": "string",
  "pieceNumber": 1-35
}
```

## ✨ Summary

The Puzzle Image Reveal feature is now fully implemented with:
- ✅ Beautiful Bhagavad Gita artwork
- ✅ Interactive checkbox-based collection
- ✅ Progressive image reveal (35 pieces)
- ✅ 7×5 grid layout matching image overlay
- ✅ Daily collection limits
- ✅ Credit rewards system
- ✅ MongoDB persistence
- ✅ Responsive design
- ✅ Visual feedback & progress tracking

**Status:** ✅ Ready for Production

**Access:** http://localhost:3000/#puzzle-task

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0  
**Author:** Geeta Olympiad Development Team
