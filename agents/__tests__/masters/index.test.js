/**
 * Masters Index Tests
 */

const {
  getMaster,
  listMasters,
  initializeAll,
  PythonMaster,
  JavaScriptMaster,
  TypeScriptMaster
} = require('../../masters');

describe('Masters Index', () => {
  describe('getMaster', () => {
    test('should get a master by name', () => {
      const master = getMaster('python');
      expect(master).toBeDefined();
      expect(master.name).toBe('Python Master');
    });

    test('should throw error for unknown master', () => {
      expect(() => getMaster('unknown')).toThrow('Master "unknown" no encontrado');
    });

    test('should pass config to master', () => {
      const master = getMaster('javascript', { verbose: true });
      expect(master.config.verbose).toBe(true);
    });
  });

  describe('listMasters', () => {
    test('should list all available masters', () => {
      const masters = listMasters();
      expect(Array.isArray(masters)).toBe(true);
      expect(masters.length).toBe(35);
      expect(masters).toContain('python');
      expect(masters).toContain('javascript');
      expect(masters).toContain('react');
      expect(masters).toContain('docker');
    });
  });

  describe('initializeAll', () => {
    test('should initialize all masters', () => {
      const masters = initializeAll();
      expect(typeof masters).toBe('object');
      expect(Object.keys(masters).length).toBe(35);
      expect(masters.python).toBeInstanceOf(PythonMaster);
      expect(masters.javascript).toBeInstanceOf(JavaScriptMaster);
    });

    test('should pass config to all masters', () => {
      const masters = initializeAll({ verbose: true });
      expect(masters.python.config.verbose).toBe(true);
      expect(masters.javascript.config.verbose).toBe(true);
    });
  });

  describe('Individual Master Classes', () => {
    test('should export PythonMaster', () => {
      expect(PythonMaster).toBeDefined();
      const master = new PythonMaster();
      expect(master.name).toBe('Python Master');
    });

    test('should export JavaScriptMaster', () => {
      expect(JavaScriptMaster).toBeDefined();
      const master = new JavaScriptMaster();
      expect(master.name).toBe('JavaScript Master');
    });

    test('should export TypeScriptMaster', () => {
      expect(TypeScriptMaster).toBeDefined();
      const master = new TypeScriptMaster();
      expect(master.name).toBe('TypeScript Master');
    });
  });

  describe('Master Categories', () => {
    test('should have all programming language masters', () => {
      const masters = listMasters();
      const languages = ['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'php'];
      languages.forEach(lang => {
        expect(masters).toContain(lang);
      });
    });

    test('should have all frontend framework masters', () => {
      const masters = listMasters();
      const frameworks = ['react', 'vue', 'angular'];
      frameworks.forEach(fw => {
        expect(masters).toContain(fw);
      });
    });

    test('should have all mobile masters', () => {
      const masters = listMasters();
      const mobile = ['flutter', 'reactNative', 'ios', 'android'];
      mobile.forEach(m => {
        expect(masters).toContain(m);
      });
    });

    test('should have all DevOps masters', () => {
      const masters = listMasters();
      const devops = ['docker', 'kubernetes', 'linux', 'cicd', 'terraform'];
      devops.forEach(d => {
        expect(masters).toContain(d);
      });
    });

    test('should have all cloud masters', () => {
      const masters = listMasters();
      const cloud = ['vercel', 'aws', 'azure', 'gcp'];
      cloud.forEach(c => {
        expect(masters).toContain(c);
      });
    });

    test('should have all database masters', () => {
      const masters = listMasters();
      const databases = ['sql', 'nosql', 'graphql'];
      databases.forEach(db => {
        expect(masters).toContain(db);
      });
    });

    test('should have all design masters', () => {
      const masters = listMasters();
      const design = ['figma', 'css', 'svg'];
      design.forEach(d => {
        expect(masters).toContain(d);
      });
    });

    test('should have all format masters', () => {
      const masters = listMasters();
      const formats = ['json', 'markdown', 'yaml', 'xml'];
      formats.forEach(f => {
        expect(masters).toContain(f);
      });
    });

    test('should have all testing/quality masters', () => {
      const masters = listMasters();
      const testing = ['testing', 'security'];
      testing.forEach(t => {
        expect(masters).toContain(t);
      });
    });
  });
});
