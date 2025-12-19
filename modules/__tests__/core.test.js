/**
 * Core Module Tests
 */

const { Logger, Config, ErrorHandler, Utils } = require('../core');

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = new Logger('Test');
  });

  test('should create logger with namespace', () => {
    expect(logger.namespace).toBe('Test');
  });

  test('should log at different levels', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.info('test message');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('should respect log level', () => {
    logger.setLevel('ERROR');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.info('should not log');
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('Config', () => {
  let config;

  beforeEach(() => {
    config = new Config({ test: 'value' });
  });

  test('should get config value', () => {
    expect(config.get('test')).toBe('value');
  });

  test('should return default value for missing key', () => {
    expect(config.get('missing', 'default')).toBe('default');
  });

  test('should set config value', () => {
    config.set('newKey', 'newValue');
    expect(config.get('newKey')).toBe('newValue');
  });

  test('should check if key exists', () => {
    expect(config.has('test')).toBe(true);
    expect(config.has('missing')).toBe(false);
  });

  test('should merge config', () => {
    config.merge({ another: 'value' });
    expect(config.get('another')).toBe('value');
    expect(config.get('test')).toBe('value');
  });
});

describe('ErrorHandler', () => {
  let errorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
  });

  test('should handle error', () => {
    const error = new Error('Test error');
    const result = errorHandler.handle(error);

    expect(result.error).toBe(true);
    expect(result.message).toBe('Test error');
    expect(result.timestamp).toBeDefined();
  });

  test('should handle async error', async () => {
    const promise = Promise.reject(new Error('Async error'));
    const [error, result] = await errorHandler.handleAsync(promise);

    expect(error).toBeDefined();
    expect(error.message).toBe('Async error');
    expect(result).toBeNull();
  });

  test('should handle async success', async () => {
    const promise = Promise.resolve('success');
    const [error, result] = await errorHandler.handleAsync(promise);

    expect(error).toBeNull();
    expect(result).toBe('success');
  });
});

describe('Utils', () => {
  test('sleep should delay execution', async () => {
    const start = Date.now();
    await Utils.sleep(100);
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(90);
  });

  test('retry should retry failed operations', async () => {
    let attempts = 0;
    const fn = jest.fn(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Failed');
      }
      return 'success';
    });

    const retryFn = Utils.retry(fn, 3, 10);
    const result = await retryFn();

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('timeout should reject if promise takes too long', async () => {
    const slowPromise = new Promise(resolve => setTimeout(() => resolve('done'), 200));

    await expect(Utils.timeout(slowPromise, 50)).rejects.toThrow('Timeout exceeded');
  });

  test('isValidEmail should validate email format', () => {
    expect(Utils.isValidEmail('test@example.com')).toBe(true);
    expect(Utils.isValidEmail('invalid-email')).toBe(false);
    expect(Utils.isValidEmail('test@')).toBe(false);
  });

  test('generateId should generate unique IDs', () => {
    const id1 = Utils.generateId();
    const id2 = Utils.generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });

  test('deepClone should clone object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clone = Utils.deepClone(obj);

    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.b).not.toBe(obj.b);
  });
});
