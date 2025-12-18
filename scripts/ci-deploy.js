#!/usr/bin/env node

/**
 * CI/CD Deployment Script
 * Used by GitHub Actions to deploy to Treesit Cloud
 */

const DeployAgent = require('../agents/deploy-agent');

async function ciDeploy() {
  try {
    console.log('🚀 Starting CI/CD deployment to Treesit Cloud...');
    
    const environment = process.env.DEPLOYMENT_ENV || 'production';
    const agent = new DeployAgent({ environment });
    
    const result = await agent.deploy();
    
    console.log('✅ Deployment successful:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

ciDeploy();
