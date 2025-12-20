# 📦 Installation Guide - Imperial Supreme Elite Agents

This guide will help you install and configure the Imperial Supreme Elite Agents ecosystem.

---

## 📋 Prerequisites

Before installing, ensure you have:

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: Latest version
- **Operating System**: Linux, macOS, or Windows

### Check Prerequisites

```bash
# Check Node.js version
node --version
# Should output v18.x.x or higher

# Check npm version
npm --version
# Should output 9.x.x or higher

# Check Git version
git --version
```

---

## 🚀 Quick Start Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Melampe001/Rascacielo-Digital.git
cd Rascacielo-Digital
```

### 2. Install Dependencies

```bash
npm install
```

This will:

- Install all npm packages
- Set up Git hooks (Husky)
- Configure pre-commit validation

### 3. Run Imperial Installation

Choose one of the installation modes:

#### Full Installation (Recommended)

Installs all 192 agents and complete ecosystem:

```bash
npm run imperial:install
```

#### Minimal Installation (Fast)

Installs only 40 core agents:

```bash
npm run imperial:install:minimal
```

#### Custom Installation (Advanced)

Select specific agents interactively:

```bash
npm run imperial:install:custom
```

### 4. Verify Installation

```bash
npm run imperial:verify
```

Expected output:

```
✅ ¡Instalación verificada correctamente!
🤖 Agentes operacionales: 192
🏛️  Supreme Agents: 5/5
📊 Integridad: 100%
```

---

## 🔧 Configuration

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# GitHub Token (for dependency scanning)
GITHUB_TOKEN=your_github_token_here

# NPM Token (for publishing)
NPM_TOKEN=your_npm_token_here

# Vercel Token (for deployment)
VERCEL_TOKEN=your_vercel_token_here

# Environment
NODE_ENV=development
```

### Optional: Configure AI (Ollama)

For AI-powered features, install Ollama:

```bash
# Install Ollama (https://ollama.ai)
curl https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2
```

---

## 📊 Post-Installation Steps

### 1. Run Tests

```bash
npm test
```

All tests should pass (166/166 ✅)

### 2. Validate Code Quality

```bash
npm run elite:validate
```

### 3. Scan Dependencies

```bash
npm run guardian:scan
```

### 4. Generate Documentation

```bash
npm run imperial:docs
```

---

## 🎯 Available Commands

### Installation & Verification

```bash
npm run imperial:install          # Full installation
npm run imperial:install:minimal  # Minimal installation
npm run imperial:verify           # Verify installation
```

### Orchestration

```bash
npm run supreme:orchestrate       # Run orchestrator
npm run supreme:analyze           # System analysis
npm run supreme:dashboard         # Live dashboard
```

### Dependency Management

```bash
npm run guardian:scan             # Scan vulnerabilities
npm run guardian:update           # Auto-update dependencies
npm run guardian:analyze          # Analyze unused deps
npm run guardian:licenses         # Check licenses
```

### Code Quality

```bash
npm run elite:validate            # Validate code
npm run elite:fix                 # Auto-fix issues
npm run elite:fix:aggressive      # Aggressive fixes
npm run elite:complexity          # Analyze complexity
npm run elite:badge               # Generate badge
```

### Documentation

```bash
npm run imperial:docs             # Generate docs
npm run imperial:docs:html        # Export to HTML
npm run imperial:docs:pdf         # Export to PDF
npm run imperial:changelog        # Update changelog
```

### Development

```bash
npm start                         # Start application
npm run dev                       # Development mode
npm test                          # Run tests
npm run lint                      # Lint code
npm run format                    # Format code
```

---

## ⚙️ Advanced Configuration

### Custom Agent Selection

Create a configuration file `imperial.config.json`:

```json
{
  "agents": [
    "imperial-installer-agent",
    "supreme-orchestrator-agent",
    "imperial-dependency-guardian-agent",
    "elite-code-quality-agent",
    "imperial-documentation-generator-agent"
  ],
  "features": {
    "ai": true,
    "autoUpdate": true,
    "scheduledScans": true
  }
}
```

### GitHub Actions Setup

The Dependency Guardian runs automatically via GitHub Actions.

To enable:

1. Go to repository Settings → Secrets
2. Add required tokens:
   - `GITHUB_TOKEN` (automatically provided)
   - `NPM_TOKEN` (if needed for updates)

---

## 🔍 Verification Checklist

After installation, verify:

- [ ] Node.js version >= 18.0.0
- [ ] All dependencies installed (`node_modules/` exists)
- [ ] Supreme agents created (5 files in `agents/supreme/`)
- [ ] Tests passing (166/166)
- [ ] No linting errors
- [ ] CLI scripts executable
- [ ] GitHub Actions workflow exists

---

## 🆘 Troubleshooting

### Common Issues

#### "Node.js version too old"

**Solution**: Upgrade Node.js to version 18 or higher

```bash
# Using nvm
nvm install 18
nvm use 18
```

#### "npm install fails"

**Solution**: Clear cache and reinstall

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### "Tests failing"

**Solution**: Ensure all dependencies are installed

```bash
npm ci
npm test
```

#### "Permission denied" on scripts

**Solution**: Make scripts executable

```bash
chmod +x scripts/*.js
```

For more troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 📚 Next Steps

1. ✅ Read the [Supreme Agents README](../agents/supreme/README.md)
2. ✅ Explore the [API Documentation](./API_REFERENCE.md)
3. ✅ Try the [Quick Start Examples](./EXAMPLES.md)
4. ✅ Join the [Discussions](https://github.com/Melampe001/Rascacielo-Digital/discussions)

---

## 🎉 Success!

If you've reached this point, congratulations! The Imperial Supreme Elite Agents are now installed and ready to use.

Run your first command:

```bash
npm run supreme:orchestrate
```

Happy coding! 🚀
