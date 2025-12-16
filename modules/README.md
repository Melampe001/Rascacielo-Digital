# Módulos del Sistema

Este directorio contiene los módulos principales del sistema Rascacielos Digital.

## 🧩 Arquitectura Modular

El sistema está diseñado con una arquitectura modular que permite:

- **Independencia**: Cada módulo funciona de manera autónoma
- **Reutilización**: Los módulos pueden ser utilizados en diferentes contextos
- **Escalabilidad**: Fácil añadir o remover módulos
- **Mantenibilidad**: Código organizado y fácil de mantener

## 📦 Módulos Disponibles

### 1. Core Module
**Descripción**: Funcionalidad central del sistema

**Componentes**:
- Sistema de configuración
- Logger centralizado
- Gestión de errores
- Utilidades comunes

**Uso**:
```javascript
const { Config, Logger } = require('./modules/core');

const logger = new Logger('MyApp');
logger.info('Aplicación iniciada');
```

### 2. API Module
**Descripción**: Manejo de APIs y servicios REST

**Componentes**:
- Cliente HTTP
- Gestión de rutas
- Middleware
- Validación de requests

**Uso**:
```javascript
const { APIClient } = require('./modules/api');

const client = new APIClient({ baseURL: 'https://api.example.com' });
const data = await client.get('/users');
```

### 3. Database Module
**Descripción**: Gestión de bases de datos

**Componentes**:
- Conexión a DB
- Modelos
- Migrations
- Query builder

**Uso**:
```javascript
const { Database } = require('./modules/database');

const db = new Database({ connection: 'postgres://...' });
await db.connect();
```

### 4. Auth Module
**Descripción**: Autenticación y autorización

**Componentes**:
- JWT handling
- Sesiones
- Roles y permisos
- OAuth integrations

**Uso**:
```javascript
const { Auth } = require('./modules/auth');

const auth = new Auth();
const token = await auth.generateToken(user);
```

### 5. Queue Module
**Descripción**: Gestión de colas y trabajos asíncronos

**Componentes**:
- Job queue
- Workers
- Scheduler
- Retry logic

**Uso**:
```javascript
const { Queue } = require('./modules/queue');

const queue = new Queue('emails');
await queue.add({ to: 'user@example.com', subject: 'Hello' });
```

## 🔧 Crear un Nuevo Módulo

### Estructura Recomendada

```
modules/
  └── my-module/
      ├── index.js          # Punto de entrada
      ├── lib/              # Lógica del módulo
      ├── tests/            # Pruebas
      ├── README.md         # Documentación
      └── package.json      # Dependencias (opcional)
```

### Plantilla Base

```javascript
// modules/my-module/index.js

class MyModule {
  constructor(config = {}) {
    this.config = config;
  }

  async initialize() {
    // Inicialización del módulo
  }

  async execute() {
    // Lógica principal
  }

  async cleanup() {
    // Limpieza de recursos
  }
}

module.exports = MyModule;
```

## 🔗 Integración de Módulos

Los módulos se integran a través del sistema de registry:

```javascript
const { ModuleRegistry } = require('./core/registry');

const registry = new ModuleRegistry();
registry.register('myModule', MyModule);

const module = registry.get('myModule');
await module.initialize();
```

## 📊 Estado de los Módulos

| Módulo | Estado | Versión | Dependencias |
|--------|--------|---------|--------------|
| Core | ✅ Estable | 1.0.0 | Ninguna |
| API | ✅ Estable | 1.0.0 | axios |
| Database | ✅ Estable | 1.0.0 | pg, mysql2 |
| Auth | ✅ Estable | 1.0.0 | jsonwebtoken |
| Queue | ✅ Estable | 1.0.0 | bull |

## 🧪 Testing

Cada módulo debe incluir sus propias pruebas:

```bash
# Probar un módulo específico
npm test -- modules/my-module

# Probar todos los módulos
npm test
```

## 📚 Documentación

Para más detalles sobre cada módulo, consulta su README.md individual.
