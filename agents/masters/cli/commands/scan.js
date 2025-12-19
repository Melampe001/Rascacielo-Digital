/**
 * Scan Command
 * Scans project and detects technologies
 */

const TechnologyScanner = require('../../core/scanner');
const chalk = require('chalk');
const ora = require('ora');

module.exports = function(program) {
  program
    .command('scan')
    .description('Scan project and detect technologies')
    .option('-p, --path <path>', 'Project path', '.')
    .option('-o, --output <format>', 'Output format: json|text', 'text')
    .option('-v, --verbose', 'Verbose output', false)
    .option('--depth <number>', 'Scan depth', '2')
    .action(async (options) => {
      const spinner = ora('Scanning project...').start();

      try {
        const scanner = new TechnologyScanner({
          verbose: options.verbose,
          depth: parseInt(options.depth, 10)
        });

        const technologies = await scanner.scan(options.path);
        const summary = scanner.getSummary(technologies);

        spinner.succeed('Scan completed!');

        if (options.output === 'json') {
          console.log(JSON.stringify({ technologies, summary }, null, 2));
        } else {
          console.log('\n' + chalk.bold.cyan('🏛️  RASCACIELO DIGITAL - TECHNOLOGY SCAN'));
          console.log(chalk.gray('='.repeat(60)) + '\n');

          console.log(chalk.bold(`Total Technologies: ${summary.total}`));
          console.log(chalk.bold(`Categories: ${summary.categories}\n`));

          for (const { category, count, technologies: techs } of summary.byCategory) {
            console.log(chalk.bold.green(`📦 ${category} (${count}):`));
            techs.forEach(tech => {
              console.log(`   - ${tech}`);
            });
            console.log('');
          }

          console.log(chalk.gray(`Scanned: ${options.path}`));
        }

      } catch (error) {
        spinner.fail('Scan failed!');
        console.error(chalk.red('\nError: ' + error.message));
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
};
