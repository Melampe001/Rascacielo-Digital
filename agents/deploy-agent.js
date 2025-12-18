/**
 * Deploy Agent - Treesit Cloud
 * Specialized agent for deployment to Treesit Cloud
 */

const TreesitClient = require('../modules/treesit-client');
const TreesitCloudConfig = require('../config/treesit-cloud');
const { Logger } = require('../modules/core');

class DeployAgent {
  constructor(config = {}) {
    this.logger = new Logger('DeployAgent');
    this.cloudConfig = new TreesitCloudConfig();
    this.client = new TreesitClient(this.cloudConfig);
    
    this.config = {
      environment: config.environment || 'production',
      autoRollback: config.autoRollback !== false,
      healthCheckTimeout: config.healthCheckTimeout || 300000, // 5 min
      ...config
    };
  }

  async deploy(options = {}) {
    const startTime = Date.now();
    this.logger.info('🚀 Iniciando despliegue a Treesit Cloud...');

    try {
      // 1. Pre-deployment validation
      await this.preDeploymentChecks();

      // 2. Build artifacts
      this.logger.info('📦 Preparando artefactos...');
      const artifacts = await this.prepareArtifacts(options);

      // 3. Deploy to Treesit Cloud
      this.logger.info('☁️ Desplegando a Treesit Cloud...');
      const deployment = await this.client.deploy({
        environment: this.config.environment,
        artifacts,
        config: this.cloudConfig.getAll()
      });

      this.logger.info(`✅ Deployment iniciado: ${deployment.id}`);

      // 4. Wait for deployment to complete
      const status = await this.waitForDeployment(deployment.id);

      // 5. Post-deployment validation
      await this.postDeploymentChecks(deployment.id);

      const duration = Date.now() - startTime;
      this.logger.info(`🎉 Despliegue completado en ${duration}ms`);

      return {
        success: true,
        deploymentId: deployment.id,
        environment: this.config.environment,
        duration,
        status,
        url: deployment.url
      };

    } catch (error) {
      this.logger.error('❌ Error en despliegue:', error.message);
      
      if (this.config.autoRollback) {
        this.logger.info('🔄 Iniciando rollback automático...');
        await this.rollback();
      }
      
      throw error;
    }
  }

  async preDeploymentChecks() {
    this.logger.info('🔍 Validaciones pre-despliegue...');

    // Check cloud connectivity
    const health = await this.client.healthCheck();
    if (!health.healthy) {
      throw new Error('Treesit Cloud no está disponible');
    }

    // Validate configuration
    this.cloudConfig.validate();

    this.logger.info('✅ Validaciones completadas');
  }

  async prepareArtifacts(options) {
    // Prepare deployment package
    const path = require('path');
    const packageJson = require(path.join(__dirname, '..', 'package.json'));
    
    return {
      name: 'rascacielo-digital',
      version: packageJson.version,
      files: options.files || ['dist/*'],
      entrypoint: options.entrypoint || 'index.js',
      buildTime: new Date().toISOString()
    };
  }

  async waitForDeployment(deploymentId, timeout = this.config.healthCheckTimeout) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const status = await this.client.getDeploymentStatus(deploymentId);
      
      this.logger.info(`📊 Estado: ${status.state}`);

      if (status.state === 'completed') {
        return status;
      }

      if (status.state === 'failed') {
        throw new Error(`Deployment failed: ${status.error}`);
      }

      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    throw new Error('Deployment timeout');
  }

  async postDeploymentChecks(deploymentId) {
    this.logger.info('🔍 Validaciones post-despliegue...');

    // Check application health
    const deployment = await this.client.getDeploymentStatus(deploymentId);
    
    if (!deployment.healthy) {
      throw new Error('Application health check failed');
    }

    this.logger.info('✅ Aplicación saludable');
  }

  async rollback(deploymentId = null) {
    this.logger.info('🔄 Ejecutando rollback...');

    try {
      if (deploymentId) {
        await this.client.rollback(deploymentId);
      } else {
        // Rollback to previous deployment
        const deployments = await this.client.listDeployments();
        if (deployments.length > 1) {
          await this.client.rollback(deployments[1].id);
        }
      }

      this.logger.info('✅ Rollback completado');
      return { success: true };
    } catch (error) {
      this.logger.error('❌ Rollback falló:', error.message);
      throw error;
    }
  }

  async getStatus() {
    const deployments = await this.client.listDeployments();
    const metrics = await this.client.getMetrics('1h');
    
    return {
      deployments,
      metrics,
      environment: this.config.environment
    };
  }
}

module.exports = DeployAgent;
