/**
 * Execution Planner - Rascacielo Digital
 * 
 * Planificador inteligente de ejecución de agentes
 */

const { Logger } = require('../shared/logger');

class ExecutionPlanner {
  constructor() {
    this.logger = new Logger('ExecutionPlanner');
  }

  /**
   * Crea un plan de ejecución basado en el contexto
   */
  async createPlan(context, availableAgents) {
    this.logger.info('Creating execution plan...');

    const plan = {
      phases: [],
      estimatedDuration: 0,
      totalAgents: 0,
      priority: 'normal'
    };

    // Analizar contexto para determinar qué agentes ejecutar
    const analysis = this._analyzeContext(context);

    // Fase 1: Validación y verificación (siempre)
    if (analysis.needsValidation) {
      plan.phases.push({
        name: 'validation',
        agents: this._filterAgentsByCategory(availableAgents, '1-core-review', ['validar', 'verificar']),
        parallel: true,
        critical: true
      });
    }

    // Fase 2: Auditoría de seguridad
    if (analysis.needsSecurity) {
      plan.phases.push({
        name: 'security-audit',
        agents: this._filterAgentsByCategory(availableAgents, '3-security'),
        parallel: true,
        critical: true
      });
    }

    // Fase 3: Análisis de código
    if (analysis.needsCodeReview) {
      plan.phases.push({
        name: 'code-analysis',
        agents: this._filterAgentsByNames(availableAgents, ['auditoria']),
        parallel: false,
        critical: true
      });
    }

    // Fase 4: Correcciones automáticas
    if (analysis.needsFixes) {
      plan.phases.push({
        name: 'auto-fixes',
        agents: this._filterAgentsByNames(availableAgents, ['corregir', 'solucionar']),
        parallel: false,
        critical: false
      });
    }

    // Fase 5: Build y tests
    if (analysis.needsBuild) {
      plan.phases.push({
        name: 'build-and-test',
        agents: this._filterAgentsByNames(availableAgents, ['build', 'tests']),
        parallel: true,
        critical: true
      });
    }

    // Fase 6: Optimización
    if (analysis.needsOptimization) {
      plan.phases.push({
        name: 'optimization',
        agents: this._filterAgentsByNames(availableAgents, ['optimizar', 'limpiar']),
        parallel: false,
        critical: false
      });
    }

    // Fase 7: Documentación
    if (analysis.needsDocumentation) {
      plan.phases.push({
        name: 'documentation',
        agents: this._filterAgentsByCategory(availableAgents, '4-documentation'),
        parallel: true,
        critical: false
      });
    }

    // Calcular estimaciones
    plan.totalAgents = plan.phases.reduce((sum, phase) => sum + phase.agents.length, 0);
    plan.estimatedDuration = this._estimateDuration(plan.phases);

    this.logger.info(`Plan created with ${plan.phases.length} phases and ${plan.totalAgents} agents`);

    return plan;
  }

  /**
   * Analiza el contexto para determinar necesidades
   */
  _analyzeContext(context) {
    return {
      needsValidation: true, // Siempre validar
      needsSecurity: context.changedFiles?.some(f => 
        f.includes('auth') || f.includes('security') || f.includes('config')
      ) || true,
      needsCodeReview: context.type !== 'docs-only',
      needsFixes: context.autofix !== false,
      needsBuild: context.type !== 'docs-only' && context.skipBuild !== true,
      needsOptimization: context.optimize === true,
      needsDocumentation: context.updateDocs !== false
    };
  }

  /**
   * Filtra agentes por categoría
   */
  _filterAgentsByCategory(agents, category, names = null) {
    return agents.filter(agent => {
      const matchesCategory = agent.category === category;
      const matchesNames = !names || names.includes(agent.name.toLowerCase());
      return matchesCategory && matchesNames && agent.enabled;
    });
  }

  /**
   * Filtra agentes por nombres específicos
   */
  _filterAgentsByNames(agents, names) {
    return agents.filter(agent => 
      names.some(name => agent.name.toLowerCase().includes(name)) && agent.enabled
    );
  }

  /**
   * Estima la duración total del plan
   */
  _estimateDuration(phases) {
    let total = 0;
    
    for (const phase of phases) {
      // Estimación base: 30s por agente
      const phaseTime = phase.agents.length * 30000;
      
      // Si es paralelo, el tiempo es el del agente más lento
      // Si es secuencial, el tiempo es la suma
      if (phase.parallel) {
        total += Math.max(phaseTime / phase.agents.length, 30000);
      } else {
        total += phaseTime;
      }
    }
    
    return total;
  }

  /**
   * Optimiza un plan de ejecución
   */
  optimizePlan(plan) {
    this.logger.info('Optimizing execution plan...');

    const optimized = { ...plan };

    // Combinar fases paralelas consecutivas
    const combinedPhases = [];
    let currentParallelPhase = null;

    for (const phase of plan.phases) {
      if (phase.parallel && !phase.critical) {
        if (currentParallelPhase) {
          currentParallelPhase.agents.push(...phase.agents);
        } else {
          currentParallelPhase = { ...phase };
        }
      } else {
        if (currentParallelPhase) {
          combinedPhases.push(currentParallelPhase);
          currentParallelPhase = null;
        }
        combinedPhases.push(phase);
      }
    }

    if (currentParallelPhase) {
      combinedPhases.push(currentParallelPhase);
    }

    optimized.phases = combinedPhases;
    optimized.estimatedDuration = this._estimateDuration(combinedPhases);

    this.logger.success(`Plan optimized: ${plan.phases.length} → ${optimized.phases.length} phases`);

    return optimized;
  }

  /**
   * Valida un plan de ejecución
   */
  validatePlan(plan) {
    const errors = [];

    if (!plan.phases || plan.phases.length === 0) {
      errors.push('Plan must have at least one phase');
    }

    for (const phase of plan.phases || []) {
      if (!phase.agents || phase.agents.length === 0) {
        errors.push(`Phase ${phase.name} has no agents`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = ExecutionPlanner;
