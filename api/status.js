/**
 * Status Endpoint
 * Returns deployment and service status
 */

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const status = {
    service: 'rascacielos-digital',
    environment: process.env.NODE_ENV || 'development',
    region: process.env.VERCEL_REGION || 'unknown',
    deployment: {
      id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
      url: process.env.VERCEL_URL || 'localhost'
    },
    features: {
      api: true,
      agents: true,
      security: true,
      queue: true
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(status);
};
