# 🧪 Puzzle Testing Mode

## Issue: "You have already collected a puzzle piece today!"

By design, users can only collect **ONE piece per day** for the 35-day challenge.

## Enable Testing Mode (Collect Multiple Pieces)

For **testing purposes only**, you can bypass the daily limit:

### Step 1: Update your `.env` file

Create or edit `backend/.env` and add:

```env
MONGODB_URI=your_mongodb_uri_here
PORT=5000
NODE_ENV=development

# Enable testing mode - collect unlimited pieces per day
PUZZLE_DEV_MODE=true
```

### Step 2: Restart the backend server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 3: Test collecting multiple pieces

Now you can check multiple boxes in the same day! ✅

---

## ⚠️ IMPORTANT: Production Settings

**Before deploying to production:**

1. Set `PUZZLE_DEV_MODE=false` or remove it from `.env`
2. Or simply delete that line completely

**Production behavior:**
- Users can collect ONLY 1 piece per day
- This is the correct behavior for the 35-day challenge
- The message will be: "You have already collected a puzzle piece today! Come back tomorrow 🗓️"

---

## How It Works

The backend checks:
1. ✅ **Dev Mode ON** → Skip daily limit check, allow multiple pieces
2. ✅ **Dev Mode OFF** → Enforce daily limit (1 per day)
3. ✅ **Always** → Prevent collecting the same piece number twice

---

## Current Status

- ✅ Error messages now display properly
- ✅ Backend has development mode flag
- ✅ Daily limit can be bypassed for testing

**To test multiple pieces:**
1. Add `PUZZLE_DEV_MODE=true` to `backend/.env`
2. Restart backend
3. Collect as many pieces as you want!
