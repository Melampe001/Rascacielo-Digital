# 🔧 Troubleshooting Guide - Imperial Supreme Elite Agents

This guide helps you solve common issues when working with the Imperial Supreme Elite Agents.

---

## 🚨 Common Issues

### Installation Issues

#### Issue: "Node.js version too old"

**Error Message:**

```
Error: Node.js >= 18.0.0 requerido. Versión actual: 16.x.x
```

**Solution:**

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18
nvm alias default 18

# Or download from https://nodejs.org/
```

**Verify:**

```bash
node --version
# Should output v18.x.x or higher
```

---

#### Issue: "npm install fails with EACCES"

**Error Message:**

```
Error: EACCES: permission denied
```

**Solution:**

```bash
# Option 1: Use sudo (not recommended)
sudo npm install

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then retry
npm install
```

---

#### Issue: "Package installation hangs"

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Test Issues

#### Issue: "Tests failing - Cannot find module"

**Error Message:**

```
Cannot find module './agents/supreme/...'
```

**Solution:**

```bash
# Ensure all files are present
npm run imperial:verify

# Reinstall dependencies
npm ci

# Run tests again
npm test
```

---

#### Issue: "Jest timeout errors"

**Error Message:**

```
Timeout - Async callback was not invoked within the 5000ms timeout
```

**Solution:**
Add timeout to jest.config.js:

```javascript
module.exports = {
  testTimeout: 30000 // 30 seconds
  // ... other config
};
```

---

### Linting Issues

#### Issue: "ESLint errors in new code"

**Solution:**

```bash
# Auto-fix what can be fixed
npm run lint:fix

# Check remaining issues
npm run lint
```

---

#### Issue: "Prettier formatting conflicts"

**Solution:**

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

---

### Agent-Specific Issues

#### Issue: Imperial Installer - "Installation verification failed"

**Symptoms:**

- `imperial:verify` reports missing files
- Agents not operational

**Solution:**

```bash
# Check what's missing
npm run imperial:verify

# Reinstall
npm run imperial:install

# Or install minimal version
npm run imperial:install:minimal
```

---

#### Issue: Supreme Orchestrator - "Cannot load agents"

**Error Message:**

```
Error: Cannot load agent module
```

**Solution:**

```bash
# Verify agent files exist
ls -la agents/supreme/

# Expected output: 5 agent files
# If missing, reinstall
npm run imperial:install
```

---

#### Issue: Dependency Guardian - "npm audit fails"

**Error Message:**

```
npm audit failed
```

**Solution:**

```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force

# Run audit
npm audit

# Fix automatically (if safe)
npm audit fix
```

---

#### Issue: Code Quality Agent - "ESLint not found"

**Error Message:**

```
sh: eslint: command not found
```

**Solution:**

```bash
# Ensure devDependencies are installed
npm install

# If still not working, install globally
npm install -g eslint
```

---

#### Issue: Documentation Generator - "Cannot generate docs"

**Symptoms:**

- Empty documentation
- Missing sections

**Solution:**

```bash
# Ensure source files exist
ls -la agents/

# Generate docs
npm run imperial:docs

# Check output
cat docs/generated/*.md
```

---

### GitHub Actions Issues

#### Issue: Dependency Guardian workflow fails

**Error in GitHub Actions:**

```
Error: npm ci failed
```

**Solution:**

1. Check workflow file: `.github/workflows/dependency-guardian.yml`
2. Verify secrets are set in repository settings
3. Check Node.js version in workflow (should be 18)

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18' # Ensure this is 18
```

---

### Performance Issues

#### Issue: "Installation takes too long"

**Symptoms:**

- Installation > 5 minutes
- System hanging

**Solution:**

```bash
# Use minimal installation
npm run imperial:install:minimal

# Or increase timeout in agent config
# Edit agents/supreme/imperial-installer-agent.js
# Increase timeout: 300000 -> 600000
```

---

#### Issue: "High memory usage"

**Symptoms:**

- System slow
- Out of memory errors

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Run with increased memory
npm run imperial:install
```

---

### CLI Issues

#### Issue: "Command not found"

**Error Message:**

```
bash: npm: command not found
```

**Solution:**

```bash
# Ensure npm is in PATH
echo $PATH

# Add npm to PATH if missing
export PATH=$PATH:/usr/local/bin

# Or reinstall Node.js
```

---

#### Issue: "Script permission denied"

**Error Message:**

```
Permission denied: scripts/imperial-install.js
```

**Solution:**

```bash
# Make scripts executable
chmod +x scripts/*.js

# Or run with node explicitly
node scripts/imperial-install.js --help
```

---

## 🔍 Diagnostic Commands

Use these commands to diagnose issues:

```bash
# System info
node --version
npm --version
git --version

# Package info
npm list --depth=0

# Check installation
npm run imperial:verify

# Run tests
npm test

# Check linting
npm run lint

# Validate code
npm run validate
```

---

## 📊 Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
export DEBUG=imperial:*

# Run with verbose logging
npm run imperial:install --loglevel verbose
```

---

## 🆘 Getting Help

If you're still experiencing issues:

1. **Search Issues**: [GitHub Issues](https://github.com/Melampe001/Rascacielo-Digital/issues)
2. **Ask in Discussions**: [GitHub Discussions](https://github.com/Melampe001/Rascacielo-Digital/discussions)
3. **Create New Issue**: Include:
   - Node.js version
   - npm version
   - Operating system
   - Error message (full)
   - Steps to reproduce

---

## 📝 Reporting Bugs

When reporting bugs, include:

```bash
# Generate system report
npm run imperial:verify > system-report.txt

# Include in bug report:
# 1. system-report.txt
# 2. Error message
# 3. Steps to reproduce
# 4. Expected vs actual behavior
```

---

## ✅ Quick Fixes Checklist

- [ ] Node.js >= 18.0.0?
- [ ] Dependencies installed?
- [ ] Tests passing?
- [ ] No linting errors?
- [ ] Scripts executable?
- [ ] Environment variables set?
- [ ] Cache cleared?
- [ ] Latest npm version?

---

## 🎯 Prevention Tips

1. **Always use npm ci** instead of npm install in CI/CD
2. **Keep Node.js updated** to latest LTS version
3. **Run tests before committing** (pre-commit hook does this)
4. **Clear cache regularly**: `npm cache clean --force`
5. **Use nvm** for Node.js version management

---

## 📚 Additional Resources

- [Installation Guide](./INSTALLATION_GUIDE.md)
- [Supreme Agents README](../agents/supreme/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)

---

**Still stuck? Open an issue and we'll help! 🚀**
