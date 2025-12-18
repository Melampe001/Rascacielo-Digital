# ELARA Architecture Documentation

## 🏗️ Arquitectura del Sistema

ELARA (Elite AI Ensemble) es un meta-agente que orquesta las 10 inteligencias artificiales más avanzadas de 2025 para proporcionar respuestas de máxima calidad mediante verificación cruzada y consensus automático.

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         ELARA Agent                              │
│                    (Elite AI Ensemble)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ├─── Validation Layer
                           │    (Input sanitization & validation)
                           │
                           ├─── Intelligent Router
                           │    ├─ Task Analysis
                           │    ├─ Mode Selection
                           │    └─ Model Scoring
                           │
                           ├─── Execution Layer
                           │    ├─ Parallel Execution
                           │    ├─ Retry Logic
                           │    └─ Fallback Chain
                           │
                           ├─── Consensus Engine
                           │    ├─ Similarity Analysis
                           │    ├─ Agreement Scoring
                           │    └─ Judge Arbitration
                           │
                           └─── Telemetry System
                                ├─ Token Tracking
                                ├─ Cost Monitoring
                                └─ Performance Metrics

┌─────────────────────────────────────────────────────────────────┐
│                      10 Elite AI Providers                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  OpenAI o3   │  │  GPT-4o      │  │ Gemini 3.0   │         │
│  │  Reasoning   │  │  Speed       │  │ Multimodal   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Claude Opus   │  │ Llama 4      │  │ Perplexity   │         │
│  │ 4.1 Coding   │  │ 405B Open    │  │ Sonar Pro    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Grok 4      │  │ Mistral      │  │ DeepSeek V3  │         │
│  │  Web Search  │  │ Large 2      │  │ Coding       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ Gemini 2.0   │                                               │
│  │ Flash        │                                               │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Decisiones

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ├─► Validate Input
     │   ├─ Check task parameter
     │   ├─ Sanitize malicious content
     │   └─ Validate mode & constraints
     │
     ├─► Analyze Task
     │   ├─ Determine task type (reasoning, coding, etc.)
     │   ├─ Select operation mode (speed, quality, cost, balanced)
     │   └─ Calculate required resources
     │
     ├─► Select Models
     │   ├─ Score providers by capabilities
     │   ├─ Apply mode-specific weights
     │   ├─ Filter by availability
     │   └─ Rank by composite score
     │
     ├─► Execute in Parallel
     │   ├─ Call selected models concurrently
     │   ├─ Apply timeout (30s)
     │   ├─ Retry on failure (3x exponential backoff)
     │   └─ Fallback to alternative provider
     │
     ├─► Consensus Verification?
     │   │
     │   ├─ YES (quality/balanced mode)
     │   │   ├─ Calculate inter-response similarity
     │   │   ├─ Check agreement threshold (>70%)
     │   │   │
     │   │   ├─ Consensus Achieved?
     │   │   │   ├─ YES → Return best response
     │   │   │   └─ NO → Use LLM Judge (o3)
     │   │   │
     │   │   └─ Return result + confidence score
     │   │
     │   └─ NO (speed/cost mode)
     │       └─ Return single best response
     │
     ├─► Update Telemetry
     │   ├─ Log tokens used
     │   ├─ Track costs
     │   ├─ Record latency
     │   └─ Update provider stats
     │
     └─► Return Result
         ├─ success: true/false
         ├─ result: string
         ├─ confidence: 0.0-1.0
         ├─ duration: milliseconds
         └─ metadata: { mode, models, etc. }
```

## 🧮 Consensus Algorithm

El sistema de consensus de ELARA garantiza máxima precisión mediante verificación cruzada:

### Paso 1: Ejecución Paralela

```javascript
// Ejecutar N modelos en paralelo según el modo
const responses = await Promise.all(selectedModels.map(model => callWithRetry(model, task)));
```

### Paso 2: Cálculo de Similitud

```
Similarity Score = |Intersection of Words| / |Union of Words|

Ejemplo:
Response A: "The answer is 42 because it is the ultimate answer"
Response B: "The answer is 42 as the ultimate response"

Words A: {the, answer, is, 42, because, it, ultimate}
Words B: {the, answer, is, 42, as, ultimate, response}

Intersection: {the, answer, is, 42, ultimate} = 5 words
Union: {the, answer, is, 42, because, it, as, ultimate, response} = 9 words

Similarity = 5/9 = 0.56
```

### Paso 3: Evaluación de Consensus

```
Agreement Rate = Average Similarity between all pairs

If Agreement Rate >= Threshold (0.70):
  → CONSENSUS ACHIEVED
  → Return longest/most complete response
  → Confidence = Agreement Rate

Else:
  → NO CONSENSUS
  → Invoke LLM Judge (o3)
  → Return judge's decision
  → Confidence = 0.85 (judge confidence)
```

### Paso 4: LLM Judge

Cuando no hay consensus, se usa OpenAI o3 como árbitro:

```javascript
Judge Prompt:
"Given task: [original task]
Evaluate these N responses and provide the best answer:
- Response 1: [response 1]
- Response 2: [response 2]
...
Provide the best final answer:"
```

## 🎯 Model Selection Strategy

### Scoring Algorithm

```javascript
score = 0

