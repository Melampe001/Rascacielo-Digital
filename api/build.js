/**
 * Build Agent API Endpoint
 * Vercel Serverless Function
 */

const BuildAgent = require('../agents/build-agent');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS']
    });
  }

  try {
    const params = req.body || {};

    const buildAgent = new BuildAgent({
      verbose: true
    });

    const result = await buildAgent.build(params);

    res.status(200).json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Build Agent Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
