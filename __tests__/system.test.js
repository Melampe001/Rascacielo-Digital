/**
 * Basic tests for Rascacielos Digital
 */

const RascacielosDigital = require('../index.js');
const { Logger, Config, Utils } = require('../modules/core.js');
const BuildAgent = require('../agents/build-agent.js');
const SecurityAgent = require('../agents/security-agent.js');

describe('Rascacielos Digital', () => {
  describe('System Initialization', () => {
    test('should create an instance', () => {
      const app = new RascacielosDigital();
      expect(app).toBeDefined();
      expect(app).toBeInstanceOf(RascacielosDigital);
    });

    test('should initialize successfully', async () => {
      const app = new RascacielosDigital();
      const result = await app.initialize();
      expect(result).toBe(true);
    });

    test('should have agents loaded', () => {
      const app = new RascacielosDigital();
      expect(app.agents).toBeDefined();
      expect(app.agents.build).toBeInstanceOf(BuildAgent);
      expect(app.agents.security).toBeInstanceOf(SecurityAgent);
    });
  });

  describe('Core Modules', () => {
    test('Logger should work correctly', () => {
      const logger = new Logger('Test');
      expect(logger).toBeDefined();
      expect(logger.namespace).toBe('Test');
    });

    test('Config should work correctly', () => {
      const config = new Config({ test: 'value' });
      expect(config.get('test')).toBe('value');
      expect(config.get('nonexistent', 'default')).toBe('default');
    });

    test('Utils should provide helper functions', () => {
      expect(Utils.generateId()).toBeDefined();
      expect(typeof Utils.generateId()).toBe('string');
      expect(Utils.isValidEmail('test@example.com')).toBe(true);
      expect(Utils.isValidEmail('invalid')).toBe(false);
    });
  });

  describe('Build Agent', () => {
    test('should create a build agent instance', () => {
      const agent = new BuildAgent();
      expect(agent).toBeDefined();
      expect(agent).toBeInstanceOf(BuildAgent);
    });

    test('should execute build successfully', async () => {
      const agent = new BuildAgent();
      const result = await agent.build({ source: './src' });
      expect(result.success).toBe(true);
      expect(result.projectType).toBeDefined();
      expect(result.artifacts).toBeDefined();
    });
  });

  describe('Security Agent', () => {
    test('should create a security agent instance', () => {
      const agent = new SecurityAgent();
      expect(agent).toBeDefined();
      expect(agent).toBeInstanceOf(SecurityAgent);
    });

    test('should execute security scan successfully', async () => {
      const agent = new SecurityAgent({ failOnHigh: false });
      const result = await agent.scan({ target: './src' });
      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
    });
  });
});
