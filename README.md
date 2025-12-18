# Rascacielos Digital

**Sistema de desarrollo arquitectónico modular con agentes especializados y CI/CD gates**

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Tests](https://img.shields.io/badge/Tests-62%20passing-brightgreen)](./modules/__tests__)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green?logo=node.js)](https://nodejs.org)

## 🏗️ Descripción

Rascacielos Digital es un sistema modular de desarrollo arquitectónico que utiliza agentes especializados para construir, validar y desplegar aplicaciones de manera escalable y segura.

## 🎯 Características Principales

- **Arquitectura Modular**: Componentes independientes y reutilizables
- **Agentes Especializados**: Sistema de agentes para tareas específicas
- **CI/CD Gates**: Pipeline automatizado con validaciones de calidad
- **Escalabilidad**: Diseño preparado para crecimiento horizontal
- **Seguridad**: Validaciones de seguridad integradas
- **API Serverless**: Endpoints desplegados en Vercel Functions
- **Validación Automatizada**: Scripts de validación pre-deploy

## 📁 Estructura del Proyecto

```
.
├── api/                 # Serverless functions (Vercel)
│   ├── index.js         # API root endpoint
│   ├── health.js        # Health check endpoint
│   ├── status.js        # Service status endpoint
│   └── info.js          # Project info endpoint
├── agents/              # Agentes especializados
│   ├── build-agent.js   # Construcción y compilación
│   ├── deploy-agent.js  # Despliegue automatizado
│   └── security-agent.js# Análisis de seguridad
├── modules/             # Módulos del sistema
│   ├── core.js          # Logger, Config, ErrorHandler
│   ├── api/             # HTTP Client
│   ├── auth/            # JWT, Hash, RBAC
│   └── queue/           # Job Queue
├── scripts/             # Utilidades y validadores
│   └── vercel-validator.js # Validador de configuración Vercel
├── docs/                # Documentación
├── .github/workflows/   # CI/CD pipelines
└── config/              # Configuraciones
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.x o Python >= 3.9
- Git
- Docker (opcional)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Melampe001/rascacielos-digital.git
cd rascacielos-digital

# Instalar dependencias
npm install  # o pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

### Uso Básico

```bash
# Ejecutar el sistema
npm start  # o python main.py

# Ejecutar tests
npm test   # o pytest

# Ejecutar linting
npm run lint
```

## 🤖 Agentes Especializados

Los agentes son componentes autónomos que realizan tareas específicas:

- **Build Agent**: Construcción y compilación multi-lenguaje (JS, Python, Java, Go)
- **Security Agent**: Análisis de seguridad y vulnerabilidades
- **Deploy Agent**: Despliegue automatizado a Vercel

## 🌐 API Endpoints

Una vez desplegado en Vercel, los siguientes endpoints estarán disponibles:

| Endpoint | Descripción |
|----------|-------------|
| `GET /api` | Información general de la API |
| `GET /api/health` | Estado de salud del servicio |
| `GET /api/status` | Estado del deployment |
| `GET /api/info` | Información del proyecto |

## 🔄 CI/CD Pipeline

El pipeline incluye los siguientes gates:

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Pruebas unitarias y de integración (62 tests)
3. **Security Gate**: Análisis de vulnerabilidades
4. **Build Gate**: Compilación exitosa
5. **Vercel Validator**: Validación de configuración pre-deploy
6. **Deploy Gate**: Despliegue automático a Vercel

## 🛠️ Scripts Disponibles

```bash
npm start           # Ejecutar el sistema
npm test            # Ejecutar tests (62 tests)
npm run lint        # Verificar código
npm run lint:fix    # Corregir errores de lint
npm run build       # Construir para producción
npm run validate    # Lint + Format + Tests
npm run security    # Ejecutar análisis de seguridad
node scripts/vercel-validator.js  # Validar config de Vercel
```

## 📚 Documentación

Para más información, consulta la [documentación completa](./docs/README.md).

## 🚀 Deploy en Vercel

Este proyecto está configurado para desplegarse automáticamente en Vercel:

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. El archivo `vercel.json` ya está configurado
3. Los deploys se activan automáticamente con cada push

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Última actualización**: Diciembre 2024 | **Versión**: 1.0.0

## 👥 Autores

- **Melampe001** - *Trabajo Inicial* - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto