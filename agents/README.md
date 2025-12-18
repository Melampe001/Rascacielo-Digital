# Agentes Especializados

Este directorio contiene los agentes especializados del sistema Rascacielos Digital.

## 🤖 Arquitectura de Agentes

Cada agente es un componente autónomo responsable de una tarea específica en el pipeline de desarrollo.

## Agentes Disponibles

### 1. Build Agent ⚡ (MEJORADO)
**Ubicación**: `./build-agent.js`

**Capacidades Mejoradas**:
- ✅ Validación completa del entorno (Node.js version, dependencias)
- ✅ Limpieza automática de builds previos
- ✅ Verificación e instalación de dependencias con `npm audit fix`
- ✅ Copia recursiva de archivos fuente con filtrado inteligente
- ✅ Proceso de compilación configurable (JavaScript, TypeScript, Babel)
- ✅ Optimización opcional del código (minificación, tree shaking)
- ✅ Generación de manifest con metadata del build
- ✅ Sistema de logging detallado
- ✅ Manejo de errores con rollback automático
- ✅ Soporte para múltiples formatos de salida

**Uso**:
```javascript
const BuildAgent = require('./build-agent');
const agent = new BuildAgent({
  sourceDir: './src',
  outputDir: './dist',
  optimize: true,
  minify: true,
  sourceMaps: true
});

const result = await agent.build();
console.log(result.artifacts); // Lista de archivos generados
```

**CLI**:
```bash
npm run build
```

### 2. Security Agent 🔒 (MEJORADO)
**Ubicación**: `./security-agent.js`

**Capacidades Mejoradas**:
- ✅ Auditoría completa de dependencias npm con análisis detallado
- ✅ Escaneo recursivo de código fuente
- ✅ Detección de patrones de seguridad peligrosos (eval, innerHTML, SQL injection)
- ✅ Verificación de secretos expuestos en archivos
- ✅ Análisis de .gitignore para archivos sensibles
- ✅ Verificación de permisos de archivos (Unix)
- ✅ Generación de reportes en JSON con recomendaciones
- ✅ Clasificación por severidad (critical, high, medium, low)
- ✅ Opción de fallar build en vulnerabilidades críticas

**Uso**:
```javascript
const SecurityAgent = require('./security-agent');
const agent = new SecurityAgent({
  target: './src',
  level: 'moderate',
  failOnHigh: true,
  reportPath: './security-report.json'
});

const result = await agent.scan();
console.log(result.summary); // { total: 5, critical: 1, high: 2, ... }
```

**CLI**:
```bash
npm run security
```

## 🔧 Crear un Nuevo Agente

Para crear un nuevo agente especializado:

1. Crea un archivo con el nombre del agente
2. Implementa la clase con los métodos necesarios
3. Añade logging detallado con `this.log()`
4. Incluye manejo de errores robusto
5. Documenta su uso en este README

### Plantilla Base

```javascript
class MyCustomAgent {
  constructor(config = {}) {
    this.config = {
      // Configuración por defecto
      ...config
    };
    this.log = [];
  }

  async execute(params) {
    this.log('Iniciando ejecución...');
    try {
      // Implementación del agente
      return { success: true };
    } catch (error) {
      this.log(`Error: ${error.message}`, 'error');
      throw error;
    }
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    this.log.push({ timestamp, level, message });
    console.log(`[${this.constructor.name}] ${message}`);
  }
}

module.exports = MyCustomAgent;

// CLI execution
if (require.main === module) {
  const agent = new MyCustomAgent();
  agent.execute()
    .then(result => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
```

## 📊 Estado de los Agentes

| Agente | Estado | Versión | Última Actualización |
|--------|--------|---------|---------------------|
| Build Agent | ✅ Mejorado | 2.0.0 | 2025-12-18 |
| Security Agent | ✅ Mejorado | 2.0.0 | 2025-12-18 |

## 🔗 Integración

Los agentes se integran automáticamente con el sistema CI/CD a través de los workflows de GitHub Actions:

- **Lint Gate**: Validación de código
- **Test Gate**: Pruebas automatizadas
- **Security Gate**: Análisis de seguridad con Security Agent
- **Build Gate**: Construcción con Build Agent
- **Deploy Gate**: Despliegue automatizado
