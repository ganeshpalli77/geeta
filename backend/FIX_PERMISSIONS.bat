@echo off
echo ====================================
echo Updating User Permissions
echo ====================================
echo.
echo Go to MongoDB Atlas:
echo 1. Database Access
echo 2. Edit user: geethauser
echo 3. Change privileges to: "Read and write to any database"
echo 4. Click Update User
echo 5. Wait 1-2 minutes
echo.
echo Then press any key to test...
pause
echo.
echo Testing connection...
curl http://localhost:5000/api/users/register -X POST -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
echo.
pause
