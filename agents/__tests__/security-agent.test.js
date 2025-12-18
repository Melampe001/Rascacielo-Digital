/**
 * Security Agent Tests
 */

const SecurityAgent = require('../security-agent');

describe('SecurityAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new SecurityAgent({
      level: 'moderate',
      failOnHigh: false
    });
  });

  test('should create agent with config', () => {
    expect(agent.config.level).toBe('moderate');
    expect(agent.config.failOnHigh).toBe(false);
  });

  test('should scan dependencies', async () => {
    const result = await agent.scanDependencies('./');
    expect(result.total).toBeDefined();
    expect(result.vulnerable).toBeDefined();
    expect(Array.isArray(result.vulnerabilities)).toBe(true);
  });

  test('should scan code', async () => {
    const result = await agent.scanCode('./');
    expect(result.files).toBeDefined();
    expect(Array.isArray(result.issues)).toBe(true);
  });

  test('should generate summary', () => {
    const results = {
      dependencies: {
        vulnerabilities: [
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

    const summary = agent.generateSummary(results);
    expect(summary.high).toBe(2);
    expect(summary.moderate).toBe(1);
    expect(summary.low).toBe(1);
    expect(summary.total).toBe(4);
  });

  test('should run full security scan', async () => {
    const result = await agent.scan({ target: './' });
    expect(result.success).toBe(true);
    expect(result.dependencies).toBeDefined();
    expect(result.codeAnalysis).toBeDefined();
    expect(result.summary).toBeDefined();
  });

  test('should generate JSON report', async () => {
    const scanResult = await agent.scan({ target: './' });
    const report = await agent.generateReport(scanResult, 'json');
    expect(typeof report).toBe('string');
    const parsed = JSON.parse(report);
    expect(parsed.summary).toBeDefined();
  });

  test('should generate text report', async () => {
    const scanResult = await agent.scan({ target: './' });
    const report = await agent.generateReport(scanResult, 'text');
    expect(typeof report).toBe('string');
    expect(report).toContain('SECURITY REPORT');
  });

  test('should fail on critical vulnerabilities when configured', async () => {
    const strictAgent = new SecurityAgent({
      level: 'strict',
      failOnHigh: true
    });

    // Mock scanDependencies to return critical vulnerability
    strictAgent.scanDependencies = jest.fn(async () => ({
      total: 10,
      vulnerable: 1,
      vulnerabilities: [{ severity: 'critical', cve: 'CVE-2021-00000' }]
    }));

    strictAgent.scanCode = jest.fn(async () => ({
      files: 5,
      issues: []
    }));

    await expect(strictAgent.scan({ target: './' })).rejects.toThrow(
      'Se encontraron 1 vulnerabilidades críticas'
    );
  });
});
