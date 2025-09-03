#!/bin/bash

echo "🚀 Slim Minder Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Building web app..."
cd apps/mobile

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Build web app
echo "🔨 Building web app..."
npm run build:web

if [ $? -eq 0 ]; then
    echo "✅ Web build successful!"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. Netlify Dashboard: https://netlify.com"
    echo "2. Drag & Drop: https://netlify.com/drop"
    echo "3. GitHub Actions: Automatisch na push"
    echo ""
    echo "📁 Build files ready in: apps/mobile/web-build/"
    echo "🚀 Deploy deze map naar Netlify!"
else
    echo "❌ Build failed!"
    exit 1
fi
