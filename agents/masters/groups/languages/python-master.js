/**
 * Python Master - Rascacielo Digital
 * Expert agent for Python development
 */

const BaseMaster = require('../../core/base-master');

class PythonMaster extends BaseMaster {
  constructor(config = {}) {
    super({
      name: 'Python Master',
      version: '1.0.0',
      category: 'languages',
      expertise: [
        'Python 3.x development',
        'PEP 8 style guidelines',
        'Type hints and annotations',
        'Virtual environments (venv, conda)',
        'Package management (pip, poetry)',
        'Testing (pytest, unittest)',
        'Async/await patterns',
        'Performance optimization'
      ],
      ...config
    });
  }

  /**
   * Validate Python project
   */
  async validate(projectPath) {
    this.log(`Validating Python project at: ${projectPath}`);

    const checks = [];

    // Check for requirements.txt or pyproject.toml
    checks.push(await this.checkDependencyFile(projectPath));
    
    // Check for virtual environment
    checks.push(await this.checkVirtualEnv(projectPath));
    
    // Check for __init__.py files
    checks.push(await this.checkPackageStructure(projectPath));
    
    // Check for tests
    checks.push(await this.checkTests(projectPath));
    
    // Check for README
    checks.push(await this.checkDocumentation(projectPath));

    const score = this.calculateScore({ checks });

    return {
      agent: this.name,
      category: this.category,
      score,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  async checkDependencyFile(projectPath) {
    const fs = require('fs');
    const path = require('path');
    
    const hasRequirements = fs.existsSync(path.join(projectPath, 'requirements.txt'));
    const hasPyproject = fs.existsSync(path.join(projectPath, 'pyproject.toml'));
    
    return {
      name: 'Dependency Management',
      passed: hasRequirements || hasPyproject,
      message: hasRequirements || hasPyproject 
        ? 'Dependencies properly defined' 
        : 'Missing requirements.txt or pyproject.toml',
      recommendation: 'Create requirements.txt or pyproject.toml to manage dependencies'
    };
  }

  async checkVirtualEnv(projectPath) {
    const fs = require('fs');
    const path = require('path');
    
    const hasVenv = fs.existsSync(path.join(projectPath, 'venv')) ||
                    fs.existsSync(path.join(projectPath, '.venv'));
    
    return {
      name: 'Virtual Environment',
      passed: hasVenv,
      message: hasVenv ? 'Virtual environment found' : 'No virtual environment detected',
      recommendation: 'Create a virtual environment with: python -m venv venv'
    };
  }

  async checkPackageStructure(projectPath) {
    const fs = require('fs');
    const path = require('path');
    
    // Look for __init__.py in subdirectories
    let hasInit = false;
    
    try {
      const entries = fs.readdirSync(projectPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !['venv', '.venv', 'node_modules'].includes(entry.name)) {
          const initPath = path.join(projectPath, entry.name, '__init__.py');
          if (fs.existsSync(initPath)) {
            hasInit = true;
            break;
          }
        }
      }
    } catch (error) {
      // Directory read error
    }
    
    return {
      name: 'Package Structure',
      passed: hasInit,
      message: hasInit ? 'Proper package structure' : 'Missing __init__.py files',
      recommendation: 'Add __init__.py files to create proper Python packages'
    };
  }

  async checkTests(projectPath) {
    const fs = require('fs');
    const path = require('path');
    
    const hasTestDir = fs.existsSync(path.join(projectPath, 'tests')) ||
                       fs.existsSync(path.join(projectPath, 'test'));
    
    return {
      name: 'Testing',
      passed: hasTestDir,
      message: hasTestDir ? 'Test directory found' : 'No test directory',
      recommendation: 'Create a tests/ directory and add unit tests with pytest'
    };
  }

  async checkDocumentation(projectPath) {
    const fs = require('fs');
    const path = require('path');
    
    const hasReadme = fs.existsSync(path.join(projectPath, 'README.md')) ||
                      fs.existsSync(path.join(projectPath, 'README.rst'));
    
    return {
      name: 'Documentation',
      passed: hasReadme,
      message: hasReadme ? 'README found' : 'No README file',
      recommendation: 'Add README.md with project description and usage instructions'
    };
  }

  getBestPractices() {
    return [
      'Follow PEP 8 style guidelines',
      'Use type hints for function parameters and returns',
      'Write docstrings for all functions and classes',
      'Use virtual environments for dependency isolation',
      'Keep requirements.txt or pyproject.toml updated',
      'Write comprehensive unit tests with pytest',
      'Use meaningful variable and function names',
      'Handle exceptions appropriately',
      'Use f-strings for string formatting',
      'Avoid mutable default arguments'
    ];
  }

  getPatterns() {
    return [
      { name: 'Context Managers', example: 'with open(file) as f:' },
      { name: 'List Comprehensions', example: '[x*2 for x in range(10)]' },
      { name: 'Generators', example: 'yield from iterable' },
      { name: 'Decorators', example: '@decorator' },
      { name: 'Type Hints', example: 'def func(x: int) -> str:' }
    ];
  }
}

module.exports = PythonMaster;
