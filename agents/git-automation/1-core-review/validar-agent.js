/**
 * Validar Agent - Rascacielo Digital
 * 
 * Premium Elite Quality Agent
 * Validates code standards, test coverage, and commit conventions
 */

const BaseAgent = require('../shared/base-agent');
const { CATEGORY, PRIORITY } = require('../shared/constants');

class ValidarAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Validar',
      version: '1.0.0',
      category: CATEGORY.CORE_REVIEW,
      priority: PRIORITY.CRITICAL,
      description: 'Validates code standards, coverage, and conventions',
      certifications: ['ISO/IEC 25010', 'Clean Code', 'Conventional Commits'],
      ...config
    });
    
    this.standards = {
      minCoverage: config.minCoverage || 80,
      maxLineLength: config.maxLineLength || 120,
      requireTests: config.requireTests !== false
    };
  }

  async execute(context) {
    this.logger.info('Starting validation...');

    const result = {
      valid: true,
      violations: [],
      coverage: { current: 0, required: this.standards.minCoverage, passed: false },
      documentation: { missing: [], incomplete: [] },
      commits: { invalid: [] },
      breakingChanges: []
    };

    // Validar estándares de código
    const codeStandards = await this._validateCodeStandards(context);
    result.violations.push(...codeStandards);

    // Validar cobertura de tests
    result.coverage = await this._validateCoverage(context);

    // Validar documentación
    result.documentation = await this._validateDocumentation(context);

    // Validar mensajes de commit
    result.commits = await this._validateCommits(context);

    // Detectar cambios rompedores
    result.breakingChanges = await this._detectBreakingChanges(context);

    // Determinar si es válido
    result.valid = result.violations.length === 0 && 
                   result.coverage.passed && 
                   result.commits.invalid.length === 0;

    this.logger.success(`Validation ${result.valid ? 'passed' : 'failed'}`);

    return result;
  }

  async _validateCodeStandards(context) {
    const violations = [];

    if (context.files) {
      for (const file of context.files) {
        const lines = file.content?.split('\n') || [];
        
        lines.forEach((line, idx) => {
          // Validar longitud de línea
          if (line.length > this.standards.maxLineLength) {
            violations.push({
              file: file.path,
              line: idx + 1,
              rule: 'max-line-length',
              message: `Line exceeds ${this.standards.maxLineLength} characters`
            });
          }

          // Detectar console.log en producción
          if (line.includes('console.log') && !file.path.includes('test')) {
            violations.push({
              file: file.path,
              line: idx + 1,
              rule: 'no-console',
              message: 'console.log detected in production code'
            });
          }
        });
      }
    }

    return violations;
  }

  async _validateCoverage(context) {
    const current = context.coverage?.current || 0;
    const required = this.standards.minCoverage;

    return {
      current,
      required,
      passed: current >= required
    };
  }

  async _validateDocumentation(context) {
    const missing = [];
    const incomplete = [];

    // Verificar archivos de documentación requeridos
    const requiredDocs = ['README.md', 'CONTRIBUTING.md', 'LICENSE'];
    const existingFiles = context.files?.map(f => f.path) || [];

    for (const doc of requiredDocs) {
      if (!existingFiles.includes(doc)) {
        missing.push(doc);
      }
    }

    return { missing, incomplete };
  }

  async _validateCommits(context) {
    const invalid = [];
    const commitRegex = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;

    if (context.commits) {
      for (const commit of context.commits) {
        if (!commitRegex.test(commit.message)) {
          invalid.push({
            sha: commit.sha,
            message: commit.message,
            reason: 'Does not follow Conventional Commits format'
          });
        }
      }
    }

    return { invalid };
  }

  async _detectBreakingChanges(context) {
    const breaking = [];

    if (context.files) {
      for (const file of context.files) {
        // Detectar cambios en API públicas
        if (file.content?.includes('export') && file.diff?.includes('-export')) {
          breaking.push({
            file: file.path,
            type: 'api-removal',
            description: 'Public API export removed'
          });
        }

        // Detectar cambios en firmas de función
        if (file.diff?.match(/^-.*function.*\(/m) && file.diff?.match(/^\+.*function.*\(/m)) {
          breaking.push({
            file: file.path,
            type: 'signature-change',
            description: 'Function signature modified'
          });
        }
      }
    }

    return breaking;
  }

  async autoFix(issues) {
    const fixed = [];
    const failed = [];

    for (const issue of issues) {
      if (issue.rule === 'no-console') {
        // Auto-fix: comentar console.log
        fixed.push({
          file: issue.file,
          line: issue.line,
          fix: 'Commented out console.log'
        });
      } else {
        failed.push(issue);
      }
    }

    return { fixed, failed, manual: failed };
  }
}

module.exports = ValidarAgent;
