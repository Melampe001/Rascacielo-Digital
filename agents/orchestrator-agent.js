#!/usr/bin/env node

/**
 * Orchestrator Agent - Rascacielos Digital
 * 
 * Agente coordinador que ejecuta y gestiona otros agentes del sistema
 * Soporta ejecución secuencial, paralela y pipelines completos
 */

const BuildAgent = require('./build-agent');
const SecurityAgent = require('./security-agent');
const DeployAgent = require('./deploy-agent');
const { Logger, Utils } = require('../modules/core');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Constants
const BYTES_PER_KB = 1024;

class OrchestratorAgent {
  constructor(config = {}) {
    this.logger = new Logger('Orchestrator');
    this.config = {
      timeout: config.timeout || 300000, // 5 minutes default
      dryRun: config.dryRun || false,
      reportDir: config.reportDir || './reports',
      ...config
    };

    // Initialize agents
    this.agents = {
      build: new BuildAgent(config.build || {}),
      security: new SecurityAgent(config.security || {}),
      deploy: new DeployAgent(config.deploy || {})
    };

    // Check for maintenance agent/script
    this.hasMaintenanceAgent = this.checkMaintenanceAvailability();

    this.results = [];
    this.startTime = null;
    this.metrics = {
      cpu: [],
      memory: []
    };
  }

  /**
   * Check if maintenance script/agent is available
   */
  checkMaintenanceAvailability() {
    const cleanupScript = path.join(__dirname, '../scripts/cleanup.sh');
    return fs.existsSync(cleanupScript);
  }

  /**
   * Execute full pipeline: maintain → security → build → deploy
   */
  async executeFullPipeline(config = {}) {
    this.logger.info('='.repeat(60));
    this.logger.info('Iniciando Pipeline Completo');
    this.logger.info('='.repeat(60));

    this.startTime = Date.now();
    this.results = [];

    try {
      const tasks = [];

      // Add maintenance if available
      if (this.hasMaintenanceAgent) {
        tasks.push({
          name: 'maintenance',
          description: 'Limpieza y mantenimiento',
          handler: () => this.runMaintenance()
        });
      }

      // Add security scan
      tasks.push({
        name: 'security',
        description: 'Análisis de seguridad',
        handler: () => this.agents.security.scan(config.security || {})
      });

      // Add build
      tasks.push({
        name: 'build',
        description: 'Construcción del proyecto',
        handler: () => this.agents.build.build(config.build || {})
      });

      // Add deploy
      tasks.push({
        name: 'deploy',
        description: 'Despliegue',
        handler: () => this.agents.deploy.deploy(config.deploy || {})
      });

      // Execute sequentially
      await this.executeSequential(tasks);

      const report = await this.generateReport();
      this.logger.info('Pipeline completado exitosamente');

      return report;

    } catch (error) {
      this.logger.error('Error en pipeline completo:', error.message);
      await this.rollback(error);
      throw error;
    }
  }

  /**
   * Execute fast pipeline: build → deploy
   */
  async executeFastPipeline(config = {}) {
    this.logger.info('='.repeat(60));
    this.logger.info('Iniciando Pipeline Rápido');
    this.logger.info('='.repeat(60));

    this.startTime = Date.now();
    this.results = [];

    try {
      const tasks = [
        {
          name: 'build',
          description: 'Construcción del proyecto',
          handler: () => this.agents.build.build(config.build || {})
        },
        {
          name: 'deploy',
          description: 'Despliegue',
          handler: () => this.agents.deploy.deploy(config.deploy || {})
        }
      ];

      await this.executeSequential(tasks);

      const report = await this.generateReport();
      this.logger.info('Pipeline rápido completado exitosamente');

      return report;

    } catch (error) {
      this.logger.error('Error en pipeline rápido:', error.message);
      await this.rollback(error);
      throw error;
    }
  }

  /**
   * Execute tasks in parallel
   */
  async executeParallel(tasks) {
    this.logger.info(`Ejecutando ${tasks.length} tareas en paralelo...`);

    const taskPromises = tasks.map(async task => {
      const taskStart = Date.now();
      this.logger.info(`[${task.name}] Iniciando...`);

      try {
        const result = await Utils.timeout(
          task.handler(),
          this.config.timeout
        ).catch(err => {
          if (err.message === 'Timeout exceeded') {
            throw new Error(`Task '${task.name}' exceeded timeout of ${this.config.timeout}ms`);
          }
          throw err;
        });

        const duration = Date.now() - taskStart;
        this.logger.info(`[${task.name}] Completado en ${duration}ms`);

        const taskResult = {
          name: task.name,
          description: task.description,
          status: 'success',
          duration,
          result,
          timestamp: new Date().toISOString()
        };

        this.results.push(taskResult);
        return taskResult;

      } catch (error) {
        const duration = Date.now() - taskStart;
        this.logger.error(`[${task.name}] Error: ${error.message}`);

        const taskResult = {
          name: task.name,
          description: task.description,
          status: 'failed',
          duration,
          error: error.message,
          timestamp: new Date().toISOString()
        };

        this.results.push(taskResult);
        throw error;
      }
    });

    try {
      await Promise.all(taskPromises);
      this.logger.info('Todas las tareas paralelas completadas');
    } catch (error) {
      this.logger.error('Una o más tareas paralelas fallaron');
      throw error;
    }
  }

