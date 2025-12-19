/**
 * System Integration Tests
 */

const RascacielosDigital = require('../index');

describe('System Integration', () => {
  test('should initialize successfully', () => {
    const app = new RascacielosDigital();
    expect(app).toBeDefined();
    expect(app.agents).toBeDefined();
  });

  test('should load all agents', async () => {
    const app = new RascacielosDigital();
    await app.initialize();
    expect(Object.keys(app.agents).length).toBeGreaterThan(0);
  });

  test('should have build agent', () => {
    const app = new RascacielosDigital();
    expect(app.agents.build).toBeDefined();
  });

  test('should have security agent', () => {
    const app = new RascacielosDigital();
    expect(app.agents.security).toBeDefined();
  });

  test('should run build agent', async () => {
    const app = new RascacielosDigital();
    await app.initialize();
    const result = await app.runBuild({ source: './src' });
    expect(result).toBeDefined();
  });

  test('should run security agent', async () => {
    const app = new RascacielosDigital();
    await app.initialize();
    const result = await app.runSecurity({ target: './src' });
    expect(result).toBeDefined();
  });
});
