#!/usr/bin/env node

/**
 * CI/CD Rollback Script
 * Used by GitHub Actions to rollback failed deployments
 */

const DeployAgent = require('../agents/deploy-agent');

async function ciRollback() {
  try {
    console.log('🔄 Initiating automatic rollback...');
    
    const agent = new DeployAgent();
    await agent.rollback();
    
    console.log('✅ Rollback completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

ciRollback();
