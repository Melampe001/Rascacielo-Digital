/**
 * Idempotent Build System Tests
 */

const IdempotentBuild = require('../build-idempotent');
const fs = require('fs');
const path = require('path');

describe('IdempotentBuild', () => {
  let builder;
  const testDistDir = './test-dist-idempotent';

  beforeEach(() => {
    builder = new IdempotentBuild({ 
      distDir: testDistDir,
      verbose: false 
    });
    
    // Clean test directory before each test
    if (fs.existsSync(testDistDir)) {
      fs.rmSync(testDistDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(testDistDir)) {
      fs.rmSync(testDistDir, { recursive: true, force: true });
    }
  });

  test('should create builder with config', () => {
    expect(builder.distDir).toBe(testDistDir);
    expect(builder.verbose).toBe(false);
    expect(builder.checksumFile).toBe(path.join(testDistDir, '.build-checksum'));
    expect(builder.manifestFile).toBe(path.join(testDistDir, 'build-manifest.json'));
  });

  test('should calculate project checksum', () => {
    const checksum = builder.calculateProjectChecksum();
    expect(checksum).toBeDefined();
    expect(typeof checksum).toBe('string');
    expect(checksum.length).toBe(64); // SHA256 hex length
  });

  test('should calculate same checksum on consecutive runs', () => {
    const checksum1 = builder.calculateProjectChecksum();
    const checksum2 = builder.calculateProjectChecksum();
    expect(checksum1).toBe(checksum2);
  });

  test('should get source files from directory', () => {
    const files = builder.getSourceFiles('agents');
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    
    // Should only include .js files, not .test.js
    files.forEach(file => {
      expect(file.endsWith('.js')).toBe(true);
      expect(file.includes('.test.')).toBe(false);
    });
  });

  test('should return empty array for non-existent directory', () => {
    const files = builder.getSourceFiles('non-existent-dir');
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBe(0);
  });

  test('should detect rebuild needed on first build', () => {
    const checksum = builder.calculateProjectChecksum();
    const needsRebuild = builder.needsRebuild(checksum);
    expect(needsRebuild).toBe(true);
  });

  test('should detect rebuild not needed when checksum matches', async () => {
    // First build
    await builder.build();
    
    // Check if rebuild needed (should be false)
    const checksum = builder.calculateProjectChecksum();
    const needsRebuild = builder.needsRebuild(checksum);
    expect(needsRebuild).toBe(false);
  });

  test('should clean dist directory', () => {
    // Create dist directory with some files
    fs.mkdirSync(testDistDir, { recursive: true });
    fs.writeFileSync(path.join(testDistDir, 'test.txt'), 'test');
    
    builder.cleanDist();
    
    expect(fs.existsSync(testDistDir)).toBe(true);
    expect(fs.existsSync(path.join(testDistDir, 'test.txt'))).toBe(false);
  });

  test('should count files in directory', () => {
    const count = builder.countFiles('agents');
    expect(count).toBeGreaterThan(0);
  });

  test('should return 0 for non-existent directory count', () => {
    const count = builder.countFiles('non-existent-dir');
    expect(count).toBe(0);
  });

  test('should perform initial build successfully', async () => {
    const result = await builder.build();
    
    expect(result.skipped).toBeUndefined();
    expect(result.buildDate).toBeDefined();
    expect(result.checksum).toBeDefined();
    expect(result.duration).toBeDefined();
    expect(result.files).toBeGreaterThan(0);
    expect(result.directories).toBeGreaterThan(0);
    expect(result.nodeVersion).toBeDefined();
    expect(result.platform).toBeDefined();
    
    // Check that manifest and checksum files were created
    expect(fs.existsSync(builder.manifestFile)).toBe(true);
    expect(fs.existsSync(builder.checksumFile)).toBe(true);
  });

  test('should skip build when no changes detected', async () => {
    // First build
    await builder.build();
    
    // Second build should skip
    const result = await builder.build();
    expect(result.skipped).toBe(true);
    expect(result.checksum).toBeDefined();
  });

  test('should force rebuild even when no changes', async () => {
    // First build
    await builder.build();
    
    // Force rebuild
    const result = await builder.build(true);
    expect(result.skipped).toBeUndefined();
    expect(result.buildDate).toBeDefined();
  });

  test('should create idempotent builds', async () => {
    // First build
    const result1 = await builder.build();
    const checksum1 = result1.checksum;
    
    // Second build (force)
    const result2 = await builder.build(true);
    const checksum2 = result2.checksum;
    
    // Checksums should be identical
    expect(checksum1).toBe(checksum2);
  });

  test('should copy files with preserved timestamps', async () => {
    await builder.build();
    
    const sourceFile = 'package.json';
    const destFile = path.join(testDistDir, sourceFile);
    
    expect(fs.existsSync(destFile)).toBe(true);
    
    const sourceStats = fs.statSync(sourceFile);
    const destStats = fs.statSync(destFile);
    
    expect(destStats.mtime.getTime()).toBe(sourceStats.mtime.getTime());
  });

  test('should exclude test files from build', async () => {
    await builder.build();
    
    // Check that test files are not copied
    const testFilesExist = fs.existsSync(path.join(testDistDir, 'agents', '__tests__'));
    expect(testFilesExist).toBe(false);
  });

  test('should create build manifest with correct structure', async () => {
    await builder.build();
    
    const manifest = JSON.parse(fs.readFileSync(builder.manifestFile, 'utf-8'));
    
    expect(manifest.buildDate).toBeDefined();
    expect(manifest.checksum).toBeDefined();
    expect(manifest.duration).toBeDefined();
    expect(manifest.files).toBeDefined();
    expect(manifest.directories).toBeDefined();
    expect(manifest.nodeVersion).toBeDefined();
    expect(manifest.platform).toBeDefined();
  });

  test('should log messages based on verbose setting', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Non-verbose mode - info messages should not be logged
    builder.verbose = false;
    builder.log('info', 'Test info');
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Test info'));
    
    // Success messages should always be logged
    builder.log('success', 'Test success');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test success'));
    
    consoleSpy.mockRestore();
  });
});
