@echo off
echo ====================================
echo Updating .env with new credentials
echo ====================================
echo.
echo Username: geethauser
echo Password: Getha2024
echo.

(
echo MONGODB_URI=mongodb+srv://geethauser:Getha2024@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true^&w=majority^&appName=Cluster0
echo PORT=5000
echo NODE_ENV=development
) > .env

echo.
echo ✓ .env file updated!
echo.
echo The server should restart automatically.
echo If not, press Ctrl+C and run: npm run dev
echo.
pause
