/**
 * Auto Validator - Rascacielo Digital
 * Automated validation system that detects technologies and runs appropriate agents
 */

const TechnologyScanner = require('../core/scanner');
const Orchestrator = require('../core/orchestrator');
const Validator = require('../core/validator');
const BadgeGenerator = require('../core/badge-generator');
const Reporter = require('../core/reporter');

class AutoValidator {
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose || false,
      generateBadge: config.generateBadge !== false,
      generateReport: config.generateReport !== false,
      reportFormat: config.reportFormat || 'text',
      minScore: config.minScore || 70,
      ...config
    };

    this.scanner = new TechnologyScanner({ verbose: this.config.verbose });
    this.orchestrator = new Orchestrator({ verbose: this.config.verbose });
    this.validator = new Validator({ 
      verbose: this.config.verbose,
      minScore: this.config.minScore 
    });
    this.badgeGenerator = new BadgeGenerator();
    this.reporter = new Reporter({ 
      verbose: this.config.verbose,
      format: this.config.reportFormat 
    });
  }

  /**
   * Run complete validation workflow
   * @param {string} projectPath - Path to project
   * @returns {Promise<Object>} Complete validation results
   */
  async validate(projectPath) {
    this.log('Starting automated validation...');
    const startTime = Date.now();

    try {
      // Step 1: Scan technologies
      this.log('Step 1/4: Scanning technologies...');
      const technologies = await this.scanner.scan(projectPath);
      this.log(`Detected ${Object.values(technologies).flat().length} technologies`);

      // Step 2: Load appropriate agents
      this.log('Step 2/4: Loading master agents...');
      await this.orchestrator.loadAllAgents();
      const stats = this.orchestrator.getStats();
      this.log(`Loaded ${stats.total} agents across ${stats.categories} categories`);

      // Step 3: Run validation with detected agents
      this.log('Step 3/4: Running validation...');
      const agentResults = await this.orchestrator.validate(projectPath, 
        this.getRelevantAgents(technologies));

      // Step 4: Validate and generate reports
      this.log('Step 4/4: Generating reports...');
      const summary = this.validator.validate(agentResults.results);

      // Generate badge
      let badge = null;
      if (this.config.generateBadge) {
        badge = this.badgeGenerator.generate(summary.score, 'all');
      }

      // Generate report
      let report = null;
      if (this.config.generateReport) {
        report = this.reporter.generate(summary, this.config.reportFormat);
      }

      const duration = Date.now() - startTime;
      this.log(`Validation completed in ${duration}ms`);

      return {
        success: true,
        duration,
        projectPath,
        technologies,
        summary,
        badge,
        report,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.log(`Validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get relevant agent names based on detected technologies
   */
  getRelevantAgents(technologies) {
    const agents = [];

    for (const [category, techs] of Object.entries(technologies)) {
      techs.forEach(tech => {
        agents.push(tech);
      });
    }

    // If no specific technologies detected, use core agents
    if (agents.length === 0) {
      return null; // Will use all agents
    }

    return agents;
  }

  /**
   * Calculate global score from agent results
   */
  calculateGlobalScore(results) {
    const scores = [];

    for (const [, result] of Object.entries(results)) {
      if (result.error) continue;
      
      if (result.score !== undefined) {
        scores.push(result.score);
      } else if (result.checks) {
        const total = result.checks.length;
        const passed = result.checks.filter(c => c.passed).length;
        scores.push(Math.round((passed / total) * 100));
      }
    }

    if (scores.length === 0) return 0;

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  /**
   * Get grade from score
   */
  getGrade(score) {
    if (score >= 95) return 'PLATINUM';
    if (score >= 90) return 'GOLD';
    if (score >= 80) return 'SILVER';
    if (score >= 70) return 'BRONZE';
    return 'PENDING';
  }

  /**
   * Generate recommendations from results
   */
  generateRecommendations(results) {
    const recommendations = [];

    for (const [agentName, result] of Object.entries(results)) {
      if (result.error) {
        recommendations.push(`[${agentName}] Fix error: ${result.error}`);
        continue;
      }

      if (result.checks) {
        result.checks
          .filter(c => !c.passed && c.recommendation)
          .forEach(c => {
            recommendations.push(`[${agentName}] ${c.recommendation}`);
          });
      }

      if (result.recommendations && Array.isArray(result.recommendations)) {
        result.recommendations.forEach(rec => {
          recommendations.push(`[${agentName}] ${rec}`);
        });
      }
    }

    return recommendations;
  }

  /**
   * Quick validate (minimal output)
   */
  async quickValidate(projectPath) {
    const result = await this.validate(projectPath);
    
    return {
      grade: result.summary.grade,
      score: result.summary.score,
      valid: result.summary.valid,
      badge: result.badge?.markdown || null
    };
  }

  /**
   * Save complete validation to disk
   */
  async saveValidation(projectPath, outputDir = './validation-results') {
    const result = await this.validate(projectPath);
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = Date.now();

    // Save full results as JSON
    const jsonPath = path.join(outputDir, `validation-${timestamp}.json`);
    await fs.promises.writeFile(jsonPath, JSON.stringify(result, null, 2));

    // Save report
    if (result.report) {
      const ext = this.reporter.getExtension(this.config.reportFormat);
      const reportPath = path.join(outputDir, `report-${timestamp}.${ext}`);
      await fs.promises.writeFile(reportPath, result.report);
    }

    // Save badge
    if (result.badge) {
      const badgePath = path.join(outputDir, `badge-${timestamp}.json`);
      await fs.promises.writeFile(badgePath, JSON.stringify(result.badge, null, 2));
    }

    this.log(`Validation saved to: ${outputDir}`);
    
    return {
      outputDir,
      files: fs.readdirSync(outputDir)
    };
  }

  /**
   * Log message if verbose
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[AutoValidator] ${message}`);
    }
  }
}

module.exports = AutoValidator;
