/**
 * Tests for Build Agent - Rascacielos Digital
 */

const BuildAgent = require('../agents/build-agent');

describe('BuildAgent', () => {
  let buildAgent;

  beforeEach(() => {
    buildAgent = new BuildAgent();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create agent with default config', () => {
      expect(buildAgent.config.buildTool).toBe('auto');
      expect(buildAgent.config.outputDir).toBe('./dist');
      expect(buildAgent.config.optimize).toBe(true);
    });

    test('should create agent with custom config', () => {
      const customAgent = new BuildAgent({
        buildTool: 'webpack',
        outputDir: './build',
        optimize: false
      });

      expect(customAgent.config.buildTool).toBe('webpack');
      expect(customAgent.config.outputDir).toBe('./build');
      expect(customAgent.config.optimize).toBe(false);
    });
  });

  describe('build', () => {
    test('should complete build successfully', async () => {
      const result = await buildAgent.build({ source: './src' });

      expect(result.success).toBe(true);
      expect(result.duration).toBeDefined();
      expect(result.artifacts).toBeDefined();
      expect(result.projectType).toBe('javascript');
    });

    test('should include artifacts in result', async () => {
      const result = await buildAgent.build();

      expect(result.artifacts).toContain('dist/bundle.js');
      expect(result.artifacts).toContain('dist/bundle.css');
    });
  });

  describe('validate', () => {
    test('should validate correct params', async () => {
      const result = await buildAgent.validate({ source: './src' });
      expect(result).toBe(true);
    });

    test('should throw for invalid source param', async () => {
      await expect(buildAgent.validate({ source: 123 }))
        .rejects.toThrow('El parámetro source debe ser una cadena de texto');
    });
  });

  describe('detectProjectType', () => {
    test('should return javascript as default', async () => {
      const projectType = await buildAgent.detectProjectType();
      expect(projectType).toBe('javascript');
    });
  });

  describe('executeBuild', () => {
    test('should execute javascript build', async () => {
      const result = await buildAgent.executeBuild('javascript', {});
      expect(result.artifacts).toBeDefined();
    });

    test('should execute python build', async () => {
      const result = await buildAgent.executeBuild('python', {});
      expect(result.artifacts).toContain('dist/package.whl');
    });

    test('should execute java build', async () => {
      const result = await buildAgent.executeBuild('java', {});
      expect(result.artifacts).toContain('target/application.jar');
    });

    test('should execute go build', async () => {
      const result = await buildAgent.executeBuild('go', {});
      expect(result.artifacts).toContain('bin/application');
    });

    test('should throw for unsupported project type', async () => {
      await expect(buildAgent.executeBuild('unknown', {}))
        .rejects.toThrow('Tipo de proyecto no soportado: unknown');
    });
  });

  describe('clean', () => {
    test('should clean artifacts successfully', async () => {
      const result = await buildAgent.clean();
      expect(result.success).toBe(true);
    });
  });
});
