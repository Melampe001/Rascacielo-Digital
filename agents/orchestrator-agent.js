/**
 * Orchestrator Agent - Rascacielo Digital
 * Coordina y orquesta múltiples agentes especializados
 */

const BuildAgent = require('./build-agent');
const SecurityAgent = require('./security-agent');
const DeployAgent = require('./deploy-agent');

class OrchestratorAgent {
  constructor(config = {}) {
    this.name = 'Orchestrator Agent';
    this.version = '1.0.0';
    this.config = {
      verbose: config.verbose || false,
      ...config
    };
    
    // Inicializar agentes
    this.buildAgent = new BuildAgent(config.build || {});
    this.securityAgent = new SecurityAgent(config.security || {});
    this.deployAgent = new DeployAgent(config.deploy || {});
  }

  /**
   * Ejecuta pipeline completo de CI/CD
   */
  async executePipeline(options = {}) {
    console.log('[Orchestrator] Iniciando pipeline completo...\n');
    
    const results = {
      build: null,
      security: null,
      deploy: null,
      success: false
    };

    try {
      // Build
      console.log('[Orchestrator] Fase 1: Build');
      results.build = await this.buildAgent.build(options.build || {});
      console.log('[Orchestrator] ✅ Build completado\n');

      // Security
      console.log('[Orchestrator] Fase 2: Security Scan');
      results.security = await this.securityAgent.scan(options.security || {});
      console.log('[Orchestrator] ✅ Security scan completado\n');

      // Deploy (opcional)
      if (options.deploy !== false) {
        console.log('[Orchestrator] Fase 3: Deploy');
        results.deploy = await this.deployAgent.deploy(options.deploy || {});
        console.log('[Orchestrator] ✅ Deploy completado\n');
      }

      results.success = true;
      console.log('[Orchestrator] 🎉 Pipeline completado exitosamente');
      
      return results;

    } catch (error) {
      console.error('[Orchestrator] ❌ Pipeline falló:', error.message);
      results.error = error.message;
      throw error;
    }
  }

  /**
   * Gestiona PRs automáticamente
   */
  async managePRs(options = {}) {
    console.log('🤖 Iniciando gestión automatizada de PRs...\n');
    
    const PRManagerAgent = require('./pr-manager-agent');
    const prManager = new PRManagerAgent(options);
    
    // Análisis
    await prManager.analyzeAllPRs();
    const report = prManager.generateReport();
    
    // Ejecutar acciones si está habilitado
    if (options.execute) {
      const results = await prManager.executeActions(false);
      return { report, results };
    }
    
    return { report };
  }

  /**
   * Ejecuta solo build
   */
  async build(options = {}) {
    return await this.buildAgent.build(options);
  }

  /**
   * Ejecuta solo security scan
   */
  async securityScan(options = {}) {
    return await this.securityAgent.scan(options);
  }

  /**
   * Ejecuta solo deploy
   */
  async deploy(options = {}) {
    return await this.deployAgent.deploy(options);
  }

  /**
   * Obtiene estado de todos los agentes
   */
  getStatus() {
    return {
      orchestrator: {
        name: this.name,
        version: this.version
      },
      agents: {
        build: {
          name: 'Build Agent',
          available: true
        },
        security: {
          name: 'Security Agent',
          available: true
        },
        deploy: {
          name: 'Deploy Agent',
          available: true
        },
        prManager: {
          name: 'PR Manager Agent',
          available: true
        }
      }
    };
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  (async () => {
    const orchestrator = new OrchestratorAgent({ verbose: true });
    
    console.log('🎭 ORCHESTRATOR AGENT\n');
    
    switch (command) {
    case 'pipeline':
      await orchestrator.executePipeline({ deploy: false });
      break;
      
    case 'build':
      await orchestrator.build();
      break;
      
    case 'security':
      await orchestrator.securityScan();
      break;
      
    case 'deploy':
      await orchestrator.deploy();
      break;
      
    case 'pr-manage': {
      const execute = args.includes('--execute');
      await orchestrator.managePRs({ execute });
      break;
    }
      
    case 'status':
    default: {
      const status = orchestrator.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
    }
    }
  })();
}

module.exports = OrchestratorAgent;
