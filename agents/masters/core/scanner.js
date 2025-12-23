/**
 * Technology Scanner - Rascacielo Digital
 * Scans project and detects technologies
 */

const fs = require('fs');
const path = require('path');

class TechnologyScanner {
  constructor(config = {}) {
    this.config = {
      depth: config.depth || 2,
      verbose: config.verbose || false,
      ...config
    };
  }

  /**
   * Scan project directory and detect technologies
   * @param {string} projectPath - Path to project
   * @returns {Promise<Object>} Detected technologies by category
   */
  async scan(projectPath) {
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project path not found: ${projectPath}`);
    }

    const detected = {
      languages: [],
      frontend: [],
      mobile: [],
      devops: [],
      cloud: [],
      database: [],
      testing: [],
      security: [],
      backend: [],
      'data-ml': [],
      'build-tools': [],
      'version-control': [],
      design: [],
      formats: []
    };

    // Scan for various indicators
    await this.scanLanguages(projectPath, detected);
    await this.scanFrameworks(projectPath, detected);
    await this.scanTools(projectPath, detected);
    await this.scanFiles(projectPath, detected);

    return this.cleanResults(detected);
  }

  /**
   * Scan for programming languages
   */
  async scanLanguages(projectPath, detected) {
    const files = await this.getFiles(projectPath);

    const languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php'
    };

    files.forEach(file => {
      const ext = path.extname(file);
      if (languageMap[ext] && !detected.languages.includes(languageMap[ext])) {
        detected.languages.push(languageMap[ext]);
      }
    });
  }

  /**
   * Scan for frameworks and libraries
   */
  async scanFrameworks(projectPath, detected) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const deps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };

        // Frontend frameworks
        if (deps.react) detected.frontend.push('react');
        if (deps.vue) detected.frontend.push('vue');
        if (deps['@angular/core']) detected.frontend.push('angular');

        // Mobile
        if (deps['react-native']) detected.mobile.push('react-native');
        if (deps.flutter) detected.mobile.push('flutter');

        // Backend
        if (deps.express) detected.backend.push('express');
        if (deps['@nestjs/core']) detected.backend.push('nestjs');
        if (deps.fastapi) detected.backend.push('fastapi');
        if (deps.django) detected.backend.push('django');

        // Testing
        if (deps.jest || deps.jest) detected.testing.push('testing');
        if (deps.selenium || deps['selenium-webdriver']) detected.testing.push('selenium');
        if (deps.playwright || deps['@playwright/test']) detected.testing.push('playwright');
        if (deps.cypress) detected.testing.push('cypress');

        // Build tools
        if (deps.webpack) detected['build-tools'].push('webpack');
        if (deps.vite) detected['build-tools'].push('vite');
        if (packageJson.packageManager?.includes('yarn')) detected['build-tools'].push('yarn');
        if (packageJson.packageManager?.includes('npm') || !packageJson.packageManager) {
          detected['build-tools'].push('npm');
        }

        // Data/ML
        if (deps.pandas) detected['data-ml'].push('pandas');
        if (deps.numpy) detected['data-ml'].push('numpy');
        if (deps.tensorflow || deps['@tensorflow/tfjs']) detected['data-ml'].push('tensorflow');
        if (deps.pytorch) detected['data-ml'].push('pytorch');
      } catch (error) {
        this.log(`Error reading package.json: ${error.message}`);
      }
    }
  }

  /**
   * Scan for DevOps and cloud tools
   */
  async scanTools(projectPath, detected) {
    // Docker
    if (fs.existsSync(path.join(projectPath, 'Dockerfile')) ||
        fs.existsSync(path.join(projectPath, 'docker-compose.yml'))) {
      detected.devops.push('docker');
    }

    // Kubernetes
    if (fs.existsSync(path.join(projectPath, 'k8s')) ||
        fs.existsSync(path.join(projectPath, 'kubernetes'))) {
      detected.devops.push('kubernetes');
    }

    // Terraform
    if (fs.existsSync(path.join(projectPath, 'main.tf'))) {
      detected.devops.push('terraform');
    }

    // CI/CD
    if (fs.existsSync(path.join(projectPath, '.github', 'workflows'))) {
      detected.devops.push('cicd');
      detected['version-control'].push('github-actions');
    }

    if (fs.existsSync(path.join(projectPath, '.gitlab-ci.yml'))) {
      detected.devops.push('gitlab-ci');
    }

    if (fs.existsSync(path.join(projectPath, 'Jenkinsfile'))) {
      detected.devops.push('jenkins');
    }

    // Git
    if (fs.existsSync(path.join(projectPath, '.git'))) {
      detected['version-control'].push('git');
    }

    // Cloud
    if (fs.existsSync(path.join(projectPath, 'vercel.json'))) {
      detected.cloud.push('vercel');
    }

    if (fs.existsSync(path.join(projectPath, 'netlify.toml'))) {
      detected.cloud.push('netlify');
    }
  }

  /**
   * Scan for specific file types
   */
  async scanFiles(projectPath, detected) {
    const files = await this.getFiles(projectPath);

    files.forEach(file => {
      const basename = path.basename(file);
      const ext = path.extname(file);

      // Formats
      if (ext === '.json' && !detected.formats.includes('json')) {
        detected.formats.push('json');
      }
      if (ext === '.md' && !detected.formats.includes('markdown')) {
        detected.formats.push('markdown');
      }
      if (['.yml', '.yaml'].includes(ext) && !detected.formats.includes('yaml')) {
        detected.formats.push('yaml');
      }
      if (ext === '.xml' && !detected.formats.includes('xml')) {
        detected.formats.push('xml');
      }

      // Design
      if (ext === '.css' && !detected.design.includes('css')) {
        detected.design.push('css');
      }
      if (ext === '.svg' && !detected.design.includes('svg')) {
        detected.design.push('svg');
      }
    });
  }

  /**
   * Get all files recursively up to depth limit
   */
  async getFiles(dir, depth = 0) {
    if (depth > this.config.depth) return [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      // Skip node_modules, .git, dist, etc.
      if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await this.getFiles(fullPath, depth + 1));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Remove empty arrays and deduplicate
   */
  cleanResults(detected) {
    const cleaned = {};
    
    for (const [category, items] of Object.entries(detected)) {
      const unique = [...new Set(items)];
      if (unique.length > 0) {
        cleaned[category] = unique.sort();
      }
    }

    return cleaned;
  }

  /**
   * Get summary of detected technologies
   */
  getSummary(detected) {
    const total = Object.values(detected).reduce((sum, arr) => sum + arr.length, 0);
    const categories = Object.keys(detected).length;

    return {
      total,
      categories,
      byCategory: Object.entries(detected).map(([category, items]) => ({
        category,
        count: items.length,
        technologies: items
      }))
    };
  }

  /**
   * Log message if verbose
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[Scanner] ${message}`);
    }
  }
}

module.exports = TechnologyScanner;
