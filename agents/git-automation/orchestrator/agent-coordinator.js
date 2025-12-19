/**
 * Agent Coordinator - Rascacielo Digital
 * 
 * Orquesta la ejecución de múltiples agentes
 */

const { Logger } = require('../shared/logger');
const { parallelLimit } = require('../shared/utils');

class AgentCoordinator {
  constructor(config = {}) {
    this.agents = new Map();
    this.executionQueue = [];
    this.logger = new Logger('AgentCoordinator');
    this.config = {
      maxConcurrent: config.maxConcurrent || 5,
      stopOnError: config.stopOnError || false,
      enableMetrics: config.enableMetrics !== false
    };
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0
    };
  }

  /**
   * Registra un agente
   */
  registerAgent(agent) {
    if (!agent || !agent.name) {
      throw new Error('Invalid agent: must have a name');
    }

    this.agents.set(agent.name, agent);
    this.logger.info(`Agent registered: ${agent.name}`);
  }

  /**
   * Registra múltiples agentes
   */
  registerAgents(agents) {
    for (const agent of agents) {
      this.registerAgent(agent);
    }
  }

  /**
   * Obtiene un agente por nombre
   */
  getAgent(name) {
    return this.agents.get(name);
  }

  /**
   * Lista todos los agentes registrados
   */
  listAgents() {
    return Array.from(this.agents.values()).map(agent => agent.getMetadata());
  }

  /**
   * Ejecuta un workflow completo
   */
  async executeWorkflow(workflow, context) {
    this.logger.info(`Starting workflow: ${workflow.name || 'unnamed'}`);
    const startTime = Date.now();
    const results = {};

    try {
      for (const stage of workflow.stages) {
        this.logger.info(`Executing stage: ${stage.name}`);
        
        const stageResults = await this._executeStage(stage, {
          ...context,
          previousResults: results
        });
        
        results[stage.name] = stageResults;

        // Verificar si hay fallos críticos
        if (this.config.stopOnError && this._hasFailures(stageResults)) {
          this.logger.error(`Stage ${stage.name} had failures, stopping workflow`);
          break;
        }
      }

      const duration = Date.now() - startTime;
      this.logger.success(`Workflow completed in ${duration}ms`);

      return {
        success: true,
        workflow: workflow.name,
        results,
        duration,
        metrics: this.getMetrics()
      };

    } catch (error) {
      this.logger.error('Workflow failed:', error);
      return {
        success: false,
        workflow: workflow.name,
        error: error.message,
        results,
        metrics: this.getMetrics()
      };
    }
  }

  /**
   * Ejecuta un stage del workflow
   */
  async _executeStage(stage, context) {
    const agents = stage.agents
      .map(name => this.agents.get(name))
      .filter(agent => agent && agent.enabled);

    if (agents.length === 0) {
      this.logger.warn(`No enabled agents found for stage: ${stage.name}`);
      return [];
    }

    this.logger.info(`Executing ${agents.length} agents ${stage.parallel ? 'in parallel' : 'sequentially'}`);

    if (stage.parallel) {
      return await this._executeParallel(agents, context);
    } else {
      return await this._executeSequential(agents, context);
    }
  }

  /**
   * Ejecuta agentes en paralelo
   */
  async _executeParallel(agents, context) {
    const tasks = agents.map(agent => () => this._executeAgent(agent, context));
    return await parallelLimit(tasks, this.config.maxConcurrent);
  }

  /**
   * Ejecuta agentes secuencialmente
   */
  async _executeSequential(agents, context) {
    const results = [];
    
    for (const agent of agents) {
      const result = await this._executeAgent(agent, context);
      results.push(result);
      
      // Actualizar contexto con resultado previo
      context.lastResult = result;
    }
    
    return results;
  }

  /**
   * Ejecuta un agente individual
   */
  async _executeAgent(agent, context) {
    this.metrics.totalExecutions++;
    
    try {
      const result = await agent.run(context);
      
      if (result.success) {
        this.metrics.successfulExecutions++;
      } else {
        this.metrics.failedExecutions++;
      }
      
      return result;
    } catch (error) {
      this.metrics.failedExecutions++;
      return {
        success: false,
        agent: agent.name,
        error: error.message
      };
    }
  }

  /**
   * Verifica si hay fallos en los resultados
   */
  _hasFailures(results) {
    return results.some(result => !result.success && !result.skipped);
  }

  /**
   * Obtiene métricas del coordinador
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalExecutions > 0
        ? Math.round((this.metrics.successfulExecutions / this.metrics.totalExecutions) * 100)
        : 0
    };
  }

  /**
   * Reset del coordinador
   */
  reset() {
    this.executionQueue = [];
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0
    };
    this.logger.info('Coordinator reset');
  }
}

module.exports = AgentCoordinator;
