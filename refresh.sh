#!/bin/bash
echo "🛑 Stopping old process..."
# Note: 'npm start' usually runs on port 3000. This kills whatever is on that port.
fuser -k 3000/tcp

echo "⬇️ Pulling latest code from GitHub..."
git pull

echo "📦 Installing any new dependencies..."
npm install

echo "🏗️ Building the app..."
npm run build

echo "🚀 Starting server..."
npm start

