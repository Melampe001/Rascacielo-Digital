/**
 * Build Script - Production Build Orchestrator
 * 
 * Usage: node build.js
 * Usage: npm run build
 */

const BuildAgent = require('./agents/build-agent');
const fs = require('fs');
const path = require('path');

async function runBuild() {
  console.log('🔨 RASCACIELOS DIGITAL - BUILD PROCESS');
  console.log('=====================================\n');

  try {
    // Read package.json once for efficiency
    const originalPkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    
    // Configure build agent
    const agent = new BuildAgent({
      outputDir: './dist',
      optimize: true,
      verbose: true
    });

    // Create dist directory
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
      console.log('📁 Directory dist/ created\n');
    } else {
      console.log('🧹 Cleaning existing dist/ directory...\n');
      fs.rmSync('./dist', { recursive: true, force: true });
      fs.mkdirSync('./dist', { recursive: true });
    }

    // Execute build
    console.log('⏳ Starting build process...\n');
    const startTime = Date.now();
    const result = await agent.build({
      source: './'
    });

    // Copy main files
    console.log('\n📋 Copying project files...\n');
    
    const filesToCopy = [
      'index.js',
      'package.json',
      'README.md',
      'LICENSE',
      '.env.example'
    ];

    let copiedFiles = 0;
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join('./dist', file));
        console.log(`   ✓ ${file}`);
        copiedFiles++;
      }
    });

    // Copy directories
    console.log('\n📦 Copying directories...\n');
    
    const dirsToCopy = [
      'agents',
      'modules',
      'config',
      'scripts',
      'docs'
    ];

    let copiedDirs = 0;
    dirsToCopy.forEach(dir => {
      if (fs.existsSync(dir)) {
        copyRecursive(dir, path.join('./dist', dir));
        const fileCount = countFiles(path.join('./dist', dir));
        console.log(`   ✓ ${dir}/ (${fileCount} files)`);
        copiedDirs++;
      }
    });

    // Create build manifest
    console.log('\n📄 Generating build manifest...\n');
    
    const manifest = {
      buildDate: new Date().toISOString(),
      version: originalPkg.version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      buildDuration: Date.now() - startTime,
      artifacts: {
        files: copiedFiles,
        directories: copiedDirs,
        total: copiedFiles + copiedDirs
      },
      projectType: result.projectType,
      agentArtifacts: result.artifacts
    };

    fs.writeFileSync(
      './dist/build-manifest.json',
      JSON.stringify(manifest, null, 2)
    );
    console.log('   ✓ build-manifest.json created');

    // Create production package.json
    const productionPkg = {
      name: originalPkg.name,
      version: originalPkg.version,
      description: originalPkg.description,
      main: originalPkg.main,
      scripts: {
        start: originalPkg.scripts?.start || 'node index.js'
      },
      author: originalPkg.author,
      license: originalPkg.license,
      engines: originalPkg.engines,
      dependencies: originalPkg.dependencies || {}
    };

    fs.writeFileSync(
      './dist/package.json',
      JSON.stringify(productionPkg, null, 2)
    );
    console.log('   ✓ package.json (production) created');

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ BUILD COMPLETED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`\n📊 Build Statistics:`);
    console.log(`   Duration: ${manifest.buildDuration}ms`);
    console.log(`   Files: ${copiedFiles}`);
    console.log(`   Directories: ${copiedDirs}`);
    console.log(`   Output: ${path.resolve('./dist')}`);
    console.log(`   Version: ${manifest.version}`);
    console.log(`   Node: ${manifest.nodeVersion}\n`);

  } catch (error) {
    console.error('\n❌ BUILD FAILED');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

function copyRecursive(src, dest) {
  const excludeDirs = ['node_modules', '.git', 'dist', 'coverage', '__tests__', '.github'];
  const excludeFiles = /\.(test|spec)\.js$/;

  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) continue;
      copyRecursive(srcPath, destPath);
    } else {
      if (excludeFiles.test(entry.name)) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }

  return count;
}

// Execute
if (require.main === module) {
  runBuild()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runBuild };
