/**
 * Orchestrator Agent - Rascacielo Digital
 * 
 * Coordina la ejecución de múltiples agentes con diferentes estrategias
 * Incluye pipelines completos, ejecución paralela, y rollback automático
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class OrchestratorAgent {
  constructor(config = {}) {
    this.config = {
      agents: config.agents || {},
      logger: config.logger || console,
      reportDir: config.reportDir || './reports',
      continueOnError: config.continueOnError || false,
      timeout: config.timeout || 300000, // 5 minutes default
      ...config
    };

    this.metrics = {
      startTime: null,
      endTime: null,
      duration: null,
      cpu: null,
      memory: null
    };

    this.results = [];
  }

  /**
   * Ejecuta el pipeline completo: maintain → security → build → deploy
   */
  async executeFullPipeline(options = {}) {
    this.config.logger.info('[Orchestrator] Iniciando pipeline completo...');
    this.startMetrics();

    const pipeline = [
      { name: 'maintenance', agent: 'maintenance', method: 'maintain' },
      { name: 'security', agent: 'security', method: 'scan' },
      { name: 'build', agent: 'build', method: 'build' },
      { name: 'deploy', agent: 'deploy', method: 'deploy' }
    ];

    return await this.executeSequential(pipeline, options);
  }

  /**
   * Ejecuta pipeline rápido: build → deploy
   */
  async executeFastPipeline(options = {}) {
    this.config.logger.info('[Orchestrator] Iniciando pipeline rápido...');
    this.startMetrics();

    const pipeline = [
      { name: 'build', agent: 'build', method: 'build' },
      { name: 'deploy', agent: 'deploy', method: 'deploy' }
    ];

    return await this.executeSequential(pipeline, options);
  }

  /**
   * Ejecuta agentes en paralelo
   */
  async executeParallel(agentConfigs, options = {}) {
    this.config.logger.info('[Orchestrator] Ejecutando agentes en paralelo...');
    this.startMetrics();

    const promises = agentConfigs.map(config => 
      this.executeAgent(config.agent, config.method, config.params || {})
        .catch(error => ({
          success: false,
          agent: config.agent,
          error: error.message
        }))
    );

    const results = await Promise.all(promises);
    this.results = results;

    this.endMetrics();
    const report = this.generateReport('parallel', results);
    await this.saveReport(report);

    return report;
  }

  /**
   * Ejecuta agentes en secuencia
   */
  async executeSequential(pipeline, options = {}) {
    const results = [];
    let shouldRollback = false;

    for (const step of pipeline) {
      try {
        this.config.logger.info(`[Orchestrator] Ejecutando: ${step.name}...`);
        
        const agent = this.getAgent(step.agent);
        if (!agent) {
          throw new Error(`Agent ${step.agent} not found`);
        }

        const startTime = performance.now();
        const result = await this.executeWithTimeout(
          agent,
          step.method,
          step.params || options
        );
        const duration = performance.now() - startTime;

        results.push({
          step: step.name,
          agent: step.agent,
          success: true,
          duration: Math.round(duration),
          result
        });

        this.config.logger.info(`[Orchestrator] ✓ ${step.name} completado (${Math.round(duration)}ms)`);

      } catch (error) {
        this.config.logger.error(`[Orchestrator] ✗ Error en ${step.name}: ${error.message}`);
        
        results.push({
          step: step.name,
          agent: step.agent,
          success: false,
          error: error.message
        });

        if (!this.config.continueOnError) {
          shouldRollback = true;
          break;
        }
      }
    }

    this.results = results;
    this.endMetrics();

    // Ejecutar rollback si es necesario
    if (shouldRollback && options.autoRollback !== false) {
      await this.rollback(results);
    }

    const report = this.generateReport('sequential', results);
    await this.saveReport(report);

    return report;
  }

  /**
   * Ejecuta un agente específico con timeout
   */
  async executeWithTimeout(agent, method, params) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);

      agent[method](params)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * Ejecuta un agente individual
   */
  async executeAgent(agentName, method, params = {}) {
    const agent = this.getAgent(agentName);
    if (!agent) {
      return {
        success: false,
        agent: agentName,
        method,
        error: `Agent ${agentName} not found`
      };
    }

    this.config.logger.info(`[Orchestrator] Ejecutando ${agentName}.${method}()`);
    
    try {
      const result = await agent[method](params);
      return {
        success: true,
        agent: agentName,
        method,
        result
      };
    } catch (error) {
      return {
        success: false,
        agent: agentName,
        method,
        error: error.message
      };
    }
  }

  /**
   * Obtiene un agente por nombre
   */
  getAgent(name) {
    return this.config.agents[name];
  }

  /**
   * Ejecuta rollback automático
   */
  async rollback(results) {
    this.config.logger.warn('[Orchestrator] Iniciando rollback automático...');

    // Revertir en orden inverso solo los pasos exitosos
    const successfulSteps = results.filter(r => r.success).reverse();

    for (const step of successfulSteps) {
      try {
        const agent = this.getAgent(step.agent);
        if (agent && typeof agent.rollback === 'function') {
          this.config.logger.info(`[Orchestrator] Revirtiendo ${step.step}...`);
          await agent.rollback(step.result);
          this.config.logger.info(`[Orchestrator] ✓ ${step.step} revertido`);
        }
      } catch (error) {
        this.config.logger.error(`[Orchestrator] Error al revertir ${step.step}: ${error.message}`);
      }
    }

    this.config.logger.info('[Orchestrator] Rollback completado');
  }

  /**
   * Genera reporte de ejecución
   */
  generateReport(mode, results) {
    const totalSteps = results.length;
    const successfulSteps = results.filter(r => r.success).length;
    const failedSteps = totalSteps - successfulSteps;
    const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

    return {
      mode,
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        total: totalSteps,
        successful: successfulSteps,
        failed: failedSteps,
        successRate: totalSteps > 0 ? (successfulSteps / totalSteps * 100).toFixed(2) + '%' : '0%',
        totalDuration: totalDuration + 'ms'
      },
      results,
      status: failedSteps === 0 ? 'SUCCESS' : 'FAILED'
    };
  }

  /**
   * Guarda el reporte en un archivo
   */
  async saveReport(report) {
    try {
      if (!fs.existsSync(this.config.reportDir)) {
        fs.mkdirSync(this.config.reportDir, { recursive: true });
      }

      const filename = `orchestrator-${report.mode}-${Date.now()}.json`;
      const filepath = path.join(this.config.reportDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      this.config.logger.info(`[Orchestrator] Reporte guardado: ${filepath}`);
    } catch (error) {
      this.config.logger.error(`[Orchestrator] Error al guardar reporte: ${error.message}`);
    }
  }

  /**
   * Inicia la recolección de métricas
   */
  startMetrics() {
    this.metrics.startTime = Date.now();
    
    if (process.memoryUsage) {
      const memBefore = process.memoryUsage();
      this.metrics.memoryStart = memBefore.heapUsed;
    }

    if (process.cpuUsage) {
      this.metrics.cpuStart = process.cpuUsage();
    }
  }

  /**
   * Finaliza la recolección de métricas
   */
  endMetrics() {
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;

    if (process.memoryUsage) {
      const memAfter = process.memoryUsage();
      this.metrics.memory = {
        heapUsed: Math.round((memAfter.heapUsed - this.metrics.memoryStart) / 1024 / 1024) + ' MB',
        total: Math.round(memAfter.heapUsed / 1024 / 1024) + ' MB'
      };
    }

    if (process.cpuUsage && this.metrics.cpuStart) {
      const cpuAfter = process.cpuUsage(this.metrics.cpuStart);
      this.metrics.cpu = {
        user: Math.round(cpuAfter.user / 1000) + ' ms',
        system: Math.round(cpuAfter.system / 1000) + ' ms'
      };
    }
  }

  /**
   * Muestra el estado actual
   */
  getStatus() {
    return {
      running: this.metrics.startTime !== null && this.metrics.endTime === null,
      completed: this.metrics.endTime !== null,
      duration: this.metrics.duration,
      results: this.results.length
    };
  }
}

