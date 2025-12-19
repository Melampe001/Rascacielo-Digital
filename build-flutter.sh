#!/bin/bash
# Build script for Flutter Web

set -e

echo "🏗️  Building Rascacielo Digital Flutter Web Application"
echo "=================================================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter SDK first."
    exit 1
fi

# Navigate to flutter_web directory
cd "$(dirname "$0")/flutter_web"

echo "📦 Installing dependencies..."
flutter pub get

echo "🧹 Cleaning previous builds..."
flutter clean

echo "🔨 Building for web (release mode)..."
flutter build web --release --web-renderer html

echo "✅ Build completed successfully!"
echo "📁 Output directory: build/web/"
echo ""
echo "To test locally, run:"
echo "  cd flutter_web/build/web && python3 -m http.server 8000"
echo ""
echo "Or deploy to Vercel:"
echo "  cd flutter_web && vercel deploy"
