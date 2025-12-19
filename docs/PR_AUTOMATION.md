# PR Automation System

## Descripción

Sistema automatizado de gestión de pull requests usando agentes inteligentes que analiza, categoriza y recomienda acciones para PRs abiertos en el repositorio.

## Características

- **Análisis Automático**: Escanea todos los PRs abiertos
- **Categorización Inteligente**: Clasifica PRs por tipo (deployment, dependencies, ci-cd, agents, etc.)
- **Detección de Duplicados**: Identifica PRs duplicados o relacionados
- **Recomendaciones Priorizadas**: Genera acciones recomendadas (MERGE, CLOSE, REVIEW)
- **Modo Dry-Run**: Simula acciones antes de ejecutarlas
- **Integración con Orchestrator**: Coordina con otros agentes del sistema

## Uso

### Análisis Solo (Sin Ejecución)

```bash
npm run pr:analyze
```

Este comando analiza todos los PRs y genera un reporte sin ejecutar ninguna acción.

### Simulación (Dry-Run)

```bash
npm run pr:manage
```

Analiza los PRs y muestra qué acciones se ejecutarían, pero no las aplica realmente.

### Ejecución Real

```bash
npm run pr:execute
```

⚠️ **ADVERTENCIA**: Este comando ejecuta las acciones reales (merge/close) en los PRs. Úsalo con precaución.

### Usando el Orchestrator

```javascript
const OrchestratorAgent = require('./agents/orchestrator-agent');

const orchestrator = new OrchestratorAgent();

// Análisis de PRs
const result = await orchestrator.managePRs({ execute: false });

// Ejecución real
const result = await orchestrator.managePRs({ execute: true });
```

## Categorías de PRs

El sistema clasifica automáticamente los PRs en las siguientes categorías:

- **deployment**: Configuraciones de Vercel, deploy scripts
- **dependencies**: Actualizaciones de paquetes npm, package.json
- **ci-cd**: Cambios en pipelines, workflows de GitHub Actions
- **agents**: Nuevos agentes o modificaciones a agentes existentes
- **frontend**: Cambios en Flutter, UI, componentes visuales
- **maintenance**: Limpieza de código, refactoring, optimizaciones
- **architecture**: Cambios estructurales importantes (Next.js, SaaS)
- **other**: PRs que no encajan en categorías anteriores

## Recomendaciones

### MERGE (Alta/Media Prioridad)

PRs esenciales que deben ser integrados:

- Funcionalidad crítica (Orchestrator, dependencies)
- Correcciones de CI/CD
- Infraestructura de agentes
- Mejoras de frontend/backend

### CLOSE (Duplicados)

PRs que deben cerrarse:

- Duplicados confirmados
- PRs obsoletos o supersedidos

### REVIEW (Evaluación Manual)

PRs que requieren decisión humana:

- Cambios arquitectónicos mayores
- PRs con impacto significativo
- Decisiones de negocio

## Workflow Automatizado

El sistema se ejecuta automáticamente cada 6 horas vía GitHub Actions.

### Ejecución Manual

Puedes ejecutar el workflow manualmente desde GitHub:

1. Ve a Actions → PR Automation Agent
2. Click en "Run workflow"
3. Selecciona el modo:
   - **analyze**: Solo análisis
   - **execute**: Ejecutar acciones reales
4. Selecciona dry_run:
   - **true**: Simular
   - **false**: Ejecutar realmente

## API del PR Manager Agent

### Constructor

```javascript
const agent = new PRManagerAgent({
  owner: 'Melampe001',
  repo: 'Rascacielo-Digital',
  token: process.env.GITHUB_TOKEN,
  autoMerge: false,
  autoClose: false
});
```

### Métodos Principales

#### `analyzeAllPRs()`

Analiza todos los PRs abiertos y retorna un array de análisis.

```javascript
const analyses = await agent.analyzeAllPRs();
```

#### `generateReport()`

Genera un reporte consolidado con estadísticas y recomendaciones.

```javascript
const report = agent.generateReport();
// {
//   summary: { total, toMerge, toClose, toReview },
//   details: { byCategory, byAction }
// }
```

#### `executeActions(dryRun = true)`

Ejecuta las acciones recomendadas (merge/close).

```javascript
// Dry run
await agent.executeActions(true);

// Ejecución real
await agent.executeActions(false);
```

#### `categorizePR(pr)`

