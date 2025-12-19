/**
 * Logger - Rascacielo Digital
 * 
 * Sistema de logging avanzado para agentes
 */

class Logger {
  constructor(namespace) {
    this.namespace = namespace;
    this.levels = {
      DEBUG: 0,
      INFO: 1,
      SUCCESS: 2,
      WARN: 3,
      ERROR: 4
    };
    this.currentLevel = this.levels.INFO;
  }

  setLevel(level) {
    this.currentLevel = this.levels[level.toUpperCase()] || this.levels.INFO;
  }

  debug(message, ...args) {
    if (this.currentLevel <= this.levels.DEBUG) {
      console.debug(`[DEBUG][${this.namespace}]`, message, ...args);
    }
  }

  info(message, ...args) {
    if (this.currentLevel <= this.levels.INFO) {
      console.info(`[INFO][${this.namespace}]`, message, ...args);
    }
  }

  success(message, ...args) {
    if (this.currentLevel <= this.levels.SUCCESS) {
      console.log(`[SUCCESS][${this.namespace}]`, message, ...args);
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
}

module.exports = { Logger };
