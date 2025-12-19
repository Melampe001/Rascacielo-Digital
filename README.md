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

# Ejecutar tests
npm test   # o pytest

# Ejecutar linting
npm run lint
```

## 🤖 Agentes Especializados

Los agentes son componentes autónomos que realizan tareas específicas:

- **Build Agent**: Construcción y compilación
- **Test Agent**: Ejecución de pruebas automatizadas
- **Security Agent**: Análisis de seguridad
- **Deploy Agent**: Despliegue automatizado
- **Monitor Agent**: Monitoreo y alertas

## 🔄 CI/CD Pipeline

[![CI/CD Pipeline](https://github.com/Melampe001/Rascacielo-Digital/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Melampe001/Rascacielo-Digital/actions/workflows/ci-cd.yml)

El pipeline incluye los siguientes gates:

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Pruebas unitarias y de integración
3. **Security Gate**: Análisis de vulnerabilidades
4. **Build Gate**: Compilación exitosa

### Workflow Automático

El pipeline se ejecuta automáticamente en:
- Push a ramas `main` o `Main`
- Pull Requests hacia `main` o `Main`

### Jobs del Pipeline

#### 1. Lint
- Ejecuta ESLint para verificar calidad de código
- Falla el build si hay errores de linting
- Node.js 18 con npm cache habilitado

#### 2. Test
- Ejecuta suite completa de tests con Jest
- Genera reporte de cobertura
- Sube cobertura a Codecov (si está configurado)
- Requiere que Lint pase exitosamente

#### 3. Build
- Ejecuta el proceso de build
- Genera artifacts en el directorio `dist/`
- Sube artifacts para descarga
- Requiere que Tests pasen exitosamente

#### 4. Security
- Ejecuta `npm audit` con nivel moderate
- Ejecuta Security Agent personalizado
- Corre en paralelo con Build
- Requiere que Tests pasen exitosamente

### Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia la aplicación
npm run dev            # Inicia en modo desarrollo con nodemon

# Testing
npm test               # Ejecuta tests
npm run test:watch     # Ejecuta tests en modo watch
npm run test:coverage  # Genera reporte de cobertura

# Calidad de Código
npm run lint           # Verifica código con ESLint
npm run lint:fix       # Corrige errores automáticamente
npm run format         # Formatea código con Prettier
npm run format:check   # Verifica formato sin cambios

# Build y Deploy
npm run build          # Genera build de producción
npm run clean          # Limpia artifacts
npm run security       # Ejecuta análisis de seguridad

# Validación Completa
npm run validate       # Ejecuta lint + format:check + test
```

### Pre-push Hooks

El proyecto incluye hooks de Git con Husky que ejecutan validaciones antes de push:

1. ✅ Linting
2. ✅ Tests
3. ✅ Build

Esto previene que código con errores llegue al repositorio remoto.

### Debug Workflow

Para depurar problemas en CI/CD, usa el workflow manual de debug:

1. Ve a Actions en GitHub
2. Selecciona "Debug CI/CD"
3. Click en "Run workflow"

Esto ejecutará el pipeline con información detallada de debugging.

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