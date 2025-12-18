/**
 * Queue Module
 * Event-driven job queue with priority and retry
 */

const EventEmitter = require('events');

class Queue extends EventEmitter {
  constructor(name, config = {}) {
    super();
    this.name = name;
    this.jobs = [];
    this.processing = false;
    this.concurrency = config.concurrency || 1;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.activeJobs = 0;
    this.handler = null;
  }

  setHandler(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    this.handler = handler;
  }

  async add(data, options = {}) {
    const job = {
      id: this.generateId(),
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxRetries: options.maxRetries || this.maxRetries,
      status: 'pending',
      createdAt: new Date()
    };

    this.jobs.push(job);
    this.jobs.sort((a, b) => b.priority - a.priority);

    this.emit('job:added', job);

    if (!this.processing) {
      this.process();
    }

    return job.id;
  }

  async process() {
    if (this.processing) return;
    if (!this.handler) {
      throw new Error('No handler configured. Use setHandler() first.');
    }

    this.processing = true;

    while (this.jobs.length > 0 || this.activeJobs > 0) {
      if (this.activeJobs >= this.concurrency) {
        await this.sleep(100);
        continue;
      }

      const job = this.jobs.shift();
      if (!job) {
        await this.sleep(100);
        continue;
      }

      this.activeJobs++;
      this.processJob(job);
    }

    this.processing = false;
    this.emit('queue:drained');
  }

  async processJob(job) {
    job.status = 'processing';
    job.attempts++;
    this.emit('job:started', job);

    try {
      const result = await this.handler(job.data);
      job.status = 'completed';
      job.result = result;
      this.emit('job:completed', job);
    } catch (error) {
      job.error = error.message;

      if (job.attempts < job.maxRetries) {
        job.status = 'retrying';
        await this.sleep(this.retryDelay * job.attempts);
        this.jobs.unshift(job);
        this.emit('job:retry', job);
      } else {
        job.status = 'failed';
        this.emit('job:failed', job);
      }
    } finally {
      this.activeJobs--;
    }
  }

  getStatus() {
    return {
      name: this.name,
      pending: this.jobs.filter(j => j.status === 'pending').length,
      processing: this.activeJobs,
      total: this.jobs.length
    };
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { Queue };
