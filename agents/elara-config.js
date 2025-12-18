/**
 * ELARA Agent Configuration
 * Configuración centralizada para el meta-agente ensemble
 */

const DEFAULT_CONFIG = {
  // Providers habilitados (10 IAs elite de 2025)
  enabledProviders: [
    'openai_o3',
    'openai_gpt4o',
    'google_gemini3',
    'anthropic_claude',
    'meta_llama4',
    'perplexity',
    'xai_grok',
    'mistral',
    'deepseek',
    'google_gemini2_flash'
  ],

  // Configuración de endpoints por provider
  providers: {
    openai_o3: {
      name: 'OpenAI o3',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'o3',
      capabilities: ['reasoning', 'coding', 'multimodal'],
      priority: 10,
      costPerToken: 0.00006,
      maxTokens: 16000
    },
    openai_gpt4o: {
      name: 'OpenAI GPT-4o',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o',
      capabilities: ['speed', 'coding', 'multimodal'],
      priority: 8,
      costPerToken: 0.00002,
      maxTokens: 16000
    },
    google_gemini3: {
      name: 'Google Gemini 3.0 Ultra',
      endpoint:
        'https://generativelanguage.googleapis.com/v1/models/gemini-3.0-ultra:generateContent',
      model: 'gemini-3.0-ultra',
      capabilities: ['multimodal', 'reasoning', 'coding'],
      priority: 9,
      costPerToken: 0.00005,
      maxTokens: 32000
    },
    anthropic_claude: {
      name: 'Anthropic Claude Opus 4.1',
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-opus-4.1',
      capabilities: ['coding', 'reasoning', 'analysis'],
      priority: 9,
      costPerToken: 0.00005,
      maxTokens: 200000
    },
    meta_llama4: {
      name: 'Meta Llama 4 405B',
      endpoint: 'https://api.together.xyz/v1/chat/completions',
      model: 'meta-llama/Meta-Llama-4-405B-Instruct',
      capabilities: ['reasoning', 'coding', 'cost-effective'],
      priority: 7,
      costPerToken: 0.00001,
      maxTokens: 32000
    },
    perplexity: {
      name: 'Perplexity Sonar Pro',
      endpoint: 'https://api.perplexity.ai/chat/completions',
      model: 'sonar-pro',
      capabilities: ['research', 'web-search', 'real-time'],
      priority: 8,
      costPerToken: 0.00003,
      maxTokens: 16000
    },
    xai_grok: {
      name: 'xAI Grok 4',
      endpoint: 'https://api.x.ai/v1/chat/completions',
      model: 'grok-4',
      capabilities: ['research', 'web-integration', 'reasoning'],
      priority: 7,
      costPerToken: 0.00004,
      maxTokens: 16000
    },
    mistral: {
      name: 'Mistral Large 2',
      endpoint: 'https://api.mistral.ai/v1/chat/completions',
      model: 'mistral-large-2',
      capabilities: ['reasoning', 'coding', 'compliance'],
      priority: 7,
      costPerToken: 0.00003,
      maxTokens: 32000
    },
    deepseek: {
      name: 'DeepSeek V3',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-v3',
      capabilities: ['coding', 'reasoning', 'cost-effective'],
      priority: 8,
      costPerToken: 0.00001,
      maxTokens: 16000
    },
    google_gemini2_flash: {
      name: 'Google Gemini 2.0 Flash',
      endpoint:
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
      model: 'gemini-2.0-flash',
      capabilities: ['speed', 'fallback', 'cost-effective'],
      priority: 6,
      costPerToken: 0.000005,
      maxTokens: 16000
    }
  },

  // Modos de operación
  modes: {
    speed: {
      priority: 'latency',
      consensusModels: 1,
      preferredCapabilities: ['speed', 'fallback']
    },
    quality: {
      priority: 'accuracy',
      consensusModels: 5,
      preferredCapabilities: ['reasoning', 'coding']
    },
    cost: {
      priority: 'price',
      consensusModels: 2,
      preferredCapabilities: ['cost-effective']
    },
    balanced: {
      priority: 'balanced',
      consensusModels: 3,
      preferredCapabilities: ['reasoning', 'coding', 'speed']
    }
  },

  // Límites de seguridad
  limits: {
    maxTokensPerRequest: 16000,
    maxCostPerRequest: 10.0, // USD
    requestTimeout: 30000, // ms
    maxRetries: 3,
    retryDelay: 1000, // ms (exponential backoff)
    maxConcurrentRequests: 10
  },

  // Configuración de consensus
  consensus: {
    enabled: true,
    minAgreementRate: 0.7,
    similarityThreshold: 0.75,
    useJudgeOnDisagreement: true,
    judgeProvider: 'openai_o3'
  },

  // Task type mapping to capabilities
  taskTypeMap: {
    reasoning: ['reasoning'],
    coding: ['coding'],
    multimodal: ['multimodal'],
    research: ['research', 'web-search', 'real-time'],
    analysis: ['analysis', 'reasoning'],
    speed: ['speed', 'fallback']
  }
};

module.exports = DEFAULT_CONFIG;
