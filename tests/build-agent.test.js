/**
 * Tests for Build Agent
 */
const BuildAgent = require('../agents/build-agent');
const fs = require('fs');
const path = require('path');

describe('BuildAgent', () => {
  let agent;
  const testOutputDir = './test-dist';

  beforeEach(() => {
    agent = new BuildAgent({ 
      outputDir: testOutputDir,
      sourceDir: './agents'
    });
  });

  afterEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  test('should create BuildAgent instance', () => {
    expect(agent).toBeInstanceOf(BuildAgent);
    expect(agent.config.outputDir).toBe(testOutputDir);
  });

  test('should validate environment successfully', async () => {
    await expect(agent.validateEnvironment()).resolves.not.toThrow();
  });

  test('should clean output directory', async () => {
    fs.mkdirSync(testOutputDir, { recursive: true });
    fs.writeFileSync(path.join(testOutputDir, 'test.txt'), 'test');
    
    await agent.clean();
    
    expect(fs.existsSync(testOutputDir)).toBe(true);
    expect(fs.readdirSync(testOutputDir).length).toBe(0);
  });

  test('should get project version from package.json', () => {
    const version = agent.getProjectVersion();
    expect(typeof version).toBe('string');
    expect(version).toBeTruthy();
  });

  test('should log messages correctly', () => {
    agent.log('Test message', 'info');
    expect(agent.buildLog.length).toBe(1);
    expect(agent.buildLog[0].message).toBe('Test message');
    expect(agent.buildLog[0].level).toBe('info');
  });

  test('should perform full build successfully', async () => {
    const result = await agent.build();
    
    expect(result.success).toBe(true);
    expect(result.duration).toBeDefined();
    expect(result.outputDir).toBe(testOutputDir);
    expect(fs.existsSync(testOutputDir)).toBe(true);
  });
});
