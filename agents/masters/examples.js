/**
 * Example usage of @melampe001/rascacielo-masters
 */

const {
  PythonMaster,
  JavaScriptMaster,
  ReactMaster,
  DockerMaster,
  AWSMaster,
  TestingMaster
} = require('./index');

// Example 1: Basic usage
async function basicExample() {
  console.log('=== Example 1: Basic Usage ===\n');
  
  const pythonAgent = new PythonMaster({ verbose: true });
  const result = await pythonAgent.analyze('def hello(): pass');
  
  console.log('Analysis Result:', result);
  console.log('Score:', result.score);
  console.log('');
}

// Example 2: Multi-agent analysis
async function multiAgentExample() {
  console.log('=== Example 2: Multi-Agent Analysis ===\n');
  
  const agents = [
    new PythonMaster(),
    new JavaScriptMaster(),
    new ReactMaster(),
    new DockerMaster()
  ];
  
  console.log('Available Agents:');
  agents.forEach(agent => {
    console.log(`- ${agent.name}: ${agent.getSpecializations().join(', ')}`);
  });
  console.log('');
}

// Example 3: Configuration
async function configurationExample() {
  console.log('=== Example 3: Agent Configuration ===\n');
  
  const agent = new AWSMaster({
    verbose: true,
    strictMode: false,
    customOption: 'value'
  });
  
  console.log('Agent Name:', agent.name);
  console.log('Config:', agent.config);
  console.log('Specializations:', agent.getSpecializations());
  console.log('');
}

// Example 4: Validation
async function validationExample() {
  console.log('=== Example 4: Parameter Validation ===\n');
  
  const testingAgent = new TestingMaster();
  
  try {
    await testingAgent.validate({ test: true });
    console.log('✓ Validation passed');
  } catch (error) {
    console.error('✗ Validation failed:', error.message);
  }
  
  try {
    await testingAgent.validate(null);
    console.log('✓ Validation passed');
  } catch (error) {
    console.error('✗ Validation failed:', error.message);
  }
  console.log('');
}

// Run all examples
async function runExamples() {
  await basicExample();
  await multiAgentExample();
  await configurationExample();
  await validationExample();
  
  console.log('=== All Examples Completed ===');
}

// Execute if run directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicExample,
  multiAgentExample,
  configurationExample,
  validationExample
};
