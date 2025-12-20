#!/usr/bin/env node

/**
 * Verify Installation Script - Rascacielos Digital
 *
 * Verifica que todos los agentes estén instalados y operacionales
 */

const ImperialInstallerAgent = require('../agents/supreme/imperial-installer-agent');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando instalación de Imperial Supreme Elite Agents...\n');

async function verify() {
  const agent = new ImperialInstallerAgent();

  try {
    // Run verification
    const result = await agent.verifyInstallation();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('                  VERIFICACIÓN DE INSTALACIÓN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check node_modules
    console.log(`📦 node_modules:       ${result.checks.nodeModules ? '✅ OK' : '❌ MISSING'}`);
    console.log(`📄 package.json:       ${result.checks.packageJson ? '✅ OK' : '❌ MISSING'}`);
    console.log(`🤖 agents/ directory:  ${result.checks.agentsDir ? '✅ OK' : '❌ MISSING'}`);
    console.log(`📜 scripts/ directory: ${result.checks.scriptsDir ? '✅ OK' : '❌ MISSING'}`);

    // Check Supreme agents
    console.log('\n🏛️  SUPREME AGENTS:');
    const supremeAgents = [
      'imperial-installer-agent.js',
      'supreme-orchestrator-agent.js',
      'imperial-dependency-guardian-agent.js',
      'elite-code-quality-agent.js',
      'imperial-documentation-generator-agent.js'
    ];

    let supremeOk = 0;
    supremeAgents.forEach(agent => {
      const agentPath = path.join(process.cwd(), 'agents', 'supreme', agent);
      const exists = fs.existsSync(agentPath);
      console.log(`  ${exists ? '✅' : '❌'} ${agent.replace('.js', '')}`);
      if (exists) supremeOk++;
    });

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('                        RESUMEN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`🎯 Estado general:        ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🤖 Agentes operacionales: ${result.agentsOperational}`);
    console.log(`🏛️  Supreme Agents:       ${supremeOk}/${supremeAgents.length}`);
    console.log(`📊 Integridad:            ${result.passed ? '100%' : 'INCOMPLETE'}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (result.passed) {
      console.log('✅ ¡Instalación verificada correctamente!\n');
      process.exit(0);
    } else {
      console.log('❌ La instalación está incompleta. Ejecuta "npm run imperial:install"\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error durante verificación:', error.message, '\n');
    process.exit(1);
  }
}

verify();
