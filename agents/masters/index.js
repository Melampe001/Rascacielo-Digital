/**
 * @melampe001/rascacielo-masters
 * 35 Specialized Master Agents
 */

// Lenguajes de Programación
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
const IOSMaster = require('./ios-master');
const AndroidMaster = require('./android-master');

// DevOps & Infrastructure
const DockerMaster = require('./docker-master');
const KubernetesMaster = require('./kubernetes-master');
const LinuxMaster = require('./linux-master');
const CICDMaster = require('./cicd-master');
const TerraformMaster = require('./terraform-master');

// Cloud Platforms
const VercelMaster = require('./vercel-master');
const AWSMaster = require('./aws-master');
const AzureMaster = require('./azure-master');
const GCPMaster = require('./gcp-master');

// Bases de Datos
const SQLMaster = require('./sql-master');
const NoSQLMaster = require('./nosql-master');
const GraphQLMaster = require('./graphql-master');

// Diseño & UI/UX
const FigmaMaster = require('./figma-master');
const CSSMaster = require('./css-master');
const SVGMaster = require('./svg-master');

// Formatos & Data
const JSONMaster = require('./json-master');
const MarkdownMaster = require('./markdown-master');
const YAMLMaster = require('./yaml-master');
const XMLMaster = require('./xml-master');

// Quality & Security
const TestingMaster = require('./testing-master');
const SecurityMaster = require('./security-master');

module.exports = {
  // Lenguajes
  PythonMaster,
  JavaScriptMaster,
  TypeScriptMaster,
  JavaMaster,
  GoMaster,
  RustMaster,
  PHPMaster,
  
  // Frontend
  ReactMaster,
  VueMaster,
  AngularMaster,
  
  // Mobile
  FlutterMaster,
  ReactNativeMaster,
  IOSMaster,
  AndroidMaster,
  
  // DevOps
  DockerMaster,
  KubernetesMaster,
  LinuxMaster,
  CICDMaster,
  TerraformMaster,
  
  // Cloud
  VercelMaster,
  AWSMaster,
  AzureMaster,
  GCPMaster,
  
  // Database
  SQLMaster,
  NoSQLMaster,
  GraphQLMaster,
  
  // Design
  FigmaMaster,
  CSSMaster,
  SVGMaster,
  
  // Formats
  JSONMaster,
  MarkdownMaster,
  YAMLMaster,
  XMLMaster,
  
  // Quality
  TestingMaster,
  SecurityMaster
};
