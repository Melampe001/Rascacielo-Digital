/**
 * Build Script - Ejecutable para Rascacielos Digital
 * 
 * Uso: node build.js
 * Uso: npm run build
 */

const BuildAgent = require('./agents/build-agent');
const fs = require('fs');
const path = require('path');

async function runBuild() {
  console.log('🔨 RASCACIELOS DIGITAL - BUILD PROCESS');
  console.log('=====================================\n');

  try {
    // Leer package.json una sola vez
    let originalPkg;
    try {
      originalPkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    } catch (error) {
      console.warn(`⚠️  No se pudo leer package.json: ${error.message}`);
      originalPkg = { version: '1.0.0' };
    }

    // Configurar build agent
    const agent = new BuildAgent({
      outputDir: './dist',
      optimize: true,
      verbose: true
    });

    // Crear directorio dist
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
      console.log('📁 Directorio dist/ creado\n');
    } else {
      console.log('🧹 Limpiando directorio dist/ existente...\n');
      try {
        fs.rmSync('./dist', { recursive: true, force: true });
      } catch (error) {
        console.warn(`   ⚠️  Error al limpiar dist/: ${error.message}`);
      }
      fs.mkdirSync('./dist', { recursive: true });
    }

    // Ejecutar build
    console.log('⏳ Iniciando proceso de build...\n');
    const startTime = Date.now();
    const result = await agent.build({
      source: './'
    });

    // Copiar archivos principales
    console.log('\n📋 Copiando archivos del proyecto...\n');
    
    const filesToCopy = [
      'index.js',
      'package.json',
      'README.md',
      'LICENSE',
      '.env.example'
    ];

    let copiedFiles = 0;
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('./dist', file));
        console.log(`   ✓ ${file}`);
        copiedFiles++;
      }
    });

    // Copiar directorios
    console.log('\n📦 Copiando directorios...\n');
    
    const dirsToCopy = [
      'agents',
      'modules',
      'config',
      'scripts',
      'docs'
    ];

    let copiedDirs = 0;
    dirsToCopy.forEach(dir => {
      if (fs.existsSync(dir)) {
        copyRecursive(dir, path.join('./dist', dir));
        const fileCount = countFiles(path.join('./dist', dir));
        console.log(`   ✓ ${dir}/ (${fileCount} archivos)`);
        copiedDirs++;
      }
    });

    // Crear build manifest
    console.log('\n📄 Generando build manifest...\n');
    
    const manifest = {
      buildDate: new Date().toISOString(),
      version: originalPkg.version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      buildDuration: Date.now() - startTime,
      artifacts: {
        files: copiedFiles,
        directories: copiedDirs,
        total: copiedFiles + copiedDirs
      },
      projectType: result.projectType,
      agentArtifacts: result.artifacts
    };

    fs.writeFileSync(
      './dist/build-manifest.json',
      JSON.stringify(manifest, null, 2)
    );
    console.log('   ✓ build-manifest.json creado');

    // Crear package.json optimizado para producción
    const productionPkg = {
      name: originalPkg.name,
      version: originalPkg.version,
      description: originalPkg.description,
      main: originalPkg.main,
      scripts: {
        start: 'node index.js'
      },
      author: originalPkg.author,
      license: originalPkg.license,
      engines: originalPkg.engines,
      dependencies: originalPkg.dependencies || {}
    };

    fs.writeFileSync(
      './dist/package.json',
      JSON.stringify(productionPkg, null, 2)
    );
    console.log('   ✓ package.json optimizado');

    // Resumen final
    const totalDuration = Date.now() - startTime;
    
    console.log('\n=====================================');
    console.log('✨ BUILD COMPLETADO EXITOSAMENTE');
    console.log('=====================================\n');
    console.log('📊 Estadísticas:');
    console.log(`   - Duración total: ${totalDuration}ms (${(totalDuration/1000).toFixed(2)}s)`);
    console.log(`   - Archivos copiados: ${copiedFiles}`);
    console.log(`   - Directorios copiados: ${copiedDirs}`);
    console.log(`   - Tipo de proyecto: ${result.projectType}`);
    console.log(`   - Versión: ${manifest.version}`);
    console.log(`   - Node.js: ${process.version}`);
    console.log(`\n📁 Salida: ${path.resolve('./dist')}`);
    console.log(`📄 Manifest: ${path.resolve('./dist/build-manifest.json')}\n`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR EN BUILD:');
    console.error(`   ${error.message}\n`);
    console.error('Stack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Copia archivos/directorios recursivamente con filtros
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Ignorar directorios especiales
        const ignoreDirs = [
          'node_modules',
          '.git',
          'dist',
          'coverage',
          '__tests__',
          '.github'
        ];
        
        if (ignoreDirs.includes(entry.name)) {
          continue;
        }
        
        copyRecursive(srcPath, destPath);
      } else {
        // Ignorar archivos de test
        if (/\.(test|spec)\.js$/.test(entry.name)) {
          continue;
        }
        
        // Copiar archivo
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } else {
    // Copiar archivo individual
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

/**
 * Cuenta archivos en un directorio recursivamente
 */
function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  
  return count;
}

// Ejecutar build
runBuild();
