/**
 * API Client Module
 * HTTP/HTTPS client with retry and timeout
 */

class APIClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.headers = config.headers || {};
  }

  async request(method, path, data = null, options = {}) {
    const url = this.baseURL + path;
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...options.headers
      },
      timeout: options.timeout || this.timeout
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestOptions.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }

        return await response.text();
      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  async get(path, options = {}) {
    return this.request('GET', path, null, options);
  }

  async post(path, data, options = {}) {
    return this.request('POST', path, data, options);
  }

  async put(path, data, options = {}) {
    return this.request('PUT', path, data, options);
  }

  async delete(path, options = {}) {
    return this.request('DELETE', path, null, options);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { APIClient };
