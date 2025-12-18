#!/usr/bin/env node

/**
 * Configuration Check Script
 * Validates environment and configuration
 */

const fs = require('fs');
const path = require('path');

class ConfigCheck {
  constructor() {
    this.warnings = [];
    this.errors = [];
  }

  /**
   * Run configuration checks
   */
  async run() {
    console.log('🔍 Checking configuration...\n');

    // Check .env file
    this.checkEnvFile();

    // Check package.json
    this.checkPackageJson();

    // Check required environment variables
    this.checkEnvironmentVariables();

    // Display results
    this.displayResults();

    if (this.errors.length > 0) {
      console.log('\n❌ Configuration check failed');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      console.log('\n⚠️  Configuration check passed with warnings');
      process.exit(0);
    } else {
      console.log('\n✅ Configuration check passed');
      process.exit(0);
    }
  }

  /**
   * Check .env file
   */
  checkEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    if (!fs.existsSync(envPath)) {
      this.warnings.push({
        type: 'ENV_FILE',
        message: '.env file not found (using defaults)',
        fix: 'Run: cp .env.example .env'
      });
    } else {
      console.log('✅ .env file found');
    }

    if (!fs.existsSync(envExamplePath)) {
      this.errors.push({
        type: 'ENV_EXAMPLE',
        message: '.env.example file missing'
      });
    } else {
      console.log('✅ .env.example file found');
    }
  }

  /**
   * Check package.json
   */
  checkPackageJson() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      this.errors.push({
        type: 'PACKAGE_JSON',
        message: 'package.json not found'
      });
      return;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      console.log('✅ package.json is valid');
      console.log(`   Name: ${packageJson.name}`);
      console.log(`   Version: ${packageJson.version}`);

      // Check required scripts
      const requiredScripts = ['start', 'test', 'lint', 'build'];
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);

      if (missingScripts.length > 0) {
        this.warnings.push({
          type: 'MISSING_SCRIPTS',
          message: `Missing scripts: ${missingScripts.join(', ')}`
        });
      }
    } catch (error) {
      this.errors.push({
        type: 'PACKAGE_JSON',
        message: `Invalid package.json: ${error.message}`
      });
    }
  }

  /**
   * Check environment variables
   */
  checkEnvironmentVariables() {
    const optionalVars = ['NODE_ENV', 'PORT', 'LOG_LEVEL', 'TREESIT_API_KEY', 'TREESIT_API_SECRET'];

    const missing = optionalVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      this.warnings.push({
        type: 'ENV_VARS',
        message: `Optional environment variables not set: ${missing.join(', ')}`,
        fix: 'Set in .env file or environment'
      });
    } else {
      console.log('✅ All environment variables are set');
    }
  }

  /**
   * Display results
   */
  displayResults() {
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => {
        console.log(`   • ${error.message}`);
        if (error.fix) {
          console.log(`     Fix: ${error.fix}`);
        }
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`   • ${warning.message}`);
        if (warning.fix) {
          console.log(`     Fix: ${warning.fix}`);
        }
      });
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const configCheck = new ConfigCheck();
  configCheck.run();
}

module.exports = ConfigCheck;
