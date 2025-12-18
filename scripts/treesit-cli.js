#!/usr/bin/env node

/**
 * Treesit Cloud CLI
 * Command-line interface for managing Treesit Cloud deployments
 */

const DeployAgent = require('../agents/deploy-agent');
const TreesitClient = require('../modules/treesit-client');

const commands = {
  deploy: async () => {
    console.log('🚀 Deploying to Treesit Cloud...');
    const agent = new DeployAgent();
    const result = await agent.deploy();
    console.log('✅ Deployment successful:', result);
  },

  status: async () => {
    console.log('📊 Checking deployment status...');
    const agent = new DeployAgent();
    const status = await agent.getStatus();
    console.log('Status:', JSON.stringify(status, null, 2));
  },

  rollback: async () => {
    console.log('🔄 Rolling back deployment...');
    const agent = new DeployAgent();
    await agent.rollback();
    console.log('✅ Rollback successful');
  },

  logs: async () => {
    console.log('📝 Fetching logs...');
    const client = new TreesitClient();
    const logs = await client.getLogs(50);
    console.log(logs);
  },

  health: async () => {
    console.log('🏥 Checking Treesit Cloud health...');
    const client = new TreesitClient();
    const health = await client.healthCheck();
    console.log(health.healthy ? '✅ Healthy' : '❌ Unhealthy');
  }
};

const command = process.argv[2];

if (!command || !commands[command]) {
  console.log('Usage: node scripts/treesit-cli.js <command>');
  console.log('Commands:', Object.keys(commands).join(', '));
  process.exit(1);
}

commands[command]().catch(error => {
  console.error('❌ Error:', error);
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  process.exit(1);
});
