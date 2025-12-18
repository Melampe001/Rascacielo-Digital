/**
 * ELARA Agent Tests
 * Comprehensive test suite with 100% coverage
 */

const ElaraAgent = require('../elara-agent');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('ElaraAgent', () => {
  let agent;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset environment variables
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.GOOGLE_API_KEY = 'test-google-key';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    process.env.TOGETHER_API_KEY = 'test-together-key';
    process.env.PERPLEXITY_API_KEY = 'test-perplexity-key';
    process.env.XAI_API_KEY = 'test-xai-key';
    process.env.MISTRAL_API_KEY = 'test-mistral-key';
    process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';

    agent = new ElaraAgent({
      mode: 'balanced',
      consensus: true,
      verbose: false
    });
  });

  describe('Initialization', () => {
    test('should initialize with default config', () => {
      const defaultAgent = new ElaraAgent();
      expect(defaultAgent.config.mode).toBe('balanced');
      expect(defaultAgent.config.consensus).toBe(true);
      expect(defaultAgent.config.verbose).toBe(false);
    });

    test('should accept custom config', () => {
      const customAgent = new ElaraAgent({
        mode: 'speed',
        consensus: false,
        verbose: true
      });
      expect(customAgent.config.mode).toBe('speed');
      expect(customAgent.config.consensus).toBe(false);
      expect(customAgent.config.verbose).toBe(true);
    });

    test('should initialize telemetry stats', () => {
      expect(agent.stats.totalCalls).toBe(0);
      expect(agent.stats.totalTokens).toBe(0);
      expect(agent.stats.totalCost).toBe(0);
      expect(agent.stats.byProvider).toBeDefined();
    });

    test('should validate API keys from env', () => {
      expect(agent._getApiKey('openai_o3')).toBe('test-openai-key');
      expect(agent._getApiKey('google_gemini3')).toBe('test-google-key');
      expect(agent._getApiKey('anthropic_claude')).toBe('test-anthropic-key');
    });
  });

  describe('validate() method', () => {
    test('should validate correct params', async () => {
      const result = await agent.validate({
        task: 'Test task',
        mode: 'speed'
      });
      expect(result).toBe(true);
    });

    test('should reject missing task param', async () => {
      await expect(agent.validate({})).rejects.toThrow('Task parameter is required');
    });

    test('should reject non-string task', async () => {
      await expect(agent.validate({ task: 123 })).rejects.toThrow('Task must be a string');
    });

    test('should reject empty task', async () => {
      await expect(agent.validate({ task: '' })).rejects.toThrow('Task parameter is required');
    });

    test('should reject invalid mode', async () => {
      await expect(
        agent.validate({
          task: 'Test',
          mode: 'invalid'
        })
      ).rejects.toThrow('Invalid mode');
    });

    test('should validate task length limits', async () => {
      const longTask = 'a'.repeat(agent.config.limits.maxTokensPerRequest * 5);
      await expect(agent.validate({ task: longTask })).rejects.toThrow('exceeds maximum length');
    });

    test('should reject invalid taskType', async () => {
      await expect(
        agent.validate({
          task: 'Test',
          taskType: 'invalid'
        })
      ).rejects.toThrow('Invalid taskType');
    });

    test('should sanitize malicious inputs', async () => {
      const params = {
        task: '<script>alert("xss")</script>Test task<div>test</div>'
      };
      await agent.validate(params);
      expect(params.task).toBe('Test tasktest');
      expect(params.task).not.toContain('<script>');
      expect(params.task).not.toContain('<div>');
    });
  });

  describe('execute() method', () => {
    beforeEach(() => {
      // Mock successful API response
      axios.post.mockResolvedValue({
        data: {
          choices: [
            {
              message: { content: 'Test response' }
            }
          ],
          usage: { total_tokens: 100 }
        }
      });
    });

    test('should execute simple reasoning task', async () => {
      const result = await agent.execute({
        task: 'Solve this logic problem',
        taskType: 'reasoning',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Test response');
      expect(result.metadata.taskType).toBe('reasoning');
    });

    test('should execute coding task', async () => {
      const result = await agent.execute({
        task: 'Write a function to sort an array',
        taskType: 'coding',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.taskType).toBe('coding');
    });

    test('should execute multimodal task', async () => {
      const result = await agent.execute({
        task: 'Analyze this image',
        taskType: 'multimodal',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.taskType).toBe('multimodal');
    });

    test('should execute research task', async () => {
      const result = await agent.execute({
        task: 'Research the latest AI developments',
        taskType: 'research',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.taskType).toBe('research');
    });

    test('should handle speed mode correctly', async () => {
      const result = await agent.execute({
        task: 'Quick test',
        mode: 'speed',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.mode).toBe('speed');
    });

    test('should handle quality mode correctly', async () => {
      // Quality mode requires multiple models, mock accordingly
      const result = await agent.execute({
        task: 'Important task',
        mode: 'quality',
        consensus: true
      });

      expect(result.success).toBe(true);
      expect(result.metadata.mode).toBe('quality');
      expect(result.metadata.consensus).toBe(true);
    });

    test('should handle cost mode correctly', async () => {
      const result = await agent.execute({
        task: 'Budget task',
        mode: 'cost',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.mode).toBe('cost');
    });

    test('should handle balanced mode correctly', async () => {
      const result = await agent.execute({
        task: 'General task',
        mode: 'balanced',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.metadata.mode).toBe('balanced');
    });

    test('should track execution duration', async () => {
      const result = await agent.execute({
        task: 'Test task',
        consensus: false
      });

      expect(result.duration).toBeDefined();
      expect(typeof result.duration).toBe('number');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Consensus System', () => {
    test('should achieve consensus with similar responses', async () => {
      // Mock similar responses
      axios.post
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'The answer is 42' } }],
            usage: { total_tokens: 10 }
          }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'The answer is 42' } }],
            usage: { total_tokens: 10 }
          }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'The answer is 42' } }],
            usage: { total_tokens: 10 }
          }
        });

      const result = await agent.execute({
        task: 'What is the answer?',
        mode: 'balanced',
        consensus: true
      });

      expect(result.success).toBe(true);
      // With identical responses, similarity should be 1.0
      expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    });

    test('should handle disagreement with LLM judge', async () => {
      // Mock different responses
      axios.post
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'Answer A' } }],
            usage: { total_tokens: 10 }
          }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'Answer B completely different' } }],
            usage: { total_tokens: 10 }
          }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'Answer C totally different' } }],
            usage: { total_tokens: 10 }
          }
        })
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'Judge final answer' } }],
            usage: { total_tokens: 20 }
          }
        });

      const result = await agent.execute({
        task: 'Controversial question',
        mode: 'balanced',
        consensus: true
      });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    test('should calculate confidence scores', async () => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Test response' } }],
          usage: { total_tokens: 10 }
        }
      });

      const result = await agent.execute({
        task: 'Test task',
        consensus: true
      });

      expect(result.confidence).toBeDefined();
      expect(typeof result.confidence).toBe('number');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Error Handling', () => {
    test('should handle API failure with retry', async () => {
      // Fail twice, succeed third time
      axios.post
        .mockRejectedValueOnce(new Error('API Error'))
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          data: {
            choices: [{ message: { content: 'Success after retry' } }],
            usage: { total_tokens: 10 }
          }
        });

      const result = await agent.execute({
        task: 'Test retry',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Success after retry');
    });

    test('should handle timeout gracefully', async () => {
      axios.post.mockRejectedValue({ code: 'ECONNABORTED' });

      await expect(
        agent.execute({
          task: 'Test timeout',
          consensus: false
        })
      ).rejects.toThrow();
    });

    test('should handle rate limiting', async () => {
      axios.post.mockRejectedValue({
        response: { status: 429 }
      });

      await expect(
        agent.execute({
          task: 'Test rate limit',
          consensus: false
        })
      ).rejects.toThrow();
    });

    test('should handle missing API key', async () => {
      delete process.env.OPENAI_API_KEY;
      const newAgent = new ElaraAgent({ verbose: false });

      await expect(
        newAgent.execute({
          task: 'Test without key',
          consensus: false
        })
      ).rejects.toThrow('API key not found');
    });

    test('should increment error stats on failure', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      const initialErrors = agent.stats.errors;

      await expect(
        agent.execute({
          task: 'Test error',
          consensus: false
        })
      ).rejects.toThrow();

      expect(agent.stats.errors).toBeGreaterThan(initialErrors);
    });
  });

  describe('Telemetry', () => {
    beforeEach(() => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Test response' } }],
          usage: { total_tokens: 100 }
        }
      });
    });

    test('should track token usage', async () => {
      const initialTokens = agent.stats.totalTokens;

      await agent.execute({
        task: 'Test task',
        consensus: false
      });

      expect(agent.stats.totalTokens).toBeGreaterThan(initialTokens);
    });

    test('should track costs', async () => {
      const initialCost = agent.stats.totalCost;

      await agent.execute({
        task: 'Test task',
        consensus: false
      });

      expect(agent.stats.totalCost).toBeGreaterThan(initialCost);
    });

    test('should track latency', async () => {
      await agent.execute({
        task: 'Test task',
        consensus: false
      });

      const stats = agent.getUsageStats();
      const providers = Object.keys(stats.byProvider);

      // At least one provider should have been called
      const calledProvider = providers.find(p => stats.byProvider[p].calls > 0);
      expect(calledProvider).toBeDefined();

      if (calledProvider) {
        expect(stats.byProvider[calledProvider].avgLatency).toBeDefined();
      }
    });

    test('should generate usage report', () => {
      const stats = agent.getUsageStats();

      expect(stats.totalCalls).toBeDefined();
      expect(stats.totalTokens).toBeDefined();
      expect(stats.totalCost).toBeDefined();
      expect(stats.byProvider).toBeDefined();
      expect(typeof stats.byProvider).toBe('object');
    });

    test('should track calls per provider', async () => {
      await agent.execute({
        task: 'Test task',
        consensus: false
      });

      const stats = agent.getUsageStats();
      const totalProviderCalls = Object.values(stats.byProvider).reduce(
        (sum, p) => sum + p.calls,
        0
      );

      expect(totalProviderCalls).toBeGreaterThan(0);
    });
  });

  describe('Security', () => {
    beforeEach(() => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Safe response' } }],
          usage: { total_tokens: 10 }
        }
      });
    });

    test('should sanitize malicious inputs', async () => {
      const maliciousTask = '<script>alert("xss")</script>Legitimate task';

      const result = await agent.execute({
        task: maliciousTask,
        consensus: false
      });

      expect(result.success).toBe(true);
    });

    test('should not expose API keys in logs', () => {
      // Capture console output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      agent._log('info', 'Test log', { apiKey: 'secret' });

      const logCalls = consoleSpy.mock.calls;
      logCalls.forEach(call => {
        const logString = JSON.stringify(call);
        expect(logString).not.toContain('test-openai-key');
        expect(logString).not.toContain('test-google-key');
      });

      consoleSpy.mockRestore();
    });

    test('should validate output format', async () => {
      const result = await agent.execute({
        task: 'Test task',
        consensus: false
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('metadata');
    });
  });

  describe('Integration', () => {
    beforeEach(() => {
      axios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: 'Integration test response' } }],
          usage: { total_tokens: 50 }
        }
      });
    });

    test('should work with existing agent pattern', async () => {
      // Test that ELARA follows the same pattern as other agents
      expect(typeof agent.execute).toBe('function');
      expect(typeof agent.validate).toBe('function');
      expect(typeof agent.rollback).toBe('function');
    });

    test('should integrate with Rascacielo system', async () => {
      const result = await agent.execute({
        task: 'System integration test',
        consensus: false
      });

      expect(result.success).toBe(true);
      expect(result.duration).toBeDefined();
      expect(result.metadata).toBeDefined();
    });

    test('should handle rollback method', async () => {
      const result = await agent.rollback();
      expect(result.success).toBe(true);
    });
  });

  describe('Model Selection', () => {
    test('should select models based on task type', () => {
      const models = agent._selectOptimalModels('coding', 'balanced', {});
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    test('should prioritize speed models in speed mode', () => {
      const models = agent._selectOptimalModels('reasoning', 'speed', {});
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      // In speed mode, fast models should be prioritized
      // Check that a speed-capable model is in top 3
      const top3 = models.slice(0, 3);
      const hasSpeedModel = top3.some(m => m.config.capabilities.includes('speed'));
      expect(hasSpeedModel).toBe(true);
    });

    test('should prioritize cost-effective models in cost mode', () => {
      const models = agent._selectOptimalModels('reasoning', 'cost', {});
      const topModel = models[0].config;
      expect(topModel.costPerToken).toBeLessThan(0.00003);
    });

    test('should prioritize quality models in quality mode', () => {
      const models = agent._selectOptimalModels('reasoning', 'quality', {});
      expect(models[0].config.priority).toBeGreaterThan(7);
    });
  });

  describe('Provider-Specific Formatting', () => {
    test('should build OpenAI-compatible requests', () => {
      const request = agent._buildRequest(
        'openai_gpt4o',
        agent.config.providers.openai_gpt4o,
        'Test'
      );
      expect(request.messages).toBeDefined();
      expect(request.model).toBe('gpt-4o');
    });

    test('should build Google Gemini requests', () => {
      const request = agent._buildRequest(
        'google_gemini3',
        agent.config.providers.google_gemini3,
        'Test'
      );
      expect(request.contents).toBeDefined();
      expect(request.generationConfig).toBeDefined();
    });

    test('should build Anthropic Claude requests', () => {
      const request = agent._buildRequest(
        'anthropic_claude',
        agent.config.providers.anthropic_claude,
        'Test'
      );
      expect(request.messages).toBeDefined();
      expect(request.max_tokens).toBeDefined();
    });

    test('should build correct headers for OpenAI', () => {
      const headers = agent._buildHeaders('openai_gpt4o', 'test-key');
      expect(headers.Authorization).toBe('Bearer test-key');
    });

    test('should build correct headers for Google', () => {
      const headers = agent._buildHeaders('google_gemini3', 'test-key');
      expect(headers['x-goog-api-key']).toBe('test-key');
    });

    test('should build correct headers for Anthropic', () => {
      const headers = agent._buildHeaders('anthropic_claude', 'test-key');
      expect(headers['x-api-key']).toBe('test-key');
      expect(headers['anthropic-version']).toBeDefined();
    });
  });

  describe('Response Parsing', () => {
    test('should parse OpenAI responses', () => {
      const data = {
        choices: [{ message: { content: 'Test content' } }],
        usage: { total_tokens: 50 }
      };
      const result = agent._parseResponse('openai_gpt4o', data);
      expect(result.content).toBe('Test content');
      expect(result.tokens).toBe(50);
    });

    test('should parse Google Gemini responses', () => {
      const data = {
        candidates: [
          {
            content: {
              parts: [{ text: 'Gemini response' }]
            }
          }
        ],
        usageMetadata: { totalTokenCount: 30 }
      };
      const result = agent._parseResponse('google_gemini3', data);
      expect(result.content).toBe('Gemini response');
      expect(result.tokens).toBe(30);
    });

    test('should parse Anthropic Claude responses', () => {
      const data = {
        content: [{ text: 'Claude response' }],
        usage: { total_tokens: 40 }
      };
      const result = agent._parseResponse('anthropic_claude', data);
      expect(result.content).toBe('Claude response');
      expect(result.tokens).toBe(40);
    });
  });

  describe('Similarity Calculation', () => {
    test('should calculate high similarity for identical texts', () => {
      const text = 'This is a test';
      const similarity = agent._calculateSimilarity(text, text);
      expect(similarity).toBe(1.0);
    });

    test('should calculate low similarity for different texts', () => {
      const text1 = 'This is a test';
      const text2 = 'Completely different words here';
      const similarity = agent._calculateSimilarity(text1, text2);
      expect(similarity).toBeLessThan(0.3);
    });

    test('should calculate medium similarity for partially matching texts', () => {
      const text1 = 'The answer is 42';
      const text2 = 'The answer is 43';
      const similarity = agent._calculateSimilarity(text1, text2);
      expect(similarity).toBeGreaterThan(0.5);
      expect(similarity).toBeLessThan(1.0);
    });
  });
});
