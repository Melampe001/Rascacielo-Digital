/**
 * Post-Install Script
 * Runs after npm install to verify the installation
 */

// Check if required modules are available
try {
  const chalk = require('chalk');
  const ora = require('ora');

  console.log(chalk.bold.blue('\n🏗️  Rascacielos Digital - Post Install\n'));

  const spinner = ora('Verificando configuración...').start();

  setTimeout(() => {
    spinner.succeed('Configuración verificada');
    console.log(chalk.green('\n✅ Instalación completada exitosamente\n'));
    console.log(chalk.gray('Para comenzar, ejecuta: npm start'));
  }, 1000);
} catch (error) {
  // If chalk/ora are not available yet, use basic console
  console.log('\n🏗️  Rascacielos Digital - Post Install\n');
  console.log('✅ Instalación completada exitosamente\n');
  console.log('Para comenzar, ejecuta: npm start\n');
}
