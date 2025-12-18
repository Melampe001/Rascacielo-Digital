/**
 * Queue Module Tests
 */

const { Queue } = require('../queue');

describe('Queue', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue('test-queue', { concurrency: 2 });
  });

  test('should create queue with config', () => {
    expect(queue.name).toBe('test-queue');
    expect(queue.concurrency).toBe(2);
    expect(queue.jobs).toEqual([]);
  });

  test('should set handler', () => {
    const handler = jest.fn();
    queue.setHandler(handler);
    expect(queue.handler).toBe(handler);
  });

  test('should throw error if handler is not a function', () => {
    expect(() => queue.setHandler('not a function')).toThrow('Handler must be a function');
  });

  test('should add job to queue', async () => {
    const handler = jest.fn(async () => 'result');
    queue.setHandler(handler);
    
    const jobId = await queue.add({ data: 'test' });
    expect(typeof jobId).toBe('string');
    expect(jobId).toContain('-');
  });

  test('should emit job:added event', async () => {
    const handler = jest.fn(async () => 'result');
    queue.setHandler(handler);
    
    const addedSpy = jest.fn();
    queue.on('job:added', addedSpy);

    await queue.add({ data: 'test' });
    expect(addedSpy).toHaveBeenCalled();
  });

  test('should get queue status', async () => {
    const handler = jest.fn(async () => 'result');
    queue.setHandler(handler);
    
    await queue.add({ data: 'test1' });
    await queue.add({ data: 'test2' });

    const status = queue.getStatus();
    expect(status.name).toBe('test-queue');
    expect(status.pending).toBeGreaterThanOrEqual(0);
  });

  test('should generate unique job IDs', () => {
    const id1 = queue.generateId();
    const id2 = queue.generateId();
    expect(id1).not.toBe(id2);
  });

  test('should have sleep method', async () => {
    const start = Date.now();
    await queue.sleep(50);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(40);
  });
});
