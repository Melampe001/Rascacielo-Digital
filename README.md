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

## 🧹 Mantenimiento y Limpieza

El proyecto incluye scripts automatizados para mantenimiento y optimización:

### Scripts de Mantenimiento

```bash
# Auditar dependencias (seguridad y versiones obsoletas)
npm run audit

# Aplicar formato y linting automático
npm run lint-and-format

# Limpieza completa del proyecto
npm run cleanup

# Validar todo (lint + format + tests)
npm run validate
```

### Scripts Rápidos

```bash
# Verificar calidad de código
npm run check        # lint + format + test

# Verificar configuración
npm run config:check

# Verificar salud del sistema
npm run health-check
```

Para más detalles sobre los scripts de mantenimiento, consulta [scripts/README.md](./scripts/README.md).

## 🤖 Agentes Especializados

Los agentes son componentes autónomos que realizan tareas específicas:

- **Build Agent**: Construcción y compilación
- **Test Agent**: Ejecución de pruebas automatizadas
- **Security Agent**: Análisis de seguridad
- **Deploy Agent**: Despliegue automatizado
- **Monitor Agent**: Monitoreo y alertas

## 🔄 CI/CD Pipeline

El proyecto cuenta con dos workflows automatizados:

### CI/CD Pipeline Principal (ci-cd.yml)

Pipeline completo con múltiples gates:

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Pruebas unitarias y de integración
3. **Security Gate**: Análisis de vulnerabilidades
4. **Build Gate**: Compilación exitosa
5. **Deploy Gate**: Despliegue automático

### Code Quality Check (code-quality.yml)

Verificación de calidad de código en cada push/PR:

- ESLint y formato de código
- Auditoría de seguridad
- Detección de dependencias no utilizadas
- Cobertura de tests
- Reporte de calidad

Ambos workflows se ejecutan automáticamente en push y pull requests a las ramas principales.

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

- **Melampe001** - _Trabajo Inicial_ - [Melampe001](https://github.com/Melampe001)

## 🙏 Agradecimientos

- Comunidad de código abierto
- Contribuidores del proyecto