// CLI Support
if (require.main === module) {
  const BuildAgent = require('./build-agent');
  const SecurityAgent = require('./security-agent');
  const DeployAgent = require('./deploy-agent');

  const args = process.argv.slice(2);
  const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'full';

  const orchestrator = new OrchestratorAgent({
    agents: {
      build: new BuildAgent(),
      security: new SecurityAgent(),
      deploy: new DeployAgent()
    },
    logger: console
  });

  async function runOrchestrator() {
    console.log(`🎭 Orchestrator Agent - Modo: ${mode}`);
    console.log('='.repeat(50));

    let report;

    try {
      switch (mode) {
        case 'full':
          report = await orchestrator.executeFullPipeline();
          break;
        case 'fast':
          report = await orchestrator.executeFastPipeline();
          break;
        case 'parallel':
          report = await orchestrator.executeParallel([
            { agent: 'build', method: 'build' },
            { agent: 'security', method: 'scan' }
          ]);
          break;
        default:
          console.error(`Modo desconocido: ${mode}`);
          process.exit(1);
      }

      console.log('\n📊 Reporte Final:');
      console.log('='.repeat(50));
      console.log(`Status: ${report.status}`);
      console.log(`Total Steps: ${report.summary.total}`);
      console.log(`Successful: ${report.summary.successful}`);
      console.log(`Failed: ${report.summary.failed}`);
      console.log(`Success Rate: ${report.summary.successRate}`);
      console.log(`Duration: ${report.summary.totalDuration}`);
      console.log('='.repeat(50));

      process.exit(report.status === 'SUCCESS' ? 0 : 1);

    } catch (error) {
      console.error('❌ Error en orchestrator:', error.message);
      process.exit(1);
    }
  }

  runOrchestrator();
}

module.exports = OrchestratorAgent;
