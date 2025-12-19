# Scripts Documentation

This directory contains utility scripts for maintaining and operating the Rascacielo Digital project.

## Available Scripts

### cleanup.sh

Performs a comprehensive cleanup of the project directory.

**What it does:**
- Removes `node_modules` directory
- Removes build artifacts (`dist/`, `build/`)
- Removes coverage reports (`coverage/`, `.nyc_output/`)
- Removes log files (`*.log`)
- Removes cache files (`.eslintcache`)
- Removes temporary directories (`tmp/`, `temp/`)
- Removes OS-specific files (`.DS_Store`)
- Removes editor temporary files (`*.swp`, `*.swo`, `*~`)

**Usage:**
```bash
npm run cleanup
# or
bash scripts/cleanup.sh
```

**When to use:**
- Before committing to ensure no temporary files are included
- When switching between branches
- When encountering build issues that might be cache-related
- To free up disk space

---

### audit-dependencies.sh

Performs security audits and checks for outdated packages.

**What it does:**
- Runs `npm audit` to check for vulnerabilities
- Lists outdated packages
- Provides summary of dependencies
- Suggests fixes for vulnerabilities

**Usage:**
```bash
npm run audit
# or
bash scripts/audit-dependencies.sh
```

**Exit codes:**
- `0`: No vulnerabilities found
- `1+`: Vulnerabilities detected (see output)

**When to use:**
- Before releasing a new version
- Regularly (weekly/monthly) as part of maintenance
- After adding new dependencies
- When security advisories are announced

---

### lint-and-format.sh

Runs ESLint and Prettier to ensure code quality and consistent formatting.

**What it does:**
- Runs `npm run lint:fix` to check and auto-fix linting issues
- Runs `npm run format` to format all code files
- Reports any issues that couldn't be auto-fixed

**Usage:**
```bash
npm run lint-and-format
# or
bash scripts/lint-and-format.sh
```

**Exit codes:**
- `0`: All checks passed
- `1`: Some checks failed

**When to use:**
- Before committing changes
- Before creating a pull request
- After resolving merge conflicts
- When code style seems inconsistent

---

## Other Scripts

### config-check.js

Validates configuration files and environment variables.

**Usage:**
```bash
npm run config:check
```

---

### health-check.js

Performs system health checks.

**Usage:**
```bash
npm run health-check
```

---

### treesit-cli.js

Command-line interface for Treesit Cloud operations.

**Usage:**
```bash
npm run deploy
npm run deploy:status
npm run deploy:rollback
npm run deploy:logs
npm run deploy:health
```

---

## NPM Script Aliases

For convenience, all scripts are available as npm scripts:

```json
{
  "cleanup": "bash scripts/cleanup.sh",
  "audit": "bash scripts/audit-dependencies.sh",
  "lint-and-format": "bash scripts/lint-and-format.sh",
  "check": "npm run lint && npm run format:check && npm test"
}
```

---

## Best Practices

1. **Run cleanup periodically** to keep your workspace clean
2. **Run audit before releases** to ensure no vulnerabilities
3. **Run lint-and-format before commits** to maintain code quality
4. **Use pre-commit hooks** (Husky) to automate checks
5. **Review script output** - don't just ignore warnings

---

## Troubleshooting

### Permission Denied

If you encounter "Permission denied" errors:

```bash
chmod +x scripts/*.sh
```

### Script Not Found

Ensure you're running scripts from the project root:

```bash
cd /path/to/rascacielo-digital
npm run cleanup
```

### Dependencies Missing

If scripts fail because of missing dependencies:

```bash
npm install
```

---

## Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Add proper documentation in this README
3. Include usage examples
4. Add appropriate error handling
5. Make scripts executable: `chmod +x scripts/your-script.sh`
6. Add npm script alias in `package.json`
