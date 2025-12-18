#!/bin/bash
set -e

echo "🧹 LIMPIEZA AUTOMÁTICA - Rascacielo Digital"
echo "==========================================="

# Limpiar artefactos previos
echo ""
echo "🗑️  Limpiando artefactos previos..."
npm run clean || rm -rf dist/ coverage/ || true

# Limpiar node_modules y reinstalar
echo ""
echo "📦 Limpiando node_modules..."
rm -rf node_modules package-lock.json

echo ""
echo "📥 Instalando dependencias..."
npm install

# Auditar seguridad y aplicar correcciones automáticas
echo ""
echo "🔒 Auditando seguridad y aplicando correcciones..."
npm audit fix || echo "⚠️  Algunas vulnerabilidades no se pudieron corregir automáticamente"

# Actualizar dependencias (minor/patch)
echo ""
echo "⬆️  Actualizando dependencias (patch y minor)..."
npm update

# Aplicar formato
echo ""
echo "✨ Formateando código..."
npm run format || npx prettier --write "**/*.{js,json,md}"

# Lint
echo ""
echo "🔍 Ejecutando linter..."
npm run lint || npx eslint . --fix

# Ejecutar tests
echo ""
echo "🧪 Ejecutando tests..."
npm test

echo ""
echo "✅ Limpieza completada exitosamente"
echo ""
echo "📊 Estado final:"
echo "- Dependencias: actualizadas"
echo "- Código: formateado y limpio"
echo "- Tests: pasando"
echo "- Listo para commit 🚀"
