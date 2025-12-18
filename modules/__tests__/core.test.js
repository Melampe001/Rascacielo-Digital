const { Logger, Config, ErrorHandler, Utils } = require('../core');

describe('Core Module', () => {
  describe('Logger', () => {
    let logger;
    let consoleSpy;

    beforeEach(() => {
      logger = new Logger('TestApp');
      consoleSpy = {
        log: jest.spyOn(console, 'log').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation()
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create logger with namespace', () => {
      expect(logger.namespace).toBe('TestApp');
    });

    it('should log info messages', () => {
      logger.info('Test message');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[INFO][TestApp]',
        'Test message'
      );
    });

    it('should log warn messages', () => {
      logger.warn('Warning message');
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('Error message');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should respect log level', () => {
      logger.setLevel('ERROR');
      logger.info('Should not appear');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('Config', () => {
    let config;

    beforeEach(() => {
      config = new Config({ port: 3000, host: 'localhost' });
    });

    it('should initialize with defaults', () => {
      expect(config.get('port')).toBe(3000);
      expect(config.get('host')).toBe('localhost');
    });

    it('should get config value', () => {
      expect(config.get('port')).toBe(3000);
    });

    it('should return default value if key not found', () => {
      expect(config.get('missing', 'default')).toBe('default');
    });

    it('should set config value', () => {
      config.set('port', 4000);
      expect(config.get('port')).toBe(4000);
    });

    it('should check if key exists', () => {
      expect(config.has('port')).toBe(true);
      expect(config.has('missing')).toBe(false);
    });

    it('should return all config', () => {
      const all = config.all();
      expect(all.port).toBe(3000);
      expect(all.host).toBe('localhost');
    });

    it('should merge config', () => {
      config.merge({ env: 'production', debug: false });
      expect(config.get('env')).toBe('production');
      expect(config.get('debug')).toBe(false);
      expect(config.get('port')).toBe(3000);
    });
  });

  describe('ErrorHandler', () => {
    let handler;
    let logger;

    beforeEach(() => {
      logger = new Logger('ErrorTest');
      handler = new ErrorHandler(logger);
      jest.spyOn(logger, 'error').mockImplementation();
    });

    it('should handle errors', () => {
      const error = new Error('Test error');
      const result = handler.handle(error, { context: 'test' });

      expect(result.error).toBe(true);
      expect(result.message).toBe('Test error');
      expect(result.timestamp).toBeDefined();
    });

    it('should handle async errors', async () => {
      const promise = Promise.reject(new Error('Async error'));
      const [error, result] = await handler.handleAsync(promise);

      expect(error).toBeDefined();
      expect(error.message).toBe('Async error');
      expect(result).toBeNull();
    });

    it('should handle async success', async () => {
      const promise = Promise.resolve('Success');
      const [error, result] = await handler.handleAsync(promise);

      expect(error).toBeNull();
      expect(result).toBe('Success');
    });
  });

  describe('Utils', () => {
    describe('sleep', () => {
      it('should sleep for specified time', async () => {
        const start = Date.now();
        await Utils.sleep(100);
        const duration = Date.now() - start;
        expect(duration).toBeGreaterThanOrEqual(90);
      });
    });

    describe('retry', () => {
      it('should retry function on failure', async () => {
        let attempts = 0;
        const failTwice = async () => {
          attempts++;
          if (attempts < 3) throw new Error('Fail');
          return 'Success';
        };

        const retryFn = Utils.retry(failTwice, 3, 10);
        const result = await retryFn();

        expect(result).toBe('Success');
        expect(attempts).toBe(3);
      });

      it('should throw after max attempts', async () => {
        const alwaysFail = async () => {
          throw new Error('Always fails');
        };

        const retryFn = Utils.retry(alwaysFail, 2, 10);
        await expect(retryFn()).rejects.toThrow('Always fails');
      });
    });

    describe('timeout', () => {
      it('should timeout slow promise', async () => {
        const slowPromise = Utils.sleep(200);
        await expect(Utils.timeout(slowPromise, 100))
          .rejects
          .toThrow('Timeout exceeded');
      });

      it('should not timeout fast promise', async () => {
        const fastPromise = Utils.sleep(50).then(() => 'Done');
        const result = await Utils.timeout(fastPromise, 100);
        expect(result).toBe('Done');
      });
    });

    describe('isValidEmail', () => {
      const testCases = [
        { email: 'test@example.com', expected: true },
        { email: 'user.name@domain.co.uk', expected: true },
        { email: 'invalid', expected: false },
        { email: '@example.com', expected: false },
        { email: 'test@', expected: false },
        { email: '', expected: false }
      ];

      testCases.forEach(({ email, expected }) => {
        it(`should validate "${email}" as ${expected}`, () => {
          expect(Utils.isValidEmail(email)).toBe(expected);
        });
      });
    });

    describe('generateId', () => {
      it('should generate unique IDs', () => {
        const id1 = Utils.generateId();
        const id2 = Utils.generateId();

        expect(id1).not.toBe(id2);
        expect(typeof id1).toBe('string');
        expect(id1.length).toBeGreaterThan(10);
      });
    });

    describe('deepClone', () => {
      it('should deep clone object', () => {
        const original = {
          name: 'Test',
          nested: { value: 42 },
          array: [1, 2, 3]
        };

        const cloned = Utils.deepClone(original);

        expect(cloned).toEqual(original);
        expect(cloned).not.toBe(original);
        expect(cloned.nested).not.toBe(original.nested);
      });
    });
  });
});
