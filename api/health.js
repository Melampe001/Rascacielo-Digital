/**
 * Health Check Endpoint
 * Vercel Serverless Function
 */

module.exports = async (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    agents: {
      build: 'active',
      security: 'active',
      elara: 'pending'
    },
    uptime: process.uptime()
  });
};
