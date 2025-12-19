/**
 * Metrics - Rascacielo Digital
 * 
 * Sistema de métricas para monitoreo de agentes
 */

class Metrics {
  constructor(agentName) {
    this.agentName = agentName;
    this.stats = {
      executions: 0,
      successes: 0,
      failures: 0,
      totalTime: 0,
      averageTime: 0,
      lastExecution: null,
      errors: []
    };
    this.timers = new Map();
  }

  startTimer(name) {
    this.timers.set(name, Date.now());
  }

  stopTimer(name) {
    const startTime = this.timers.get(name);
    if (startTime) {
      const elapsed = Date.now() - startTime;
      this.timers.delete(name);
      return elapsed;
    }
    return 0;
  }

  recordSuccess() {
    this.stats.executions++;
    this.stats.successes++;
    this.stats.lastExecution = new Date().toISOString();
    this._updateAverageTime();
  }

  recordFailure(error) {
    this.stats.executions++;
    this.stats.failures++;
    this.stats.lastExecution = new Date().toISOString();
    this.stats.errors.push({
      message: error.message,
      timestamp: new Date().toISOString()
    });
    this._updateAverageTime();
  }

  _updateAverageTime() {
    const executionTime = this.stopTimer('execution');
    if (executionTime > 0) {
      this.stats.totalTime += executionTime;
      this.stats.averageTime = Math.round(this.stats.totalTime / this.stats.executions);
    }
  }

  getStats() {
    return {
      ...this.stats,
      successRate: this.stats.executions > 0 
        ? Math.round((this.stats.successes / this.stats.executions) * 100) 
        : 0
    };
  }

  reset() {
    this.stats = {
      executions: 0,
      successes: 0,
      failures: 0,
      totalTime: 0,
      averageTime: 0,
      lastExecution: null,
      errors: []
    };
    this.timers.clear();
  }
}

module.exports = { Metrics };
