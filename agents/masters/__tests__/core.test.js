/**
 * Rascacielo Masters - Core Tests
 */

const { 
  Orchestrator, 
  BadgeGenerator, 
  TechnologyScanner,
  Validator,
  Reporter,
  AutoValidator,
  BaseMaster
} = require('../index');

describe('Rascacielo Masters System', () => {
  
  describe('BadgeGenerator', () => {
    test('should create badge generator', () => {
      const generator = new BadgeGenerator();
      expect(generator).toBeDefined();
    });

    test('should generate markdown badge', () => {
      const generator = new BadgeGenerator();
      const badge = generator.generate(95, 'markdown');
      expect(badge).toContain('![Rascacielo');
      expect(badge).toContain('PLATINUM');
    });

    test('should get correct grade for score', () => {
      const generator = new BadgeGenerator();
      expect(generator.getGrade(96)).toBe('PLATINUM');
      expect(generator.getGrade(92)).toBe('GOLD');
      expect(generator.getGrade(85)).toBe('SILVER');
      expect(generator.getGrade(75)).toBe('BRONZE');
      expect(generator.getGrade(60)).toBe('PENDING');
    });

    test('should generate all badge formats', () => {
      const generator = new BadgeGenerator();
      const badges = generator.generate(90, 'all');
      expect(badges).toHaveProperty('markdown');
      expect(badges).toHaveProperty('html');
      expect(badges).toHaveProperty('svg');
      expect(badges).toHaveProperty('json');
      expect(badges).toHaveProperty('shields');
    });
  });

  describe('TechnologyScanner', () => {
    test('should create scanner', () => {
      const scanner = new TechnologyScanner();
      expect(scanner).toBeDefined();
    });

    test('should detect technologies', async () => {
      const scanner = new TechnologyScanner({ verbose: false });
      const tech = await scanner.scan('../../');
      expect(tech).toBeDefined();
      expect(typeof tech).toBe('object');
    });
  });

  describe('Orchestrator', () => {
    test('should create orchestrator', () => {
      const orchestrator = new Orchestrator();
      expect(orchestrator).toBeDefined();
    });

    test('should load all agents', async () => {
      const orchestrator = new Orchestrator({ verbose: false });
      const count = await orchestrator.loadAllAgents();
      expect(count).toBeGreaterThan(70);
    });

    test('should get stats', async () => {
      const orchestrator = new Orchestrator({ verbose: false });
      await orchestrator.loadAllAgents();
      const stats = orchestrator.getStats();
      expect(stats.total).toBeGreaterThan(70);
      expect(stats.categories).toBeGreaterThan(10);
    });

    test('should list agents', async () => {
      const orchestrator = new Orchestrator({ verbose: false });
      await orchestrator.loadAllAgents();
      const agents = orchestrator.listAgents();
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(70);
    });
  });

  describe('Validator', () => {
    test('should create validator', () => {
      const validator = new Validator();
      expect(validator).toBeDefined();
    });

    test('should validate results', () => {
      const validator = new Validator();
      const results = {
        agent1: {
          checks: [
            { name: 'test1', passed: true },
            { name: 'test2', passed: false }
          ]
        }
      };
      const summary = validator.validate(results);
      expect(summary).toHaveProperty('score');
      expect(summary).toHaveProperty('grade');
      expect(summary).toHaveProperty('valid');
    });

    test('should get correct grade', () => {
      const validator = new Validator();
      expect(validator.getGrade(96)).toBe('PLATINUM');
      expect(validator.getGrade(92)).toBe('GOLD');
      expect(validator.getGrade(85)).toBe('SILVER');
      expect(validator.getGrade(75)).toBe('BRONZE');
      expect(validator.getGrade(60)).toBe('PENDING');
    });
  });

  describe('Reporter', () => {
    test('should create reporter', () => {
      const reporter = new Reporter();
      expect(reporter).toBeDefined();
    });

    test('should generate text report', () => {
      const reporter = new Reporter();
      const summary = {
        grade: 'GOLD',
        score: 90,
        valid: true,
        totalChecks: 10,
        passedChecks: 9,
        failedChecks: 1,
        agents: {},
        issues: [],
        recommendations: []
      };
      const report = reporter.generate(summary, 'text');
      expect(report).toContain('RASCACIELO DIGITAL');
      expect(report).toContain('GOLD');
      expect(report).toContain('90');
    });
  });

  describe('BaseMaster', () => {
    test('should create base master', () => {
      const master = new BaseMaster({ name: 'Test Master' });
      expect(master).toBeDefined();
      expect(master.name).toBe('Test Master');
    });

    test('should calculate score', () => {
      const master = new BaseMaster();
      const results = {
        checks: [
          { passed: true },
          { passed: true },
          { passed: false },
          { passed: true }
        ]
      };
      const score = master.calculateScore(results);
      expect(score).toBe(75);
    });

    test('should get info', () => {
      const master = new BaseMaster({
        name: 'Test Master',
        version: '1.0.0',
        category: 'test'
      });
      const info = master.getInfo();
      expect(info.name).toBe('Test Master');
      expect(info.version).toBe('1.0.0');
      expect(info.category).toBe('test');
    });
  });

  describe('AutoValidator', () => {
    test('should create auto validator', () => {
      const validator = new AutoValidator();
      expect(validator).toBeDefined();
    });

    test('should have scanner', () => {
      const validator = new AutoValidator();
      expect(validator.scanner).toBeDefined();
    });

    test('should have orchestrator', () => {
      const validator = new AutoValidator();
      expect(validator.orchestrator).toBeDefined();
    });
  });
});
