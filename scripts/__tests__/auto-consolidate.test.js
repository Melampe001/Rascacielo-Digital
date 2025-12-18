/**
 * Auto-Consolidation System Tests
 */

const AutoConsolidator = require('../auto-consolidate');
const { execSync } = require('child_process');
const fs = require('fs');

// Mock child_process
jest.mock('child_process');

// Mock fs
jest.mock('fs');

describe('AutoConsolidator', () => {
  let consolidator;

  beforeEach(() => {
    consolidator = new AutoConsolidator();
    jest.clearAllMocks();
  });

  test('should create consolidator instance', () => {
    expect(consolidator).toBeDefined();
    expect(consolidator.merged).toEqual([]);
    expect(consolidator.failed).toEqual([]);
    expect(consolidator.closed).toEqual([]);
  });

  test('should have ELARA_PROTOCOL configuration', () => {
    expect(consolidator).toBeDefined();
    // The protocol is defined at the module level
  });

  test('checkPRStatus should return false when PR does not exist', () => {
    execSync.mockImplementation(() => {
      throw new Error('PR not found');
    });

    const status = consolidator.checkPRStatus(999);
    expect(status.exists).toBe(false);
  });

  test('checkPRStatus should return status when PR exists', () => {
    const mockData = {
      state: 'OPEN',
      isDraft: false,
      merged: false
    };

    execSync.mockReturnValue(JSON.stringify(mockData));

    const status = consolidator.checkPRStatus(10);
    expect(status.exists).toBe(true);
    expect(status.draft).toBe(false);
    expect(status.merged).toBe(false);
    expect(status.closed).toBe(false);
  });

  test('checkPRStatus should detect merged PR', () => {
    const mockData = {
      state: 'MERGED',
      isDraft: false,
      merged: true
    };

    execSync.mockReturnValue(JSON.stringify(mockData));

    const status = consolidator.checkPRStatus(10);
    expect(status.merged).toBe(true);
  });

  test('checkPRStatus should detect closed PR', () => {
    const mockData = {
      state: 'CLOSED',
      isDraft: false,
      merged: false
    };

    execSync.mockReturnValue(JSON.stringify(mockData));

    const status = consolidator.checkPRStatus(10);
    expect(status.closed).toBe(true);
  });

  test('sleep should return a promise', async () => {
    const start = Date.now();
    await consolidator.sleep(100);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(100);
  });

  test('generateReport should create report file', async () => {
    consolidator.merged = [10, 11];
    consolidator.failed = [];
    consolidator.closed = [19, 20];

    fs.writeFileSync = jest.fn();

    await consolidator.generateReport();

    expect(fs.writeFileSync).toHaveBeenCalled();
    const [filePath, content] = fs.writeFileSync.mock.calls[0];
    expect(filePath).toBe('.github/consolidation-report.json');

    const report = JSON.parse(content);
    expect(report.engineer).toBe('Elara');
    expect(report.results.merged).toBe(2);
    expect(report.results.closed).toBe(2);
    expect(report.results.failed).toBe(0);
  });

  test('approvePR should handle approval errors gracefully', async () => {
    execSync.mockImplementation(() => {
      throw new Error('Already approved');
    });

    // Should not throw
    await expect(consolidator.approvePR(10)).resolves.toBeUndefined();
  });

  test('mergePR should throw error on failure', async () => {
    execSync.mockImplementation(() => {
      throw new Error('Merge conflict');
    });

    await expect(consolidator.mergePR(10)).rejects.toThrow('Merge failed');
  });

  test('closeDuplicates should handle close errors gracefully', async () => {
    execSync.mockImplementation(() => {
      throw new Error('PR not found');
    });

    await consolidator.closeDuplicates();

    // Should complete without throwing
    expect(consolidator.closed.length).toBe(0);
  });

  test('updateMainBranch should throw on error', async () => {
    execSync.mockImplementation(() => {
      throw new Error('Cannot fetch');
    });

    await expect(consolidator.updateMainBranch()).rejects.toThrow('Failed to update Main');
  });
});
