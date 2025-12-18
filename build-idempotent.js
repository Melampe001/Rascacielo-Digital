/**
 * Build System Idempotente con Automatización
 * 
 * Características:
 * - Checksums SHA256 para detección de cambios
 * - Skip builds innecesarios
 * - Limpieza completa antes de build
 * - Copia determinística con timestamps preservados
 * - Manifest con metadata completa
 * - Soporte para force rebuild
 */

const BuildAgent = require('./agents/build-agent');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class IdempotentBuild {
  constructor(options = {}) {
    this.distDir = options.distDir || './dist';
    this.checksumFile = path.join(this.distDir, '.build-checksum');
    this.manifestFile = path.join(this.distDir, 'build-manifest.json');
    this.cacheDir = './.build-cache';
    this.verbose = options.verbose || false;
  }

  /**
   * Calcula checksum del proyecto completo
   */
  calculateProjectChecksum() {
    const hash = crypto.createHash('sha256');
    
    const filesToHash = [
      'package.json',
      'index.js',
      ...this.getSourceFiles('agents'),
      ...this.getSourceFiles('modules'),
      ...this.getSourceFiles('config'),
      ...this.getSourceFiles('scripts')
    ];

    filesToHash.sort();

    filesToHash.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file);
        hash.update(file);
        hash.update(content);
      }
    });

    return hash.digest('hex');
  }

  /**
   * Obtiene archivos fuente recursivamente
   */
  getSourceFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getSourceFiles(fullPath));
      } else if (entry.name.endsWith('.js') && !entry.name.includes('.test.')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Verifica si necesita rebuild
   */
  needsRebuild(currentChecksum) {
    if (!fs.existsSync(this.checksumFile)) {
      this.log('info', 'No existe build previo, se requiere build inicial');
      return true;
    }

    if (!fs.existsSync(this.manifestFile)) {
      this.log('warn', 'Manifest no encontrado, se requiere rebuild');
      return true;
    }

    try {
      const previousChecksum = fs.readFileSync(this.checksumFile, 'utf-8').trim();
      
      if (previousChecksum === currentChecksum) {
        this.log('success', 'Checksums coinciden - Build NO necesario');
        this.log('info', `Checksum: ${currentChecksum.substring(0, 16)}...`);
        return false;
      } else {
        this.log('warn', 'Checksums diferentes - Rebuild necesario');
        this.log('info', `Anterior: ${previousChecksum.substring(0, 16)}...`);
        this.log('info', `Actual: ${currentChecksum.substring(0, 16)}...`);
        return true;
      }
    } catch (error) {
      this.log('warn', 'Error leyendo checksum previo, se requiere rebuild');
      return true;
    }
  }

  /**
   * Limpieza idempotente
   */
  cleanDist() {
    this.log('info', 'Limpiando directorio de salida...');
    
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
      this.log('success', `Directorio ${this.distDir}/ eliminado`);
    }

    fs.mkdirSync(this.distDir, { recursive: true });
    this.log('success', `Directorio ${this.distDir}/ creado limpio`);
  }

  /**
   * Copia archivos principales
   */
  copyFiles() {
    this.log('info', 'Copiando archivos del proyecto...');

    const filesToCopy = [
      'index.js',
      'package.json',
      'README.md',
      'LICENSE',
      '.env.example'
    ].sort();

    let copied = 0;
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        const destPath = path.join(this.distDir, file);
        fs.copyFileSync(file, destPath);
        
        const stats = fs.statSync(file);
        fs.utimesSync(destPath, stats.atime, stats.mtime);
        
        this.log('success', `✓ ${file}`);
        copied++;
      }
    });

    this.log('info', `Total: ${copied} archivos copiados`);
    return copied;
  }

  /**
   * Copia directorios
   */
  copyDirectories() {
    this.log('info', 'Copiando directorios...');

    const dirsToCopy = ['agents', 'modules', 'config', 'scripts', 'docs'].sort();

    let copied = 0;
    dirsToCopy.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.copyRecursiveIdempotent(dir, path.join(this.distDir, dir));
        const fileCount = this.countFiles(path.join(this.distDir, dir));
        this.log('success', `✓ ${dir}/ (${fileCount} archivos)`);
        copied++;
      }
    });

    this.log('info', `Total: ${copied} directorios copiados`);
    return copied;
  }

  /**
   * Copia recursiva idempotente
   */
  copyRecursiveIdempotent(src, dest) {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const entries = fs.readdirSync(src, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          const ignoreDirs = ['node_modules', '.git', 'dist', 'coverage', '__tests__', '.github'];
          if (ignoreDirs.includes(entry.name)) continue;
          
          this.copyRecursiveIdempotent(srcPath, destPath);
        } else {
          if (/\.(test|spec)\.js$/.test(entry.name)) continue;
          
          fs.copyFileSync(srcPath, destPath);
          const fileStats = fs.statSync(srcPath);
          fs.utimesSync(destPath, fileStats.atime, fileStats.mtime);
        }
      }
    }
  }

  /**
   * Genera manifest
   */
  generateManifest(checksum, buildStats) {
    this.log('info', 'Generando build manifest...');

    const manifest = {
      buildChecksum: checksum,
      version: this.getVersion(),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      buildDate: new Date().toISOString(),
      artifacts: {
        files: buildStats.files,
        directories: buildStats.directories,
        total: buildStats.files + buildStats.directories
      },
      idempotent: true,
      reproducible: true
    };

    fs.writeFileSync(this.manifestFile, JSON.stringify(manifest, null, 2));
    this.log('success', 'build-manifest.json creado');
    
    return manifest;
  }

  /**
   * Guarda checksum
   */
  saveChecksum(checksum) {
    fs.writeFileSync(this.checksumFile, checksum);
    this.log('success', '.build-checksum guardado');
  }

  /**
   * Genera package.json optimizado
   */
  generateProductionPackage() {
    const originalPkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    
    const productionPkg = {
      name: originalPkg.name,
      version: originalPkg.version,
      description: originalPkg.description,
      main: originalPkg.main,
      author: originalPkg.author,
      license: originalPkg.license,
      engines: originalPkg.engines,
      dependencies: originalPkg.dependencies || {},
      scripts: {
        start: 'node index.js'
      }
    };

    fs.writeFileSync(
      path.join(this.distDir, 'package.json'),
      JSON.stringify(productionPkg, null, 2)
    );
    
    this.log('success', 'package.json optimizado');
  }

  countFiles(dir) {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        count += this.countFiles(fullPath);
      } else {
        count++;
      }
    }
    return count;
  }

  getVersion() {
    try {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
      return pkg.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  log(level, message) {
    const prefix = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    }[level] || 'ℹ️';

    console.log(`${prefix} ${message}`);
  }

  /**
   * Ejecuta build idempotente
   */
  async run(options = {}) {
    const forceRebuild = options.force || false;
    
    console.log('🔨 RASCACIELOS DIGITAL - BUILD IDEMPOTENTE');
    console.log('==========================================\n');

    try {
      const startTime = Date.now();

      // Calcular checksum
      this.log('info', 'Calculando checksum del proyecto...');
      const currentChecksum = this.calculateProjectChecksum();
      this.log('info', `Checksum: ${currentChecksum}\n`);

      // Verificar si necesita rebuild
      if (!forceRebuild && !this.needsRebuild(currentChecksum)) {
        console.log('\n==========================================');
        console.log('✅ BUILD SKIPPED - Proyecto sin cambios');
        console.log('==========================================\n');
        console.log('💡 Usa --force para forzar rebuild\n');
        
        if (fs.existsSync(this.manifestFile)) {
          const manifest = JSON.parse(fs.readFileSync(this.manifestFile, 'utf-8'));
          console.log('📊 Build anterior:');
          console.log(`   - Versión: ${manifest.version}`);
          console.log(`   - Archivos: ${manifest.artifacts.files}`);
          console.log(`   - Directorios: ${manifest.artifacts.directories}\n`);
        }
        
        return { skipped: true, checksum: currentChecksum };
      }

      // Limpieza
      this.cleanDist();

      // Build Agent
      this.log('info', 'Ejecutando Build Agent...');
      const agent = new BuildAgent({
        outputDir: this.distDir,
        optimize: true,
        verbose: false
      });

      const agentResult = await agent.build({ source: './' });
      this.log('success', `Build Agent completado (${agentResult.duration}ms)\n`);

      // Copiar archivos y directorios
      const filesCopied = this.copyFiles();
      const dirsCopied = this.copyDirectories();

      // Generar manifest y package.json
      const manifest = this.generateManifest(currentChecksum, {
        files: filesCopied,
        directories: dirsCopied
      });

      this.generateProductionPackage();
      this.saveChecksum(currentChecksum);

      // Resumen
      const totalDuration = Date.now() - startTime;
      
      console.log('\n==========================================');
      console.log('✨ BUILD COMPLETADO EXITOSAMENTE');
      console.log('==========================================\n');
      console.log('📊 Estadísticas:');
      console.log(`   - Duración: ${totalDuration}ms (${(totalDuration/1000).toFixed(2)}s)`);
      console.log(`   - Archivos: ${filesCopied}`);
      console.log(`   - Directorios: ${dirsCopied}`);
      console.log(`   - Checksum: ${currentChecksum.substring(0, 16)}...`);
      console.log(`   - Versión: ${manifest.version}`);
      console.log('   - Idempotente: ✅');
      console.log(`\n📁 Salida: ${path.resolve(this.distDir)}\n`);

      return {
        success: true,
        checksum: currentChecksum,
        duration: totalDuration,
        manifest
      };

    } catch (error) {
      console.error('\n❌ ERROR EN BUILD:');
      console.error(`   ${error.message}\n`);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  
  const builder = new IdempotentBuild();
  await builder.run({ force });
}

if (require.main === module) {
  main();
}

module.exports = IdempotentBuild;
