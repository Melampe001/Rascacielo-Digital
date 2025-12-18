# Scripts de Mantenimiento - Rascacielo Digital

Este directorio contiene scripts utilitarios para el mantenimiento y operación del sistema.

## 📋 Índice de Scripts

### Scripts de Mantenimiento

#### `audit-dependencies.sh`

Audita dependencias del proyecto en busca de vulnerabilidades y paquetes obsoletos.

**Uso:**

```bash
bash scripts/audit-dependencies.sh
# O con npm:
npm run audit
```

**Qué hace:**

- Ejecuta `npm audit` para detectar vulnerabilidades de seguridad
- Lista dependencias obsoletas con `npm outdated`
- Analiza dependencias no utilizadas con `depcheck`

#### `lint-and-format.sh`

Aplica formato y linting automático al código.

**Uso:**

```bash
bash scripts/lint-and-format.sh
```

**Qué hace:**

- Ejecuta ESLint con correcciones automáticas (`--fix`)
- Aplica formato Prettier a archivos JS, JSON y MD
- Asegura consistencia en el estilo de código

#### `cleanup.sh`

Limpieza completa del proyecto: dependencias, código, tests.

**Uso:**

```bash
bash scripts/cleanup.sh
```

**Qué hace:**

- Limpia artefactos de build previos
- Elimina y reinstala `node_modules`
- Ejecuta auditoría de seguridad con correcciones automáticas
- Actualiza dependencias (minor/patch)
- Aplica formato y linting
- Ejecuta suite completa de tests

**⚠️ Advertencia:** Este script puede tomar varios minutos. Asegúrate de tener commits guardados antes de ejecutarlo.

### Scripts Operacionales

#### `config-check.js`

Verifica la configuración del sistema y validaciones de ambiente.

**Uso:**

```bash
node scripts/config-check.js
# O con npm:
npm run config:check
```

#### `health-check.js`

Realiza verificaciones de salud del sistema.

**Uso:**

```bash
node scripts/health-check.js
# O con npm:
npm run health-check
```

#### `pre-merge-check.js`

Validaciones antes de hacer merge en ramas principales.

**Uso:**

```bash
node scripts/pre-merge-check.js
```

#### `treesit-cli.js`

CLI para operaciones de despliegue y gestión de TreeSit Cloud.

**Uso:**

```bash
# Desplegar
npm run deploy

# Ver estado
npm run deploy:status

# Ver logs
npm run deploy:logs

# Rollback
npm run deploy:rollback

# Health check
npm run deploy:health
```

**Comandos disponibles:**

- `deploy` - Despliega la aplicación
- `status` - Verifica estado del despliegue
- `logs` - Muestra logs de la aplicación
- `rollback` - Revierte al despliegue anterior
- `health` - Verifica salud del sistema

## 🔧 Configuración

### Permisos de Ejecución

Para hacer los scripts ejecutables:

```bash
chmod +x scripts/*.sh
```

### Variables de Entorno

Algunos scripts pueden requerir variables de entorno. Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

## 📝 Mejores Prácticas

### Antes de Hacer Commit

```bash
npm run validate
# Ejecuta: lint + format:check + test
```

### Mantenimiento Regular

```bash
# Auditoría semanal
npm run audit

# Limpieza mensual
bash scripts/cleanup.sh
```

### Pre-despliegue

```bash
npm run validate
npm run build
node scripts/pre-merge-check.js
```

## 🚨 Solución de Problemas

### Script no ejecuta

```bash
# Verificar permisos
ls -la scripts/

# Otorgar permisos
chmod +x scripts/nombre-script.sh
```

### Errores de dependencias

```bash
# Reinstalar completamente
rm -rf node_modules package-lock.json
npm install
```

### Tests fallando

```bash
# Limpiar caché de Jest
npm test -- --clearCache
npm test
```

## 🔗 Referencias

- [Documentación Principal](../docs/README.md)
- [Guía de Contribución](../CONTRIBUTING.md)
- [package.json scripts](../package.json)

## 📧 Soporte

Para preguntas o problemas con los scripts:

- Abre un issue en GitHub
- Consulta la documentación en `/docs`
