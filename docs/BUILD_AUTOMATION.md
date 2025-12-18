# Build Automation - Idempotent Build System

## Overview

The idempotent build system uses SHA256 checksums to detect changes and skip unnecessary rebuilds.

## Performance

- **Initial build**: ~15ms
- **Skip detection**: ~50ms
- **Idempotency**: Verified (consecutive builds produce identical checksums)

## Usage

### Command Line

```bash
# Smart build (skips if unchanged)
npm run build

# Force rebuild
npm run build:force

# Watch mode
npm run build:watch

# Test idempotency
make idempotency-test

# Clean build
make clean
```

### Programmatic

```javascript
const IdempotentBuild = require('./build-idempotent');

const builder = new IdempotentBuild({ verbose: true });
await builder.build();
```

## How It Works

1. **Checksum Calculation**: Computes SHA256 hash of all source files
2. **Change Detection**: Compares with previous build checksum
3. **Smart Skip**: Skips build if checksums match
4. **Deterministic Copy**: Preserves file timestamps for consistency
5. **Manifest Generation**: Creates build metadata

## Configuration

Update `package.json`:

```json
{
  "scripts": {
    "build": "node build-idempotent.js",
    "build:force": "node build-idempotent.js --force",
    "build:watch": "node watch-build.js"
  }
}
```

## CI/CD Integration

The build system integrates with GitHub Actions:
- Caches checksums between runs
- Verifies idempotency
- Uploads artifacts

## Features

- ✅ SHA256 checksum-based change detection
- ✅ Automatic skip when no changes
- ✅ Deterministic file copying
- ✅ Build manifest with metadata
- ✅ Force rebuild option
- ✅ File watcher with debounce
- ✅ CI/CD integration
- ✅ Makefile support
