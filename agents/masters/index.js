/**
 * Rascacielo Masters - Main Export
 * Central entry point for all 71 master agents and system components
 */

// Core System
const Orchestrator = require('./core/orchestrator');
const Validator = require('./core/validator');
const Reporter = require('./core/reporter');
const BadgeGenerator = require('./core/badge-generator');
const TechnologyScanner = require('./core/scanner');
const BaseMaster = require('./core/base-master');

// Automation
const AutoValidator = require('./automation/auto-validator');

// Language Masters
const PythonMaster = require('./groups/languages/python-master');
const JavaScriptMaster = require('./groups/languages/javascript-master');
const TypeScriptMaster = require('./groups/languages/typescript-master');
const JavaMaster = require('./groups/languages/java-master');
const GoMaster = require('./groups/languages/go-master');
const RustMaster = require('./groups/languages/rust-master');
const PHPMaster = require('./groups/languages/php-master');

// Frontend Masters
const ReactMaster = require('./groups/frontend/react-master');
const VueMaster = require('./groups/frontend/vue-master');
const AngularMaster = require('./groups/frontend/angular-master');

// Mobile Masters
const FlutterMaster = require('./groups/mobile/flutter-master');
const ReactNativeMaster = require('./groups/mobile/react-native-master');
const IOSMaster = require('./groups/mobile/ios-master');
const AndroidMaster = require('./groups/mobile/android-master');

// DevOps Masters
const DockerMaster = require('./groups/devops/docker-master');
const KubernetesMaster = require('./groups/devops/kubernetes-master');
const LinuxMaster = require('./groups/devops/linux-master');
const CICDMaster = require('./groups/devops/cicd-master');
const TerraformMaster = require('./groups/devops/terraform-master');
const JenkinsMaster = require('./groups/devops/jenkins-master');
const GitLabCIMaster = require('./groups/devops/gitlab-ci-master');
const AnsibleMaster = require('./groups/devops/ansible-master');
const NginxMaster = require('./groups/devops/nginx-master');
const PrometheusMaster = require('./groups/devops/prometheus-master');
const GrafanaMaster = require('./groups/devops/grafana-master');
const ElasticsearchMaster = require('./groups/devops/elasticsearch-master');

// Cloud Masters
const VercelMaster = require('./groups/cloud/vercel-master');
const AWSMaster = require('./groups/cloud/aws-master');
const AzureMaster = require('./groups/cloud/azure-master');
const GCPMaster = require('./groups/cloud/gcp-master');
const NetlifyMaster = require('./groups/cloud/netlify-master');
const HerokuMaster = require('./groups/cloud/heroku-master');
const DigitalOceanMaster = require('./groups/cloud/digitalocean-master');

// Database Masters
const SQLMaster = require('./groups/database/sql-master');
const NoSQLMaster = require('./groups/database/nosql-master');
const GraphQLMaster = require('./groups/database/graphql-master');

// Testing Masters
const TestingMaster = require('./groups/testing/testing-master');
const SeleniumMaster = require('./groups/testing/selenium-master');
const PlaywrightMaster = require('./groups/testing/playwright-master');
const PostmanMaster = require('./groups/testing/postman-master');
const JMeterMaster = require('./groups/testing/jmeter-master');
const CucumberMaster = require('./groups/testing/cucumber-master');
const CypressMaster = require('./groups/testing/cypress-master');

// Security Masters
const SecurityMaster = require('./groups/security/security-master');
const Auth0Master = require('./groups/security/auth0-master');
const KeycloakMaster = require('./groups/security/keycloak-master');
const VaultMaster = require('./groups/security/vault-master');
const SonarQubeMaster = require('./groups/security/sonarqube-master');

// Backend Masters
const ExpressMaster = require('./groups/backend/express-master');
const NestJSMaster = require('./groups/backend/nestjs-master');
const FastAPIMaster = require('./groups/backend/fastapi-master');
const DjangoMaster = require('./groups/backend/django-master');
const SpringBootMaster = require('./groups/backend/spring-boot-master');

