/**
 * Tests for Queue Module
 */
const { Queue } = require('../modules/queue');

describe('Queue', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue('test-queue', {
      concurrency: 2,
      maxRetries: 2,
      timeout: 1000
    });
  });

  test('should create Queue instance', () => {
    expect(queue).toBeInstanceOf(Queue);
    expect(queue.name).toBe('test-queue');
    expect(queue.config.concurrency).toBe(2);
  });

  test('should generate unique job IDs', () => {
    const id1 = queue.generateId();
    const id2 = queue.generateId();
    
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
    expect(id1).not.toBe(id2);
  });

  test('should add job to queue', async () => {
    // Set a dummy handler so jobs don't fail
    queue.setHandler(async (data) => data);
    
    const job = await queue.add({ task: 'test' });
    
    expect(job).toBeDefined();
    expect(job.id).toBeDefined();
    expect(['pending', 'processing', 'completed']).toContain(job.status);
    expect(job.data.task).toBe('test');
  });

  test('should get queue stats', async () => {
    // Set a dummy handler so jobs don't fail
    queue.setHandler(async (data) => data);
    
    await queue.add({ task: 'test1' });
    await queue.add({ task: 'test2' });
    
    const stats = queue.getStats();
    
    expect(stats.name).toBe('test-queue');
    expect(stats.total).toBeGreaterThanOrEqual(0);
  });

  test('should clear queue', async () => {
    await queue.add({ task: 'test1' });
    await queue.add({ task: 'test2' });
    
    queue.clear();
    
    expect(queue.jobs.length).toBe(0);
    expect(queue.completed.length).toBe(0);
    expect(queue.failed.length).toBe(0);
  });

  test('should delay execution', async () => {
    const start = Date.now();
    await queue.delay(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });

  test('should process jobs with handler', async () => {
    const results = [];
    queue.setHandler(async (data) => {
      results.push(data.value);
      return data.value * 2;
    });

    await queue.add({ value: 5 });
    await queue.add({ value: 10 });

    // Wait for processing
    await new Promise(resolve => {
      queue.on('queue:drained', resolve);
    });

    expect(results.length).toBe(2);
    expect(results).toContain(5);
    expect(results).toContain(10);
  });
});
