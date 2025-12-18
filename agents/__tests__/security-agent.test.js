const SecurityAgent = require('../security-agent');

describe('SecurityAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new SecurityAgent();
  });

  test('should initialize with default config', () => {
    expect(agent.config.level).toBe('moderate');
    expect(agent.config.failOnHigh).toBe(true);
  });

  test('should scan successfully', async () => {
    const result = await agent.scan({ target: './src' });
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('summary');
  });

  test('should generate summary correctly', () => {
    const mockResults = {
      dependencies: {
        vulnerabilities: [{ severity: 'high' }, { severity: 'moderate' }]
      },
      codeAnalysis: {
        issues: [{ severity: 'critical' }, { severity: 'low' }]
      }
    };

    const summary = agent.generateSummary(mockResults);
    expect(summary.critical).toBe(1);
    expect(summary.high).toBe(1);
    expect(summary.total).toBe(4);
  });
});
