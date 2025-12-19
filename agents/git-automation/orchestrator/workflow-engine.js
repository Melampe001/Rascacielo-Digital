/**
 * Workflow Engine - Rascacielo Digital
 * 
 * Motor de ejecución de workflows
 */

const { Logger } = require('../shared/logger');
const AgentCoordinator = require('./agent-coordinator');

class WorkflowEngine {
  constructor(config = {}) {
    this.coordinator = new AgentCoordinator(config.coordinator || {});
    this.logger = new Logger('WorkflowEngine');
    this.workflows = new Map();
    this.config = {
      validateWorkflows: config.validateWorkflows !== false,
      autoRegister: config.autoRegister !== false
    };
  }

  /**
   * Registra un workflow
   */
  registerWorkflow(workflow) {
    if (!this._validateWorkflow(workflow)) {
      throw new Error('Invalid workflow structure');
    }

    this.workflows.set(workflow.name, workflow);
    this.logger.info(`Workflow registered: ${workflow.name}`);
  }

  /**
   * Obtiene un workflow por nombre
   */
  getWorkflow(name) {
    return this.workflows.get(name);
  }

  /**
   * Lista todos los workflows
   */
  listWorkflows() {
    return Array.from(this.workflows.keys());
  }

  /**
   * Ejecuta un workflow por nombre
   */
  async execute(workflowName, context = {}) {
    const workflow = this.workflows.get(workflowName);
    
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    this.logger.info(`Executing workflow: ${workflowName}`);
    return await this.coordinator.executeWorkflow(workflow, context);
  }

  /**
   * Valida la estructura de un workflow
   */
  _validateWorkflow(workflow) {
    if (!workflow.name) {
      this.logger.error('Workflow must have a name');
      return false;
    }

    if (!Array.isArray(workflow.stages) || workflow.stages.length === 0) {
      this.logger.error('Workflow must have at least one stage');
      return false;
    }

    for (const stage of workflow.stages) {
      if (!stage.name) {
        this.logger.error('Stage must have a name');
        return false;
      }

      if (!Array.isArray(stage.agents) || stage.agents.length === 0) {
        this.logger.error(`Stage ${stage.name} must have at least one agent`);
        return false;
      }
    }

    return true;
  }

  /**
   * Obtiene el coordinador de agentes
   */
  getCoordinator() {
    return this.coordinator;
  }

  /**
   * Crea un workflow estándar de revisión de código
   */
  static createCodeReviewWorkflow() {
    return {
      name: 'code-review',
      description: 'Complete code review workflow',
      stages: [
        {
          name: 'validation',
          agents: ['validar', 'verificar'],
          parallel: true
        },
        {
          name: 'analysis',
          agents: ['auditoria'],
          parallel: false
        },
        {
          name: 'fixes',
          agents: ['corregir', 'solucionar'],
          parallel: false
        },
        {
          name: 'refactoring',
          agents: ['refactorizar'],
          parallel: false
        }
      ]
    };
  }

  /**
   * Crea un workflow estándar de desarrollo
   */
  static createDevelopmentWorkflow() {
    return {
      name: 'development',
      description: 'Complete development workflow',
      stages: [
        {
          name: 'cleanup',
          agents: ['limpiar'],
          parallel: false
        },
        {
          name: 'build-and-test',
          agents: ['build', 'tests'],
          parallel: true
        },
        {
          name: 'optimization',
          agents: ['optimizar'],
          parallel: false
        },
        {
          name: 'pipeline',
          agents: ['pipeline'],
          parallel: false
        }
      ]
    };
  }

  /**
   * Crea un workflow estándar de seguridad
   */
  static createSecurityWorkflow() {
    return {
      name: 'security',
      description: 'Complete security workflow',
      stages: [
        {
          name: 'scanning',
          agents: ['bloqueante', 'riesgos'],
          parallel: true
        },
        {
          name: 'hardening',
          agents: ['blindar'],
          parallel: false
        }
      ]
    };
  }

  /**
   * Crea un workflow estándar de producción
   */
  static createProductionWorkflow() {
    return {
      name: 'production',
      description: 'Production deployment workflow',
      stages: [
        {
          name: 'pre-deployment',
          agents: ['sin-desviaciones', 'idempotente'],
          parallel: true
        },
        {
          name: 'deployment',
          agents: ['produccion'],
          parallel: false
        }
      ]
    };
  }
}

module.exports = WorkflowEngine;
