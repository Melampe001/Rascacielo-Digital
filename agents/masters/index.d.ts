// Type definitions for @melampe001/rascacielo-masters
// Project: https://github.com/Melampe001/Rascacielo-Digital
// Definitions by: Melampe001

export interface MasterConfig {
  name?: string;
  version?: string;
  category?: string;
  expertise?: string[];
  enabled?: boolean;
  verbose?: boolean;
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  message?: string;
  recommendation?: string;
  severity?: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  agent: string;
  category: string;
  score: number;
  checks: ValidationCheck[];
  timestamp: string;
}

export interface ValidationSummary {
  valid: boolean;
  score: number;
  grade: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE' | 'PENDING';
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  agents: { [key: string]: any };
  issues: any[];
  recommendations: any[];
}

export class BaseMaster {
  constructor(config?: MasterConfig);
  validate(projectPath: string): Promise<ValidationResult>;
  analyze(code: string): Promise<any>;
  getBestPractices(): string[];
  getPatterns(): any[];
  getRules(): any;
  calculateScore(results: any): number;
  generateRecommendations(results: any): string[];
  getInfo(): MasterConfig;
}

export class Orchestrator {
  constructor(config?: any);
  loadAllAgents(): Promise<number>;
  loadCategory(category: string): Promise<void>;
  getAgent(name: string): BaseMaster | null;
  getAgentsByCategory(category: string): BaseMaster[];
  validate(projectPath: string, agentNames?: string[]): Promise<any>;
  listAgents(): MasterConfig[];
  getStats(): any;
}

export class Validator {
  constructor(config?: any);
  validate(results: any): ValidationSummary;
  generateReport(summary: ValidationSummary, format?: 'text' | 'json' | 'markdown'): string;
}

export class Reporter {
  constructor(config?: any);
  generate(summary: ValidationSummary, format?: 'text' | 'json' | 'markdown' | 'html'): string;
  save(summary: ValidationSummary, filename?: string, format?: string): Promise<string>;
}

export class BadgeGenerator {
  constructor(config?: any);
  generate(score: number, format?: 'markdown' | 'html' | 'svg' | 'json' | 'shields' | 'all'): string | any;
  generateFile(score: number, format: string, outputPath: string): Promise<string>;
}

export class TechnologyScanner {
  constructor(config?: any);
  scan(projectPath: string): Promise<any>;
  getSummary(detected: any): any;
}

export class AutoValidator {
  constructor(config?: any);
  validate(projectPath: string): Promise<any>;
  quickValidate(projectPath: string): Promise<any>;
  saveValidation(projectPath: string, outputDir?: string): Promise<any>;
}

// Master Agents
export class PythonMaster extends BaseMaster {}
export class JavaScriptMaster extends BaseMaster {}
export class TypeScriptMaster extends BaseMaster {}
export class JavaMaster extends BaseMaster {}
export class GoMaster extends BaseMaster {}
export class RustMaster extends BaseMaster {}
export class PHPMaster extends BaseMaster {}

export class ReactMaster extends BaseMaster {}
export class VueMaster extends BaseMaster {}
export class AngularMaster extends BaseMaster {}

export class FlutterMaster extends BaseMaster {}
export class ReactNativeMaster extends BaseMaster {}
export class IOSMaster extends BaseMaster {}
export class AndroidMaster extends BaseMaster {}

export class DockerMaster extends BaseMaster {}
export class KubernetesMaster extends BaseMaster {}
export class LinuxMaster extends BaseMaster {}
export class CICDMaster extends BaseMaster {}
export class TerraformMaster extends BaseMaster {}
export class JenkinsMaster extends BaseMaster {}
export class GitLabCIMaster extends BaseMaster {}
export class AnsibleMaster extends BaseMaster {}
export class NginxMaster extends BaseMaster {}
export class PrometheusMaster extends BaseMaster {}
export class GrafanaMaster extends BaseMaster {}
export class ElasticsearchMaster extends BaseMaster {}

export class VercelMaster extends BaseMaster {}
export class AWSMaster extends BaseMaster {}
export class AzureMaster extends BaseMaster {}
export class GCPMaster extends BaseMaster {}
export class NetlifyMaster extends BaseMaster {}
export class HerokuMaster extends BaseMaster {}
export class DigitalOceanMaster extends BaseMaster {}

export class SQLMaster extends BaseMaster {}
export class NoSQLMaster extends BaseMaster {}
export class GraphQLMaster extends BaseMaster {}

export class TestingMaster extends BaseMaster {}
export class SeleniumMaster extends BaseMaster {}
export class PlaywrightMaster extends BaseMaster {}
export class PostmanMaster extends BaseMaster {}
export class JMeterMaster extends BaseMaster {}
export class CucumberMaster extends BaseMaster {}
export class CypressMaster extends BaseMaster {}

export class SecurityMaster extends BaseMaster {}
export class Auth0Master extends BaseMaster {}
export class KeycloakMaster extends BaseMaster {}
export class VaultMaster extends BaseMaster {}
export class SonarQubeMaster extends BaseMaster {}

