/**
 * Health Check Script - Rascacielos Digital
 *
 * Verifica el estado de salud del sistema
 */

const path = require('path');
const fs = require('fs');

class HealthChecker {
  constructor() {
    this.checks = [];
    this.status = 'healthy';
  }

  /**
   * Ejecuta todas las verificaciones de salud
   */
  async run() {
    console.log('=== Health Check del Sistema ===\n');

    const startTime = Date.now();

    // Verificar módulos core
    await this.checkCoreModules();

    // Verificar agentes
    await this.checkAgents();

    // Verificar configuración
    await this.checkConfiguration();

    // Verificar recursos del sistema
    await this.checkSystemResources();

    const duration = Date.now() - startTime;

    // Mostrar resultados
    this.showResults(duration);

    return {
      status: this.status,
      checks: this.checks,
      duration,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Verifica los módulos core
   */
  async checkCoreModules() {
    console.log('Verificando módulos core...');

    try {
      const corePath = path.join(process.cwd(), 'modules', 'core.js');

      if (fs.existsSync(corePath)) {
        const core = require(corePath);

        // Verificar Logger
        if (core.Logger) {
          // eslint-disable-next-line no-unused-vars
          const logger = new core.Logger('HealthCheck');
          this.addCheck('Core Logger', 'passed');
        } else {
          this.addCheck('Core Logger', 'failed', 'Logger no encontrado');
        }

        // Verificar Config
        if (core.Config) {
          const config = new core.Config({ test: true });
          if (config.get('test') === true) {
            this.addCheck('Core Config', 'passed');
          } else {
            this.addCheck('Core Config', 'failed', 'Config no funciona correctamente');
          }
        } else {
          this.addCheck('Core Config', 'failed', 'Config no encontrado');
        }

        // Verificar Utils
        if (core.Utils) {
          this.addCheck('Core Utils', 'passed');
        } else {
          this.addCheck('Core Utils', 'failed', 'Utils no encontrado');
        }

        // Verificar ErrorHandler
        if (core.ErrorHandler) {
          this.addCheck('Core ErrorHandler', 'passed');
        } else {
          this.addCheck('Core ErrorHandler', 'failed', 'ErrorHandler no encontrado');
        }
      } else {
        this.addCheck('Core Module', 'failed', 'Módulo core no encontrado');
      }
    } catch (error) {
      this.addCheck('Core Module', 'failed', error.message);
    }

    console.log('  ✓ Verificación de módulos core completada\n');
  }

  /**
   * Verifica los agentes
   */
  async checkAgents() {
    console.log('Verificando agentes...');

    const agents = [
      { name: 'Build Agent', file: 'build-agent.js' },
      { name: 'Security Agent', file: 'security-agent.js' },
      { name: 'Test Agent', file: 'test-agent.js' },
      { name: 'Deploy Agent', file: 'deploy-agent.js' },
      { name: 'Monitor Agent', file: 'monitor-agent.js' }
    ];

    for (const agent of agents) {
      try {
        const agentPath = path.join(process.cwd(), 'agents', agent.file);

        if (fs.existsSync(agentPath)) {
          const AgentClass = require(agentPath);
          const instance = new AgentClass();

          if (instance) {
            this.addCheck(agent.name, 'passed');
          } else {
            this.addCheck(agent.name, 'failed', 'No se pudo instanciar');
          }
        } else {
          this.addCheck(agent.name, 'warning', 'Archivo no encontrado');
        }
      } catch (error) {
        this.addCheck(agent.name, 'failed', error.message);
      }
    }

    console.log('  ✓ Verificación de agentes completada\n');
  }

  /**
   * Verifica la configuración
   */
  async checkConfiguration() {
    console.log('Verificando configuración...');

    try {
      const configPath = path.join(process.cwd(), 'config', 'default.json');

      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        // Verificar secciones de configuración
        if (config.system) {
          this.addCheck('Config System', 'passed');
        } else {
          this.addCheck('Config System', 'warning', 'Sección system no encontrada');
        }

        if (config.agents) {
          this.addCheck('Config Agents', 'passed');
        } else {
          this.addCheck('Config Agents', 'warning', 'Sección agents no encontrada');
        }

        if (config.cicd) {
          this.addCheck('Config CI/CD', 'passed');
        } else {
          this.addCheck('Config CI/CD', 'warning', 'Sección cicd no encontrada');
        }

      } else {
        this.addCheck('Configuration', 'failed', 'Archivo de configuración no encontrado');
      }
    } catch (error) {
      this.addCheck('Configuration', 'failed', error.message);
    }

    console.log('  ✓ Verificación de configuración completada\n');
  }

  /**
   * Verifica recursos del sistema
   */
  async checkSystemResources() {
    console.log('Verificando recursos del sistema...');

    // Verificar memoria
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    if (heapUsedMB / heapTotalMB < 0.9) {
      this.addCheck('Memory', 'passed', `${heapUsedMB}MB / ${heapTotalMB}MB`);
    } else {
      this.addCheck('Memory', 'warning', `Uso alto: ${heapUsedMB}MB / ${heapTotalMB}MB`);
    }

    // Verificar Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

    if (majorVersion >= 18) {
      this.addCheck('Node.js Version', 'passed', nodeVersion);
    } else if (majorVersion >= 16) {
      this.addCheck('Node.js Version', 'warning', `${nodeVersion} (recomendado >=18)`);
    } else {
      this.addCheck('Node.js Version', 'failed', `${nodeVersion} (requerido >=16)`);
    }

    // Verificar directorio de trabajo
    const cwd = process.cwd();
    if (fs.existsSync(path.join(cwd, 'package.json'))) {
      this.addCheck('Working Directory', 'passed');
    } else {
      this.addCheck('Working Directory', 'failed', 'No es un proyecto Node.js válido');
    }

    console.log('  ✓ Verificación de recursos completada\n');
  }

  /**
   * Agrega un check al registro
   */
  addCheck(name, status, details = null) {
    this.checks.push({ name, status, details });

    if (status === 'failed' && this.status !== 'critical') {
      this.status = 'unhealthy';
    } else if (status === 'warning' && this.status === 'healthy') {
      this.status = 'degraded';
    }
  }

  /**
   * Muestra los resultados
   */
  showResults(duration) {
    console.log('=== Resultados del Health Check ===\n');

    const statusIcons = {
      passed: '✅',
      failed: '❌',
      warning: '⚠️'
    };

    for (const check of this.checks) {
      const icon = statusIcons[check.status];
      const details = check.details ? ` (${check.details})` : '';
      console.log(`${icon} ${check.name}${details}`);
    }

    console.log();

    const passed = this.checks.filter(c => c.status === 'passed').length;
    const failed = this.checks.filter(c => c.status === 'failed').length;
    const warning = this.checks.filter(c => c.status === 'warning').length;

    console.log(`Resultados: ${passed} OK, ${failed} fallidos, ${warning} advertencias`);
    console.log(`Tiempo: ${duration}ms`);

    const statusMessages = {
      healthy: '✅ Sistema saludable',
      degraded: '⚠️  Sistema degradado',
      unhealthy: '❌ Sistema no saludable',
      critical: '🚨 Sistema en estado crítico'
    };

    console.log(`\nEstado: ${statusMessages[this.status]}`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  const checker = new HealthChecker();
  checker.run()
    .then(result => {
      if (result.status === 'unhealthy' || result.status === 'critical') {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error durante el health check:', error);
      process.exit(1);
    });
}

module.exports = HealthChecker;
