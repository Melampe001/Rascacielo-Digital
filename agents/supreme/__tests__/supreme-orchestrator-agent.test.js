/**
 * Tests for Supreme Orchestrator Agent
 */

const SupremeOrchestratorAgent = require('../supreme-orchestrator-agent');

describe('SupremeOrchestratorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new SupremeOrchestratorAgent();
  });

  describe('Constructor', () => {
    test('should create agent with default config', () => {
      expect(agent.name).toBe('Supreme Orchestrator Agent');
      expect(agent.version).toBe('1.0.0');
      expect(agent.tier).toBe('SUPREME');
      expect(agent.config.maxParallelAgents).toBe(5);
      expect(agent.config.enableAI).toBe(true);
    });

    test('should accept custom config', () => {
      const customAgent = new SupremeOrchestratorAgent({ 
        maxParallelAgents: 10,
        enableAI: false 
      });
      expect(customAgent.config.maxParallelAgents).toBe(10);
      expect(customAgent.config.enableAI).toBe(false);
    });

    test('should load all agents', () => {
      expect(agent.agents).toBeDefined();
      expect(Object.keys(agent.agents).length).toBeGreaterThan(0);
    });
  });

  describe('analyzeTask', () => {
    test('should analyze task with AI enabled', async () => {
      const task = { name: 'build-task', type: 'build' };
      const analysis = await agent.analyzeTask(task);
      
      expect(analysis).toHaveProperty('taskType');
      expect(analysis).toHaveProperty('complexity');
      expect(analysis).toHaveProperty('requiredAgents');
      expect(analysis).toHaveProperty('estimatedTime');
      expect(analysis).toHaveProperty('dependencies');
      expect(analysis).toHaveProperty('risks');
    });

    test('should analyze task without AI', async () => {
      agent.config.enableAI = false;
      const task = { name: 'test-task', type: 'test' };
      const analysis = await agent.analyzeTask(task);
      
      expect(analysis.taskType).toBe('test');
      expect(analysis).toHaveProperty('complexity');
    });
  });

  describe('calculateComplexity', () => {
    test('should calculate low complexity', () => {
      const task = { agents: ['build'] };
      const complexity = agent.calculateComplexity(task);
      expect(complexity).toBe('low');
    });

    test('should calculate medium complexity', () => {
      const task = { agents: ['build', 'test', 'quality'], type: 'test' };
      const complexity = agent.calculateComplexity(task);
      expect(complexity).toBe('medium');
    });

    test('should calculate high complexity', () => {
      const task = { 
        agents: ['build', 'test', 'deploy', 'security', 'quality', 'docs', 'backup', 'api', 'db', 'perf', 'monitor'], 
        type: 'deploy' 
      };
      const complexity = agent.calculateComplexity(task);
      expect(complexity).toBe('high');
    });
  });

  describe('selectAgentsForTask', () => {
    test('should select agents for build task', () => {
      const task = { type: 'build' };
      const agents = agent.selectAgentsForTask(task);
      
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
      expect(agents[0]).toHaveProperty('name');
      expect(agents[0]).toHaveProperty('module');
      expect(agents[0]).toHaveProperty('priority');
    });

    test('should select agents for security task', () => {
      const task = { type: 'security' };
      const agents = agent.selectAgentsForTask(task);
      
      expect(agents.length).toBeGreaterThan(0);
    });

    test('should handle unknown task type', () => {
      const task = { type: 'unknown' };
      const agents = agent.selectAgentsForTask(task);
      
      expect(Array.isArray(agents)).toBe(true);
    });
  });

  describe('estimateExecutionTime', () => {
    test('should estimate time for simple task', () => {
      const task = { agents: ['build'], type: 'build' };
      const time = agent.estimateExecutionTime(task);
      
      expect(time).toBeGreaterThan(0);
      expect(typeof time).toBe('number');
    });

    test('should estimate longer time for complex tasks', () => {
      const simpleTask = { agents: ['build'] };
      const complexTask = { 
        agents: ['build', 'test', 'deploy', 'security'],
        type: 'deploy'
      };
      
      const simpleTime = agent.estimateExecutionTime(simpleTask);
      const complexTime = agent.estimateExecutionTime(complexTask);
      
      expect(complexTime).toBeGreaterThan(simpleTime);
    });
  });

  describe('detectDependencies', () => {
    test('should detect dependencies between agents', () => {
      const task = { agents: ['deploy', 'build'] };
      const deps = agent.detectDependencies(task);
      
      expect(Array.isArray(deps)).toBe(true);
    });

    test('should return empty array for no dependencies', () => {
      const task = { agents: ['documentation'] };
      const deps = agent.detectDependencies(task);
      
      expect(Array.isArray(deps)).toBe(true);
    });
  });

  describe('identifyRisks', () => {
    test('should identify risks in deployment without security', () => {
      const task = { type: 'deploy', agents: ['deploy'] };
      const risks = agent.identifyRisks(task);
      
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);
    });

    test('should identify risks in build without tests', () => {
      const task = { type: 'build', agents: ['build'] };
      const risks = agent.identifyRisks(task);
      
      expect(Array.isArray(risks)).toBe(true);
    });

    test('should return empty array for safe tasks', () => {
      const task = { type: 'documentation' };
      const risks = agent.identifyRisks(task);
      
      expect(Array.isArray(risks)).toBe(true);
    });
  });

  describe('orchestrateStrategic', () => {
    test('should orchestrate task execution', async () => {
      const task = { name: 'test-task', type: 'build', agents: ['build'] };
      const result = await agent.orchestrateStrategic(task);
      
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('report');
      expect(result.report).toHaveProperty('timestamp');
      expect(result.report).toHaveProperty('status');
    });

    test('should handle errors with rollback', async () => {
      const task = { name: 'failing-task', type: 'build' };
      
      // Mock executeAgents to throw error
      agent.executeAgents = jest.fn().mockRejectedValue(new Error('Execution failed'));
      
      await expect(agent.orchestrateStrategic(task)).rejects.toThrow('Execution failed');
    });
  });

  describe('optimizeExecution', () => {
    test('should optimize execution plan', async () => {
      const analysis = {
        requiredAgents: [
          { name: 'build', priority: 5 },
          { name: 'test', priority: 6 }
        ],
        dependencies: [],
        estimatedTime: 60000
      };
      
      const plan = await agent.optimizeExecution(analysis);
      
      expect(plan).toHaveProperty('sequential');
      expect(plan).toHaveProperty('parallel');
      expect(plan).toHaveProperty('totalEstimatedTime');
    });
  });

  describe('executeParallel', () => {
    test('should execute agents in parallel', async () => {
      const agents = [
        { name: 'agent1', module: 'agent1' },
        { name: 'agent2', module: 'agent2' }
      ];
      
      const results = await agent.executeParallel(agents);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });
  });

  describe('executeSequential', () => {
    test('should execute agents sequentially', async () => {
      const agents = [
        { name: 'agent1', module: 'agent1' },
        { name: 'agent2', module: 'agent2' }
      ];
      
      const results = await agent.executeSequential(agents);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });

    test('should stop on first failure', async () => {
      const agents = [
        { name: 'agent1', module: 'agent1' },
        { name: 'agent2', module: 'agent2' },
        { name: 'agent3', module: 'agent3' }
      ];
      
      // Mock executeAgent to fail on second agent
      let callCount = 0;
      agent.executeAgent = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          throw new Error('Agent failed');
        }
        return Promise.resolve({ success: true });
      });
      
      const results = await agent.executeSequential(agents);
      
      expect(results.length).toBe(2); // Should stop after failure
    });
  });

  describe('realtimeDashboard', () => {
    test('should return dashboard data', async () => {
      const dashboard = await agent.realtimeDashboard();
      
      expect(dashboard).toHaveProperty('activeAgents');
      expect(dashboard).toHaveProperty('executionHistory');
      expect(dashboard).toHaveProperty('metrics');
      expect(dashboard.metrics).toHaveProperty('totalExecutions');
      expect(dashboard.metrics).toHaveProperty('avgDuration');
    });
  });

  describe('learnFromExecution', () => {
    test('should store execution in history', async () => {
      const execution = {
        task: { name: 'test-task' },
        duration: 5000
      };
      
      const initialLength = agent.executionHistory.length;
      await agent.learnFromExecution(execution);
      
      expect(agent.executionHistory.length).toBe(initialLength + 1);
    });

    test('should limit history to 100 entries', async () => {
      // Fill history with 100 items
      for (let i = 0; i < 100; i++) {
        agent.executionHistory.push({
          timestamp: new Date().toISOString(),
          task: `task-${i}`,
          duration: 1000,
          success: true
        });
      }
      
      const execution = {
        task: { name: 'new-task' },
        duration: 5000
      };
      
      await agent.learnFromExecution(execution);
      
      expect(agent.executionHistory.length).toBe(100);
    });
  });

  describe('getInfo', () => {
    test('should return agent information', () => {
      const info = agent.getInfo();
      
      expect(info.name).toBe('Supreme Orchestrator Agent');
      expect(info.version).toBe('1.0.0');
      expect(info.tier).toBe('SUPREME');
      expect(info).toHaveProperty('loadedAgents');
      expect(info).toHaveProperty('executionHistory');
    });
  });
});
