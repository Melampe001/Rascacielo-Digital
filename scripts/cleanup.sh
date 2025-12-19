#!/bin/bash

# Cleanup Script - Rascacielos Digital
# Script de limpieza y mantenimiento del sistema

echo "=== Iniciando Limpieza y Mantenimiento ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean temporary files
echo -e "${YELLOW}Limpiando archivos temporales...${NC}"
rm -rf ./tmp/* 2>/dev/null || true
rm -rf ./*.tmp 2>/dev/null || true
echo -e "${GREEN}✓ Archivos temporales eliminados${NC}"

# Clean old build artifacts
echo -e "${YELLOW}Limpiando artefactos de build antiguos...${NC}"
rm -rf ./dist/* 2>/dev/null || true
rm -rf ./build/* 2>/dev/null || true
echo -e "${GREEN}✓ Artefactos de build eliminados${NC}"

# Clean coverage reports older than 7 days
echo -e "${YELLOW}Limpiando reportes de cobertura antiguos...${NC}"
find ./coverage -type f -mtime +7 -delete 2>/dev/null || true
echo -e "${GREEN}✓ Reportes de cobertura antiguos eliminados${NC}"

# Clean old log files (older than 30 days)
echo -e "${YELLOW}Limpiando archivos de log antiguos...${NC}"
find ./logs -type f -name "*.log" -mtime +30 -delete 2>/dev/null || true
echo -e "${GREEN}✓ Logs antiguos eliminados${NC}"

# Clean old reports (older than 14 days)
echo -e "${YELLOW}Limpiando reportes antiguos...${NC}"
find ./reports -type f -mtime +14 -delete 2>/dev/null || true
echo -e "${GREEN}✓ Reportes antiguos eliminados${NC}"

# Clean node_modules cache (optional, commented out by default)
# echo -e "${YELLOW}Limpiando cache de npm...${NC}"
# npm cache clean --force 2>/dev/null || true
# echo -e "${GREEN}✓ Cache de npm limpiado${NC}"

# Display disk usage
echo ""
echo "=== Uso de Disco ==="
du -sh . 2>/dev/null || echo "No se pudo determinar el uso de disco"

echo ""
echo -e "${GREEN}=== Limpieza Completada ===${NC}"

exit 0
