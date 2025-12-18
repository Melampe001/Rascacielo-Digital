/**
 * HTTP Client Module with Retry Logic
 * Provides a robust HTTP client with automatic retries and error handling
 */

const { Utils } = require('../core');

class HTTPClient {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      headers: config.headers || {},
      ...config
    };
  }

  /**
   * Make HTTP request with retry logic
   */
  async request(method, url, options = {}) {
    const fullURL = this.config.baseURL + url;
    const requestOptions = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body);
    }

    const makeRequest = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeout);

      try {
        const response = await fetch(fullURL, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }

        return await response.text();
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    };

    // Apply retry logic
    const retryRequest = Utils.retry(makeRequest, this.config.maxRetries, this.config.retryDelay);
    return await retryRequest();
  }

  async get(url, options = {}) {
    return this.request('GET', url, options);
  }

  async post(url, body, options = {}) {
    return this.request('POST', url, { ...options, body });
  }

  async put(url, body, options = {}) {
    return this.request('PUT', url, { ...options, body });
  }

  async patch(url, body, options = {}) {
    return this.request('PATCH', url, { ...options, body });
  }

  async delete(url, options = {}) {
    return this.request('DELETE', url, options);
  }
}

module.exports = HTTPClient;
