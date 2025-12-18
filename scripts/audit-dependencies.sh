#!/bin/bash
set -e

echo "🔍 Auditando dependencias - Rascacielo Digital"
echo "=============================================="

# Auditoría de seguridad
echo ""
echo "📋 Ejecutando npm audit..."
npm audit

# Verificar dependencias obsoletas
echo ""
echo "📊 Verificando versiones obsoletas..."
npm outdated || true

# Generar reporte de dependencias no utilizadas
echo ""
echo "🔎 Analizando dependencias no utilizadas..."
if command -v npx &> /dev/null; then
    npx depcheck || true
else
    echo "⚠️  depcheck no está instalado. Instálalo con: npm install -g depcheck"
fi

echo ""
echo "✅ Auditoría completada"
echo ""
echo "📝 Resumen:"
echo "- Revisa las vulnerabilidades encontradas arriba"
echo "- Actualiza dependencias obsoletas con: npm update"
echo "- Considera remover dependencias no utilizadas"
