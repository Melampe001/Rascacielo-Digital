/**
 * Elara Notification System Tests
 */

const { notifyElara } = require('../notify-elara');
const fs = require('fs');

// Mock fs
jest.mock('fs');

describe('notifyElara', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should notify Elara with valid report', async () => {
    const mockReport = {
      timestamp: '2023-12-18T10:00:00.000Z',
      engineer: 'Elara',
      strategy: 'AUTOMATED',
      results: {
        closed: 2,
        merged: 5,
        failed: 0
      },
      details: {
        closed: [19, 20],
        merged: [10, 11, 12, 13, 14],
        failed: []
      }
    };

    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockReport));
    fs.writeFileSync = jest.fn();

    const result = await notifyElara();

    expect(result.success).toBe(true);
    expect(fs.readFileSync).toHaveBeenCalledWith('.github/consolidation-report.json', 'utf-8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '.github/elara-report.md',
      expect.stringContaining('AUTO-CONSOLIDATION REPORT')
    );
  });

  test('should handle successful consolidation with no failures', async () => {
    const mockReport = {
      timestamp: '2023-12-18T10:00:00.000Z',
      engineer: 'Elara',
      strategy: 'AUTOMATED',
      results: {
        closed: 1,
        merged: 3,
        failed: 0
      },
      details: {
        closed: [19],
        merged: [10, 11, 12],
        failed: []
      }
    };

    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockReport));
    fs.writeFileSync = jest.fn();

    const result = await notifyElara();

    expect(result.success).toBe(true);
    const writtenContent = fs.writeFileSync.mock.calls[0][1];
    expect(writtenContent).toContain('ALL SYSTEMS OPERATIONAL');
    expect(writtenContent).toContain('Merged PRs: #10, #11, #12');
    expect(writtenContent).toContain('No failures');
  });

  test('should handle consolidation with failures', async () => {
    const mockReport = {
      timestamp: '2023-12-18T10:00:00.000Z',
      engineer: 'Elara',
      strategy: 'AUTOMATED',
      results: {
        closed: 0,
        merged: 2,
        failed: 1
      },
      details: {
        closed: [],
        merged: [10, 11],
        failed: [{ pr: 12, error: 'Merge conflict' }]
      }
    };

    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockReport));
    fs.writeFileSync = jest.fn();

    const result = await notifyElara();

    expect(result.success).toBe(true);
    const writtenContent = fs.writeFileSync.mock.calls[0][1];
    expect(writtenContent).toContain('ATTENTION REQUIRED');
    expect(writtenContent).toContain('Failed PRs:');
  });

  test('should handle missing report file', async () => {
    fs.readFileSync = jest.fn().mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    const result = await notifyElara();

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should handle invalid JSON in report', async () => {
    fs.readFileSync = jest.fn().mockReturnValue('invalid json');

    const result = await notifyElara();

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should include all report sections', async () => {
    const mockReport = {
      timestamp: '2023-12-18T10:00:00.000Z',
      engineer: 'Elara',
      strategy: 'AUTOMATED',
      results: {
        closed: 2,
        merged: 4,
        failed: 1
      },
      details: {
        closed: [19, 20],
        merged: [10, 11, 13, 14],
        failed: [{ pr: 12, error: 'Test failure' }]
      }
    };

    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockReport));
    fs.writeFileSync = jest.fn();

    await notifyElara();

    const writtenContent = fs.writeFileSync.mock.calls[0][1];
    expect(writtenContent).toContain('Lead Engineer: Elara');
    expect(writtenContent).toContain('Strategy: AUTOMATED');
    expect(writtenContent).toContain('Merged: 4 PRs');
    expect(writtenContent).toContain('Closed: 2 duplicates');
    expect(writtenContent).toContain('Failed: 1 PRs');
    expect(writtenContent).toContain('Merged PRs: #10, #11, #13, #14');
    expect(writtenContent).toContain('Closed PRs: #19, #20');
  });
});
