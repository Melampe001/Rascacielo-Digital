# API Reference - Rascacielos Digital

Esta es la referencia completa de la API para todos los módulos y agentes del sistema Rascacielos Digital.

## 📚 Tabla de Contenidos

- [Agentes](#agentes)
  - [Build Agent](#build-agent)
  - [Security Agent](#security-agent)
- [Módulos](#módulos)
  - [API Client](#api-client)
  - [Auth Module](#auth-module)
  - [Queue Module](#queue-module)

---

## Agentes

### Build Agent

**Ubicación**: `agents/build-agent.js`

#### Constructor

```javascript
new BuildAgent(config)
```

**Parámetros**:
- `config` (Object) - Configuración del agente
  - `sourceDir` (String) - Directorio fuente (default: `'./src'`)
  - `outputDir` (String) - Directorio de salida (default: `'./dist'`)
  - `optimize` (Boolean) - Optimizar código (default: `true`)
  - `minify` (Boolean) - Minificar código (default: `true`)
  - `sourceMaps` (Boolean) - Generar source maps (default: `true`)

#### Métodos

##### `build(params)`

Ejecuta el proceso completo de build.

**Parámetros**:
- `params` (Object)
  - `source` (String) - Directorio fuente alternativo
  - `target` (String) - Target de compilación (default: `'node'`)
  - `format` (String) - Formato de salida (default: `'commonjs'`)

**Retorna**: `Promise<Object>`
```javascript
{
  success: true,
  duration: "721ms",
  artifacts: ["dist/file1.js", "dist/file2.js"],
  outputDir: "./dist",
  log: [...],
  timestamp: "2025-12-18T01:11:14.254Z"
}
```

##### `validateEnvironment()`

Valida el entorno de ejecución.

**Retorna**: `Promise<void>`

##### `clean()`

Limpia el directorio de salida.

**Retorna**: `Promise<void>`

##### `rollback()`

Revierte cambios en caso de error.

**Retorna**: `Promise<void>`

---

### Security Agent

**Ubicación**: `agents/security-agent.js`

#### Constructor

```javascript
new SecurityAgent(config)
```

**Parámetros**:
- `config` (Object)
  - `target` (String) - Directorio a escanear (default: `'./src'`)
  - `level` (String) - Nivel de seguridad: `'strict'`, `'moderate'`, `'relaxed'` (default: `'moderate'`)
  - `failOnHigh` (Boolean) - Fallar en vulnerabilidades altas (default: `true`)
  - `reportPath` (String) - Ruta del reporte (default: `'./security-report.json'`)

#### Métodos

##### `scan(params)`

Ejecuta análisis de seguridad completo.

**Parámetros**:
- `params` (Object)
  - `target` (String) - Directorio alternativo a escanear

**Retorna**: `Promise<Object>`
```javascript
{
  success: true,
  duration: "428ms",
  vulnerabilities: [...],
  summary: {
    total: 5,
    critical: 1,
    high: 2,
    medium: 1,
    low: 1
  },
  report: {...},
  log: [...],
  timestamp: "2025-12-18T01:11:22.483Z"
}
```

##### `auditDependencies()`

Audita dependencias npm.

**Retorna**: `Promise<void>`

##### `scanSourceCode(targetDir)`

Escanea código fuente en busca de vulnerabilidades.

**Parámetros**:
- `targetDir` (String) - Directorio a escanear

**Retorna**: `Promise<void>`

##### `getSummary()`

Obtiene resumen de vulnerabilidades.

**Retorna**: `Object`
```javascript
{
  total: 5,
  critical: 1,
  high: 2,
  medium: 1,
  low: 1
}
```

---

## Módulos

### API Client

**Ubicación**: `modules/api/index.js`

#### Constructor

```javascript
const { APIClient } = require('./modules/api');
const client = new APIClient(config);
```

**Parámetros**:
- `config` (Object)
  - `baseURL` (String) - URL base de la API (default: `''`)
  - `timeout` (Number) - Timeout en ms (default: `30000`)
  - `headers` (Object) - Headers por defecto (default: `{}`)
  - `retries` (Number) - Número de reintentos (default: `3`)
  - `retryDelay` (Number) - Delay entre reintentos en ms (default: `1000`)

#### Métodos

##### `get(endpoint, options)`

Realiza petición GET.

**Parámetros**:
- `endpoint` (String) - URL o path del endpoint
- `options` (Object) - Opciones de la petición
  - `headers` (Object) - Headers adicionales

**Retorna**: `Promise<Object>`
```javascript
{
  status: 200,
  headers: {...},
  data: {...}
}
```

##### `post(endpoint, data, options)`

Realiza petición POST.

**Parámetros**:
- `endpoint` (String) - URL o path del endpoint
- `data` (Object) - Datos a enviar
- `options` (Object) - Opciones de la petición

**Retorna**: `Promise<Object>`

##### `put(endpoint, data, options)`

Realiza petición PUT.

##### `delete(endpoint, options)`

Realiza petición DELETE.

---

### Auth Module

**Ubicación**: `modules/auth/index.js`

#### Constructor

```javascript
const { Auth } = require('./modules/auth');
const auth = new Auth(config);
```

**Parámetros**:
- `config` (Object)
  - `secret` (String) - Secreto para firmar tokens (default: `'default-secret-change-me'`)
  - `expiresIn` (String) - Tiempo de expiración (default: `'24h'`)
  - `algorithm` (String) - Algoritmo de firma (default: `'HS256'`)

#### Métodos

##### `generateToken(payload, options)`

Genera un JWT token.

**Parámetros**:
- `payload` (Object) - Datos a incluir en el token
- `options` (Object)
  - `expiresIn` (String) - Tiempo de expiración alternativo

**Retorna**: `Promise<String>`
```javascript
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNjM5..."
```

##### `verifyToken(token)`

Verifica un JWT token.

**Parámetros**:
- `token` (String) - Token a verificar

**Retorna**: `Promise<Object>`
```javascript
{
  valid: true,
  payload: {
    userId: 123,
    username: 'testuser',
    iat: 1639584000,
    exp: 1639670400
  }
}
```

##### `hashPassword(password, salt)`

Hash de contraseña con PBKDF2.

**Parámetros**:
- `password` (String) - Contraseña a hashear
- `salt` (String) - Salt (opcional, se genera si no se proporciona)

**Retorna**: `Promise<Object>`
```javascript
{
  hash: "3a7bd3e...",
  salt: "5f7d2c..."
}
```

##### `verifyPassword(password, hash, salt)`

Verifica una contraseña.

**Parámetros**:
- `password` (String) - Contraseña a verificar
- `hash` (String) - Hash almacenado
- `salt` (String) - Salt usado

**Retorna**: `Promise<Boolean>`

##### `hasPermission(userRoles, requiredPermission)`

Verifica permisos basados en roles.

**Parámetros**:
- `userRoles` (Array<String>) - Roles del usuario (e.g., `['admin', 'editor']`)
- `requiredPermission` (String) - Permiso requerido (e.g., `'delete'`)

**Retorna**: `Boolean`

**Roles disponibles**:
- `admin`: `['read', 'write', 'delete', 'admin']`
- `editor`: `['read', 'write']`
- `viewer`: `['read']`

---

### Queue Module

**Ubicación**: `modules/queue/index.js`

#### Constructor

```javascript
const { Queue } = require('./modules/queue');
const queue = new Queue(name, config);
```

**Parámetros**:
- `name` (String) - Nombre de la cola
- `config` (Object)
  - `concurrency` (Number) - Trabajos simultáneos (default: `5`)
  - `maxRetries` (Number) - Reintentos máximos (default: `3`)
  - `retryDelay` (Number) - Delay entre reintentos en ms (default: `1000`)
  - `timeout` (Number) - Timeout por trabajo en ms (default: `30000`)

#### Métodos

##### `add(data, options)`

Añade un trabajo a la cola.

**Parámetros**:
- `data` (Object) - Datos del trabajo
- `options` (Object)
  - `priority` (Number) - Prioridad (default: `0`)
  - `maxRetries` (Number) - Reintentos máximos para este trabajo

**Retorna**: `Promise<Object>`
```javascript
{
  id: "1639584000000-abc123def",
  data: {...},
  priority: 0,
  retries: 0,
  maxRetries: 3,
  status: "pending",
  createdAt: 1639584000000
}
```

##### `setHandler(handler)`

Establece el manejador de trabajos.

**Parámetros**:
- `handler` (Function) - Función asíncrona que procesa el trabajo

**Ejemplo**:
```javascript
queue.setHandler(async (data) => {
  // Procesar trabajo
  return result;
});
```

##### `getStats()`

Obtiene estadísticas de la cola.

**Retorna**: `Object`
```javascript
{
  name: "my-queue",
  pending: 5,
  processing: 2,
  completed: 10,
  failed: 1,
  total: 18
}
```

##### `clear()`

Limpia la cola.

**Retorna**: `void`

#### Eventos

La cola emite eventos que puedes escuchar:

```javascript
queue.on('job:added', (job) => {
  console.log('Job added:', job.id);
});

queue.on('job:started', (job) => {
  console.log('Job started:', job.id);
});

queue.on('job:completed', (job) => {
  console.log('Job completed:', job.id, job.result);
});

queue.on('job:failed', (job) => {
  console.log('Job failed:', job.id, job.error);
});

queue.on('job:retrying', (job) => {
  console.log('Job retrying:', job.id, job.retries);
});

queue.on('queue:drained', () => {
  console.log('Queue is empty');
});
```

---

## Ejemplos de Uso Completos

### Ejemplo 1: Build y Deploy

```javascript
const BuildAgent = require('./agents/build-agent');
const SecurityAgent = require('./agents/security-agent');

async function buildAndDeploy() {
  // Build
  const buildAgent = new BuildAgent();
  const buildResult = await buildAgent.build();
  
  if (!buildResult.success) {
    throw new Error('Build failed');
  }
  
  // Security scan
  const securityAgent = new SecurityAgent();
  const securityResult = await securityAgent.scan();
  
  if (!securityResult.success) {
    throw new Error('Security scan failed');
  }
  
  console.log('✅ Build and security check passed!');
}

buildAndDeploy().catch(console.error);
```

### Ejemplo 2: API Client con Auth

```javascript
const { APIClient } = require('./modules/api');
const { Auth } = require('./modules/auth');

async function authenticatedRequest() {
  const auth = new Auth({ secret: 'my-secret' });
  const token = await auth.generateToken({ userId: 123 });
  
  const client = new APIClient({
    baseURL: 'https://api.example.com',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const response = await client.get('/users/123');
  console.log(response.data);
}
```

### Ejemplo 3: Queue con Workers

```javascript
const { Queue } = require('./modules/queue');

async function processJobs() {
  const queue = new Queue('emails', { concurrency: 3 });
  
  // Set handler
  queue.setHandler(async (data) => {
    console.log(`Sending email to ${data.email}`);
    await sendEmail(data.email, data.subject, data.body);
    return { sent: true };
  });
  
  // Add jobs
  await queue.add({ email: 'user1@example.com', subject: 'Hello' }, { priority: 1 });
  await queue.add({ email: 'user2@example.com', subject: 'World' }, { priority: 0 });
  
  // Wait for completion
  await new Promise(resolve => {
    queue.on('queue:drained', resolve);
  });
  
  const stats = queue.getStats();
  console.log('Stats:', stats);
}
```

---

## 🔧 Scripts de Utilidad

### Health Check

```bash
npm run health-check
```

Verifica el estado del sistema:
- Versión de Node.js
- Dependencias instaladas
- Agentes presentes
- Módulos disponibles

### Config Check

```bash
npm run config:check
```

Valida la configuración del proyecto:
- package.json
- .gitignore
- Variables de entorno
- Estructura de directorios

---

## 📝 Notas

- Todos los métodos asíncronos retornan Promises
- Los agentes incluyen logging detallado automáticamente
- Los módulos manejan errores de forma robusta
- Se recomienda usar variables de entorno para secretos

---

## 🆘 Soporte

Para más información o soporte, consulta:
- [README principal](../README.md)
- [Documentación de agentes](../agents/README.md)
- [Issues en GitHub](https://github.com/Melampe001/Rascacielo-Digital/issues)
