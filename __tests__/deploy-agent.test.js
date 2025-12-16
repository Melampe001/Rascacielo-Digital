/**
 * Tests for Deploy Agent - Rascacielos Digital
 */

const DeployAgent = require('../agents/deploy-agent');

describe('DeployAgent', () => {
  let deployAgent;

  beforeEach(() => {
    deployAgent = new DeployAgent();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create agent with default config', () => {
      expect(deployAgent.config.environment).toBe('development');
      expect(deployAgent.config.autoRollback).toBe(true);
      expect(deployAgent.config.healthCheck).toBe(true);
      expect(deployAgent.config.timeout).toBe(300000);
    });

    test('should create agent with custom config', () => {
      const customAgent = new DeployAgent({
        environment: 'production',
        autoRollback: false,
        healthCheck: false,
        timeout: 600000
      });

      expect(customAgent.config.environment).toBe('production');
      expect(customAgent.config.autoRollback).toBe(false);
      expect(customAgent.config.healthCheck).toBe(false);
      expect(customAgent.config.timeout).toBe(600000);
    });
  });

  describe('deploy', () => {
    test('should complete deployment successfully', async () => {
      const result = await deployAgent.deploy({ version: 'v1.0.0' });

      expect(result.success).toBe(true);
      expect(result.duration).toBeDefined();
      expect(result.environment).toBe('development');
      expect(result.version).toBe('v1.0.0');
    });

    test('should use default version when not specified', async () => {
      const result = await deployAgent.deploy({});

      expect(result.version).toBe('latest');
    });

    test('should use custom environment', async () => {
      const result = await deployAgent.deploy({ environment: 'staging' });

      expect(result.environment).toBe('staging');
    });
  });

  describe('validate', () => {
    test('should validate correct environments', async () => {
      await expect(deployAgent.validate({ environment: 'development' })).resolves.toBe(true);
      await expect(deployAgent.validate({ environment: 'staging' })).resolves.toBe(true);
      await expect(deployAgent.validate({ environment: 'production' })).resolves.toBe(true);
    });

    test('should throw for invalid environment', async () => {
      await expect(deployAgent.validate({ environment: 'invalid' }))
        .rejects.toThrow('Ambiente no válido: invalid');
    });
  });

  describe('preDeployChecks', () => {
    test('should complete pre-deploy checks', async () => {
      const result = await deployAgent.preDeployChecks('development');

      expect(result.allPassed).toBe(true);
      expect(result.checks).toBeDefined();
      expect(result.checks.length).toBeGreaterThan(0);
    });
  });

  describe('executeDeploy', () => {
    test('should execute deployment with steps', async () => {
      const result = await deployAgent.executeDeploy('development', 'v1.0.0');

      expect(result.steps).toBeDefined();
      expect(result.deploymentId).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    test('should have all deployment steps', async () => {
      const result = await deployAgent.executeDeploy('development', 'v1.0.0');

      expect(result.steps.length).toBe(5);
      result.steps.forEach(step => {
        expect(step.status).toBe('completed');
      });
    });
  });

  describe('runHealthCheck', () => {
    test('should return healthy status', async () => {
      const result = await deployAgent.runHealthCheck('development');

      expect(result.healthy).toBe(true);
      expect(result.endpoints).toBeDefined();
      expect(result.services).toBeDefined();
    });
  });

  describe('rollback', () => {
    test('should execute rollback successfully', async () => {
      const result = await deployAgent.rollback('development');

      expect(result.success).toBe(true);
      expect(result.previousVersion).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('listDeployments', () => {
    test('should list recent deployments', async () => {
      const result = await deployAgent.listDeployments('development');

      expect(result.deployments).toBeDefined();
      expect(Array.isArray(result.deployments)).toBe(true);
      expect(result.total).toBeDefined();
    });
  });

  describe('getEnvironmentStatus', () => {
    test('should return environment status', async () => {
      const result = await deployAgent.getEnvironmentStatus('development');

      expect(result.environment).toBe('development');
      expect(result.status).toBe('healthy');
      expect(result.currentVersion).toBeDefined();
      expect(result.lastDeployment).toBeDefined();
      expect(result.uptime).toBeDefined();
    });
  });
});
