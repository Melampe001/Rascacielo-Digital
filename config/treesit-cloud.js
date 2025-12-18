/**
 * Treesit Cloud Configuration
 * Authorized deployment settings for Rascacielo-Digital
 */

class TreesitCloudConfig {
  constructor() {
    this.config = {
      // Cloud Provider Settings
      provider: 'treesit',
      region: process.env.TREESIT_REGION || 'us-east-1',
      endpoint: process.env.TREESIT_ENDPOINT || 'https://api.treesit.cloud',
      
      // Authentication
      apiKey: process.env.TREESIT_API_KEY,
      secretKey: process.env.TREESIT_SECRET_KEY,
      projectId: process.env.TREESIT_PROJECT_ID,
      
      // Deployment Settings
      environment: process.env.NODE_ENV || 'development',
      autoScale: true,
      minInstances: 1,
      maxInstances: 5,
      
      // Networking
      port: process.env.PORT || 3000,
      enableHTTPS: true,
      customDomain: process.env.CUSTOM_DOMAIN || null,
      
      // Storage
      storage: {
        type: 'treesit-storage',
        bucket: process.env.TREESIT_BUCKET,
        region: process.env.TREESIT_REGION
      },
      
      // Monitoring
      monitoring: {
        enabled: true,
        logLevel: 'info',
        metricsInterval: 60000 // 1 minute
      }
    };
  }

  validate() {
    const required = ['apiKey', 'secretKey', 'projectId'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required Treesit Cloud credentials: ${missing.join(', ')}`);
    }
    
    return true;
  }

  get(key) {
    return this.config[key];
  }

  getAll() {
    // Return config without exposing secrets
    const { apiKey, secretKey, ...safeConfig } = this.config;
    return safeConfig;
  }
}

module.exports = TreesitCloudConfig;
