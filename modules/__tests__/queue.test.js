/**
 * Queue Module Tests
 */

const { JobQueue } = require('../queue');

describe('JobQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new JobQueue({ concurrency: 2 });
  });

  afterEach(async () => {
    if (queue.running) {
      await queue.stop();
    }
  });

  test('should create queue with config', () => {
    expect(queue.config.concurrency).toBe(2);
    expect(queue.queue).toEqual([]);
  });

  test('should register job handler', () => {
    const handler = jest.fn();
    queue.registerHandler('test-job', handler);
    expect(queue.handlers.has('test-job')).toBe(true);
  });

  test('should add job to queue', async () => {
    const job = await queue.addJob('test-job', { data: 'test' });
    expect(job.id).toBeDefined();
    expect(job.type).toBe('test-job');
    expect(job.status).toBe('pending');
  });

  test('should process jobs', async () => {
    const handler = jest.fn(async data => {
      return { success: true };
    });

    queue.registerHandler('test-job', handler);
    await queue.addJob('test-job', { data: 'test' });

    queue.start();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(handler).toHaveBeenCalled();
  });

  test('should respect job priority', async () => {
    const results = [];
    const handler = jest.fn(async data => {
      results.push(data.priority);
    });

    queue.registerHandler('test-job', handler);

    await queue.addJob('test-job', { priority: 1 }, { priority: 1 });
    await queue.addJob('test-job', { priority: 3 }, { priority: 3 });
    await queue.addJob('test-job', { priority: 2 }, { priority: 2 });

    queue.start();
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(results).toEqual([3, 2, 1]);
  });

  test('should get queue stats', async () => {
    await queue.addJob('test-job', {});
    await queue.addJob('test-job', {});

    const stats = queue.getStats();
    expect(stats.pending).toBe(2);
    expect(stats.total).toBe(2);
  });

  test('should emit events', async () => {
    const addedSpy = jest.fn();
    queue.on('job:added', addedSpy);

    await queue.addJob('test-job', {});
    expect(addedSpy).toHaveBeenCalled();
  });

  test('should generate unique job IDs', () => {
    const id1 = queue.generateJobId();
    const id2 = queue.generateJobId();
    expect(id1).not.toBe(id2);
  });
});
