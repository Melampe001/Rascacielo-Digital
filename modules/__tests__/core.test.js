const { Logger, Config, ErrorHandler, Utils } = require('../core');

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = new Logger('Test');
  });

  it('should create logger with namespace', () => {
    expect(logger.namespace).toBe('Test');
  });

  it('should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.info('test message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log warn messages', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('warning message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log error messages', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('error message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should respect log level', () => {
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

  it('should initialize with defaults', () => {
    const newConfig = new Config({ key1: 'value1', key2: 'value2' });
    expect(newConfig.get('key1')).toBe('value1');
    expect(newConfig.get('key2')).toBe('value2');
  });

  it('should get config value', () => {
    expect(config.get('test')).toBe('value');
  });

  it('should return default value for missing key', () => {
    expect(config.get('missing', 'default')).toBe('default');
  });

  it('should return null for missing key without default', () => {
    expect(config.get('missing')).toBeNull();
  });

  it('should set config value', () => {
    config.set('newKey', 'newValue');
    expect(config.get('newKey')).toBe('newValue');
  });

  it('should check if key exists', () => {
    expect(config.has('test')).toBe(true);
    expect(config.has('missing')).toBe(false);
  });

  it('should return all config', () => {
    const all = config.all();
    expect(all).toEqual({ test: 'value' });
  });

  it('should merge config', () => {
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

  it('should handle error', () => {
    const error = new Error('Test error');
    const result = errorHandler.handle(error);

    expect(result.error).toBe(true);
    expect(result.message).toBe('Test error');
    expect(result.timestamp).toBeDefined();
  });

  it('should handle async error', async () => {
    const promise = Promise.reject(new Error('Async error'));
    const [error, result] = await errorHandler.handleAsync(promise);

    expect(error).toBeDefined();
    expect(error.message).toBe('Async error');
    expect(result).toBeNull();
  });

  it('should handle async success', async () => {
    const promise = Promise.resolve('success');
    const [error, result] = await errorHandler.handleAsync(promise);

    expect(error).toBeNull();
    expect(result).toBe('success');
  });

  it('should handle error with context', () => {
    const error = new Error('Context error');
    const result = errorHandler.handle(error, { user: 'test' });

    expect(result.error).toBe(true);
    expect(result.message).toBe('Context error');
  });
});

describe('Utils', () => {
  it('should sleep for specified duration', async () => {
    const start = Date.now();
    await Utils.sleep(100);
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(90);
  });

  it('should retry failed operations', async () => {
    let attempts = 0;
    const fn = jest.fn(() => {
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

  it('should throw error after max retry attempts', async () => {
    const fn = jest.fn(() => {
      throw new Error('Always fails');
    });

    const retryFn = Utils.retry(fn, 3, 10);
    await expect(retryFn()).rejects.toThrow('Always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should timeout if promise takes too long', () => {
    const slowPromise = new Promise(resolve => setTimeout(() => resolve('done'), 200));

    return expect(Utils.timeout(slowPromise, 50)).rejects.toThrow('Timeout exceeded');
  });

  it('should not timeout if promise completes in time', () => {
    const fastPromise = Promise.resolve('quick');

    return expect(Utils.timeout(fastPromise, 100)).resolves.toBe('quick');
  });

  it('should validate correct email format', () => {
    expect(Utils.isValidEmail('test@example.com')).toBe(true);
    expect(Utils.isValidEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('should reject invalid email without @', () => {
    expect(Utils.isValidEmail('invalid-email')).toBe(false);
  });

  it('should reject invalid email without domain', () => {
    expect(Utils.isValidEmail('test@')).toBe(false);
  });

  it('should reject invalid email without TLD', () => {
    expect(Utils.isValidEmail('test@domain')).toBe(false);
  });

  it('should reject email with spaces', () => {
    expect(Utils.isValidEmail('test @example.com')).toBe(false);
  });

  it('should reject email without local part', () => {
    expect(Utils.isValidEmail('@example.com')).toBe(false);
  });

  it('should generate unique IDs', () => {
    const id1 = Utils.generateId();
    const id2 = Utils.generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });

  it('should deep clone object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const clone = Utils.deepClone(obj);

    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.b).not.toBe(obj.b);
  });
});
