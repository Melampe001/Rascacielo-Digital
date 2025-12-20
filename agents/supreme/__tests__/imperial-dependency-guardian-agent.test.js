/**
 * Tests for Imperial Dependency Guardian Agent
 */

const ImperialDependencyGuardianAgent = require('../imperial-dependency-guardian-agent');

describe('ImperialDependencyGuardianAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ImperialDependencyGuardianAgent();
  });

  describe('Constructor', () => {
    test('should create agent with default config', () => {
      expect(agent.name).toBe('Imperial Dependency Guardian Agent');
      expect(agent.version).toBe('1.0.0');
      expect(agent.tier).toBe('SUPREME');
      expect(agent.config.autoUpdate).toBe(true);
      expect(agent.config.securityOnly).toBe(true);
    });

    test('should accept custom config', () => {
      const customAgent = new ImperialDependencyGuardianAgent({ 
        autoUpdate: false,
        scanInterval: 3600000 
      });
      expect(customAgent.config.autoUpdate).toBe(false);
      expect(customAgent.config.scanInterval).toBe(3600000);
    });
  });

  describe('scanVulnerabilities', () => {
    test('should scan vulnerabilities successfully', async () => {
      const result = await agent.scanVulnerabilities();
      
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('npmAudit');
      expect(result).toHaveProperty('githubAdvisory');
      expect(result).toHaveProperty('summary');
    });

    test('should categorize vulnerabilities by severity', async () => {
      const result = await agent.scanVulnerabilities();
      
      expect(result.summary).toHaveProperty('total');
      expect(result.summary).toHaveProperty('critical');
      expect(result.summary).toHaveProperty('high');
      expect(result.summary).toHaveProperty('moderate');
      expect(result.summary).toHaveProperty('low');
    });
  });

  describe('runNpmAudit', () => {
    test('should run npm audit and return results', async () => {
      const result = await agent.runNpmAudit();
      
      expect(result).toHaveProperty('vulnerabilities');
      expect(result).toHaveProperty('packages');
      expect(Array.isArray(result.packages)).toBe(true);
    });
  });

  describe('categorizeBySeverity', () => {
    test('should categorize vulnerabilities correctly', () => {
      const results = {
        npmAudit: {
          vulnerabilities: {
            critical: 1,
            high: 3,
            moderate: 5,
            low: 2,
            info: 0
          }
        }
      };
      
      const summary = agent.categorizeBySeverity(results);
      
      expect(summary.total).toBe(11);
      expect(summary.critical).toBe(1);
      expect(summary.high).toBe(3);
      expect(summary.moderate).toBe(5);
      expect(summary.low).toBe(2);
    });
  });

  describe('autoUpdate', () => {
    test('should perform auto-update', async () => {
      const result = await agent.autoUpdate({ securityOnly: true });
      
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('applied');
      expect(result).toHaveProperty('testsPass');
      expect(Array.isArray(result.applied)).toBe(true);
    });
  });

  describe('identifyUpdates', () => {
    test('should identify available updates', async () => {
      const updates = await agent.identifyUpdates();
      
      expect(Array.isArray(updates)).toBe(true);
      if (updates.length > 0) {
        expect(updates[0]).toHaveProperty('name');
        expect(updates[0]).toHaveProperty('current');
        expect(updates[0]).toHaveProperty('latest');
        expect(updates[0]).toHaveProperty('type');
      }
    });
  });

  describe('categorizeUpdates', () => {
    test('should categorize updates by type', () => {
      const updates = [
        { name: 'pkg1', type: 'security' },
        { name: 'pkg2', type: 'patch' },
        { name: 'pkg3', type: 'minor' },
        { name: 'pkg4', type: 'major' }
      ];
      
      const categorized = agent.categorizeUpdates(updates);
      
      expect(categorized.security).toHaveLength(1);
      expect(categorized.patch).toHaveLength(1);
      expect(categorized.minor).toHaveLength(1);
      expect(categorized.major).toHaveLength(1);
    });
  });

  describe('determineUpdateType', () => {
    test('should identify major update', () => {
      const info = { current: '1.0.0', latest: '2.0.0' };
      expect(agent.determineUpdateType(info)).toBe('major');
    });

    test('should identify minor update', () => {
      const info = { current: '1.0.0', latest: '1.1.0' };
      expect(agent.determineUpdateType(info)).toBe('minor');
    });

    test('should identify patch update', () => {
      const info = { current: '1.0.0', latest: '1.0.1' };
      expect(agent.determineUpdateType(info)).toBe('patch');
    });
  });

  describe('applySecurityUpdates', () => {
    test('should apply security updates', async () => {
      const updates = [
        { name: 'lodash', latest: '4.17.21', type: 'security' }
      ];
      
      const applied = await agent.applySecurityUpdates(updates);
      
      expect(Array.isArray(applied)).toBe(true);
      expect(applied.length).toBe(1);
    });
  });

  describe('analyzeUnused', () => {
    test('should analyze unused dependencies', async () => {
      const result = await agent.analyzeUnused();
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('unused');
      expect(result).toHaveProperty('unusedList');
      expect(result).toHaveProperty('spaceRecoverable');
      expect(result).toHaveProperty('totalSize');
    });
  });

  describe('analyzeLicenses', () => {
    test('should analyze licenses', async () => {
      const result = await agent.analyzeLicenses();
      
      expect(result).toHaveProperty('licenses');
      expect(result).toHaveProperty('incompatible');
      expect(result).toHaveProperty('attribution');
      expect(result).toHaveProperty('summary');
    });

    test('should generate attribution content', async () => {
      const result = await agent.analyzeLicenses();
      
      expect(typeof result.attribution).toBe('string');
      expect(result.attribution).toContain('# Attribution');
    });
  });

  describe('generateDependencyGraph', () => {
    test('should generate dependency graph', async () => {
      const result = await agent.generateDependencyGraph();
      
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result).toHaveProperty('circular');
      expect(result).toHaveProperty('heavy');
      expect(result).toHaveProperty('alternatives');
    });
  });

  describe('scheduleScans', () => {
    test('should configure scheduled scans', async () => {
      const result = await agent.scheduleScans();
      
      expect(result.enabled).toBe(true);
      expect(result).toHaveProperty('interval');
      expect(result).toHaveProperty('nextScan');
    });
  });

  describe('getInfo', () => {
    test('should return agent information', () => {
      const info = agent.getInfo();
      
      expect(info.name).toBe('Imperial Dependency Guardian Agent');
      expect(info.version).toBe('1.0.0');
      expect(info.tier).toBe('SUPREME');
      expect(info).toHaveProperty('config');
    });
  });
});
