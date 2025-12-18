#!/usr/bin/env node

const fs = require('fs');

console.log('⚙️  Configuration Check\n');

const requiredFiles = [
  'package.json',
  'index.js',
  'agents/build-agent.js',
  'agents/security-agent.js',
  'modules/core.js'
];

const checks = [];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  checks.push({
    file,
    status: exists ? 'FOUND' : 'MISSING'
  });
  
  const icon = exists ? '✅' : '❌';
  console.log(`${icon} ${file}`);
});

const allFound = checks.every(c => c.status === 'FOUND');
console.log(`\n${allFound ? '✅ Configuration OK' : '❌ Missing files'}\n`);

process.exit(allFound ? 0 : 1);
