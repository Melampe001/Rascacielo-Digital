/**
 * List Command
 * Lists all available master agents
 */

const Orchestrator = require('../../core/orchestrator');
const chalk = require('chalk');
const ora = require('ora');

module.exports = function(program) {
  program
    .command('list')
    .description('List all available master agents')
    .option('-c, --category <category>', 'Filter by category', null)
    .option('-v, --verbose', 'Show detailed information', false)
    .action(async (options) => {
      const spinner = ora('Loading agents...').start();

      try {
        const orchestrator = new Orchestrator({ verbose: false });
        await orchestrator.loadAllAgents();
        const stats = orchestrator.getStats();
        const agents = orchestrator.listAgents();

        spinner.succeed('Agents loaded!');

        console.log('\n' + chalk.bold.cyan('🏛️  RASCACIELO DIGITAL - MASTER AGENTS'));
        console.log(chalk.gray('='.repeat(60)) + '\n');

        console.log(chalk.bold(`Total Agents: ${stats.total}`));
        console.log(chalk.bold(`Categories: ${stats.categories}`));
        console.log(chalk.bold(`Enabled: ${stats.enabled}\n`));

        if (options.category) {
          const filtered = agents.filter(a => a.category === options.category);
          console.log(chalk.bold.green(`📦 ${options.category} (${filtered.length}):\n`));
          
          filtered.forEach(agent => {
            console.log(chalk.bold(`  ${agent.name}`));
            if (options.verbose && agent.expertise) {
              agent.expertise.slice(0, 3).forEach(exp => {
                console.log(chalk.gray(`    - ${exp}`));
              });
            }
          });
        } else {
          // Group by category
          const byCategory = {};
          agents.forEach(agent => {
            if (!byCategory[agent.category]) {
              byCategory[agent.category] = [];
            }
            byCategory[agent.category].push(agent);
          });

          for (const [category, categoryAgents] of Object.entries(byCategory).sort()) {
            console.log(chalk.bold.green(`📦 ${category} (${categoryAgents.length}):`));
            categoryAgents.forEach(agent => {
              const status = agent.enabled ? chalk.green('✓') : chalk.red('✗');
              console.log(`   ${status} ${agent.name}`);
              if (options.verbose && agent.expertise) {
                agent.expertise.slice(0, 2).forEach(exp => {
                  console.log(chalk.gray(`      - ${exp}`));
                });
              }
            });
            console.log('');
          }
        }

        console.log(chalk.gray('Use --category to filter by specific category'));
        console.log(chalk.gray('Use --verbose for detailed information'));

      } catch (error) {
        spinner.fail('Failed to load agents!');
        console.error(chalk.red('\nError: ' + error.message));
        if (options.verbose) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });
};
