/**
 * Tests for Index (Main Application) - Rascacielos Digital
 */

const RascacielosDigital = require('../index');

describe('RascacielosDigital', () => {
  let app;

  beforeEach(() => {
    app = new RascacielosDigital();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create app with default config', () => {
      // Jest sets NODE_ENV to 'test', so we check for that or 'development'
      const env = app.config.get('environment');
      expect(['development', 'test']).toContain(env);
      expect(app.config.get('port')).toBe(3000);
    });

    test('should create app with custom config', () => {
      const customApp = new RascacielosDigital({
        environment: 'production',
        port: 8080
      });

      expect(customApp.config.get('environment')).toBe('production');
      expect(customApp.config.get('port')).toBe(8080);
    });

    test('should load all agents', () => {
      expect(app.agents.build).toBeDefined();
      expect(app.agents.security).toBeDefined();
      expect(app.agents.test).toBeDefined();
      expect(app.agents.deploy).toBeDefined();
      expect(app.agents.monitor).toBeDefined();
    });
  });

  describe('initialize', () => {
    test('should initialize successfully', async () => {
      const result = await app.initialize();
      expect(result).toBe(true);
    });
  });

  describe('start', () => {
    test('should start the application', async () => {
      const result = await app.start();
      expect(result).toBe(app);
    });
  });

  describe('runBuild', () => {
    test('should run build agent successfully', async () => {
      const result = await app.runBuild({ source: './src' });

      expect(result.success).toBe(true);
      expect(result.artifacts).toBeDefined();
    });

    test('should throw error when build fails', async () => {
      app.agents.build.build = jest.fn().mockRejectedValue(new Error('Build failed'));

      await expect(app.runBuild()).rejects.toThrow('Build failed');
    });
  });

  describe('runSecurity', () => {
    test('should run security agent successfully', async () => {
      // Create agent without failOnHigh to avoid throwing
      app.agents.security.config.failOnHigh = false;
      const result = await app.runSecurity({ target: './src' });

      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
    });

    test('should throw error when security scan fails', async () => {
      app.agents.security.scan = jest.fn().mockRejectedValue(new Error('Scan failed'));

      await expect(app.runSecurity()).rejects.toThrow('Scan failed');
    });
  });

  describe('runTests', () => {
    test('should run test agent successfully', async () => {
      const result = await app.runTests({ suites: ['unit'] });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    });

    test('should throw error when tests fail', async () => {
      app.agents.test.runTests = jest.fn().mockRejectedValue(new Error('Tests failed'));

      await expect(app.runTests()).rejects.toThrow('Tests failed');
    });
  });

  describe('runDeploy', () => {
    test('should run deploy agent successfully', async () => {
      const result = await app.runDeploy({ environment: 'development', version: 'v1.0.0' });

      expect(result.success).toBe(true);
      expect(result.environment).toBe('development');
    });

    test('should throw error when deployment fails', async () => {
      app.agents.deploy.deploy = jest.fn().mockRejectedValue(new Error('Deploy failed'));

      await expect(app.runDeploy()).rejects.toThrow('Deploy failed');
    });
  });

  describe('runMonitor', () => {
    test('should run monitor agent successfully', async () => {
      const result = await app.runMonitor({ metrics: ['cpu'] });

      expect(result.success).toBe(true);
      expect(result.watching).toBe(true);
    });

    test('should throw error when monitoring fails', async () => {
      app.agents.monitor.watch = jest.fn().mockRejectedValue(new Error('Monitor failed'));

      await expect(app.runMonitor()).rejects.toThrow('Monitor failed');
    });
  });
});
