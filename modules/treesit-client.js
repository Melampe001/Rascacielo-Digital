/**
 * Treesit Cloud Client
 * Handles communication with Treesit Cloud API
 * 
 * Note: Uses Node.js 18+ built-in fetch API
 */

const TreesitCloudConfig = require('../config/treesit-cloud');

class TreesitClient {
  constructor(config) {
    this.config = config || new TreesitCloudConfig();
    this.config.validate();
    
    this.baseURL = this.config.get('endpoint');
    this.headers = {
      'Authorization': `Bearer ${this.config.get('apiKey')}`,
      'X-Project-ID': this.config.get('projectId'),
      'Content-Type': 'application/json'
    };
  }

  async request(method, path, data = null) {
    const url = `${this.baseURL}${path}`;
    
    const options = {
      method,
      headers: this.headers
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Treesit Cloud API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Treesit Client] Request failed:', error.message);
      throw error;
    }
  }

  // Deployment Methods
  async deploy(deploymentConfig) {
    return await this.request('POST', '/deployments', deploymentConfig);
  }

  async getDeploymentStatus(deploymentId) {
    return await this.request('GET', `/deployments/${deploymentId}`);
  }

  async listDeployments() {
    return await this.request('GET', '/deployments');
  }

  async rollback(deploymentId) {
    return await this.request('POST', `/deployments/${deploymentId}/rollback`);
  }

  // Storage Methods
  async uploadFile(filePath, content) {
    return await this.request('POST', '/storage/upload', {
      path: filePath,
      content: Buffer.from(content).toString('base64'),
      bucket: this.config.get('storage').bucket
    });
  }

  async downloadFile(filePath) {
    return await this.request('GET', `/storage/download?path=${filePath}`);
  }

  // Monitoring Methods
  async getMetrics(timeRange = '1h') {
    return await this.request('GET', `/metrics?range=${timeRange}`);
  }

  async getLogs(limit = 100) {
    return await this.request('GET', `/logs?limit=${limit}`);
  }

  // Health Check
  async healthCheck() {
    try {
      const result = await this.request('GET', '/health');
      return { healthy: true, ...result };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = TreesitClient;
