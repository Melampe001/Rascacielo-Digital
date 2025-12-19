/**
 * Python Master Tests
 */

const PythonMaster = require('../python-master');

// Mock OllamaClient
jest.mock('../../../modules/ollama-client');
const OllamaClient = require('../../../modules/ollama-client');

describe('PythonMaster', () => {
  let master;

  beforeEach(() => {
    jest.clearAllMocks();
    master = new PythonMaster({
      verbose: false
    });
  });

  test('should create master with config', () => {
    expect(master.config.verbose).toBe(false);
    expect(master.useOllama).toBe(false);
    expect(master.ollama).toBeNull();
  });

  test('should initialize Ollama when useOllama is true', () => {
    const masterWithOllama = new PythonMaster({
      useOllama: true,
      ollamaModel: 'codellama:13b',
      ollamaURL: 'http://localhost:11434'
    });

    expect(masterWithOllama.useOllama).toBe(true);
    expect(masterWithOllama.ollama).toBeDefined();
    expect(OllamaClient).toHaveBeenCalledWith({
      model: 'codellama:13b',
      baseURL: 'http://localhost:11434'
    });
  });

  describe('analyze', () => {
    test('should perform basic analysis without Ollama', async () => {
      const code = `
def hello():
    """Say hello"""
    print("Hello")
`;

      const result = await master.analyze(code);

      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('issues');
      expect(result.enhanced).toBe(false);
      expect(result.metrics.functions).toBeGreaterThan(0);
    });

    test('should detect missing imports', async () => {
      const code = `
async def main():
    await asyncio.sleep(1)
`;

      const result = await master.analyze(code);

      expect(result.issues.some(i => i.type === 'missing_import')).toBe(
        true
      );
    });

    test('should detect missing docstrings', async () => {
      const code = `
def without_docstring():
    pass
`;

      const result = await master.analyze(code);

      expect(result.issues.some(i => i.type === 'missing_docstring')).toBe(
        true
      );
    });

    test('should use Ollama for deep analysis when enabled', async () => {
      const mockAnalysis = {
        issues: [{ type: 'complexity', severity: 'medium' }],
        suggestions: ['Use type hints']
      };

      OllamaClient.mockImplementation(() => ({
        analyzeCode: jest.fn().mockResolvedValue(mockAnalysis)
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'def test(): pass';
      const result = await masterWithOllama.analyze(code, { deep: true });

      expect(result).toHaveProperty('llmInsights');
      expect(result.enhanced).toBe(true);
      expect(result.llmInsights).toEqual(mockAnalysis);
    });

    test('should fallback to basic analysis if Ollama fails', async () => {
      OllamaClient.mockImplementation(() => ({
        analyzeCode: jest.fn().mockRejectedValue(new Error('Ollama error'))
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'def test(): pass';
      const result = await masterWithOllama.analyze(code, { deep: true });

      expect(result.enhanced).toBe(false);
      expect(result).not.toHaveProperty('llmInsights');
    });
  });

  describe('scaffold', () => {
    test('should generate FastAPI scaffold with templates', async () => {
      const result = await master.scaffold('fastapi', { name: 'my-api' });

      expect(result).toHaveProperty('files');
      expect(result.files['main.py']).toBeDefined();
      expect(result.files['requirements.txt']).toBeDefined();
      expect(result.files['README.md']).toBeDefined();
      expect(result.generatedBy).toBe('template');
      expect(result.files['main.py']).toContain('FastAPI');
    });

    test('should use Ollama for AI-generated scaffold', async () => {
      const mockScaffold = `
\`\`\`python // main.py
from fastapi import FastAPI
app = FastAPI()
\`\`\`
`;

      OllamaClient.mockImplementation(() => ({
        generateScaffold: jest.fn().mockResolvedValue(mockScaffold)
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const result = await masterWithOllama.scaffold('fastapi', {
        name: 'my-api',
        useAI: true
      });

      expect(result.generatedBy).toContain('ollama');
    });

    test('should fallback to templates if Ollama fails', async () => {
      OllamaClient.mockImplementation(() => ({
        generateScaffold: jest
          .fn()
          .mockRejectedValue(new Error('Ollama error'))
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const result = await masterWithOllama.scaffold('fastapi', {
        name: 'my-api',
        useAI: true
      });

      expect(result.generatedBy).toBe('template');
    });
  });

  describe('detectIssues', () => {
    test('should detect use of eval', async () => {
      const code = `
result = eval(user_input)
`;

      const result = await master.detectIssues(code);

      expect(
        result.some(i => i.type === 'dangerous_function')
      ).toBe(true);
      expect(result[0].severity).toBe('critical');
    });

    test('should detect SQL injection risk', async () => {
      const code = `
query = f"SELECT * FROM users WHERE id = {user_id}"
cursor.execute(query)
`;

      const result = await master.detectIssues(code);

      expect(result.some(i => i.type === 'sql_injection')).toBe(true);
    });

    test('should use Ollama for additional security checks', async () => {
      const mockIssues = {
        vulnerabilities: [
          { type: 'xss', severity: 'high', description: 'XSS vulnerability' }
        ]
      };

      OllamaClient.mockImplementation(() => ({
        detectSecurityIssues: jest.fn().mockResolvedValue(mockIssues)
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'def test(): pass';
      const result = await masterWithOllama.detectIssues(code);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some(i => i.type === 'xss')).toBe(true);
    });

    test('should fallback to basic detection if Ollama fails', async () => {
      OllamaClient.mockImplementation(() => ({
        detectSecurityIssues: jest
          .fn()
          .mockRejectedValue(new Error('Ollama error'))
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'result = eval(user_input)';
      const result = await masterWithOllama.detectIssues(code);

      expect(result.length).toBeGreaterThan(0);
      expect(
        result.some(i => i.type === 'dangerous_function')
      ).toBe(true);
    });
  });

  describe('optimize', () => {
    test('should return original code without Ollama', async () => {
      const code = 'def test(): pass';
      const result = await master.optimize(code);

      expect(result).toBe(code);
    });

    test('should use Ollama for optimization', async () => {
      const optimizedCode = 'def test() -> None: pass  # Optimized';

      OllamaClient.mockImplementation(() => ({
        optimizeCode: jest.fn().mockResolvedValue(optimizedCode)
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'def test(): pass';
      const result = await masterWithOllama.optimize(code);

      expect(result).toBe(optimizedCode);
    });

    test('should return original code if Ollama fails', async () => {
      OllamaClient.mockImplementation(() => ({
        optimizeCode: jest.fn().mockRejectedValue(new Error('Ollama error'))
      }));

      const masterWithOllama = new PythonMaster({
        useOllama: true
      });

      const code = 'def test(): pass';
      const result = await masterWithOllama.optimize(code);

      expect(result).toBe(code);
    });
  });

  describe('_basicAnalyze', () => {
    test('should count functions and classes', async () => {
      const code = `
class MyClass:
    def method1(self):
        pass
    
    def method2(self):
        pass

def standalone_function():
    pass
`;

      const result = await master._basicAnalyze(code);

      expect(result.metrics.functions).toBe(3);
      expect(result.metrics.classes).toBe(1);
      expect(result.metrics.lines).toBeGreaterThan(0);
    });
  });

  describe('_parseScaffoldResponse', () => {
    test('should parse files from Ollama response', () => {
      const response = `
\`\`\`python // app.py
from fastapi import FastAPI
\`\`\`

\`\`\`python // models.py
from pydantic import BaseModel
\`\`\`
`;

      const result = master._parseScaffoldResponse(response);

      expect(result['app.py']).toBeDefined();
      expect(result['models.py']).toBeDefined();
      expect(Object.keys(result).length).toBe(2);
    });

    test('should return full response if no files detected', () => {
      const response = 'Just some plain text';

      const result = master._parseScaffoldResponse(response);

      expect(result['generated.py']).toBeDefined();
      expect(result['generated.py']).toBe(response);
    });
  });
});
