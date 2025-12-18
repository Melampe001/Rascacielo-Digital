/**
 * Core Module - Rascacielos Digital
 *
 * Módulo central con funcionalidades comunes del sistema
 */

class Logger {
  constructor(namespace = 'App') {
    this.namespace = namespace;
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3
    };
    this.currentLevel = this.levels.INFO;
  }

  debug(message, ...args) {
    if (this.currentLevel <= this.levels.DEBUG) {
      console.log(`[DEBUG][${this.namespace}]`, message, ...args);
    }
  }

  info(message, ...args) {
    if (this.currentLevel <= this.levels.INFO) {
      console.log(`[INFO][${this.namespace}]`, message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.currentLevel <= this.levels.WARN) {
      console.warn(`[WARN][${this.namespace}]`, message, ...args);
    }
  }

  error(message, ...args) {
    if (this.currentLevel <= this.levels.ERROR) {
      console.error(`[ERROR][${this.namespace}]`, message, ...args);
    }
  }

  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.currentLevel = this.levels[level];
    }
  }
}

class Config {
  constructor(defaults = {}) {
    this.config = { ...defaults };
  }

  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  set(key, value) {
    this.config[key] = value;
  }

  has(key) {
    return this.config[key] !== undefined;
  }

  all() {
    return { ...this.config };
  }

  merge(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

class ErrorHandler {
  constructor(logger) {
    this.logger = logger || new Logger('ErrorHandler');
  }

  handle(error, context = {}) {
    this.logger.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
      context
    });

    // Aquí se podría enviar a un servicio de tracking de errores
    // como Sentry, Rollbar, etc.

    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }

  async handleAsync(promise, context = {}) {
    try {
      const result = await promise;
      return [null, result];
    } catch (error) {
      this.handle(error, context);
      return [error, null];
    }
  }
}

class Utils {
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static retry(fn, maxAttempts = 3, delay = 1000) {
    return async function (...args) {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await fn(...args);
        } catch (error) {
          if (attempt === maxAttempts) throw error;
          await Utils.sleep(delay * attempt);
        }
      }
    };
  }

  static async timeout(promise, ms) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout exceeded')), ms);
    });
    return Promise.race([promise, timeoutPromise]);
  }

  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

module.exports = {
  Logger,
  Config,
  ErrorHandler,
  Utils
};
