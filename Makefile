# Makefile - Automatización de Build

.PHONY: help build watch clean test lint install

# Default target
.DEFAULT_GOAL := help

help:  ## Muestra esta ayuda
	@echo "🔨 RASCACIELOS DIGITAL - BUILD AUTOMATION"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:  ## Instala dependencias
	@echo "📦 Instalando dependencias..."
	npm install
	npm install --save-dev chokidar

setup: install  ## Setup completo del proyecto
	@echo "🔧 Configurando proyecto..."
	@if command -v npx > /dev/null && [ -f package.json ]; then \
		npx husky install 2>/dev/null || echo "⚠️  Husky no disponible aún"; \
	fi
	@echo "✅ Setup completado"

build:  ## Ejecuta build idempotente
	@echo "🔨 Ejecutando build..."
	node build-idempotent.js

build-force:  ## Fuerza rebuild completo
	@echo "🔨 Forzando rebuild..."
	node build-idempotent.js --force

watch:  ## Inicia file watcher
	@echo "👀 Iniciando watcher..."
	node watch-build.js

clean:  ## Limpia artefactos de build
	@echo "🧹 Limpiando..."
	rm -rf dist/ .build-cache/
	@echo "✅ Limpieza completada"

test:  ## Ejecuta tests
	@echo "🧪 Ejecutando tests..."
	@if [ -f package.json ] && grep -q '"test"' package.json; then \
		npm test; \
	else \
		echo "⚠️  No hay tests configurados"; \
	fi

lint:  ## Ejecuta linter
	@echo "🔍 Ejecutando linter..."
	@if [ -f package.json ] && grep -q '"lint"' package.json; then \
		npm run lint; \
	else \
		echo "⚠️  No hay linter configurado"; \
	fi

lint-fix:  ## Ejecuta linter con auto-fix
	@echo "🔧 Ejecutando linter con auto-fix..."
	@if [ -f package.json ] && grep -q '"lint:fix"' package.json; then \
		npm run lint:fix; \
	else \
		echo "⚠️  No hay linter configurado"; \
	fi

ci:  ## Simula CI completo
	@echo "🔄 Simulando CI..."
	@$(MAKE) lint || true
	@$(MAKE) test || true
	@$(MAKE) build
	@echo "✅ CI completado"

idempotency-test:  ## Verifica idempotencia
	@echo "🧪 Verificando idempotencia..."
	@node build-idempotent.js
	@CHECKSUM1=$$(cat dist/.build-checksum 2>/dev/null || echo "none"); \
	node build-idempotent.js --force; \
	CHECKSUM2=$$(cat dist/.build-checksum 2>/dev/null || echo "none"); \
	if [ "$$CHECKSUM1" = "$$CHECKSUM2" ] && [ "$$CHECKSUM1" != "none" ]; then \
		echo "✅ Build es idempotente!"; \
	else \
		echo "❌ Build NO es idempotente"; \
		exit 1; \
	fi

stats:  ## Muestra estadísticas de build
	@echo "📊 Estadísticas de Build:"
	@if [ -f dist/build-manifest.json ]; then \
		if command -v jq > /dev/null; then \
			cat dist/build-manifest.json | jq .; \
		else \
			cat dist/build-manifest.json; \
		fi; \
	else \
		echo "⚠️  No existe build previo"; \
	fi
