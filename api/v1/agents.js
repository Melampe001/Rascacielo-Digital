// api/v1/agents.js - Exponer agentes via REST API

const BuildAgent = require('../../agents/build-agent');
const SecurityAgent = require('../../agents/security-agent');
const OrchestratorAgent = require('../../agents/orchestrator-agent');

module.exports = async (req, res) => {
  // CORS para Flutter Web
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { agent, action, params } = req.body;

  try {
    let result;
    
    switch (agent) {
      case 'build':
        const buildAgent = new BuildAgent();
        result = await buildAgent.build(params);
        break;
        
      case 'security':
        const securityAgent = new SecurityAgent();
        result = await securityAgent.scan(params);
        break;
        
      case 'orchestrator':
        const orchestrator = new OrchestratorAgent();
        result = await orchestrator.executeFullPipeline(params);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid agent' });
    }

    res.status(200).json({
      success: true,
      agent,
      action,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
