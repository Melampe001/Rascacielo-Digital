#!/usr/bin/env node

/**
 * Standalone Build Script - Rascacielos Digital
 * Production build with validation and manifest generation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class BuildScript {
  constructor() {
    this.distDir = path.join(__dirname, 'dist');
    this.sourceDir = __dirname;
    this.manifest = {
      version: '1.0.0',
      buildTime: new Date().toISOString(),
      files: []
    };
  }

  /**
   * Run the build process
   */
  async build() {
    try {
      console.log('🏗️  Starting production build...\n');

      // Clean dist directory
      await this.clean();

      // Copy source files
      await this.copySourceFiles();

      // Generate manifest
      await this.generateManifest();

      // Generate production package.json
      await this.generateProductionPackageJson();

      console.log('\n✅ Build completed successfully!');
      console.log(`📦 Build artifacts in: ${this.distDir}`);

    } catch (error) {
      console.error('\n❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Clean dist directory
   */
  async clean() {
    console.log('🧹 Cleaning dist directory...');
    
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(this.distDir, { recursive: true });
    console.log('   ✓ Dist directory cleaned');
  }

  /**
   * Copy source files with filters
   */
  async copySourceFiles() {
    console.log('\n📋 Copying source files...');

    const filesToCopy = [
      'index.js',
      'package.json',
      'agents',
      'modules',
      'config',
      'docs',
      'public'
    ];

    const excludePatterns = [
      '__tests__',
      '*.test.js',
      '*.spec.js',
      'node_modules',
      '.git',
      'coverage',
      'dist'
    ];

    for (const item of filesToCopy) {
      const sourcePath = path.join(this.sourceDir, item);
      const destPath = path.join(this.distDir, item);

      if (!fs.existsSync(sourcePath)) {
        console.log(`   ⚠ Skipping ${item} (not found)`);
        continue;
      }

      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        this.copyDirectory(sourcePath, destPath, excludePatterns);
      } else {
        this.copyFile(sourcePath, destPath);
      }
    }

    console.log('   ✓ Source files copied');
  }

  /**
   * Copy directory recursively
   */
  copyDirectory(source, dest, excludePatterns = []) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(source);

    for (const item of items) {
      // Check if item should be excluded
      if (excludePatterns.some(pattern => item.includes(pattern))) {
        continue;
      }

      const sourcePath = path.join(source, item);
      const destPath = path.join(dest, item);
      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        this.copyDirectory(sourcePath, destPath, excludePatterns);
      } else {
        this.copyFile(sourcePath, destPath);
      }
    }
  }

  /**
   * Copy single file
   */
  copyFile(source, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(source, dest);

    // Calculate checksum
    const content = fs.readFileSync(dest);
    const checksum = crypto.createHash('sha256').update(content).digest('hex');

    // Add to manifest
    const relativePath = path.relative(this.distDir, dest);
    this.manifest.files.push({
      path: relativePath,
      size: content.length,
      checksum
    });
  }

  /**
   * Generate build manifest
   */
  async generateManifest() {
    console.log('\n📝 Generating build manifest...');

    const manifestPath = path.join(this.distDir, 'build-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));

    console.log('   ✓ Manifest generated');
    console.log(`   Files: ${this.manifest.files.length}`);
  }

  /**
   * Generate production package.json
   */
  async generateProductionPackageJson() {
    console.log('\n📦 Generating production package.json...');

    const sourcePackageJson = JSON.parse(
      fs.readFileSync(path.join(this.sourceDir, 'package.json'), 'utf-8')
    );

    const prodPackageJson = {
      name: sourcePackageJson.name,
      version: sourcePackageJson.version,
      description: sourcePackageJson.description,
      main: sourcePackageJson.main,
      scripts: {
        start: sourcePackageJson.scripts.start
      },
      keywords: sourcePackageJson.keywords,
      author: sourcePackageJson.author,
      license: sourcePackageJson.license,
      engines: sourcePackageJson.engines,
      dependencies: sourcePackageJson.dependencies || {}
    };

    fs.writeFileSync(
      path.join(this.distDir, 'package.json'),
      JSON.stringify(prodPackageJson, null, 2)
    );

    console.log('   ✓ Production package.json generated');
  }
}

// Run build if executed directly
if (require.main === module) {
  const builder = new BuildScript();
  builder.build();
}

module.exports = BuildScript;
