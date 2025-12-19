/**
 * Git Automation System - Rascacielo Digital
 * 
 * Sistema Imperial de 29 Agentes Especializados
 * Premium Elite Quality - Certificado ISO/IEC 25010, OWASP, Clean Code
 */

const WorkflowEngine = require('./orchestrator/workflow-engine');
const AgentCoordinator = require('./orchestrator/agent-coordinator');
const ExecutionPlanner = require('./orchestrator/execution-planner');

// Importar agentes - Core Review (6)
const AuditoriaAgent = require('./1-core-review/auditoria-agent');
const ValidarAgent = require('./1-core-review/validar-agent');
const VerificarAgent = require('./1-core-review/verificar-agent');
const CorregirAgent = require('./1-core-review/corregir-agent');
const SolucionarAgent = require('./1-core-review/solucionar-agent');
const RefactorizarAgent = require('./1-core-review/refactorizar-agent');

// Importar agentes - Development (7)
const BuildAgent = require('./2-development/build-agent');
const PipelineAgent = require('./2-development/pipeline-agent');
const TestsAgent = require('./2-development/tests-agent');
const OptimizarAgent = require('./2-development/optimizar-agent');
const LimpiarAgent = require('./2-development/limpiar-agent');
const DepurarAgent = require('./2-development/depurar-agent');
const ScriptsAgent = require('./2-development/scripts-agent');

// Importar agentes - Security (3)
const BlindarAgent = require('./3-security/blindar-agent');
const BloqueanteAgent = require('./3-security/bloqueante-agent');
const RiesgosAgent = require('./3-security/riesgos-agent');

// Importar agentes - Documentation (4)
const DocumentarAgent = require('./4-documentation/documentar-agent');
const ReporteTecnicoAgent = require('./4-documentation/reporte-tecnico-agent');
const ResumenAgent = require('./4-documentation/resumen-agent');
const ChecklistAgent = require('./4-documentation/checklist-agent');

// Importar agentes - Transformation (5)
const ActualizarAgent = require('./5-transformation/actualizar-agent');
const MigrarAgent = require('./5-transformation/migrar-agent');
const AdaptarAgent = require('./5-transformation/adaptar-agent');
const ReemplazarAgent = require('./5-transformation/reemplazar-agent');
const CambiarAgent = require('./5-transformation/cambiar-agent');

// Importar agentes - Production (4)
const ProduccionAgent = require('./6-production/produccion-agent');
const IdempotentAgent = require('./6-production/idempotente-agent');
const SinDesviacionesAgent = require('./6-production/sin-desviaciones-agent');
const TrabajarAgent = require('./6-production/trabajar-agent');

/**
 * Sistema de Automatización Git
 */
class GitAutomationSystem {
  constructor(config = {}) {
    this.engine = new WorkflowEngine(config);
    this.planner = new ExecutionPlanner();
    this.agents = {};
    
    // Inicializar todos los agentes
    this._initializeAgents();
    
    // Registrar workflows predefinidos
    this._registerWorkflows();
  }

  /**
   * Inicializa todos los 29 agentes
   */
  _initializeAgents() {
    // Core Review Agents
    this.agents.auditoria = new AuditoriaAgent();
    this.agents.validar = new ValidarAgent();
    this.agents.verificar = new VerificarAgent();
    this.agents.corregir = new CorregirAgent();
    this.agents.solucionar = new SolucionarAgent();
    this.agents.refactorizar = new RefactorizarAgent();

    // Development Agents
    this.agents.build = new BuildAgent();
    this.agents.pipeline = new PipelineAgent();
    this.agents.tests = new TestsAgent();
    this.agents.optimizar = new OptimizarAgent();
    this.agents.limpiar = new LimpiarAgent();
    this.agents.depurar = new DepurarAgent();
    this.agents.scripts = new ScriptsAgent();

    // Security Agents
    this.agents.blindar = new BlindarAgent();
    this.agents.bloqueante = new BloqueanteAgent();
    this.agents.riesgos = new RiesgosAgent();

    // Documentation Agents
    this.agents.documentar = new DocumentarAgent();
    this.agents['reporte-tecnico'] = new ReporteTecnicoAgent();
    this.agents.resumen = new ResumenAgent();
    this.agents.checklist = new ChecklistAgent();

    // Transformation Agents
    this.agents.actualizar = new ActualizarAgent();
    this.agents.migrar = new MigrarAgent();
    this.agents.adaptar = new AdaptarAgent();
    this.agents.reemplazar = new ReemplazarAgent();
    this.agents.cambiar = new CambiarAgent();

    // Production Agents
    this.agents.produccion = new ProduccionAgent();
    this.agents.idempotente = new IdempotentAgent();
    this.agents['sin-desviaciones'] = new SinDesviacionesAgent();
    this.agents.trabajar = new TrabajarAgent();

    // Registrar todos los agentes en el coordinador
    Object.values(this.agents).forEach(agent => {
      this.engine.getCoordinator().registerAgent(agent);
    });
  }

