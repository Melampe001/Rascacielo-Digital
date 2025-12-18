/**
 * Tests for Security Agent
 */
const SecurityAgent = require('../agents/security-agent');
const fs = require('fs');

describe('SecurityAgent', () => {
  let agent;
  const testReportPath = './test-security-report.json';

  beforeEach(() => {
    agent = new SecurityAgent({ 
      reportPath: testReportPath,
      target: './agents',
      failOnHigh: false
    });
  });

  afterEach(() => {
    if (fs.existsSync(testReportPath)) {
      fs.unlinkSync(testReportPath);
    }
  });

  test('should create SecurityAgent instance', () => {
    expect(agent).toBeInstanceOf(SecurityAgent);
    expect(agent.config.reportPath).toBe(testReportPath);
  });

  test('should generate summary correctly', () => {
    agent.vulnerabilities = [
      { severity: 'high' },
      { severity: 'medium' },
      { severity: 'low' }
    ];

    const summary = agent.getSummary();
    expect(summary.total).toBe(3);
    expect(summary.high).toBe(1);
    expect(summary.medium).toBe(1);
    expect(summary.low).toBe(1);
  });

  test('should detect high vulnerabilities', () => {
    agent.vulnerabilities = [{ severity: 'high' }];
    expect(agent.hasHighVulnerabilities()).toBe(true);

    agent.vulnerabilities = [{ severity: 'low' }];
    expect(agent.hasHighVulnerabilities()).toBe(false);
  });

  test('should generate recommendations', () => {
    agent.vulnerabilities = [{ severity: 'critical' }];
    const recommendations = agent.getRecommendations();
    
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toContain('URGENTE');
  });

  test('should log messages correctly', () => {
    agent.log('Test message', 'info');
    expect(agent.scanLog.length).toBe(1);
    expect(agent.scanLog[0].message).toBe('Test message');
    expect(agent.scanLog[0].level).toBe('info');
  });

  test('should perform full scan successfully', async () => {
    const result = await agent.scan();
    
    expect(result.success).toBe(true);
    expect(result.duration).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(fs.existsSync(testReportPath)).toBe(true);
  });
});
