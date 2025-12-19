# Orchestrator Agent Documentation

## 📋 Descripción

El **Orchestrator Agent** es un componente central de Rascacielo Digital que coordina la ejecución de múltiples agentes especializados. Permite ejecutar pipelines complejos con diferentes estrategias: secuencial, paralelo, y con capacidades avanzadas como rollback automático y generación de reportes.

## 🎯 Características Principales

- **Ejecución Secuencial**: Ejecuta agentes uno tras otro con control de errores
- **Ejecución Paralela**: Ejecuta múltiples agentes simultáneamente para mejor rendimiento
- **Pipeline Completo**: Maintain → Security → Build → Deploy
- **Pipeline Rápido**: Build → Deploy (para despliegues rápidos)
- **Rollback Automático**: Revierte cambios automáticamente en caso de fallo
- **Métricas del Sistema**: CPU, memoria, tiempos de ejecución
- **Generación de Reportes**: JSON detallados de cada ejecución
- **Timeout Configurable**: Control de tiempo máximo de ejecución
- **CLI Integrado**: Línea de comandos para fácil uso

## 🚀 Uso Básico

### Desde NPM Scripts

```bash
# Pipeline completo (maintain → security → build → deploy)
npm run orchestrate:full

# Pipeline rápido (build → deploy)
npm run orchestrate:fast

# Ejecución paralela (build + security simultáneamente)
npm run orchestrate:parallel

# Atajo para pipeline completo
npm run agents:all
```

### Desde CLI Directamente

```bash
# Pipeline completo
node agents/orchestrator-agent.js --mode=full

# Pipeline rápido
node agents/orchestrator-agent.js --mode=fast

# Ejecución paralela
node agents/orchestrator-agent.js --mode=parallel
```

### Programáticamente

```javascript
const OrchestratorAgent = require('./agents/orchestrator-agent');
const BuildAgent = require('./agents/build-agent');
const SecurityAgent = require('./agents/security-agent');

const orchestrator = new OrchestratorAgent({
  agents: {
    build: new BuildAgent(),
    security: new SecurityAgent()
  },
  logger: console,
  timeout: 300000, // 5 minutos
  continueOnError: false
});

// Ejecutar pipeline completo
const report = await orchestrator.executeFullPipeline();
console.log(report);
```

## 📊 Modos de Ejecución

### 1. Full Pipeline

Ejecuta el pipeline completo con todos los agentes en secuencia:

```
Maintain → Security → Build → Deploy
```

**Características:**

- Mantenimiento del código (limpieza, optimización)
- Análisis de seguridad completo
- Build de producción
- Despliegue automático

**Uso:**

```bash
npm run orchestrate:full
```

### 2. Fast Pipeline

Ejecuta solo los pasos esenciales para un despliegue rápido:

```
Build → Deploy
```

**Características:**

- Build optimizado
- Despliegue directo
- Ideal para hotfixes

**Uso:**

```bash
npm run orchestrate:fast
```

### 3. Parallel Execution

Ejecuta múltiples agentes simultáneamente:

```
Build ┐
      ├─ → Continuar...
Security ┘
```

**Características:**

- Máximo paralelismo
- Reducción de tiempo total
- Ideal para análisis independientes

**Uso:**

```bash
npm run orchestrate:parallel
```

## ⚙️ Configuración

### Constructor Options

```javascript
new OrchestratorAgent({
  agents: {}, // Mapa de agentes disponibles
  logger: console, // Logger para output
  reportDir: './reports', // Directorio para reportes
  continueOnError: false, // Continuar tras errores
  timeout: 300000 // Timeout en ms (5 min)
});
```

### Opciones Avanzadas

```javascript
// Pipeline personalizado
const customPipeline = [
  { name: 'build', agent: 'build', method: 'build', params: { optimize: true } },
  { name: 'test', agent: 'test', method: 'run' },
  { name: 'deploy', agent: 'deploy', method: 'deploy' }
];

const report = await orchestrator.executeSequential(customPipeline, {
  autoRollback: true // Habilitar rollback automático
});
```

## 📈 Reportes

Cada ejecución genera un reporte detallado en JSON:

```json
{
  "mode": "sequential",
  "timestamp": "2024-12-19T04:00:00.000Z",
  "metrics": {
    "startTime": 1702951200000,
    "endTime": 1702951230000,
    "duration": 30000,
    "memory": {
      "heapUsed": "45 MB",
      "total": "128 MB"
    },
    "cpu": {
      "user": "1250 ms",
      "system": "380 ms"
    }
  },
  "summary": {
    "total": 4,
    "successful": 4,
    "failed": 0,
    "successRate": "100.00%",
    "totalDuration": "28500ms"
  },
  "results": [
    {
      "step": "build",
      "agent": "build",
      "success": true,
      "duration": 12000,
      "result": { ... }
    }
  ],
  "status": "SUCCESS"
}
```

### Ubicación de Reportes

Los reportes se guardan en `./reports/` con nombres descriptivos:

- `orchestrator-full-1702951200000.json`
- `orchestrator-fast-1702951230000.json`
- `orchestrator-parallel-1702951260000.json`

## 🔄 Rollback Automático

El orchestrator puede revertir automáticamente los cambios en caso de fallo:

