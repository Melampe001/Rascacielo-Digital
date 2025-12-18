# Rascacielos Digital

**Sistema de desarrollo arquitectónico modular con agentes especializados y CI/CD gates**

## 🏗️ Descripción

Rascacielos Digital es un sistema modular de desarrollo arquitectónico que utiliza agentes especializados para construir, validar y desplegar aplicaciones de manera escalable y segura.

## 🎯 Características Principales

- **Arquitectura Modular**: Componentes independientes y reutilizables
- **Agentes Especializados Mejorados**: Build Agent y Security Agent con funcionalidad completa
- **Módulos Nuevos**: API Client, Auth, y Queue para operaciones comunes
- **CI/CD Gates**: Pipeline automatizado con validaciones de calidad
- **Scripts de Utilidad**: Health check y config check integrados
- **Testing Completo**: Suite de tests con Jest y cobertura
- **Escalabilidad**: Diseño preparado para crecimiento horizontal
- **Seguridad**: Validaciones de seguridad integradas

## 📦 Nuevas Funcionalidades (v2.0.0)

### Agentes Mejorados

#### Build Agent ⚡
- ✅ Validación completa del entorno
- ✅ Limpieza automática de builds previos
- ✅ Verificación de dependencias con npm audit fix
- ✅ Copia recursiva de archivos con filtrado inteligente
- ✅ Generación de manifest con metadata
- ✅ Sistema de logging detallado
- ✅ Rollback automático en errores

#### Security Agent 🔒
- ✅ Auditoría completa de dependencias npm
- ✅ Escaneo de código fuente
- ✅ Detección de patrones peligrosos (eval, innerHTML, etc.)
- ✅ Verificación de secretos expuestos
- ✅ Reportes JSON con recomendaciones
- ✅ Clasificación por severidad

### Nuevos Módulos

#### API Module
- Cliente HTTP completo con GET/POST/PUT/DELETE
- Sistema de retry automático configurable
- Soporte para HTTP y HTTPS
- Manejo de errores robusto

#### Auth Module
- Generación y validación de JWT
- Hash de contraseñas con PBKDF2
- Sistema de roles y permisos (RBAC)
- Verificación de contraseñas

#### Queue Module
- Cola de trabajos en memoria
- Sistema de workers configurables
- Retry automático con backoff exponencial
- Prioridades de trabajos
- Event emitter para hooks

## 📁 Estructura del Proyecto

```
.
├── agents/              # Agentes especializados mejorados
│   ├── build-agent.js   # Build completo con logging
│   ├── security-agent.js # Análisis de seguridad
│   └── README.md        # Documentación de agentes
├── modules/             # Módulos del sistema
│   ├── api/            # Cliente HTTP
│   ├── auth/           # Autenticación y autorización
│   ├── queue/          # Cola de trabajos
│   └── core.js         # Funcionalidades core
├── scripts/            # Scripts de utilidad
│   ├── health-check.js # Verificación de sistema
│   └── config-check.js # Validación de configuración
├── tests/              # Suite de tests
│   ├── build-agent.test.js
│   ├── security-agent.test.js
│   ├── api.test.js
│   ├── auth.test.js
│   └── queue.test.js
├── docs/               # Documentación
│   ├── README.md
│   └── API_REFERENCE.md # Referencia completa de API
├── .github/workflows/  # CI/CD pipelines mejorados
│   └── ci-cd.yml       # Pipeline con 5 gates
└── config/            # Configuraciones
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Melampe001/rascacielos-digital.git
cd rascacielos-digital

# Instalar dependencias
npm install

# Verificar instalación
npm run health-check
npm run config:check
```

### Uso Básico

```bash
# Verificar salud del sistema
npm run health-check

# Construir el proyecto
npm run build

# Análisis de seguridad
npm run security

# Ejecutar tests
npm test

# Ejecutar linting
npm run lint

# Modo desarrollo
npm run dev
```

## 🤖 Agentes Especializados

### Build Agent
```javascript
const BuildAgent = require('./agents/build-agent');
const agent = new BuildAgent({
  sourceDir: './src',
  outputDir: './dist',
  optimize: true
});

const result = await agent.build();
console.log(result.artifacts);
```

### Security Agent
```javascript
const SecurityAgent = require('./agents/security-agent');
const agent = new SecurityAgent({
  target: './src',
  failOnHigh: true
});

const result = await agent.scan();
console.log(result.summary);
```

## 📚 Módulos Disponibles

### API Client
```javascript
const { APIClient } = require('./modules/api');
const client = new APIClient({ baseURL: 'https://api.example.com' });

const response = await client.get('/users');
```

### Auth Module
```javascript
const { Auth } = require('./modules/auth');
const auth = new Auth({ secret: 'my-secret' });

const token = await auth.generateToken({ userId: 123 });
const verified = await auth.verifyToken(token);
```

### Queue Module
```javascript
const { Queue } = require('./modules/queue');
const queue = new Queue('jobs', { concurrency: 5 });

queue.setHandler(async (data) => {
  // Process job
  return result;
});

await queue.add({ task: 'process-data' });
```

## 🔄 CI/CD Pipeline

El pipeline incluye 5 gates mejorados:

1. **🔍 Lint Gate**: Validación de estilo de código con ESLint
2. **🧪 Test Gate**: Pruebas unitarias con Jest y cobertura
3. **🔒 Security Gate**: Análisis de vulnerabilidades con Security Agent
4. **🔨 Build Gate**: Compilación con Build Agent
5. **🚀 Deploy Gate**: Despliegue automático a producción

### Características del Pipeline:
- ✅ GitHub Actions v4 (checkout y setup-node)
- ✅ Cache de npm para velocidad
- ✅ Upload de reportes de seguridad y cobertura
- ✅ Condicionales para deploy solo en rama Main
- ✅ Secrets management integrado

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm test -- --coverage

# Tests en modo watch
npm test -- --watch

# Tests específicos
npm test -- build-agent.test.js
```

**Cobertura actual**: >74% en todos los módulos

## 📊 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia la aplicación |
| `npm run dev` | Modo desarrollo con nodemon |
| `npm test` | Ejecuta tests con cobertura |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores de linting |
| `npm run build` | Construye el proyecto |
| `npm run security` | Análisis de seguridad |
| `npm run clean` | Limpia artefactos |
| `npm run health-check` | Verifica salud del sistema |
| `npm run config:check` | Valida configuración |

## 📚 Documentación

- [README principal](./README.md) - Este archivo
- [Documentación de Agentes](./agents/README.md) - Guía de agentes
- [API Reference](./docs/API_REFERENCE.md) - Referencia completa de API
- [Documentación del Módulo Core](./docs/README.md) - Core del sistema

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Desarrollo

- Sigue el estilo de código definido en `.eslintrc.json`
- Añade tests para nuevas funcionalidades
- Actualiza la documentación correspondiente
- Ejecuta `npm run health-check` antes de hacer commit

## 🔐 Seguridad

- Usa variables de entorno para secretos (`.env`)
- Ejecuta `npm run security` regularmente
- Revisa los reportes de seguridad en `security-report.json`
- Mantén las dependencias actualizadas con `npm audit fix`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Melampe001** - *Trabajo Inicial* - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto

## 📈 Roadmap

- [ ] Deploy Agent completo
- [ ] Monitor Agent con métricas
- [ ] Dashboard web para visualización
- [ ] Integración con más servicios CI/CD
- [ ] Soporte para más lenguajes (Python, Go, Java)