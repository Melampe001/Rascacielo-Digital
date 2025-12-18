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

## 📁 Estructura del Proyecto

```
.
├── agents/              # Agentes especializados
├── modules/             # Módulos del sistema
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

# Build idempotente (nuevo)
npm run build        # Skip si no hay cambios
npm run build:force  # Forzar rebuild

# Watch mode - build automático
npm run watch

# Ejecutar tests
npm test   # o pytest

# Ejecutar linting
npm run lint
```

## 🔨 Build System Idempotente

Nuevo sistema de build con automatización completa:

- ✅ **Checksums SHA256** - Detección precisa de cambios
- ✅ **Build Inteligente** - Skip automático si no hay cambios
- ✅ **File Watcher** - Rebuild automático al guardar
- ✅ **Pre-commit Hooks** - Validación antes de cada commit
- ✅ **CI/CD Integrado** - GitHub Actions con cache

### Comandos de Build

```bash
# Via npm
npm run build        # Build normal
npm run build:force  # Forzar rebuild
npm run watch        # Modo watch

# Via Makefile
make build           # Build idempotente
make build-force     # Forzar rebuild
make watch           # Iniciar watcher
make clean           # Limpiar artifacts
make idempotency-test # Verificar idempotencia
make stats           # Ver estadísticas
make ci              # Simular CI completo
```

Ver [documentación completa del build system](./docs/BUILD_AUTOMATION.md) para más detalles.

## 🤖 Agentes Especializados

Los agentes son componentes autónomos que realizan tareas específicas:

- **Build Agent**: Construcción y compilación
- **Test Agent**: Ejecución de pruebas automatizadas
- **Security Agent**: Análisis de seguridad
- **Deploy Agent**: Despliegue automatizado
- **Monitor Agent**: Monitoreo y alertas

## 🔄 CI/CD Pipeline

El pipeline incluye los siguientes gates:

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Pruebas unitarias y de integración
3. **Security Gate**: Análisis de vulnerabilidades
4. **Build Gate**: Compilación exitosa
5. **Deploy Gate**: Despliegue automático

## 📚 Documentación

Para más información, consulta la [documentación completa](./docs/README.md).

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