/**
 * Scripts Agent - Rascacielo Digital
 * 
 * Automation script generation and task scheduling
 */

const BaseAgent = require('../shared/base-agent');
const { CATEGORY, PRIORITY } = require('../shared/constants');

class ScriptsAgent extends BaseAgent {
  constructor(config = {}) {
    super({
      name: 'Scripts',
      version: '1.0.0',
      category: CATEGORY.DEVELOPMENT,
      priority: PRIORITY.CRITICAL,
      description: 'Automation scripts and task generation',
      certifications: ['Shell Scripting', 'Task Automation'],
      ...config
    });
  }

  async execute(context) {
    this.logger.info('Generating automation scripts...');

    const result = {
      scripts: {},
      automation: [],
      documentation: '',
      schedule: []
    };

    // Generar diferentes tipos de scripts
    result.scripts = {
      setup: await this._generateSetupScript(context),
      deploy: await this._generateDeployScript(context),
      backup: await this._generateBackupScript(context),
      cleanup: await this._generateCleanupScript(context),
      migration: await this._generateMigrationScript(context)
    };

    // Tareas de automatización
    result.automation = await this._defineAutomationTasks(context);

    // Programación de tareas
    result.schedule = await this._scheduleTasks(context);

    // Documentación
    result.documentation = this._generateDocumentation(result.scripts);

    this.logger.success(`Generated ${Object.keys(result.scripts).length} scripts`);

    return result;
  }

  async _generateSetupScript(_context) {
    return `#!/bin/bash
# Setup Script - Rascacielo Digital

echo "Setting up project..."

# Install dependencies
npm install

# Setup environment
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file"
fi

# Run migrations
npm run migrate

# Build project
npm run build

echo "Setup completed successfully!"
`;
  }

  async _generateDeployScript(_context) {
    return `#!/bin/bash
# Deploy Script - Rascacielo Digital

set -e

echo "Starting deployment..."

# Run tests
npm test

# Build
npm run build

# Deploy to server
rsync -avz dist/ user@server:/var/www/app/

# Restart service
ssh user@server 'systemctl restart app'

echo "Deployment completed!"
`;
  }

  async _generateBackupScript(_context) {
    return `#!/bin/bash
# Backup Script - Rascacielo Digital

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

echo "Creating backup..."

# Backup database
pg_dump dbname > $BACKUP_DIR/database.sql

# Backup files
tar -czf $BACKUP_DIR/files.tar.gz /var/www/app

echo "Backup completed: $BACKUP_DIR"
`;
  }

  async _generateCleanupScript(_context) {
    return `#!/bin/bash
# Cleanup Script - Rascacielo Digital

echo "Cleaning up..."

# Remove old logs
find /var/log/app -name "*.log" -mtime +30 -delete

# Remove old backups
find /backups -mtime +90 -delete

# Clean cache
rm -rf /tmp/cache/*

# Clean node_modules (optional)
# rm -rf node_modules
# npm install

echo "Cleanup completed!"
`;
  }

  async _generateMigrationScript(_context) {
    return `#!/bin/bash
# Migration Script - Rascacielo Digital

echo "Running migrations..."

# Backup before migration
./scripts/backup.sh

# Run migrations
npm run migrate:up

# Verify migration
npm run migrate:status

echo "Migration completed!"
`;
  }

  async _defineAutomationTasks(_context) {
    return [
      {
        name: 'daily-backup',
        command: './scripts/backup.sh',
        schedule: 'daily',
        description: 'Daily database and file backup'
      },
      {
        name: 'weekly-cleanup',
        command: './scripts/cleanup.sh',
        schedule: 'weekly',
        description: 'Weekly cleanup of old files and logs'
      },
      {
        name: 'dependency-update',
        command: 'npm update && npm audit fix',
        schedule: 'monthly',
        description: 'Monthly dependency updates'
      }
    ];
  }

  async _scheduleTasks(context) {
    return [
      '0 2 * * * /path/to/backup.sh',  // Daily at 2 AM
      '0 3 * * 0 /path/to/cleanup.sh', // Weekly on Sunday at 3 AM
      '0 4 1 * * npm update'            // Monthly on 1st at 4 AM
    ];
  }

  _generateDocumentation(_scripts) {
    return `
# Automation Scripts

## Available Scripts

### setup.sh
Sets up the project environment, installs dependencies, and prepares the application.

Usage: \`./scripts/setup.sh\`

### deploy.sh
Deploys the application to the production server.

Usage: \`./scripts/deploy.sh\`

### backup.sh
Creates backups of database and application files.

Usage: \`./scripts/backup.sh\`

### cleanup.sh
Cleans up old logs, caches, and temporary files.

Usage: \`./scripts/cleanup.sh\`

### migration.sh
Runs database migrations.

Usage: \`./scripts/migration.sh\`

## Scheduling

To schedule automated tasks, add these cron entries:

\`\`\`
0 2 * * * /path/to/backup.sh
0 3 * * 0 /path/to/cleanup.sh
\`\`\`
    `.trim();
  }
}

module.exports = ScriptsAgent;