export class ExpressMaster extends BaseMaster {}
export class NestJSMaster extends BaseMaster {}
export class FastAPIMaster extends BaseMaster {}
export class DjangoMaster extends BaseMaster {}
export class SpringBootMaster extends BaseMaster {}

export class PandasMaster extends BaseMaster {}
export class NumPyMaster extends BaseMaster {}
export class TensorFlowMaster extends BaseMaster {}
export class PyTorchMaster extends BaseMaster {}

export class NPMMaster extends BaseMaster {}
export class YarnMaster extends BaseMaster {}
export class WebpackMaster extends BaseMaster {}
export class ViteMaster extends BaseMaster {}

export class GitMaster extends BaseMaster {}
export class GitHubActionsMaster extends BaseMaster {}
export class BitbucketMaster extends BaseMaster {}

export class FigmaMaster extends BaseMaster {}
export class CSSMaster extends BaseMaster {}
export class SVGMaster extends BaseMaster {}

export class JSONMaster extends BaseMaster {}
export class MarkdownMaster extends BaseMaster {}
export class YAMLMaster extends BaseMaster {}
export class XMLMaster extends BaseMaster {}

export class WebSearchMaster extends BaseMaster {}

export const masters: {
  PythonMaster: typeof PythonMaster;
  JavaScriptMaster: typeof JavaScriptMaster;
  TypeScriptMaster: typeof TypeScriptMaster;
  JavaMaster: typeof JavaMaster;
  GoMaster: typeof GoMaster;
  RustMaster: typeof RustMaster;
  PHPMaster: typeof PHPMaster;
  ReactMaster: typeof ReactMaster;
  VueMaster: typeof VueMaster;
  AngularMaster: typeof AngularMaster;
  FlutterMaster: typeof FlutterMaster;
  ReactNativeMaster: typeof ReactNativeMaster;
  IOSMaster: typeof IOSMaster;
  AndroidMaster: typeof AndroidMaster;
  DockerMaster: typeof DockerMaster;
  KubernetesMaster: typeof KubernetesMaster;
  LinuxMaster: typeof LinuxMaster;
  CICDMaster: typeof CICDMaster;
  TerraformMaster: typeof TerraformMaster;
  JenkinsMaster: typeof JenkinsMaster;
  GitLabCIMaster: typeof GitLabCIMaster;
  AnsibleMaster: typeof AnsibleMaster;
  NginxMaster: typeof NginxMaster;
  PrometheusMaster: typeof PrometheusMaster;
  GrafanaMaster: typeof GrafanaMaster;
  ElasticsearchMaster: typeof ElasticsearchMaster;
  VercelMaster: typeof VercelMaster;
  AWSMaster: typeof AWSMaster;
  AzureMaster: typeof AzureMaster;
  GCPMaster: typeof GCPMaster;
  NetlifyMaster: typeof NetlifyMaster;
  HerokuMaster: typeof HerokuMaster;
  DigitalOceanMaster: typeof DigitalOceanMaster;
  SQLMaster: typeof SQLMaster;
  NoSQLMaster: typeof NoSQLMaster;
  GraphQLMaster: typeof GraphQLMaster;
  TestingMaster: typeof TestingMaster;
  SeleniumMaster: typeof SeleniumMaster;
  PlaywrightMaster: typeof PlaywrightMaster;
  PostmanMaster: typeof PostmanMaster;
  JMeterMaster: typeof JMeterMaster;
  CucumberMaster: typeof CucumberMaster;
  CypressMaster: typeof CypressMaster;
  SecurityMaster: typeof SecurityMaster;
  Auth0Master: typeof Auth0Master;
  KeycloakMaster: typeof KeycloakMaster;
  VaultMaster: typeof VaultMaster;
  SonarQubeMaster: typeof SonarQubeMaster;
  ExpressMaster: typeof ExpressMaster;
  NestJSMaster: typeof NestJSMaster;
  FastAPIMaster: typeof FastAPIMaster;
  DjangoMaster: typeof DjangoMaster;
  SpringBootMaster: typeof SpringBootMaster;
  PandasMaster: typeof PandasMaster;
  NumPyMaster: typeof NumPyMaster;
  TensorFlowMaster: typeof TensorFlowMaster;
  PyTorchMaster: typeof PyTorchMaster;
  NPMMaster: typeof NPMMaster;
  YarnMaster: typeof YarnMaster;
  WebpackMaster: typeof WebpackMaster;
  ViteMaster: typeof ViteMaster;
  GitMaster: typeof GitMaster;
  GitHubActionsMaster: typeof GitHubActionsMaster;
  BitbucketMaster: typeof BitbucketMaster;
  FigmaMaster: typeof FigmaMaster;
  CSSMaster: typeof CSSMaster;
  SVGMaster: typeof SVGMaster;
  JSONMaster: typeof JSONMaster;
  MarkdownMaster: typeof MarkdownMaster;
  YAMLMaster: typeof YAMLMaster;
  XMLMaster: typeof XMLMaster;
  WebSearchMaster: typeof WebSearchMaster;
};
