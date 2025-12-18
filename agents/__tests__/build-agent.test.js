const BuildAgent = require('../build-agent');

describe('BuildAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new BuildAgent();
  });

  test('should initialize with default config', () => {
    expect(agent.config.buildTool).toBe('auto');
    expect(agent.config.outputDir).toBe('./dist');
    expect(agent.config.optimize).toBe(true);
  });

  test('should validate params correctly', async () => {
    await expect(agent.validate({ source: './src' })).resolves.toBe(true);
    await expect(agent.validate({ source: 123 })).rejects.toThrow();
  });

  test('should detect project type', async () => {
    const type = await agent.detectProjectType();
    expect(type).toBe('javascript');
  });

  test('should build successfully', async () => {
    const result = await agent.build();
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('artifacts');
  });
});
