#!/usr/bin/env node

/**
 * Validation Script - Pre-commit validation
 */

const { execSync } = require('child_process');

console.log('\x1b[34m🔍 Starting validation process...\x1b[0m\n');

const checks = [
  {
    name: 'ESLint',
    command: 'npm run lint',
    icon: '📝'
  },
  {
    name: 'Prettier',
    command: 'npm run format:check',
    icon: '✨'
  },
  {
    name: 'Tests',
    command: 'npm test',
    icon: '🧪'
  }
];

let failed = false;

checks.forEach(check => {
  try {
    console.log(`\x1b[33m${check.icon} Running ${check.name}...\x1b[0m`);
    execSync(check.command, { stdio: 'inherit' });
    console.log(`\x1b[32m✅ ${check.name} passed\x1b[0m\n`);
  } catch (error) {
    console.log(`\x1b[31m❌ ${check.name} failed\x1b[0m\n`);
    failed = true;
  }
});

if (failed) {
  console.log('\x1b[31m\n❌ Validation failed! Fix errors before committing.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m\n✅ All validations passed! Ready to commit.\x1b[0m\n');
  process.exit(0);
}
