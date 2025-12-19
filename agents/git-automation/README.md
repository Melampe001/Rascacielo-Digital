# 👑 Sistema Imperial de 29 Agentes Git Automatizados

[![Quality](https://img.shields.io/badge/quality-imperial-gold.svg)](https://github.com/Melampe001/Rascacielo-Digital)
[![Certifications](https://img.shields.io/badge/certified-ISO%2FOWASP%2FClean%20Code-blue.svg)](https://github.com/Melampe001/Rascacielo-Digital)
[![Agents](https://img.shields.io/badge/agents-29-brightgreen.svg)](https://github.com/Melampe001/Rascacielo-Digital)

Sistema completo de automatización Git/GitHub con 29 agentes especializados de calidad imperial premium elite, basado en las mejores prácticas certificadas del mundo digital.

## 🎯 Características

- **29 Agentes Especializados**: Organizados en 6 categorías críticas
- **Arquitectura SOLID**: Diseño limpio y mantenible
- **Certificaciones**: ISO/IEC 25010, OWASP Top 10, Clean Code
- **Orquestación Inteligente**: Ejecución paralela y secuencial optimizada
- **Métricas en Tiempo Real**: Monitoreo y logging avanzado
- **Auto-Fix**: Correcciones automáticas cuando es posible
- **Workflows Predefinidos**: Listo para usar en segundos

## 📦 Instalación

```bash
npm install @melampe001/rascacielo-git-agents
```

## 🚀 Quick Start

```javascript
const { GitAutomationSystem } = require('@melampe001/rascacielo-git-agents');

// Crear instancia del sistema
const system = new GitAutomationSystem();

// Ejecutar workflow completo
const result = await system.executeWorkflow('complete', {
  files: [...],
  coverage: 85,
  hasTests: true
});

console.log(`Success: ${result.success}`);
console.log(`Duration: ${result.duration}ms`);
```

## 📋 Agentes Disponibles

### 🔍 Core Review (6 Agentes Críticos)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Auditoria** | Auditoría completa de código, seguridad y rendimiento | CRITICAL |
| **Validar** | Validación de estándares y cobertura | CRITICAL |
| **Verificar** | Verificación de CI/CD y deployments | CRITICAL |
| **Corregir** | Auto-fix de violaciones de código | CRITICAL |
| **Solucionar** | Resolución automática de issues | CRITICAL |
| **Refactorizar** | Aplicación de patrones de refactoring | CRITICAL |

### 💻 Development (7 Agentes Críticos)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Build** | Optimización de build y análisis de bundles | CRITICAL |
| **Pipeline** | Generación de pipelines CI/CD | CRITICAL |
| **Tests** | Generación de tests y análisis de cobertura | CRITICAL |
| **Optimizar** | Optimización de algoritmos y rendimiento | CRITICAL |
| **Limpiar** | Limpieza de código y eliminación de código muerto | CRITICAL |
| **Depurar** | Herramientas de debugging y análisis de errores | CRITICAL |
| **Scripts** | Generación de scripts de automatización | CRITICAL |

### 🔒 Security (3 Agentes Críticos)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Blindar** | Hardening de seguridad y encriptación | CRITICAL |
| **Bloqueante** | Detección de vulnerabilidades críticas | CRITICAL |
| **Riesgos** | Análisis de riesgos y threat modeling | CRITICAL |

### 📚 Documentation (4 Agentes Altos)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Documentar** | Generación de documentación técnica | HIGH |
| **Reporte Técnico** | Reportes técnicos y métricas | HIGH |
| **Resumen** | Generación de resúmenes y release notes | HIGH |
| **Checklist** | Generación de checklists de calidad | HIGH |

### 🔄 Transformation (5 Agentes Medios)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Actualizar** | Actualización de dependencias | MEDIUM |
| **Migrar** | Migración de tecnologías | MEDIUM |
| **Adaptar** | Adaptación a estándares | MEDIUM |
| **Reemplazar** | Reemplazo de código legacy | MEDIUM |
| **Cambiar** | Gestión de cambios | MEDIUM |

### 🚀 Production (4 Agentes Críticos)

| Agente | Descripción | Prioridad |
|--------|-------------|-----------|
| **Produccion** | Verificación de readiness para producción | CRITICAL |
| **Idempotente** | Validación de idempotencia | CRITICAL |
| **Sin Desviaciones** | Enforcement de compliance | CRITICAL |
| **Trabajar** | Orquestador principal | CRITICAL |

## 🔧 Uso Avanzado

### Ejecutar un Agente Individual

```javascript
const result = await system.executeAgent('auditoria', {
  files: [...],
  hasLicense: true,
  hasReadme: true
});

console.log(`Score: ${result.result.score}/100`);
console.log(`Vulnerabilities: ${result.result.vulnerabilities.length}`);
```

### Crear un Workflow Personalizado

```javascript
const customWorkflow = {
  name: 'my-workflow',
  stages: [
    {
      name: 'validation',
      agents: ['validar', 'verificar'],
      parallel: true
    },
    {
      name: 'optimization',
      agents: ['optimizar', 'limpiar'],
      parallel: false
    }
  ]
};

system.engine.registerWorkflow(customWorkflow);
const result = await system.executeWorkflow('my-workflow', context);
```

### Crear un Plan de Ejecución Inteligente

```javascript
const plan = await system.createPlan({
  type: 'code-review',
  changedFiles: ['src/auth.js', 'src/security.js'],
  autofix: true
});

console.log(`Plan: ${plan.phases.length} phases, ${plan.totalAgents} agents`);
console.log(`Estimated duration: ${plan.estimatedDuration}ms`);
```

### Workflows Predefinidos

```javascript
// Code Review
await system.executeWorkflow('code-review', context);

// Development
await system.executeWorkflow('development', context);

// Security
await system.executeWorkflow('security', context);

// Production
await system.executeWorkflow('production', context);

// Complete (todos los agentes)
await system.executeWorkflow('complete', context);
```

## 📊 Métricas y Monitoring

```javascript
// Obtener métricas del sistema
const metrics = system.getMetrics();

console.log(`Total executions: ${metrics.coordinator.totalExecutions}`);
console.log(`Success rate: ${metrics.coordinator.successRate}%`);

// Métricas por agente
metrics.agents.forEach(agent => {
  console.log(`${agent.name}: ${agent.metrics.successRate}% success rate`);
});
```

## 🔍 API Reference

### GitAutomationSystem

- `executeWorkflow(name, context)`: Ejecuta un workflow
- `executeAgent(name, context)`: Ejecuta un agente individual
- `createPlan(context)`: Crea un plan de ejecución
- `listAgents()`: Lista todos los agentes
- `listWorkflows()`: Lista todos los workflows
- `getAgent(name)`: Obtiene un agente por nombre
- `getMetrics()`: Obtiene métricas del sistema

### BaseAgent

- `run(context)`: Ejecuta el agente
- `validate(context)`: Valida pre-condiciones
- `getRecommendations(result)`: Obtiene recomendaciones
- `autoFix(issues)`: Aplica correcciones automáticas
- `getMetadata()`: Obtiene metadata del agente
- `getState()`: Obtiene estado actual

### WorkflowEngine

- `registerWorkflow(workflow)`: Registra un workflow
- `execute(name, context)`: Ejecuta un workflow
- `getWorkflow(name)`: Obtiene un workflow
- `listWorkflows()`: Lista workflows

## 🏗️ Arquitectura

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalles completos de la arquitectura.

```
agents/git-automation/
├── 1-core-review/      (6 agentes)
├── 2-development/      (7 agentes)
├── 3-security/         (3 agentes)
├── 4-documentation/    (4 agentes)
├── 5-transformation/   (5 agentes)
├── 6-production/       (4 agentes)
├── shared/             (base-agent, utils, config, logger, metrics)
├── orchestrator/       (coordinator, engine, planner)
└── index.js            (main entry point)
```

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

## 🔐 Security

Este proyecto sigue las mejores prácticas de seguridad:
- OWASP Top 10
- Secure coding standards
- Dependency scanning
- Regular security audits

## 📝 License

MIT License - ver [LICENSE](LICENSE)

## 👥 Contributors

- **Melampe001** - *Creator* - [GitHub](https://github.com/Melampe001)

## 🙏 Acknowledgments

- Certificaciones: ISO/IEC 25010, OWASP, Clean Code, SOLID
- Inspirado en las mejores prácticas de la industria
- Construido con ❤️ por el equipo Rascacielo Digital

---

**Calidad: IMPERIAL PREMIUM ELITE 👑**
