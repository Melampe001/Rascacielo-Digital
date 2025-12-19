#!/bin/bash

# Lint and Format Script for Rascacielo Digital
# Runs ESLint and Prettier to ensure code quality

echo "🎨 Starting lint and format process..."
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies first..."
    npm install
    echo ""
fi

# Run ESLint
echo "🔍 Running ESLint..."
echo "================================"
npm run lint:fix

LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    echo "✅ ESLint completed successfully!"
else
    echo "⚠️  ESLint found issues. Review the output above."
fi

echo ""
echo "================================"
echo ""

# Run Prettier
echo "✨ Running Prettier..."
echo "================================"
npm run format

FORMAT_EXIT_CODE=$?

if [ $FORMAT_EXIT_CODE -eq 0 ]; then
    echo "✅ Prettier completed successfully!"
else
    echo "⚠️  Prettier encountered issues. Review the output above."
fi

echo ""
echo "================================"
echo ""

# Summary
if [ $LINT_EXIT_CODE -eq 0 ] && [ $FORMAT_EXIT_CODE -eq 0 ]; then
    echo "✅ All code quality checks passed!"
    exit 0
else
    echo "⚠️  Some code quality checks failed. Please review the output above."
    exit 1
fi
