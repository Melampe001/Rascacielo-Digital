/**
 * Rascacielos Digital - Entry Point
 * 
 * Sistema de desarrollo arquitectónico modular con agentes especializados
 */

const { Logger, Config } = require('./modules/core');
const BuildAgent = require('./agents/build-agent');
const SecurityAgent = require('./agents/security-agent');
const { initializeAll: initializeMasters } = require('./agents/masters');

class RascacielosDigital {
  constructor(config = {}) {
    this.logger = new Logger('RascacielosDigital');
    this.config = new Config({
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      ...config
    });
    
    this.agents = {
      build: new BuildAgent(),
      security: new SecurityAgent()
    };
    
    // Inicializar maestros
    this.masters = config.loadMasters !== false ? initializeMasters(config) : {};
  }

  async initialize() {
    this.logger.info('Inicializando Rascacielos Digital...');
    this.logger.info(`Ambiente: ${this.config.get('environment')}`);
    this.logger.info(`Puerto: ${this.config.get('port')}`);
    
    // Verificar agentes disponibles
    const agentCount = Object.keys(this.agents).length;
    this.logger.info(`Agentes cargados: ${agentCount}`);
    
    // Verificar maestros disponibles
    const masterCount = Object.keys(this.masters).length;
    if (masterCount > 0) {
      this.logger.info(`Maestros especializados cargados: ${masterCount}`);
    }
    
    return true;
  }

  async runBuild(params = {}) {
    this.logger.info('Ejecutando Build Agent...');
    try {
      const result = await this.agents.build.build(params);
      this.logger.info('Build completado exitosamente');
      return result;
    } catch (error) {
      this.logger.error('Error en Build Agent:', error.message);
      throw error;
    }
  }

  async runSecurity(params = {}) {
    this.logger.info('Ejecutando Security Agent...');
    try {
      const result = await this.agents.security.scan(params);
      this.logger.info('Análisis de seguridad completado');
      return result;
    } catch (error) {
      this.logger.error('Error en Security Agent:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene un maestro especializado
   * @param {string} name - Nombre del maestro
   * @returns {Object} Instancia del maestro
   */
  getMaster(name) {
    if (!this.masters[name]) {
      throw new Error(`Master "${name}" no encontrado o no cargado`);
    }
    return this.masters[name];
  }

  /**
   * Lista todos los maestros disponibles
   * @returns {Array} Lista de nombres de maestros
   */
  listMasters() {
    return Object.keys(this.masters);
  }

  async start() {
    await this.initialize();
    
    this.logger.info('='.repeat(50));
    this.logger.info('Rascacielos Digital está listo');
    this.logger.info('Sistema modular con agentes especializados');
    if (Object.keys(this.masters).length > 0) {
      this.logger.info(`${Object.keys(this.masters).length} maestros especializados disponibles`);
    }
    this.logger.info('='.repeat(50));
    
    return this;
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  const app = new RascacielosDigital();
  
  app.start()
    .then(async (instance) => {
      // Demostración de agentes
      console.log('\n--- Demostración de Agentes ---\n');
      
      // Build Agent
      await instance.runBuild({ source: './src' });
      
      // Security Agent
      await instance.runSecurity({ target: './src' });
      
      console.log('\n--- Demostración Completada ---\n');
    })
    .catch(error => {
      console.error('Error al iniciar:', error);
      process.exit(1);
    });
}

module.exports = RascacielosDigital;
