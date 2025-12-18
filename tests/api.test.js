/**
 * Tests for API Module
 */
const { APIClient } = require('../modules/api');

describe('APIClient', () => {
  let client;

  beforeEach(() => {
    client = new APIClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      retries: 2
    });
  });

  test('should create APIClient instance', () => {
    expect(client).toBeInstanceOf(APIClient);
    expect(client.config.baseURL).toBe('https://api.example.com');
    expect(client.config.timeout).toBe(5000);
    expect(client.config.retries).toBe(2);
  });

  test('should build URL correctly', () => {
    expect(client.buildURL('/users')).toBe('https://api.example.com/users');
    expect(client.buildURL('https://other.com/api')).toBe('https://other.com/api');
  });

  test('should detect retryable errors', () => {
    expect(client.shouldRetry(new Error('timeout'))).toBe(true);
    expect(client.shouldRetry(new Error('ECONNRESET'))).toBe(true);
    expect(client.shouldRetry(new Error('ETIMEDOUT'))).toBe(true);
    expect(client.shouldRetry(new Error('other error'))).toBe(false);
  });

  test('should delay execution', async () => {
    const start = Date.now();
    await client.delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });
});
