/**
 * JavaScript Master - Rascacielos Digital
 * 
 * Agente maestro especializado en JavaScript/Node.js
 * Mejores prácticas aprobadas 2025
 */

class JavaScriptMaster {
  constructor(config = {}) {
    this.name = 'JavaScript Master';
    this.version = '1.0.0';
    this.expertise = [
      'ES6+ Features',
      'Node.js & Express',
      'Async/Await',
      'Modern JavaScript',
      'NPM & Package Management',
      'Jest Testing',
      'ESLint & Prettier',
      'Module Systems (ESM/CJS)'
    ];
    this.bestPractices = [
      'Use const and let, avoid var',
      'Prefer arrow functions for callbacks',
      'Use async/await over callbacks',
      'Implement proper error handling',
      'Use ESLint and Prettier',
      'Write tests with Jest',
      'Use ES6 modules (import/export)',
      'Leverage destructuring and spread operators'
    ];
    this.config = { ...config };
  }

  /**
   * Analiza código JavaScript y proporciona recomendaciones
   */
  async analyze(code, options = {}) {
    const issues = [];
    const recommendations = [];

    // Verificar uso de var
    if (code.includes('var ')) {
      issues.push({
        type: 'var_usage',
        severity: 'warning',
        message: 'Use const or let instead of var'
      });
    }

    // Verificar callbacks anidados
    if ((code.match(/function\s*\(/g) || []).length > 3) {
      recommendations.push({
        type: 'callback_hell',
        message: 'Consider using async/await to avoid callback hell'
      });
    }

    // Verificar uso de == en lugar de ===
    if (code.includes('==') && !code.includes('===')) {
      issues.push({
        type: 'loose_equality',
        severity: 'error',
        message: 'Use strict equality (===) instead of loose equality (==)'
      });
    }

    return {
      issues,
      recommendations,
      score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 10))
    };
  }

  /**
   * Valida código según mejores prácticas
   */
  async validate(code) {
    const validations = {
      usesModernSyntax: code.includes('const ') || code.includes('let '),
      usesArrowFunctions: code.includes('=>'),
      usesAsyncAwait: code.includes('async') || code.includes('await'),
      usesStrictEquality: !code.includes('==') || code.includes('==='),
      avoidsFunctionConstructor: !code.includes('new Function')
    };

    const passed = Object.values(validations).filter(v => v).length;
    const total = Object.keys(validations).length;

    return {
      valid: passed >= total * 0.7,
      validations,
      score: (passed / total) * 100
    };
  }

  /**
   * Genera código scaffold siguiendo best practices
   */
  async scaffold(projectType, options = {}) {
    const templates = {
      express: this._scaffoldExpress(options),
      api: this._scaffoldAPI(options),
      library: this._scaffoldLibrary(options),
      cli: this._scaffoldCLI(options)
    };

    return templates[projectType] || templates.express;
  }

  _scaffoldExpress(options) {
    return {
      files: {
        'index.js': `/**
 * Express Server - ${options.name || 'API'}
 * 
 * Modern Express.js application with ES6+
 */

const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${options.name || 'API'}' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
`,
        'package.json': `{
  "name": "${options.name || 'express-api'}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "eslint": "^8.50.0"
  }
}
`,
        'tests/index.test.js': `const request = require('supertest');
const app = require('../index');

describe('Express Server', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /api/health should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});
`
      }
    };
  }

  _scaffoldAPI(options) {
    return this._scaffoldExpress(options);
  }

  _scaffoldLibrary(options) {
    return {
      files: {
        'index.js': `/**
 * ${options.name || 'Library'}
 */

class ${options.name || 'Library'} {
  constructor(config = {}) {
    this.config = config;
  }

  // Your methods here
}

module.exports = ${options.name || 'Library'};
`
      }
    };
  }

  _scaffoldCLI(options) {
    return {
      files: {
        'cli.js': `#!/usr/bin/env node

/**
 * CLI Application
 */

const args = process.argv.slice(2);

console.log('CLI started with args:', args);
`
      }
    };
  }

  /**
   * Optimiza código existente
   */
  async optimize(code) {
    let optimized = code;
    const optimizations = [];

    // Optimización 1: Convertir var a const/let
    if (optimized.includes('var ')) {
      optimizations.push('Convert var to const/let');
    }

    // Optimización 2: Usar template literals
    if (optimized.includes('+ "') || optimized.includes('" +')) {
      optimizations.push('Use template literals instead of string concatenation');
    }

    // Optimización 3: Usar destructuring
    if (optimized.includes('.')) {
      optimizations.push('Consider using destructuring for object properties');
    }

    return {
      code: optimized,
      optimizations,
      improved: optimizations.length > 0
    };
  }

  /**
   * Proporciona guía y documentación
   */
  getGuidance(topic) {
    const guides = {
      'modern-js': {
        title: 'Modern JavaScript Best Practices',
        content: `
# Modern JavaScript (ES6+)

## Variable Declaration
\`\`\`javascript
// Use const for immutable bindings
const API_KEY = 'abc123';
const users = [];

// Use let for mutable bindings
let count = 0;
count++;

// Avoid var
// var x = 1; // Don't use this
\`\`\`

## Arrow Functions
\`\`\`javascript
// Concise syntax
const double = x => x * 2;

// Multiple parameters
const add = (a, b) => a + b;

// Block body
const process = data => {
  const result = transform(data);
  return result;
};
\`\`\`

## Destructuring
\`\`\`javascript
// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second] = array;

// Function parameters
const greet = ({ name, title }) => \`Hello \${title} \${name}\`;
\`\`\`
        `
      },
      'async': {
        title: 'Async/Await Best Practices',
        content: `
# Async/Await

\`\`\`javascript
// Always use try/catch with async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Parallel execution
async function fetchMultiple() {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);
  return { users, posts };
}
\`\`\`
        `
      },
      'error-handling': {
        title: 'Error Handling',
        content: `
# Error Handling Best Practices

\`\`\`javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Express error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message
  });
});
\`\`\`
        `
      }
    };

    return guides[topic] || {
      title: 'JavaScript Best Practices',
      content: 'Use modern ES6+ syntax, async/await, and proper error handling'
    };
  }

  /**
   * Detecta anti-patterns y problemas comunes
   */
  async detectIssues(code) {
    const issues = [];

    // Anti-pattern 1: Callback hell
    if ((code.match(/function\s*\([^)]*\)\s*{[^}]*function\s*\(/g) || []).length > 2) {
      issues.push({
        type: 'callback_hell',
        severity: 'warning',
        message: 'Deeply nested callbacks detected, consider using async/await',
        line: null
      });
    }

    // Anti-pattern 2: Modifying prototypes
    if (code.includes('.prototype.')) {
      issues.push({
        type: 'prototype_modification',
        severity: 'warning',
        message: 'Avoid modifying built-in prototypes',
        line: null
      });
    }

    // Anti-pattern 3: Using eval
    if (code.includes('eval(')) {
      issues.push({
        type: 'eval_usage',
        severity: 'error',
        message: 'Never use eval(), it\'s a security risk',
        line: null
      });
    }

    // Anti-pattern 4: Synchronous operations in async context
    if (code.includes('async') && (code.includes('fs.readFileSync') || code.includes('fs.writeFileSync'))) {
      issues.push({
        type: 'sync_in_async',
        severity: 'warning',
        message: 'Use async file operations (fs.promises) in async functions',
        line: null
      });
    }

    return issues;
  }
}

module.exports = JavaScriptMaster;
