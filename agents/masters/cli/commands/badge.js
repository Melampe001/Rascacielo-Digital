/**
 * Badge Command
 * Generates quality badges
 */

const BadgeGenerator = require('../../core/badge-generator');
const chalk = require('chalk');

module.exports = function(program) {
  program
    .command('badge')
    .description('Generate quality badge')
    .option('-s, --score <number>', 'Score (0-100)', null)
    .option('-f, --format <format>', 'Format: markdown|html|svg|json|shields|all', 'markdown')
    .option('--style <style>', 'Badge style: flat|flat-square|for-the-badge', 'for-the-badge')
    .option('-o, --output <file>', 'Output file (optional)', null)
    .action(async (options) => {
      try {
        const score = options.score ? parseInt(options.score, 10) : 90;

        if (score < 0 || score > 100) {
          console.error(chalk.red('Error: Score must be between 0 and 100'));
          process.exit(1);
        }

        const generator = new BadgeGenerator({ style: options.style });
        const badge = generator.generate(score, options.format);

        if (options.output) {
          const fs = require('fs');
          await generator.generateFile(score, options.format, options.output);
          console.log(chalk.green(`✅ Badge saved to: ${options.output}`));
        } else {
          if (options.format === 'all') {
            console.log(chalk.bold('\n🏛️  RASCACIELO BADGES\n'));
            console.log(chalk.bold('Markdown:'));
            console.log(badge.markdown + '\n');
            console.log(chalk.bold('HTML:'));
            console.log(badge.html + '\n');
            console.log(chalk.bold('Shields.io:'));
            console.log(badge.shields + '\n');
            console.log(chalk.bold('JSON:'));
            console.log(JSON.stringify(badge.json, null, 2));
          } else if (options.format === 'json') {
            console.log(JSON.stringify(badge, null, 2));
          } else {
            console.log(badge);
          }
        }

      } catch (error) {
        console.error(chalk.red('\nError: ' + error.message));
        process.exit(1);
      }
    });
};