```javascript
// Habilitar rollback automático
const report = await orchestrator.executeFullPipeline({
  autoRollback: true
});

// Si un paso falla, se revierten todos los pasos previos exitosos
// en orden inverso
```

### Requisitos para Rollback

Cada agente debe implementar un método `rollback()`:

```javascript
class MyAgent {
  async execute(params) {
    // Ejecutar acción
    return { success: true, data: ... };
  }

  async rollback(previousResult) {
    // Revertir cambios
    return { success: true };
  }
}
```

## 📊 Métricas y Monitoreo

El orchestrator recopila métricas del sistema:

```javascript
// Durante la ejecución
orchestrator.startMetrics();

// ... ejecutar agentes ...

// Finalizar y obtener métricas
orchestrator.endMetrics();

const status = orchestrator.getStatus();
console.log(status);
// {
//   running: false,
//   completed: true,
//   duration: 30000,
//   results: 4
// }
```

## 🎭 Integración con Index.js

El orchestrator está integrado en la clase principal:

```javascript
const RascacielosDigital = require('./index');

const app = new RascacielosDigital();
await app.start();

// Usar orchestrator a través de la API
const report = await app.runFullPipeline();
const fastReport = await app.runFastPipeline();
const parallelReport = await app.runParallel([
  { agent: 'build', method: 'build' },
  { agent: 'security', method: 'scan' }
]);
```

## 🧪 Testing

El orchestrator incluye un suite completo de tests:

```bash
# Ejecutar tests del orchestrator
npm test -- agents/__tests__/orchestrator-agent.test.js

# Ver coverage
npm run test:coverage
```

### Test Cases Incluidos

- ✅ Inicialización con configuración
- ✅ Ejecución de agente individual
- ✅ Pipeline secuencial completo
- ✅ Pipeline con manejo de errores
- ✅ Ejecución paralela
- ✅ Rollback automático
- ✅ Generación de reportes
- ✅ Recolección de métricas
- ✅ Timeouts configurables

## 🚨 Manejo de Errores

### Estrategia por Defecto (Stop on Error)

```javascript
orchestrator.config.continueOnError = false;

// Si un paso falla, se detiene la ejecución
// y se ejecuta rollback automático
```

### Continuar en Caso de Error

```javascript
orchestrator.config.continueOnError = true;

// Los pasos siguientes se ejecutan incluso si hay fallos
// Útil para análisis no críticos
```

### Timeout Handling

```javascript
orchestrator.config.timeout = 60000; // 1 minuto

// Si un agente tarda más del timeout,
// se cancela y se reporta como error
```

## 🔧 Troubleshooting

### Problema: Timeout muy corto

**Solución:** Aumentar el timeout

```javascript
orchestrator.config.timeout = 600000; // 10 minutos
```

### Problema: Agente no encontrado

**Solución:** Verificar que el agente esté registrado

```javascript
orchestrator.config.agents = {
  build: new BuildAgent(),
  security: new SecurityAgent()
};
```

### Problema: Rollback falla

**Solución:** Implementar método rollback en todos los agentes

```javascript
class MyAgent {
  async rollback(result) {
    try {
      // Lógica de rollback
      return { success: true };
    } catch (error) {
      console.error('Rollback failed:', error);
      return { success: false, error };
    }
  }
}
```

## 📚 Ejemplos Completos

### Ejemplo 1: Pipeline Básico

```javascript
const orchestrator = new OrchestratorAgent({
  agents: {
    build: new BuildAgent(),
    deploy: new DeployAgent()
  }
});

const report = await orchestrator.executeFastPipeline();
if (report.status === 'SUCCESS') {
  console.log('Deployment successful!');
}
```

### Ejemplo 2: Pipeline con Configuración Personalizada

```javascript
const report = await orchestrator.executeSequential(
  [
    {
      name: 'security',
      agent: 'security',
      method: 'scan',
      params: { level: 'strict' }
    },
    {
      name: 'build',
      agent: 'build',
      method: 'build',
      params: { optimize: true, minify: true }
    }
  ],
  {
    autoRollback: true
  }
);
```

### Ejemplo 3: Ejecución Paralela Avanzada

```javascript
const report = await orchestrator.executeParallel([
  { agent: 'lint', method: 'check' },
  { agent: 'test', method: 'run' },
  { agent: 'security', method: 'scan' }
]);

console.log(`Success rate: ${report.summary.successRate}`);
```

## 🔗 Referencias

- [Build Agent Documentation](./BUILD_AGENT.md)
- [Security Agent Documentation](./SECURITY_AGENT.md)
- [Deploy Agent Documentation](./DEPLOY_AGENT.md)
- [CI/CD Pipeline](../.github/workflows/orchestrator-pipeline.yml)

## 📝 Changelog

### Version 1.1.0

- ✨ Implementación inicial del Orchestrator Agent
- ✨ Soporte para ejecución secuencial y paralela
- ✨ Rollback automático
- ✨ Métricas del sistema (CPU, memoria)
- ✨ Generación de reportes JSON
- ✨ CLI integrado
- ✨ Tests completos (20+ test cases)

---

**Rascacielo Digital v1.1.0** | Sistema modular con agentes especializados
