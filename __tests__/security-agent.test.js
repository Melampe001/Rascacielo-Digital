/**
 * Tests for Security Agent - Rascacielos Digital
 */

const SecurityAgent = require('../agents/security-agent');

describe('SecurityAgent', () => {
  let securityAgent;

  beforeEach(() => {
    securityAgent = new SecurityAgent();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create agent with default config', () => {
      expect(securityAgent.config.level).toBe('moderate');
      expect(securityAgent.config.failOnHigh).toBe(true);
      expect(securityAgent.config.scanDependencies).toBe(true);
      expect(securityAgent.config.scanCode).toBe(true);
    });

    test('should create agent with custom config', () => {
      const customAgent = new SecurityAgent({
        level: 'strict',
        failOnHigh: false,
        scanDependencies: false
      });

      expect(customAgent.config.level).toBe('strict');
      expect(customAgent.config.failOnHigh).toBe(false);
      expect(customAgent.config.scanDependencies).toBe(false);
    });
  });

  describe('scan', () => {
    test('should complete scan successfully', async () => {
      const agent = new SecurityAgent({ failOnHigh: false });
      const result = await agent.scan({ target: './src' });

      expect(result.success).toBe(true);
      expect(result.duration).toBeDefined();
      expect(result.dependencies).toBeDefined();
      expect(result.codeAnalysis).toBeDefined();
      expect(result.summary).toBeDefined();
    });

    test('should skip dependency scan when disabled', async () => {
      const agent = new SecurityAgent({
        scanDependencies: false,
        failOnHigh: false
      });
      const result = await agent.scan({ target: './src' });

      expect(result.dependencies).toBeNull();
    });

    test('should skip code scan when disabled', async () => {
      const agent = new SecurityAgent({
        scanCode: false,
        failOnHigh: false
      });
      const result = await agent.scan({ target: './src' });

      expect(result.codeAnalysis).toBeNull();
    });
  });

  describe('scanDependencies', () => {
    test('should return dependency scan results', async () => {
      const result = await securityAgent.scanDependencies('./src');

      expect(result.total).toBeDefined();
      expect(result.vulnerable).toBeDefined();
      expect(result.vulnerabilities).toBeDefined();
      expect(Array.isArray(result.vulnerabilities)).toBe(true);
    });

    test('should include vulnerability details', async () => {
      const result = await securityAgent.scanDependencies('./src');
      const vuln = result.vulnerabilities[0];

      expect(vuln.package).toBeDefined();
      expect(vuln.version).toBeDefined();
      expect(vuln.severity).toBeDefined();
      expect(vuln.cve).toBeDefined();
    });
  });

  describe('scanCode', () => {
    test('should return code scan results', async () => {
      const result = await securityAgent.scanCode('./src');

      expect(result.files).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should include issue details', async () => {
      const result = await securityAgent.scanCode('./src');
      const issue = result.issues[0];

      expect(issue.file).toBeDefined();
      expect(issue.line).toBeDefined();
      expect(issue.severity).toBeDefined();
      expect(issue.type).toBeDefined();
      expect(issue.message).toBeDefined();
    });
  });

  describe('generateSummary', () => {
    test('should count vulnerabilities by severity', () => {
      const results = {
        dependencies: {
          vulnerabilities: [
            { severity: 'critical' },
            { severity: 'high' },
            { severity: 'high' },
            { severity: 'moderate' }
          ]
        },
        codeAnalysis: {
          issues: [
            { severity: 'high' },
            { severity: 'low' }
          ]
        }
      };

      const summary = securityAgent.generateSummary(results);

      expect(summary.critical).toBe(1);
      expect(summary.high).toBe(3);
      expect(summary.moderate).toBe(1);
      expect(summary.low).toBe(1);
      expect(summary.total).toBe(6);
    });

    test('should handle empty results', () => {
      const results = {
        dependencies: null,
        codeAnalysis: null
      };

      const summary = securityAgent.generateSummary(results);

      expect(summary.critical).toBe(0);
      expect(summary.high).toBe(0);
      expect(summary.moderate).toBe(0);
      expect(summary.low).toBe(0);
      expect(summary.total).toBe(0);
    });
  });

  describe('generateReport', () => {
    test('should generate JSON report', async () => {
      const results = {
        summary: { critical: 0, high: 1, moderate: 2, low: 3, total: 6 }
      };

      const report = await securityAgent.generateReport(results, 'json');
      const parsed = JSON.parse(report);

      expect(parsed.summary.total).toBe(6);
    });

    test('should generate text report', async () => {
      const results = {
        summary: { critical: 0, high: 1, moderate: 2, low: 3, total: 6 }
      };

      const report = await securityAgent.generateReport(results, 'text');

      expect(report).toContain('REPORTE DE SEGURIDAD');
      expect(report).toContain('Total de vulnerabilidades: 6');
    });
  });
});
