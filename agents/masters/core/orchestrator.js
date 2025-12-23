/**
 * Orchestrator - Rascacielo Digital
 * Central orchestrator for all master agents
 */

const fs = require('fs');
const path = require('path');

class Orchestrator {
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose || false,
      parallel: config.parallel !== false,
      maxConcurrency: config.maxConcurrency || 5,
      ...config
    };
    this.agents = new Map();
    this.loadedCategories = new Set();
  }

  /**
   * Load all master agents
   */
  async loadAllAgents() {
    const categories = [
      'languages', 'frontend', 'mobile', 'devops', 'cloud',
      'database', 'testing', 'security', 'backend', 'data-ml',
      'build-tools', 'version-control', 'design', 'formats', 'web-search'
    ];

    for (const category of categories) {
      await this.loadCategory(category);
    }

    return this.agents.size;
  }

  /**
   * Load agents from a specific category
   * @param {string} category - Category name
   */
  async loadCategory(category) {
    const categoryPath = path.join(__dirname, '..', 'groups', category);
    
    if (!fs.existsSync(categoryPath)) {
      this.log(`Category not found: ${category}`);
      return;
    }

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      try {
        const AgentClass = require(path.join(categoryPath, file));
        const agentName = file.replace('-master.js', '');
        const agent = new AgentClass({ verbose: this.config.verbose });
        this.agents.set(agentName, agent);
        this.log(`Loaded agent: ${agentName} (${category})`);
      } catch (error) {
        this.log(`Failed to load ${file}: ${error.message}`);
      }
    }

    this.loadedCategories.add(category);
  }

  /**
   * Get agent by name
   * @param {string} name - Agent name
   * @returns {Object|null} Agent instance
   */
  getAgent(name) {
    return this.agents.get(name) || null;
  }

  /**
   * Get all agents in a category
   * @param {string} category - Category name
   * @returns {Array<Object>} List of agents
   */
  getAgentsByCategory(category) {
    return Array.from(this.agents.values())
      .filter(agent => agent.category === category);
  }

  /**
   * Execute validation with multiple agents
   * @param {string} projectPath - Path to project
   * @param {Array<string>} agentNames - Names of agents to use
   * @returns {Promise<Object>} Combined results
   */
  async validate(projectPath, agentNames = null) {
    const agents = agentNames 
      ? agentNames.map(name => this.agents.get(name)).filter(Boolean)
      : Array.from(this.agents.values());

    if (agents.length === 0) {
      throw new Error('No agents available for validation');
    }

    this.log(`Starting validation with ${agents.length} agents...`);

    const results = {};
    
    if (this.config.parallel) {
      const chunks = this.chunkArray(agents, this.config.maxConcurrency);
      for (const chunk of chunks) {
        const promises = chunk.map(async agent => {
          const agentName = agent.name.toLowerCase().replace(/\s+/g, '-');
          try {
            const result = await agent.validate(projectPath);
            return { agentName, result };
          } catch (error) {
            return { agentName, result: { error: error.message } };
          }
        });
        
        const chunkResults = await Promise.all(promises);
        chunkResults.forEach(({ agentName, result }) => {
          results[agentName] = result;
        });
      }
    } else {
      for (const agent of agents) {
        const agentName = agent.name.toLowerCase().replace(/\s+/g, '-');
        try {
          results[agentName] = await agent.validate(projectPath);
        } catch (error) {
          results[agentName] = { error: error.message };
        }
      }
    }

    return {
      projectPath,
      timestamp: new Date().toISOString(),
      agents: agents.length,
      results
    };
  }

  /**
   * Get list of all loaded agents
   * @returns {Array<Object>} List of agent info
   */
  listAgents() {
    return Array.from(this.agents.values()).map(agent => agent.getInfo());
  }

  /**
   * Get statistics about loaded agents
   * @returns {Object} Statistics
   */
  getStats() {
    const agents = Array.from(this.agents.values());
    const byCategory = {};
    
    agents.forEach(agent => {
      if (!byCategory[agent.category]) {
        byCategory[agent.category] = 0;
      }
      byCategory[agent.category]++;
    });

    return {
      total: agents.length,
      categories: this.loadedCategories.size,
      byCategory,
      enabled: agents.filter(a => a.config.enabled).length
    };
  }

  /**
   * Split array into chunks
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Log message if verbose
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[Orchestrator] ${message}`);
    }
  }
}

module.exports = Orchestrator;
