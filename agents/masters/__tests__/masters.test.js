/**
 * Tests for @melampe001/rascacielo-masters
 */

const {
  PythonMaster,
  JavaScriptMaster,
  TypeScriptMaster,
  ReactMaster,
  DockerMaster,
  AWSMaster,
  TestingMaster,
  SecurityMaster
} = require('../index');

describe('@melampe001/rascacielo-masters', () => {
  describe('Package Exports', () => {
    test('should export all 35 master agents', () => {
      const allMasters = require('../index');
      const masterCount = Object.keys(allMasters).length;
      expect(masterCount).toBe(35);
    });

    test('should export PythonMaster', () => {
      expect(PythonMaster).toBeDefined();
      expect(typeof PythonMaster).toBe('function');
    });

    test('should export JavaScriptMaster', () => {
      expect(JavaScriptMaster).toBeDefined();
      expect(typeof JavaScriptMaster).toBe('function');
    });

    test('should export ReactMaster', () => {
      expect(ReactMaster).toBeDefined();
      expect(typeof ReactMaster).toBe('function');
    });

    test('should export DockerMaster', () => {
      expect(DockerMaster).toBeDefined();
      expect(typeof DockerMaster).toBe('function');
    });
  });

  describe('PythonMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new PythonMaster({ verbose: false });
    });

    test('should create agent with default config', () => {
      expect(agent.name).toBe('Python Master');
      expect(agent.config.verbose).toBe(false);
      expect(agent.config.strictMode).toBe(true);
    });

    test('should have specializations', () => {
      const specializations = agent.getSpecializations();
      expect(Array.isArray(specializations)).toBe(true);
      expect(specializations.length).toBeGreaterThan(0);
      expect(specializations).toContain('FastAPI');
      expect(specializations).toContain('Django');
    });

    test('should analyze code', async () => {
      const result = await agent.analyze('print("Hello")');
      expect(result).toBeDefined();
      expect(result.agent).toBe('Python Master');
      expect(result.language).toBe('python');
      expect(result.score).toBe(100);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should validate parameters', async () => {
      await expect(agent.validate({})).resolves.toBe(true);
      await expect(agent.validate({ test: true })).resolves.toBe(true);
      await expect(agent.validate(null)).rejects.toThrow('Invalid parameters');
      await expect(agent.validate('invalid')).rejects.toThrow('Invalid parameters');
    });
  });

  describe('JavaScriptMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new JavaScriptMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('JavaScript Master');
    });

    test('should have specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('Node.js');
      expect(specializations).toContain('Express');
      expect(specializations).toContain('ES6+');
    });

    test('should analyze code', async () => {
      const result = await agent.analyze('const x = 1;');
      expect(result.agent).toBe('JavaScript Master');
      expect(result.language).toBe('javascript');
    });
  });

  describe('TypeScriptMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new TypeScriptMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('TypeScript Master');
    });

    test('should have TypeScript specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('NestJS');
      expect(specializations).toContain('Strict Mode');
      expect(specializations).toContain('Type Safety');
    });
  });

  describe('ReactMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new ReactMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('React Master');
    });

    test('should have React specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('Hooks');
      expect(specializations).toContain('Next.js');
      expect(specializations).toContain('Redux');
    });

    test('should analyze React code', async () => {
      const result = await agent.analyze('function Component() {}');
      expect(result.framework).toBe('react');
    });
  });

  describe('DockerMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new DockerMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('Docker Master');
    });

    test('should have Docker specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('Multi-stage Builds');
      expect(specializations).toContain('Best Practices');
    });

    test('should analyze Dockerfile', async () => {
      const result = await agent.analyze('FROM node:18');
      expect(result.category).toBe('devops');
    });
  });

  describe('AWSMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new AWSMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('AWS Master');
    });

    test('should have AWS specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('EC2');
      expect(specializations).toContain('Lambda');
      expect(specializations).toContain('S3');
    });

    test('should analyze AWS config', async () => {
      const result = await agent.analyze('{}');
      expect(result.category).toBe('cloud');
    });
  });

  describe('TestingMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new TestingMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('Testing Master');
    });

    test('should have testing specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('Jest');
      expect(specializations).toContain('Pytest');
      expect(specializations).toContain('Cypress');
    });

    test('should analyze test code', async () => {
      const result = await agent.analyze('test("example", () => {})');
      expect(result.category).toBe('quality');
    });
  });

  describe('SecurityMaster', () => {
    let agent;

    beforeEach(() => {
      agent = new SecurityMaster();
    });

    test('should create agent', () => {
      expect(agent.name).toBe('Security Master');
    });

    test('should have security specializations', () => {
      const specializations = agent.getSpecializations();
      expect(specializations).toContain('OWASP');
      expect(specializations).toContain('DevSecOps');
    });

    test('should analyze for security issues', async () => {
      const result = await agent.analyze('const password = "123456"');
      expect(result.category).toBe('quality');
    });
  });

  describe('Configuration', () => {
    test('should accept verbose option', () => {
      const agent = new PythonMaster({ verbose: true });
      expect(agent.config.verbose).toBe(true);
    });

    test('should accept strictMode option', () => {
      const agent = new PythonMaster({ strictMode: false });
      expect(agent.config.strictMode).toBe(false);
    });

    test('should accept custom config', () => {
      const agent = new PythonMaster({ 
        verbose: true, 
        strictMode: false,
        customOption: 'value'
      });
      expect(agent.config.customOption).toBe('value');
    });
  });
});
