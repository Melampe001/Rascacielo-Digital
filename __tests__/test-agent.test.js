/**
 * Tests for Test Agent - Rascacielos Digital
 */

const TestAgent = require('../agents/test-agent');

describe('TestAgent', () => {
  let testAgent;

  beforeEach(() => {
    testAgent = new TestAgent();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create agent with default config', () => {
      expect(testAgent.config.suites).toEqual(['unit']);
      expect(testAgent.config.coverage).toBe(true);
      expect(testAgent.config.threshold).toBe(80);
    });

    test('should create agent with custom config', () => {
      const customAgent = new TestAgent({
        suites: ['unit', 'integration'],
        coverage: false,
        threshold: 90
      });

      expect(customAgent.config.suites).toEqual(['unit', 'integration']);
      expect(customAgent.config.coverage).toBe(false);
      expect(customAgent.config.threshold).toBe(90);
    });
  });

  describe('runTests', () => {
    test('should complete tests successfully', async () => {
      const result = await testAgent.runTests();

      expect(result.success).toBeDefined();
      expect(result.duration).toBeDefined();
      expect(result.results).toBeDefined();
    });

    test('should include coverage when enabled', async () => {
      const result = await testAgent.runTests();

      expect(result.coverage).toBeDefined();
      expect(result.coverage.percentage).toBeDefined();
    });

    test('should not include coverage when disabled', async () => {
      const agent = new TestAgent({ coverage: false });
      const result = await agent.runTests();

      expect(result.coverage).toBeNull();
    });

    test('should use custom suites from params', async () => {
      const result = await testAgent.runTests({ suites: ['unit', 'e2e'] });

      expect(result.results.suites).toHaveProperty('unit');
      expect(result.results.suites).toHaveProperty('e2e');
    });
  });

  describe('validate', () => {
    test('should validate correct suites', async () => {
      const result = await testAgent.validate({ suites: ['unit', 'integration'] });
      expect(result).toBe(true);
    });

    test('should throw for invalid suite', async () => {
      await expect(testAgent.validate({ suites: ['invalid'] }))
        .rejects.toThrow('Suite no válido: invalid');
    });
  });

  describe('executeSuites', () => {
    test('should execute multiple suites', async () => {
      const result = await testAgent.executeSuites(['unit', 'integration']);

      expect(result.suites).toHaveProperty('unit');
      expect(result.suites).toHaveProperty('integration');
      expect(result.total).toBeGreaterThan(0);
    });

    test('should aggregate test counts', async () => {
      const result = await testAgent.executeSuites(['unit']);

      expect(result.passed).toBeDefined();
      expect(result.failed).toBeDefined();
      expect(result.skipped).toBeDefined();
      expect(result.total).toBe(result.passed + result.failed + result.skipped);
    });
  });

  describe('executeSuite', () => {
    test('should execute unit suite', async () => {
      const result = await testAgent.executeSuite('unit');

      expect(result.total).toBeDefined();
      expect(result.passed).toBeDefined();
      expect(result.failed).toBeDefined();
    });

    test('should return empty results for unknown suite', async () => {
      const result = await testAgent.executeSuite('unknown');

      expect(result.total).toBe(0);
    });
  });

  describe('generateCoverageReport', () => {
    test('should generate coverage report', async () => {
      const result = await testAgent.generateCoverageReport({});

      expect(result.percentage).toBeDefined();
      expect(result.lines).toBeDefined();
      expect(result.branches).toBeDefined();
      expect(result.functions).toBeDefined();
      expect(result.statements).toBeDefined();
    });
  });

  describe('runFile', () => {
    test('should run tests for specific file', async () => {
      const result = await testAgent.runFile('test.js');

      expect(result.file).toBe('test.js');
      expect(result.total).toBeDefined();
      expect(result.passed).toBeDefined();
    });
  });

  describe('watch', () => {
    test('should start watch mode', async () => {
      const result = await testAgent.watch();

      expect(result.watching).toBe(true);
      expect(result.patterns).toBeDefined();
    });

    test('should use custom patterns', async () => {
      const result = await testAgent.watch({ patterns: ['*.spec.js'] });

      expect(result.patterns).toContain('*.spec.js');
    });
  });
});
