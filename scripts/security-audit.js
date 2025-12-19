#!/usr/bin/env node

/**
 * Security Audit Script
 * Auditoría de seguridad complementaria
 */

const SecurityAgent = require('../agents/security-agent');

async function runAudit() {
  console.log('🔒 RASCACIELO DIGITAL - SECURITY AUDIT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const agent = new SecurityAgent({
    level: 'strict',
    failOnHigh: false,
    scanDependencies: true,
    scanCode: true
  });

  try {
    const results = await agent.scan({ target: '.' });

    const report = await agent.generateReport(results, 'text');
    console.log(report);

    if (results.summary.critical > 0 || results.summary.high > 0) {
      console.log('\n⚠️  Se encontraron vulnerabilidades que requieren atención.');
      process.exit(1);
    } else {
      console.log('\n✅ No se encontraron vulnerabilidades críticas o altas.');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Error durante la auditoría:', error.message);
    process.exit(1);
  }
}

runAudit();
