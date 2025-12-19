/**
 * PR Manager Agent Tests
 */

const PRManagerAgent = require('../pr-manager-agent');

describe('PRManagerAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new PRManagerAgent({
      owner: 'test-owner',
      repo: 'test-repo'
    });
  });

  test('should initialize correctly', () => {
    expect(agent.name).toBe('PR Manager Agent');
    expect(agent.version).toBe('1.0.0');
    expect(agent.config.owner).toBe('test-owner');
    expect(agent.config.repo).toBe('test-repo');
  });

  test('should categorize PRs correctly', () => {
    expect(agent.categorizePR({ title: 'Add Vercel deployment' })).toBe('deployment');
    expect(agent.categorizePR({ title: 'Update dependencies' })).toBe('dependencies');
    expect(agent.categorizePR({ title: 'Fix CI/CD pipeline' })).toBe('ci-cd');
    expect(agent.categorizePR({ title: 'Add new agent' })).toBe('agents');
    expect(agent.categorizePR({ title: 'Flutter frontend' })).toBe('frontend');
    expect(agent.categorizePR({ title: 'Cleanup code' })).toBe('maintenance');
    expect(agent.categorizePR({ title: 'Next.js architecture' })).toBe('architecture');
    expect(agent.categorizePR({ title: 'Random change' })).toBe('other');
  });

  test('should detect duplicates', () => {
    expect(agent.checkDuplicate({ number: 28 })).toBe(29);
    expect(agent.checkDuplicate({ number: 31 })).toBe(null);
    expect(agent.checkDuplicate({ number: 36 })).toBe(37);
    expect(agent.checkDuplicate({ number: 100 })).toBe(null);
  });

  test('should generate recommendations', () => {
    // Essential PRs
    let rec = agent.getRecommendation({ number: 32, title: 'Orchestrator' });
    expect(rec.action).toBe('MERGE');
    expect(rec.priority).toBe('HIGH');
    
    // Duplicates
    rec = agent.getRecommendation({ number: 28, title: 'Vercel v1' });
    expect(rec.action).toBe('CLOSE');
    
    // Review needed
    rec = agent.getRecommendation({ number: 31, title: 'Next.js SaaS' });
    expect(rec.action).toBe('REVIEW');
    
    // CI/CD fix
    rec = agent.getRecommendation({ number: 33, title: 'CI/CD fix' });
    expect(rec.action).toBe('MERGE');
    expect(rec.priority).toBe('HIGH');
  });

  test('should analyze all PRs', async () => {
    const results = await agent.analyzeAllPRs();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('number');
    expect(results[0]).toHaveProperty('title');
    expect(results[0]).toHaveProperty('category');
    expect(results[0]).toHaveProperty('recommendation');
  });

  test('should analyze individual PR', async () => {
    const pr = { number: 32, title: 'Orchestrator', draft: true, created: '3h' };
    const analysis = await agent.analyzePR(pr);
    
    expect(analysis.number).toBe(32);
    expect(analysis.title).toBe('Orchestrator');
    expect(analysis.category).toBe('agents');
    expect(analysis.recommendation.action).toBe('MERGE');
  });

  test('should generate report', async () => {
    // Suppress console.log during test
    const originalLog = console.log;
    console.log = jest.fn();
    
    await agent.analyzeAllPRs();
    const report = agent.generateReport();
    
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('details');
    expect(report.summary).toHaveProperty('total');
    expect(report.summary).toHaveProperty('toMerge');
    expect(report.summary).toHaveProperty('toClose');
    expect(report.summary).toHaveProperty('toReview');
    expect(report.summary.total).toBeGreaterThan(0);
    
    console.log = originalLog;
  });

  test('should execute actions in dry run', async () => {
    // Suppress console.log during test
    const originalLog = console.log;
    console.log = jest.fn();
    
    await agent.analyzeAllPRs();
    const results = await agent.executeActions(true);
    
    expect(results).toHaveProperty('merged');
    expect(results).toHaveProperty('closed');
    expect(results).toHaveProperty('conflicts');
    expect(Array.isArray(results.merged)).toBe(true);
    expect(Array.isArray(results.closed)).toBe(true);
    expect(Array.isArray(results.conflicts)).toBe(true);
    
    console.log = originalLog;
  });

  test('should fetch open PRs', async () => {
    const prs = await agent.fetchOpenPRs();
    
    expect(Array.isArray(prs)).toBe(true);
    expect(prs.length).toBeGreaterThan(0);
    expect(prs[0]).toHaveProperty('number');
    expect(prs[0]).toHaveProperty('title');
  });

  test('should close PR', async () => {
    // Suppress console.log during test
    const originalLog = console.log;
    console.log = jest.fn();
    
    await agent.closePR(28, 'Test reason');
    expect(console.log).toHaveBeenCalled();
    
    console.log = originalLog;
  });

  test('should merge PR', async () => {
    // Suppress console.log during test
    const originalLog = console.log;
    console.log = jest.fn();
    
    await agent.mergePR(32);
    expect(console.log).toHaveBeenCalled();
    
    console.log = originalLog;
  });
});
