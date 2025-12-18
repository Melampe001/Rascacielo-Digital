const SecurityAgent = require('../security-agent');

describe('SecurityAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new SecurityAgent();
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      expect(agent.config.level).toBe('moderate');
      expect(agent.config.failOnHigh).toBe(true);
      expect(agent.config.scanDependencies).toBe(true);
      expect(agent.config.scanCode).toBe(true);
    });

    it('should accept custom config', () => {
      const customAgent = new SecurityAgent({
        level: 'strict',
        failOnHigh: false
      });

      expect(customAgent.config.level).toBe('strict');
      expect(customAgent.config.failOnHigh).toBe(false);
    });
  });

  describe('scan', () => {
    it('should execute scan successfully', async () => {
      const result = await agent.scan({ target: './src' });

      expect(result.success).toBe(true);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.summary).toBeDefined();
      expect(result.dependencies).toBeDefined();
      expect(result.codeAnalysis).toBeDefined();
    });

    it('should fail on critical vulnerabilities when configured', async () => {
      const strictAgent = new SecurityAgent({ failOnHigh: true });

      // Mock para simular vulnerabilidades críticas
      strictAgent.generateSummary = jest.fn().mockReturnValue({
        critical: 2,
        high: 1,
        moderate: 0,
        low: 0,
        total: 3
      });

      await expect(strictAgent.scan({ target: './src' })).rejects.toThrow(
        'Se encontraron 2 vulnerabilidades críticas'
      );
    });
  });

  describe('scanDependencies', () => {
    it('should scan dependencies', async () => {
      const result = await agent.scanDependencies('./src');

      expect(result.total).toBeGreaterThan(0);
      expect(result.vulnerable).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(result.vulnerabilities)).toBe(true);
    });
  });

  describe('scanCode', () => {
    it('should scan source code', async () => {
      const result = await agent.scanCode('./src');

      expect(result.files).toBeGreaterThan(0);
      expect(Array.isArray(result.issues)).toBe(true);
    });
  });

  describe('generateSummary', () => {
    it('should generate summary correctly', () => {
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
      expect(summary.moderate).toBe(1);
      expect(summary.low).toBe(1);
      expect(summary.total).toBe(4);
    });
  });

  describe('generateReport', () => {
    it('should generate JSON report', async () => {
      const mockResults = {
        summary: { critical: 0, high: 1, moderate: 2, low: 3, total: 6 }
      };

      const report = await agent.generateReport(mockResults, 'json');
      const parsed = JSON.parse(report);

      expect(parsed.summary.total).toBe(6);
    });

    it('should generate text report', async () => {
      const mockResults = {
        summary: { critical: 0, high: 1, moderate: 2, low: 3, total: 6 }
      };

      const report = await agent.generateReport(mockResults, 'text');

      expect(report).toContain('REPORTE DE SEGURIDAD');
      expect(report).toContain('Total de vulnerabilidades: 6');
    });
  });
});
