/**
 * Tests for Orchestrator Agent
 */

const OrchestratorAgent = require('../orchestrator-agent');

// Mock agents
class MockBuildAgent {
  async build() {
    return { success: true, artifacts: ['file1.js', 'file2.js'] };
  }
  
  async rollback() {
    return { success: true };
  }
}

class MockSecurityAgent {
  async scan() {
    return { success: true, vulnerabilities: 0 };
  }
  
  async rollback() {
    return { success: true };
  }
}

class MockDeployAgent {
  async deploy() {
    return { success: true, url: 'https://example.com' };
  }
  
  async rollback() {
    return { success: true };
  }
}

class MockFailingAgent {
  async fail() {
    throw new Error('Simulated failure');
  }
}

describe('OrchestratorAgent', () => {
  let orchestrator;
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    orchestrator = new OrchestratorAgent({
      agents: {
        build: new MockBuildAgent(),
        security: new MockSecurityAgent(),
        deploy: new MockDeployAgent()
      },
      logger: mockLogger
    });
  });

  describe('Constructor', () => {
    test('should initialize with default config', () => {
      const agent = new OrchestratorAgent();
      expect(agent.config).toBeDefined();
      expect(agent.config.agents).toEqual({});
      expect(agent.results).toEqual([]);
    });

    test('should initialize with custom config', () => {
      expect(orchestrator.config.agents).toBeDefined();
      expect(orchestrator.config.logger).toBe(mockLogger);
    });
  });

  describe('executeAgent', () => {
    test('should execute single agent successfully', async () => {
      const result = await orchestrator.executeAgent('build', 'build');
      
      expect(result.success).toBe(true);
      expect(result.agent).toBe('build');
      expect(result.method).toBe('build');
      expect(result.result).toBeDefined();
    });

    test('should handle agent not found', async () => {
      const result = await orchestrator.executeAgent('nonexistent', 'build');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should handle agent method error', async () => {
      orchestrator.config.agents.failing = new MockFailingAgent();
      const result = await orchestrator.executeAgent('failing', 'fail');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Simulated failure');
    });
  });

  describe('executeSequential', () => {
    test('should execute pipeline sequentially', async () => {
      const pipeline = [
        { name: 'build', agent: 'build', method: 'build' },
        { name: 'security', agent: 'security', method: 'scan' }
      ];

      const report = await orchestrator.executeSequential(pipeline);

      expect(report.status).toBe('SUCCESS');
      expect(report.summary.total).toBe(2);
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(0);
    });

    test('should stop on error when continueOnError is false', async () => {
      orchestrator.config.agents.failing = new MockFailingAgent();
      orchestrator.config.continueOnError = false;

      const pipeline = [
        { name: 'build', agent: 'build', method: 'build' },
        { name: 'failing', agent: 'failing', method: 'fail' },
        { name: 'security', agent: 'security', method: 'scan' }
      ];

      const report = await orchestrator.executeSequential(pipeline, { autoRollback: false });

      expect(report.status).toBe('FAILED');
      expect(report.summary.total).toBe(2); // Should stop after failing step
    });

    test('should continue on error when continueOnError is true', async () => {
      orchestrator.config.agents.failing = new MockFailingAgent();
      orchestrator.config.continueOnError = true;

      const pipeline = [
        { name: 'build', agent: 'build', method: 'build' },
        { name: 'failing', agent: 'failing', method: 'fail' },
        { name: 'security', agent: 'security', method: 'scan' }
      ];

      const report = await orchestrator.executeSequential(pipeline, { autoRollback: false });

      expect(report.summary.total).toBe(3); // Should execute all steps
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(1);
    });
  });

  describe('executeParallel', () => {
    test('should execute agents in parallel', async () => {
      const agentConfigs = [
        { agent: 'build', method: 'build' },
        { agent: 'security', method: 'scan' }
      ];

      const report = await orchestrator.executeParallel(agentConfigs);

      expect(report.status).toBe('SUCCESS');
      expect(report.summary.total).toBe(2);
      expect(report.summary.successful).toBe(2);
    });

    test('should handle parallel execution with failures', async () => {
      orchestrator.config.agents.failing = new MockFailingAgent();

      const agentConfigs = [
        { agent: 'build', method: 'build' },
        { agent: 'failing', method: 'fail' },
        { agent: 'security', method: 'scan' }
      ];

      const report = await orchestrator.executeParallel(agentConfigs);

      expect(report.summary.total).toBe(3);
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(1);
    });
  });

  describe('executeFastPipeline', () => {
    test('should execute fast pipeline (build + deploy)', async () => {
      const report = await orchestrator.executeFastPipeline();

      expect(report.status).toBe('SUCCESS');
      expect(report.mode).toBe('sequential');
      expect(report.summary.total).toBe(2);
    });
  });

  describe('executeFullPipeline', () => {
    test('should execute full pipeline when maintenance agent exists', async () => {
      // Add mock maintenance agent
      class MockMaintenanceAgent {
        async maintain() {
          return { success: true };
        }
      }
      
      orchestrator.config.agents.maintenance = new MockMaintenanceAgent();
      const report = await orchestrator.executeFullPipeline();

      expect(report.status).toBe('SUCCESS');
      expect(report.mode).toBe('sequential');
    });
  });

  describe('rollback', () => {
    test('should rollback successful steps in reverse order', async () => {
      const rollbackSpy = jest.spyOn(orchestrator.config.agents.build, 'rollback');
      
      const results = [
        { step: 'build', agent: 'build', success: true, result: {} },
        { step: 'deploy', agent: 'deploy', success: true, result: {} }
      ];

      await orchestrator.rollback(results);

      expect(rollbackSpy).toHaveBeenCalled();
    });

    test('should skip steps without rollback method', async () => {
      class NoRollbackAgent {
        async execute() {
          return { success: true };
        }
      }

      orchestrator.config.agents.norollback = new NoRollbackAgent();
      
      const results = [
        { step: 'norollback', agent: 'norollback', success: true, result: {} }
      ];

      // Should not throw error
      await expect(orchestrator.rollback(results)).resolves.not.toThrow();
    });
  });

  describe('generateReport', () => {
    test('should generate comprehensive report', () => {
      const results = [
        { step: 'build', success: true, duration: 100 },
        { step: 'security', success: true, duration: 200 },
        { step: 'deploy', success: false, error: 'Failed' }
      ];

      orchestrator.startMetrics();
      orchestrator.endMetrics();

      const report = orchestrator.generateReport('sequential', results);

      expect(report.mode).toBe('sequential');
      expect(report.summary.total).toBe(3);
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(1);
      expect(report.summary.successRate).toBe('66.67%');
      expect(report.status).toBe('FAILED');
    });

    test('should calculate success rate correctly', () => {
      const results = [
        { step: 'build', success: true },
        { step: 'security', success: true },
        { step: 'deploy', success: true }
      ];

      const report = orchestrator.generateReport('sequential', results);

      expect(report.summary.successRate).toBe('100.00%');
      expect(report.status).toBe('SUCCESS');
    });
  });

  describe('getStatus', () => {
    test('should return status before execution', () => {
      const status = orchestrator.getStatus();

      expect(status.running).toBe(false);
      expect(status.completed).toBe(false);
      expect(status.results).toBe(0);
    });

    test('should return status during execution', () => {
      orchestrator.startMetrics();
      const status = orchestrator.getStatus();

      expect(status.running).toBe(true);
      expect(status.completed).toBe(false);
    });

    test('should return status after execution', () => {
      orchestrator.startMetrics();
      orchestrator.endMetrics();
      const status = orchestrator.getStatus();

      expect(status.running).toBe(false);
      expect(status.completed).toBe(true);
      expect(status.duration).toBeDefined();
    });
  });

  describe('metrics', () => {
    test('should collect execution metrics', async () => {
      const pipeline = [
        { name: 'build', agent: 'build', method: 'build' }
      ];

      await orchestrator.executeSequential(pipeline);

      expect(orchestrator.metrics.startTime).toBeDefined();
      expect(orchestrator.metrics.endTime).toBeDefined();
      expect(orchestrator.metrics.duration).toBeGreaterThan(0);
    });
  });

  describe('getAgent', () => {
    test('should return agent by name', () => {
      const agent = orchestrator.getAgent('build');
      expect(agent).toBeInstanceOf(MockBuildAgent);
    });

    test('should return undefined for non-existent agent', () => {
      const agent = orchestrator.getAgent('nonexistent');
      expect(agent).toBeUndefined();
    });
  });
});
