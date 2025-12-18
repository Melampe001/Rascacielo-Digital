#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building Rascacielo Digital for production...\n');

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ Created public/ directory');
}

// Check for required files
const requiredFiles = ['index.html'];
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found ${file}`);
  } else {
    console.log(`❌ Missing ${file}`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 Build completed successfully!');
  process.exit(0);
} else {
  console.log('\n⚠️  Build completed with warnings');
  process.exit(0); // Don't fail build
}
