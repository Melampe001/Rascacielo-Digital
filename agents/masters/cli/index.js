#!/usr/bin/env node

/**
 * Rascacielo CLI - Command Line Interface
 * Main entry point for the Rascacielo Masters system
 */

const { program } = require('commander');
const packageJson = require('../package.json');

program
  .name('rascacielo')
  .description('🏛️ Sistema Imperial de Validación de Código - 71 Master Agents')
  .version(packageJson.version);

// Load commands
require('./commands/validate')(program);
require('./commands/scan')(program);
require('./commands/badge')(program);
require('./commands/report')(program);
require('./commands/list')(program);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
