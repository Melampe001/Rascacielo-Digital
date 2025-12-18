# Agentes Especializados

Este directorio contiene los agentes especializados del sistema Rascacielos Digital.

## 🤖 Arquitectura de Agentes

Cada agente es un componente autónomo responsable de una tarea específica en el pipeline de desarrollo.

## Agentes Disponibles

### 1. Build Agent

**Ubicación**: `./build-agent/`

**Responsabilidades**:

- Compilar código fuente
- Gestionar dependencias
- Generar artefactos de construcción
- Optimizar el build

**Uso**:

```javascript
const buildAgent = require('./build-agent');
await buildAgent.build({
  source: './src',
  output: './dist'
});
```

### 2. Test Agent

**Ubicación**: `./test-agent/`

**Responsabilidades**:

- Ejecutar pruebas unitarias
- Ejecutar pruebas de integración
- Generar reportes de cobertura
- Validar calidad del código

**Uso**:

```javascript
const testAgent = require('./test-agent');
await testAgent.runTests({
  suites: ['unit', 'integration'],
  coverage: true
});
```

### 3. Security Agent

**Ubicación**: `./security-agent/`

**Responsabilidades**:

- Análisis de vulnerabilidades
- Auditoría de dependencias
- Escaneo de código
- Validación de seguridad

**Uso**:

```javascript
const securityAgent = require('./security-agent');
await securityAgent.scan({
  target: './src',
  level: 'strict'
});
```

### 4. Deploy Agent

**Ubicación**: `./deploy-agent/`

**Responsabilidades**:

- Despliegue automatizado
- Gestión de ambientes
- Rollback automático
- Validación post-deploy

**Uso**:

```javascript
const deployAgent = require('./deploy-agent');
await deployAgent.deploy({
  environment: 'production',
  version: '1.0.0'
});
```

### 5. Monitor Agent

**Ubicación**: `./monitor-agent/`

**Responsabilidades**:

- Monitoreo en tiempo real
- Alertas automáticas
- Métricas de rendimiento
- Logs centralizados

**Uso**:

```javascript
const monitorAgent = require('./monitor-agent');
await monitorAgent.watch({
  metrics: ['cpu', 'memory', 'errors'],
  alerts: true
});
```

## 🔧 Crear un Nuevo Agente

Para crear un nuevo agente especializado:

1. Crea un directorio con el nombre del agente
2. Implementa la interfaz `IAgent`
3. Registra el agente en `agent-registry.js`
4. Documenta su uso en este README

### Plantilla Base

```javascript
class MyCustomAgent {
  constructor(config) {
    this.config = config;
  }

  async execute(params) {
    // Implementación del agente
  }

  async validate(params) {
    // Validación de parámetros
  }

  async rollback() {
    // Rollback en caso de error
  }
}

module.exports = MyCustomAgent;
```

## 📊 Estado de los Agentes

| Agente         | Estado    | Versión | Última Actualización |
| -------------- | --------- | ------- | -------------------- |
| Build Agent    | ✅ Activo | 1.0.0   | 2025-12-16           |
| Test Agent     | ✅ Activo | 1.0.0   | 2025-12-16           |
| Security Agent | ✅ Activo | 1.0.0   | 2025-12-16           |
| Deploy Agent   | ✅ Activo | 1.0.0   | 2025-12-16           |
| Monitor Agent  | ✅ Activo | 1.0.0   | 2025-12-16           |

## 🔗 Integración

Los agentes se integran automáticamente con el sistema CI/CD a través de los workflows de GitHub Actions.
