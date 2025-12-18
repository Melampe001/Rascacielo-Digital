/**
 * API Module - Cliente HTTP completo
 */
const https = require('https');
const http = require('http');
const { URL } = require('url');

class APIClient {
  constructor(config = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 30000,
      headers: config.headers || {},
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      ...config
    };
  }

  async get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = this.buildURL(endpoint);
    let lastError;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        return await this.makeRequest(method, url, data, options);
      } catch (error) {
        lastError = error;
        if (attempt < this.config.retries && this.shouldRetry(error)) {
          await this.delay(this.config.retryDelay * (attempt + 1));
          continue;
        }
        break;
      }
    }
    throw lastError;
  }

  makeRequest(method, url, data, options) {
    return new Promise((resolve, reject) => {
      const parsedURL = new URL(url);
      const protocol = parsedURL.protocol === 'https:' ? https : http;

      const requestOptions = {
        method,
        hostname: parsedURL.hostname,
        port: parsedURL.port,
        path: parsedURL.pathname + parsedURL.search,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...options.headers
        },
        timeout: this.config.timeout
      };

      const req = protocol.request(requestOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              headers: res.headers,
              data: body ? JSON.parse(body) : null
            };
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  buildURL(endpoint) {
    if (endpoint.startsWith('http')) return endpoint;
    return `${this.config.baseURL}${endpoint}`;
  }

  shouldRetry(error) {
    return error.message.includes('timeout') ||
           error.message.includes('ECONNRESET') ||
           error.message.includes('ETIMEDOUT');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { APIClient };
