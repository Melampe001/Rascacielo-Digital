/**
 * Ollama Client Tests
 */

const OllamaClient = require('../ollama-client');

// Mock fetch globally
global.fetch = jest.fn();

describe('OllamaClient', () => {
  let client;

  beforeEach(() => {
    client = new OllamaClient({
      baseURL: 'http://localhost:11434',
      model: 'codellama',
      timeout: 120000
    });
    jest.clearAllMocks();
  });

  test('should create client with config', () => {
    expect(client.baseURL).toBe('http://localhost:11434');
    expect(client.model).toBe('codellama');
    expect(client.timeout).toBe(120000);
  });

  test('should use default config values', () => {
    const defaultClient = new OllamaClient();
    expect(defaultClient.baseURL).toBe('http://localhost:11434');
    expect(defaultClient.model).toBe('codellama');
    expect(defaultClient.timeout).toBe(120000);
  });

  describe('generate', () => {
    test('should call Ollama API with correct parameters', async () => {
      const mockResponse = {
        response: 'Generated code here'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.generate('Test prompt');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Test prompt')
        })
      );

      expect(result).toBe('Generated code here');
    });

    test('should throw error on API failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(client.generate('Test prompt')).rejects.toThrow('Failed to connect to Ollama');
    });

    test('should throw error on network failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.generate('Test prompt')).rejects.toThrow('Failed to connect to Ollama');
    });
  });

  describe('analyzeCode', () => {
    test('should analyze code and return parsed response', async () => {
      const mockResponse = {
        response: '{"issues": [], "suggestions": []}'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.analyzeCode('def hello(): pass', 'python', 'Analyze this');

      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('suggestions');
    });
  });

  describe('generateScaffold', () => {
    test('should generate scaffold code', async () => {
      const mockResponse = {
        response: 'Generated scaffold code'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.generateScaffold('fastapi', 'python', {
        name: 'my-api'
      });

      expect(result).toBe('Generated scaffold code');
    });
  });

  describe('optimizeCode', () => {
    test('should optimize code', async () => {
      const mockResponse = {
        response: 'Optimized code here'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.optimizeCode('def slow(): pass', 'python');

      expect(result).toBe('Optimized code here');
    });
  });

  describe('detectSecurityIssues', () => {
    test('should detect security issues', async () => {
      const mockResponse = {
        response: '{"vulnerabilities": [{"type": "sql_injection"}]}'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.detectSecurityIssues(
        'query = "SELECT * FROM users WHERE id=" + user_id',
        'python'
      );

      expect(result).toHaveProperty('vulnerabilities');
      expect(Array.isArray(result.vulnerabilities)).toBe(true);
    });
  });

  describe('parseResponse', () => {
    test('should parse JSON from response', () => {
      const response = 'Some text {"key": "value"} more text';
      const result = client.parseResponse(response);

      expect(result).toEqual({ key: 'value' });
    });

    test('should return raw response if no JSON found', () => {
      const response = 'Just plain text';
      const result = client.parseResponse(response);

      expect(result).toEqual({ raw: 'Just plain text' });
    });

    test('should return raw response on invalid JSON', () => {
      const response = '{"invalid json';
      const result = client.parseResponse(response);

      expect(result).toEqual({ raw: '{"invalid json' });
    });
  });

  describe('checkHealth', () => {
    test('should return true when Ollama is available', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await client.checkHealth();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/tags',
        expect.any(Object)
      );
    });

    test('should return false when Ollama is not available', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await client.checkHealth();

      expect(result).toBe(false);
    });

    test('should return false when API returns error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await client.checkHealth();

      expect(result).toBe(false);
    });
  });

  describe('listModels', () => {
    test('should list available models', async () => {
      const mockModels = {
        models: [
          { name: 'codellama:13b', size: 13000000000 },
          { name: 'mistral:7b', size: 7000000000 }
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModels
      });

      const result = await client.listModels();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('codellama:13b');
      expect(result[1].name).toBe('mistral:7b');
    });

    test('should return empty array if no models', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const result = await client.listModels();

      expect(result).toEqual([]);
    });

    test('should throw error on API failure', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Connection error'));

      await expect(client.listModels()).rejects.toThrow('Failed to list models');
    });
  });
});
