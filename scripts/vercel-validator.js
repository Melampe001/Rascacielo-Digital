#!/usr/bin/env node
/**
 * Vercel Configuration Validator
 * Simula validación estricta de Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║        🔍 VERCEL STRICT VALIDATOR - SIMULACIÓN               ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

const errors = [];
const warnings = [];

// 1. Check vercel.json exists and is valid JSON
console.log('1️⃣  Validando vercel.json...');
let config;
try {
  const content = fs.readFileSync('vercel.json', 'utf8');
  config = JSON.parse(content);
  console.log('   ✅ JSON válido');
} catch (e) {
  errors.push(`vercel.json inválido: ${e.message}`);
  console.log('   ❌ JSON inválido');
}

if (config) {
  // 2. Check for deprecated 'builds' property
  console.log('');
  console.log('2️⃣  Verificando propiedades deprecadas...');
  if (config.builds) {
    errors.push('Propiedad "builds" está DEPRECADA - usar "functions" en su lugar');
    console.log('   ❌ "builds" encontrado (DEPRECADO)');
  } else {
    console.log('   ✅ No hay propiedades deprecadas');
  }

  // 3. Check for conflicts
  console.log('');
  console.log('3️⃣  Verificando conflictos de configuración...');
  if (config.builds && config.functions) {
    errors.push('CONFLICTO: "builds" y "functions" no pueden coexistir');
    console.log('   ❌ Conflicto builds/functions');
  }
  if (config.routes && config.rewrites) {
    warnings.push('"routes" y "rewrites" juntos pueden causar comportamiento inesperado');
    console.log('   ⚠️  routes + rewrites (posible conflicto)');
  } else {
    console.log('   ✅ Sin conflictos críticos');
  }

  // 4. Validate functions configuration
  console.log('');
  console.log('4️⃣  Validando configuración de functions...');
  if (config.functions) {
    for (const [pattern, cfg] of Object.entries(config.functions)) {
      console.log(`   Patrón: ${pattern}`);
      
      // Memory validation
      if (cfg.memory) {
        if (cfg.memory < 128 || cfg.memory > 3008) {
          errors.push(`functions.memory debe ser 128-3008 MB (actual: ${cfg.memory})`);
          console.log(`   ❌ Memory inválida: ${cfg.memory}MB`);
        } else {
          console.log(`   ✅ Memory: ${cfg.memory}MB`);
        }
      }
      
      // maxDuration validation
      if (cfg.maxDuration) {
        if (cfg.maxDuration > 60) {
          warnings.push(`maxDuration ${cfg.maxDuration}s requiere plan Pro/Enterprise`);
          console.log(`   ⚠️  maxDuration: ${cfg.maxDuration}s (requiere Pro)`);
        } else {
          console.log(`   ✅ maxDuration: ${cfg.maxDuration}s`);
        }
      }

      // Check if referenced directory exists
      if (pattern.includes('api/')) {
        const apiDir = path.join(process.cwd(), 'api');
        if (!fs.existsSync(apiDir)) {
          errors.push('CRÍTICO: functions referencia "api/" pero el directorio NO EXISTE');
          console.log('   ❌ Directorio api/ NO EXISTE');
        } else {
          console.log('   ✅ Directorio api/ existe');
        }
      }
    }
  } else {
    console.log('   ℹ️  No hay functions configuradas');
  }

  // 5. Check rewrites destination
  console.log('');
  console.log('5️⃣  Validando rewrites...');
  if (config.rewrites) {
    for (const rewrite of config.rewrites) {
      if (rewrite.destination === '/index.html') {
        const indexPath = path.join(process.cwd(), 'index.html');
        const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
        if (!fs.existsSync(indexPath) && !fs.existsSync(distIndexPath)) {
          warnings.push('Rewrite a /index.html pero archivo no encontrado (se creará en build)');
          console.log('   ⚠️  index.html no existe (debe generarse en build)');
        } else {
          console.log('   ✅ Destino de rewrite existe');
        }
      }
    }
  } else {
    console.log('   ℹ️  No hay rewrites configurados');
  }

  // 6. Check build configuration
  console.log('');
  console.log('6️⃣  Validando build configuration...');
  if (config.build && config.build.env) {
    console.log('   ✅ Build env configurado');
  }
  
  // Check package.json for build script
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.scripts && pkg.scripts.build) {
      console.log(`   ✅ Build script: "${pkg.scripts.build}"`);
    } else {
      warnings.push('No hay script "build" en package.json');
      console.log('   ⚠️  No hay script build definido');
    }
  } catch (e) {
    errors.push('package.json no encontrado o inválido');
  }
}

// 7. Check for required files
console.log('');
console.log('7️⃣  Verificando archivos requeridos...');
const requiredFiles = ['package.json'];
const optionalFiles = ['index.html', 'api/index.js'];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    errors.push(`Archivo requerido no encontrado: ${file}`);
    console.log(`   ❌ ${file} (REQUERIDO)`);
  }
}

for (const file of optionalFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ℹ️  ${file} (opcional)`);
  }
}

// Summary
console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                      📊 RESUMEN                              ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`❌ Errores críticos: ${errors.length}`);
errors.forEach(e => console.log(`   • ${e}`));
console.log('');
console.log(`⚠️  Warnings: ${warnings.length}`);
warnings.forEach(w => console.log(`   • ${w}`));
console.log('');

if (errors.length > 0) {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🔴 DEPLOY FALLARÁ - Corrige los errores antes de continuar  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🟡 DEPLOY PUEDE FUNCIONAR - Revisa los warnings             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  process.exit(0);
} else {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🟢 CONFIGURACIÓN VÁLIDA - Listo para deploy en Vercel       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  process.exit(0);
}
