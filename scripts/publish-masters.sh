#!/bin/bash

set -e

echo "📦 Publishing Rascacielo Masters to NPM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to masters directory
cd agents/masters

# Ensure tests pass
echo "🧪 Running tests..."
npm test

# Check npm login
echo "🔐 Checking NPM authentication..."
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ Not logged into npm. Run: npm login"
  exit 1
fi

echo "✅ Authenticated as: $(npm whoami)"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📌 Current version: $CURRENT_VERSION"

# Ask for version bump
echo ""
echo "Select version bump:"
echo "  1) patch (bug fixes)"
echo "  2) minor (new features)"
echo "  3) major (breaking changes)"
echo "  4) custom version"
read -p "Choice (1-4): " choice

case $choice in
  1) npm version patch ;;
  2) npm version minor ;;
  3) npm version major ;;
  4) 
    read -p "Enter custom version: " custom_version
    npm version $custom_version
    ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 New version: $NEW_VERSION"

# Publish to npm
echo "🚀 Publishing to NPM..."
npm publish --access public

echo ""
echo "✅ Successfully published @melampe001/rascacielo-masters@$NEW_VERSION"
echo "📦 https://www.npmjs.com/package/@melampe001/rascacielo-masters"
echo ""
echo "Install with: npm install @melampe001/rascacielo-masters@$NEW_VERSION"
