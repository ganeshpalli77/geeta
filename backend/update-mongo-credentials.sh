#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║     MongoDB Credentials Updater                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Get current directory
cd "$(dirname "$0")"

echo "Choose an option:"
echo ""
echo "1. Use: geethadatabase01 / Getha2025 (New password)"
echo "2. Use: geethauser / Getha2025 (New user)"
echo "3. Custom (I'll enter my own username/password)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    USERNAME="geethadatabase01"
    PASSWORD="Getha2025"
    ;;
  2)
    USERNAME="geethauser"
    PASSWORD="Getha2025"
    ;;
  3)
    read -p "Enter username: " USERNAME
    read -p "Enter password: " PASSWORD
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
NODE_ENV=development
EOF

echo ""
echo "✅ .env file updated!"
echo ""
echo "Connection string:"
echo "mongodb+srv://${USERNAME}:****@cluster0.ixnaagr.mongodb.net/geeta-olympiad"
echo ""
echo "Testing connection..."
node test-mongo-connection.js

echo ""
echo "If connection successful, start your server with:"
echo "  npm run dev"

