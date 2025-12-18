/**
 * Idempotent Build System - Rascacielos Digital
 * Uses SHA256 checksums to detect changes and skip unnecessary builds
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class IdempotentBuild {
  constructor(options = {}) {
    this.distDir = options.distDir || './dist';
    this.checksumFile = path.join(this.distDir, '.build-checksum');
    this.manifestFile = path.join(this.distDir, 'build-manifest.json');
    this.verbose = options.verbose || false;
  }

  calculateProjectChecksum() {
    const hash = crypto.createHash('sha256');
    
    const filesToHash = [
      'package.json',
      'index.js',
      ...this.getSourceFiles('agents'),
      ...this.getSourceFiles('modules'),
      ...this.getSourceFiles('config'),
      ...this.getSourceFiles('scripts')
    ];

    filesToHash.sort();

    filesToHash.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file);
        hash.update(file);
        hash.update(content);
      }
    });

    return hash.digest('hex');
  }

  getSourceFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getSourceFiles(fullPath));
      } else if (entry.name.endsWith('.js') && !entry.name.includes('.test.')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  needsRebuild(currentChecksum) {
    if (!fs.existsSync(this.checksumFile)) {
      this.log('info', 'No previous build found, initial build required');
      return true;
    }

    if (!fs.existsSync(this.manifestFile)) {
      this.log('warn', 'Manifest not found, rebuild required');
      return true;
    }

    try {
      const previousChecksum = fs.readFileSync(this.checksumFile, 'utf-8').trim();
      
      if (previousChecksum === currentChecksum) {
        this.log('success', 'Checksums match - Build NOT needed');
        this.log('info', `Checksum: ${currentChecksum.substring(0, 16)}...`);
        return false;
      } else {
        this.log('warn', 'Checksums differ - Rebuild required');
        this.log('info', `Previous: ${previousChecksum.substring(0, 16)}...`);
        this.log('info', `Current: ${currentChecksum.substring(0, 16)}...`);
        return true;
      }
    } catch (error) {
      this.log('warn', 'Error reading previous checksum, rebuild required');
      return true;
    }
  }

  cleanDist() {
    this.log('info', 'Cleaning output directory...');
    
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
      this.log('success', `Directory ${this.distDir}/ removed`);
    }

    fs.mkdirSync(this.distDir, { recursive: true });
    this.log('success', `Directory ${this.distDir}/ created clean`);
  }

  copyFiles() {
    this.log('info', 'Copying project files...');

    const filesToCopy = [
      'index.js',
      'package.json',
      'README.md',
      'LICENSE',
      '.env.example'
    ].sort();

    let copied = 0;
    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        const destPath = path.join(this.distDir, file);
        fs.copyFileSync(file, destPath);
        
        const stats = fs.statSync(file);
        fs.utimesSync(destPath, stats.atime, stats.mtime);
        
        this.log('success', `✓ ${file}`);
        copied++;
      }
    });

    this.log('info', `Total: ${copied} files copied`);
    return copied;
  }

  copyDirectories() {
    this.log('info', 'Copying directories...');

    const dirsToCopy = ['agents', 'modules', 'config', 'scripts', 'docs'].sort();

    let copied = 0;
    dirsToCopy.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.copyRecursiveIdempotent(dir, path.join(this.distDir, dir));
        const fileCount = this.countFiles(path.join(this.distDir, dir));
        this.log('success', `✓ ${dir}/ (${fileCount} files)`);
        copied++;
      }
    });

    return copied;
  }

  copyRecursiveIdempotent(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'coverage', '__tests__'].includes(entry.name)) {
          continue;
        }
        this.copyRecursiveIdempotent(srcPath, destPath);
      } else {
        if (/\.(test|spec)\.js$/.test(entry.name)) continue;
        
        fs.copyFileSync(srcPath, destPath);
        const stats = fs.statSync(srcPath);
        fs.utimesSync(destPath, stats.atime, stats.mtime);
      }
    }
  }

  countFiles(dir) {
    if (!fs.existsSync(dir)) return 0;
    
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        count += this.countFiles(path.join(dir, entry.name));
      } else {
        count++;
      }
    }

    return count;
  }

  async build(force = false) {
    console.log('🔨 IDEMPOTENT BUILD SYSTEM');
    console.log('='.repeat(50));

    const startTime = Date.now();
    const currentChecksum = this.calculateProjectChecksum();

    if (!force && !this.needsRebuild(currentChecksum)) {
      console.log('\n✅ Build skipped - no changes detected');
      console.log(`⚡ Time saved: ~${Date.now() - startTime}ms\n`);
      return { skipped: true, checksum: currentChecksum };
    }

    this.cleanDist();
    const filesCopied = this.copyFiles();
    const dirsCopied = this.copyDirectories();

    const manifest = {
      buildDate: new Date().toISOString(),
      checksum: currentChecksum,
      duration: Date.now() - startTime,
      files: filesCopied,
      directories: dirsCopied,
      nodeVersion: process.version,
      platform: process.platform
    };

    fs.writeFileSync(this.manifestFile, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(this.checksumFile, currentChecksum);

    console.log('\n✅ Build completed successfully');
    console.log(`⏱️  Duration: ${manifest.duration}ms\n`);

    return manifest;
  }

  log(level, message) {
    if (!this.verbose && level === 'info') return;
    
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m'
    };

    console.log(`${colors[level] || ''}${message}\x1b[0m`);
  }
}

// CLI execution
if (require.main === module) {
  const force = process.argv.includes('--force');
  const verbose = process.argv.includes('--verbose');

  const builder = new IdempotentBuild({ verbose });
  
  builder.build(force)
    .then(_result => {
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    });
}

module.exports = IdempotentBuild;
