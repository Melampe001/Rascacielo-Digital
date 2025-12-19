#!/usr/bin/env node

/**
 * Ollama Manager CLI
 * Gestiona instalación y configuración de Ollama
 */

const OllamaClient = require('../modules/ollama-client');

async function main() {
  const ollama = new OllamaClient();

  console.log('🤖 Ollama Manager - Rascacielo Digital');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check Ollama status
  console.log('Checking Ollama status...');
  const isHealthy = await ollama.checkHealth();

  if (!isHealthy) {
    console.log('❌ Ollama is not running or not installed');
    console.log('\nTo install Ollama:');
    console.log(
      '  macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh'
    );
    console.log('  Windows: Download from https://ollama.ai/download\n');
    console.log('Then run: ollama serve');
    process.exit(1);
  }

  console.log('✅ Ollama is running\n');

  // List models
  console.log('Available models:');
  const models = await ollama.listModels();

  if (models.length === 0) {
    console.log('  No models installed\n');
    console.log('Install recommended models:');
    console.log('  ollama pull codellama:13b');
    console.log('  ollama pull mistral:7b');
  } else {
    models.forEach(model => {
      console.log(`  ✓ ${model.name} (${(model.size / 1e9).toFixed(1)}GB)`);
    });
  }

  console.log('\n📝 Usage in code:');
  console.log(`
const { PythonMaster } = require('./agents/masters');

const master = new PythonMaster({
  useOllama: true,
  ollamaModel: 'codellama:13b'
});

// Análisis profundo con LLM
const analysis = await master.analyze(code, { deep: true });

// Scaffolding con AI
const project = await master.scaffold('fastapi', { 
  name: 'my-api',
  useAI: true 
});
  `);
}

main().catch(console.error);
