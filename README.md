# Rascacielo Digital

[![CI/CD Pipeline](https://github.com/Melampe001/Rascacielo-Digital/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Melampe001/Rascacielo-Digital/actions/workflows/ci-cd.yml)
[![Tests](https://img.shields.io/badge/tests-84%20passing-brightgreen)](https://github.com/Melampe001/Rascacielo-Digital)
[![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0-brightgreen)](https://github.com/Melampe001/Rascacielo-Digital)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Version](https://img.shields.io/badge/version-1.1.0-blue)](https://github.com/Melampe001/Rascacielo-Digital/releases)

**Sistema modular con agentes especializados, CI/CD automatizado y arquitectura de microservicios**

---

## 🏗️ Descripción

**Rascacielo Digital** es un sistema production-ready que utiliza agentes especializados para construir, validar y desplegar aplicaciones de manera escalable y segura. Con un enfoque modular y orchestration inteligente, proporciona una solución completa para DevOps y automatización.

---

## ✨ Características Principales

### 🤖 Agentes Especializados
- **Build Agent**: Construcción optimizada con detección automática de tipo de proyecto
- **Security Agent**: Análisis de vulnerabilidades en dependencias y código
- **Deploy Agent**: Despliegue automatizado con health checks
- **Orchestrator Agent**: Coordinación inteligente de múltiples agentes

### 🎭 Orchestrator Agent
- **Ejecución Secuencial**: Pipeline controlado con manejo de errores
- **Ejecución Paralela**: Máximo rendimiento con tasks independientes
- **Pipelines Predefinidos**: Full (maintain → security → build → deploy) y Fast (build → deploy)
- **Rollback Automático**: Reversión inteligente en caso de fallos
- **Métricas del Sistema**: CPU, memoria, tiempos de ejecución
- **Reportes Detallados**: JSON completo de cada ejecución

### 🚀 CI/CD Automatizado
- **5 Gates de Validación**: Lint → Test → Security → Build → Deploy
- **Pre-push Hooks**: Validación automática antes de push
- **GitHub Actions**: Workflows optimizados con caching
- **0 Vulnerabilidades**: Auditorías automatizadas diarias

### ☁️ Vercel Deployment
- **Landing Page**: Interfaz profesional minimalista
- **Serverless APIs**: Endpoints para health, build y security
- **Security Headers**: Enterprise-grade security (HSTS, CSP, X-Frame-Options)
- **Optimized Config**: Caching strategies y function configuration

### 🔧 Mantenimiento Automatizado
- **Cleanup Script**: Limpieza completa de artefactos
- **Audit Script**: Análisis de seguridad de dependencias
- **Lint & Format**: Code quality automatizado
- **Pre-configured**: Scripts listos para usar

---

## 📊 Métricas de Calidad

- ✅ **84 Tests** pasando (100% pass rate)
- ✅ **0 Vulnerabilidades** detectadas
- ✅ **0 Errores** de linting
- ✅ **0 Warnings** de linting
- ✅ **CodeQL Scan** passed
- ✅ **280KB** package-lock.json
- ✅ **Production-Ready** status

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Verificar instalación
npm run config:check
npm run health-check
```

### Uso Básico

```bash
# Desarrollo con hot-reload
npm run dev

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Build para producción
npm run build
```

### Orchestrator - Pipelines

```bash
# Pipeline completo (maintain → security → build → deploy)
npm run orchestrate:full

# Pipeline rápido (build → deploy)
npm run orchestrate:fast

# Ejecución paralela
npm run orchestrate:parallel

# Atajo para pipeline completo
npm run agents:all
```

---

## 📁 Estructura del Proyecto

```
rascacielo-digital/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml                      # Pipeline principal
│       └── orchestrator-pipeline.yml      # Pipeline de orchestrator
├── .husky/
│   └── pre-push                           # Git hook pre-push
├── agents/
│   ├── orchestrator-agent.js             # 🎭 Orchestrator
│   ├── build-agent.js                    # 🔨 Build
│   ├── security-agent.js                 # 🔒 Security
│   ├── deploy-agent.js                   # 🚀 Deploy
│   └── __tests__/                        # Tests de agentes
├── api/
│   ├── health.js                         # Health check endpoint
│   ├── build.js                          # Build API endpoint
│   └── security.js                       # Security API endpoint
├── public/
│   └── index.html                        # Landing page
├── scripts/
│   ├── cleanup.sh                        # Script de limpieza
│   ├── audit-dependencies.sh             # Auditoría de seguridad
│   ├── lint-and-format.sh                # Code quality
│   └── README.md                         # Documentación de scripts
├── modules/
│   ├── core.js                           # Logger, Config, Utils
│   ├── api/                              # HTTP Client
│   ├── auth/                             # JWT, Password, RBAC
│   ├── queue/                            # Job Queue
│   └── treesit-client.js                 # Treesit Cloud API
├── docs/
│   ├── ORCHESTRATOR.md                   # Guía del Orchestrator
│   ├── DEPLOYMENT.md                     # Guía de deployment
│   ├── WORKFLOW.md                       # Workflow de desarrollo
│   └── README.md                         # Docs principales
├── config/                                # Configuraciones
├── .env.example                          # Variables de entorno
├── .gitignore                            # Archivos ignorados
├── .vercelignore                         # Vercel ignore
├── vercel.json                           # Vercel config
├── package.json                          # Dependencies y scripts
├── package-lock.json                     # Lockfile (280KB)
├── jest.config.js                        # Jest configuration
├── .eslintrc.json                        # ESLint rules
├── .prettierrc.json                      # Prettier config
├── README.md                             # Este archivo
├── CHANGELOG.md                          # Historial de cambios
├── LICENSE                               # MIT License
└── index.js                              # Entry point
```

---

## 🤖 Agentes Especializados

### Build Agent
Construcción optimizada con soporte multi-lenguaje:
- JavaScript/Node.js
- Python
- Java
- Go
- Detección automática de tipo de proyecto
- Validación de parámetros
- Generación de artefactos

```bash
npm run agents:build
```

### Security Agent
Análisis de seguridad completo:
- Escaneo de dependencias (npm audit)
- Análisis de código fuente
- Detección de vulnerabilidades
- Reportes en JSON y texto
- Configuración por niveles (strict, moderate, relaxed)

```bash
npm run agents:security
```

### Deploy Agent
Despliegue automatizado:
- Integración con Treesit Cloud
- Health checks automáticos
- Rollback en caso de fallo
- Métricas de deployment

```bash
npm run agents:deploy
```

### Orchestrator Agent
Coordinación de agentes:
- Pipeline completo (4 agentes en secuencia)
- Pipeline rápido (2 agentes)
- Ejecución paralela
- Rollback automático
- Reportes detallados
- CLI integrado

```bash
npm run orchestrate:full
```

---

## 🔄 CI/CD Pipeline

El pipeline automatizado incluye 5 gates de validación:

### 1. Lint Gate
- ✅ ESLint checks
- ✅ Code style validation
- ⏱️ ~10 segundos

### 2. Test Gate
- ✅ Unit tests (84 tests)
- ✅ Integration tests
- ✅ Coverage report
- ⏱️ ~30 segundos

### 3. Security Gate
- ✅ npm audit
- ✅ Trivy scan
- ✅ Dependency checks
- ⏱️ ~20 segundos

### 4. Build Gate
- ✅ Production build
- ✅ Artifact generation
- ✅ Build validation
- ⏱️ ~15 segundos

### 5. Deploy Gate (main only)
- ✅ Deploy to production
- ✅ Health checks
- ✅ Smoke tests
- ⏱️ ~30 segundos

**Total Pipeline Time**: ~2 minutos

---

## 📚 Documentación Completa

- **[Orchestrator Guide](./docs/ORCHESTRATOR.md)** - Guía completa del orchestrator (9.6KB)
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Instrucciones de deployment (8.4KB)
- **[Workflow Guide](./docs/WORKFLOW.md)** - Flujo de trabajo de desarrollo (10.7KB)
- **[Scripts Documentation](./scripts/README.md)** - Guía de scripts de mantenimiento
- **[Changelog](./CHANGELOG.md)** - Historial de versiones
- **[Contributing](./CONTRIBUTING.md)** - Guía de contribución
- **[Security Policy](./SECURITY.md)** - Política de seguridad

---

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm start              # Iniciar aplicación
npm run dev            # Desarrollo con hot-reload
npm test               # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:coverage  # Tests con coverage
```

### Code Quality
```bash
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Fix automático de ESLint
npm run format         # Formatear con Prettier
npm run format:check   # Check formato sin modificar
npm run check          # Lint + format + test
```

### Build & Deploy
```bash
npm run build          # Build para producción
npm run clean          # Limpiar artefactos
npm run deploy         # Desplegar a Treesit Cloud
npm run deploy:status  # Ver estado del deployment
```

### Mantenimiento
```bash
npm run cleanup            # Limpieza completa
npm run audit              # Auditoría de seguridad
npm run lint-and-format    # Lint + format automático
```

### Orchestrator
```bash
npm run orchestrate:full      # Pipeline completo
npm run orchestrate:fast      # Pipeline rápido
npm run orchestrate:parallel  # Ejecución paralela
npm run agents:all            # Alias de orchestrate:full
```

### Agentes Individuales
```bash
npm run agents:build       # Ejecutar Build Agent
npm run agents:security    # Ejecutar Security Agent
npm run agents:deploy      # Ejecutar Deploy Agent
```

---

## 🌐 Deployment

### Vercel (Recomendado)

El proyecto está configurado para deployment automático en Vercel:

1. **Conectar con Vercel**
   - Visita [vercel.com](https://vercel.com)
   - Import tu repositorio
   - Vercel detectará automáticamente `vercel.json`

2. **Configurar Environment Variables**
   ```env
   NODE_ENV=production
   JWT_SECRET=your_secret_here
   TREESIT_API_KEY=your_api_key
   ```

3. **Deploy**
   ```bash
   git push origin main
   # Vercel despliega automáticamente
   ```

### Endpoints Disponibles

Una vez desplegado:
- `https://your-project.vercel.app/` - Landing page
- `https://your-project.vercel.app/api/health` - Health check
- `https://your-project.vercel.app/api/build` - Build Agent API
- `https://your-project.vercel.app/api/security` - Security Agent API

### Local

```bash
# Desarrollo local
npm run dev

# Build local
npm run build

# Vercel CLI (opcional)
npm install -g vercel
vercel dev
```

---

## 🔐 Seguridad

### Security Headers

Todos los deployments incluyen headers enterprise-grade:
- ✅ Strict-Transport-Security (HSTS)
- ✅ Content-Security-Policy (CSP)
- ✅ X-Frame-Options (DENY)
- ✅ X-Content-Type-Options (nosniff)
- ✅ X-XSS-Protection
- ✅ Referrer-Policy

### Auditorías Automatizadas

```bash
# Auditoría manual
npm run audit

# Auditoría en CI/CD
# Se ejecuta automáticamente en cada push
```

### Vulnerabilidades

- **Status**: 0 vulnerabilidades detectadas
- **CodeQL**: All checks passed
- **npm audit**: Clean bill of health
- **Trivy**: No critical/high vulnerabilities

### Security Summary

✅ **All security checks passed**
- No vulnerabilities detected in dependencies
- CodeQL scan found 0 alerts
- Pre-push hooks enforce security checks
- Automated daily audits via GitHub Actions

**Note**: Content Security Policy in `vercel.json` uses `'unsafe-inline'` for quick development. For production, consider using nonces or hashes for stricter CSP.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor sigue el [workflow guide](./docs/WORKFLOW.md).

### Quick Start para Contribuidores

1. **Fork el proyecto**
2. **Clonar tu fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Rascacielo-Digital.git
   cd Rascacielo-Digital
   ```

3. **Crear rama de feature**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Hacer cambios y commitear**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push y crear PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: agregar tests
chore: mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

## 🌟 Agradecimientos

- Todos los [contribuidores](https://github.com/Melampe001/Rascacielo-Digital/graphs/contributors)
- GitHub Actions por CI/CD gratuito
- Vercel por hosting serverless
- La comunidad open source

---

## 📞 Soporte

- **GitHub Issues**: [Reportar problemas](https://github.com/Melampe001/Rascacielo-Digital/issues)
- **Discussions**: [Preguntas y discusiones](https://github.com/Melampe001/Rascacielo-Digital/discussions)
- **Documentation**: [Docs completa](./docs/)

---

## 🔗 Links Útiles

- [Changelog](./CHANGELOG.md) - Historial de versiones
- [Roadmap](https://github.com/Melampe001/Rascacielo-Digital/issues) - Próximas features
- [Security Policy](./SECURITY.md) - Reportar vulnerabilidades
- [Contributing Guidelines](./CONTRIBUTING.md) - Guía de contribución

---

<div align="center">

**[Rascacielo Digital v1.1.0](https://github.com/Melampe001/Rascacielo-Digital)**

Sistema modular con agentes especializados

Made with ❤️ by [Melampe001](https://github.com/Melampe001)

</div>
