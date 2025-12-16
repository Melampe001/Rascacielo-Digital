/**
 * Tests for Core Module - Rascacielos Digital
 */

const { Logger, Config, ErrorHandler, Utils } = require('../modules/core');

describe('Logger', () => {
  let logger;
  let consoleSpy;

  beforeEach(() => {
    logger = new Logger('TestNamespace');
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create logger with namespace', () => {
    expect(logger.namespace).toBe('TestNamespace');
  });

  test('should log info messages', () => {
    logger.info('Test message');
    expect(consoleSpy.log).toHaveBeenCalledWith('[INFO][TestNamespace]', 'Test message');
  });

  test('should log warn messages', () => {
    logger.warn('Warning message');
    expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN][TestNamespace]', 'Warning message');
  });

  test('should log error messages', () => {
    logger.error('Error message');
    expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR][TestNamespace]', 'Error message');
  });

  test('should respect log level settings', () => {
    logger.setLevel('ERROR');
    logger.info('Info message');
    logger.warn('Warn message');
    logger.error('Error message');

    expect(consoleSpy.log).not.toHaveBeenCalled();
    expect(consoleSpy.warn).not.toHaveBeenCalled();
    expect(consoleSpy.error).toHaveBeenCalled();
  });

  test('should log debug messages when level is DEBUG', () => {
    logger.setLevel('DEBUG');
    logger.debug('Debug message');
    expect(consoleSpy.log).toHaveBeenCalledWith('[DEBUG][TestNamespace]', 'Debug message');
  });
});

describe('Config', () => {
  let config;

  beforeEach(() => {
    config = new Config({ key1: 'value1', key2: 'value2' });
  });

  test('should get config value', () => {
    expect(config.get('key1')).toBe('value1');
  });

  test('should return default value when key not found', () => {
    expect(config.get('nonexistent', 'default')).toBe('default');
  });

  test('should return null when key not found and no default', () => {
    expect(config.get('nonexistent')).toBeNull();
  });

  test('should set config value', () => {
    config.set('key3', 'value3');
    expect(config.get('key3')).toBe('value3');
  });

  test('should check if key exists', () => {
    expect(config.has('key1')).toBe(true);
    expect(config.has('nonexistent')).toBe(false);
  });

  test('should return all config values', () => {
    const all = config.all();
    expect(all).toEqual({ key1: 'value1', key2: 'value2' });
  });

  test('should merge new config', () => {
    config.merge({ key3: 'value3', key1: 'updated' });
    expect(config.get('key1')).toBe('updated');
    expect(config.get('key3')).toBe('value3');
  });
});

describe('ErrorHandler', () => {
  let errorHandler;
  let mockLogger;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn()
    };
    errorHandler = new ErrorHandler(mockLogger);
  });

  test('should handle errors and return error object', () => {
    const error = new Error('Test error');
    const result = errorHandler.handle(error);

    expect(result.error).toBe(true);
    expect(result.message).toBe('Test error');
    expect(result.timestamp).toBeDefined();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  test('should handle async errors', async () => {
    const failingPromise = Promise.reject(new Error('Async error'));
    const [error, result] = await errorHandler.handleAsync(failingPromise);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Async error');
    expect(result).toBeNull();
  });

  test('should return result for successful async operations', async () => {
    const successPromise = Promise.resolve('success');
    const [error, result] = await errorHandler.handleAsync(successPromise);

    expect(error).toBeNull();
    expect(result).toBe('success');
  });
});

describe('Utils', () => {
  test('sleep should wait for specified time', async () => {
    const start = Date.now();
    await Utils.sleep(100);
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(95);
    expect(duration).toBeLessThan(200);
  });

  test('isValidEmail should validate correct emails', () => {
    expect(Utils.isValidEmail('test@example.com')).toBe(true);
    expect(Utils.isValidEmail('user.name@domain.org')).toBe(true);
  });

  test('isValidEmail should reject invalid emails', () => {
    expect(Utils.isValidEmail('invalid')).toBe(false);
    expect(Utils.isValidEmail('no@domain')).toBe(false);
    expect(Utils.isValidEmail('@domain.com')).toBe(false);
  });

  test('generateId should return unique ids', () => {
    const id1 = Utils.generateId();
    const id2 = Utils.generateId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
  });

  test('deepClone should create independent copy', () => {
    const original = { a: 1, b: { c: 2 } };
    const clone = Utils.deepClone(original);

    clone.b.c = 999;
    expect(original.b.c).toBe(2);
    expect(clone.b.c).toBe(999);
  });

  test('timeout should reject after specified time', async () => {
    const slowPromise = new Promise(resolve => setTimeout(() => resolve('done'), 500));

    await expect(Utils.timeout(slowPromise, 100)).rejects.toThrow('Timeout exceeded');
  });

  test('timeout should resolve if promise completes in time', async () => {
    const fastPromise = Promise.resolve('fast result');
    const result = await Utils.timeout(fastPromise, 100);

    expect(result).toBe('fast result');
  });

  test('retry should retry failed operations', async () => {
    let attempts = 0;
    const failTwice = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Failed');
      }
      return 'success';
    };

    const retryFn = Utils.retry(failTwice, 3, 10);
    const result = await retryFn();

    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });
});
