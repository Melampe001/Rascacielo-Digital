/**
 * Info Endpoint
 * Returns project information
 */

const pkg = require('../package.json');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const info = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository?.url || 'https://github.com/Melampe001/Rascacielo-Digital',
    engines: pkg.engines,
    modules: [
      'core',
      'api',
      'auth',
      'queue'
    ],
    agents: [
      'build-agent',
      'deploy-agent', 
      'security-agent'
    ]
  };

  res.status(200).json(info);
};
