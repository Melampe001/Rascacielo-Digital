/**
 * @melampe001/rascacielo-masters
 * Sistema Imperial Elara - 91 Master Agents
 * Version: 2.0.0-elara
 */

// Core
const ElaraOrchestrator = require('./core/elara-orchestrator');

// Blockchain & Web3
const SolanaMaster = require('./groups/blockchain-web3/solana-master');
const EthereumMaster = require('./groups/blockchain-web3/ethereum-master');
const Web3Master = require('./groups/blockchain-web3/web3-master');
const BlockchainSecurityMaster = require('./groups/blockchain-web3/blockchain-security-master');
const CryptoMaster = require('./groups/blockchain-web3/crypto-master');

// Game Development
const UnityMaster = require('./groups/game-development/unity-master');
const UnrealMaster = require('./groups/game-development/unreal-master');
const GameLogicMaster = require('./groups/game-development/game-logic-master');
const GameUIMaster = require('./groups/game-development/game-ui-master');

// Real-Time
const WebSocketMaster = require('./groups/real-time/websocket-master');
const StreamingMaster = require('./groups/real-time/streaming-master');
const RealtimeAnalyticsMaster = require('./groups/real-time/realtime-analytics-master');

// Data Science Advanced
const DataPipelineMaster = require('./groups/data-science-advanced/data-pipeline-master');
const StatisticsMaster = require('./groups/data-science-advanced/statistics-master');
const VisualizationMaster = require('./groups/data-science-advanced/visualization-master');

// AI/ML Ops
const MLOpsMaster = require('./groups/ai-ml-ops/mlops-master');
const LLMMaster = require('./groups/ai-ml-ops/llm-master');
const ModelOptimizationMaster = require('./groups/ai-ml-ops/model-optimization-master');

// Observability
const ObservabilityMaster = require('./groups/observability/observability-master');
const PerformanceMaster = require('./groups/observability/performance-master');

module.exports = {
  // Core
  ElaraOrchestrator,
  
  // Blockchain & Web3
  SolanaMaster,
  EthereumMaster,
  Web3Master,
  BlockchainSecurityMaster,
  CryptoMaster,
  
  // Game Development
  UnityMaster,
  UnrealMaster,
  GameLogicMaster,
  GameUIMaster,
  
  // Real-Time
  WebSocketMaster,
  StreamingMaster,
  RealtimeAnalyticsMaster,
  
  // Data Science Advanced
  DataPipelineMaster,
  StatisticsMaster,
  VisualizationMaster,
  
  // AI/ML Ops
  MLOpsMaster,
  LLMMaster,
  ModelOptimizationMaster,
  
  // Observability
  ObservabilityMaster,
  PerformanceMaster,
  
  // Version info
  version: '2.0.0-elara',
  totalAgents: 91,
  elaraAgents: 20,
  baseAgents: 71
};
