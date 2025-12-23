# @melampe001/rascacielo-masters

> 35 Specialized Master Agents for code analysis, validation, and scaffolding across multiple technologies

[![npm version](https://img.shields.io/npm/v/@melampe001/rascacielo-masters.svg)](https://www.npmjs.com/package/@melampe001/rascacielo-masters)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📦 Installation

```bash
npm install @melampe001/rascacielo-masters
```

## 🚀 Quick Start

```javascript
const { PythonMaster, ReactMaster, DockerMaster } = require('@melampe001/rascacielo-masters');

// Use Python Master
const pythonAgent = new PythonMaster({ verbose: true });
const result = await pythonAgent.analyze(codeString);
console.log(result);

// Use React Master
const reactAgent = new ReactMaster({ strictMode: true });
const recommendations = await reactAgent.analyze(componentCode);

// Use Docker Master
const dockerAgent = new DockerMaster();
const dockerAnalysis = await dockerAgent.analyze(dockerfileContent);
```

## 📋 Available Master Agents (35 Total)

### 🐍 Programming Languages (7 agents)

#### 1. **PythonMaster**
- **Specializations**: FastAPI, Django, Type Hints, Flask, Pytest
- **Use Case**: Python code analysis, best practices validation

```javascript
const { PythonMaster } = require('@melampe001/rascacielo-masters');
const agent = new PythonMaster({ strictMode: true });
```

#### 2. **JavaScriptMaster**
- **Specializations**: Node.js, Express, ES6+, Async/Await, NPM
- **Use Case**: JavaScript code quality, modern patterns

#### 3. **TypeScriptMaster**
- **Specializations**: NestJS, Strict Mode, Type Safety, Decorators, Generics
- **Use Case**: TypeScript type checking, best practices

#### 4. **JavaMaster**
- **Specializations**: Spring Boot, Jakarta EE, Maven, Gradle, JUnit
- **Use Case**: Java enterprise applications, testing

#### 5. **GoMaster**
- **Specializations**: Microservices, Concurrency, Goroutines, Channels, Gin
- **Use Case**: Go concurrent programming, microservices

#### 6. **RustMaster**
- **Specializations**: Memory Safety, Performance, Ownership, Cargo, Tokio
- **Use Case**: Rust safety validation, performance optimization

#### 7. **PHPMaster**
- **Specializations**: Laravel, WordPress, Symfony, Composer, PSR Standards
- **Use Case**: PHP frameworks, standards compliance

---

### ⚛️ Frontend Frameworks (3 agents)

#### 8. **ReactMaster**
- **Specializations**: Hooks, Next.js, Redux, React Router, Context API
- **Use Case**: React component analysis, performance

```javascript
const { ReactMaster } = require('@melampe001/rascacielo-masters');
const agent = new ReactMaster();
const analysis = await agent.analyze(componentCode);
```

#### 9. **VueMaster**
- **Specializations**: Composition API, Nuxt, Pinia, Vue Router, Vuex
- **Use Case**: Vue.js best practices, state management

#### 10. **AngularMaster**
- **Specializations**: TypeScript, RxJS, NGRX, Angular CLI, Dependency Injection
- **Use Case**: Angular patterns, reactive programming

---

### 📱 Mobile Development (4 agents)

#### 11. **FlutterMaster**
- **Specializations**: Dart, Widgets, Riverpod, State Management, Material Design
- **Use Case**: Flutter app structure, widget optimization

#### 12. **ReactNativeMaster**
- **Specializations**: Expo, Navigation, Native Modules, Redux, Async Storage
- **Use Case**: React Native cross-platform development

#### 13. **IOSMaster**
- **Specializations**: Swift, SwiftUI, Combine, UIKit, Core Data
- **Use Case**: iOS native development, SwiftUI patterns

#### 14. **AndroidMaster**
- **Specializations**: Kotlin, Jetpack Compose, Room, ViewModel, Navigation
- **Use Case**: Android modern development, Compose UI

---

### 🛠️ DevOps & Infrastructure (5 agents)

#### 15. **DockerMaster**
- **Specializations**: Multi-stage Builds, Best Practices, Docker Compose, Container Security
- **Use Case**: Dockerfile optimization, containerization

```javascript
const { DockerMaster } = require('@melampe001/rascacielo-masters');
const agent = new DockerMaster({ verbose: true });
```

#### 16. **KubernetesMaster**
- **Specializations**: RBAC, Helm, Monitoring, Service Mesh, Auto-scaling
- **Use Case**: Kubernetes manifests, cluster configuration

#### 17. **LinuxMaster**
- **Specializations**: Bash, SysAdmin, Security, System Performance, Networking
- **Use Case**: Shell scripts, system optimization

#### 18. **CICDMaster**
- **Specializations**: GitHub Actions, Jenkins, GitLab CI, Pipeline Optimization
- **Use Case**: CI/CD pipeline configuration, automation

#### 19. **TerraformMaster**
- **Specializations**: IaC, Pulumi, State Management, Modules, Cloud Provisioning
- **Use Case**: Infrastructure as Code, cloud automation

---

### ☁️ Cloud Platforms (4 agents)

#### 20. **VercelMaster**
- **Specializations**: Serverless, Edge Functions, Next.js Deployment, Analytics
- **Use Case**: Vercel deployment configuration

#### 21. **AWSMaster**
- **Specializations**: EC2, Lambda, S3, RDS, CloudFormation
- **Use Case**: AWS service configuration, best practices

#### 22. **AzureMaster**
- **Specializations**: Functions, DevOps, App Service, Cosmos DB, Key Vault
- **Use Case**: Azure cloud services

#### 23. **GCPMaster**
- **Specializations**: Cloud Functions, BigQuery, Firestore, Cloud Run, GKE
- **Use Case**: Google Cloud Platform services

---

### 🗄️ Databases (3 agents)

#### 24. **SQLMaster**
- **Specializations**: PostgreSQL, MySQL, Query Optimization, Indexing, Transactions
- **Use Case**: SQL query optimization, database design

#### 25. **NoSQLMaster**
- **Specializations**: MongoDB, Redis, Caching, Document Design, Aggregation
- **Use Case**: NoSQL database patterns, caching strategies

#### 26. **GraphQLMaster**
- **Specializations**: Apollo, Resolvers, Schema Design, Subscriptions, Federation
- **Use Case**: GraphQL API design, schema optimization

---

### 🎨 Design & UI/UX (3 agents)

#### 27. **FigmaMaster**
- **Specializations**: UI/UX, Prototypes, Design Systems, Component Libraries
- **Use Case**: Design system validation

#### 28. **CSSMaster**
- **Specializations**: Tailwind, SASS, Responsive Design, Flexbox, Grid
- **Use Case**: CSS architecture, responsive patterns

#### 29. **SVGMaster**
- **Specializations**: Vector Graphics, Animations, Optimization, Path Manipulation
- **Use Case**: SVG optimization, animations

---

### 📄 Data Formats (4 agents)

#### 30. **JSONMaster**
- **Specializations**: Validation, Schema, JSON Schema, Parsing, Formatting
- **Use Case**: JSON validation, schema design

#### 31. **MarkdownMaster**
- **Specializations**: Documentation, MDX, GitHub Flavored, Tables, Code Blocks
- **Use Case**: Documentation quality, markdown linting

#### 32. **YAMLMaster**
- **Specializations**: Configuration, Kubernetes, CI/CD Pipelines, Validation
- **Use Case**: YAML configuration validation

#### 33. **XMLMaster**
- **Specializations**: Parsing, XSLT, XPath, Schema Validation, Transformation
- **Use Case**: XML processing, validation

---

### ✅ Quality & Security (2 agents)

#### 34. **TestingMaster**
- **Specializations**: Jest, Pytest, Cypress, Unit Testing, E2E Testing
- **Use Case**: Test quality, coverage analysis

```javascript
const { TestingMaster } = require('@melampe001/rascacielo-masters');
const agent = new TestingMaster();
const testAnalysis = await agent.analyze(testCode);
```

#### 35. **SecurityMaster**
- **Specializations**: OWASP, DevSecOps, Vulnerability Scanning, Secure Coding
- **Use Case**: Security analysis, vulnerability detection

---

## 🔧 Configuration Options

All master agents support the following configuration options:

```javascript
const agent = new PythonMaster({
  verbose: true,        // Enable detailed logging
  strictMode: true      // Enable strict validation rules
});
```

## 📚 API Reference

### Common Methods

All master agents implement the following interface:

#### `analyze(code: string): Promise<AnalysisResult>`

Analyzes code and returns recommendations and issues.

**Returns:**
```typescript
{
  agent: string;
  language?: string;
  framework?: string;
  platform?: string;
  category?: string;
  recommendations: string[];
  issues: string[];
  score: number;
}
```

#### `validate(params: object): Promise<boolean>`

Validates parameters before processing.

#### `getSpecializations(): string[]`

Returns the list of specializations for the agent.

---

## 💡 Usage Examples

### Example 1: Analyze Python Code

```javascript
const { PythonMaster } = require('@melampe001/rascacielo-masters');

const pythonCode = `
def calculate_sum(a, b):
    return a + b
`;

const agent = new PythonMaster({ verbose: true });
const result = await agent.analyze(pythonCode);

console.log('Score:', result.score);
console.log('Recommendations:', result.recommendations);
console.log('Issues:', result.issues);
```

### Example 2: Multi-Agent Analysis

```javascript
const { 
  PythonMaster, 
  DockerMaster, 
  TestingMaster 
} = require('@melampe001/rascacielo-masters');

async function analyzeProject() {
  const pythonAgent = new PythonMaster();
  const dockerAgent = new DockerMaster();
  const testingAgent = new TestingMaster();

  const results = await Promise.all([
    pythonAgent.analyze(pythonCode),
    dockerAgent.analyze(dockerfileContent),
    testingAgent.analyze(testCode)
  ]);

  return results;
}
```

### Example 3: Get Agent Specializations

```javascript
const { ReactMaster } = require('@melampe001/rascacielo-masters');

const agent = new ReactMaster();
const specializations = agent.getSpecializations();

console.log('React Master specializes in:');
specializations.forEach(spec => console.log(`- ${spec}`));
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Repository**: [github.com/Melampe001/Rascacielo-Digital](https://github.com/Melampe001/Rascacielo-Digital)
- **Issues**: [github.com/Melampe001/Rascacielo-Digital/issues](https://github.com/Melampe001/Rascacielo-Digital/issues)
- **NPM Package**: [@melampe001/rascacielo-masters](https://www.npmjs.com/package/@melampe001/rascacielo-masters)

---

## 👨‍💻 Author

**Melampe001**

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

## 📊 Package Stats

- **35 Master Agents** across 7 categories
- **Zero dependencies** - lightweight and fast
- **TypeScript definitions** included
- **Comprehensive documentation**
- **MIT Licensed** - free to use

---

Made with ❤️ by Melampe001
