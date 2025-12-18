#!/usr/bin/env node
/**
 * Config Check Script - Valida la configuración del proyecto
 */

const fs = require('fs');

class ConfigCheck {
  constructor() {
    this.issues = [];
    this.warnings = [];
  }

  async run() {
    console.log('⚙️ Verificando configuración del proyecto...\n');

    await this.checkPackageJson();
    await this.checkGitignore();
    await this.checkEnvFiles();
    await this.checkDirectoryStructure();
    await this.checkScripts();

    this.printReport();

    if (this.issues.length > 0) {
      process.exit(1);
    }
  }

  async checkPackageJson() {
    console.log('📦 Verificando package.json...');
    try {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

      // Verificar campos requeridos
      const requiredFields = ['name', 'version', 'description', 'main', 'scripts'];
      for (const field of requiredFields) {
        if (!pkg[field]) {
          this.addIssue(`package.json: Campo "${field}" faltante`);
        }
      }

      // Verificar scripts
      const requiredScripts = ['start', 'test', 'lint', 'build', 'security'];
      for (const script of requiredScripts) {
        if (!pkg.scripts?.[script]) {
          this.addWarning(`package.json: Script "${script}" no definido`);
        }
      }

      // Verificar engines
      if (!pkg.engines || !pkg.engines.node) {
        this.addWarning('package.json: Campo "engines.node" no especificado');
      }

      console.log('  ✓ package.json válido\n');
    } catch (error) {
      this.addIssue(`package.json: ${error.message}`);
    }
  }

  async checkGitignore() {
    console.log('🙈 Verificando .gitignore...');
    try {
      if (!fs.existsSync('.gitignore')) {
        this.addWarning('.gitignore no encontrado');
        return;
      }

      const gitignore = fs.readFileSync('.gitignore', 'utf-8');
      const requiredEntries = [
        'node_modules',
        'dist',
        'coverage',
        '.env'
      ];

      for (const entry of requiredEntries) {
        if (!gitignore.includes(entry)) {
          this.addWarning(`.gitignore: "${entry}" no está presente`);
        }
      }

      console.log('  ✓ .gitignore válido\n');
    } catch (error) {
      this.addIssue(`.gitignore: ${error.message}`);
    }
  }

  async checkEnvFiles() {
    console.log('🔐 Verificando archivos de entorno...');
    
    if (fs.existsSync('.env.example')) {
      console.log('  ✓ .env.example encontrado');
    } else {
      this.addWarning('.env.example no encontrado');
    }

    if (fs.existsSync('.env')) {
      const gitignore = fs.existsSync('.gitignore') 
        ? fs.readFileSync('.gitignore', 'utf-8') 
        : '';
      
      if (!gitignore.includes('.env')) {
        this.addIssue('SEGURIDAD: .env existe pero no está en .gitignore');
      } else {
        console.log('  ✓ .env está protegido en .gitignore');
      }
    }

    console.log('');
  }

  async checkDirectoryStructure() {
    console.log('📁 Verificando estructura de directorios...');
    const requiredDirs = ['agents', 'modules', 'scripts', '.github/workflows'];

    for (const dir of requiredDirs) {
      if (fs.existsSync(dir)) {
        console.log(`  ✓ ${dir}`);
      } else {
        this.addWarning(`Directorio "${dir}" no encontrado`);
      }
    }

    console.log('');
  }

  async checkScripts() {
    console.log('📜 Verificando scripts...');
    const requiredScripts = [
      'scripts/health-check.js',
      'scripts/config-check.js'
    ];

    for (const script of requiredScripts) {
      if (fs.existsSync(script)) {
        // Verificar que sea ejecutable en Unix
        if (process.platform !== 'win32') {
          try {
            const stats = fs.statSync(script);
            const isExecutable = (stats.mode & 0o111) !== 0;
            if (isExecutable) {
              console.log(`  ✓ ${script} (ejecutable)`);
            } else {
              console.log(`  ✓ ${script}`);
              this.addWarning(`${script} no es ejecutable (chmod +x)`);
            }
          } catch (error) {
            console.log(`  ✓ ${script}`);
          }
        } else {
          console.log(`  ✓ ${script}`);
        }
      } else {
        this.addWarning(`Script "${script}" no encontrado`);
      }
    }

    console.log('');
  }

  addIssue(message) {
    this.issues.push(message);
    console.log(`  ❌ ${message}`);
  }

  addWarning(message) {
    this.warnings.push(message);
    console.log(`  ⚠️ ${message}`);
  }

  printReport() {
    console.log('='.repeat(60));
    console.log('📊 REPORTE DE CONFIGURACIÓN');
    console.log('='.repeat(60));
    console.log(`❌ Problemas críticos: ${this.issues.length}`);
    console.log(`⚠️ Advertencias: ${this.warnings.length}`);
    console.log('='.repeat(60) + '\n');

    if (this.issues.length > 0) {
      console.log('❌ PROBLEMAS CRÍTICOS:');
      this.issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️ ADVERTENCIAS:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log('');
    }

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ ¡Configuración perfecta! No se encontraron problemas.\n');
    } else if (this.issues.length === 0) {
      console.log('✅ Configuración válida (con algunas advertencias)\n');
    } else {
      console.log('❌ Configuración inválida. Corrige los problemas críticos.\n');
    }
  }
}

// Ejecutar config check
const configCheck = new ConfigCheck();
configCheck.run().catch(error => {
  console.error('❌ Error durante config check:', error);
  process.exit(1);
});
