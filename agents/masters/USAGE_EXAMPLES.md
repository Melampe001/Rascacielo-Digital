# 🏛️ Rascacielo Masters - Usage Examples

Complete usage examples for all 72 master agents and system features.

## Quick Start

### Installation

```bash
# Global installation
npm install -g @melampe001/rascacielo-masters

# Local installation
npm install @melampe001/rascacielo-masters
```

### Basic CLI Usage

```bash
# Validate your project
rascacielo validate

# Scan for technologies
rascacielo scan

# Generate a badge
rascacielo badge --score 95

# List all agents
rascacielo list
```

## Complete Examples

### 1. Technology Scanner

Automatically detect technologies in your project:

```javascript
const { TechnologyScanner } = require('@melampe001/rascacielo-masters');

const scanner = new TechnologyScanner({ verbose: true });
const technologies = await scanner.scan('./my-project');
const summary = scanner.getSummary(technologies);

console.log(`Found ${summary.total} technologies`);
console.log(`Categories: ${summary.categories}`);
```

### 2. Badge Generator

Generate quality badges in multiple formats:

```javascript
const { BadgeGenerator } = require('@melampe001/rascacielo-masters');

const generator = new BadgeGenerator();

// Markdown badge
const markdown = generator.generate(95, 'markdown');

// All formats at once
const allBadges = generator.generate(95, 'all');

// Save to file
await generator.generateFile(95, 'svg', './badge.svg');
```

### 3. Complete Auto Validation

Full project validation with reports:

```javascript
const { AutoValidator } = require('@melampe001/rascacielo-masters');

const validator = new AutoValidator({
  verbose: true,
  minScore: 80,
  reportFormat: 'markdown'
});

const result = await validator.validate('./my-project');

console.log(`Grade: ${result.summary.grade}`);
console.log(`Score: ${result.summary.score}%`);
console.log(`Badge: ${result.badge.markdown}`);

// Save complete results
await validator.saveValidation('./my-project', './results');
```

### 4. Using Specific Master Agents

Use individual master agents directly:

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

// Python Master
const pythonMaster = new masters.PythonMaster({ verbose: true });
const pythonResult = await pythonMaster.validate('./python-project');

// React Master
const reactMaster = new masters.ReactMaster({ verbose: true });
const reactResult = await reactMaster.validate('./react-app');

// Docker Master
const dockerMaster = new masters.DockerMaster({ verbose: true });
const dockerResult = await dockerMaster.validate('./dockerized-app');
```

### 5. Orchestrator - Manage Multiple Agents

Load and manage all agents:

```javascript
const { Orchestrator } = require('@melampe001/rascacielo-masters');

const orchestrator = new Orchestrator({ verbose: true });

// Load all agents
await orchestrator.loadAllAgents();

// Get statistics
const stats = orchestrator.getStats();
console.log(`Total agents: ${stats.total}`);

// Get specific agent
const pythonAgent = orchestrator.getAgent('python');

// Get all agents in a category
const devopsAgents = orchestrator.getAgentsByCategory('devops');

// Validate with multiple agents
const results = await orchestrator.validate('./project', [
  'python', 'docker', 'kubernetes'
]);
```

### 6. Custom Validation Workflow

Create a custom validation workflow:

```javascript
const { 
  TechnologyScanner,
  Orchestrator,
  Validator,
  Reporter,
  BadgeGenerator
} = require('@melampe001/rascacielo-masters');

async function customValidation(projectPath) {
  // 1. Scan technologies
  const scanner = new TechnologyScanner();
  const tech = await scanner.scan(projectPath);
  
  // 2. Load appropriate agents
  const orchestrator = new Orchestrator();
  await orchestrator.loadAllAgents();
  
  // 3. Run validation
  const results = await orchestrator.validate(projectPath);
  
  // 4. Validate results
  const validator = new Validator({ minScore: 85 });
  const summary = validator.validate(results.results);
  
  // 5. Generate badge
  const badgeGen = new BadgeGenerator();
  const badge = badgeGen.generate(summary.score, 'markdown');
  
  // 6. Create report
  const reporter = new Reporter({ format: 'html' });
  const report = reporter.generate(summary, 'html');
  await reporter.save(summary, 'validation-report.html', 'html');
  
  return {
    technologies: tech,
    summary,
    badge,
    report
  };
}
```

### 7. CI/CD Integration

Use in GitHub Actions:

```yaml
name: Code Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Rascacielo
        run: npm install -g @melampe001/rascacielo-masters
      
      - name: Validate Project
        run: |
          rascacielo validate --min-score 80 --save
          rascacielo badge --score 95 >> README.md
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: validation-results
          path: validation-results/
