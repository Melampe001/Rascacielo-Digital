/**
 * Masters Index - Rascacielos Digital
 * 
 * Exporta todos los agentes maestros especializados
 */

// Programming Languages
const PythonMaster = require('./python-master');
const JavaScriptMaster = require('./javascript-master');
const TypeScriptMaster = require('./typescript-master');
const JavaMaster = require('./java-master');
const GoMaster = require('./go-master');
const RustMaster = require('./rust-master');
const PHPMaster = require('./php-master');

// Frontend Frameworks
const ReactMaster = require('./react-master');
const VueMaster = require('./vue-master');
const AngularMaster = require('./angular-master');

// Mobile
const FlutterMaster = require('./flutter-master');
const ReactNativeMaster = require('./react-native-master');
const iOSMaster = require('./ios-master');
const AndroidMaster = require('./android-master');

// DevOps & Infrastructure
const DockerMaster = require('./docker-master');
const KubernetesMaster = require('./kubernetes-master');
const LinuxMaster = require('./linux-master');
const CICDMaster = require('./cicd-master');
const TerraformMaster = require('./terraform-master');

// Cloud & Deploy
const VercelMaster = require('./vercel-master');
const AWSMaster = require('./aws-master');
const AzureMaster = require('./azure-master');
const GCPMaster = require('./gcp-master');

// Databases
const SQLMaster = require('./sql-master');
const NoSQLMaster = require('./nosql-master');
const GraphQLMaster = require('./graphql-master');

// Design & UI/UX
const FigmaMaster = require('./figma-master');
const CSSMaster = require('./css-master');
const SVGMaster = require('./svg-master');

// Formats & Data
const JSONMaster = require('./json-master');
const MarkdownMaster = require('./markdown-master');
const YAMLMaster = require('./yaml-master');
const XMLMaster = require('./xml-master');

// Testing & Quality
const TestingMaster = require('./testing-master');
const SecurityMasterAgent = require('./security-master');

/**
 * Mapa de todos los maestros disponibles
 */
const masters = {
  // Programming Languages
  python: PythonMaster,
  javascript: JavaScriptMaster,
  typescript: TypeScriptMaster,
  java: JavaMaster,
  go: GoMaster,
  rust: RustMaster,
  php: PHPMaster,

  // Frontend Frameworks
  react: ReactMaster,
  vue: VueMaster,
  angular: AngularMaster,

  // Mobile
  flutter: FlutterMaster,
  reactNative: ReactNativeMaster,
  ios: iOSMaster,
  android: AndroidMaster,

  // DevOps & Infrastructure
  docker: DockerMaster,
  kubernetes: KubernetesMaster,
  linux: LinuxMaster,
  cicd: CICDMaster,
  terraform: TerraformMaster,

  // Cloud & Deploy
  vercel: VercelMaster,
  aws: AWSMaster,
  azure: AzureMaster,
  gcp: GCPMaster,

  // Databases
  sql: SQLMaster,
  nosql: NoSQLMaster,
  graphql: GraphQLMaster,

  // Design & UI/UX
  figma: FigmaMaster,
  css: CSSMaster,
  svg: SVGMaster,

  // Formats & Data
  json: JSONMaster,
  markdown: MarkdownMaster,
  yaml: YAMLMaster,
  xml: XMLMaster,

  // Testing & Quality
  testing: TestingMaster,
  security: SecurityMasterAgent
};

/**
 * Obtiene un maestro por su nombre
 * @param {string} name - Nombre del maestro
 * @param {Object} config - Configuración del maestro
 * @returns {Object} Instancia del maestro
 */
function getMaster(name, config = {}) {
  const MasterClass = masters[name];
  if (!MasterClass) {
    throw new Error(`Master "${name}" no encontrado`);
  }
  return new MasterClass(config);
}

/**
 * Lista todos los maestros disponibles
 * @returns {Array} Lista de nombres de maestros
 */
function listMasters() {
  return Object.keys(masters);
}

/**
 * Inicializa todos los maestros
 * @param {Object} config - Configuración compartida
 * @returns {Object} Objeto con todos los maestros instanciados
 */
function initializeAll(config = {}) {
  const instances = {};
  for (const [name, MasterClass] of Object.entries(masters)) {
    instances[name] = new MasterClass(config);
  }
  return instances;
}

module.exports = {
  // Classes
  PythonMaster,
  JavaScriptMaster,
  TypeScriptMaster,
  JavaMaster,
  GoMaster,
  RustMaster,
  PHPMaster,
  ReactMaster,
  VueMaster,
  AngularMaster,
  FlutterMaster,
  ReactNativeMaster,
  iOSMaster,
  AndroidMaster,
  DockerMaster,
  KubernetesMaster,
  LinuxMaster,
  CICDMaster,
  TerraformMaster,
  VercelMaster,
  AWSMaster,
  AzureMaster,
  GCPMaster,
  SQLMaster,
  NoSQLMaster,
  GraphQLMaster,
  FigmaMaster,
  CSSMaster,
  SVGMaster,
  JSONMaster,
  MarkdownMaster,
  YAMLMaster,
  XMLMaster,
  TestingMaster,
  SecurityMasterAgent,

  // Helpers
  masters,
  getMaster,
  listMasters,
  initializeAll
};
