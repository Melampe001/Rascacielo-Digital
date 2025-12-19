/**
 * Validator - Rascacielo Digital
 * Validates code quality and best practices
 */

class Validator {
  constructor(config = {}) {
    this.config = {
      strict: config.strict || false,
      minScore: config.minScore || 70,
      verbose: config.verbose || false,
      ...config
    };
  }

  /**
   * Validate validation results
   * @param {Object} results - Results from agents
   * @returns {Object} Validation summary
   */
  validate(results) {
    const summary = {
      valid: true,
      score: 0,
      grade: 'PENDING',
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      agents: {},
      issues: [],
      recommendations: []
    };

    // Process each agent's results
    for (const [agentName, agentResult] of Object.entries(results)) {
      if (agentResult.error) {
        summary.issues.push({
          agent: agentName,
          type: 'error',
          message: agentResult.error
        });
        continue;
      }

      const agentSummary = this.validateAgentResult(agentName, agentResult);
      summary.agents[agentName] = agentSummary;
      
      summary.totalChecks += agentSummary.totalChecks;
      summary.passedChecks += agentSummary.passedChecks;
      summary.failedChecks += agentSummary.failedChecks;

      if (agentSummary.issues) {
        summary.issues.push(...agentSummary.issues);
      }

      if (agentSummary.recommendations) {
        summary.recommendations.push(...agentSummary.recommendations);
      }
    }

    // Calculate overall score
    if (summary.totalChecks > 0) {
      summary.score = Math.round((summary.passedChecks / summary.totalChecks) * 100);
    }

    summary.grade = this.getGrade(summary.score);
    summary.valid = summary.score >= this.config.minScore;

    return summary;
  }

  /**
   * Validate individual agent result
   */
  validateAgentResult(agentName, result) {
    const summary = {
      agentName,
      totalChecks: 0,
      passedChecks: 0,
      failedChecks: 0,
      score: 0,
      issues: [],
      recommendations: []
    };

    if (result.checks && Array.isArray(result.checks)) {
      summary.totalChecks = result.checks.length;
      summary.passedChecks = result.checks.filter(c => c.passed).length;
      summary.failedChecks = summary.totalChecks - summary.passedChecks;

      // Collect issues
      result.checks.forEach(check => {
        if (!check.passed) {
          summary.issues.push({
            agent: agentName,
            check: check.name,
            message: check.message || 'Check failed',
            severity: check.severity || 'warning'
          });

          if (check.recommendation) {
            summary.recommendations.push({
              agent: agentName,
              check: check.name,
              recommendation: check.recommendation
            });
          }
        }
      });
    }

    if (summary.totalChecks > 0) {
      summary.score = Math.round((summary.passedChecks / summary.totalChecks) * 100);
    }

    return summary;
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
   * Generate detailed report
   */
  generateReport(summary, format = 'text') {
    if (format === 'json') {
      return JSON.stringify(summary, null, 2);
    }

    if (format === 'markdown') {
      return this.generateMarkdownReport(summary);
    }

    return this.generateTextReport(summary);
  }

  /**
   * Generate text report
   */
  generateTextReport(summary) {
    const lines = [];
    
    lines.push('');
    lines.push('🏛️ RASCACIELO DIGITAL - VALIDATION REPORT');
    lines.push('='.repeat(50));
    lines.push('');
    lines.push(`Overall Grade: ${summary.grade} ${this.getGradeEmoji(summary.grade)}`);
    lines.push(`Overall Score: ${summary.score}%`);
    lines.push(`Status: ${summary.valid ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');
    lines.push(`Total Checks: ${summary.totalChecks}`);
    lines.push(`Passed: ${summary.passedChecks} ✅`);
    lines.push(`Failed: ${summary.failedChecks} ❌`);
    lines.push('');

    if (Object.keys(summary.agents).length > 0) {
      lines.push('Agent Results:');
      lines.push('-'.repeat(50));
      for (const [name, agent] of Object.entries(summary.agents)) {
        lines.push(`  ${name}: ${agent.score}% (${agent.passedChecks}/${agent.totalChecks})`);
      }
      lines.push('');
    }

    if (summary.issues.length > 0) {
      lines.push('Issues Found:');
      lines.push('-'.repeat(50));
      summary.issues.slice(0, 10).forEach((issue, i) => {
        lines.push(`  ${i + 1}. [${issue.agent}] ${issue.message}`);
      });
      if (summary.issues.length > 10) {
        lines.push(`  ... and ${summary.issues.length - 10} more`);
      }
      lines.push('');
    }

    if (summary.recommendations.length > 0) {
      lines.push('Recommendations:');
      lines.push('-'.repeat(50));
      summary.recommendations.slice(0, 5).forEach((rec, i) => {
        lines.push(`  ${i + 1}. [${rec.agent}] ${rec.recommendation}`);
      });
      if (summary.recommendations.length > 5) {
        lines.push(`  ... and ${summary.recommendations.length - 5} more`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(summary) {
    const lines = [];
    
    lines.push('# 🏛️ Rascacielo Digital - Validation Report\n');
    lines.push('## Overall Results\n');
    lines.push(`- **Grade:** ${summary.grade} ${this.getGradeEmoji(summary.grade)}`);
    lines.push(`- **Score:** ${summary.score}%`);
    lines.push(`- **Status:** ${summary.valid ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push(`- **Total Checks:** ${summary.totalChecks}`);
    lines.push(`- **Passed:** ${summary.passedChecks} ✅`);
    lines.push(`- **Failed:** ${summary.failedChecks} ❌\n`);

    if (Object.keys(summary.agents).length > 0) {
      lines.push('## Agent Results\n');
      lines.push('| Agent | Score | Passed | Total |');
      lines.push('|-------|-------|--------|-------|');
      for (const [name, agent] of Object.entries(summary.agents)) {
        lines.push(`| ${name} | ${agent.score}% | ${agent.passedChecks} | ${agent.totalChecks} |`);
      }
      lines.push('');
    }

    if (summary.issues.length > 0) {
      lines.push('## Issues Found\n');
      summary.issues.slice(0, 10).forEach((issue, i) => {
        lines.push(`${i + 1}. **[${issue.agent}]** ${issue.message}`);
      });
      if (summary.issues.length > 10) {
        lines.push(`\n*... and ${summary.issues.length - 10} more issues*\n`);
      }
    }

    if (summary.recommendations.length > 0) {
      lines.push('\n## Recommendations\n');
      summary.recommendations.slice(0, 5).forEach((rec, i) => {
        lines.push(`${i + 1}. **[${rec.agent}]** ${rec.recommendation}`);
      });
      if (summary.recommendations.length > 5) {
        lines.push(`\n*... and ${summary.recommendations.length - 5} more recommendations*\n`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Get emoji for grade
   */
  getGradeEmoji(grade) {
    const emojis = {
      PLATINUM: '💎',
      GOLD: '🥇',
      SILVER: '🥈',
      BRONZE: '🥉',
      PENDING: '⏳'
    };
    return emojis[grade] || '⏳';
  }

  /**
   * Log message if verbose
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[Validator] ${message}`);
    }
  }
}

module.exports = Validator;
