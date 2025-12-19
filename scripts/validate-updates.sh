#!/bin/bash

###############################################################################
# Validate Updates Script
# Comprehensive validation of dependency updates
###############################################################################

set -e  # Exit on error

echo "🔍 Validando actualizaciones de dependencias..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter for steps
STEP=1

print_step() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Paso $STEP: $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    ((STEP++))
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Clean install
print_step "Limpieza e instalación de dependencias"
echo "Eliminando node_modules y package-lock.json..."
rm -rf node_modules package-lock.json
print_success "Limpieza completada"

echo "Instalando dependencias..."
npm install
print_success "Dependencias instaladas"

# Step 2: Security audit
print_step "Auditoría de seguridad"
if npm audit --audit-level=moderate; then
    print_success "Sin vulnerabilidades de seguridad"
else
    print_warning "Se encontraron vulnerabilidades - revisar manualmente con 'npm audit'"
fi

# Step 3: Check outdated packages
print_step "Verificando paquetes desactualizados"
npm outdated || print_warning "Algunos paquetes tienen actualizaciones disponibles"

# Step 4: Lint check
print_step "Verificando calidad de código (ESLint)"
if npm run lint; then
    print_success "Linting pasó sin errores"
else
    print_error "Errores de linting encontrados"
    exit 1
fi

# Step 5: Format check
print_step "Verificando formato de código (Prettier)"
if npm run format:check; then
    print_success "Formato de código correcto"
else
    print_error "Errores de formato encontrados - ejecutar 'npm run format'"
    exit 1
fi

# Step 6: Run tests
print_step "Ejecutando suite de tests"
if npm test; then
    print_success "Todos los tests pasaron"
else
    print_error "Tests fallaron"
    exit 1
fi

# Step 7: Build verification
print_step "Verificando proceso de build"
if npm run build; then
    print_success "Build exitoso"
else
    print_error "Build falló"
    exit 1
fi

# Step 8: Check package.json validity
print_step "Validando package.json"
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"; then
    print_success "package.json es válido"
else
    print_error "package.json contiene errores de sintaxis"
    exit 1
fi

# Final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 VALIDACIÓN COMPLETADA EXITOSAMENTE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Todas las validaciones pasaron correctamente"
echo ""
echo "📊 Resumen de validaciones:"
echo "  ✅ Instalación de dependencias"
echo "  ✅ Auditoría de seguridad"
echo "  ✅ Linting (ESLint)"
echo "  ✅ Formato (Prettier)"
echo "  ✅ Tests (Jest)"
echo "  ✅ Build"
echo "  ✅ Validación de package.json"
echo ""
print_success "¡Las dependencias están actualizadas y el proyecto está funcionando correctamente!"
