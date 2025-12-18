/**
 * Queue Module - Gestión de colas y trabajos asíncronos
 */
const EventEmitter = require('events');

class Queue extends EventEmitter {
  constructor(name, config = {}) {
    super();
    this.name = name;
    this.config = {
      concurrency: config.concurrency || 5,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      timeout: config.timeout || 30000,
      ...config
    };

    this.jobs = [];
    this.processing = new Set();
    this.completed = [];
    this.failed = [];
    this.isProcessing = false;
  }

  async add(data, options = {}) {
    const job = {
      id: this.generateId(),
      data,
      priority: options.priority || 0,
      retries: 0,
      maxRetries: options.maxRetries || this.config.maxRetries,
      status: 'pending',
      createdAt: Date.now(),
      ...options
    };

    this.jobs.push(job);
    this.jobs.sort((a, b) => b.priority - a.priority);

    this.emit('job:added', job);

    if (!this.isProcessing) {
      this.process();
    }

    return job;
  }

  async process() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.jobs.length > 0 || this.processing.size > 0) {
      while (this.processing.size < this.config.concurrency && this.jobs.length > 0) {
        const job = this.jobs.shift();
        this.processJob(job);
      }

      if (this.processing.size === 0 && this.jobs.length === 0) {
        break;
      }

      await this.delay(100);
    }

    this.isProcessing = false;
    this.emit('queue:drained');
  }

  async processJob(job) {
    this.processing.add(job.id);
    job.status = 'processing';
    job.startedAt = Date.now();

    this.emit('job:started', job);

    try {
      const result = await this.executeWithTimeout(
        this.config.handler(job.data),
        this.config.timeout
      );

      job.status = 'completed';
      job.completedAt = Date.now();
      job.result = result;

      this.completed.push(job);
      this.processing.delete(job.id);

      this.emit('job:completed', job);
    } catch (error) {
      job.error = error.message;
      job.retries++;

      if (job.retries < job.maxRetries) {
        job.status = 'pending';
        this.jobs.push(job);
        this.emit('job:retrying', job);

        await this.delay(this.config.retryDelay * job.retries);
      } else {
        job.status = 'failed';
        job.failedAt = Date.now();
        this.failed.push(job);
        this.emit('job:failed', job);
      }

      this.processing.delete(job.id);
    }
  }

  async executeWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Job timeout')), timeout);
    });
    return Promise.race([promise, timeoutPromise]);
  }

  setHandler(handler) {
    this.config.handler = handler;
  }

  getStats() {
    return {
      name: this.name,
      pending: this.jobs.length,
      processing: this.processing.size,
      completed: this.completed.length,
      failed: this.failed.length,
      total: this.jobs.length + this.processing.size + this.completed.length + this.failed.length
    };
  }

  clear() {
    this.jobs = [];
    this.completed = [];
    this.failed = [];
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { Queue };
