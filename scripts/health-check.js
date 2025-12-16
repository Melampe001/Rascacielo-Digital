/**
 * Health Check Script
 * Verifica que el sistema esté funcionando correctamente
 */

const RascacielosDigital = require('../index.js');

class HealthChecker {
  constructor() {
    this.checks = [];
    this.failures = [];
  }

  async run() {
    console.log('🏥 Ejecutando Health Check del sistema...\n');

    await this.checkSystemInitialization();
    await this.checkAgents();
    await this.checkModules();

    this.printResults();

    if (this.failures.length > 0) {
      process.exit(1);
    }
  }

  async checkSystemInitialization() {
    try {
      const app = new RascacielosDigital();
      const initialized = await app.initialize();

      if (initialized) {
        this.checks.push('✅ System initialization');
      } else {
        this.failures.push('System initialization failed');
      }
    } catch (error) {
      this.failures.push(`System initialization error: ${error.message}`);
    }
  }

  async checkAgents() {
    try {
      const BuildAgent = require('../agents/build-agent.js');
      const SecurityAgent = require('../agents/security-agent.js');

      const buildAgent = new BuildAgent();
      const securityAgent = new SecurityAgent();

      this.checks.push('✅ Agents loaded successfully');
    } catch (error) {
      this.failures.push(`Agents loading error: ${error.message}`);
    }
  }

  async checkModules() {
    try {
      const { Logger, Config, ErrorHandler, Utils } = require('../modules/core.js');

      if (!Logger || !Config || !ErrorHandler || !Utils) {
        this.failures.push('Core modules missing required exports');
        return;
      }

      const logger = new Logger('Test');
      const config = new Config({ test: true });
      const errorHandler = new ErrorHandler(logger);

      this.checks.push('✅ Core modules loaded successfully');
    } catch (error) {
      this.failures.push(`Core modules loading error: ${error.message}`);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));

    if (this.checks.length > 0) {
      console.log('\nCHECKS PASSED:');
      this.checks.forEach(check => {
        console.log(`   ${check}`);
      });
    }

    if (this.failures.length > 0) {
      console.log('\n❌ FAILURES:');
      this.failures.forEach(failure => {
        console.log(`   - ${failure}`);
      });
      console.log('\n❌ Health check FAILED\n');
    } else {
      console.log('\n✅ All health checks PASSED\n');
      console.log('🎉 Sistema Rascacielos Digital está operativo!\n');
    }
  }
}

// Run the health check
const checker = new HealthChecker();
checker.run().catch(error => {
  console.error('Health check error:', error);
  process.exit(1);
});