  /**
   * Execute tasks sequentially with validation
   */
  async executeSequential(tasks) {
    this.logger.info(`Ejecutando ${tasks.length} tareas en secuencia...`);

    for (const task of tasks) {
      const taskStart = Date.now();
      this.logger.info(`[${task.name}] ${task.description}...`);

      // Capture metrics before task
      this.captureMetrics();

      try {
        const result = await Utils.timeout(
          task.handler(),
          this.config.timeout
        ).catch(err => {
          if (err.message === 'Timeout exceeded') {
            throw new Error(`Task '${task.name}' exceeded timeout of ${this.config.timeout}ms`);
          }
          throw err;
        });

        const duration = Date.now() - taskStart;
        this.logger.info(`[${task.name}] Completado en ${duration}ms`);

        const taskResult = {
          name: task.name,
          description: task.description,
          status: 'success',
          duration,
          result,
          timestamp: new Date().toISOString()
        };

        this.results.push(taskResult);

        // Capture metrics after task
        this.captureMetrics();

      } catch (error) {
        const duration = Date.now() - taskStart;
        this.logger.error(`[${task.name}] Error: ${error.message}`);

        const taskResult = {
          name: task.name,
          description: task.description,
          status: 'failed',
          duration,
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        };

        this.results.push(taskResult);
        throw error;
      }
    }

    this.logger.info('Todas las tareas secuenciales completadas');
  }

