#!/bin/bash

# Cleanup Script for Rascacielo Digital
# Removes temporary files, build artifacts, and caches

echo "🧹 Starting cleanup process..."

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
fi

# Remove build artifacts
if [ -d "dist" ]; then
    echo "Removing dist directory..."
    rm -rf dist
fi

if [ -d "build" ]; then
    echo "Removing build directory..."
    rm -rf build
fi

# Remove coverage reports
if [ -d "coverage" ]; then
    echo "Removing coverage directory..."
    rm -rf coverage
fi

if [ -d ".nyc_output" ]; then
    echo "Removing .nyc_output directory..."
    rm -rf .nyc_output
fi

# Remove log files
echo "Removing log files..."
find . -type f -name "*.log" -not -path "./node_modules/*" -delete 2>/dev/null || true

# Remove cache files
if [ -f ".eslintcache" ]; then
    echo "Removing .eslintcache..."
    rm -f .eslintcache
fi

# Remove temporary directories
if [ -d "tmp" ]; then
    echo "Removing tmp directory..."
    rm -rf tmp
fi

if [ -d "temp" ]; then
    echo "Removing temp directory..."
    rm -rf temp
fi

# Remove .DS_Store files (macOS)
echo "Removing .DS_Store files..."
find . -type f -name ".DS_Store" -delete 2>/dev/null || true

# Remove editor temp files
echo "Removing editor temporary files..."
find . -type f \( -name "*.swp" -o -name "*.swo" -o -name "*~" \) -delete 2>/dev/null || true

echo "✅ Cleanup completed successfully!"
echo ""
echo "To reinstall dependencies, run: npm install"
