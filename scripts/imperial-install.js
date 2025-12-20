#!/usr/bin/env node

/**
 * Imperial Install CLI - Rascacielos Digital
 * 
 * CLI para instalación del ecosistema Imperial Supreme Elite Agents
 */

const ImperialInstallerAgent = require('../agents/supreme/imperial-installer-agent');

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--')) || '--full';

// Banner
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🏛️  IMPERIAL SUPREME ELITE AGENTS 🏛️                 ║
║                                                              ║
║              Rascacielo Digital - v1.0.0                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

async function main() {
  const agent = new ImperialInstallerAgent();

  try {
    let result;

    switch (mode) {
    case '--full':
      console.log('🚀 Iniciando instalación COMPLETA (192 agentes)...\n');
      result = await agent.installFull();
      break;

    case '--minimal':
      console.log('⚡ Iniciando instalación MÍNIMA (40 agentes core)...\n');
      result = await agent.installMinimal();
      break;

    case '--custom': {
      console.log('🎯 Iniciando instalación PERSONALIZADA...\n');
      // En producción, aquí usaríamos inquirer para selección interactiva
      const selectedAgents = args.filter(arg => !arg.startsWith('--'));
      result = await agent.installCustom(selectedAgents);
      break;
    }

    case '--verify': {
      console.log('✅ Verificando instalación...\n');
      const verification = await agent.verifyInstallation();
      result = { verification };
      break;
    }

    case '--help':
      showHelp();
      process.exit(0);
      break; // eslint-disable-line no-unreachable

    default:
      console.error(`❌ Modo desconocido: ${mode}`);
      showHelp();
      process.exit(1);
    }

    // Show results
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    INSTALACIÓN EXITOSA                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    if (result.report) {
      console.log(`📊 Tipo: ${result.report.installationType.toUpperCase()}`);
      console.log(`⏱️  Duración: ${result.report.durationFormatted}`);
      console.log(`🤖 Agentes instalados: ${result.report.agentsInstalled}`);
      console.log(`✅ Estado: ${result.report.status}`);
      console.log(`📍 Node.js: ${result.report.nodeVersion}`);
      console.log(`💻 Plataforma: ${result.report.platform}`);
    }

    if (result.verification) {
      console.log(`\n✅ Verificación: ${result.verification.passed ? 'PASS' : 'FAIL'}`);
      console.log(`🤖 Agentes operacionales: ${result.verification.agentsOperational}`);
    }

    console.log('\n🎉 ¡Todo listo! Ejecuta "npm run supreme:orchestrate" para comenzar.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n╔══════════════════════════════════════════════════════════════╗');
    console.error('║                     ERROR DE INSTALACIÓN                     ║');
    console.error('╚══════════════════════════════════════════════════════════════╝\n');
    console.error(`❌ ${error.message}\n`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
📖 USO: node scripts/imperial-install.js [MODO] [OPCIONES]

MODOS:
  --full       Instalación completa (192 agentes) [por defecto]
  --minimal    Instalación mínima (40 agentes core)
  --custom     Instalación personalizada (interactiva)
  --verify     Verificar instalación existente
  --help       Mostrar esta ayuda

EJEMPLOS:
  node scripts/imperial-install.js --full
  node scripts/imperial-install.js --minimal
  node scripts/imperial-install.js --custom agent1 agent2
  node scripts/imperial-install.js --verify

NPM SCRIPTS:
  npm run imperial:install
  npm run imperial:install:minimal
  npm run imperial:install:custom
  npm run imperial:verify
`);
}

// Run
main();
