#!/bin/bash
set -e

echo "✨ Limpieza de código - Rascacielo Digital"
echo "=========================================="

# Aplicar ESLint
echo ""
echo "🔍 Ejecutando ESLint con correcciones automáticas..."
npx eslint . --fix

# Aplicar Prettier
echo ""
echo "🎨 Aplicando formato con Prettier..."
npx prettier --write "**/*.{js,json,md}"

echo ""
echo "✅ Código formateado correctamente"
echo ""
echo "💡 Recomendaciones:"
echo "- Revisa los cambios con: git diff"
echo "- Ejecuta los tests con: npm test"
echo "- Verifica el build con: npm run build"
