# 🤖 Ollama Integration

Integración de LLMs locales para análisis inteligente de código.

## Requisitos

- **RAM mínima:** 8GB (16GB recomendado)
- **Storage:** 10-50GB según modelos
- **GPU:** Opcional (CUDA/ROCm para mejor rendimiento)

## Instalación

### 1. Instalar Ollama

**macOS/Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Descargar de https://ollama.ai/download

### 2. Iniciar Ollama

```bash
ollama serve
```

### 3. Instalar modelos

```bash
# Para análisis de código (13GB)
ollama pull codellama:13b

# Para propósito general (4GB)
ollama pull mistral:7b

# Para análisis rápido (4GB)
ollama pull codellama:7b
```

## Uso

### Con Python Master

```javascript
const { PythonMaster } = require('./agents/masters');

const master = new PythonMaster({
  useOllama: true,
  ollamaModel: 'codellama:13b'
});

// Análisis profundo
const analysis = await master.analyze(code, { deep: true });
console.log(analysis.llmInsights);
```

### Generar código con AI

```javascript
const { PythonMaster } = require('./agents/masters');

const master = new PythonMaster({
  useOllama: true
});

// Generar código con AI
const scaffold = await master.scaffold('fastapi', {
  name: 'my-api',
  useAI: true
});
```

### Optimizar código

```javascript
const optimizedCode = await master.optimize(originalCode);
console.log(optimizedCode);
```

### Detectar vulnerabilidades

```javascript
const issues = await master.detectIssues(code);
console.log(issues);
```

## Modelos Recomendados

| Tarea              | Modelo           | RAM  | Descripción                   |
| ------------------ | ---------------- | ---- | ----------------------------- |
| Análisis código    | codellama:13b    | 16GB | Mejor precisión               |
| Análisis rápido    | codellama:7b     | 8GB  | Balance velocidad/calidad     |
| Generación         | codellama:34b    | 32GB | Mejor generación              |
| Seguridad          | llama2:13b       | 16GB | Análisis de vulnerabilidades  |
| Propósito general  | mistral:7b       | 8GB  | Uso general                   |

## Performance

Con Ollama habilitado:

- Análisis básico: ~100ms (sin cambios)
- Análisis profundo: ~5-30s (según modelo)
- Generación scaffold: ~10-60s

## Troubleshooting

### Ollama no responde

```bash
# Verificar estado
ollama list

# Reiniciar
pkill ollama
ollama serve
```

### Memoria insuficiente

Usar modelos más pequeños:

```bash
ollama pull codellama:7b  # En lugar de :13b
```

### Error de conexión

Verificar que Ollama esté corriendo:

```bash
# Verificar con el manager
npm run ollama:check

# O manualmente
curl http://localhost:11434/api/tags
```

## Configuración

### Variables de entorno

```bash
# En .env
OLLAMA_ENABLED=true
OLLAMA_URL=http://localhost:11434
```

### Configuración por código

```javascript
const master = new PythonMaster({
  useOllama: true,
  ollamaModel: 'codellama:13b',
  ollamaURL: 'http://localhost:11434'
});
```

## Docker Deployment

Para usar Ollama con Docker:

```bash
# Iniciar servicios
docker-compose -f docker-compose.ollama.yml up -d

# Ver logs
docker-compose -f docker-compose.ollama.yml logs -f

# Detener servicios
docker-compose -f docker-compose.ollama.yml down
```

## Comandos NPM

```bash
# Verificar estado de Ollama
npm run ollama:check

# Iniciar con Docker
npm run ollama:docker
```

## Ejemplos Avanzados

### Análisis con contexto personalizado

```javascript
const analysis = await master.analyze(code, {
  deep: true,
  context: {
    framework: 'fastapi',
    version: '0.109.0',
    focus: 'security'
  }
});
```

### Scaffold con opciones avanzadas

```javascript
const project = await master.scaffold('fastapi', {
  name: 'my-advanced-api',
  useAI: true,
  features: ['auth', 'database', 'caching'],
  database: 'postgresql',
  auth: 'jwt'
});
```

## Limitaciones

- Requiere Ollama instalado y corriendo localmente
- El análisis profundo puede ser lento (5-30s)
- Los modelos grandes requieren mucha RAM
- No funciona sin conexión a Ollama

## Fallback Behavior

Si Ollama no está disponible:

- El sistema continúa funcionando con análisis básico
- Se registra una advertencia en la consola
- No se lanzan errores que rompan la aplicación

## Referencias

- [Ollama Oficial](https://ollama.ai)
- [CodeLlama Model](https://ollama.ai/library/codellama)
- [Mistral Model](https://ollama.ai/library/mistral)
