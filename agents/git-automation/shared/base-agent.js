/**
 * Base Agent - Rascacielo Digital
 * 
 * Clase base para todos los agentes del sistema
 * Implementa patrones SOLID y Clean Code
 */

const { Logger } = require('./logger');
const { Metrics } = require('./metrics');
const { Config } = require('./config');

class BaseAgent {
  constructor(config) {
    // Validar configuración requerida
    if (!config.name) {
      throw new Error('Agent name is required');
    }

    this.name = config.name;
    this.version = config.version || '1.0.0';
    this.category = config.category;
    this.priority = config.priority;
    this.certifications = config.certifications || [];
    this.enabled = config.enabled !== false;
    this.description = config.description || '';
    
    // Inicializar componentes compartidos
    this.logger = new Logger(this.name);
    this.metrics = new Metrics(this.name);
    this.config = new Config(config.customConfig || {});
    
    // Estado del agente
    this.state = {
      status: 'initialized',
      lastExecution: null,
      lastResult: null
    };
  }

  /**
   * Método principal de ejecución - debe ser implementado por subclases
   */
  async execute(_context) {
    throw new Error(`execute() must be implemented by ${this.name}`);
  }

  /**
   * Validar pre-condiciones antes de ejecutar
   */
  async validate(context) {
    this.logger.debug('Validating preconditions...');
    
    // Validación básica por defecto
    if (!context) {
      return {
        valid: false,
        errors: ['Context is required']
      };
    }

    return {
      valid: true,
      errors: []
    };
  }

  /**
   * Obtener recomendaciones basadas en el análisis
   */
  async getRecommendations(_analysisResult) {
    this.logger.debug('Generating recommendations...');
    return [];
  }

  /**
   * Auto-fix cuando sea posible
   */
  async autoFix(issues) {
    this.logger.debug('Attempting auto-fix...');
    return {
      fixed: [],
      failed: [],
      manual: issues
    };
  }

  /**
   * Obtener metadata del agente
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      category: this.category,
      priority: this.priority,
      certifications: this.certifications,
      description: this.description,
      enabled: this.enabled,
      state: this.state
    };
  }

  /**
   * Obtener estado actual del agente
   */
  getState() {
    return {
      ...this.state,
      metrics: this.metrics.getStats()
    };
  }

  /**
   * Habilitar/deshabilitar agente
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    this.logger.info(`Agent ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Actualizar estado
   */
  _updateState(status, result = null) {
    this.state.status = status;
    this.state.lastExecution = new Date().toISOString();
    this.state.lastResult = result;
  }

  /**
   * Wrapper de ejecución con métricas y logging
   */
  async run(context) {
    if (!this.enabled) {
      this.logger.warn('Agent is disabled, skipping execution');
      return {
        success: false,
        agent: this.name,
        skipped: true,
        reason: 'Agent disabled'
      };
    }

    this.logger.info(`Starting ${this.name}...`);
    this.metrics.startTimer('execution');
    this._updateState('running');

    try {
      // Validar pre-condiciones
      const validation = await this.validate(context);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Ejecutar agente
      const result = await this.execute(context);

      // Registrar éxito
      this.metrics.recordSuccess();
      this._updateState('completed', result);
      this.logger.success(`${this.name} completed successfully`);

      return {
        success: true,
        agent: this.name,
        version: this.version,
        result,
        metrics: this.metrics.getStats(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      // Registrar fallo
      this.metrics.recordFailure(error);
      this._updateState('failed', error);
      this.logger.error(`${this.name} failed:`, error.message);

      return {
        success: false,
        agent: this.name,
        version: this.version,
        error: {
          message: error.message,
          stack: error.stack
        },
        metrics: this.metrics.getStats(),
        timestamp: new Date().toISOString()
      };
    } finally {
      this.metrics.stopTimer('execution');
    }
  }

  /**
   * Reset del agente
   */
  reset() {
    this.metrics.reset();
    this.state = {
      status: 'initialized',
      lastExecution: null,
      lastResult: null
    };
    this.logger.info('Agent reset');
  }
}

module.exports = BaseAgent;
