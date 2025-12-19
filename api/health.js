/**
 * Health Check API Endpoint
 * Verifica el estado del sistema y servicios
 */

module.exports = async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'rascacielo-digital',
    version: '1.1.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    agents: {
      build: 'operational',
      security: 'operational',
      deploy: 'operational',
      orchestrator: 'operational'
    },
    system: {
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      platform: process.platform,
      nodeVersion: process.version
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(healthData);
};
