/**
 * Job Queue Module
 * Event-driven job queue for asynchronous task processing
 */

const EventEmitter = require('events');

class JobQueue extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      concurrency: config.concurrency || 1,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      ...config
    };

    this.queue = [];
    this.processing = [];
    this.completed = [];
    this.failed = [];
    this.handlers = new Map();
    this.running = false;
  }

  /**
   * Register a job handler
   */
  registerHandler(jobType, handler) {
    this.handlers.set(jobType, handler);
    return this;
  }

  /**
   * Add a job to the queue
   */
  async addJob(jobType, data = {}, options = {}) {
    const job = {
      id: this.generateJobId(),
      type: jobType,
      data,
      status: 'pending',
      retries: 0,
      maxRetries: options.maxRetries || this.config.maxRetries,
      priority: options.priority || 0,
      createdAt: Date.now(),
      ...options
    };

    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority);

    this.emit('job:added', job);

    if (this.running) {
      this.processNext();
    }

    return job;
  }

  /**
   * Start processing jobs
   */
  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.emit('queue:started');

    // Start concurrent workers
    for (let i = 0; i < this.config.concurrency; i++) {
      this.processNext();
    }
  }

  /**
   * Stop processing jobs
   */
  async stop() {
    this.running = false;
    this.emit('queue:stopped');

    // Wait for current jobs to complete
    while (this.processing.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Process next job in queue
   */
  async processNext() {
    if (!this.running || this.queue.length === 0) {
      return;
    }

    if (this.processing.length >= this.config.concurrency) {
      return;
    }

    const job = this.queue.shift();
    if (!job) {
      return;
    }

    this.processing.push(job);
    job.status = 'processing';
    job.startedAt = Date.now();

    this.emit('job:started', job);

    try {
      await this.executeJob(job);
      job.status = 'completed';
      job.completedAt = Date.now();
      this.completed.push(job);
      this.emit('job:completed', job);
    } catch (error) {
      await this.handleJobError(job, error);
    } finally {
      const index = this.processing.indexOf(job);
      if (index > -1) {
        this.processing.splice(index, 1);
      }

      // Process next job
      if (this.running) {
        this.processNext();
      }
    }
  }

  /**
   * Execute a job
   */
  async executeJob(job) {
    const handler = this.handlers.get(job.type);

    if (!handler) {
      throw new Error(`No handler registered for job type: ${job.type}`);
    }

    return await handler(job.data, job);
  }

  /**
   * Handle job error
   */
  async handleJobError(job, error) {
    job.retries++;
    job.lastError = error.message;

    if (job.retries < job.maxRetries) {
      job.status = 'retrying';
      this.emit('job:retry', job);

      // Re-add to queue with delay
      await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * job.retries));
      this.queue.unshift(job);
      const index = this.processing.indexOf(job);
      if (index > -1) {
        this.processing.splice(index, 1);
      }
    } else {
      job.status = 'failed';
      job.failedAt = Date.now();
      this.failed.push(job);
      this.emit('job:failed', job, error);
    }
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      pending: this.queue.length,
      processing: this.processing.length,
      completed: this.completed.length,
      failed: this.failed.length,
      total: this.queue.length + this.processing.length + this.completed.length + this.failed.length
    };
  }

  /**
   * Clear completed jobs
   */
  clearCompleted() {
    const count = this.completed.length;
    this.completed = [];
    return count;
  }

  /**
   * Clear failed jobs
   */
  clearFailed() {
    const count = this.failed.length;
    this.failed = [];
    return count;
  }

  /**
   * Generate unique job ID
   */
  generateJobId() {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = JobQueue;
