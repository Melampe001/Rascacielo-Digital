# 📦 Rascacielo Masters

**35 Specialized Master Agents for Code Analysis, Validation, Scaffolding and Optimization**

[![npm version](https://badge.fury.io/js/%40melampe001%2Frascacielo-masters.svg)](https://www.npmjs.com/package/@melampe001/rascacielo-masters)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install @melampe001/rascacielo-masters
```

### Usage

```javascript
const { PythonMaster, TypeScriptMaster, ReactMaster } = require('@melampe001/rascacielo-masters');

// Python analysis
const pythonMaster = new PythonMaster();
const analysis = await pythonMaster.analyze(pythonCode);

// TypeScript scaffolding
const tsMaster = new TypeScriptMaster();
const project = await tsMaster.scaffold('nestjs', { name: 'my-api' });

// React validation
const reactMaster = new ReactMaster();
const validation = await reactMaster.validate(reactCode);
```

## 📚 Available Masters (35)

### Programming Languages (7)
- **PythonMaster** - Python, PEP8, Django, Flask, FastAPI
- **JavaScriptMaster** - JavaScript, ES6+, Node.js, npm
- **TypeScriptMaster** - TypeScript, Type safety, Interfaces, Generics
- **JavaMaster** - Java, Spring Boot, Maven, Gradle
- **GoMaster** - Go, Goroutines, Channels, go modules
- **RustMaster** - Rust, Ownership, Borrowing, Cargo
- **PHPMaster** - PHP, Laravel, Composer, PSR standards

### Frontend Frameworks (3)
- **ReactMaster** - React, Hooks, JSX, Redux
- **VueMaster** - Vue, Composition API, Vuex, Vue Router
- **AngularMaster** - Angular, TypeScript, RxJS, NgRx

### Mobile Development (4)
- **FlutterMaster** - Flutter, Dart, Widgets, State management
- **ReactNativeMaster** - React Native, Expo, Native modules
- **iOSMaster** - Swift, SwiftUI, UIKit, Xcode
- **AndroidMaster** - Kotlin, Jetpack Compose, Android SDK

### DevOps & Infrastructure (5)
- **DockerMaster** - Docker, Containers, Dockerfile, Docker Compose
- **KubernetesMaster** - Kubernetes, Pods, Services, Deployments
- **LinuxMaster** - Linux, Shell scripting, System administration
- **CICDMaster** - CI/CD, GitHub Actions, Jenkins, GitLab CI
- **TerraformMaster** - Terraform, IaC, HCL, State management

### Cloud Platforms (4)
- **VercelMaster** - Vercel, Serverless, Edge Functions, Next.js
- **AWSMaster** - AWS, EC2, S3, Lambda, CloudFormation
- **AzureMaster** - Azure, App Service, Functions, DevOps
- **GCPMaster** - GCP, Compute Engine, Cloud Functions

### Databases (3)
- **SQLMaster** - SQL, PostgreSQL, MySQL, Query optimization
- **NoSQLMaster** - MongoDB, Redis, DynamoDB
- **GraphQLMaster** - GraphQL, Schema design, Resolvers, Apollo

### Design & UI/UX (3)
- **FigmaMaster** - Figma, Design systems, Components
- **CSSMaster** - CSS, Flexbox, Grid, Animations
- **SVGMaster** - SVG, Path optimization, Animations

### Data Formats (4)
- **JSONMaster** - JSON, JSON Schema, Validation
- **MarkdownMaster** - Markdown, Documentation, GFM, MDX
- **YAMLMaster** - YAML, Configuration, Anchors
- **XMLMaster** - XML, XSD, XSLT, Parsing

### Quality & Security (2)
- **TestingMaster** - Unit testing, Integration testing, E2E, TDD
- **SecurityMasterAgent** - Security auditing, Vulnerability scanning, OWASP

## 🎯 Core Features

Each Master Agent provides:

### 1. Code Analysis
```javascript
const analysis = await master.analyze(code, options);
// Returns: { issues, recommendations, score }
```

### 2. Validation
```javascript
const validation = await master.validate(code);
// Returns: { valid, validations, score }
```

### 3. Scaffolding
```javascript
const project = await master.scaffold(projectType, options);
// Returns: { files: { 'path/to/file': 'content' } }
```

### 4. Code Optimization
```javascript
const optimized = await master.optimize(code);
// Returns: { code, optimizations, improved }
```

### 5. Guidance
```javascript
const guide = master.getGuidance(topic);
// Returns: { title, content, examples }
```

### 6. Issue Detection
```javascript
const issues = await master.detectIssues(code);
// Returns: [{ type, severity, message, line }]
```

## 📖 Examples

### Example 1: Python Code Analysis
```javascript
const { PythonMaster } = require('@melampe001/rascacielo-masters');

const master = new PythonMaster({ strict: true });
const code = `
def calculate_sum(a,b):
    return a+b
`;

const analysis = await master.analyze(code);
console.log(`Score: ${analysis.score}/100`);
console.log(`Issues found: ${analysis.issues.length}`);
```

### Example 2: React Scaffolding
```javascript
const { ReactMaster } = require('@melampe001/rascacielo-masters');

const master = new ReactMaster();
const project = await master.scaffold('component', {
  name: 'UserProfile',
  typescript: true,
  hooks: true
});

// Creates complete component structure
Object.entries(project.files).forEach(([path, content]) => {
  console.log(`Created: ${path}`);
});
```

### Example 3: Docker Optimization
```javascript
const { DockerMaster } = require('@melampe001/rascacielo-masters');

const master = new DockerMaster();
const dockerfile = `
FROM node:14
COPY . /app
RUN npm install
`;

const optimized = await master.optimize(dockerfile);
console.log('Optimized Dockerfile:');
console.log(optimized.code);
console.log('Improvements:', optimized.optimizations);
```

### Example 4: Multiple Masters
```javascript
const {
  JavaScriptMaster,
  TypeScriptMaster,
  ReactMaster,
  listMasters,
  initializeAll
} = require('@melampe001/rascacielo-masters');

// List all available masters
console.log('Available masters:', listMasters());

// Initialize all masters at once
const allMasters = initializeAll({ verbose: true });

// Use specific master
const jsAnalysis = await allMasters.JavaScriptMaster.analyze(jsCode);
```

### Example 5: Helper Functions
```javascript
const { getMaster } = require('@melampe001/rascacielo-masters');

// Dynamically get a master by name
const masterName = 'TypeScriptMaster';
const master = getMaster(masterName, { strict: true });

const validation = await master.validate(tsCode);
```

## 🔧 Configuration

Each master accepts an optional configuration object:

```javascript
const master = new PythonMaster({
  strict: true,              // Enable strict mode
  verbose: false,            // Disable verbose output
  autofix: true,             // Enable auto-fixing
  ignorePatterns: ['*.test.py'],  // Ignore test files
  customRules: {             // Add custom rules
    maxLineLength: 100
  }
});
```

## 🧪 Testing

```bash
npm test
```

## 📄 License

MIT © 2025 Melampe001

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please report it at [GitHub Issues](https://github.com/Melampe001/Rascacielo-Digital/issues)

## 📦 Package Information

- **Package name**: `@melampe001/rascacielo-masters`
- **Version**: 1.0.0
- **Node.js**: >= 14.0.0
- **Repository**: [Rascacielo-Digital](https://github.com/Melampe001/Rascacielo-Digital)

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/@melampe001/rascacielo-masters)
- [GitHub Repository](https://github.com/Melampe001/Rascacielo-Digital)
- [Documentation](https://github.com/Melampe001/Rascacielo-Digital/blob/Main/agents/masters/README.md)
- [Issue Tracker](https://github.com/Melampe001/Rascacielo-Digital/issues)

---

**Made with ❤️ by Melampe001**