// Data/ML Masters
const PandasMaster = require('./groups/data-ml/pandas-master');
const NumPyMaster = require('./groups/data-ml/numpy-master');
const TensorFlowMaster = require('./groups/data-ml/tensorflow-master');
const PyTorchMaster = require('./groups/data-ml/pytorch-master');

// Build Tools Masters
const NPMMaster = require('./groups/build-tools/npm-master');
const YarnMaster = require('./groups/build-tools/yarn-master');
const WebpackMaster = require('./groups/build-tools/webpack-master');
const ViteMaster = require('./groups/build-tools/vite-master');

// Version Control Masters
const GitMaster = require('./groups/version-control/git-master');
const GitHubActionsMaster = require('./groups/version-control/github-actions-master');
const BitbucketMaster = require('./groups/version-control/bitbucket-master');

// Design Masters
const FigmaMaster = require('./groups/design/figma-master');
const CSSMaster = require('./groups/design/css-master');
const SVGMaster = require('./groups/design/svg-master');

// Format Masters
const JSONMaster = require('./groups/formats/json-master');
const MarkdownMaster = require('./groups/formats/markdown-master');
const YAMLMaster = require('./groups/formats/yaml-master');
const XMLMaster = require('./groups/formats/xml-master');

// Web Search Master
const WebSearchMaster = require('./groups/web-search/web-search-master');

/**
 * Main export object
 */
module.exports = {
  // Core System
  Orchestrator,
  Validator,
  Reporter,
  BadgeGenerator,
  TechnologyScanner,
  BaseMaster,
  
  // Automation
  AutoValidator,
  
  // All 71 Master Agents
  masters: {
    // Languages (7)
    PythonMaster,
    JavaScriptMaster,
    TypeScriptMaster,
    JavaMaster,
    GoMaster,
    RustMaster,
    PHPMaster,
    
    // Frontend (3)
    ReactMaster,
    VueMaster,
    AngularMaster,
    
    // Mobile (4)
    FlutterMaster,
    ReactNativeMaster,
    IOSMaster,
    AndroidMaster,
    
    // DevOps (12)
    DockerMaster,
    KubernetesMaster,
    LinuxMaster,
    CICDMaster,
    TerraformMaster,
    JenkinsMaster,
    GitLabCIMaster,
    AnsibleMaster,
    NginxMaster,
    PrometheusMaster,
    GrafanaMaster,
    ElasticsearchMaster,
    
    // Cloud (7)
    VercelMaster,
    AWSMaster,
    AzureMaster,
    GCPMaster,
    NetlifyMaster,
    HerokuMaster,
    DigitalOceanMaster,
    
    // Database (3)
    SQLMaster,
    NoSQLMaster,
    GraphQLMaster,
    
    // Testing (7)
    TestingMaster,
    SeleniumMaster,
    PlaywrightMaster,
    PostmanMaster,
    JMeterMaster,
    CucumberMaster,
    CypressMaster,
    
    // Security (5)
    SecurityMaster,
    Auth0Master,
    KeycloakMaster,
    VaultMaster,
    SonarQubeMaster,
    
    // Backend (5)
    ExpressMaster,
    NestJSMaster,
    FastAPIMaster,
    DjangoMaster,
    SpringBootMaster,
    
    // Data/ML (4)
    PandasMaster,
    NumPyMaster,
    TensorFlowMaster,
    PyTorchMaster,
    
    // Build Tools (4)
    NPMMaster,
    YarnMaster,
    WebpackMaster,
    ViteMaster,
    
    // Version Control (3)
    GitMaster,
    GitHubActionsMaster,
    BitbucketMaster,
    
    // Design (3)
    FigmaMaster,
    CSSMaster,
    SVGMaster,
    
    // Formats (4)
    JSONMaster,
    MarkdownMaster,
    YAMLMaster,
    XMLMaster,
    
    // Web Search (1)
    WebSearchMaster
  }
};
