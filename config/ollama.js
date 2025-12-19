/**
 * Ollama Configuration
 */

module.exports = {
  enabled: process.env.OLLAMA_ENABLED === 'true',
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434',

  // Modelos recomendados por tarea
  models: {
    codeAnalysis: 'codellama:13b', // Análisis de código
    codeGeneration: 'codellama:34b', // Generación de código
    security: 'llama2:13b', // Análisis de seguridad
    general: 'mistral:7b' // Propósito general
  },

  // Configuración por lenguaje
  languageModels: {
    python: 'codellama:13b',
    javascript: 'codellama:7b',
    typescript: 'codellama:7b',
    go: 'codellama:13b',
    rust: 'codellama:13b'
  },

  // Timeouts
  timeout: {
    quick: 30000, // 30 segundos para análisis rápido
    deep: 120000, // 2 minutos para análisis profundo
    generate: 180000 // 3 minutos para generación
  },

  // Parámetros de generación
  generation: {
    temperature: 0.3, // Más determinístico
    top_p: 0.9,
    repeat_penalty: 1.1
  }
};
