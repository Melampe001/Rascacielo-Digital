/**
 * Base Master Agent - Rascacielo Digital
 * Base class for all specialized master agents
 */

class BaseMaster {
  constructor(config = {}) {
    this.name = config.name || 'Base Master';
    this.version = config.version || '1.0.0';
    this.category = config.category || 'general';
    this.expertise = config.expertise || [];
    this.config = {
      enabled: config.enabled !== false,
      verbose: config.verbose || false,
      ...config
    };
  }

  /**
   * Validate code/project
   * @param {string} projectPath - Path to project
   * @returns {Promise<Object>} Validation result
   */
  async validate(projectPath) {
    throw new Error('validate() must be implemented by subclass');
  }

  /**
   * Analyze code quality
   * @param {string} code - Code to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(code) {
    throw new Error('analyze() must be implemented by subclass');
  }

  /**
   * Get best practices for this technology
   * @returns {Array<string>} List of best practices
   */
  getBestPractices() {
    return [];
  }

  /**
   * Get common patterns for this technology
   * @returns {Array<Object>} List of patterns
   */
  getPatterns() {
    return [];
  }

  /**
   * Get validation rules
   * @returns {Object} Validation rules
   */
  getRules() {
    return {};
  }

  /**
   * Calculate score from validation results
   * @param {Object} results - Validation results
   * @returns {number} Score 0-100
   */
  calculateScore(results) {
    if (!results || !results.checks) {
      return 0;
    }

    const total = results.checks.length;
    const passed = results.checks.filter(c => c.passed).length;
    return Math.round((passed / total) * 100);
  }

  /**
   * Generate recommendations
   * @param {Object} results - Validation results
   * @returns {Array<string>} List of recommendations
   */
  generateRecommendations(results) {
    if (!results || !results.checks) {
      return [];
    }

    return results.checks
      .filter(c => !c.passed)
      .map(c => c.recommendation || `Fix: ${c.name}`);
  }

  /**
   * Get agent info
   * @returns {Object} Agent information
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      category: this.category,
      expertise: this.expertise,
      enabled: this.config.enabled
    };
  }

  /**
   * Log message if verbose mode is enabled
   * @param {string} message - Message to log
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[${this.name}] ${message}`);
    }
  }
}

module.exports = BaseMaster;
