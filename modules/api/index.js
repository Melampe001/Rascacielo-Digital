/**
 * API Module
 * HTTP client with retry logic and error handling
 */

const HTTPClient = require('./client');

module.exports = {
  HTTPClient,
  createClient: config => new HTTPClient(config)
};
