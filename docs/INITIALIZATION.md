# Guía de Inicialización - Rascacielos Digital

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

Verifica las versiones instaladas:

```bash
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 9.0.0
```

## 🚀 Pasos de Inicialización

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias definidas en `package.json`:
- `eslint` - Linter de código
- `jest` - Framework de testing
- `nodemon` - Desarrollo con recarga automática

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta las configuraciones según sea necesario:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Application
NODE_ENV=development
PORT=3000

# Build Configuration
BUILD_OPTIMIZE=true
BUILD_OUTPUT_DIR=./dist

# Security Configuration
SECURITY_LEVEL=moderate
SECURITY_FAIL_ON_HIGH=true

# Logging
LOG_LEVEL=info
```

### 4. Verificar Configuración

Ejecuta el script de verificación de configuración:

```bash
npm run config:check
```

Este comando verifica que:
- El archivo `.env` existe
- `package.json` es válido
- `node_modules` está instalado
- Los directorios requeridos existen

### 5. Ejecutar Health Check

Verifica que el sistema esté funcionando correctamente:

```bash
npm run health-check
```

Este comando valida:
- Inicialización del sistema
- Carga de agentes especializados
- Carga de módulos core

## ✅ Verificación de la Instalación

### Ejecutar la Aplicación

```bash
npm start
```

Deberías ver una salida similar a:

```
[INFO][RascacielosDigital] Inicializando Rascacielos Digital...
[INFO][RascacielosDigital] Ambiente: development
[INFO][RascacielosDigital] Puerto: 3000
[INFO][RascacielosDigital] Agentes cargados: 2
==================================================
Rascacielos Digital está listo
Sistema modular con agentes especializados
==================================================
```

### Ejecutar Tests

```bash
npm test
```

Todos los tests deben pasar exitosamente.

### Ejecutar Linter

```bash
npm run lint
```

No debe haber errores de linting.

## 🎯 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia la aplicación en modo producción |
| `npm run dev` | Inicia la aplicación en modo desarrollo con auto-recarga |
| `npm test` | Ejecuta los tests con coverage |
| `npm run lint` | Ejecuta el linter de código |
| `npm run lint:fix` | Ejecuta el linter y corrige problemas automáticamente |
| `npm run build` | Ejecuta el Build Agent |
| `npm run security` | Ejecuta el Security Agent |
| `npm run clean` | Limpia directorios de build y coverage |
| `npm run config:check` | Verifica la configuración del proyecto |
| `npm run health-check` | Ejecuta health check del sistema |

## 🏗️ Estructura del Proyecto

```
Rascacielo-Digital/
├── agents/              # Agentes especializados
│   ├── build-agent.js
│   └── security-agent.js
├── modules/             # Módulos core del sistema
│   └── core.js
├── config/              # Archivos de configuración
│   └── default.json
├── scripts/             # Scripts de utilidad
│   ├── config-check.js
│   └── health-check.js
├── __tests__/           # Tests del sistema
│   └── system.test.js
├── docs/                # Documentación
├── .github/workflows/   # CI/CD pipelines
├── .env                 # Variables de entorno (no versionado)
├── .env.example         # Ejemplo de variables de entorno
├── .eslintrc.json       # Configuración de ESLint
├── .gitignore           # Archivos ignorados por Git
├── jest.config.js       # Configuración de Jest
├── index.js             # Punto de entrada principal
├── package.json         # Dependencias y scripts
└── README.md            # Documentación principal
```

## 🤖 Agentes Disponibles

### Build Agent
Especializado en construcción y compilación de código.

```javascript
const BuildAgent = require('./agents/build-agent');
const agent = new BuildAgent();
await agent.build({ source: './src' });
```

### Security Agent
Especializado en análisis de seguridad y vulnerabilidades.

```javascript
const SecurityAgent = require('./agents/security-agent');
const agent = new SecurityAgent();
await agent.scan({ target: './src' });
```

## 🔧 Solución de Problemas

### Error: "node_modules not found"
```bash
npm install
```

### Error: ".env file not found"
```bash
cp .env.example .env
```

### Error de versión de Node.js
Actualiza Node.js a la versión 18 o superior usando [nvm](https://github.com/nvm-sh/nvm):
```bash
nvm install 18
nvm use 18
```

### Limpiar y reinstalar
Si encuentras problemas, intenta limpiar y reinstalar:
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Pasos

1. Lee la [documentación completa](./README.md)
2. Revisa la [guía de contribución](./CONTRIBUTING.md)
3. Explora los [agentes especializados](./agents/README.md)
4. Configura el [pipeline CI/CD](./.github/workflows/ci-cd.yml)

## 🆘 Soporte

Si tienes problemas durante la inicialización:

1. Verifica que cumples con los prerrequisitos
2. Ejecuta `npm run config:check` para diagnosticar problemas
3. Consulta la sección de solución de problemas
4. Abre un [issue en GitHub](https://github.com/Melampe001/Rascacielo-Digital/issues)

## ✨ ¡Éxito!

Si todos los pasos se completaron exitosamente, tu proyecto Rascacielos Digital está inicializado y listo para usar. ¡Comienza a construir! 🎉
