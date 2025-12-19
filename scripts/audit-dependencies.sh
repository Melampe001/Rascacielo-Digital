#!/bin/bash

# Dependency Audit Script for Rascacielo Digital
# Performs security audits and checks for outdated packages

echo "🔍 Starting dependency audit..."
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

# Run npm audit
echo "📋 Running npm audit..."
echo "================================"
npm audit --audit-level=info

AUDIT_EXIT_CODE=$?

if [ $AUDIT_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ No vulnerabilities found!"
else
    echo ""
    echo "⚠️  Vulnerabilities detected. Run 'npm audit fix' to attempt automatic fixes."
fi

echo ""
echo "================================"
echo ""

# Check for outdated packages
echo "📦 Checking for outdated packages..."
echo "================================"
npm outdated || true

echo ""
echo "================================"
echo ""

# Display summary
echo "📊 Audit Summary:"
echo "--------------------------------"
npm list --depth=0 2>/dev/null | head -1
echo ""

if [ $AUDIT_EXIT_CODE -eq 0 ]; then
    echo "✅ Dependency audit completed successfully!"
    exit 0
else
    echo "⚠️  Dependency audit completed with warnings."
    echo "   Review the output above and take appropriate action."
    exit $AUDIT_EXIT_CODE
fi
