/**
 * Config - Rascacielo Digital
 * 
 * Configuración centralizada para agentes
 */

const { PRIORITY, CATEGORY, CERTIFICATIONS } = require('./constants');

const defaultConfig = {
  // Configuración general
  general: {
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    enableMetrics: true,
    enableCaching: true
  },

  // Configuración de agentes
  agents: {
    maxConcurrent: 5,
    timeout: 300000, // 5 minutos
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Configuración de calidad
  quality: {
    minCoverage: 80,
    maxComplexity: 10,
    maxLinesPerFunction: 50,
    enableAutofix: true
  },

  // Configuración de seguridad
  security: {
    scanOnCommit: true,
    blockOnCritical: true,
    maxVulnerabilities: 0,
    enableEncryption: true
  },

  // Configuración de CI/CD
  cicd: {
    provider: 'github-actions',
    enableParallel: true,
    enableCaching: true,
    stages: ['lint', 'test', 'security', 'build', 'deploy']
  },

  // Prioridades y categorías
  priority: PRIORITY,
  category: CATEGORY,
  certifications: CERTIFICATIONS
};

class Config {
  constructor(customConfig = {}) {
    this.config = this._merge(defaultConfig, customConfig);
  }

  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let current = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  merge(customConfig) {
    this.config = this._merge(this.config, customConfig);
  }

  _merge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._merge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  getAll() {
    return { ...this.config };
  }
}

module.exports = { Config, defaultConfig };
