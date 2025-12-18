/**
 * Rascacielos Digital - Entry Point
 *
 * Sistema de desarrollo arquitectónico modular con agentes especializados
 */

const { Logger, Config } = require('./modules/core');
const BuildAgent = require('./agents/build-agent');
const SecurityAgent = require('./agents/security-agent');

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
  }

  initialize() {
    this.logger.info('Inicializando Rascacielos Digital...');
    this.logger.info(`Ambiente: ${this.config.get('environment')}`);
    this.logger.info(`Puerto: ${this.config.get('port')}`);

    // Verificar agentes disponibles
    const agentCount = Object.keys(this.agents).length;
    this.logger.info(`Agentes cargados: ${agentCount}`);

    return Promise.resolve(true);
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

  async start() {
    await this.initialize();

    this.logger.info('='.repeat(50));
    this.logger.info('Rascacielos Digital está listo');
    this.logger.info('Sistema modular con agentes especializados');
    this.logger.info('='.repeat(50));

    return this;
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  const app = new RascacielosDigital();

  app
    .start()
    .then(async instance => {
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
