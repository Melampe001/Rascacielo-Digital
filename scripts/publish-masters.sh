#!/bin/bash

echo "📦 Publicando @melampe001/rascacielo-masters..."

cd agents/masters

# Verificar que todos los archivos existen
echo "✅ Verificando archivos..."
required_files=("package.json" "index.js" "README.md" "LICENSE")
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Falta archivo: $file"
    exit 1
  fi
done

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test

# Publicar
echo "🚀 Publicando a NPM..."
npm publish --access public

echo "✅ Publicado exitosamente!"
