#!/usr/bin/env node

/**
 * Update Dependencies Script
 * Safely updates project dependencies to their latest compatible versions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyUpdater {
  constructor() {
    this.updates = [
      // Production dependencies - patch and minor updates only
      'dotenv@^16.4.7',
      'winston@^3.17.0',
      'axios@^1.7.9',
      'jsonwebtoken@^9.0.2',
      'bcryptjs@^2.4.3',
      'bull@^4.16.3',
      'redis@^4.7.0',
      'chalk@^4.1.2',
      'commander@^11.1.0',
      'inquirer@^8.2.6',
      'ora@^5.4.1',
      'fs-extra@^11.2.0',
      'glob@^10.4.5',
      'yaml@^2.6.1',

      // Development dependencies - patch and minor updates only
      'eslint@^8.57.1',
      'prettier@^3.3.3',
      'jest@^29.7.0',
      'nodemon@^3.1.7',
      'husky@^8.0.3',
      '@commitlint/cli@^17.8.1',
      '@commitlint/config-conventional@^17.8.1'
    ];
  }

  /**
   * Execute a command and return output
   */
  exec(command, options = {}) {
    try {
      return execSync(command, {
        stdio: options.silent ? 'pipe' : 'inherit',
        encoding: 'utf-8',
        ...options
      });
    } catch (error) {
      if (options.throwOnError !== false) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Check if npm is available
   */
  checkNpm() {
    console.log('🔍 Verificando npm...');
    const version = this.exec('npm --version', { silent: true });
    console.log(`✅ npm version: ${version.trim()}`);
  }

  /**
   * Backup current package.json and package-lock.json
   */
  backup() {
    console.log('\n📦 Creando backup de package.json...');
    const packagePath = path.join(__dirname, '..', 'package.json');
    const backupPath = path.join(__dirname, '..', 'package.json.backup');

    fs.copyFileSync(packagePath, backupPath);
    console.log('✅ Backup creado: package.json.backup');

    const lockPath = path.join(__dirname, '..', 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      const lockBackupPath = path.join(__dirname, '..', 'package-lock.json.backup');
      fs.copyFileSync(lockPath, lockBackupPath);
      console.log('✅ Backup creado: package-lock.json.backup');
    }
  }

  /**
   * Restore from backup
   */
  restore() {
    console.log('\n⚠️  Restaurando desde backup...');
    const packagePath = path.join(__dirname, '..', 'package.json');
    const backupPath = path.join(__dirname, '..', 'package.json.backup');

    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, packagePath);
      console.log('✅ package.json restaurado');
    }

    const lockPath = path.join(__dirname, '..', 'package-lock.json');
    const lockBackupPath = path.join(__dirname, '..', 'package-lock.json.backup');
    if (fs.existsSync(lockBackupPath)) {
      fs.copyFileSync(lockBackupPath, lockPath);
      console.log('✅ package-lock.json restaurado');
    }
  }

  /**
   * Clean backup files
   */
  cleanBackup() {
    const backupPath = path.join(__dirname, '..', 'package.json.backup');
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }

    const lockBackupPath = path.join(__dirname, '..', 'package-lock.json.backup');
    if (fs.existsSync(lockBackupPath)) {
      fs.unlinkSync(lockBackupPath);
    }
  }

  /**
   * Update dependencies
   */
  updateDependencies() {
    console.log('\n🔄 Actualizando dependencias...\n');

    // Install all packages at once for efficiency
    const allPackages = this.updates.join(' ');
    console.log(`📦 Instalando ${this.updates.length} paquetes...`);

    try {
      this.exec(`npm install ${allPackages}`, { silent: false });
      console.log(`\n✅ Todas las dependencias actualizadas exitosamente`);
    } catch (error) {
      console.error(`❌ Error actualizando dependencias: ${error.message}`);
      throw new Error('La actualización de dependencias falló');
    }
  }

  /**
   * Run security audit
   */
  runAudit() {
    console.log('\n🔒 Ejecutando auditoría de seguridad...');
    const result = this.exec('npm audit --audit-level=moderate', {
      throwOnError: false,
      silent: true
    });

    if (result) {
      console.log(result);
    } else {
      console.warn('⚠️  Se encontraron vulnerabilidades - revisar con: npm audit');
    }
  }

  /**
   * Run tests
   */
  runTests() {
    console.log('\n🧪 Ejecutando tests...');
    try {
      this.exec('npm test');
      console.log('✅ Todos los tests pasaron');
    } catch (error) {
      throw new Error('Los tests fallaron después de la actualización');
    }
  }

  /**
   * Main update process
   */
  async run() {
    console.log('🚀 Iniciando actualización de dependencias...\n');
    console.log('📋 Estrategia: Actualización Conservadora (patch & minor)');
    console.log('🎯 Total de paquetes a actualizar:', this.updates.length);

    try {
      // Pre-checks
      this.checkNpm();

      // Backup
      this.backup();

      // Update
      this.updateDependencies();

      // Audit
      this.runAudit();

      // Test
      this.runTests();

      // Clean backup
      this.cleanBackup();

      console.log('\n✅ ¡Actualización completada exitosamente!');
      console.log('📝 No olvides actualizar CHANGELOG.md con los cambios');
    } catch (error) {
      console.error('\n❌ Error durante la actualización:', error.message);
      console.log('⚠️  Restaurando estado anterior...');

      try {
        this.restore();
        console.log('✅ Estado restaurado');
      } catch (restoreError) {
        console.error('❌ Error al restaurar:', restoreError.message);
      }

      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const updater = new DependencyUpdater();
  updater.run().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = DependencyUpdater;
