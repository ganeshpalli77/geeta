# Backend Port Changed to 5001

## Issue
Port 5000 was being used by macOS ControlCenter (AirPlay Receiver), causing the error:
```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solution
Changed backend port from **5000** to **5001**

## Files Updated

### Backend
- ✅ `.env` - Created with PORT=5001
- ✅ `server.js` - Added better error handling

### Frontend  
- ✅ `src/services/quizServiceAPI.ts` - Updated to port 5001
- ✅ `src/utils/config.ts` - Updated to port 5001
- ✅ `src/services/backendAPI.ts` - Updated to port 5001

## How to Disable AirPlay Receiver (Optional)
If you want port 5000 back:
1. System Preferences → Sharing
2. Uncheck "AirPlay Receiver"

## New URLs
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/health
