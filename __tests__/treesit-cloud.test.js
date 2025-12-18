/**
 * Tests for Treesit Cloud Configuration
 */

const TreesitCloudConfig = require('../config/treesit-cloud');

describe('TreesitCloudConfig', () => {
  describe('constructor', () => {
    it('should create a configuration instance with default values', () => {
      const config = new TreesitCloudConfig();
      
      expect(config.get('provider')).toBe('treesit');
      expect(config.get('region')).toBe('us-east-1');
      expect(config.get('endpoint')).toBe('https://api.treesit.cloud');
      expect(config.get('autoScale')).toBe(true);
      expect(config.get('minInstances')).toBe(1);
      expect(config.get('maxInstances')).toBe(5);
    });

    it('should use environment variables when available', () => {
      process.env.TREESIT_REGION = 'eu-west-1';
      process.env.TREESIT_ENDPOINT = 'https://custom.treesit.cloud';
      
      const config = new TreesitCloudConfig();
      
      expect(config.get('region')).toBe('eu-west-1');
      expect(config.get('endpoint')).toBe('https://custom.treesit.cloud');
      
      // Cleanup
      delete process.env.TREESIT_REGION;
      delete process.env.TREESIT_ENDPOINT;
    });
  });

  describe('validate', () => {
    it('should throw error when required credentials are missing', () => {
      const config = new TreesitCloudConfig();
      
      expect(() => config.validate()).toThrow('Missing required Treesit Cloud credentials');
    });

    it('should pass validation when all required credentials are present', () => {
      process.env.TREESIT_API_KEY = 'test-api-key';
      process.env.TREESIT_SECRET_KEY = 'test-secret-key';
      process.env.TREESIT_PROJECT_ID = 'test-project-id';
      
      const config = new TreesitCloudConfig();
      
      expect(config.validate()).toBe(true);
      
      // Cleanup
      delete process.env.TREESIT_API_KEY;
      delete process.env.TREESIT_SECRET_KEY;
      delete process.env.TREESIT_PROJECT_ID;
    });
  });

  describe('get', () => {
    it('should return value for existing key', () => {
      const config = new TreesitCloudConfig();
      
      expect(config.get('provider')).toBe('treesit');
    });

    it('should return undefined for non-existing key', () => {
      const config = new TreesitCloudConfig();
      
      expect(config.get('nonexistent')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return configuration without secrets', () => {
      process.env.TREESIT_API_KEY = 'secret-api-key';
      process.env.TREESIT_SECRET_KEY = 'secret-key';
      process.env.TREESIT_PROJECT_ID = 'project-123';
      
      const config = new TreesitCloudConfig();
      const safeConfig = config.getAll();
      
      expect(safeConfig).not.toHaveProperty('apiKey');
      expect(safeConfig).not.toHaveProperty('secretKey');
      expect(safeConfig).toHaveProperty('provider');
      expect(safeConfig).toHaveProperty('region');
      expect(safeConfig).toHaveProperty('endpoint');
      
      // Cleanup
      delete process.env.TREESIT_API_KEY;
      delete process.env.TREESIT_SECRET_KEY;
      delete process.env.TREESIT_PROJECT_ID;
    });
  });
});
