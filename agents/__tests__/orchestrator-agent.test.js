/**
 * Orchestrator Agent Tests
 */

const OrchestratorAgent = require('../orchestrator-agent');
const BuildAgent = require('../build-agent');
const SecurityAgent = require('../security-agent');
const DeployAgent = require('../deploy-agent');
const fs = require('fs');
const path = require('path');

// Mock the agents
jest.mock('../build-agent');
jest.mock('../security-agent');
jest.mock('../deploy-agent');

describe('OrchestratorAgent', () => {
  let orchestrator;
  let mockBuildAgent;
  let mockSecurityAgent;
  let mockDeployAgent;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    mockBuildAgent = {
      build: jest.fn().mockResolvedValue({
        success: true,
        duration: 1000,
        artifacts: ['dist/bundle.js'],
        projectType: 'javascript'
      })
    };

    mockSecurityAgent = {
      scan: jest.fn().mockResolvedValue({
        success: true,
        duration: 500,
        summary: { critical: 0, high: 0, moderate: 2, low: 1, total: 3 }
      })
    };

    mockDeployAgent = {
      deploy: jest.fn().mockResolvedValue({
        success: true,
        deploymentId: 'deploy-123',
        duration: 2000,
        status: { status: 'success' },
        health: { healthy: true }
      }),
      rollback: jest.fn().mockResolvedValue({
        success: true
      })
    };

    BuildAgent.mockImplementation(() => mockBuildAgent);
    SecurityAgent.mockImplementation(() => mockSecurityAgent);
    DeployAgent.mockImplementation(() => mockDeployAgent);

    orchestrator = new OrchestratorAgent({
      reportDir: './test-reports'
    });
  });

  afterEach(() => {
    // Clean up test reports
    if (fs.existsSync('./test-reports')) {
      fs.rmSync('./test-reports', { recursive: true, force: true });
    }
  });

  describe('Constructor', () => {
    test('should create orchestrator with default config', () => {
      expect(orchestrator).toBeDefined();
      expect(orchestrator.config.timeout).toBe(300000);
      expect(orchestrator.config.dryRun).toBe(false);
      expect(orchestrator.agents.build).toBeDefined();
      expect(orchestrator.agents.security).toBeDefined();
      expect(orchestrator.agents.deploy).toBeDefined();
    });

    test('should accept custom config', () => {
      const customOrchestrator = new OrchestratorAgent({
        timeout: 60000,
        dryRun: true,
        reportDir: './custom-reports'
      });

      expect(customOrchestrator.config.timeout).toBe(60000);
      expect(customOrchestrator.config.dryRun).toBe(true);
      expect(customOrchestrator.config.reportDir).toBe('./custom-reports');
    });

    test('should check for maintenance script availability', () => {
      expect(typeof orchestrator.hasMaintenanceAgent).toBe('boolean');
    });
  });

  describe('executeSequential', () => {
    test('should execute tasks in sequence successfully', async () => {
      const tasks = [
        {
          name: 'task1',
          description: 'First task',
          handler: jest.fn().mockResolvedValue({ result: 'task1' })
        },
        {
          name: 'task2',
          description: 'Second task',
          handler: jest.fn().mockResolvedValue({ result: 'task2' })
        }
      ];

      await orchestrator.executeSequential(tasks);

      expect(tasks[0].handler).toHaveBeenCalled();
      expect(tasks[1].handler).toHaveBeenCalled();
      expect(orchestrator.results).toHaveLength(2);
      expect(orchestrator.results[0].status).toBe('success');
      expect(orchestrator.results[1].status).toBe('success');
    });

    test('should stop execution on task failure', async () => {
      const tasks = [
        {
          name: 'task1',
          description: 'First task',
          handler: jest.fn().mockResolvedValue({ result: 'task1' })
        },
        {
          name: 'task2',
          description: 'Failing task',
          handler: jest.fn().mockRejectedValue(new Error('Task failed'))
        },
        {
          name: 'task3',
          description: 'Third task',
          handler: jest.fn().mockResolvedValue({ result: 'task3' })
        }
      ];

      await expect(orchestrator.executeSequential(tasks)).rejects.toThrow('Task failed');

      expect(tasks[0].handler).toHaveBeenCalled();
      expect(tasks[1].handler).toHaveBeenCalled();
      expect(tasks[2].handler).not.toHaveBeenCalled();
      expect(orchestrator.results).toHaveLength(2);
      expect(orchestrator.results[0].status).toBe('success');
      expect(orchestrator.results[1].status).toBe('failed');
    });

    test('should capture metrics during execution', async () => {
      const tasks = [
        {
          name: 'task1',
          description: 'Task with metrics',
          handler: jest.fn().mockResolvedValue({ result: 'task1' })
        }
      ];

      await orchestrator.executeSequential(tasks);

      expect(orchestrator.metrics.cpu.length).toBeGreaterThan(0);
      expect(orchestrator.metrics.memory.length).toBeGreaterThan(0);
    });
  });

  describe('executeParallel', () => {
    test('should execute tasks in parallel successfully', async () => {
      const tasks = [
        {
          name: 'task1',
          description: 'First task',
          handler: jest.fn().mockResolvedValue({ result: 'task1' })
        },
        {
          name: 'task2',
          description: 'Second task',
          handler: jest.fn().mockResolvedValue({ result: 'task2' })
        }
      ];

      await orchestrator.executeParallel(tasks);

      expect(tasks[0].handler).toHaveBeenCalled();
      expect(tasks[1].handler).toHaveBeenCalled();
      expect(orchestrator.results).toHaveLength(2);
      expect(orchestrator.results[0].status).toBe('success');
      expect(orchestrator.results[1].status).toBe('success');
    });

    test('should fail if any parallel task fails', async () => {
      const tasks = [
        {
          name: 'task1',
          description: 'First task',
          handler: jest.fn().mockResolvedValue({ result: 'task1' })
        },
        {
          name: 'task2',
          description: 'Failing task',
          handler: jest.fn().mockRejectedValue(new Error('Task failed'))
        }
      ];

      await expect(orchestrator.executeParallel(tasks)).rejects.toThrow();

      expect(tasks[0].handler).toHaveBeenCalled();
      expect(tasks[1].handler).toHaveBeenCalled();
    });
  });

  describe('executeFastPipeline', () => {
    test('should execute fast pipeline successfully', async () => {
      const result = await orchestrator.executeFastPipeline();

      expect(mockBuildAgent.build).toHaveBeenCalled();
      expect(mockDeployAgent.deploy).toHaveBeenCalled();
      expect(mockSecurityAgent.scan).not.toHaveBeenCalled();
      expect(result.summary.successful).toBeGreaterThan(0);
    });

    test('should handle pipeline failure and rollback', async () => {
      mockDeployAgent.deploy.mockRejectedValueOnce(new Error('Deploy failed'));

      await expect(orchestrator.executeFastPipeline()).rejects.toThrow('Deploy failed');

      expect(mockDeployAgent.rollback).not.toHaveBeenCalled(); // No previous deploy to rollback
    });
  });

  describe('executeFullPipeline', () => {
    test('should execute full pipeline successfully', async () => {
      const result = await orchestrator.executeFullPipeline();

      expect(mockSecurityAgent.scan).toHaveBeenCalled();
      expect(mockBuildAgent.build).toHaveBeenCalled();
      expect(mockDeployAgent.deploy).toHaveBeenCalled();
      expect(result.summary.successful).toBeGreaterThan(0);
    });

    test('should execute tasks in correct order', async () => {
      const callOrder = [];
      
      mockSecurityAgent.scan.mockImplementation(async () => {
        callOrder.push('security');
        return { success: true, duration: 100, summary: {} };
      });

      mockBuildAgent.build.mockImplementation(async () => {
        callOrder.push('build');
        return { success: true, duration: 100, artifacts: [] };
      });

      mockDeployAgent.deploy.mockImplementation(async () => {
        callOrder.push('deploy');
        return { success: true, deploymentId: 'test', duration: 100 };
      });

      await orchestrator.executeFullPipeline();

      expect(callOrder.indexOf('security')).toBeLessThan(callOrder.indexOf('build'));
      expect(callOrder.indexOf('build')).toBeLessThan(callOrder.indexOf('deploy'));
    });
  });

  describe('rollback', () => {
    test('should rollback deployment on failure', async () => {
      // Simulate successful deploy then a failure
      await orchestrator.agents.deploy.deploy({ test: true });
      orchestrator.results.push({
        name: 'deploy',
        status: 'success',
        result: { deploymentId: 'deploy-123' }
      });

      const error = new Error('Subsequent task failed');
      await orchestrator.rollback(error);

      expect(mockDeployAgent.rollback).toHaveBeenCalledWith('deploy-123');
    });

    test('should handle rollback errors gracefully', async () => {
      mockDeployAgent.rollback.mockRejectedValueOnce(new Error('Rollback failed'));

      orchestrator.results.push({
        name: 'deploy',
        status: 'success',
        result: { deploymentId: 'deploy-123' }
      });

      await orchestrator.rollback(new Error('Task failed'));

      // Should not throw error
      expect(orchestrator.results.some(r => r.name === 'rollback')).toBe(true);
    });

    test('should not attempt rollback without previous deployment', async () => {
      await orchestrator.rollback(new Error('Some error'));

      expect(mockDeployAgent.rollback).not.toHaveBeenCalled();
    });
  });

  describe('generateReport', () => {
    test('should generate comprehensive report', async () => {
      orchestrator.startTime = Date.now() - 5000;
      orchestrator.results = [
        {
          name: 'build',
          status: 'success',
          duration: 1000,
          description: 'Build task'
        },
        {
          name: 'deploy',
          status: 'success',
          duration: 2000,
          description: 'Deploy task'
        }
      ];

      const report = await orchestrator.generateReport();

      expect(report).toHaveProperty('orchestrator');
      expect(report).toHaveProperty('execution');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('tasks');
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('system');
      expect(report.summary.successful).toBe(2);
      expect(report.summary.failed).toBe(0);
    });

    test('should save report to files', async () => {
      orchestrator.startTime = Date.now();
      orchestrator.results = [
        {
          name: 'test',
          status: 'success',
          duration: 100,
          description: 'Test task'
        }
      ];

      await orchestrator.generateReport();

      const jsonPath = path.join('./test-reports', 'orchestrator-report.json');
      const textPath = path.join('./test-reports', 'orchestrator-report.txt');

      expect(fs.existsSync(jsonPath)).toBe(true);
      expect(fs.existsSync(textPath)).toBe(true);
    });

    test('should calculate metrics correctly', async () => {
      orchestrator.startTime = Date.now();
      orchestrator.metrics.cpu.push(
        { user: 1000, system: 500, timestamp: Date.now() },
        { user: 2000, system: 600, timestamp: Date.now() }
      );
      orchestrator.metrics.memory.push(
        { heapUsed: 10000000, heapTotal: 20000000, rss: 30000000, timestamp: Date.now() },
        { heapUsed: 15000000, heapTotal: 25000000, rss: 35000000, timestamp: Date.now() }
      );

      const report = await orchestrator.generateReport();

      expect(report.metrics.cpu.samples).toBe(2);
      expect(report.metrics.memory.samples).toBe(2);
      expect(report.metrics.cpu.user.avg).toBe(1500);
      expect(report.metrics.memory.heapUsed.max).toBe(15000000);
    });
  });

  describe('executeCustom', () => {
    test('should execute custom task list sequentially', async () => {
      const result = await orchestrator.executeCustom(['build', 'security'], 'sequential');

      expect(mockBuildAgent.build).toHaveBeenCalled();
      expect(mockSecurityAgent.scan).toHaveBeenCalled();
      expect(result.summary.successful).toBe(2);
    });

    test('should execute custom task list in parallel', async () => {
      const result = await orchestrator.executeCustom(['build', 'security'], 'parallel');

      expect(mockBuildAgent.build).toHaveBeenCalled();
      expect(mockSecurityAgent.scan).toHaveBeenCalled();
      expect(result.summary.successful).toBe(2);
    });

    test('should filter invalid task names', async () => {
      const result = await orchestrator.executeCustom(['build', 'invalid', 'security'], 'sequential');

      expect(mockBuildAgent.build).toHaveBeenCalled();
      expect(mockSecurityAgent.scan).toHaveBeenCalled();
      expect(result.summary.successful).toBe(2);
    });

    test('should throw error when no valid tasks provided', async () => {
      await expect(orchestrator.executeCustom(['invalid1', 'invalid2'])).rejects.toThrow(
        'No se encontraron tareas válidas'
      );
    });
  });

  describe('Utility methods', () => {
    test('formatDuration should format milliseconds correctly', () => {
      expect(orchestrator.formatDuration(500)).toContain('0s');
      expect(orchestrator.formatDuration(5000)).toContain('5s');
      expect(orchestrator.formatDuration(65000)).toContain('1m');
      expect(orchestrator.formatDuration(3665000)).toContain('1h');
    });

    test('formatBytes should format bytes correctly', () => {
      expect(orchestrator.formatBytes(100)).toContain('B');
      expect(orchestrator.formatBytes(1024)).toContain('KB');
      expect(orchestrator.formatBytes(1048576)).toContain('MB');
      expect(orchestrator.formatBytes(1073741824)).toContain('GB');
    });

    test('captureMetrics should capture CPU and memory metrics', () => {
      const initialCpuLength = orchestrator.metrics.cpu.length;
      const initialMemLength = orchestrator.metrics.memory.length;

      orchestrator.captureMetrics();

      expect(orchestrator.metrics.cpu.length).toBe(initialCpuLength + 1);
      expect(orchestrator.metrics.memory.length).toBe(initialMemLength + 1);
      expect(orchestrator.metrics.cpu[orchestrator.metrics.cpu.length - 1]).toHaveProperty('user');
      expect(orchestrator.metrics.memory[orchestrator.metrics.memory.length - 1]).toHaveProperty('heapUsed');
    });
  });

  describe('Performance and Timeout', () => {
    test('should respect timeout configuration', async () => {
      const slowOrchestrator = new OrchestratorAgent({
        timeout: 100, // 100ms timeout
        reportDir: './test-reports'
      });

      const slowTask = {
        name: 'slow',
        description: 'Slow task',
        handler: () => new Promise(resolve => setTimeout(() => resolve({ done: true }), 200))
      };

      await expect(slowOrchestrator.executeSequential([slowTask])).rejects.toThrow("Task 'slow' exceeded timeout of 100ms");
    });

    test('should track execution duration', async () => {
      orchestrator.startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const report = await orchestrator.generateReport();
      
      expect(report.execution.duration).toBeGreaterThan(0);
    });
  });

  describe('Error handling', () => {
    test('should handle agent initialization errors gracefully', () => {
      BuildAgent.mockImplementation(() => {
        throw new Error('Agent init failed');
      });

      expect(() => new OrchestratorAgent()).toThrow('Agent init failed');
    });

    test('should include error details in failed task results', async () => {
      const errorMessage = 'Detailed error message';
      const failingTask = {
        name: 'failing',
        description: 'Task that fails',
        handler: jest.fn().mockRejectedValue(new Error(errorMessage))
      };

      await expect(orchestrator.executeSequential([failingTask])).rejects.toThrow();

      const failedResult = orchestrator.results.find(r => r.name === 'failing');
      expect(failedResult.status).toBe('failed');
      expect(failedResult.error).toBe(errorMessage);
      expect(failedResult).toHaveProperty('stack');
    });
  });

  describe('Configuration file support', () => {
    test('should support loading config from .orchestratorrc.json', () => {
      // This is tested in the CLI section, but we verify the orchestrator
      // can be configured programmatically
      const config = {
        timeout: 60000,
        reportDir: './custom-reports',
        dryRun: true
      };

      const customOrchestrator = new OrchestratorAgent(config);

      expect(customOrchestrator.config.timeout).toBe(60000);
      expect(customOrchestrator.config.reportDir).toBe('./custom-reports');
      expect(customOrchestrator.config.dryRun).toBe(true);
    });
  });
});
