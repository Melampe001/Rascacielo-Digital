#!/usr/bin/env node

/**
 * Treesit CLI - Command Line Interface for Treesit Cloud
 * Management tool for deployments
 */

const DeployAgent = require('../agents/deploy-agent');

const commands = {
  deploy: async () => {
    console.log('🚀 Deploying to Treesit Cloud...\n');

    const agent = new DeployAgent();
    try {
      const result = await agent.deploy();
      console.log('\n✅ Deployment successful!');
      console.log(`Deployment ID: ${result.deploymentId}`);
    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      process.exit(1);
    }
  },

  status: async () => {
    const deploymentId = process.argv[3];
    if (!deploymentId) {
      console.error('❌ Deployment ID required');
      console.log('Usage: npm run deploy:status <deployment-id>');
      process.exit(1);
    }

    console.log(`📊 Getting deployment status for ${deploymentId}...\n`);

    const agent = new DeployAgent();
    try {
      const status = await agent.getStatus(deploymentId);
      console.log('Status:', status.status);
      console.log('Region:', status.region);
      console.log('Environment:', status.environment);
      console.log('Instances:', status.instances);
    } catch (error) {
      console.error('❌ Failed to get status:', error.message);
      process.exit(1);
    }
  },

  rollback: async () => {
    const deploymentId = process.argv[3];
    const targetVersion = process.argv[4];

    if (!deploymentId) {
      console.error('❌ Deployment ID required');
      console.log('Usage: npm run deploy:rollback <deployment-id> [target-version]');
      process.exit(1);
    }

    console.log(`⏪ Rolling back deployment ${deploymentId}...\n`);

    const agent = new DeployAgent();
    try {
      await agent.rollback(deploymentId, targetVersion);
      console.log('✅ Rollback successful!');
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      process.exit(1);
    }
  },

  logs: async () => {
    const deploymentId = process.argv[3];
    const lines = parseInt(process.argv[4]) || 100;

    if (!deploymentId) {
      console.error('❌ Deployment ID required');
      console.log('Usage: npm run deploy:logs <deployment-id> [lines]');
      process.exit(1);
    }

    console.log(`📋 Getting logs for deployment ${deploymentId}...\n`);

    const agent = new DeployAgent();
    try {
      const logs = await agent.getLogs(deploymentId, { lines });
      console.log(logs.content || logs);
    } catch (error) {
      console.error('❌ Failed to get logs:', error.message);
      process.exit(1);
    }
  },

  health: async () => {
    const deploymentId = process.argv[3];

    if (!deploymentId) {
      console.error('❌ Deployment ID required');
      console.log('Usage: npm run deploy:health <deployment-id>');
      process.exit(1);
    }

    console.log(`🏥 Checking health for deployment ${deploymentId}...\n`);

    const agent = new DeployAgent();
    try {
      const health = await agent.runHealthChecks(deploymentId);

      if (health.healthy) {
        console.log('✅ Deployment is healthy');
      } else {
        console.log('❌ Deployment is unhealthy');
      }

      console.log('\nDetails:', JSON.stringify(health, null, 2));
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      process.exit(1);
    }
  },

  help: () => {
    console.log(`
Treesit CLI - Command Line Interface for Treesit Cloud

Usage:
  npm run deploy              Deploy to Treesit Cloud
  npm run deploy:status <id>  Get deployment status
  npm run deploy:rollback <id> [version]  Rollback deployment
  npm run deploy:logs <id> [lines]  Get deployment logs
  npm run deploy:health <id>  Check deployment health

Examples:
  npm run deploy
  npm run deploy:status dep_123456
  npm run deploy:rollback dep_123456
  npm run deploy:logs dep_123456 200
  npm run deploy:health dep_123456
    `);
  }
};

// Parse command
const command = process.argv[2];

if (!command || !commands[command]) {
  commands.help();
  process.exit(command ? 1 : 0);
}

// Execute command
commands[command]();
