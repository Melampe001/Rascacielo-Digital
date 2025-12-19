# 🏛️ Rascacielo Masters - Sistema Imperial Premium Elite

**71 Master Agents + Complete Automation System + CLI Tool**

[![NPM Version](https://img.shields.io/npm/v/@melampe001/rascacielo-masters?style=for-the-badge)](https://www.npmjs.com/package/@melampe001/rascacielo-masters)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen?style=for-the-badge)](https://nodejs.org)

> The most comprehensive code validation and quality system with 71 specialized master agents covering every major technology stack.

## ✨ Features

- **71 Master Agents** - Specialized experts for every technology
- **Automatic Technology Detection** - Scans and identifies project technologies
- **Multi-Format Badge Generation** - Markdown, HTML, SVG, JSON
- **Comprehensive Reports** - Text, JSON, Markdown, HTML formats
- **CLI Tool** - Global command-line interface
- **Complete Automation** - One-command project validation
- **Web Search Master** - SEO analysis and competitive intelligence

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @melampe001/rascacielo-masters
```

### Local Installation

```bash
npm install @melampe001/rascacielo-masters
```

## 🚀 Quick Start

### CLI Usage

```bash
# Validate your project
rascacielo validate

# Scan technologies
rascacielo scan

# Generate badge
rascacielo badge --score 95

# List all agents
rascacielo list

# Get help
rascacielo --help
```

### Programmatic Usage

```javascript
const { AutoValidator, Orchestrator, BadgeGenerator } = require('@melampe001/rascacielo-masters');

// Automatic validation
const validator = new AutoValidator({ verbose: true });
const result = await validator.validate('./my-project');

console.log(`Grade: ${result.summary.grade}`);
console.log(`Score: ${result.summary.score}%`);
console.log(`Badge: ${result.badge.markdown}`);
```

## 🎯 71 Master Agents

### Languages (7)
- Python, JavaScript, TypeScript, Java, Go, Rust, PHP

### Frontend (3)
- React, Vue, Angular

### Mobile (4)
- Flutter, React Native, iOS, Android

### DevOps (12)
- Docker, Kubernetes, Linux, CI/CD, Terraform, Jenkins, GitLab CI, Ansible, Nginx, Prometheus, Grafana, Elasticsearch

### Cloud (7)
- Vercel, AWS, Azure, GCP, Netlify, Heroku, DigitalOcean

### Database (3)
- SQL, NoSQL, GraphQL

### Testing (7)
- Testing, Selenium, Playwright, Postman, JMeter, Cucumber, Cypress

### Security (5)
- Security, Auth0, Keycloak, Vault, SonarQube

### Backend (5)
- Express, NestJS, FastAPI, Django, Spring Boot

### Data/ML (4)
- Pandas, NumPy, TensorFlow, PyTorch

### Build Tools (4)
- NPM, Yarn, Webpack, Vite

### Version Control (3)
- Git, GitHub Actions, Bitbucket

### Design (3)
- Figma, CSS, SVG

### Formats (4)
- JSON, Markdown, YAML, XML

### Web Search (1)
- Web Search Master (SEO, Scraping, Documentation Search)

## 📊 Grading System

| Grade | Score | Description |
|-------|-------|-------------|
| 💎 PLATINUM | 95-100% | Exceptional code quality |
| 🥇 GOLD | 90-94% | Excellent code quality |
| 🥈 SILVER | 80-89% | Good code quality |
| 🥉 BRONZE | 70-79% | Acceptable code quality |
| ⏳ PENDING | <70% | Needs improvement |

## 🛠️ CLI Commands

### `validate`
Validate project with automatic technology detection and agent selection.

```bash
rascacielo validate [options]

Options:
  -p, --path <path>        Project path (default: ".")
  -o, --output <format>    Output format: text|json|markdown (default: "text")
  -v, --verbose            Verbose output
  --min-score <number>     Minimum required score (default: "70")
  --save                   Save validation results to disk
```

### `scan`
Scan project and detect technologies.

```bash
rascacielo scan [options]

Options:
  -p, --path <path>      Project path (default: ".")
  -o, --output <format>  Output format: json|text (default: "text")
  -v, --verbose          Verbose output
  --depth <number>       Scan depth (default: "2")
```

### `badge`
Generate quality badge in multiple formats.

```bash
rascacielo badge [options]

Options:
  -s, --score <number>   Score (0-100)
  -f, --format <format>  Format: markdown|html|svg|json|shields|all (default: "markdown")
  --style <style>        Badge style: flat|flat-square|for-the-badge (default: "for-the-badge")
  -o, --output <file>    Output file (optional)
```

### `list`
List all available master agents.

```bash
rascacielo list [options]

Options:
  -c, --category <category>  Filter by category
  -v, --verbose              Show detailed information
```

## 💻 API Reference

### AutoValidator

```javascript
const { AutoValidator } = require('@melampe001/rascacielo-masters');

const validator = new AutoValidator({
  verbose: false,
  generateBadge: true,
  generateReport: true,
  reportFormat: 'text',
  minScore: 70
});

// Full validation
const result = await validator.validate('./project');

// Quick validation
const quick = await validator.quickValidate('./project');

// Save validation
await validator.saveValidation('./project', './results');
```

### Orchestrator

```javascript
const { Orchestrator } = require('@melampe001/rascacielo-masters');

const orchestrator = new Orchestrator({ verbose: true });

// Load all agents
await orchestrator.loadAllAgents();

// Load specific category
await orchestrator.loadCategory('languages');

// Get agent
const pythonMaster = orchestrator.getAgent('python');

// Run validation
const results = await orchestrator.validate('./project');

// Get stats
const stats = orchestrator.getStats();
```

### BadgeGenerator

```javascript
const { BadgeGenerator } = require('@melampe001/rascacielo-masters');

const generator = new BadgeGenerator();

// Generate badge
const badge = generator.generate(95, 'markdown');

// Generate all formats
const allBadges = generator.generate(95, 'all');

// Save badge to file
await generator.generateFile(95, 'svg', './badge.svg');
```

### TechnologyScanner

```javascript
const { TechnologyScanner } = require('@melampe001/rascacielo-masters');

const scanner = new TechnologyScanner({ depth: 2 });

// Scan project
const technologies = await scanner.scan('./project');

// Get summary
const summary = scanner.getSummary(technologies);
```

## 🎨 Badge Examples

### Markdown
```markdown
![Rascacielo PLATINUM 💎](https://img.shields.io/badge/Rascacielo-PLATINUM_95%25-9333ea?style=for-the-badge)
```

### HTML
```html
<img src="https://img.shields.io/badge/Rascacielo-GOLD_92%25-fbbf24?style=for-the-badge" alt="Rascacielo GOLD 🥇" />
```

## 📖 Use Cases

### CI/CD Integration

```yaml
# .github/workflows/validate.yml
name: Code Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @melampe001/rascacielo-masters
      - run: rascacielo validate --save
      - run: rascacielo badge --score $SCORE >> README.md
```

### Custom Agent Usage

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

// Use specific master
const pythonMaster = new masters.PythonMaster({ verbose: true });
const result = await pythonMaster.validate('./my-python-project');

// Get best practices
const bestPractices = pythonMaster.getBestPractices();
```

### Web Search & SEO

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

const webSearch = new masters.WebSearchMaster();

// Search documentation
const docs = await webSearch.searchDocs('react', 'hooks');

// SEO analysis
const seo = await webSearch.analyzeSEO('https://example.com');

// Competitor analysis
const competitor = await webSearch.analyzeCompetitor('https://competitor.com');
```

## 🔧 Configuration

Create a `.rascacielorc.json` file in your project root:

```json
{
  "minScore": 80,
  "verbose": false,
  "generateBadge": true,
  "reportFormat": "markdown",
  "enabledCategories": ["languages", "frontend", "devops"],
  "excludePaths": ["node_modules", "dist", "build"]
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Rascacielo Digital team
- Inspired by the need for comprehensive code quality validation
- Special thanks to all contributors

## 🔗 Links

- [GitHub Repository](https://github.com/Melampe001/Rascacielo-Digital)
- [NPM Package](https://www.npmjs.com/package/@melampe001/rascacielo-masters)
- [Documentation](https://github.com/Melampe001/Rascacielo-Digital/blob/Main/agents/masters/README.md)
- [Issue Tracker](https://github.com/Melampe001/Rascacielo-Digital/issues)

---

<p align="center">
  Made with 🏛️ by <a href="https://github.com/Melampe001">Melampe001</a>
</p>
