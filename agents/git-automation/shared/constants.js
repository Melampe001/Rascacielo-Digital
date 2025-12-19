/**
 * Constants - Rascacielo Digital
 * 
 * Constantes globales para el sistema de agentes
 */

module.exports = {
  // Prioridades de agentes
  PRIORITY: {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },

  // Categorías de agentes
  CATEGORY: {
    CORE_REVIEW: '1-core-review',
    DEVELOPMENT: '2-development',
    SECURITY: '3-security',
    DOCUMENTATION: '4-documentation',
    TRANSFORMATION: '5-transformation',
    PRODUCTION: '6-production'
  },

  // Niveles de severidad
  SEVERITY: {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    INFO: 'info'
  },

  // Estados de ejecución
  STATUS: {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    SKIPPED: 'skipped'
  },

  // Certificaciones aplicadas
  CERTIFICATIONS: [
    'ISO/IEC 25010',
    'OWASP Top 10',
    'Clean Code',
    'SOLID Principles',
    'Security Best Practices'
  ],

  // Configuración de cobertura
  COVERAGE: {
    MINIMUM: 80,
    TARGET: 90,
    EXCELLENT: 95
  }
};
