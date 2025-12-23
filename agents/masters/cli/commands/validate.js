/**
 * Validate Command
 * Validates a project using appropriate master agents
 */

const AutoValidator = require('../../automation/auto-validator');
const chalk = require('chalk');
const ora = require('ora');

module.exports = function(program) {
  program
    .command('validate')
    .description('Validate project with master agents')
    .option('-p, --path <path>', 'Project path', '.')
    .option('-o, --output <format>', 'Output format: text|json|markdown', 'text')
    .option('-v, --verbose', 'Verbose output', false)
    .option('--min-score <number>', 'Minimum required score', '70')
    .option('--save', 'Save validation results to disk', false)
    .action(async (options) => {
      const spinner = ora('Initializing validation...').start();

      try {
        const validator = new AutoValidator({
          verbose: options.verbose,
          generateBadge: true,
          generateReport: true,
          reportFormat: options.output,
          minScore: parseInt(options.minScore, 10)
        });

        spinner.text = 'Running validation...';
        const result = await validator.validate(options.path);

        spinner.succeed('Validation completed!');

        if (options.output === 'json') {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log('\n' + chalk.bold.cyan('🏛️  RASCACIELO DIGITAL - VALIDATION REPORT'));
          console.log(chalk.gray('='.repeat(60)) + '\n');
          
          const gradeColor = getGradeColor(result.summary.grade);
          console.log(chalk.bold('Overall Grade: ') + chalk[gradeColor](result.summary.grade));
          console.log(chalk.bold('Score: ') + chalk[gradeColor](`${result.summary.score}%`));
          console.log(chalk.bold('Status: ') + (result.summary.valid ? chalk.green('✅ PASSED') : chalk.red('❌ FAILED')));
          console.log('');
          
          console.log(chalk.bold('Checks:'));
          console.log(`  Total:  ${result.summary.totalChecks}`);
          console.log(`  Passed: ${chalk.green(result.summary.passedChecks + ' ✅')}`);
          console.log(`  Failed: ${chalk.red(result.summary.failedChecks + ' ❌')}`);
          console.log('');

          if (result.badge) {
            console.log(chalk.bold('Badge:'));
            console.log(`  ${result.badge.markdown}`);
            console.log('');
          }

          if (result.summary.issues && result.summary.issues.length > 0) {
            console.log(chalk.bold.yellow(`⚠️  Issues Found (${result.summary.issues.length}):`));
            result.summary.issues.slice(0, 5).forEach((issue, i) => {
              console.log(`  ${i + 1}. ${chalk.gray(`[${issue.agent}]`)} ${issue.message}`);
            });
            if (result.summary.issues.length > 5) {
              console.log(chalk.gray(`  ... and ${result.summary.issues.length - 5} more`));
            }
            console.log('');
          }

          if (result.summary.recommendations && result.summary.recommendations.length > 0) {
            console.log(chalk.bold.blue(`💡 Top Recommendations:`));
            result.summary.recommendations.slice(0, 3).forEach((rec, i) => {
              console.log(`  ${i + 1}. ${chalk.gray(`[${rec.agent}]`)} ${rec.recommendation}`);
            });
            console.log('');
          }

          console.log(chalk.gray(`Duration: ${result.duration}ms`));
          console.log(chalk.gray(`Timestamp: ${result.timestamp}`));
        }

        // Save if requested
        if (options.save) {
          const saveSpinner = ora('Saving results...').start();
          await validator.saveValidation(options.path);
          saveSpinner.succeed('Results saved to ./validation-results/');
        }

        process.exit(result.summary.valid ? 0 : 1);

      } catch (error) {
        spinner.fail('Validation failed!');
        console.error(chalk.red('\nError: ' + error.message));
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
};

function getGradeColor(grade) {
  const colors = {
    PLATINUM: 'magenta',
    GOLD: 'yellow',
    SILVER: 'white',
    BRONZE: 'cyan',
    PENDING: 'gray'
  };
  return colors[grade] || 'gray';
}
