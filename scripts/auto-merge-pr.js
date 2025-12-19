#!/usr/bin/env node
/**
 * Auto-merge PR Script
 * 
 * Script CLI para ejecutar el PR Automation Agent
 * Uso: node scripts/auto-merge-pr.js [PR_NUMBER]
 */

const PRAutomationAgent = require('../agents/pr-automation-agent');

// Obtener número de PR desde argumentos
const prNumber = parseInt(process.argv[2], 10);

if (!prNumber || isNaN(prNumber)) {
  console.error('❌ Error: Debes proporcionar un número de PR válido');
  console.error('');
  console.error('Uso: node scripts/auto-merge-pr.js [PR_NUMBER]');
  console.error('Ejemplo: node scripts/auto-merge-pr.js 40');
  console.error('');
  process.exit(1);
}

// Verificar que GITHUB_TOKEN esté configurado
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN no está configurado');
  console.error('');
  console.error('Configura la variable de entorno GITHUB_TOKEN:');
  console.error('  export GITHUB_TOKEN=ghp_xxxxxxxxxxxx');
  console.error('');
  process.exit(1);
}

(async () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🤖 PR Automation Agent - Auto-merging PR #${prNumber}`);
  console.log(`${'='.repeat(60)}\n`);
  
  const agent = new PRAutomationAgent({
    owner: 'Melampe001',
    repo: 'Rascacielo-Digital'
  });

  try {
    const result = await agent.autoMergePR(prNumber, {
      waitForChecks: true,
      commitMessage: '✅ Auto-merged via PR Automation Agent',
      maxAttempts: 30,
      intervalMs: 10000
    });

    if (result.success) {
      console.log(`${'='.repeat(60)}`);
      console.log('✅ PR merged successfully!');
      console.log(`${'='.repeat(60)}`);
      console.log('');
      console.log(`PR #${result.prNumber} has been merged and branch '${result.branch}' deleted`);
      console.log(`Merge commit: ${result.mergeCommit}`);
      console.log(`Duration: ${result.duration}ms`);
      console.log('');
      process.exit(0);
    } else {
      console.log(`${'='.repeat(60)}`);
      console.error('❌ Auto-merge failed');
      console.log(`${'='.repeat(60)}`);
      console.log('');
      console.error(`Error: ${result.error}`);
      console.log('');
      process.exit(1);
    }
  } catch (error) {
    console.log(`${'='.repeat(60)}`);
    console.error('❌ Fatal error during auto-merge');
    console.log(`${'='.repeat(60)}`);
    console.log('');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.log('');
    process.exit(1);
  }
})();
