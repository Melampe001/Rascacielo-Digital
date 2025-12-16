/**
 * Configuration Check Script
 * Verifica que la configuración del proyecto esté correcta
 */

const fs = require('fs');
const path = require('path');

class ConfigChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  check() {
    console.log('🔍 Verificando configuración del proyecto...\n');

    this.checkEnvFile();
    this.checkPackageJson();
    this.checkNodeModules();
    this.checkDirectories();

    this.printResults();

    if (this.errors.length > 0) {
      process.exit(1);
    }
  }

  checkEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');

    if (!fs.existsSync(envPath)) {
      this.errors.push('.env file not found. Run: cp .env.example .env');
    } else {
      console.log('✅ .env file exists');
    }

    if (!fs.existsSync(envExamplePath)) {
      this.warnings.push('.env.example file not found');
    }
  }

  checkPackageJson() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      this.errors.push('package.json not found');
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log('✅ package.json is valid');

      // Check required fields
      const requiredFields = ['name', 'version', 'main', 'scripts'];
      requiredFields.forEach(field => {
        if (!packageJson[field]) {
          this.warnings.push(`package.json is missing ${field} field`);
        }
      });

      // Check required scripts
      const requiredScripts = ['start', 'test'];
      requiredScripts.forEach(script => {
        if (!packageJson.scripts || !packageJson.scripts[script]) {
          this.warnings.push(`package.json is missing '${script}' script`);
        }
      });
    } catch (error) {
      this.errors.push(`Invalid package.json: ${error.message}`);
    }
  }

  checkNodeModules() {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      this.errors.push('node_modules not found. Run: npm install');
    } else {
      console.log('✅ node_modules exists');
    }
  }

  checkDirectories() {
    const requiredDirs = ['agents', 'modules', 'config'];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        this.errors.push(`Required directory '${dir}' not found`);
      } else {
        console.log(`✅ ${dir}/ directory exists`);
      }
    });
  }

  printResults() {
    console.log('\n' + '='.repeat(50));

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
      console.log('\n❌ Configuration check FAILED\n');
    } else {
      console.log('\n✅ Configuration check PASSED\n');
    }
  }
}

// Run the check
const checker = new ConfigChecker();
checker.check();
