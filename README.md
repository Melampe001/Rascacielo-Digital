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

## 🚀 Deployment en Vercel

### Preparación

1. **Instalar Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel**

   ```bash
   vercel login
   ```

3. **Configurar Variables de Entorno**
   En el dashboard de Vercel, agrega:
   - `NODE_ENV=production`
   - Otras variables según `.env.example`

### Deployment

#### Preview Deployment

```bash
vercel
```

#### Production Deployment

```bash
vercel --prod
```

### GitHub Integration

Conecta tu repositorio a Vercel para deployments automáticos:

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Conecta tu repositorio GitHub
4. Vercel auto-deployará en cada push a `main`

### API Endpoints

Una vez deployado, tus endpoints estarán disponibles en:

- **Health Check:** `https://tu-proyecto.vercel.app/api/health`
- **Build Agent:** `https://tu-proyecto.vercel.app/api/build`
- **Security Agent:** `https://tu-proyecto.vercel.app/api/security`

### Testing en Producción

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Build Agent
curl -X POST https://tu-proyecto.vercel.app/api/build \
  -H "Content-Type: application/json" \
  -d '{"source": "./src"}'

# Security Agent
curl -X POST https://tu-proyecto.vercel.app/api/security \
  -H "Content-Type: application/json" \
  -d '{"target": "./src"}'
```

## 👥 Autores

- **Melampe001** - _Trabajo Inicial_ - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto
