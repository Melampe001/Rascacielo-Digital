/**
 * Python Master Tests
 */

const PythonMaster = require('../../masters/python-master');

describe('PythonMaster', () => {
  let master;

  beforeEach(() => {
    master = new PythonMaster();
  });

  test('should initialize with correct properties', () => {
    expect(master.name).toBe('Python Master');
    expect(master.version).toBe('1.0.0');
    expect(master.expertise).toContain('Python 3.11+');
    expect(master.bestPractices).toContain('Always use type hints for function signatures');
  });

  test('should analyze code and detect issues', async () => {
    const code = `
def greet(name):
    return "Hello, " + name
`;
    const result = await master.analyze(code);
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('score');
    expect(typeof result.score).toBe('number');
  });

  test('should validate code', async () => {
    const goodCode = `
def greet(name: str) -> str:
    """Greet a person"""
    return f"Hello, {name}"
`;
    const result = await master.validate(goodCode);
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('validations');
    expect(result).toHaveProperty('score');
  });

  test('should scaffold FastAPI project', async () => {
    const result = await master.scaffold('fastapi', { name: 'test-api' });
    expect(result).toHaveProperty('files');
    expect(result.files).toHaveProperty('main.py');
    expect(result.files).toHaveProperty('requirements.txt');
    expect(result.files['main.py']).toContain('FastAPI');
  });

  test('should optimize code', async () => {
    const code = `name = "test".format()`;
    const result = await master.optimize(code);
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('optimizations');
    expect(result).toHaveProperty('improved');
  });

  test('should provide guidance on topics', () => {
    const guide = master.getGuidance('type-hints');
    expect(guide).toHaveProperty('title');
    expect(guide).toHaveProperty('content');
    expect(guide.title).toContain('Type Hints');
  });

  test('should detect anti-patterns', async () => {
    const badCode = `
def func(arg=[]):
    arg.append(1)
    return arg
`;
    const issues = await master.detectIssues(badCode);
    expect(Array.isArray(issues)).toBe(true);
    const hasMutableDefaultIssue = issues.some(
      issue => issue.type === 'mutable_default_argument'
    );
    expect(hasMutableDefaultIssue).toBe(true);
  });

  test('should handle invalid code gracefully', async () => {
    const invalidCode = null;
    await expect(master.analyze(invalidCode)).resolves.toBeDefined();
  });
});
