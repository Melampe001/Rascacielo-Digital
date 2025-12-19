# Development Workflow

Esta guía describe el flujo de trabajo optimizado para contribuir a **Rascacielo Digital**.

## 📋 Tabla de Contenidos

- [Development Workflow](#development-workflow-1)
- [Git Branching Strategy](#git-branching-strategy)
- [Pull Request Process](#pull-request-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Release Process](#release-process)
- [Code Quality Standards](#code-quality-standards)

---

## 🔄 Development Workflow

### 1. Setup Local Environment

```bash
# Fork y clonar repositorio
git clone https://github.com/YOUR_USERNAME/Rascacielo-Digital.git
cd Rascacielo-Digital

# Agregar upstream remote
git remote add upstream https://github.com/Melampe001/Rascacielo-Digital.git

# Instalar dependencias
npm install

# Configurar pre-commit hooks
npm run prepare
```

### 2. Start Development

```bash
# Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crear feature branch
git checkout -b feature/my-new-feature

# Iniciar desarrollo
npm run dev
```

### 3. Code, Test, Commit

```bash
# Hacer cambios...

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint:fix

# Formatear código
npm run format

# Commit con mensaje convencional
git add .
git commit -m "feat: add new feature"
```

### 4. Push y Create PR

```bash
# Push a tu fork
git push origin feature/my-new-feature

# Crear Pull Request en GitHub
```

---

## 🌿 Git Branching Strategy

Usamos una estrategia de branching simplificada basada en **GitHub Flow** con extensiones.

### Branches Principales

#### `main`
- **Propósito**: Production-ready code
- **Protección**: Requiere PR y reviews
- **CI/CD**: Deploy automático a production
- **Naming**: `main`

#### `develop`
- **Propósito**: Integration branch para features
- **Protección**: Requiere PR
- **CI/CD**: Deploy automático a staging
- **Naming**: `develop`

### Branches de Trabajo

#### Feature Branches
```bash
# Formato: feature/descripcion-corta
git checkout -b feature/add-new-agent
git checkout -b feature/improve-performance
```

**Características:**
- Base: `develop` o `main`
- Merge to: `develop`
- Lifetime: Corto (días)
- Delete: Después de merge

#### Bugfix Branches
```bash
# Formato: bugfix/descripcion-del-bug
git checkout -b bugfix/fix-memory-leak
git checkout -b bugfix/correct-validation
```

**Características:**
- Base: `develop` o `main`
- Merge to: `develop`
- Priority: Media
- Delete: Después de merge

#### Hotfix Branches
```bash
# Formato: hotfix/descripcion-critica
git checkout -b hotfix/security-vulnerability
git checkout -b hotfix/production-crash
```

**Características:**
- Base: `main`
- Merge to: `main` AND `develop`
- Priority: Crítica
- Delete: Después de merge
- Deploy: Inmediato

#### Release Branches
```bash
# Formato: release/vX.Y.Z
git checkout -b release/v1.2.0
```

**Características:**
- Base: `develop`
- Merge to: `main` AND `develop`
- Purpose: Preparar release
- Tag: Después de merge a main

### Branch Protection Rules

#### `main` branch
- ✅ Require pull request reviews (2)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators
- ✅ Restrict force push
- ✅ Restrict deletions

#### `develop` branch
- ✅ Require pull request reviews (1)
- ✅ Require status checks to pass
- ✅ Restrict force push

---

## 🔀 Pull Request Process

### 1. Antes de Crear PR

```bash
# Verificar que todo funciona
npm run check

# Actualizar desde upstream
git fetch upstream
git rebase upstream/main

# Verificar conflictos
git status
```

### 2. Crear Pull Request

#### Título del PR
Usar formato de **Conventional Commits**:

```
feat: add orchestrator agent
fix: resolve memory leak in build agent
docs: update deployment guide
refactor: improve security scanner
test: add integration tests
chore: update dependencies
```

#### Descripción del PR

Usar template:

```markdown
## 📝 Descripción
Breve descripción de los cambios

## 🎯 Motivación
Por qué son necesarios estos cambios

## 🔧 Cambios Realizados
- [ ] Cambio 1
- [ ] Cambio 2
- [ ] Cambio 3

## 🧪 Testing
- [ ] Unit tests añadidos/actualizados
- [ ] Integration tests pasan
- [ ] Manual testing realizado

## 📸 Screenshots (si aplica)
[Agregar screenshots de UI changes]

## ✅ Checklist
- [ ] Tests pasan
- [ ] Linter pasa
- [ ] Documentación actualizada
- [ ] Changelog actualizado
- [ ] Breaking changes documentados
```

### 3. Code Review

#### Para el Autor
- Responder a todos los comentarios
- Hacer cambios solicitados
- Re-request review después de cambios
- Resolver conversaciones cuando corresponda

#### Para los Reviewers
- Revisar dentro de 24-48 horas
- Ser constructivo y específico
- Aprobar solo si está listo para producción
- Usar labels apropiados

### 4. Merge

```bash
# Después de approval, squash and merge
# GitHub lo hace automáticamente con botón "Squash and merge"
```

#### Merge Strategies

- **Feature → Develop**: Squash and merge
- **Develop → Main**: Merge commit (preserve history)
- **Hotfix → Main**: Squash and merge
- **Release → Main**: Merge commit + tag

---

## 🚀 CI/CD Pipeline

### Pipeline Gates

Cada PR pasa por 5 gates automáticos:

#### 1. Lint Gate
```yaml
- ESLint checks
- Code style validation
- Exit on errors
```

#### 2. Test Gate
```yaml
- Unit tests
- Integration tests
- Coverage report (min 80%)
```

#### 3. Security Gate
```yaml
- npm audit
- Trivy scan
- Dependency checks
```

#### 4. Build Gate
```yaml
- Production build
- Artifact generation
- Build validation
```

#### 5. Deploy Gate (main only)
```yaml
- Deploy to production
- Health checks
- Smoke tests
```

### Workflow Files

#### `.github/workflows/ci-cd.yml`
Main CI/CD pipeline con 5 gates

#### `.github/workflows/orchestrator-pipeline.yml`
Pipeline especializado para orchestrator
- Scheduled runs (daily)
- Manual triggers
- Report generation

### Status Checks

Todos los PRs deben pasar:
- ✅ Lint Gate
- ✅ Test Gate
- ✅ Security Gate
- ✅ Build Gate

### Pre-push Hooks

Husky ejecuta automáticamente antes de push:

```bash
#!/usr/bin/env sh
# .husky/pre-push

npm run lint
npm test
npm audit --audit-level=high
```

---

## 📦 Release Process

### Semantic Versioning

Seguimos [SemVer](https://semver.org/):

```
MAJOR.MINOR.PATCH

1.2.3
│ │ └─ Patch: Bug fixes
│ └─── Minor: New features (backward compatible)
└───── Major: Breaking changes
```

### Release Steps

#### 1. Preparar Release

```bash
# Crear release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Actualizar version en package.json
npm version minor  # o major/patch

# Actualizar CHANGELOG.md
# Agregar features, fixes, breaking changes

# Commit
git add .
git commit -m "chore: prepare release v1.2.0"
```

#### 2. Testing Final

```bash
# Ejecutar suite completo
npm run check
npm run orchestrate:full

# Manual testing
npm start
# Probar features críticas
```

#### 3. Merge to Main

```bash
# Push release branch
git push origin release/v1.2.0

# Crear PR: release/v1.2.0 → main
# Esperar reviews y CI
# Merge con "Merge commit"
```

#### 4. Tag y Deploy

```bash
# Checkout main
git checkout main
git pull origin main

# Crear tag
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0

# GitHub Actions desplegará automáticamente
```

#### 5. Merge Back to Develop

```bash
# Merge main → develop
git checkout develop
git pull origin develop
git merge main
git push origin develop

# Delete release branch
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Release Notes

Generar release notes en GitHub:
1. Go to Releases
2. Click "Draft a new release"
3. Select tag v1.2.0
4. Use CHANGELOG.md content
5. Publish release

---

## 📏 Code Quality Standards

### Coding Style

#### ESLint Rules
- No unused variables
- Consistent indentation (2 spaces)
- Semicolons required
- Single quotes for strings
- No console.log in production

#### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Testing Standards

#### Coverage Requirements
- **Minimum**: 80% overall
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

#### Test Structure
```javascript
describe('ComponentName', () => {
  describe('methodName', () => {
    test('should do something', () => {
      // Arrange
      const input = 'value';
      
      // Act
      const result = method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Documentation Standards

#### Code Comments
```javascript
/**
 * Function description
 * 
 * @param {string} param1 - Parameter description
 * @param {Object} options - Options object
 * @param {boolean} options.flag - Flag description
 * @returns {Promise<Object>} Result description
 * @throws {Error} When something goes wrong
 * 
 * @example
 * const result = await myFunction('value', { flag: true });
 */
async function myFunction(param1, options = {}) {
  // Implementation
}
```

#### README Updates
- Keep examples up to date
- Document breaking changes
- Update API references
- Add migration guides

### Security Standards

#### Secrets Management
- ❌ Never commit secrets
- ✅ Use environment variables
- ✅ Use .env.example for templates
- ✅ Document required secrets

#### Dependencies
- Regular updates (weekly)
- Security audits (daily)
- Zero critical vulnerabilities
- Pin major versions

---

## 🎯 Best Practices

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Testing
- `chore`: Maintenance

**Examples:**
```bash
feat(orchestrator): add parallel execution mode
fix(security): resolve vulnerability in dependencies
docs(readme): update installation instructions
test(agents): add integration tests
chore(deps): update dependencies
```

### Code Review Guidelines

#### What to Look For
- ✅ Correctness
- ✅ Performance
- ✅ Security
- ✅ Maintainability
- ✅ Test coverage
- ✅ Documentation

#### Review Comments
```
# Blocking (must fix)
🚫 This introduces a security vulnerability

# Suggestion (nice to have)
💡 Consider extracting this to a helper function

# Question (needs clarification)
❓ Why is this approach chosen over X?

# Praise (good work!)
✨ Great error handling here!
```

---

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an Issue
- **Features**: Propose in Discussions first
- **Security**: Email directly (see SECURITY.md)

---

**Rascacielo Digital v1.1.0** | Development Workflow Guide