  /**
   * Run maintenance/cleanup
   */
  async runMaintenance() {
    this.logger.info('Ejecutando tareas de mantenimiento...');

    if (!this.hasMaintenanceAgent) {
      this.logger.warn('Script de mantenimiento no disponible');
      return { success: true, skipped: true };
    }

    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
      const cleanupScript = path.join(__dirname, '../scripts/cleanup.sh');
      const { stdout, stderr } = await execPromise(`bash ${cleanupScript}`);

      if (stderr) {
        this.logger.warn('Advertencias de mantenimiento:', stderr);
      }

      this.logger.info('Mantenimiento completado');
      return {
        success: true,
        output: stdout,
        warnings: stderr || null
      };

    } catch (error) {
      this.logger.error('Error en mantenimiento:', error.message);
      // Don't fail the entire pipeline for maintenance errors
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rollback changes when a step fails
   */
  async rollback(failedStep) {
    this.logger.warn('='.repeat(60));
    this.logger.warn('Iniciando Rollback Automático');
    this.logger.warn('='.repeat(60));

    try {
      // Find the last successful deploy
      const lastDeployResult = this.results
        .filter(r => r.name === 'deploy' && r.status === 'success')
        .pop();

      if (lastDeployResult && lastDeployResult.result?.deploymentId) {
        this.logger.info('Revertiendo último despliegue...');
        await this.agents.deploy.rollback(lastDeployResult.result.deploymentId);
        this.logger.info('Rollback completado');
      } else {
        this.logger.info('No hay despliegues previos para revertir');
      }

      // Log rollback result
      this.results.push({
        name: 'rollback',
        description: 'Reversión automática',
        status: 'success',
        timestamp: new Date().toISOString(),
        reason: failedStep?.message || 'Error desconocido'
      });

    } catch (error) {
      this.logger.error('Error durante rollback:', error.message);
      this.results.push({
        name: 'rollback',
        description: 'Reversión automática',
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Capture system metrics (CPU and memory)
   */
  captureMetrics() {
    const cpuUsage = process.cpuUsage();
    const memUsage = process.memoryUsage();

    this.metrics.cpu.push({
      user: cpuUsage.user,
      system: cpuUsage.system,
      timestamp: Date.now()
    });

    this.metrics.memory.push({
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      timestamp: Date.now()
    });
  }

  /**
   * Generate comprehensive execution report
   */
  async generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    const report = {
      orchestrator: 'Rascacielos Digital',
      version: '1.0.0',
      execution: {
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: totalDuration,
        durationFormatted: this.formatDuration(totalDuration)
      },
      summary: {
        total: this.results.length,
        successful: this.results.filter(r => r.status === 'success').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        skipped: this.results.filter(r => r.status === 'skipped').length
      },
      tasks: this.results,
      metrics: {
        cpu: this.calculateCpuMetrics(),
        memory: this.calculateMemoryMetrics()
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem()
      }
    };

    // Save report to file
    await this.saveReport(report);

    return report;
  }

  /**
   * Calculate CPU metrics summary
   */
  calculateCpuMetrics() {
    if (this.metrics.cpu.length === 0) {
      return { avg: 0, max: 0, min: 0 };
    }

    const userTimes = this.metrics.cpu.map(m => m.user);
    const systemTimes = this.metrics.cpu.map(m => m.system);

    return {
      user: {
        avg: userTimes.reduce((a, b) => a + b, 0) / userTimes.length,
        max: Math.max(...userTimes),
        min: Math.min(...userTimes)
      },
      system: {
        avg: systemTimes.reduce((a, b) => a + b, 0) / systemTimes.length,
        max: Math.max(...systemTimes),
        min: Math.min(...systemTimes)
      },
      samples: this.metrics.cpu.length
    };
  }

  /**
   * Calculate memory metrics summary
   */
  calculateMemoryMetrics() {
    if (this.metrics.memory.length === 0) {
      return { heapUsed: 0, heapTotal: 0, rss: 0 };
    }

    const heapUsed = this.metrics.memory.map(m => m.heapUsed);
    const heapTotal = this.metrics.memory.map(m => m.heapTotal);
    const rss = this.metrics.memory.map(m => m.rss);

    return {
      heapUsed: {
        avg: heapUsed.reduce((a, b) => a + b, 0) / heapUsed.length,
        max: Math.max(...heapUsed),
        min: Math.min(...heapUsed),
        maxFormatted: this.formatBytes(Math.max(...heapUsed))
      },
      heapTotal: {
        avg: heapTotal.reduce((a, b) => a + b, 0) / heapTotal.length,
        max: Math.max(...heapTotal),
        min: Math.min(...heapTotal),
        maxFormatted: this.formatBytes(Math.max(...heapTotal))
      },
      rss: {
        avg: rss.reduce((a, b) => a + b, 0) / rss.length,
        max: Math.max(...rss),
        min: Math.min(...rss),
        maxFormatted: this.formatBytes(Math.max(...rss))
      },
      samples: this.metrics.memory.length
    };
  }

  /**
   * Save report to files (JSON and text)
   */
  async saveReport(report) {
    try {
      // Ensure reports directory exists
      if (!fs.existsSync(this.config.reportDir)) {
        fs.mkdirSync(this.config.reportDir, { recursive: true });
      }

      // Save JSON report
      const jsonPath = path.join(this.config.reportDir, 'orchestrator-report.json');
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
      this.logger.info(`Reporte JSON guardado: ${jsonPath}`);

      // Save text report
      const textPath = path.join(this.config.reportDir, 'orchestrator-report.txt');
      const textReport = this.formatTextReport(report);
      fs.writeFileSync(textPath, textReport);
      this.logger.info(`Reporte de texto guardado: ${textPath}`);

    } catch (error) {
      this.logger.error('Error guardando reportes:', error.message);
    }
  }

  /**
   * Format report as text
   */
  formatTextReport(report) {
    let text = '';
    text += '='.repeat(70) + '\n';
    text += '  ORCHESTRATOR REPORT - Rascacielos Digital\n';
    text += '='.repeat(70) + '\n\n';

    text += `Fecha de inicio: ${report.execution.startTime}\n`;
    text += `Fecha de fin:    ${report.execution.endTime}\n`;
    text += `Duración:        ${report.execution.durationFormatted}\n\n`;

    text += '--- RESUMEN ---\n';
    text += `Total de tareas:  ${report.summary.total}\n`;
    text += `  ✓ Exitosas:     ${report.summary.successful}\n`;
    text += `  ✗ Fallidas:     ${report.summary.failed}\n`;
    text += `  ⊘ Omitidas:     ${report.summary.skipped}\n\n`;

    text += '--- TAREAS ---\n';
    report.tasks.forEach((task, index) => {
      const icon = task.status === 'success' ? '✓' : task.status === 'failed' ? '✗' : '⊘';
      text += `${index + 1}. [${icon}] ${task.name} - ${task.description}\n`;
      text += `   Estado: ${task.status}\n`;
      text += `   Duración: ${this.formatDuration(task.duration)}\n`;
      if (task.error) {
        text += `   Error: ${task.error}\n`;
      }
      text += '\n';
    });

    text += '--- MÉTRICAS DEL SISTEMA ---\n';
    text += `Plataforma:      ${report.system.platform}\n`;
    text += `Arquitectura:    ${report.system.arch}\n`;
    text += `Node.js:         ${report.system.nodeVersion}\n`;
    text += `CPUs:            ${report.system.cpus}\n`;
    text += `Memoria total:   ${this.formatBytes(report.system.totalMemory)}\n`;
    text += `Memoria libre:   ${this.formatBytes(report.system.freeMemory)}\n\n`;

    if (report.metrics.memory.samples > 0) {
      text += '--- MÉTRICAS DE EJECUCIÓN ---\n';
      text += `Memoria heap usada (max): ${report.metrics.memory.heapUsed.maxFormatted}\n`;
      text += `Memoria RSS (max):        ${report.metrics.memory.rss.maxFormatted}\n`;
      text += `Muestras recolectadas:    ${report.metrics.memory.samples}\n\n`;
    }

    text += '='.repeat(70) + '\n';

    return text;
  }

  /**
   * Format duration in human-readable format
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s ${ms % 1000}ms`;
    }
  }

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= BYTES_PER_KB && unitIndex < units.length - 1) {
      size /= BYTES_PER_KB;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Execute custom task list
   */
  async executeCustom(taskNames, mode = 'sequential') {
    this.logger.info(`Ejecutando tareas personalizadas: ${taskNames.join(', ')}`);

    this.startTime = Date.now();
    this.results = [];

    const availableTasks = {
      maintenance: {
        name: 'maintenance',
        description: 'Limpieza y mantenimiento',
        handler: () => this.runMaintenance()
      },
      security: {
        name: 'security',
        description: 'Análisis de seguridad',
        handler: () => this.agents.security.scan({})
      },
      build: {
        name: 'build',
        description: 'Construcción del proyecto',
        handler: () => this.agents.build.build({})
      },
      deploy: {
        name: 'deploy',
        description: 'Despliegue',
        handler: () => this.agents.deploy.deploy({})
      }
    };

    const tasks = taskNames
      .map(name => availableTasks[name])
      .filter(task => task !== undefined);

    if (tasks.length === 0) {
      throw new Error('No se encontraron tareas válidas');
    }

    try {
      if (mode === 'parallel') {
        await this.executeParallel(tasks);
      } else {
        await this.executeSequential(tasks);
      }

      return await this.generateReport();

    } catch (error) {
      this.logger.error('Error en ejecución personalizada:', error.message);
      await this.rollback(error);
      throw error;
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const config = {};

  // Parse command line arguments
  let mode = 'full';
  let tasks = [];

  args.forEach(arg => {
    if (arg.startsWith('--mode=')) {
      mode = arg.split('=')[1];
    } else if (arg.startsWith('--tasks=')) {
      tasks = arg.split('=')[1].split(',');
    } else if (arg === '--dry-run') {
      config.dryRun = true;
    } else if (arg.startsWith('--timeout=')) {
      config.timeout = parseInt(arg.split('=')[1], 10);
    }
  });

  // Load config from file if exists
  const configFile = path.join(__dirname, '../.orchestratorrc.json');
  if (fs.existsSync(configFile)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      Object.assign(config, fileConfig);
    } catch (error) {
      console.error('Error cargando configuración:', error.message);
    }
  }

  const orchestrator = new OrchestratorAgent(config);

  // Execute based on mode
  (async () => {
    try {
      let result;

      switch (mode) {
      case 'full':
        result = await orchestrator.executeFullPipeline(config);
        break;

      case 'fast':
        result = await orchestrator.executeFastPipeline(config);
        break;

      case 'parallel':
        if (tasks.length === 0) {
          tasks = ['build', 'security'];
        }
        result = await orchestrator.executeCustom(tasks, 'parallel');
        break;

      case 'sequential':
        if (tasks.length === 0) {
          console.error('Error: --tasks requeridas para modo sequential');
          process.exit(1);
        }
        result = await orchestrator.executeCustom(tasks, 'sequential');
        break;

      default:
        console.error(`Modo desconocido: ${mode}`);
        console.log('Modos disponibles: full, fast, parallel, sequential');
        process.exit(1);
      }

      console.log('\n' + '='.repeat(70));
      console.log('ORCHESTRATOR COMPLETADO EXITOSAMENTE');
      console.log('='.repeat(70));
      console.log(`Tareas exitosas: ${result.summary.successful}/${result.summary.total}`);
      console.log(`Duración total: ${result.execution.durationFormatted}`);
      console.log(`Reporte guardado en: ${config.reportDir || './reports'}`);
      console.log('='.repeat(70) + '\n');

      process.exit(0);

    } catch (error) {
      console.error('\n' + '='.repeat(70));
      console.error('ORCHESTRATOR FALLÓ');
      console.error('='.repeat(70));
      console.error('Error:', error.message);
      console.error('='.repeat(70) + '\n');
      process.exit(1);
    }
  })();
}

module.exports = OrchestratorAgent;
