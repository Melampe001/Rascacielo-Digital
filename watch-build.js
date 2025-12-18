/**
 * File Watcher for Idempotent Build
 */

const chokidar = require('chokidar');
const IdempotentBuild = require('./build-idempotent');

const builder = new IdempotentBuild({ verbose: true });
let buildQueued = false;
let buildTimeout = null;

const watcher = chokidar.watch(['agents/**/*.js', 'modules/**/*.js', 'config/**/*.js', 'index.js', 'package.json'], {
  ignored: ['**/*.test.js', '**/*.spec.js', '**/node_modules/**', '**/dist/**'],
  persistent: true,
  ignoreInitial: true
});

console.log('👀 Watching for file changes...\n');

watcher.on('all', (event, path) => {
  console.log(`📝 ${event}: ${path}`);
  
  if (buildTimeout) {
    clearTimeout(buildTimeout);
  }

  buildTimeout = setTimeout(async () => {
    if (!buildQueued) {
      buildQueued = true;
      console.log('\n🔨 Building...\n');
      
      try {
        await builder.build();
        console.log('✅ Build completed\n');
      } catch (error) {
        console.error('❌ Build failed:', error.message, '\n');
      }
      
      buildQueued = false;
    }
  }, 1000);
});

watcher.on('error', error => console.error('Watcher error:', error));

process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping watcher...');
  watcher.close();
  process.exit(0);
});
