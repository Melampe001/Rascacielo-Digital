/**
 * ELARA Agent - Elite AI Ensemble
 *
 * Meta-agente que orquesta las 10 IAs más avanzadas de 2025
 * para proporcionar razonamiento, coding, análisis multimodal y research
 * con verificación cruzada y consensus automático.
 */

const axios = require('axios');
const DEFAULT_CONFIG = require('./elara-config');

class ElaraAgent {
  constructor(config = {}) {
    // Merge configs properly
    const useConsensus = config.consensus !== false;

    this.config = {
      ...DEFAULT_CONFIG,
      mode: config.mode || 'balanced',
      consensus: useConsensus,
      verbose: config.verbose || false,
      enabledProviders: config.enabledProviders || DEFAULT_CONFIG.enabledProviders,
      // Allow overriding specific nested config
      providers: { ...DEFAULT_CONFIG.providers, ...(config.providers || {}) },
      modes: { ...DEFAULT_CONFIG.modes, ...(config.modes || {}) },
      limits: { ...DEFAULT_CONFIG.limits, ...(config.limits || {}) },
      consensusConfig: { ...DEFAULT_CONFIG.consensus, ...(config.consensusConfig || {}) },
      taskTypeMap: { ...DEFAULT_CONFIG.taskTypeMap, ...(config.taskTypeMap || {}) }
    };

    // Telemetry data
    this.stats = {
      totalCalls: 0,
      totalTokens: 0,
      totalCost: 0,
      byProvider: {},
      errors: 0,
      successes: 0
    };

    // Initialize provider stats
    this.config.enabledProviders.forEach(provider => {
      this.stats.byProvider[provider] = {
        calls: 0,
        tokens: 0,
        cost: 0,
        latency: [],
        errors: 0
      };
    });

    this._log('info', 'ELARA Agent initialized', {
      mode: this.config.mode,
      consensus: this.config.consensus,
      providers: this.config.enabledProviders.length
    });
  }

