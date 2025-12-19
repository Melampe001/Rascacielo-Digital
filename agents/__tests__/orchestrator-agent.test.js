/**
 * Tests for Orchestrator Agent
 */

const OrchestratorAgent = require('../orchestrator-agent');

describe('OrchestratorAgent', () => {
  test('should create orchestrator with config', () => {
    const orchestrator = new OrchestratorAgent({
      parallel: true,
      failFast: true
    });

    expect(orchestrator).toBeDefined();
    expect(orchestrator.config.parallel).toBe(true);
    expect(orchestrator.config.failFast).toBe(true);
  });

  test('should have build, security and deploy agents', () => {
    const orchestrator = new OrchestratorAgent();

    expect(orchestrator.buildAgent).toBeDefined();
    expect(orchestrator.securityAgent).toBeDefined();
    expect(orchestrator.deployAgent).toBeDefined();
  });

  test('should execute full pipeline', async () => {
    const orchestrator = new OrchestratorAgent();
    
    const result = await orchestrator.executeFullPipeline({
      build: {},
      security: {},
      deploy: false
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.results.build).toBeDefined();
    expect(result.results.security).toBeDefined();
  });

  test('should execute build and scan only', async () => {
    const orchestrator = new OrchestratorAgent();
    
    const result = await orchestrator.executeBuildAndScan({
      build: {},
      security: {}
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.build).toBeDefined();
    expect(result.security).toBeDefined();
  });

  test('should get status of all agents', () => {
    const orchestrator = new OrchestratorAgent();
    
    const status = orchestrator.getStatus();

    expect(status).toBeDefined();
    expect(status.orchestrator).toBeDefined();
    expect(status.agents).toBeDefined();
    expect(status.agents.build).toBeDefined();
    expect(status.agents.security).toBeDefined();
    expect(status.agents.deploy).toBeDefined();
  });

  test('should handle pipeline errors when failFast is false', async () => {
    const orchestrator = new OrchestratorAgent({ failFast: false });
    
    // Simular un error en los parámetros
    const result = await orchestrator.executeFullPipeline({
      build: { source: 123 } // Invalid parameter
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should execute agents in parallel', async () => {
    const orchestrator = new OrchestratorAgent();
    
    const agents = [
      { type: 'build', params: {} },
      { type: 'security', params: {} }
    ];

    const result = await orchestrator.executeParallel(agents);

    expect(result).toBeDefined();
    expect(result.results).toHaveLength(2);
  });

  test('should throw error for unknown agent type in parallel execution', async () => {
    const orchestrator = new OrchestratorAgent();
    
    const agents = [
      { type: 'unknown', params: {} }
    ];

    await expect(orchestrator.executeParallel(agents)).rejects.toThrow();
  });
});
