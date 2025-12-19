/**
 * JavaScript Master Tests
 */

const JavaScriptMaster = require('../../masters/javascript-master');

describe('JavaScriptMaster', () => {
  let master;

  beforeEach(() => {
    master = new JavaScriptMaster();
  });

  test('should initialize with correct properties', () => {
    expect(master.name).toBe('JavaScript Master');
    expect(master.version).toBe('1.0.0');
    expect(master.expertise).toContain('ES6+ Features');
    expect(master.bestPractices).toContain('Use const and let, avoid var');
  });

  test('should detect var usage', async () => {
    const code = `var x = 10;`;
    const result = await master.analyze(code);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].type).toBe('var_usage');
  });

  test('should validate modern JavaScript', async () => {
    const modernCode = `
const greet = (name) => {
  return \`Hello, \${name}\`;
};
`;
    const result = await master.validate(modernCode);
    expect(result.valid).toBe(true);
    expect(result.score).toBeGreaterThan(50);
  });

  test('should scaffold Express project', async () => {
    const result = await master.scaffold('express', { name: 'test-api' });
    expect(result).toHaveProperty('files');
    expect(result.files['index.js']).toBeDefined();
    expect(result.files['package.json']).toBeDefined();
    expect(result.files['index.js']).toContain('express');
  });

  test('should detect loose equality', async () => {
    const code = `if (x == 10) { }`;
    const result = await master.analyze(code);
    const hasLooseEqualityIssue = result.issues.some(
      issue => issue.type === 'loose_equality'
    );
    expect(hasLooseEqualityIssue).toBe(true);
  });

  test('should optimize code', async () => {
    const code = `var name = "test";`;
    const result = await master.optimize(code);
    expect(result).toHaveProperty('optimizations');
    expect(result.optimizations.length).toBeGreaterThan(0);
  });

  test('should provide guidance', () => {
    const guide = master.getGuidance('modern-js');
    expect(guide).toHaveProperty('title');
    expect(guide).toHaveProperty('content');
    expect(guide.content).toContain('const');
  });

  test('should detect anti-patterns', async () => {
    const code = `eval(userInput);`;
    const issues = await master.detectIssues(code);
    const hasEvalIssue = issues.some(issue => issue.type === 'eval_usage');
    expect(hasEvalIssue).toBe(true);
  });
});
