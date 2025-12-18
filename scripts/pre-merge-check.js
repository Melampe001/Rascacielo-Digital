#!/usr/bin/env node

/**
 * Pre-merge validation
 * Ensures all components are working before merge
 */

const { execSync } = require('child_process');

console.log('🔍 Running pre-merge validation...\n');

const checks = [
  { name: 'Lint', cmd: 'npm run lint' },
  { name: 'Format Check', cmd: 'npm run format:check' },
  { name: 'Tests', cmd: 'npm test' },
  { name: 'Build', cmd: 'npm run build' }
];

let failed = false;

checks.forEach(({ name, cmd }) => {
  try {
    console.log(`▶ ${name}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${name} passed\n`);
  } catch (error) {
    console.log(`❌ ${name} failed\n`);
    failed = true;
  }
});

if (failed) {
  console.log('❌ Pre-merge validation failed!');
  process.exit(1);
} else {
  console.log('✅ All validations passed! Ready to merge.');
  process.exit(0);
}
