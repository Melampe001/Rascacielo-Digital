/**
 * API Index - Rascacielos Digital
 * Serverless function entry point for Vercel
 */

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  
  const response = {
    name: 'Rascacielos Digital API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      status: '/api/status',
      info: '/api/info'
    }
  };

  res.status(200).json(response);
};
