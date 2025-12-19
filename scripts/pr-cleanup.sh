#!/bin/bash

# This script automates the PR cleanup process for the current consolidation task.
# It is designed to work with the specific set of PRs identified in docs/PR_CONSOLIDATION.md
# PR numbers are hardcoded as per the cleanup specification.

echo "🧹 === LIMPIEZA AUTOMATIZADA DE PRs ==="

# Verificar gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ gh CLI no está instalado"
    exit 1
fi

# Cerrar PRs obsoletos
echo ""
echo "📋 Cerrando PRs obsoletos..."
bash scripts/close-obsolete-prs.sh

# Mergear PRs listos
echo ""
echo "✅ Mergeando PRs listos..."

echo "📦 Mergeando PR #34 (Dependencies)..."
gh pr merge 34 --squash --delete-branch || echo "⚠️ PR #34 no se pudo mergear automáticamente"

echo "📦 Mergeando PR #35 (Update dependencies)..."
gh pr merge 35 --squash --delete-branch || echo "⚠️ PR #35 no se pudo mergear automáticamente"

# Reinstalar después de mergear dependencies
echo ""
echo "📦 Reinstalando dependencias..."
git pull origin Main
npm install

# Verificar estado
echo ""
echo "📊 Estado actual de PRs:"
gh pr list --state open

echo ""
echo "✅ Limpieza completada"
echo "⏳ PRs #36 y #37 aún en progreso (revisar en 10 minutos)"
echo "⚠️  PRs #32 y #33 requieren fix de permisos primero"
