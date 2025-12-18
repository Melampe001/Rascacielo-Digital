export default function handler(req, res) {
  // CORS headers - allowing all origins for health check endpoint
  // In production, consider restricting to specific domains via environment variables
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    agents: {
      build: 'operational',
      security: 'operational',
      consolidation: 'operational'
    }
  };
  
  res.status(200).json(healthData);
}
