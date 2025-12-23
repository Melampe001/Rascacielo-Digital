/**
 * TypeScript definitions for @melampe001/rascacielo-masters
 */

export interface MasterConfig {
  verbose?: boolean;
  strictMode?: boolean;
  [key: string]: any;
}

export interface AnalysisResult {
  agent: string;
  language?: string;
  framework?: string;
  platform?: string;
  category?: string;
  recommendations: string[];
  issues: string[];
  score: number;
}

export declare class PythonMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class JavaScriptMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class TypeScriptMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class JavaMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class GoMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class RustMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class PHPMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class ReactMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class VueMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class AngularMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class FlutterMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class ReactNativeMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class IOSMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class AndroidMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class DockerMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class KubernetesMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class LinuxMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class CICDMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class TerraformMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class VercelMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class AWSMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class AzureMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class GCPMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class SQLMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class NoSQLMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class GraphQLMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class FigmaMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class CSSMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class SVGMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class JSONMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class MarkdownMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class YAMLMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class XMLMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class TestingMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}

export declare class SecurityMaster {
  constructor(config?: MasterConfig);
  analyze(code: string): Promise<AnalysisResult>;
  validate(params: any): Promise<boolean>;
  getSpecializations(): string[];
}
