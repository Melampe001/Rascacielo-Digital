# Orchestrator Agent - Documentación

## 📋 Índice

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Instalación y Configuración](#instalación-y-configuración)
- [Modos de Ejecución](#modos-de-ejecución)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Configuración Avanzada](#configuración-avanzada)
- [Métricas y Reportes](#métricas-y-reportes)
- [Troubleshooting](#troubleshooting)

## Descripción

El **Orchestrator Agent** es el componente coordinador central del sistema Rascacielos Digital. Su función principal es gestionar y coordinar la ejecución de múltiples agentes especializados, permitiendo:

- ✅ Ejecución secuencial de tareas con manejo de dependencias
- ✅ Ejecución paralela de tareas independientes
- ✅ Rollback automático en caso de errores
- ✅ Logging detallado de cada paso
- ✅ Métricas de rendimiento (CPU, memoria, tiempo)
- ✅ Generación de reportes completos en JSON y texto

## Arquitectura

### Componentes del Orchestrator

```
┌─────────────────────────────────────────┐
│       Orchestrator Agent                │
│  ┌───────────────────────────────────┐  │
│  │  Pipeline Manager                 │  │
│  │  - Full Pipeline                  │  │
│  │  - Fast Pipeline                  │  │
│  │  - Custom Pipeline                │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Task Executor                    │  │
│  │  - Sequential Execution           │  │
│  │  - Parallel Execution             │  │
│  │  - Timeout Management             │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Error Handler                    │  │
│  │  - Rollback Management            │  │
│  │  - Error Logging                  │  │
│  │  - Recovery Strategies            │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Metrics Collector                │  │
│  │  - CPU Usage                      │  │
│  │  - Memory Usage                   │  │
│  │  - Execution Time                 │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │  Report Generator                 │  │
│  │  - JSON Reports                   │  │
│  │  - Text Reports                   │  │
│  │  - Metrics Summary                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │         │         │
           ▼         ▼         ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Build   │ │ Security │ │  Deploy  │
    │  Agent   │ │  Agent   │ │  Agent   │
    └──────────┘ └──────────┘ └──────────┘
```

### Agentes Coordinados

1. **Maintenance Agent** (opcional): Limpieza y mantenimiento del sistema
2. **Security Agent**: Análisis de seguridad y vulnerabilidades
3. **Build Agent**: Construcción y compilación del proyecto
4. **Deploy Agent**: Despliegue a producción

## Instalación y Configuración

### Instalación

El Orchestrator Agent está incluido en el proyecto Rascacielos Digital. No requiere instalación adicional.

```bash
npm install
```

### Configuración Básica

Crea un archivo `.orchestratorrc.json` en la raíz del proyecto (opcional):

```json
{
  "timeout": 300000,
  "dryRun": false,
  "reportDir": "./reports",
  "build": {
    "outputDir": "./dist",
    "optimize": true
  },
  "security": {
    "level": "moderate",
    "failOnHigh": true
  },
  "deploy": {
    "dryRun": false,
    "autoRollback": true,
    "healthCheckRetries": 5
  }
}
```

### Variables de Configuración

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `timeout` | number | 300000 | Timeout por tarea en ms |
| `dryRun` | boolean | false | Modo simulación |
| `reportDir` | string | "./reports" | Directorio de reportes |
| `build.*` | object | {} | Configuración del BuildAgent |
| `security.*` | object | {} | Configuración del SecurityAgent |
| `deploy.*` | object | {} | Configuración del DeployAgent |

## Modos de Ejecución

### 1. Pipeline Completo (Full)

Ejecuta todos los agentes en secuencia: **maintenance → security → build → deploy**

```bash
# Via npm script
npm run orchestrate:full

# Via Node.js
node agents/orchestrator-agent.js --mode=full

# Via programático
const orchestrator = new OrchestratorAgent();
await orchestrator.executeFullPipeline();
```

**Casos de uso:**
- Despliegues a producción
- Releases importantes
- Validación completa del sistema

### 2. Pipeline Rápido (Fast)

Ejecuta solo: **build → deploy**

```bash
# Via npm script
npm run orchestrate:fast

# Via Node.js
node agents/orchestrator-agent.js --mode=fast

# Via programático
const orchestrator = new OrchestratorAgent();
await orchestrator.executeFastPipeline();
```

**Casos de uso:**
- Hot fixes
- Actualizaciones menores
- Desarrollo iterativo

### 3. Modo Paralelo

Ejecuta múltiples tareas en paralelo.

```bash
# Via npm script
npm run orchestrate:parallel

# Via Node.js con tareas específicas
node agents/orchestrator-agent.js --mode=parallel --tasks=build,security

# Via programático
const orchestrator = new OrchestratorAgent();
await orchestrator.executeCustom(['build', 'security'], 'parallel');
```

**Casos de uso:**
- Optimización de tiempo de CI/CD
- Tareas independientes
- Análisis simultáneos

### 4. Modo Secuencial Personalizado

Ejecuta tareas específicas en secuencia.

```bash
# Via Node.js
node agents/orchestrator-agent.js --mode=sequential --tasks=maintenance,security,build

# Via programático
const orchestrator = new OrchestratorAgent();
await orchestrator.executeCustom(['maintenance', 'security', 'build'], 'sequential');
```

**Casos de uso:**
- Workflows personalizados
- Testing de componentes específicos
- Pipelines híbridos

## Ejemplos de Uso

### Ejemplo 1: Pipeline Completo con Configuración

```javascript
const OrchestratorAgent = require('./agents/orchestrator-agent');

const orchestrator = new OrchestratorAgent({
  timeout: 600000, // 10 minutos
  reportDir: './custom-reports',
  build: {
    outputDir: './dist',
    optimize: true
  },
  deploy: {
    autoRollback: true,
    healthCheckRetries: 10
  }
});

try {
  const result = await orchestrator.executeFullPipeline();
  console.log('Pipeline exitoso:', result.summary);
} catch (error) {
  console.error('Pipeline falló:', error.message);
}
```

### Ejemplo 2: Tareas Paralelas

```javascript
const orchestrator = new OrchestratorAgent();

// Ejecutar security y build en paralelo
const result = await orchestrator.executeCustom(
  ['security', 'build'],
  'parallel'
);

console.log(`Completado en ${result.execution.durationFormatted}`);
```

### Ejemplo 3: Modo Dry Run

```bash
# Testing sin ejecutar cambios reales
node agents/orchestrator-agent.js --mode=full --dry-run
```

### Ejemplo 4: Pipeline con Timeout Personalizado

```bash
# Timeout de 10 minutos
node agents/orchestrator-agent.js --mode=full --timeout=600000
```

### Ejemplo 5: Integración con RascacielosDigital

```javascript
const RascacielosDigital = require('./index');

const app = new RascacielosDigital({
  orchestrator: {
    timeout: 300000,
    reportDir: './reports'
  }
});

await app.start();

// Ejecutar pipeline completo
const result = await app.runFullPipeline();

// Ejecutar pipeline rápido
const fastResult = await app.runFastPipeline();
```

## Configuración Avanzada

### Configuración por Agente

```json
{
  "build": {
    "buildTool": "auto",
    "outputDir": "./dist",
    "optimize": true,
    "verbose": false
  },
  "security": {
    "level": "strict",
    "failOnHigh": true,
    "scanDependencies": true,
    "scanCode": true
  },
  "deploy": {
    "dryRun": false,
    "autoRollback": true,
    "healthCheckRetries": 5,
    "healthCheckInterval": 30000,
    "treesit": {
      "region": "us-east-1",
      "environment": "production"
    }
  }
}
```

### Timeouts Personalizados

```javascript
const orchestrator = new OrchestratorAgent({
  timeout: 900000, // 15 minutos global
  build: {
    timeout: 300000 // 5 minutos para build
  },
  deploy: {
    timeout: 600000 // 10 minutos para deploy
  }
});
```

### Rollback Automático

El orchestrator implementa rollback automático cuando:

1. Una tarea falla después de un despliegue exitoso
2. Los health checks fallan post-deploy
3. Se detecta una condición de error crítico

```javascript
// Configurar rollback
const orchestrator = new OrchestratorAgent({
  deploy: {
    autoRollback: true, // Activar rollback automático
    healthCheckRetries: 5 // Reintentos antes de rollback
  }
});
```

### Manejo de Errores Personalizado

```javascript
class CustomOrchestratorAgent extends OrchestratorAgent {
  async rollback(failedStep) {
    // Lógica de rollback personalizada
    await super.rollback(failedStep);
    
    // Notificaciones adicionales
    await this.notifyTeam(failedStep);
    await this.createIncident(failedStep);
  }
}
```

## Métricas y Reportes

### Estructura del Reporte JSON

```json
{
  "orchestrator": "Rascacielos Digital",
  "version": "1.0.0",
  "execution": {
    "startTime": "2024-01-15T10:30:00.000Z",
    "endTime": "2024-01-15T10:35:30.000Z",
    "duration": 330000,
    "durationFormatted": "5m 30s"
  },
  "summary": {
    "total": 4,
    "successful": 4,
    "failed": 0,
    "skipped": 0
  },
  "tasks": [
    {
      "name": "security",
      "description": "Análisis de seguridad",
      "status": "success",
      "duration": 45000,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "metrics": {
    "cpu": {
      "user": { "avg": 150000, "max": 200000, "min": 100000 },
      "system": { "avg": 50000, "max": 70000, "min": 30000 },
      "samples": 10
    },
    "memory": {
      "heapUsed": { "avg": 50000000, "max": 75000000, "min": 25000000 },
      "heapTotal": { "avg": 100000000, "max": 150000000, "min": 50000000 },
      "samples": 10
    }
  },
  "system": {
    "platform": "linux",
    "arch": "x64",
    "nodeVersion": "v18.17.0",
    "cpus": 4,
    "totalMemory": 8589934592,
    "freeMemory": 2147483648
  }
}
```

### Ubicación de Reportes

Por defecto, los reportes se guardan en:

- JSON: `./reports/orchestrator-report.json`
- Texto: `./reports/orchestrator-report.txt`

### Visualización de Métricas

```bash
# Ver reporte en consola
cat ./reports/orchestrator-report.txt

# Procesar reporte JSON
jq '.summary' ./reports/orchestrator-report.json

# Ver solo tareas fallidas
jq '.tasks[] | select(.status == "failed")' ./reports/orchestrator-report.json
```

## Troubleshooting

### Problema: Timeout en Tareas

**Síntoma:** Las tareas fallan con error "Timeout exceeded"

**Solución:**
```bash
# Aumentar timeout global
node agents/orchestrator-agent.js --mode=full --timeout=600000

# O en configuración
{
  "timeout": 600000
}
```

### Problema: Errores de Memoria

**Síntoma:** Error "JavaScript heap out of memory"

**Solución:**
```bash
# Aumentar memoria de Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run orchestrate:full
```

### Problema: Rollback no Funciona

**Síntoma:** El rollback automático no se ejecuta

**Diagnóstico:**
```javascript
// Verificar configuración
const orchestrator = new OrchestratorAgent();
console.log(orchestrator.config.deploy?.autoRollback);
```

**Solución:**
```json
{
  "deploy": {
    "autoRollback": true
  }
}
```

### Problema: Reportes no se Generan

**Síntoma:** No se encuentran archivos de reporte

**Solución:**
```bash
# Verificar permisos del directorio
mkdir -p ./reports
chmod 755 ./reports

# Especificar directorio explícitamente
node agents/orchestrator-agent.js --mode=full
```

### Problema: Agente no Encuentra Dependencias

**Síntoma:** Error "Cannot find module"

**Solución:**
```bash
# Reinstalar dependencias
npm ci

# Verificar estructura del proyecto
npm run config:check
```

### Problema: Script de Mantenimiento no se Ejecuta

**Síntoma:** Maintenance task se omite

**Diagnóstico:**
```bash
# Verificar existencia del script
ls -la scripts/cleanup.sh

# Verificar permisos
chmod +x scripts/cleanup.sh
```

### Problema: Tareas Paralelas Fallan Intermitentemente

**Síntoma:** Errores aleatorios en modo paralelo

**Solución:**
```javascript
// Usar modo secuencial para tareas con dependencias
await orchestrator.executeCustom(
  ['security', 'build'],
  'sequential' // En lugar de 'parallel'
);
```

## Scripts NPM Disponibles

```bash
# Ejecutar orchestrator en diferentes modos
npm run orchestrate:full      # Pipeline completo
npm run orchestrate:fast      # Pipeline rápido
npm run orchestrate:parallel  # Ejecución paralela

# Ejecutar agentes individuales
npm run agents:all           # Todos los agentes (vía orchestrator)
npm run agents:build         # Solo build
npm run agents:security      # Solo security
npm run agents:deploy        # Solo deploy
npm run agents:maintain      # Solo mantenimiento

# Pipelines tradicionales (sin orchestrator)
npm run pipeline:full        # Secuencial con npm scripts
npm run pipeline:fast        # Build + Deploy con npm scripts
```

## Integración con CI/CD

Ver [orchestrator-pipeline.yml](../.github/workflows/orchestrator-pipeline.yml) para configuración de GitHub Actions.

```yaml
# Ejemplo de integración en workflow
- name: Run Orchestrator Full Pipeline
  run: npm run orchestrate:full

- name: Upload Report
  uses: actions/upload-artifact@v4
  with:
    name: orchestrator-report
    path: reports/
```

## Recursos Adicionales

- [README Principal](../README.md)
- [Guía de Contribución](../CONTRIBUTING.md)
- [Build Agent](../agents/build-agent.js)
- [Security Agent](../agents/security-agent.js)
- [Deploy Agent](../agents/deploy-agent.js)

## Soporte

Para reportar problemas o solicitar características:
- GitHub Issues: https://github.com/Melampe001/Rascacielo-Digital/issues
- Documentación: https://github.com/Melampe001/Rascacielo-Digital/docs
