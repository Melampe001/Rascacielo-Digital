/**
 * Config Check Script - Rascacielos Digital
 *
 * Verifica la configuración del sistema
 */

const fs = require('fs');
const path = require('path');

class ConfigChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checks = [];
  }

  /**
   * Ejecuta todas las verificaciones
   */
  async run() {
    console.log('=== Verificación de Configuración ===\n');

    // Verificar archivos de configuración
    await this.checkConfigFiles();

    // Verificar variables de entorno
    await this.checkEnvironmentVariables();

    // Verificar dependencias
    await this.checkDependencies();

    // Verificar estructura de directorios
    await this.checkDirectoryStructure();

    // Mostrar resultados
    this.showResults();

    return {
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      checks: this.checks
    };
  }

  /**
   * Verifica archivos de configuración
   */
  async checkConfigFiles() {
    console.log('Verificando archivos de configuración...');

    const configFiles = [
      { file: 'package.json', required: true },
      { file: 'config/default.json', required: true },
      { file: '.env', required: false },
      { file: '.env.example', required: true }
    ];

    for (const config of configFiles) {
      const filePath = path.join(process.cwd(), config.file);
      const exists = fs.existsSync(filePath);

      if (exists) {
        this.checks.push({ name: `Archivo ${config.file}`, status: 'passed' });

        // Validar JSON si es archivo JSON
        if (config.file.endsWith('.json')) {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            JSON.parse(content);
          } catch (_error) {
            this.errors.push(`Archivo ${config.file} tiene JSON inválido`);
          }
        }
      } else if (config.required) {
        this.errors.push(`Archivo requerido no encontrado: ${config.file}`);
        this.checks.push({ name: `Archivo ${config.file}`, status: 'failed' });
      } else {
        this.warnings.push(`Archivo opcional no encontrado: ${config.file}`);
        this.checks.push({ name: `Archivo ${config.file}`, status: 'warning' });
      }
    }

    console.log('  ✓ Verificación de archivos completada\n');
  }

  /**
   * Verifica variables de entorno
   */
  async checkEnvironmentVariables() {
    console.log('Verificando variables de entorno...');

    const requiredEnvVars = ['NODE_ENV'];
    const optionalEnvVars = ['PORT', 'LOG_LEVEL', 'BUILD_OPTIMIZE'];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.checks.push({ name: `Variable ${envVar}`, status: 'passed' });
      } else {
        this.warnings.push(`Variable de entorno no definida: ${envVar}`);
        this.checks.push({ name: `Variable ${envVar}`, status: 'warning' });
      }
    }

    for (const envVar of optionalEnvVars) {
      if (process.env[envVar]) {
        this.checks.push({ name: `Variable ${envVar}`, status: 'passed' });
      }
    }

    console.log('  ✓ Verificación de variables de entorno completada\n');
  }

  /**
   * Verifica dependencias
   */
  async checkDependencies() {
    console.log('Verificando dependencias...');

    const packagePath = path.join(process.cwd(), 'package.json');

    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Verificar que node_modules existe
      const nodeModulesPath = path.join(process.cwd(), 'node_modules');
      if (!fs.existsSync(nodeModulesPath)) {
        this.errors.push('Directorio node_modules no encontrado. Ejecuta npm install');
        this.checks.push({ name: 'node_modules', status: 'failed' });
      } else {
        this.checks.push({ name: 'node_modules', status: 'passed' });

        // Verificar algunas dependencias críticas
        for (const dep of Object.keys(deps)) {
          const depPath = path.join(nodeModulesPath, dep);
          if (!fs.existsSync(depPath)) {
            this.warnings.push(`Dependencia no instalada: ${dep}`);
          }
        }
      }

      // Verificar versión de Node.js
      const nodeVersion = process.version;
      const requiredVersion = packageJson.engines?.node || '>=16.0.0';
      this.checks.push({
        name: `Node.js ${nodeVersion}`,
        status: 'passed',
        details: `Requerido: ${requiredVersion}`
      });

    } catch (_error) {
      this.errors.push('Error al leer package.json');
    }

    console.log('  ✓ Verificación de dependencias completada\n');
  }

  /**
   * Verifica estructura de directorios
   */
  async checkDirectoryStructure() {
    console.log('Verificando estructura de directorios...');

    const requiredDirs = [
      'agents',
      'modules',
      'config',
      'docs'
    ];

    const optionalDirs = [
      'scripts',
      '__tests__'
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        this.checks.push({ name: `Directorio ${dir}`, status: 'passed' });
      } else {
        this.errors.push(`Directorio requerido no encontrado: ${dir}`);
        this.checks.push({ name: `Directorio ${dir}`, status: 'failed' });
      }
    }

    for (const dir of optionalDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        this.checks.push({ name: `Directorio ${dir}`, status: 'passed' });
      } else {
        this.warnings.push(`Directorio opcional no encontrado: ${dir}`);
      }
    }

    console.log('  ✓ Verificación de estructura completada\n');
  }

  /**
   * Muestra los resultados de las verificaciones
   */
  showResults() {
    console.log('=== Resultados ===\n');

    if (this.errors.length > 0) {
      console.log('❌ Errores:');
      this.errors.forEach(err => console.log(`   - ${err}`));
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Advertencias:');
      this.warnings.forEach(warn => console.log(`   - ${warn}`));
      console.log();
    }

    const passed = this.checks.filter(c => c.status === 'passed').length;
    const failed = this.checks.filter(c => c.status === 'failed').length;
    const warning = this.checks.filter(c => c.status === 'warning').length;

    console.log(`Verificaciones: ${passed} pasadas, ${failed} fallidas, ${warning} advertencias`);

    if (this.errors.length === 0) {
      console.log('\n✅ Configuración válida');
    } else {
      console.log('\n❌ Configuración con errores');
      process.exitCode = 1;
    }
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  const checker = new ConfigChecker();
  checker.run()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error durante la verificación:', error);
      process.exit(1);
    });
}

module.exports = ConfigChecker;
