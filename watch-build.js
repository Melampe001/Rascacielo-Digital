/**
 * File Watcher para Build Automático
 * 
 * Monitorea cambios en archivos y ejecuta build automáticamente
 */

const IdempotentBuild = require('./build-idempotent');

class BuildWatcher {
  constructor(options = {}) {
    this.builder = new IdempotentBuild();
    this.debounceTime = options.debounceTime || 1000;
    this.buildTimeout = null;
    this.isBuilding = false;
    this.buildQueue = [];
    this.chokidar = null;
  }

  async start() {
    // Load chokidar dynamically to allow the script to run without it installed
    try {
      this.chokidar = require('chokidar');
    } catch (error) {
      console.error('❌ Error: chokidar no está instalado.');
      console.error('   Instala con: npm install --save-dev chokidar');
      process.exit(1);
    }

    console.log('👀 BUILD WATCHER INICIADO');
    console.log('==========================\n');
    console.log('📁 Monitoreando cambios en:');
    console.log('   - agents/');
    console.log('   - modules/');
    console.log('   - config/');
    console.log('   - scripts/');
    console.log('   - index.js');
    console.log('   - package.json\n');
    console.log('💡 Presiona Ctrl+C para detener\n');

    const watcher = this.chokidar.watch([
      'agents/**/*.js',
      'modules/**/*.js',
      'config/**/*.json',
      'scripts/**/*.js',
      'index.js',
      'package.json'
    ], {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.test.js',
        '**/*.spec.js'
      ],
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', path => this.handleChange('added', path))
      .on('change', path => this.handleChange('changed', path))
      .on('unlink', path => this.handleChange('removed', path));
  }

  handleChange(event, filepath) {
    console.log(`📝 [${new Date().toLocaleTimeString()}] ${event}: ${filepath}`);
    
    clearTimeout(this.buildTimeout);
    
    this.buildTimeout = setTimeout(() => {
      this.triggerBuild();
    }, this.debounceTime);
  }

  async triggerBuild() {
    if (this.isBuilding) {
      console.log('⏳ Build en progreso, encolando...');
      this.buildQueue.push(Date.now());
      return;
    }

    this.isBuilding = true;
    console.log('\n🔨 Ejecutando build automático...\n');

    try {
      await this.builder.run({ force: false });
      console.log('\n✅ Build automático completado\n');
    } catch (error) {
      console.error('\n❌ Error en build automático:', error.message, '\n');
    } finally {
      this.isBuilding = false;
      
      if (this.buildQueue.length > 0) {
        this.buildQueue = [];
        setTimeout(() => this.triggerBuild(), 500);
      }
    }
  }
}

if (require.main === module) {
  const watcher = new BuildWatcher();
  watcher.start();
}

module.exports = BuildWatcher;
