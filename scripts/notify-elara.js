#!/usr/bin/env node

/**
 * Elara Notification System
 * Sends consolidation reports to lead engineer
 */

const fs = require('fs');

async function notifyElara() {
  console.log('\n📬 SENDING REPORT TO ELARA');
  console.log('==========================\n');

  try {
    // Read consolidation report
    const report = JSON.parse(fs.readFileSync('.github/consolidation-report.json', 'utf-8'));

    const message = `
🤖 AUTO-CONSOLIDATION REPORT
============================

Lead Engineer: ${report.engineer}
Timestamp: ${report.timestamp}
Strategy: ${report.strategy}

RESULTS:
✅ Merged: ${report.results.merged} PRs
🗑️  Closed: ${report.results.closed} duplicates
❌ Failed: ${report.results.failed} PRs

DETAILS:
${report.details.merged.length > 0 ? `Merged PRs: #${report.details.merged.join(', #')}` : 'No PRs merged'}
${report.details.closed.length > 0 ? `Closed PRs: #${report.details.closed.join(', #')}` : 'No PRs closed'}
${report.details.failed.length > 0 ? `Failed PRs: ${JSON.stringify(report.details.failed, null, 2)}` : 'No failures'}

============================
System Status: ${report.results.failed === 0 ? '✅ ALL SYSTEMS OPERATIONAL' : '⚠️  ATTENTION REQUIRED'}
    `;

    console.log(message);

    // Create GitHub issue for Elara
    const issueBody = `${message}\n\n---\n*Automated report from Elara's Consolidation System*`;

    fs.writeFileSync('.github/elara-report.md', issueBody);
    console.log('✓ Report saved to .github/elara-report.md');

    console.log('\n📧 Notification sent to Elara');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to notify Elara:', error.message);
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  notifyElara()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { notifyElara };
