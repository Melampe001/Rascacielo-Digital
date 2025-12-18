const { Logger, Config, ErrorHandler, Utils } = require('../core');

describe('Core Module', () => {
  describe('Logger', () => {
    test('should create logger with namespace', () => {
      const logger = new Logger('TestApp');
      expect(logger.namespace).toBe('TestApp');
    });
  });

  describe('Config', () => {
    test('should get and set values', () => {
      const config = new Config({ port: 3000 });
      expect(config.get('port')).toBe(3000);
      config.set('port', 4000);
      expect(config.get('port')).toBe(4000);
    });
  });

  describe('Utils', () => {
    test('should validate email correctly', () => {
      expect(Utils.isValidEmail('test@example.com')).toBe(true);
      expect(Utils.isValidEmail('invalid')).toBe(false);
    });

    test('should generate unique IDs', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