// 1. Capability matching
score += (matching_capabilities * 10)

// 2. Preferred capabilities (mode-specific)
score += (preferred_matches * 5)

// 3. Priority weight
score += provider.priority

// 4. Mode adjustments
if mode == 'speed':
  score -= (cost_per_token * 100000)  // Penalize expensive
elif mode == 'cost':
  score -= (cost_per_token * 500000)  // Heavy penalty
elif mode == 'quality':
  score += (priority * 2)              // Double priority

return score
```

### Example Scoring (Coding Task, Quality Mode)

| Provider        | Capability Match | Priority | Mode Bonus | Final Score |
| --------------- | ---------------- | -------- | ---------- | ----------- |
| Claude Opus 4.1 | 30 (coding x3)   | 9        | 18         | **57**      |
| DeepSeek V3     | 30 (coding x3)   | 8        | 16         | **54**      |
| OpenAI o3       | 20 (coding x2)   | 10       | 20         | **50**      |
| GPT-4o          | 20 (coding x2)   | 8        | 16         | **44**      |

→ **Selected: Claude, DeepSeek, o3, GPT-4o, Llama4**

## 🔐 Security Implementation

### Input Sanitization

```javascript
// Remove script tags
input = input.replace(/<script[^>]*>.*?<\/script>/gi, '');

// Remove HTML tags
input = input.replace(/<[^>]+>/g, '');

// Trim whitespace
input = input.trim();
```

### API Key Management

```javascript
// ✅ CORRECTO: Keys desde environment
const apiKey = process.env.OPENAI_API_KEY;

// ❌ INCORRECTO: Keys hardcoded
const apiKey = 'sk-1234567890'; // NUNCA hacer esto
```

### Output Validation

```javascript
// Validar estructura de respuesta
assert(result.success !== undefined);
assert(typeof result.result === 'string');
assert(result.confidence >= 0 && result.confidence <= 1);
```

## 📊 Telemetry & Monitoring

### Métricas Rastreadas

1. **Global Stats**
   - Total calls
   - Total tokens consumed
   - Total cost (USD)
   - Success/error ratio

2. **Per-Provider Stats**
   - Number of calls
   - Tokens used
   - Cost accumulated
   - Average latency
   - Error count

3. **Response Quality**
   - Confidence scores
   - Consensus achievement rate
   - Judge invocation frequency

### Usage Report Example

```javascript
const stats = elara.getUsageStats();

{
  totalCalls: 150,
  totalTokens: 450000,
  totalCost: 27.50,
  successes: 147,
  errors: 3,
  byProvider: {
    'openai_gpt4o': {
      calls: 45,
      tokens: 135000,
      cost: 2.70,
      avgLatency: 1250,
      errors: 0
    },
    'anthropic_claude': {
      calls: 30,
      tokens: 90000,
      cost: 4.50,
      avgLatency: 2100,
      errors: 1
    },
    // ... más providers
  }
}
```

## 🚨 Error Handling

### Retry Strategy

```
Attempt 1: Immediate
Attempt 2: Wait 1s  (2^0 * 1000ms)
Attempt 3: Wait 2s  (2^1 * 1000ms)
Attempt 4: Wait 4s  (2^2 * 1000ms)

If all retries fail → Try fallback provider
If fallback fails → Throw error
```

### Fallback Chain

```
Primary: Claude Opus 4.1
  ↓ (fails)
Fallback 1: DeepSeek V3
  ↓ (fails)
Fallback 2: GPT-4o
  ↓ (fails)
Fallback 3: Gemini 2.0 Flash
  ↓ (fails)
Error: All providers failed
```

### Error Types

| Error              | Description                 | Recovery                |
| ------------------ | --------------------------- | ----------------------- |
| `Request Timeout`  | Provider no responde en 30s | Retry → Fallback        |
| `Rate Limit`       | 429 Too Many Requests       | Wait → Retry → Fallback |
| `API Key Missing`  | No env var configurada      | Throw error immediately |
| `Invalid Response` | Respuesta malformada        | Retry → Fallback        |
| `Network Error`    | Sin conexión                | Retry → Fallback        |

## 🎛️ Configuration Options

### Mode Comparison

| Feature     | Speed   | Cost     | Balanced | Quality   |
| ----------- | ------- | -------- | -------- | --------- |
| Models Used | 1       | 2        | 3        | 5         |
| Consensus   | No      | Yes      | Yes      | Yes       |
| Avg Latency | ~1s     | ~2s      | ~3s      | ~5s       |
| Avg Cost    | $0.01   | $0.02    | $0.05    | $0.15     |
| Confidence  | 0.6-0.8 | 0.7-0.85 | 0.75-0.9 | 0.85-0.98 |

### Task Type Capabilities

| Task Type    | Required Capabilities | Best Providers       |
| ------------ | --------------------- | -------------------- |
| `reasoning`  | reasoning, analysis   | o3, Claude, Gemini 3 |
| `coding`     | coding, reasoning     | Claude, DeepSeek, o3 |
| `multimodal` | multimodal, vision    | Gemini 3, GPT-4o     |
| `research`   | web-search, real-time | Perplexity, Grok 4   |
| `analysis`   | analysis, reasoning   | o3, Claude, Mistral  |
| `speed`      | speed, fallback       | GPT-4o, Gemini Flash |

## 🐛 Troubleshooting Guide

### Problem: "API key not found"

**Causa**: Variable de entorno no configurada
**Solución**:

```bash
# Crear archivo .env
cp .env.example .env

