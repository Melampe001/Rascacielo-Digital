const BuildAgent = require('../build-agent');

describe('BuildAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new BuildAgent();
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      expect(agent.config.buildTool).toBe('auto');
      expect(agent.config.outputDir).toBe('./dist');
      expect(agent.config.optimize).toBe(true);
    });

    it('should accept custom config', () => {
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

  describe('validate', () => {
    it('should validate correct params', async () => {
      const result = await agent.validate({ source: './src' });
      expect(result).toBe(true);
    });

    it('should reject invalid source param', async () => {
      await expect(agent.validate({ source: 123 })).rejects.toThrow(
        'El parámetro source debe ser una cadena de texto'
      );
    });

    it('should accept empty params', async () => {
      const result = await agent.validate({});
      expect(result).toBe(true);
    });
  });

  describe('detectProjectType', () => {
    it('should detect project type', async () => {
      const type = await agent.detectProjectType();
      expect(type).toBe('javascript');
    });
  });

  describe('build', () => {
    it('should execute build successfully', async () => {
      const result = await agent.build();

      expect(result.success).toBe(true);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.projectType).toBe('javascript');
      expect(Array.isArray(result.artifacts)).toBe(true);
    });

    it('should handle build with custom params', async () => {
      const result = await agent.build({ source: './custom-src' });
      expect(result.success).toBe(true);
    });
  });

  describe('buildJavaScript', () => {
    it('should build JavaScript project', async () => {
      const result = await agent.buildJavaScript({});
      expect(result.artifacts).toContain('dist/bundle.js');
      expect(result.artifacts).toContain('dist/bundle.css');
    });
  });

  describe('clean', () => {
    it('should clean build artifacts', async () => {
      const result = await agent.clean();
      expect(result.success).toBe(true);
    });
  });
});
