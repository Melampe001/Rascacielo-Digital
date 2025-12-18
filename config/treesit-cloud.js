/**
 * Treesit Cloud Configuration
 * Configuration for Treesit Cloud deployment
 */

module.exports = {
  // API Configuration
  api: {
    baseURL: process.env.TREESIT_API_URL || 'https://api.treesit.cloud',
    version: 'v1',
    timeout: 30000
  },

  // Authentication
  auth: {
    apiKey: process.env.TREESIT_API_KEY || '',
    apiSecret: process.env.TREESIT_API_SECRET || ''
  },

  // Deployment Configuration
  deployment: {
    region: process.env.TREESIT_REGION || 'us-east-1',
    environment: process.env.TREESIT_ENV || 'production',
    instanceType: process.env.TREESIT_INSTANCE_TYPE || 't3.medium',
    autoScaling: {
      enabled: process.env.TREESIT_AUTOSCALING === 'true',
      minInstances: parseInt(process.env.TREESIT_MIN_INSTANCES || '1'),
      maxInstances: parseInt(process.env.TREESIT_MAX_INSTANCES || '10')
    }
  },

  // Build Configuration
  build: {
    dockerfile: 'Dockerfile',
    buildArgs: {},
    context: '.'
  },

  // Health Check Configuration
  healthCheck: {
    enabled: true,
    path: '/health',
    interval: 30,
    timeout: 5,
    retries: 3
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json'
  }
};
