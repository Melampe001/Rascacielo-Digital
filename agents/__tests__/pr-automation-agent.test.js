/**
 * PR Automation Agent Tests
 */

const PRAutomationAgent = require('../pr-automation-agent');

// Mock @octokit/rest
jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      pulls: {
        get: jest.fn(),
        update: jest.fn(),
        merge: jest.fn()
      },
      checks: {
        listForRef: jest.fn()
      },
      repos: {
        getCombinedStatusForRef: jest.fn()
      },
      git: {
        deleteRef: jest.fn()
      }
    }))
  };
});

describe('PRAutomationAgent', () => {
  let agent;
  let mockOctokit;

  beforeEach(() => {
    // Set mock token
    process.env.GITHUB_TOKEN = 'test_token';
    
    agent = new PRAutomationAgent({
      owner: 'test-owner',
      repo: 'test-repo'
    });

    mockOctokit = agent.octokit;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create agent with config', () => {
    expect(agent.config.owner).toBe('test-owner');
    expect(agent.config.repo).toBe('test-repo');
    expect(agent.config.mergeMethod).toBe('squash');
    expect(agent.config.deleteBranch).toBe(true);
  });

  test('should throw error if no GITHUB_TOKEN', () => {
    delete process.env.GITHUB_TOKEN;
    
    expect(() => {
      new PRAutomationAgent({ token: null });
    }).toThrow('GITHUB_TOKEN is required');
  });

  test('should get PR info', async () => {
    const mockPRData = {
      number: 1,
      title: 'Test PR',
      state: 'open',
      draft: false,
      head: { ref: 'test-branch', sha: 'abc123' }
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });

    const result = await agent.getPRInfo(1);

    expect(result).toEqual(mockPRData);
    expect(mockOctokit.pulls.get).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1
    });
  });

  test('should mark PR as ready', async () => {
    const mockPRData = {
      number: 1,
      draft: false
    };

    mockOctokit.pulls.update.mockResolvedValue({ data: mockPRData });

    const result = await agent.markAsReady(1);

    expect(result.draft).toBe(false);
    expect(mockOctokit.pulls.update).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      draft: false
    });
  });

  test('should check status with passing checks', async () => {
    const mockPRData = {
      head: { sha: 'abc123' }
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });
    
    mockOctokit.checks.listForRef.mockResolvedValue({
      data: {
        total_count: 2,
        check_runs: [
          { status: 'completed', conclusion: 'success' },
          { status: 'completed', conclusion: 'success' }
        ]
      }
    });

    mockOctokit.repos.getCombinedStatusForRef.mockResolvedValue({
      data: {
        state: 'success',
        statuses: []
      }
    });

    const result = await agent.checkStatus(1);

    expect(result.passed).toBe(true);
    expect(result.details.totalCount).toBe(2);
  });

  test('should check status with failing checks', async () => {
    const mockPRData = {
      head: { sha: 'abc123' }
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });
    
    mockOctokit.checks.listForRef.mockResolvedValue({
      data: {
        total_count: 2,
        check_runs: [
          { status: 'completed', conclusion: 'success' },
          { status: 'completed', conclusion: 'failure' }
        ]
      }
    });

    mockOctokit.repos.getCombinedStatusForRef.mockResolvedValue({
      data: {
        state: 'failure',
        statuses: []
      }
    });

    const result = await agent.checkStatus(1);

    expect(result.passed).toBe(false);
  });

  test('should merge PR', async () => {
    const mockMergeData = {
      sha: 'merge123',
      merged: true
    };

    mockOctokit.pulls.merge.mockResolvedValue({ data: mockMergeData });

    const result = await agent.mergePR(1, {
      commitMessage: 'Test merge'
    });

    expect(result.sha).toBe('merge123');
    expect(mockOctokit.pulls.merge).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      pull_number: 1,
      commit_title: 'Test merge',
      merge_method: 'squash'
    });
  });

  test('should delete branch', async () => {
    mockOctokit.git.deleteRef.mockResolvedValue({});

    await agent.deleteBranch('test-branch');

    expect(mockOctokit.git.deleteRef).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      ref: 'heads/test-branch'
    });
  });

  test('should auto-merge PR successfully', async () => {
    const mockPRData = {
      number: 1,
      title: 'Test PR',
      state: 'open',
      draft: true,
      mergeable: true,
      head: { ref: 'test-branch', sha: 'abc123' }
    };

    const mockMergeData = {
      sha: 'merge123',
      merged: true
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });
    mockOctokit.pulls.update.mockResolvedValue({ data: { ...mockPRData, draft: false } });
    mockOctokit.checks.listForRef.mockResolvedValue({
      data: {
        total_count: 1,
        check_runs: [{ status: 'completed', conclusion: 'success' }]
      }
    });
    mockOctokit.repos.getCombinedStatusForRef.mockResolvedValue({
      data: { state: 'success', statuses: [] }
    });
    mockOctokit.pulls.merge.mockResolvedValue({ data: mockMergeData });
    mockOctokit.git.deleteRef.mockResolvedValue({});

    const result = await agent.autoMergePR(1, {
      waitForChecks: true,
      maxAttempts: 1,
      intervalMs: 100
    });

    expect(result.success).toBe(true);
    expect(result.merged).toBe(true);
    expect(result.branch).toBe('test-branch');
    expect(mockOctokit.pulls.update).toHaveBeenCalled(); // Mark as ready
    expect(mockOctokit.pulls.merge).toHaveBeenCalled();
    expect(mockOctokit.git.deleteRef).toHaveBeenCalled();
  });

  test('should handle errors in auto-merge', async () => {
    mockOctokit.pulls.get.mockRejectedValue(new Error('PR not found'));

    const result = await agent.autoMergePR(999);

    expect(result.success).toBe(false);
    expect(result.error).toContain('PR not found');
  });

  test('should skip mark as ready if PR is not draft', async () => {
    const mockPRData = {
      number: 1,
      title: 'Test PR',
      state: 'open',
      draft: false,
      mergeable: true,
      head: { ref: 'test-branch', sha: 'abc123' }
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });
    mockOctokit.checks.listForRef.mockResolvedValue({
      data: { total_count: 0, check_runs: [] }
    });
    mockOctokit.repos.getCombinedStatusForRef.mockResolvedValue({
      data: { state: '', statuses: [] }
    });
    mockOctokit.pulls.merge.mockResolvedValue({ data: { sha: 'merge123' } });
    mockOctokit.git.deleteRef.mockResolvedValue({});

    const result = await agent.autoMergePR(1, {
      waitForChecks: true,
      maxAttempts: 1,
      intervalMs: 100
    });

    expect(result.success).toBe(true);
    expect(mockOctokit.pulls.update).not.toHaveBeenCalled();
  });

  test('should handle PR not open error', async () => {
    const mockPRData = {
      number: 1,
      state: 'closed',
      head: { ref: 'test-branch' }
    };

    mockOctokit.pulls.get.mockResolvedValue({ data: mockPRData });

    const result = await agent.autoMergePR(1);

    expect(result.success).toBe(false);
    expect(result.error).toContain('no está abierto');
  });

  test('areChecksPassing should return true for no checks', () => {
    const checks = {
      checkRuns: [],
      statuses: [],
      state: '',
      totalCount: 0
    };

    const result = agent.areChecksPassing(checks);
    expect(result).toBe(true);
  });

  test('areChecksPassing should return false for pending checks', () => {
    const checks = {
      checkRuns: [
        { status: 'in_progress', conclusion: null }
      ],
      statuses: [],
      state: 'pending',
      totalCount: 1
    };

    const result = agent.areChecksPassing(checks);
    expect(result).toBe(false);
  });
});