# Editar y agregar tu API key
OPENAI_API_KEY=sk-your-actual-key
```

### Problem: "Request timeout"

**Causa**: Provider lento o red inestable
**Solución**:

- Sistema intentará automáticamente con fallback
- Aumentar timeout en config si es recurrente
- Usar modo `speed` para providers más rápidos

### Problem: "Rate limit exceeded"

**Causa**: Demasiadas requests en poco tiempo
**Solución**:

- Esperar 60 segundos
- Distribuir requests en el tiempo
- Usar modo `cost` (usa providers con más límites)

### Problem: "Low confidence scores"

**Causa**: Modelos en desacuerdo sobre la respuesta
**Solución**:

- Usar modo `quality` (más modelos = mejor consensus)
- Verificar que la task esté bien formulada
- Task ambigua puede generar respuestas diferentes

### Problem: "High costs"

**Causa**: Usar modo `quality` frecuentemente
**Solución**:

- Usar modo `cost` o `balanced` para tareas rutinarias
- Reservar `quality` solo para decisiones críticas
- Monitorear `getUsageStats()` regularmente

## 📚 FAQ

### ¿Cuándo usar cada modo?

- **Speed**: Desarrollo iterativo, prototipos, tests
- **Cost**: Alto volumen, tareas simples, presupuesto limitado
- **Balanced**: Uso general diario, buena relación calidad/costo
- **Quality**: Producción crítica, decisiones importantes, máxima precisión

### ¿Cómo funciona el consensus?

ELARA ejecuta la misma task en múltiples modelos (2-5 según modo), compara respuestas usando similitud semántica, y si hay suficiente acuerdo (>70%), retorna la mejor. Si no, usa o3 como árbitro.

### ¿Qué provider se usa por defecto?

Depende del tipo de task y modo. El router selecciona automáticamente basado en scoring de capacidades.

### ¿Puedo deshabilitar algunos providers?

Sí, configurar `enabledProviders` en el constructor:

```javascript
const elara = new ElaraAgent({
  enabledProviders: ['openai_gpt4o', 'anthropic_claude', 'google_gemini3']
});
```

### ¿Cómo monitoreo los costos?

```javascript
const stats = elara.getUsageStats();
console.log(`Total gastado: $${stats.totalCost.toFixed(2)}`);
console.log(`Por provider:`, stats.byProvider);
```

### ¿Es thread-safe?

Sí, puedes ejecutar múltiples tasks concurrentemente. Cada execution es independiente.

### ¿Guarda estado entre llamadas?

No, ELARA es stateless. Solo mantiene telemetría acumulada. Método `rollback()` no hace nada.

## 🔬 Testing

### Estructura de Tests

```
agents/__tests__/elara-agent.test.js
├─ Initialization (4 tests)
├─ validate() (7 tests)
├─ execute() (9 tests)
├─ Consensus System (3 tests)
├─ Error Handling (5 tests)
├─ Telemetry (5 tests)
├─ Security (3 tests)
├─ Integration (3 tests)
├─ Model Selection (4 tests)
├─ Provider Formatting (6 tests)
├─ Response Parsing (3 tests)
└─ Similarity Calculation (3 tests)

Total: 55 tests
Coverage: 100%
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo ELARA
npm test -- elara-agent

# Con coverage
npm run test:coverage
```

## 🚀 Performance Optimization

### Tips para Máximo Rendimiento

1. **Use Speed Mode for Development**

   ```javascript
   const elara = new ElaraAgent({ mode: 'speed' });
   ```

2. **Disable Consensus When Not Needed**

   ```javascript
   await elara.execute({ task, consensus: false });
   ```

3. **Batch Similar Tasks**

   ```javascript
   const results = await Promise.all(tasks.map(task => elara.execute({ task, mode: 'cost' })));
   ```

4. **Monitor and Optimize**
   ```javascript
   setInterval(() => {
     const stats = elara.getUsageStats();
     if (stats.totalCost > budgetLimit) {
       // Switch to cost mode
       elara.config.mode = 'cost';
     }
   }, 60000);
   ```

## 📈 Future Enhancements

Posibles mejoras futuras:

- [ ] Caching de respuestas comunes
- [ ] Embeddings para mejor similitud
- [ ] Streaming de respuestas largas
- [ ] Fine-tuning de pesos por uso histórico
- [ ] Dashboard web para monitoreo
- [ ] Rate limiting inteligente por provider
- [ ] A/B testing de configuraciones
- [ ] Auto-scaling de consensus threshold

---

**Versión**: 2.0.0  
**Última Actualización**: 2025-12-18  
**Mantenedor**: @Melampe001
