/**
 * Rascacielo Masters Tests
 */

const {
  PythonMaster,
  JavaScriptMaster,
  TypeScriptMaster,
  ReactMaster,
  DockerMaster,
  getMaster,
  listMasters,
  initializeAll
} = require('../index');

describe('Rascacielo Masters Package', () => {
  describe('Individual Masters', () => {
    test('PythonMaster should be instantiable', () => {
      const master = new PythonMaster();
      expect(master.name).toBe('PythonMaster');
      expect(master.version).toBe('1.0.0');
      expect(Array.isArray(master.expertise)).toBe(true);
      expect(Array.isArray(master.bestPractices)).toBe(true);
    });

    test('JavaScriptMaster should be instantiable', () => {
      const master = new JavaScriptMaster();
      expect(master.name).toBe('JavaScriptMaster');
      expect(master.expertise).toContain('JavaScript');
    });

    test('TypeScriptMaster should be instantiable', () => {
      const master = new TypeScriptMaster();
      expect(master.name).toBe('TypeScriptMaster');
      expect(master.expertise).toContain('TypeScript');
    });

    test('ReactMaster should be instantiable', () => {
      const master = new ReactMaster();
      expect(master.name).toBe('ReactMaster');
      expect(master.expertise).toContain('React');
    });

    test('DockerMaster should be instantiable', () => {
      const master = new DockerMaster();
      expect(master.name).toBe('DockerMaster');
      expect(master.expertise).toContain('Docker');
    });
  });

  describe('Master Configuration', () => {
    test('should accept custom configuration', () => {
      const config = { strict: true, verbose: true };
      const master = new PythonMaster(config);
      expect(master.config).toEqual(config);
    });

    test('should work with empty configuration', () => {
      const master = new JavaScriptMaster();
      expect(master.config).toEqual({});
    });
  });

  describe('Master Methods', () => {
    let master;

    beforeEach(() => {
      master = new PythonMaster();
    });

    test('analyze should return AnalysisResult', async () => {
      const result = await master.analyze('print("hello")');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('score');
      expect(Array.isArray(result.issues)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(typeof result.score).toBe('number');
    });

    test('validate should return ValidationResult', async () => {
      const result = await master.validate('print("hello")');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('validations');
      expect(result).toHaveProperty('score');
      expect(typeof result.valid).toBe('boolean');
      expect(typeof result.score).toBe('number');
    });

    test('scaffold should return ScaffoldResult', async () => {
      const result = await master.scaffold('flask', { name: 'myapp' });
      expect(result).toHaveProperty('files');
      expect(typeof result.files).toBe('object');
    });

    test('optimize should return OptimizationResult', async () => {
      const result = await master.optimize('print("hello")');
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('optimizations');
      expect(result).toHaveProperty('improved');
      expect(typeof result.code).toBe('string');
      expect(Array.isArray(result.optimizations)).toBe(true);
      expect(typeof result.improved).toBe('boolean');
    });

    test('getGuidance should return GuidanceResult', () => {
      const result = master.getGuidance('best practices');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(typeof result.title).toBe('string');
      expect(typeof result.content).toBe('string');
    });

    test('detectIssues should return array of issues', async () => {
      const result = await master.detectIssues('print("hello")');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Helper Functions', () => {
    test('getMaster should return master instance by name', () => {
      const master = getMaster('PythonMaster');
      expect(master.name).toBe('PythonMaster');
    });

    test('getMaster should accept configuration', () => {
      const config = { strict: true };
      const master = getMaster('JavaScriptMaster', config);
      expect(master.config).toEqual(config);
    });

    test('getMaster should throw error for invalid master name', () => {
      expect(() => getMaster('InvalidMaster')).toThrow('Master not found: InvalidMaster');
    });

    test('listMasters should return array of master names', () => {
      const masters = listMasters();
      expect(Array.isArray(masters)).toBe(true);
      expect(masters.length).toBe(35);
      expect(masters).toContain('PythonMaster');
      expect(masters).toContain('JavaScriptMaster');
      expect(masters).toContain('TypeScriptMaster');
      expect(masters).toContain('ReactMaster');
      expect(masters).toContain('DockerMaster');
    });

    test('initializeAll should return all masters', () => {
      const allMasters = initializeAll();
      expect(Object.keys(allMasters).length).toBe(35);
      expect(allMasters.PythonMaster).toBeInstanceOf(PythonMaster);
      expect(allMasters.JavaScriptMaster).toBeInstanceOf(JavaScriptMaster);
      expect(allMasters.TypeScriptMaster).toBeInstanceOf(TypeScriptMaster);
    });

    test('initializeAll should accept shared configuration', () => {
      const config = { verbose: true };
      const allMasters = initializeAll(config);
      expect(allMasters.PythonMaster.config).toEqual(config);
      expect(allMasters.JavaScriptMaster.config).toEqual(config);
    });
  });

  describe('All 35 Masters', () => {
    test('should have exactly 35 masters', () => {
      const masters = listMasters();
      expect(masters.length).toBe(35);
    });

    test('all masters should be instantiable', () => {
      const masters = listMasters();
      masters.forEach(masterName => {
        const master = getMaster(masterName);
        expect(master).toBeDefined();
        expect(master.name).toBe(masterName);
        expect(master.version).toBe('1.0.0');
      });
    });

    test('all masters should implement required methods', () => {
      const masters = listMasters();
      masters.forEach(masterName => {
        const master = getMaster(masterName);
        expect(typeof master.analyze).toBe('function');
        expect(typeof master.validate).toBe('function');
        expect(typeof master.scaffold).toBe('function');
        expect(typeof master.optimize).toBe('function');
        expect(typeof master.getGuidance).toBe('function');
        expect(typeof master.detectIssues).toBe('function');
      });
    });

    test('all masters should have required properties', () => {
      const masters = listMasters();
      masters.forEach(masterName => {
        const master = getMaster(masterName);
        expect(master.name).toBeDefined();
        expect(master.version).toBeDefined();
        expect(Array.isArray(master.expertise)).toBe(true);
        expect(Array.isArray(master.bestPractices)).toBe(true);
        expect(master.config).toBeDefined();
      });
    });
  });
});
