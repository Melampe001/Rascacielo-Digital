#!/usr/bin/env node

/**
 * Health Check Script
 * Validates system health and dependencies
 */

const fs = require('fs');
const path = require('path');

class HealthCheck {
  constructor() {
    this.checks = [];
  }

  /**
   * Run all health checks
   */
  async run() {
    console.log('🏥 Running health checks...\n');

    let passed = 0;
    let failed = 0;

    // Check Node.js version
    await this.checkNodeVersion();

    // Check required files
    await this.checkRequiredFiles();

    // Check configuration
    await this.checkConfiguration();

    // Check modules
    await this.checkModules();

    // Summary
    this.checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}: ${check.message}`);
      
      if (check.passed) {
        passed++;
      } else {
        failed++;
      }
    });

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

    if (failed > 0) {
      console.log('❌ Health check failed');
      process.exit(1);
    } else {
      console.log('✅ All health checks passed');
      process.exit(0);
    }
  }

  /**
   * Check Node.js version
   */
  async checkNodeVersion() {
    const currentVersion = process.version;
    const requiredVersion = '18.0.0';
    const [major] = currentVersion.slice(1).split('.').map(Number);

    const passed = major >= 18;
    this.checks.push({
      name: 'Node.js Version',
      passed,
      message: passed ? `${currentVersion} (OK)` : `${currentVersion} (Required: >= ${requiredVersion})`
    });
  }

  /**
   * Check required files
   */
  async checkRequiredFiles() {
    const requiredFiles = [
      'package.json',
      'index.js',
      'agents/build-agent.js',
      'agents/security-agent.js',
      'agents/deploy-agent.js',
      'modules/core.js'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, '..', file);
      const exists = fs.existsSync(filePath);
      
      this.checks.push({
        name: `File: ${file}`,
        passed: exists,
        message: exists ? 'Found' : 'Missing'
      });
    }
  }

  /**
   * Check configuration
   */
  async checkConfiguration() {
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    const exists = fs.existsSync(envExamplePath);

    this.checks.push({
      name: 'Configuration',
      passed: exists,
      message: exists ? '.env.example found' : '.env.example missing'
    });
  }

  /**
   * Check modules can be loaded
   */
  async checkModules() {
    const modules = [
      '../modules/core',
      '../modules/api',
      '../modules/auth',
      '../modules/queue'
    ];

    for (const mod of modules) {
      try {
        require(mod);
        this.checks.push({
          name: `Module: ${mod}`,
          passed: true,
          message: 'Loaded successfully'
        });
      } catch (error) {
        this.checks.push({
          name: `Module: ${mod}`,
          passed: false,
          message: error.message
        });
      }
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const healthCheck = new HealthCheck();
  healthCheck.run();
}

module.exports = HealthCheck;