  /**
   * Ejecuta una tarea utilizando el ensemble de IAs
   * @param {Object} params - Parámetros de la tarea
   * @param {string} params.task - Descripción de la tarea a realizar
   * @param {string} params.mode - Modo de operación (speed, quality, cost, balanced)
   * @param {string} params.taskType - Tipo de tarea (reasoning, coding, multimodal, research)
   * @param {boolean} params.consensus - Usar verificación de consensus
   * @param {number} params.maxCost - Límite de costo para esta tarea
   * @returns {Promise<Object>} - Resultado con respuesta, confianza y metadata
   */
  async execute(params) {
    const startTime = Date.now();

    try {
      this._log('info', 'Executing task', { mode: params.mode || this.config.mode });

      // Validar parámetros
      await this.validate(params);

      // Determinar configuración de ejecución
      const mode = params.mode || this.config.mode;
      const useConsensus =
        params.consensus !== undefined ? params.consensus : this.config.consensus;
      const taskType = params.taskType || 'reasoning';

      // Seleccionar modelos óptimos
      const selectedModels = this._selectOptimalModels(taskType, mode, params.constraints || {});
      this._log('info', `Selected models: ${selectedModels.map(m => m.provider).join(', ')}`);

      // Ejecutar en paralelo según configuración
      const numModels = useConsensus ? this.config.modes[mode].consensusModels : 1;
      const modelsToUse = selectedModels.slice(0, numModels);

      const responses = await Promise.all(
        modelsToUse.map(model => this._callWithRetry(model, params.task))
      );

      // Procesar resultados
      let finalResult;
      let confidence = 1.0;

      if (useConsensus && responses.length > 1) {
        const consensusResult = await this._consensusVerification(params.task, responses);
        finalResult = consensusResult.result;
        confidence = consensusResult.confidence;
      } else {
        finalResult = responses[0].result;
      }

      const duration = Date.now() - startTime;

      this._log('info', `Task completed in ${duration}ms`, { confidence });

      return {
        success: true,
        result: finalResult,
        confidence,
        duration,
        metadata: {
          mode,
          modelsUsed: modelsToUse.map(m => m.provider),
          consensus: useConsensus,
          taskType,
          responses: responses.length
        }
      };
    } catch (error) {
      this.stats.errors++;
      this._log('error', 'Task execution failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Valida los parámetros de entrada
   * @param {Object} params - Parámetros a validar
   * @returns {Promise<boolean>}
   */
  async validate(params) {
    if (!params.task || (typeof params.task === 'string' && params.task.trim().length === 0)) {
      throw new Error('Task parameter is required');
    }

    if (typeof params.task !== 'string') {
      throw new Error('Task must be a string');
    }

    // Trim whitespace
    params.task = params.task.trim();

    if (params.task.length === 0) {
      throw new Error('Task cannot be empty');
    }

    if (params.task.length > this.config.limits.maxTokensPerRequest * 4) {
      throw new Error(
        `Task exceeds maximum length of ${this.config.limits.maxTokensPerRequest * 4} characters`
      );
    }

    if (params.mode && !['speed', 'quality', 'cost', 'balanced'].includes(params.mode)) {
      throw new Error('Invalid mode. Must be: speed, quality, cost, or balanced');
    }

    if (params.taskType && !this.config.taskTypeMap[params.taskType]) {
      throw new Error(
        `Invalid taskType. Must be one of: ${Object.keys(this.config.taskTypeMap).join(', ')}`
      );
    }

    // Sanitize input
    params.task = this._sanitizeInput(params.task);

    return true;
  }

  /**
   * Selecciona los modelos óptimos para una tarea
   * @private
   */
  _selectOptimalModels(taskType, mode, _constraints) {
    const requiredCapabilities = this.config.taskTypeMap[taskType] || ['reasoning'];
    const modeConfig = this.config.modes[mode];

    // Score each provider
    const scoredProviders = this.config.enabledProviders
      .map(providerId => {
        const provider = this.config.providers[providerId];
        if (!provider) return null;

        let score = 0;

        // Capability match
        const capabilityMatch = requiredCapabilities.filter(cap =>
          provider.capabilities.includes(cap)
        ).length;
        score += capabilityMatch * 10;

        // Preferred capabilities bonus
        if (modeConfig.preferredCapabilities) {
          const preferredMatch = modeConfig.preferredCapabilities.filter(cap =>
            provider.capabilities.includes(cap)
          ).length;
          score += preferredMatch * 5;
        }

        // Priority weight
        score += provider.priority;

        // Mode-specific adjustments
        if (mode === 'speed') {
          score -= provider.costPerToken * 100000; // Penalize expensive models
          // Boost speed-capable models
          if (provider.capabilities.includes('speed')) {
            score += 20;
          }
        } else if (mode === 'cost') {
          score -= provider.costPerToken * 500000; // Heavy penalty for expensive
        } else if (mode === 'quality') {
          score += provider.priority * 2; // Double priority weight
        }

        return {
          provider: providerId,
          score,
          config: provider
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => b.score - a.score);

    return scoredProviders;
  }

  /**
   * Llama a un provider con retry logic
   * @private
   */
  async _callWithRetry(modelConfig, task, maxRetries = null) {
    const retries = maxRetries || this.config.limits.maxRetries;
    let lastError;
    const startTime = Date.now();

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await this._callProvider(modelConfig, task);

        // Log successful call
        const latency = Date.now() - startTime;
        this._logCall(modelConfig.provider, result.tokens || 0, latency, result.cost || 0, true);

        return result;
      } catch (error) {
        lastError = error;
        this._log('warn', `Retry ${attempt + 1}/${retries} for ${modelConfig.provider}`, {
          error: error.message
        });

        if (attempt < retries - 1) {
          const delay = this.config.limits.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed, try fallback
    this._log('error', `All retries failed for ${modelConfig.provider}`);
    this._logCall(modelConfig.provider, 0, Date.now() - startTime, 0, false);

    throw new Error(`Failed to call ${modelConfig.provider}: ${lastError.message}`);
  }

  /**
   * Llama a un provider de IA
   * @private
   */
  async _callProvider(modelConfig, task) {
    const provider = modelConfig.config;
    const apiKey = this._getApiKey(modelConfig.provider);

    if (!apiKey) {
      throw new Error(`API key not found for ${modelConfig.provider}`);
    }

    const timeout = this.config.limits.requestTimeout;

    try {
      // Build request based on provider
      const requestData = this._buildRequest(modelConfig.provider, provider, task);
      const headers = this._buildHeaders(modelConfig.provider, apiKey);

      const response = await axios.post(provider.endpoint, requestData, {
        headers,
        timeout
      });

      // Parse response based on provider
      const result = this._parseResponse(modelConfig.provider, response.data);

      return {
        result: result.content,
        tokens: result.tokens,
        cost: result.tokens * provider.costPerToken,
        provider: modelConfig.provider
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`API error: ${error.message}`);
    }
  }

  /**
   * Construye el request para un provider específico
   * @private
   */
  _buildRequest(providerId, provider, task) {
    // OpenAI-compatible format (most providers)
    const baseRequest = {
      model: provider.model,
      messages: [{ role: 'user', content: task }],
      max_tokens: Math.min(4000, provider.maxTokens),
      temperature: 0.7
    };

    // Provider-specific adjustments
    if (providerId.startsWith('google_')) {
      return {
        contents: [
          {
            parts: [{ text: task }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7
        }
      };
    }

    if (providerId === 'anthropic_claude') {
      return {
        model: provider.model,
        messages: [{ role: 'user', content: task }],
        max_tokens: 4000,
        temperature: 0.7
      };
    }

    return baseRequest;
  }

  /**
   * Construye los headers para un provider
   * @private
   */
  _buildHeaders(providerId, apiKey) {
    if (providerId.startsWith('google_')) {
      return {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      };
    }

    if (providerId === 'anthropic_claude') {
      return {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      };
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    };
  }

  /**
   * Parsea la respuesta de un provider
   * @private
   */
  _parseResponse(providerId, data) {
    if (providerId.startsWith('google_')) {
      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        tokens: data.usageMetadata?.totalTokenCount || 0
      };
    }

    if (providerId === 'anthropic_claude') {
      return {
        content: data.content?.[0]?.text || '',
        tokens: data.usage?.total_tokens || 0
      };
    }

    // OpenAI-compatible format
    return {
      content: data.choices?.[0]?.message?.content || '',
      tokens: data.usage?.total_tokens || 0
    };
  }

  /**
   * Obtiene la API key desde el entorno
   * @private
   */
  _getApiKey(providerId) {
    const keyMap = {
      openai_o3: process.env.OPENAI_API_KEY,
      openai_gpt4o: process.env.OPENAI_API_KEY,
      google_gemini3: process.env.GOOGLE_API_KEY,
      google_gemini2_flash: process.env.GOOGLE_API_KEY,
      anthropic_claude: process.env.ANTHROPIC_API_KEY,
      meta_llama4: process.env.TOGETHER_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY,
      xai_grok: process.env.XAI_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY
    };

    return keyMap[providerId];
  }

  /**
   * Verifica consensus entre múltiples respuestas
   * @private
   */
  async _consensusVerification(task, responses) {
    if (responses.length === 1) {
      return { result: responses[0].result, confidence: 1.0 };
    }

    // Simple similarity check based on response length and content overlap
    const similarities = [];
    for (let i = 0; i < responses.length; i++) {
      for (let j = i + 1; j < responses.length; j++) {
        const sim = this._calculateSimilarity(responses[i].result, responses[j].result);
        similarities.push(sim);
      }
    }

    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    if (avgSimilarity >= this.config.consensusConfig.similarityThreshold) {
      // Consensus achieved - return longest response
      const bestResponse = responses.reduce((best, curr) =>
        curr.result.length > best.result.length ? curr : best
      );

      return {
        result: bestResponse.result,
        confidence: Math.min(avgSimilarity, 1.0)
      };
    }

    // No consensus - use judge if configured
    if (this.config.consensusConfig.useJudgeOnDisagreement) {
      this._log('info', 'No consensus reached, using judge model');
      return await this._judgeResponses(task, responses);
    }

    // Return response from highest priority model
    const bestResponse = responses.reduce((best, curr) => {
      const bestPriority = this.config.providers[best.provider]?.priority || 0;
      const currPriority = this.config.providers[curr.provider]?.priority || 0;
      return currPriority > bestPriority ? curr : best;
    });

    return {
      result: bestResponse.result,
      confidence: avgSimilarity
    };
  }

  /**
   * Usa un modelo judge para resolver desacuerdos
   * @private
   */
  async _judgeResponses(task, responses) {
    const judgeProvider = this.config.providers[this.config.consensusConfig.judgeProvider];
    if (!judgeProvider) {
      throw new Error('Judge provider not configured');
    }

    const judgeTask =
      `Given the task: "${task}"\n\nEvaluate these ${responses.length} responses and provide the best answer:\n\n` +
      responses.map((r, i) => `Response ${i + 1}:\n${r.result}\n`).join('\n') +
      '\n\nProvide the best final answer:';

    const judgeModel = {
      provider: this.config.consensusConfig.judgeProvider,
      config: judgeProvider
    };

    const judgeResult = await this._callWithRetry(judgeModel, judgeTask);

    return {
      result: judgeResult.result,
      confidence: 0.85 // High confidence in judge
    };
  }

  /**
   * Calcula similitud entre dos textos
   * @private
   */
  _calculateSimilarity(text1, text2) {
    // Early return for identical texts
    if (text1 === text2) return 1.0;

    // Simple word-based similarity with better handling
    const words1 = text1
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 0);
    const words2 = text2
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 0);

    if (words1.length === 0 && words2.length === 0) return 1.0;
    if (words1.length === 0 || words2.length === 0) return 0.0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = [...set1].filter(w => set2.has(w)).length;
    const union = new Set([...set1, ...set2]).size;

    return union > 0 ? intersection / union : 0;
  }

  /**
   * Sanitiza inputs para seguridad
   * @private
   */
  _sanitizeInput(input) {
    // Remove potential injection attempts
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  /**
   * Registra una llamada en telemetría
   * @private
   */
  _logCall(provider, tokens, latency, cost, success) {
    this.stats.totalCalls++;
    this.stats.totalTokens += tokens;
    this.stats.totalCost += cost;

    if (success) {
      this.stats.successes++;
    } else {
      this.stats.errors++;
    }

    if (this.stats.byProvider[provider]) {
      this.stats.byProvider[provider].calls++;
      this.stats.byProvider[provider].tokens += tokens;
      this.stats.byProvider[provider].cost += cost;
      this.stats.byProvider[provider].latency.push(latency);
      if (!success) {
        this.stats.byProvider[provider].errors++;
      }
    }
  }

  /**
   * Logging estructurado
   * @private
   */
  _log(level, message, data = {}) {
    if (!this.config.verbose && level === 'info') return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] [ELARA] ${message}`;

    switch (level) {
    case 'error':
      console.error(logMessage, data);
      break;
    case 'warn':
      console.warn(logMessage, data);
      break;
    default:
      console.log(logMessage, data);
    }
  }

  /**
   * Obtiene estadísticas de uso
   * @returns {Object} - Estadísticas agregadas
   */
  getUsageStats() {
    // Calculate averages
    const statsWithAverages = { ...this.stats };

    Object.keys(statsWithAverages.byProvider).forEach(provider => {
      const providerStats = statsWithAverages.byProvider[provider];
      if (providerStats.latency.length > 0) {
        providerStats.avgLatency =
          providerStats.latency.reduce((a, b) => a + b, 0) / providerStats.latency.length;
      } else {
        providerStats.avgLatency = 0;
      }
      delete providerStats.latency; // Remove raw latency array
    });

    return statsWithAverages;
  }

  /**
   * Manejo de rollback (requerido por interfaz de agente)
   * @returns {Promise<Object>}
   */
  async rollback() {
    this._log('info', 'Rollback called - ELARA is stateless, no rollback needed');
    return { success: true, message: 'ELARA is stateless, no rollback needed' };
  }
}

module.exports = ElaraAgent;
