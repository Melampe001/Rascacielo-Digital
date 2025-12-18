#!/bin/bash

echo "🤖 ELARA'S AUTO-CONSOLIDATION TRIGGER"
echo "====================================="
echo ""
echo "Lead Engineer: Elara"
echo "Command: AUTOMATE ALL COLLABORATIONS"
echo ""

read -p "⚠️  This will auto-merge all PRs. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Consolidation cancelled"
  exit 1
fi

echo ""
echo "🚀 Triggering auto-consolidation..."
echo ""

# Trigger GitHub Actions workflow
gh workflow run auto-consolidate.yml

echo ""
echo "✅ Consolidation triggered"
echo "📊 Monitor progress: gh run list --workflow=auto-consolidate.yml"
echo ""
