# MongoDB Connection Setup Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "MongoDB Connection Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit the .env file with your MongoDB password" -ForegroundColor White
Write-Host "2. Go to MongoDB Atlas and whitelist your IP" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""

# Offer to open .env file
$response = Read-Host "Would you like to open .env file now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    notepad .env
}

Write-Host ""
Write-Host "MongoDB Details:" -ForegroundColor Cyan
Write-Host "  Project: geetha" -ForegroundColor White
Write-Host "  Cluster: Cluster0" -ForegroundColor White
Write-Host "  Database: geeta-olympiad" -ForegroundColor White
Write-Host "  User: pathipatijanesh_db_user" -ForegroundColor White
Write-Host ""
Write-Host "Connection String Format:" -ForegroundColor Cyan
Write-Host "mongodb+srv://pathipatijanesh_db_user:YOUR_PASSWORD@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority" -ForegroundColor Yellow
Write-Host ""
Write-Host "See CONNECT_MONGODB.md for detailed instructions" -ForegroundColor Green
