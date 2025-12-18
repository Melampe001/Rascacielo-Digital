/**
 * Deploy Agent - Rascacielos Digital
 * 
 * Agente especializado en despliegue a Treesit Cloud
 */

const TreesitClient = require('../modules/treesit-client');
const { Logger } = require('../modules/core');

class DeployAgent {
  constructor(config = {}) {
    this.logger = new Logger('DeployAgent');
    this.config = {
      dryRun: config.dryRun || false,
      autoRollback: config.autoRollback !== false,
      healthCheckRetries: config.healthCheckRetries || 5,
      healthCheckInterval: config.healthCheckInterval || 30000,
      ...config
    };
    this.treesitClient = new TreesitClient(config.treesit);
  }

  /**
   * Deploy application to Treesit Cloud
   */
  async deploy(options = {}) {
    const startTime = Date.now();

    try {
      this.logger.info('Iniciando despliegue a Treesit Cloud...');

      if (this.config.dryRun) {
        this.logger.info('Modo DRY RUN - No se realizará el despliegue real');
        return { success: true, dryRun: true };
      }

      // Validate deployment configuration
      await this.validateConfig(options);

      // Start deployment
      this.logger.info('Creando despliegue...');
      const deployment = await this.treesitClient.deploy(options);
      this.logger.info(`Despliegue creado: ${deployment.id}`);

      // Wait for deployment to complete
      this.logger.info('Esperando a que el despliegue se complete...');
      const deploymentStatus = await this.waitForDeployment(deployment.id);

      if (deploymentStatus.status !== 'success') {
        throw new Error(`Despliegue falló con estado: ${deploymentStatus.status}`);
      }

      // Run health checks
      this.logger.info('Ejecutando health checks...');
      const healthStatus = await this.runHealthChecks(deployment.id);

      if (!healthStatus.healthy && this.config.autoRollback) {
        this.logger.warn('Health checks fallaron - Iniciando rollback automático...');
        await this.rollback(deployment.id);
        throw new Error('Despliegue falló health checks y fue revertido');
      }

      const duration = Date.now() - startTime;
      this.logger.info(`Despliegue completado exitosamente en ${duration}ms`);

      return {
        success: true,
        deploymentId: deployment.id,
        duration,
        status: deploymentStatus,
        health: healthStatus
      };

    } catch (error) {
      this.logger.error('Error durante el despliegue:', error.message);
      throw error;
    }
  }

  /**
   * Validate deployment configuration
   */
  async validateConfig(options) {
    if (!options.region && !this.treesitClient.config.deployment.region) {
      throw new Error('Region is required for deployment');
    }

    if (!this.treesitClient.config.auth.apiKey) {
      throw new Error('Treesit API key is not configured');
    }

    return true;
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(deploymentId, maxWaitTime = 600000) {
    const startTime = Date.now();
    const pollInterval = 10000; // 10 seconds

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.treesitClient.getDeploymentStatus(deploymentId);

      this.logger.info(`Estado del despliegue: ${status.status}`);

      if (status.status === 'success' || status.status === 'failed') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Deployment timed out');
  }

  /**
   * Run health checks
   */
  async runHealthChecks(deploymentId) {
    let attempts = 0;

    while (attempts < this.config.healthCheckRetries) {
      try {
        const health = await this.treesitClient.healthCheck(deploymentId);
        
        if (health.status === 'healthy') {
          this.logger.info('Health check exitoso');
          return { healthy: true, ...health };
        }

        this.logger.warn(`Health check falló (intento ${attempts + 1}/${this.config.healthCheckRetries})`);
      } catch (error) {
        this.logger.warn(`Error en health check: ${error.message}`);
      }

      attempts++;
      if (attempts < this.config.healthCheckRetries) {
        await new Promise(resolve => setTimeout(resolve, this.config.healthCheckInterval));
      }
    }

    return { healthy: false };
  }

  /**
   * Rollback deployment
   */
  async rollback(deploymentId, targetVersion = null) {
    try {
      this.logger.info(`Iniciando rollback del despliegue ${deploymentId}...`);
      const result = await this.treesitClient.rollback(deploymentId, targetVersion);
      this.logger.info('Rollback completado exitosamente');
      return result;
    } catch (error) {
      this.logger.error('Error durante el rollback:', error.message);
      throw error;
    }
  }

  /**
   * Get deployment status
   */
  async getStatus(deploymentId) {
    try {
      const status = await this.treesitClient.getDeploymentStatus(deploymentId);
      return status;
    } catch (error) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }

  /**
   * Get deployment logs
   */
  async getLogs(deploymentId, options = {}) {
    try {
      const logs = await this.treesitClient.getLogs(deploymentId, options);
      return logs;
    } catch (error) {
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }
}

module.exports = DeployAgent;