  /**
   * Registra workflows predefinidos
   */
  _registerWorkflows() {
    // Workflow de revisión de código
    this.engine.registerWorkflow(WorkflowEngine.createCodeReviewWorkflow());
    
    // Workflow de desarrollo
    this.engine.registerWorkflow(WorkflowEngine.createDevelopmentWorkflow());
    
    // Workflow de seguridad
    this.engine.registerWorkflow(WorkflowEngine.createSecurityWorkflow());
    
    // Workflow de producción
    this.engine.registerWorkflow(WorkflowEngine.createProductionWorkflow());
    
    // Workflow completo
    this.engine.registerWorkflow({
      name: 'complete',
      description: 'Complete git automation workflow',
      stages: [
        {
          name: 'validation',
          agents: ['validar', 'verificar'],
          parallel: true
        },
        {
          name: 'security-scan',
          agents: ['bloqueante', 'riesgos', 'blindar'],
          parallel: true
        },
        {
          name: 'code-analysis',
          agents: ['auditoria'],
          parallel: false
        },
        {
          name: 'fixes',
          agents: ['corregir', 'solucionar', 'limpiar'],
          parallel: false
        },
        {
          name: 'optimization',
          agents: ['optimizar', 'refactorizar'],
          parallel: false
        },
        {
          name: 'build-test',
          agents: ['build', 'tests'],
          parallel: true
        },
        {
          name: 'documentation',
          agents: ['documentar', 'resumen'],
          parallel: true
        },
        {
          name: 'production-readiness',
          agents: ['sin-desviaciones', 'idempotente', 'produccion'],
          parallel: false
        }
      ]
    });
  }

  /**
   * Ejecuta un workflow específico
   */
  async executeWorkflow(workflowName, context = {}) {
    return await this.engine.execute(workflowName, context);
  }

  /**
   * Ejecuta un agente individual
   */
  async executeAgent(agentName, context = {}) {
    const agent = this.agents[agentName];
    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }
    return await agent.run(context);
  }

  /**
   * Crea un plan de ejecución inteligente
   */
  async createPlan(context = {}) {
    const availableAgents = Object.values(this.agents).map(a => a.getMetadata());
    return await this.planner.createPlan(context, availableAgents);
  }

  /**
   * Lista todos los agentes disponibles
   */
  listAgents() {
    return Object.entries(this.agents).map(([key, agent]) => ({
      key,
      ...agent.getMetadata()
    }));
  }

  /**
   * Lista todos los workflows disponibles
   */
  listWorkflows() {
    return this.engine.listWorkflows();
  }

  /**
   * Obtiene un agente por nombre
   */
  getAgent(name) {
    return this.agents[name];
  }

  /**
   * Obtiene métricas del sistema
   */
  getMetrics() {
    return {
      totalAgents: Object.keys(this.agents).length,
      coordinator: this.engine.getCoordinator().getMetrics(),
      agents: Object.entries(this.agents).map(([key, agent]) => ({
        name: key,
        metrics: agent.metrics.getStats()
      }))
    };
  }
}

// Exportar sistema y componentes
module.exports = {
  GitAutomationSystem,
  WorkflowEngine,
  AgentCoordinator,
  ExecutionPlanner,
  
  // Exportar todos los agentes
  agents: {
    // Core Review
    AuditoriaAgent,
    ValidarAgent,
    VerificarAgent,
    CorregirAgent,
    SolucionarAgent,
    RefactorizarAgent,
    
    // Development
    BuildAgent,
    PipelineAgent,
    TestsAgent,
    OptimizarAgent,
    LimpiarAgent,
    DepurarAgent,
    ScriptsAgent,
    
    // Security
    BlindarAgent,
    BloqueanteAgent,
    RiesgosAgent,
    
    // Documentation
    DocumentarAgent,
    ReporteTecnicoAgent,
    ResumenAgent,
    ChecklistAgent,
    
    // Transformation
    ActualizarAgent,
    MigrarAgent,
    AdaptarAgent,
    ReemplazarAgent,
    CambiarAgent,
    
    // Production
    ProduccionAgent,
    IdempotentAgent,
    SinDesviacionesAgent,
    TrabajarAgent
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  const system = new GitAutomationSystem();
  
  console.log('🚀 Git Automation System - Rascacielo Digital');
  console.log('='.repeat(50));
  console.log(`Total Agents: ${system.listAgents().length}`);
  console.log(`Available Workflows: ${system.listWorkflows().join(', ')}`);
  console.log('='.repeat(50));
  console.log('\nSystem ready! Use the API to execute workflows.\n');
}
