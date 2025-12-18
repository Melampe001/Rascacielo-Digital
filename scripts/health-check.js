#!/usr/bin/env node

const BuildAgent = require('../agents/build-agent');
const SecurityAgent = require('../agents/security-agent');
const { Logger } = require('../modules/core');

const logger = new Logger('HealthCheck');

async function healthCheck() {
  console.log('🏥 HEALTH CHECK\n');

  const checks = [];

  // Node version
  const nodeVersion = process.version;
  const requiredNode = 'v18.0.0';
  checks.push({
    name: 'Node.js Version',
    status: nodeVersion >= requiredNode ? 'PASS' : 'FAIL',
    details: `${nodeVersion} (required: ${requiredNode}+)`
  });

  // Build Agent
  try {
    const buildAgent = new BuildAgent();
    await buildAgent.validate({});
    checks.push({ name: 'Build Agent', status: 'PASS', details: 'Initialized' });
  } catch (error) {
    checks.push({ name: 'Build Agent', status: 'FAIL', details: error.message });
  }

  // Security Agent
  try {
    const securityAgent = new SecurityAgent();
    checks.push({ name: 'Security Agent', status: 'PASS', details: 'Initialized' });
  } catch (error) {
    checks.push({ name: 'Security Agent', status: 'FAIL', details: error.message });
  }

  // Display results
  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${check.details}`);
  });

  const allPassed = checks.every(c => c.status === 'PASS');
  console.log(`\n${allPassed ? '✅ All checks passed' : '❌ Some checks failed'}\n`);

  process.exit(allPassed ? 0 : 1);
}

healthCheck().catch(error => {
  console.error('Health check error:', error);
  process.exit(1);
});
