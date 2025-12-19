/**
 * Ollama Client - Local LLM Integration
 * Conecta los maestros con modelos locales (Llama, Mistral, CodeLlama)
 */

class OllamaClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'http://localhost:11434';
    this.model = config.model || 'codellama';
    this.timeout = config.timeout || 120000; // 2 minutes
  }

  /**
   * Analizar código con LLM local
   */
  async analyzeCode(code, language, prompt) {
    const fullPrompt = `
You are a ${language} expert. Analyze the following code and provide:
1. Issues and potential bugs
2. Best practices violations
3. Optimization suggestions
4. Security concerns

Code:
\`\`\`${language}
${code}
\`\`\`

${prompt || 'Provide detailed analysis in JSON format.'}
`;

    const response = await this.generate(fullPrompt);
    return this.parseResponse(response);
  }

  /**
   * Generar código scaffold con LLM
   */
  async generateScaffold(projectType, language, options) {
    const prompt = `
Generate a ${projectType} project structure in ${language} with:
- Modern best practices (2025)
- ${JSON.stringify(options)}
- Complete, production-ready code

Return only the code, no explanations.
`;

    return await this.generate(prompt);
  }

  /**
   * Optimizar código existente
   */
  async optimizeCode(code, language) {
    const prompt = `
Optimize the following ${language} code:
- Improve performance
- Reduce complexity
- Follow best practices
- Maintain functionality

Original code:
\`\`\`${language}
${code}
\`\`\`

Return only the optimized code.
`;

    return await this.generate(prompt);
  }

  /**
   * Detectar vulnerabilidades de seguridad
   */
  async detectSecurityIssues(code, language) {
    const prompt = `
Analyze security vulnerabilities in this ${language} code:
\`\`\`${language}
${code}
\`\`\`

Return JSON with:
{
  "vulnerabilities": [
    {
      "type": "sql_injection",
      "severity": "high",
      "line": 10,
      "description": "...",
      "fix": "..."
    }
  ]
}
`;

    const response = await this.generate(prompt);
    return this.parseResponse(response);
  }

  /**
   * Llamada principal a Ollama API
   */
  async generate(prompt) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9
          }
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error(`Failed to connect to Ollama: ${error.message}`);
    }
  }

  /**
   * Parse respuesta de LLM (intenta extraer JSON)
   */
  parseResponse(response) {
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { raw: response };
    } catch (error) {
      return { raw: response };
    }
  }

  /**
   * Verificar si Ollama está disponible
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`, {
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Listar modelos disponibles
   */
  async listModels() {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
}

module.exports = OllamaClient;
