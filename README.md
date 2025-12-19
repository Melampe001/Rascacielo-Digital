# Rascacielos Digital

**Sistema de desarrollo arquitectónico modular con agentes especializados y CI/CD gates**

## 🏗️ Descripción

Rascacielos Digital es un sistema modular de desarrollo arquitectónico que utiliza agentes especializados para construir, validar y desplegar aplicaciones de manera escalable y segura.

## 🎯 Características Principales

- **Arquitectura Modular**: Componentes independientes y reutilizables
- **Agentes Especializados**: Sistema de agentes para tareas específicas
- **CI/CD Gates**: Pipeline automatizado con validaciones de calidad
- **Flutter Web UI**: Interfaz moderna y responsive con Material Design 3
- **ML Analytics**: Predicciones en el edge con machine learning
- **Real-time Updates**: Conexiones WebSocket para actualizaciones en vivo
- **Escalabilidad**: Diseño preparado para crecimiento horizontal
- **Seguridad**: Validaciones de seguridad integradas

## 📁 Estructura del Proyecto

```
.
├── agents/              # Agentes especializados
├── flutter_web/         # Aplicación Flutter Web
│   ├── lib/            # Código fuente Flutter
│   │   ├── core/       # Servicios core (API, WebSocket, ML)
│   │   ├── features/   # Features (Dashboard, Agents, Analytics)
│   │   └── main.dart   # Entry point
│   └── integration_test/ # Tests de integración
├── modules/             # Módulos del sistema
├── docs/                # Documentación
│   ├── USER_GUIDE.md   # Guía de usuario
│   └── TESTING.md      # Documentación de testing
├── .github/workflows/   # CI/CD pipelines
└── config/              # Configuraciones
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.x (para backend)
- Flutter SDK >= 3.0.0 (para frontend)
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

**Backend:**
```bash
# Ejecutar el sistema backend
npm start

# Ejecutar tests
npm test

# Ejecutar linting
npm run lint
```

**Frontend (Flutter Web):**
```bash
# Navegar al directorio Flutter
cd flutter_web

# Instalar dependencias
flutter pub get

# Ejecutar en modo desarrollo
flutter run -d chrome

# Build para producción
flutter build web --release

# Ejecutar tests
flutter test
```

**Build completo:**
```bash
# Build backend y frontend
./build-flutter.sh
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

## 🎨 Flutter Web Application

La aplicación Flutter Web proporciona una interfaz moderna para:

- **Dashboard**: Monitoreo en tiempo real de estadísticas y agentes
- **Agent Management**: Ejecución y monitoreo de agentes especializados
- **ML Analytics**: Predicciones y análisis con machine learning en el edge

Ver [Flutter Web README](./flutter_web/README.md) para más detalles.

## 📚 Documentación

- [Guía de Usuario](./docs/USER_GUIDE.md) - Cómo usar la aplicación
- [Testing](./docs/TESTING.md) - Guía de testing y cobertura
- [Flutter Web](./flutter_web/README.md) - Documentación del frontend

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