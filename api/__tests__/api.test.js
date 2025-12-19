/**
 * Tests for API v1 endpoints
 */

const agentsHandler = require('../v1/agents');
const docsHandler = require('../v1/docs');

describe('API v1 Agents Endpoint', () => {
  let req, res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    };
  });

  test('should handle OPTIONS requests (CORS preflight)', async () => {
    req.method = 'OPTIONS';
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test('should set CORS headers', async () => {
    req.body = { agent: 'build', action: 'build', params: {} };
    
    await agentsHandler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  });

  test('should execute build agent', async () => {
    req.body = { agent: 'build', action: 'build', params: {} };
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        agent: 'build',
        result: expect.any(Object)
      })
    );
  });

  test('should execute security agent', async () => {
    req.body = { agent: 'security', action: 'scan', params: {} };
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        agent: 'security',
        result: expect.any(Object)
      })
    );
  });

  test('should execute orchestrator agent', async () => {
    req.body = { agent: 'orchestrator', action: 'pipeline', params: { deploy: false } };
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        agent: 'orchestrator',
        result: expect.any(Object)
      })
    );
  });

  test('should return 400 for invalid agent', async () => {
    req.body = { agent: 'invalid', action: 'test', params: {} };
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid agent'
      })
    );
  });

  test('should return 500 on agent error', async () => {
    req.body = { agent: 'build', action: 'build', params: { source: 123 } };
    
    await agentsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.any(String)
      })
    );
  });
});

describe('API v1 Docs Endpoint', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('should return OpenAPI documentation', () => {
    docsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        openapi: '3.0.0',
        info: expect.objectContaining({
          title: 'Rascacielo Digital API',
          version: '1.0.0'
        }),
        paths: expect.any(Object)
      })
    );
  });

  test('should include agents endpoint in documentation', () => {
    docsHandler(req, res);

    const docCall = res.json.mock.calls[0][0];
    expect(docCall.paths['/api/v1/agents']).toBeDefined();
    expect(docCall.paths['/api/v1/agents'].post).toBeDefined();
  });
});