Categoriza un PR individual.

```javascript
const category = agent.categorizePR({ title: 'Update dependencies' });
// Returns: 'dependencies'
```

#### `checkDuplicate(pr)`

Verifica si un PR es duplicado.

```javascript
const duplicateOf = agent.checkDuplicate({ number: 28 });
// Returns: 29 (si es duplicado) o null
```

#### `getRecommendation(pr)`

Genera una recomendación para un PR.

```javascript
const rec = agent.getRecommendation({ number: 32, title: 'Orchestrator' });
// Returns: { action: 'MERGE', reason: '...', priority: 'HIGH' }
```

## Estructura de Datos

### Análisis de PR

```javascript
{
  number: 32,
  title: 'Orchestrator',
  draft: true,
  age: '3h',
  category: 'agents',
  isDuplicate: null,
  recommendation: {
    action: 'MERGE',
    reason: 'Essential functionality',
    priority: 'HIGH'
  }
}
```

### Reporte

```javascript
{
  summary: {
    total: 12,
    toMerge: 7,
    toClose: 2,
    toReview: 3
  },
  details: {
    byCategory: {
      agents: [...],
      dependencies: [...],
      // ...
    },
    byAction: {
      MERGE: [...],
      CLOSE: [...],
      REVIEW: [...]
    }
  }
}
```

## Configuración

### Variables de Entorno

```bash
GITHUB_TOKEN=your_github_token
```

### Configuración del Agent

```javascript
{
  owner: 'Melampe001',        // Propietario del repositorio
  repo: 'Rascacielo-Digital',  // Nombre del repositorio
  token: process.env.GITHUB_TOKEN,  // Token de GitHub
  autoMerge: false,           // Merge automático
  autoClose: false            // Cierre automático
}
```

## Extensión

### Agregar Nueva Categoría

Edita el método `categorizePR()`:

```javascript
categorizePR(pr) {
  const title = pr.title.toLowerCase();
  
  if (title.includes('nueva-categoria')) return 'nueva-categoria';
  // ...
}
```

### Agregar Nuevas Reglas de Recomendación

Edita el método `getRecommendation()`:

```javascript
getRecommendation(pr) {
  // Agregar lógica personalizada
  if (pr.number === XX) {
    return { action: 'MERGE', reason: 'Custom reason', priority: 'HIGH' };
  }
  // ...
}
```

## Seguridad

- El sistema requiere permisos de GitHub Actions apropiados
- Por defecto, las acciones automáticas están deshabilitadas
- Siempre revisa el reporte antes de ejecutar acciones reales
- Usa dry-run para validar cambios antes de aplicarlos

## Troubleshooting

### Error: GitHub Token no disponible

```bash
export GITHUB_TOKEN=your_token
npm run pr:analyze
```

### Error: No se encuentran PRs

Verifica que:
- El repositorio tiene PRs abiertos
- El token tiene permisos de lectura

### Error: No se pueden mergear PRs

Verifica que:
- El token tiene permisos de escritura
- Los PRs no tienen conflictos
- Los PRs pasan las verificaciones requeridas

## Ejemplos

### Ejemplo 1: Análisis Básico

```javascript
const PRManagerAgent = require('./agents/pr-manager-agent');

const agent = new PRManagerAgent();
await agent.analyzeAllPRs();
const report = agent.generateReport();

console.log(`Total PRs: ${report.summary.total}`);
console.log(`To Merge: ${report.summary.toMerge}`);
console.log(`To Close: ${report.summary.toClose}`);
```

### Ejemplo 2: Filtrar por Categoría

```javascript
const agent = new PRManagerAgent();
await agent.analyzeAllPRs();

const agentPRs = agent.results.analyzed
  .filter(pr => pr.category === 'agents');

console.log('Agent-related PRs:', agentPRs);
```

### Ejemplo 3: Integración con Orchestrator

```javascript
const OrchestratorAgent = require('./agents/orchestrator-agent');

const orchestrator = new OrchestratorAgent();
const { report } = await orchestrator.managePRs({ execute: false });

console.log('PR Management Report:', report);
```

## Contribuir

Para agregar nuevas funcionalidades:

1. Edita `agents/pr-manager-agent.js`
2. Agrega tests en `agents/__tests__/pr-manager-agent.test.js`
3. Actualiza esta documentación
4. Ejecuta `npm test` para validar cambios

## Licencia

MIT
