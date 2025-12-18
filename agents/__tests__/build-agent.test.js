/**
 * Build Agent Tests
 */

const BuildAgent = require('../build-agent');

describe('BuildAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new BuildAgent({
      outputDir: './test-dist',
      verbose: false
    });
  });

  test('should create agent with config', () => {
    expect(agent.config.outputDir).toBe('./test-dist');
    expect(agent.config.verbose).toBe(false);
  });

  test('should detect project type', async () => {
    const projectType = await agent.detectProjectType();
    expect(projectType).toBe('javascript');
  });

  test('should validate build parameters', async () => {
    await expect(agent.validate({})).resolves.toBe(true);
    await expect(agent.validate({ source: 'src' })).resolves.toBe(true);
    await expect(agent.validate({ source: 123 })).rejects.toThrow();
  });

  test('should build JavaScript project', async () => {
    const result = await agent.buildJavaScript({});
    expect(result.artifacts).toBeDefined();
    expect(Array.isArray(result.artifacts)).toBe(true);
  });

  test('should build Python project', async () => {
    const result = await agent.buildPython({});
    expect(result.artifacts).toBeDefined();
    expect(result.artifacts).toContain('dist/package.whl');
  });

  test('should build Java project', async () => {
    const result = await agent.buildJava({});
    expect(result.artifacts).toBeDefined();
    expect(result.artifacts).toContain('target/application.jar');
  });

  test('should build Go project', async () => {
    const result = await agent.buildGo({});
    expect(result.artifacts).toBeDefined();
    expect(result.artifacts).toContain('bin/application');
  });

  test('should execute build by project type', async () => {
    const result = await agent.executeBuild('javascript', {});
    expect(result.artifacts).toBeDefined();
  });

  test('should throw error for unsupported project type', async () => {
    await expect(agent.executeBuild('unsupported', {})).rejects.toThrow(
      'Tipo de proyecto no soportado: unsupported'
    );
  });

  test('should run full build process', async () => {
    const result = await agent.build({ source: './src' });
    expect(result.success).toBe(true);
    expect(result.duration).toBeDefined();
    expect(result.artifacts).toBeDefined();
    expect(result.projectType).toBe('javascript');
  });

  test('should clean artifacts', async () => {
    const result = await agent.clean();
    expect(result.success).toBe(true);
  });
});
