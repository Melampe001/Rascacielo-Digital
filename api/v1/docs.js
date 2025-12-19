// api/v1/docs.js - OpenAPI/Swagger documentation

module.exports = (req, res) => {
  const apiDocs = {
    openapi: '3.0.0',
    info: {
      title: 'Rascacielo Digital API',
      version: '1.0.0',
      description: 'Enterprise-grade agents API'
    },
    servers: [
      {
        url: process.env.VERCEL_URL || 'http://localhost:3000',
        description: 'Production server'
      }
    ],
    paths: {
      '/api/v1/agents': {
        post: {
          summary: 'Execute agent action',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    agent: { type: 'string', enum: ['build', 'security', 'orchestrator'] },
                    action: { type: 'string' },
                    params: { type: 'object' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful operation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      agent: { type: 'string' },
                      result: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  res.status(200).json(apiDocs);
};
