# 🔨 Build Automation - Rascacielos Digital

## Características

✅ **Build Idempotente** - Mismo input = mismo output  
✅ **Detección Automática** - Solo rebuild cuando hay cambios  
✅ **File Watcher** - Build automático al guardar  
✅ **Pre-commit Hooks** - Validación antes de commit  
✅ **CI/CD Integrado** - GitHub Actions automatizado  
✅ **Cache Inteligente** - Acelera builds  

## Uso Rápido

### Build Manual

```bash
# Build normal (skip si no hay cambios)
npm run build

# Build forzado
npm run build:force

# Via make
make build
make build-force
```

### Build Automático

```bash
# Iniciar watcher
npm run watch

# Con make
make watch
```

### Verificar Idempotencia

```bash
make idempotency-test
```

## File Watcher

El watcher monitorea cambios y ejecuta build automáticamente:

```bash
npm run watch
```

Monitorea:
- `agents/**/*.js`
- `modules/**/*.js`
- `config/**/*.json`
- `scripts/**/*.js`
- `index.js`
- `package.json`

## Pre-commit Hooks

Instalación automática con:

```bash
npm install
# o
make setup
```

Ejecuta automáticamente:
1. Build idempotente
2. Linting
3. Tests

## CI/CD

GitHub Actions ejecuta automáticamente en:
- Push a Main/develop
- Pull requests
- Daily (00:00 UTC)
- Workflow dispatch manual

### Workflow Features

- ✅ Build idempotente con cache inteligente
- ✅ Verificación de idempotencia automática
- ✅ Upload de artifacts
- ✅ Test del build output
- ✅ Notificaciones de resultados

## Comandos Make

```bash
make help           # Ver ayuda
make setup          # Setup completo
make build          # Build idempotente
make build-force    # Forzar rebuild
make watch          # Iniciar watcher
make clean          # Limpiar artifacts
make test           # Ejecutar tests
make lint           # Ejecutar linter
make lint-fix       # Linter con auto-fix
make ci             # Simular CI completo
make idempotency-test  # Verificar idempotencia
make stats          # Ver estadísticas
```

## Sistema de Checksums

El sistema utiliza **SHA256** para calcular checksums de:
- `package.json`
- `index.js`
- Todos los archivos `.js` en `agents/`, `modules/`, `config/`, `scripts/`

### Archivos Generados

- `dist/.build-checksum` - Checksum del último build
- `dist/build-manifest.json` - Metadata completa del build

### Build Manifest

Ejemplo de manifest generado:

```json
{
  "buildChecksum": "a1b2c3d4e5f6...",
  "version": "1.0.0",
  "nodeVersion": "v18.17.0",
  "platform": "linux",
  "environment": "production",
  "buildDate": "2024-01-01T00:00:00.000Z",
  "artifacts": {
    "files": 5,
    "directories": 4,
    "total": 9
  },
  "idempotent": true,
  "reproducible": true
}
```

## Flujo de Build

1. **Calcular checksum** del proyecto completo
2. **Comparar** con checksum anterior
3. **Skip build** si no hay cambios (a menos que se use `--force`)
4. **Limpiar** directorio `dist/`
5. **Ejecutar** Build Agent
6. **Copiar** archivos y directorios de forma determinística
7. **Generar** manifest y package.json optimizado
8. **Guardar** nuevo checksum

## Archivos Copiados al Build

### Archivos Principales
- `index.js`
- `package.json` (optimizado)
- `README.md`
- `LICENSE`
- `.env.example`

### Directorios
- `agents/` (sin tests)
- `modules/` (sin tests)
- `config/`
- `scripts/`
- `docs/`

### Excluidos
- `node_modules/`
- `.git/`
- `dist/`
- `coverage/`
- `__tests__/`
- `.github/`
- `*.test.js`
- `*.spec.js`

## Troubleshooting

### Build no detecta cambios

```bash
# Forzar rebuild
npm run build:force
# o
make build-force
```

### Watcher no funciona

```bash
# Verificar que chokidar esté instalado
npm list chokidar

# Reinstalar dependencias
npm install --save-dev chokidar
```

### Checksum inconsistente

```bash
# Limpiar y rebuild
make clean
make build-force
```

### Pre-commit hooks no funcionan

```bash
# Reinstalar husky
npm install --save-dev husky
npx husky install
```

## Desarrollo

### Estructura del Sistema

```
.
├── build-idempotent.js    # Sistema de build principal
├── watch-build.js          # File watcher
├── Makefile                # Comandos de automatización
├── .husky/
│   └── pre-commit         # Hook de pre-commit
├── .github/workflows/
│   └── build-idempotent.yml  # CI/CD workflow
└── dist/                   # Output del build
    ├── .build-checksum
    ├── build-manifest.json
    └── ...
```

### Personalización

#### Cambiar directorio de salida

```javascript
const builder = new IdempotentBuild({
  distDir: './build'
});
```

#### Ajustar debounce del watcher

```javascript
const watcher = new BuildWatcher({
  debounceTime: 2000  // 2 segundos
});
```

## Performance

### Benchmarks Típicos

- **Build inicial**: ~500-1000ms
- **Build skipped**: ~50-100ms
- **Rebuild incremental**: ~300-500ms

### Cache

El sistema usa cache en:
- GitHub Actions (checksums y manifests)
- File system local (`.build-cache/`)

## Integración Continua

### GitHub Actions Cache

El workflow utiliza `actions/cache@v3` para cachear:
- `dist/.build-checksum`
- `dist/build-manifest.json`

Key de cache: `build-{os}-{hash-de-archivos}`

### Verificación de Idempotencia

El CI ejecuta dos builds consecutivos y compara checksums para garantizar idempotencia.

## Seguridad

### Checksums SHA256

Todos los checksums usan SHA256 para:
- Detectar cambios con alta precisión
- Evitar colisiones
- Garantizar integridad

### Artifacts

Los artifacts suben a GitHub Actions por 7 días:
- Todos los archivos en `dist/`
- Excluye `node_modules/`

## Mejores Prácticas

1. **Commit frecuente** - Los pre-commit hooks validan cada commit
2. **Watch durante desarrollo** - Usa `npm run watch` para builds automáticos
3. **Force rebuild ocasional** - Ejecuta `make build-force` después de grandes cambios
4. **Revisar manifest** - Usa `make stats` para ver detalles del último build
5. **CI primero** - Siempre verifica que el build pase en CI antes de merge

## FAQ

**¿Qué significa "idempotente"?**  
Un build idempotente produce exactamente el mismo output dados los mismos inputs, sin importar cuántas veces se ejecute.

**¿Cuándo debo usar `--force`?**  
Usa `--force` cuando necesites rebuild aunque no haya cambios detectados, por ejemplo después de actualizar dependencias externas.

**¿El watcher consume muchos recursos?**  
No, el watcher usa eventos del sistema operativo (inotify en Linux) y es muy eficiente.

**¿Puedo usar esto en producción?**  
Sí, el sistema está diseñado para builds de producción con checksums verificables.

## Soporte

Para reportar issues o contribuir:
- GitHub Issues: https://github.com/Melampe001/rascacielos-digital/issues
- Pull Requests: Bienvenidos con tests incluidos

## Licencia

MIT License - Ver LICENSE file para detalles.