```

### 8. Web Search & SEO Analysis

Use the Web Search Master:

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

const webSearch = new masters.WebSearchMaster();

// Search documentation
const reactDocs = await webSearch.searchDocs('react', 'hooks');

// SEO analysis
const seo = await webSearch.analyzeSEO('https://example.com');
console.log(`SEO Score: ${seo.score}`);
console.log(`Recommendations:`, seo.recommendations);

// Competitor analysis
const competitor = await webSearch.analyzeCompetitor('https://competitor.com');
console.log(`Technologies:`, competitor.technologies);
console.log(`Performance:`, competitor.performance);
```

### 9. Programmatic Badge Display

Display badges in your app:

```javascript
const { BadgeGenerator } = require('@melampe001/rascacielo-masters');

const generator = new BadgeGenerator();

// Get all badge formats
const badges = generator.generate(92, 'all');

// Use in markdown
console.log(badges.markdown);

// Use in HTML
document.body.innerHTML = badges.html;

// Get JSON data
const data = badges.json;
console.log(`Grade: ${data.grade}`);
console.log(`Color: ${data.color}`);
```

### 10. Best Practices Checker

Get best practices for any technology:

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

// Get Python best practices
const pythonMaster = new masters.PythonMaster();
const pythonBP = pythonMaster.getBestPractices();

// Get React patterns
const reactMaster = new masters.ReactMaster();
const reactPatterns = reactMaster.getPatterns();

// Get Docker recommendations
const dockerMaster = new masters.DockerMaster();
const dockerInfo = dockerMaster.getInfo();

console.log('Python Best Practices:');
pythonBP.forEach(bp => console.log(`  - ${bp}`));
```

## All 72 Master Agents

### Usage Pattern

All master agents follow the same interface:

```javascript
const { masters } = require('@melampe001/rascacielo-masters');

const master = new masters.MasterName({ verbose: true });

// Validate
const result = await master.validate(projectPath);

// Analyze code
const analysis = await master.analyze(code);

// Get best practices
const practices = master.getBestPractices();

// Get patterns
const patterns = master.getPatterns();

// Get info
const info = master.getInfo();
```

### Available Masters

**Languages (7):**
- `PythonMaster`, `JavaScriptMaster`, `TypeScriptMaster`, `JavaMaster`, `GoMaster`, `RustMaster`, `PHPMaster`

**Frontend (3):**
- `ReactMaster`, `VueMaster`, `AngularMaster`

**Mobile (4):**
- `FlutterMaster`, `ReactNativeMaster`, `IOSMaster`, `AndroidMaster`

**DevOps (12):**
- `DockerMaster`, `KubernetesMaster`, `LinuxMaster`, `CICDMaster`, `TerraformMaster`, `JenkinsMaster`, `GitLabCIMaster`, `AnsibleMaster`, `NginxMaster`, `PrometheusMaster`, `GrafanaMaster`, `ElasticsearchMaster`

**Cloud (7):**
- `VercelMaster`, `AWSMaster`, `AzureMaster`, `GCPMaster`, `NetlifyMaster`, `HerokuMaster`, `DigitalOceanMaster`

**Database (3):**
- `SQLMaster`, `NoSQLMaster`, `GraphQLMaster`

**Testing (7):**
- `TestingMaster`, `SeleniumMaster`, `PlaywrightMaster`, `PostmanMaster`, `JMeterMaster`, `CucumberMaster`, `CypressMaster`

**Security (5):**
- `SecurityMaster`, `Auth0Master`, `KeycloakMaster`, `VaultMaster`, `SonarQubeMaster`

**Backend (5):**
- `ExpressMaster`, `NestJSMaster`, `FastAPIMaster`, `DjangoMaster`, `SpringBootMaster`

**Data/ML (4):**
- `PandasMaster`, `NumPyMaster`, `TensorFlowMaster`, `PyTorchMaster`

**Build Tools (4):**
- `NPMMaster`, `YarnMaster`, `WebpackMaster`, `ViteMaster`

**Version Control (3):**
- `GitMaster`, `GitHubActionsMaster`, `BitbucketMaster`

**Design (3):**
- `FigmaMaster`, `CSSMaster`, `SVGMaster`

**Formats (4):**
- `JSONMaster`, `MarkdownMaster`, `YAMLMaster`, `XMLMaster`

**Web Search (1):**
- `WebSearchMaster`

## Configuration

Create `.rascacielorc.json` in your project root:

```json
{
  "minScore": 80,
  "verbose": false,
  "generateBadge": true,
  "reportFormat": "markdown",
  "enabledCategories": [
    "languages",
    "frontend",
    "devops"
  ],
  "excludePaths": [
    "node_modules",
    "dist",
    "build",
    "coverage"
  ]
}
```

## Support

- **GitHub**: https://github.com/Melampe001/Rascacielo-Digital
- **NPM**: https://www.npmjs.com/package/@melampe001/rascacielo-masters
- **Issues**: https://github.com/Melampe001/Rascacielo-Digital/issues
