/**
 * Queue Module
 * Event-driven job queue for asynchronous processing
 */

const JobQueue = require('./queue');

module.exports = {
  JobQueue,
  createQueue: config => new JobQueue(config)
};
