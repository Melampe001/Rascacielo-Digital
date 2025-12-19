/**
 * Orchestrator Agent - Rascacielos Digital
 * 
 * Agente especializado en orquestar múltiples agentes y ejecutar pipelines completos
 */

const BuildAgent = require('./build-agent');
const SecurityAgent = require('./security-agent');
const DeployAgent = require('./deploy-agent');

class OrchestratorAgent {
  constructor(config = {}) {
    this.config = {
      parallel: config.parallel !== false,
      failFast: config.failFast !== false,
      verbose: config.verbose || false,
      ...config
    };

    // Inicializar agentes
    this.buildAgent = new BuildAgent(config.build || {});
    this.securityAgent = new SecurityAgent(config.security || {});
    this.deployAgent = new DeployAgent(config.deploy || {});
  }

  /**
   * Ejecuta el pipeline completo de CI/CD
   * @param {Object} params - Parámetros del pipeline
   * @returns {Promise<Object>} - Resultado del pipeline
   */
  async executeFullPipeline(params = {}) {
    const startTime = Date.now();
    const results = {
      build: null,
      security: null,
      deploy: null,
      success: false
    };

    try {
      console.log('[Orchestrator Agent] Iniciando pipeline completo...');

      // Fase 1: Build
      console.log('[Orchestrator Agent] Fase 1: Build');
      results.build = await this.buildAgent.build(params.build || {});
      
      if (!results.build.success) {
        throw new Error('Build falló');
      }

      // Fase 2: Security Scan
      console.log('[Orchestrator Agent] Fase 2: Security Scan');
      results.security = await this.securityAgent.scan(params.security || {});
      
      if (!results.security.success) {
        throw new Error('Security scan falló');
      }

      // Fase 3: Deploy (opcional)
      if (params.deploy !== false) {
        console.log('[Orchestrator Agent] Fase 3: Deploy');
        results.deploy = await this.deployAgent.deploy(params.deploy || {});
        
        if (!results.deploy.success) {
          throw new Error('Deploy falló');
        }
      }

      results.success = true;
      const duration = Date.now() - startTime;
      console.log(`[Orchestrator Agent] Pipeline completado exitosamente en ${duration}ms`);

      return {
        success: true,
        duration,
        results
      };

    } catch (error) {
      console.error('[Orchestrator Agent] Error en pipeline:', error.message);
      
      if (this.config.failFast) {
        throw error;
      }

      return {
        success: false,
        error: error.message,
        results
      };
    }
  }

  /**
   * Ejecuta solo build y security scan
   */
  async executeBuildAndScan(params = {}) {
    console.log('[Orchestrator Agent] Ejecutando build y security scan...');
    
    const buildResult = await this.buildAgent.build(params.build || {});
    const securityResult = await this.securityAgent.scan(params.security || {});

    return {
      success: buildResult.success && securityResult.success,
      build: buildResult,
      security: securityResult
    };
  }

  /**
   * Ejecuta agentes en paralelo
   */
  async executeParallel(agents = []) {
    console.log('[Orchestrator Agent] Ejecutando agentes en paralelo...');
    
    const promises = agents.map(agent => {
      switch (agent.type) {
        case 'build':
          return this.buildAgent.build(agent.params || {});
        case 'security':
          return this.securityAgent.scan(agent.params || {});
        case 'deploy':
          return this.deployAgent.deploy(agent.params || {});
        default:
          throw new Error(`Tipo de agente desconocido: ${agent.type}`);
      }
    });

    const results = await Promise.all(promises);
    return {
      success: results.every(r => r.success),
      results
    };
  }

  /**
   * Obtiene el estado de todos los agentes
   */
  getStatus() {
    return {
      orchestrator: {
        config: this.config,
        available: true
      },
      agents: {
        build: { available: true },
        security: { available: true },
        deploy: { available: true }
      }
    };
  }
}

module.exports = OrchestratorAgent;
