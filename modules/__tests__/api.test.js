/**
 * API Module Tests
 */

const { APIClient } = require('../api');

describe('APIClient', () => {
  let client;

  beforeEach(() => {
    client = new APIClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      maxRetries: 2
    });
  });

  test('should create API client with config', () => {
    expect(client.baseURL).toBe('https://api.example.com');
    expect(client.timeout).toBe(5000);
    expect(client.maxRetries).toBe(2);
  });

  test('should have HTTP methods', () => {
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  test('should have request method', () => {
    expect(typeof client.request).toBe('function');
  });

  test('should have sleep utility', () => {
    expect(typeof client.sleep).toBe('function');
  });
});
