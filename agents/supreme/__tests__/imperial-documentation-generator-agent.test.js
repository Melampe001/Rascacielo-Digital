/**
 * Tests for Imperial Documentation Generator Agent
 */

const ImperialDocumentationGeneratorAgent = require('../imperial-documentation-generator-agent');

describe('ImperialDocumentationGeneratorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ImperialDocumentationGeneratorAgent();
  });

  describe('Constructor', () => {
    test('should create agent with default config', () => {
      expect(agent.name).toBe('Imperial Documentation Generator Agent');
      expect(agent.version).toBe('1.0.0');
      expect(agent.tier).toBe('SUPREME');
      expect(agent.config.enableAI).toBe(true);
      expect(agent.config.includeExamples).toBe(true);
    });

    test('should accept custom config', () => {
      const customAgent = new ImperialDocumentationGeneratorAgent({ 
        enableAI: false,
        outputFormat: 'html' 
      });
      expect(customAgent.config.enableAI).toBe(false);
      expect(customAgent.config.outputFormat).toBe('html');
    });
  });

  describe('generateDocs', () => {
    test('should generate complete documentation', async () => {
      const result = await agent.generateDocs();
      
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('jsdoc');
      expect(result).toHaveProperty('readme');
      expect(result).toHaveProperty('apiReference');
      expect(result).toHaveProperty('changelog');
    });

    test('should accept options', async () => {
      const options = {
        files: './agents',
        project: '.',
        code: 'src/**/*.js'
      };
      
      const result = await agent.generateDocs(options);
      expect(result.success).toBe(true);
    });
  });

  describe('generateJSDoc', () => {
    test('should generate JSDoc for files', async () => {
      const result = await agent.generateJSDoc('.');
      
      expect(result).toHaveProperty('scanned');
      expect(result).toHaveProperty('undocumented');
      expect(result).toHaveProperty('functions');
      expect(Array.isArray(result.functions)).toBe(true);
    });

    test('should find undocumented functions', async () => {
      const result = await agent.generateJSDoc('./agents');
      
      expect(typeof result.scanned).toBe('number');
      expect(typeof result.undocumented).toBe('number');
    });
  });

  describe('generateAIDocumentation', () => {
    test('should generate AI-powered documentation', async () => {
      const func = {
        file: 'test.js',
        function: 'testFunc',
        params: ['arg1', 'arg2'],
        returns: 'Promise<Object>'
      };
      
      const result = await agent.generateAIDocumentation(func);
      
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('params');
      expect(result).toHaveProperty('returns');
      expect(result).toHaveProperty('example');
      expect(Array.isArray(result.params)).toBe(true);
    });
  });

  describe('generateREADME', () => {
    test('should generate README', async () => {
      const result = await agent.generateREADME('.');
      
      expect(result).toHaveProperty('sections');
      expect(result).toHaveProperty('length');
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.sections)).toBe(true);
      expect(result.sections.length).toBeGreaterThan(0);
    });

    test('should include standard sections', async () => {
      const result = await agent.generateREADME('.');
      
      expect(result.sections).toContain('title');
      expect(result.sections).toContain('installation');
      expect(result.sections).toContain('usage');
      expect(result.sections).toContain('license');
    });
  });

  describe('README sections', () => {
    test('should generate installation section', () => {
      const section = agent.generateInstallationSection();
      expect(section).toContain('Installation');
      expect(section).toContain('```bash');
    });

    test('should generate usage section', () => {
      const section = agent.generateUsageSection();
      expect(section).toContain('Usage');
      expect(section).toContain('```javascript');
    });

    test('should generate API section', () => {
      const section = agent.generateAPISection();
      expect(section).toContain('API Reference');
    });

    test('should generate examples section', () => {
      const section = agent.generateExamplesSection();
      expect(section).toContain('Examples');
    });
  });

  describe('generateAPIReference', () => {
    test('should generate API reference', async () => {
      const result = await agent.generateAPIReference();
      
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('format');
      expect(result).toHaveProperty('generated');
      expect(result.generated).toBe(true);
    });
  });

  describe('exportToHTML', () => {
    test('should export documentation to HTML', async () => {
      const result = await agent.exportToHTML({});
      
      expect(result.format).toBe('html');
      expect(result).toHaveProperty('framework');
      expect(result).toHaveProperty('pages');
      expect(result).toHaveProperty('deployed');
    });
  });

  describe('exportToPDF', () => {
    test('should export documentation to PDF', async () => {
      const result = await agent.exportToPDF({});
      
      expect(result.format).toBe('pdf');
      expect(result).toHaveProperty('pages');
      expect(result).toHaveProperty('size');
      expect(result).toHaveProperty('filename');
    });
  });

  describe('detectObsoleteDocs', () => {
    test('should detect obsolete documentation', async () => {
      const result = await agent.detectObsoleteDocs();
      
      expect(result).toHaveProperty('obsolete');
      expect(result).toHaveProperty('upToDate');
      expect(result).toHaveProperty('needsUpdate');
      expect(Array.isArray(result.obsolete)).toBe(true);
    });
  });

  describe('updateChangelog', () => {
    test('should update changelog', async () => {
      const result = await agent.updateChangelog();
      
      expect(result).toHaveProperty('path');
      expect(result).toHaveProperty('exists');
      expect(result).toHaveProperty('newEntry');
      expect(result).toHaveProperty('changes');
    });

    test('should include new entry content', async () => {
      const result = await agent.updateChangelog();
      
      expect(typeof result.newEntry).toBe('string');
      expect(result.newEntry.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeCommits', () => {
    test('should analyze commits', () => {
      const commits = agent.analyzeCommits();
      
      expect(Array.isArray(commits)).toBe(true);
      if (commits.length > 0) {
        expect(commits[0]).toHaveProperty('type');
        expect(commits[0]).toHaveProperty('scope');
        expect(commits[0]).toHaveProperty('message');
      }
    });
  });

  describe('generateChangelogEntry', () => {
    test('should generate changelog entry', () => {
      const changes = [
        { type: 'feat', scope: 'core', message: 'Add new feature' },
        { type: 'fix', scope: 'api', message: 'Fix bug' },
        { type: 'docs', scope: 'readme', message: 'Update docs' }
      ];
      
      const entry = agent.generateChangelogEntry(changes);
      
      expect(typeof entry).toBe('string');
      expect(entry).toContain('Features');
      expect(entry).toContain('Bug Fixes');
      expect(entry).toContain('Documentation');
    });

    test('should include version and date', () => {
      const changes = [{ type: 'feat', scope: 'core', message: 'Test' }];
      const entry = agent.generateChangelogEntry(changes);
      
      expect(entry).toContain('[1.0.0]');
      expect(entry).toMatch(/\d{4}-\d{2}-\d{2}/); // Date format
    });
  });

  describe('getInfo', () => {
    test('should return agent information', () => {
      const info = agent.getInfo();
      
      expect(info.name).toBe('Imperial Documentation Generator Agent');
      expect(info.version).toBe('1.0.0');
      expect(info.tier).toBe('SUPREME');
      expect(info).toHaveProperty('config');
    });
  });
});
