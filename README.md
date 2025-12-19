# Rascacielos Digital

**Sistema de desarrollo arquitectónico modular con agentes especializados y CI/CD gates**

## 🏗️ Descripción

Rascacielos Digital es un sistema modular de desarrollo arquitectónico que utiliza agentes especializados para construir, validar y desplegar aplicaciones de manera escalable y segura.

## 🎯 Características Principales

- **Arquitectura Modular**: Componentes independientes y reutilizables
- **Agentes Especializados**: Sistema de agentes para tareas específicas
- **CI/CD Gates**: Pipeline automatizado con validaciones de calidad
- **Escalabilidad**: Diseño preparado para crecimiento horizontal
- **Seguridad**: Validaciones de seguridad integradas
- **🏛️ Arquitectura Híbrida**: Backend Node.js + Frontend Flutter Web con API REST y WebSocket

## 📁 Estructura del Proyecto

```
.
├── agents/              # Agentes especializados
├── api/                 # API REST y WebSocket endpoints
│   ├── v1/             # API v1 (agents, docs)
│   └── websocket.js    # WebSocket server
├── modules/             # Módulos del sistema
├── docs/                # Documentación
│   ├── HYBRID_ARCHITECTURE.md  # Arquitectura híbrida
│   ├── FLUTTER_SETUP.md        # Setup Flutter frontend
│   └── ...
├── .github/workflows/   # CI/CD pipelines
├── scripts/             # Scripts de automatización
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

# Setup híbrido automático
./scripts/setup-hybrid.sh

# O instalación manual
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Uso Básico

```bash
# Ejecutar el sistema
npm start

# Ejecutar tests
npm test

# Ejecutar linting
npm run lint

# Acceder a la API
# API Docs: http://localhost:3000/api/v1/docs
# Ejecutar agentes: POST http://localhost:3000/api/v1/agents
```

## 🤖 Agentes Especializados

Los agentes son componentes autónomos que realizan tareas específicas:

- **Build Agent**: Construcción y compilación
- **Security Agent**: Análisis de seguridad
- **Deploy Agent**: Despliegue automatizado
- **Orchestrator Agent**: Orquestación de pipelines completos

### API REST para Agentes

Los agentes están expuestos via API REST en `/api/v1/agents`:

```bash
# Ejemplo: Ejecutar build agent
curl -X POST http://localhost:3000/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "build",
    "action": "build",
    "params": {}
  }'

# Ejemplo: Ejecutar security scan
curl -X POST http://localhost:3000/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "security",
    "action": "scan",
    "params": {}
  }'

# Ejemplo: Ejecutar pipeline completo
curl -X POST http://localhost:3000/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "orchestrator",
    "action": "pipeline",
    "params": { "deploy": false }
  }'
```

## 🔄 CI/CD Pipeline

El pipeline incluye los siguientes gates:

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Pruebas unitarias y de integración
3. **Security Gate**: Análisis de vulnerabilidades
4. **Build Gate**: Compilación exitosa
5. **Deploy Gate**: Despliegue automático

## 📚 Documentación

Para más información, consulta:

- [Documentación Completa](./docs/README.md)
- [🏛️ Arquitectura Híbrida](./docs/HYBRID_ARCHITECTURE.md) - Backend Node.js + Frontend Flutter
- [Flutter Setup](./docs/FLUTTER_SETUP.md) - Setup del frontend Flutter Web
- [API Documentation](http://localhost:3000/api/v1/docs) - OpenAPI/Swagger docs (servidor en ejecución)

## 🏛️ Arquitectura Híbrida

Este proyecto implementa una arquitectura híbrida enterprise-grade:

- **Backend**: Node.js con agentes especializados, API REST y WebSocket
- **Frontend**: Flutter Web con ML/Analytics edge
- **Comunicación**: REST API + WebSocket para tiempo real
- **Deployment**: Vercel para backend y frontend
- **CI/CD**: Workflows automáticos para ambos proyectos

Ver [docs/HYBRID_ARCHITECTURE.md](./docs/HYBRID_ARCHITECTURE.md) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Melampe001** - *Trabajo Inicial* - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto