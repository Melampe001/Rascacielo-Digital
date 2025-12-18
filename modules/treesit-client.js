/**
 * Treesit Cloud Client Module
 * API client for Treesit Cloud platform
 */

const { HTTPClient } = require('./api');
const treesitConfig = require('../config/treesit-cloud');

class TreesitClient {
  constructor(config = {}) {
    this.config = {
      ...treesitConfig,
      ...config
    };

    this.client = new HTTPClient({
      baseURL: `${this.config.api.baseURL}/${this.config.api.version}`,
      timeout: this.config.api.timeout,
      headers: {
        'X-API-Key': this.config.auth.apiKey,
        'X-API-Secret': this.config.auth.apiSecret
      }
    });
  }

  /**
   * Deploy application to Treesit Cloud
   */
  async deploy(options = {}) {
    const deploymentConfig = {
      region: options.region || this.config.deployment.region,
      environment: options.environment || this.config.deployment.environment,
      instanceType: options.instanceType || this.config.deployment.instanceType,
      autoScaling: options.autoScaling || this.config.deployment.autoScaling,
      build: options.build || this.config.build
    };

    try {
      const response = await this.client.post('/deployments', deploymentConfig);
      return response;
    } catch (error) {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId) {
    try {
      const response = await this.client.get(`/deployments/${deploymentId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to get deployment status: ${error.message}`);
    }
  }

  /**
   * List all deployments
   */
  async listDeployments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/deployments?${queryParams}` : '/deployments';
      const response = await this.client.get(url);
      return response;
    } catch (error) {
      throw new Error(`Failed to list deployments: ${error.message}`);
    }
  }

  /**
   * Rollback deployment
   */
  async rollback(deploymentId, targetVersion = null) {
    try {
      const response = await this.client.post(`/deployments/${deploymentId}/rollback`, {
        targetVersion
      });
      return response;
    } catch (error) {
      throw new Error(`Rollback failed: ${error.message}`);
    }
  }

  /**
   * Get deployment logs
   */
  async getLogs(deploymentId, options = {}) {
    try {
      const queryParams = new URLSearchParams({
        lines: options.lines || 100,
        follow: options.follow || false,
        ...options
      }).toString();
      const response = await this.client.get(`/deployments/${deploymentId}/logs?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }

  /**
   * Check application health
   */
  async healthCheck(deploymentId) {
    try {
      const response = await this.client.get(`/deployments/${deploymentId}/health`);
      return response;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Scale deployment
   */
  async scale(deploymentId, instanceCount) {
    try {
      const response = await this.client.post(`/deployments/${deploymentId}/scale`, {
        instances: instanceCount
      });
      return response;
    } catch (error) {
      throw new Error(`Scaling failed: ${error.message}`);
    }
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(deploymentId) {
    try {
      const response = await this.client.delete(`/deployments/${deploymentId}`);
      return response;
    } catch (error) {
      throw new Error(`Failed to delete deployment: ${error.message}`);
    }
  }
}

module.exports = TreesitClient;
