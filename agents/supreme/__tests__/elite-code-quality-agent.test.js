/**
 * Tests for Elite Code Quality Agent
 */

const EliteCodeQualityAgent = require('../elite-code-quality-agent');

describe('EliteCodeQualityAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new EliteCodeQualityAgent();
  });

  describe('Constructor', () => {
    test('should create agent with default config', () => {
      expect(agent.name).toBe('Elite Code Quality Agent');
      expect(agent.version).toBe('1.0.0');
      expect(agent.tier).toBe('ELITE');
      expect(agent.config.aggressiveness).toBe('normal');
      expect(agent.config.autoFix).toBe(true);
    });

    test('should accept custom config', () => {
      const customAgent = new EliteCodeQualityAgent({
        aggressiveness: 'aggressive',
        autoFix: false
      });
      expect(customAgent.config.aggressiveness).toBe('aggressive');
      expect(customAgent.config.autoFix).toBe(false);
    });
  });

  describe('validate', () => {
    test('should validate code successfully', async () => {
      const result = await agent.validate();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('eslint');
      expect(result).toHaveProperty('prettier');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('deadCode');
      expect(result).toHaveProperty('summary');
    });

    test('should return success false if errors found', async () => {
      // Mock runESLint to return errors
      agent.runESLint = jest.fn().mockResolvedValue({
        errors: 5,
        warnings: 2,
        fixableErrors: 3,
        fixableWarnings: 1,
        files: 10
      });

      const result = await agent.validate();
      expect(result.success).toBe(false);
    });
  });

  describe('runESLint', () => {
    test('should run ESLint and return results', async () => {
      const result = await agent.runESLint('.');

      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('fixableErrors');
      expect(result).toHaveProperty('fixableWarnings');
      expect(result).toHaveProperty('files');
    });
  });

  describe('runPrettier', () => {
    test('should run Prettier check', async () => {
      const result = await agent.runPrettier('.');

      expect(result).toHaveProperty('unformatted');
      expect(result).toHaveProperty('total');
      expect(typeof result.unformatted).toBe('number');
      expect(typeof result.total).toBe('number');
    });
  });

  describe('analyzeComplexity', () => {
    test('should analyze code complexity', async () => {
      const result = await agent.analyzeComplexity('.');

      expect(result).toHaveProperty('avgCyclomaticComplexity');
      expect(result).toHaveProperty('avgCognitiveComplexity');
      expect(result).toHaveProperty('complexFunctions');
      expect(result).toHaveProperty('maintainabilityIndex');
      expect(Array.isArray(result.complexFunctions)).toBe(true);
    });
  });

  describe('detectDeadCode', () => {
    test('should detect dead code', async () => {
      const result = await agent.detectDeadCode('.');

      expect(result).toHaveProperty('unusedExports');
      expect(result).toHaveProperty('orphanedFiles');
      expect(result).toHaveProperty('unreachableCode');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.unusedExports)).toBe(true);
    });
  });

  describe('calculateQualityScore', () => {
    test('should calculate quality score correctly', () => {
      const results = {
        eslint: { errors: 0, warnings: 3 },
        prettier: { unformatted: 5 },
        complexity: { complexFunctions: [1, 2] },
        deadCode: { total: 1 }
      };

      const score = agent.calculateQualityScore(results);

      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should penalize errors more than warnings', () => {
      const withErrors = {
        eslint: { errors: 5, warnings: 0 },
        prettier: { unformatted: 0 },
        complexity: { complexFunctions: [] },
        deadCode: { total: 0 }
      };

      const withWarnings = {
        eslint: { errors: 0, warnings: 5 },
        prettier: { unformatted: 0 },
        complexity: { complexFunctions: [] },
        deadCode: { total: 0 }
      };

      const scoreWithErrors = agent.calculateQualityScore(withErrors);
      const scoreWithWarnings = agent.calculateQualityScore(withWarnings);

      expect(scoreWithErrors).toBeLessThan(scoreWithWarnings);
    });
  });

  describe('autoFix', () => {
    test('should perform auto-fix', async () => {
      const result = await agent.autoFix();

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('applied');
      expect(result).toHaveProperty('aggressiveness');
      expect(Array.isArray(result.applied)).toBe(true);
    });

    test('should apply conservative fixes', async () => {
      const result = await agent.autoFix('.', { conservative: true });

      expect(result.aggressiveness).toBe('conservative');
      expect(result.applied).not.toContain('eslint');
    });

    test('should apply aggressive fixes', async () => {
      const result = await agent.autoFix('.', { aggressive: true });

      expect(result.aggressiveness).toBe('aggressive');
      expect(result.applied).toContain('imports');
    });
  });

  describe('generateQualityBadge', () => {
    test('should generate quality badge', async () => {
      const result = await agent.generateQualityBadge();

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('grade');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('badgeUrl');
      expect(result).toHaveProperty('markdown');
    });
  });

  describe('scoreToGrade', () => {
    test('should convert score to grade correctly', () => {
      expect(agent.scoreToGrade(95)).toBe('A+');
      expect(agent.scoreToGrade(92)).toBe('A');
      expect(agent.scoreToGrade(85)).toBe('B');
      expect(agent.scoreToGrade(75)).toBe('C');
      expect(agent.scoreToGrade(65)).toBe('D');
      expect(agent.scoreToGrade(50)).toBe('F');
    });
  });

  describe('gradeToColor', () => {
    test('should convert grade to color', () => {
      expect(agent.gradeToColor('A+')).toBe('brightgreen');
      expect(agent.gradeToColor('A')).toBe('green');
      expect(agent.gradeToColor('B')).toBe('yellowgreen');
      expect(agent.gradeToColor('C')).toBe('yellow');
      expect(agent.gradeToColor('D')).toBe('orange');
      expect(agent.gradeToColor('F')).toBe('red');
    });
  });

  describe('getInfo', () => {
    test('should return agent information', () => {
      const info = agent.getInfo();

      expect(info.name).toBe('Elite Code Quality Agent');
      expect(info.version).toBe('1.0.0');
      expect(info.tier).toBe('ELITE');
      expect(info).toHaveProperty('config');
    });
  });
});
