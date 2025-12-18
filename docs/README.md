# Documentación - Rascacielos Digital

Bienvenido a la documentación completa del sistema Rascacielos Digital.

## 📖 Índice

1. [Guía de Inicio](#guía-de-inicio)
2. [Arquitectura](#arquitectura)
3. [Agentes Especializados](#agentes-especializados)
4. [Módulos del Sistema](#módulos-del-sistema)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [API Reference](#api-reference)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

## Guía de Inicio

### Instalación

#### Requisitos del Sistema

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Git**: >= 2.x
- **Docker**: >= 20.x (opcional)

#### Instalación Básica

```bash
# Clonar el repositorio
git clone https://github.com/Melampe001/rascacielos-digital.git
cd rascacielos-digital

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
nano .env

# Iniciar el sistema
npm start
```

### Primeros Pasos

1. **Configuración Inicial**

   ```bash
   npm run setup
   ```

2. **Verificar Instalación**

   ```bash
   npm run health-check
   ```

3. **Ejecutar Tests**
   ```bash
   npm test
   ```

## Arquitectura

### Visión General

Rascacielos Digital utiliza una arquitectura modular basada en agentes especializados:

```
┌─────────────────────────────────────────┐
│         CI/CD Pipeline (GitHub)         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│           Gate Controllers              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐│
│  │ Lint │ │ Test │ │ Sec. │ │ Deploy ││
│  └──────┘ └──────┘ └──────┘ └────────┘│
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       Specialized Agents Layer          │
│  ┌───────┐ ┌──────┐ ┌─────────┐       │
│  │ Build │ │ Test │ │Security │ ...   │
│  └───────┘ └──────┘ └─────────┘       │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Application Modules             │
│  ┌──────┐ ┌─────┐ ┌──────┐ ┌────────┐ │
│  │ Core │ │ API │ │ Auth │ │ Queue  │ │
│  └──────┘ └─────┘ └──────┘ └────────┘ │
└─────────────────────────────────────────┘
```

### Principios de Diseño

1. **Modularidad**: Componentes independientes y reutilizables
2. **Escalabilidad**: Crecimiento horizontal
3. **Mantenibilidad**: Código limpio y documentado
4. **Seguridad**: Validaciones en cada capa
5. **Observabilidad**: Logs y métricas centralizadas

## Agentes Especializados

### Build Agent

Responsable de compilar y construir el código:

```javascript
const BuildAgent = require('./agents/build-agent');

const agent = new BuildAgent({
  optimize: true,
  outputDir: './dist'
});

const result = await agent.build({
  source: './src'
});
```

### Security Agent

Analiza vulnerabilidades y riesgos de seguridad:

```javascript
const SecurityAgent = require('./agents/security-agent');

const agent = new SecurityAgent({
  level: 'strict',
  failOnHigh: true
});

const result = await agent.scan({
  target: './src'
});
```

Para más detalles, consulta [Agentes README](../agents/README.md).

## Módulos del Sistema

### Core Module

Funcionalidad central del sistema:

```javascript
const { Logger, Config, Utils } = require('./modules/core');

const logger = new Logger('MyApp');
const config = new Config({ port: 3000 });
```

Para más detalles, consulta [Módulos README](../modules/README.md).

## CI/CD Pipeline

### Gates del Pipeline

1. **Lint Gate**: Validación de estilo de código
2. **Test Gate**: Ejecución de pruebas
3. **Security Gate**: Análisis de seguridad
4. **Build Gate**: Compilación
5. **Deploy Gate**: Despliegue

### Configuración

El pipeline se configura en `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
```

## API Reference

### Build Agent API

#### `build(params)`

Ejecuta el proceso de build.

**Parámetros:**

- `source` (string): Directorio fuente
- `output` (string): Directorio de salida

**Retorna:**

- `Promise<Object>`: Resultado del build

#### `clean()`

Limpia artefactos previos.

**Retorna:**

- `Promise<Object>`: Resultado de la limpieza

### Security Agent API

#### `scan(params)`

Ejecuta análisis de seguridad.

**Parámetros:**

- `target` (string): Directorio a escanear
- `level` (string): Nivel de escaneo

**Retorna:**

- `Promise<Object>`: Resultado del análisis

## Mejores Prácticas

### Desarrollo

1. **Commits Atómicos**: Un commit por cambio lógico
2. **Tests Primero**: TDD cuando sea posible
3. **Code Review**: Todos los PRs requieren revisión
4. **Documentación**: Actualizar docs con cambios

### Seguridad

1. **Nunca commitear secrets**: Usar variables de entorno
2. **Validar inputs**: Sanitizar todas las entradas
3. **Mantener dependencias actualizadas**: `npm audit` regular
4. **Seguir OWASP Top 10**

### Performance

1. **Lazy Loading**: Cargar módulos bajo demanda
2. **Caching**: Usar caché cuando sea apropiado
3. **Monitoreo**: Trackear métricas importantes
4. **Optimización**: Profile y optimizar cuellos de botella

## Troubleshooting

### Problemas Comunes

#### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Tests Fallando

```bash
# Limpiar caché y re-ejecutar
npm run clean
npm test
```

#### Build Fallando

```bash
# Verificar configuración
npm run config:check

# Ver logs detallados
npm run build -- --verbose
```

### Logs y Debugging

```bash
# Ver todos los logs
npm run logs

# Modo debug
DEBUG=* npm start

# Logs específicos de agentes
DEBUG=agent:* npm start
```

## Contribuir

Para contribuir al proyecto, consulta [CONTRIBUTING.md](./CONTRIBUTING.md).

## Soporte

- **Issues**: [GitHub Issues](https://github.com/Melampe001/rascacielos-digital/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Melampe001/rascacielos-digital/discussions)
- **Email**: support@rascacielos-digital.dev

## Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](../LICENSE) para más detalles.
