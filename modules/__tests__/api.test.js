/**
 * API Module Tests
 */

const { HTTPClient } = require('../api');

describe('HTTPClient', () => {
  let client;

  beforeEach(() => {
    client = new HTTPClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      maxRetries: 2
    });
  });

  test('should create HTTP client with config', () => {
    expect(client.config.baseURL).toBe('https://api.example.com');
    expect(client.config.timeout).toBe(5000);
    expect(client.config.maxRetries).toBe(2);
  });

  test('should have HTTP methods', () => {
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.patch).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  test('should build request options', () => {
    expect(client.config.headers).toBeDefined();
  });
});
