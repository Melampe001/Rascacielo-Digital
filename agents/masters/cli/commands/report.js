/**
 * Report Command
 * Generates validation reports
 */

const Reporter = require('../../core/reporter');
const chalk = require('chalk');

module.exports = function(program) {
  program
    .command('report')
    .description('Generate validation report from results')
    .option('-i, --input <file>', 'Input JSON file with validation results', null)
    .option('-f, --format <format>', 'Report format: text|json|markdown|html', 'text')
    .option('-o, --output <file>', 'Output file', null)
    .action(async (options) => {
      try {
        if (!options.input) {
          console.error(chalk.red('Error: Input file required. Use -i or --input'));
          console.log(chalk.gray('\nExample: rascacielo report -i validation.json -f markdown'));
          process.exit(1);
        }

        const fs = require('fs');
        
        if (!fs.existsSync(options.input)) {
          console.error(chalk.red(`Error: Input file not found: ${options.input}`));
          process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(options.input, 'utf8'));
        
        if (!data.summary) {
          console.error(chalk.red('Error: Invalid input file. Must contain validation results with summary.'));
          process.exit(1);
        }

        const reporter = new Reporter({ format: options.format });
        const report = reporter.generate(data.summary, options.format);

        if (options.output) {
          await reporter.save(data.summary, options.output, options.format);
          console.log(chalk.green(`✅ Report saved to: ${options.output}`));
        } else {
          console.log(report);
        }

      } catch (error) {
        console.error(chalk.red('\nError: ' + error.message));
        process.exit(1);
      }
    });
};
