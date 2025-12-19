/**
 * Reporter - Rascacielo Digital
 * Generates comprehensive validation reports
 */

const fs = require('fs');
const path = require('path');

class Reporter {
  constructor(config = {}) {
    this.config = {
      format: config.format || 'text',
      outputDir: config.outputDir || './reports',
      verbose: config.verbose || false,
      ...config
    };
  }

  /**
   * Generate report from validation results
   * @param {Object} summary - Validation summary
   * @param {string} format - Report format (text|json|markdown|html)
   * @returns {string} Generated report
   */
  generate(summary, format = null) {
    const reportFormat = format || this.config.format;

    switch (reportFormat) {
    case 'json':
      return this.generateJSON(summary);
    case 'markdown':
      return this.generateMarkdown(summary);
    case 'html':
      return this.generateHTML(summary);
    case 'text':
    default:
      return this.generateText(summary);
    }
  }

  /**
   * Generate JSON report
   */
  generateJSON(summary) {
    return JSON.stringify({
      ...summary,
      generatedAt: new Date().toISOString(),
      reportVersion: '1.0.0'
    }, null, 2);
  }

  /**
   * Generate text report
   */
  generateText(summary) {
    const lines = [];
    const separator = '='.repeat(60);
    
    lines.push('');
    lines.push(separator);
    lines.push('🏛️  RASCACIELO DIGITAL - VALIDATION REPORT');
    lines.push(separator);
    lines.push('');
    
    // Overall results
    lines.push('OVERALL RESULTS');
    lines.push('-'.repeat(60));
    lines.push(`Grade:        ${summary.grade} ${this.getGradeEmoji(summary.grade)}`);
    lines.push(`Score:        ${summary.score}%`);
    lines.push(`Status:       ${summary.valid ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push(`Total Checks: ${summary.totalChecks}`);
    lines.push(`Passed:       ${summary.passedChecks} ✅`);
    lines.push(`Failed:       ${summary.failedChecks} ❌`);
    lines.push('');

    // Agent results
    if (Object.keys(summary.agents || {}).length > 0) {
      lines.push('AGENT RESULTS');
      lines.push('-'.repeat(60));
      
      for (const [name, agent] of Object.entries(summary.agents)) {
        const status = agent.score >= 70 ? '✅' : '❌';
        lines.push(`${status} ${name.padEnd(30)} ${agent.score}%  (${agent.passedChecks}/${agent.totalChecks})`);
      }
      lines.push('');
    }

    // Issues
    if (summary.issues && summary.issues.length > 0) {
      lines.push('ISSUES FOUND');
      lines.push('-'.repeat(60));
      
      const topIssues = summary.issues.slice(0, 15);
      topIssues.forEach((issue, i) => {
        const severity = issue.severity || 'warning';
        const icon = severity === 'error' ? '🔴' : severity === 'warning' ? '🟡' : '🔵';
        lines.push(`${icon} ${i + 1}. [${issue.agent}] ${issue.message}`);
      });
      
      if (summary.issues.length > 15) {
        lines.push(`\n... and ${summary.issues.length - 15} more issues`);
      }
      lines.push('');
    }

    // Recommendations
    if (summary.recommendations && summary.recommendations.length > 0) {
      lines.push('RECOMMENDATIONS');
      lines.push('-'.repeat(60));
      
      const topRecs = summary.recommendations.slice(0, 10);
      topRecs.forEach((rec, i) => {
        lines.push(`💡 ${i + 1}. [${rec.agent}] ${rec.recommendation}`);
      });
      
      if (summary.recommendations.length > 10) {
        lines.push(`\n... and ${summary.recommendations.length - 10} more recommendations`);
      }
      lines.push('');
    }

    lines.push(separator);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(separator);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Generate Markdown report
   */
  generateMarkdown(summary) {
    const lines = [];
    
    lines.push('# 🏛️ Rascacielo Digital - Validation Report\n');
    lines.push(`*Generated: ${new Date().toISOString()}*\n`);
    
    lines.push('## 📊 Overall Results\n');
    lines.push(`| Metric | Value |`);
    lines.push(`|--------|-------|`);
    lines.push(`| **Grade** | ${summary.grade} ${this.getGradeEmoji(summary.grade)} |`);
    lines.push(`| **Score** | ${summary.score}% |`);
    lines.push(`| **Status** | ${summary.valid ? '✅ PASSED' : '❌ FAILED'} |`);
    lines.push(`| **Total Checks** | ${summary.totalChecks} |`);
    lines.push(`| **Passed** | ${summary.passedChecks} ✅ |`);
    lines.push(`| **Failed** | ${summary.failedChecks} ❌ |`);
    lines.push('');

    // Agent results
    if (Object.keys(summary.agents || {}).length > 0) {
      lines.push('## 🤖 Agent Results\n');
      lines.push('| Agent | Score | Status | Passed | Total |');
      lines.push('|-------|-------|--------|--------|-------|');
      
      for (const [name, agent] of Object.entries(summary.agents)) {
        const status = agent.score >= 70 ? '✅' : '❌';
        lines.push(`| ${name} | ${agent.score}% | ${status} | ${agent.passedChecks} | ${agent.totalChecks} |`);
      }
      lines.push('');
    }

    // Issues
    if (summary.issues && summary.issues.length > 0) {
      lines.push('## ⚠️ Issues Found\n');
      
      const topIssues = summary.issues.slice(0, 20);
      topIssues.forEach((issue, i) => {
        const severity = issue.severity || 'warning';
        const icon = severity === 'error' ? '🔴' : severity === 'warning' ? '🟡' : '🔵';
        lines.push(`${i + 1}. ${icon} **[${issue.agent}]** ${issue.message}`);
      });
      
      if (summary.issues.length > 20) {
        lines.push(`\n*... and ${summary.issues.length - 20} more issues*`);
      }
      lines.push('');
    }

    // Recommendations
    if (summary.recommendations && summary.recommendations.length > 0) {
      lines.push('## 💡 Recommendations\n');
      
      const topRecs = summary.recommendations.slice(0, 15);
      topRecs.forEach((rec, i) => {
        lines.push(`${i + 1}. **[${rec.agent}]** ${rec.recommendation}`);
      });
      
      if (summary.recommendations.length > 15) {
        lines.push(`\n*... and ${summary.recommendations.length - 15} more recommendations*`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('\n*Report generated by Rascacielo Digital Masters System v2.0.0*\n');

    return lines.join('\n');
  }

  /**
   * Generate HTML report
   */
  generateHTML(summary) {
    const gradeColor = this.getGradeColor(summary.grade);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rascacielo Digital - Validation Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px 10px 0 0; }
        .header h1 { font-size: 32px; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .content { padding: 40px; }
        .grade-badge { display: inline-block; background: ${gradeColor}; color: white; padding: 10px 30px; border-radius: 25px; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        .metric-label { color: #666; font-size: 14px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #333; }
        .section { margin: 40px 0; }
        .section h2 { color: #333; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; color: #333; }
        .status-pass { color: #10b981; }
        .status-fail { color: #ef4444; }
        .issue { padding: 15px; margin: 10px 0; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; }
        .issue.error { background: #fee2e2; border-left-color: #ef4444; }
        .recommendation { padding: 15px; margin: 10px 0; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; }
        .footer { padding: 20px 40px; background: #f8f9fa; border-radius: 0 0 10px 10px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Rascacielo Digital</h1>
            <p>Validation Report - ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="content">
            <div class="grade-badge">${summary.grade} ${this.getGradeEmoji(summary.grade)} - ${summary.score}%</div>
            
            <div style="margin: 30px 0;">
                <div class="metric">
                    <div class="metric-label">Status</div>
                    <div class="metric-value ${summary.valid ? 'status-pass' : 'status-fail'}">
                        ${summary.valid ? '✅ PASSED' : '❌ FAILED'}
                    </div>
                </div>
                <div class="metric">
                    <div class="metric-label">Total Checks</div>
                    <div class="metric-value">${summary.totalChecks}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Passed</div>
                    <div class="metric-value status-pass">${summary.passedChecks}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Failed</div>
                    <div class="metric-value status-fail">${summary.failedChecks}</div>
                </div>
            </div>

            ${this.generateAgentTableHTML(summary.agents)}
            ${this.generateIssuesHTML(summary.issues)}
            ${this.generateRecommendationsHTML(summary.recommendations)}
        </div>
        
        <div class="footer">
            <p>Report generated by Rascacielo Digital Masters System v2.0.0</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateAgentTableHTML(agents) {
    if (!agents || Object.keys(agents).length === 0) return '';

    let html = '<div class="section"><h2>🤖 Agent Results</h2><table><thead><tr>';
    html += '<th>Agent</th><th>Score</th><th>Status</th><th>Passed</th><th>Total</th></tr></thead><tbody>';

    for (const [name, agent] of Object.entries(agents)) {
      const status = agent.score >= 70 ? 'status-pass' : 'status-fail';
      const icon = agent.score >= 70 ? '✅' : '❌';
      html += `<tr><td>${name}</td><td>${agent.score}%</td><td class="${status}">${icon}</td>`;
      html += `<td>${agent.passedChecks}</td><td>${agent.totalChecks}</td></tr>`;
    }

    html += '</tbody></table></div>';
    return html;
  }

  generateIssuesHTML(issues) {
    if (!issues || issues.length === 0) return '';

    let html = '<div class="section"><h2>⚠️ Issues Found</h2>';
    
    const topIssues = issues.slice(0, 20);
    topIssues.forEach(issue => {
      const cls = issue.severity === 'error' ? 'error' : '';
      html += `<div class="issue ${cls}"><strong>[${issue.agent}]</strong> ${issue.message}</div>`;
    });

    if (issues.length > 20) {
      html += `<p style="margin-top: 20px; color: #666;">... and ${issues.length - 20} more issues</p>`;
    }

    html += '</div>';
    return html;
  }

  generateRecommendationsHTML(recommendations) {
    if (!recommendations || recommendations.length === 0) return '';

    let html = '<div class="section"><h2>💡 Recommendations</h2>';
    
    const topRecs = recommendations.slice(0, 15);
    topRecs.forEach(rec => {
      html += `<div class="recommendation"><strong>[${rec.agent}]</strong> ${rec.recommendation}</div>`;
    });

    if (recommendations.length > 15) {
      html += `<p style="margin-top: 20px; color: #666;">... and ${recommendations.length - 15} more recommendations</p>`;
    }

    html += '</div>';
    return html;
  }

  /**
   * Save report to file
   */
  async save(summary, filename = null, format = null) {
    const reportFormat = format || this.config.format;
    const ext = this.getExtension(reportFormat);
    const name = filename || `report-${Date.now()}.${ext}`;
    const outputPath = path.join(this.config.outputDir, name);

    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    const content = this.generate(summary, reportFormat);
    await fs.promises.writeFile(outputPath, content, 'utf8');

    this.log(`Report saved to: ${outputPath}`);
    return outputPath;
  }

  /**
   * Get file extension for format
   */
  getExtension(format) {
    const extensions = {
      json: 'json',
      markdown: 'md',
      html: 'html',
      text: 'txt'
    };
    return extensions[format] || 'txt';
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
   * Get color for grade
   */
  getGradeColor(grade) {
    const colors = {
      PLATINUM: '#9333ea',
      GOLD: '#fbbf24',
      SILVER: '#d1d5db',
      BRONZE: '#f97316',
      PENDING: '#6b7280'
    };
    return colors[grade] || colors.PENDING;
  }

  /**
   * Log message if verbose
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[Reporter] ${message}`);
    }
  }
}

module.exports = Reporter;
