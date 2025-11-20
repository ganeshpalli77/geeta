@echo off
echo Starting Geeta Olympiad Backend Server...
echo.
echo Make sure you have:
echo 1. Created .env file with MongoDB connection string
echo 2. Whitelisted your IP in MongoDB Atlas
echo 3. Installed dependencies (npm install)
echo.
pause
npm run dev
