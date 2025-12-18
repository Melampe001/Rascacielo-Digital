#!/usr/bin/env node
/**
 * Health Check Script - Verifica el estado del sistema
 */

const fs = require('fs');
const path = require('path');

class HealthCheck {
  constructor() {
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
  }

  async run() {
    console.log('🏥 Iniciando verificación de salud del sistema...\n');

    await this.checkNodeVersion();
    await this.checkPackageJson();
    await this.checkDependencies();
    await this.checkAgents();
    await this.checkModules();
    await this.checkConfiguration();

    this.printSummary();
    
    if (this.failed > 0) {
      process.exit(1);
    }
  }

  async checkNodeVersion() {
    const check = 'Node.js Version';
    try {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      if (major >= 18) {
        this.pass(check, `✓ ${version}`);
      } else {
        this.fail(check, `✗ ${version} (se requiere v18+)`);
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  async checkPackageJson() {
    const check = 'package.json';
    try {
      if (fs.existsSync('./package.json')) {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
        this.pass(check, `✓ v${pkg.version}`);
      } else {
        this.fail(check, '✗ No encontrado');
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  async checkDependencies() {
    const check = 'Dependencies';
    try {
      if (fs.existsSync('./node_modules')) {
        const count = fs.readdirSync('./node_modules').length;
        this.pass(check, `✓ ${count} paquetes instalados`);
      } else {
        this.fail(check, '✗ node_modules no encontrado');
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  async checkAgents() {
    const check = 'Agents';
    try {
      const agentsDir = './agents';
      const requiredAgents = ['build-agent.js', 'security-agent.js'];
      const missing = [];

      for (const agent of requiredAgents) {
        if (!fs.existsSync(path.join(agentsDir, agent))) {
          missing.push(agent);
        }
      }

      if (missing.length === 0) {
        this.pass(check, '✓ Todos los agentes presentes');
      } else {
        this.fail(check, `✗ Faltantes: ${missing.join(', ')}`);
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  async checkModules() {
    const check = 'Modules';
    try {
      const modulesDir = './modules';
      const requiredModules = ['api', 'auth', 'queue'];
      const missing = [];

      for (const module of requiredModules) {
        const modulePath = path.join(modulesDir, module, 'index.js');
        if (!fs.existsSync(modulePath)) {
          missing.push(module);
        }
      }

      if (missing.length === 0) {
        this.pass(check, '✓ Todos los módulos presentes');
      } else {
        this.fail(check, `✗ Faltantes: ${missing.join(', ')}`);
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  async checkConfiguration() {
    const check = 'Configuration';
    try {
      const configFiles = ['.gitignore', 'README.md'];
      const missing = configFiles.filter(file => !fs.existsSync(file));

      if (missing.length === 0) {
        this.pass(check, '✓ Archivos de configuración presentes');
      } else {
        this.fail(check, `⚠️ Faltantes: ${missing.join(', ')}`);
      }
    } catch (error) {
      this.fail(check, error.message);
    }
  }

  pass(check, message) {
    this.checks.push({ check, status: 'pass', message });
    this.passed++;
    console.log(`✅ ${check}: ${message}`);
  }

  fail(check, message) {
    this.checks.push({ check, status: 'fail', message });
    this.failed++;
    console.log(`❌ ${check}: ${message}`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE VERIFICACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Pasados: ${this.passed}`);
    console.log(`❌ Fallidos: ${this.failed}`);
    console.log(`📋 Total: ${this.checks.length}`);
    console.log('='.repeat(60) + '\n');

    if (this.failed === 0) {
      console.log('🎉 ¡Sistema saludable! Todos los checks pasaron.\n');
    } else {
      console.log('⚠️ Sistema con problemas. Revisa los errores arriba.\n');
    }
  }
}

// Ejecutar health check
const healthCheck = new HealthCheck();
healthCheck.run().catch(error => {
  console.error('❌ Error durante health check:', error);
  process.exit(1);
});
