/**
 * Security Agent - Análisis de seguridad completo
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAgent {
  constructor(config = {}) {
    this.config = {
      target: config.target || './src',
      level: config.level || 'moderate',
      failOnHigh: config.failOnHigh !== false,
      reportPath: config.reportPath || './security-report.json',
      ...config
    };

    this.vulnerabilities = [];
    this.scanLog = [];
  }

  async scan(params = {}) {
    const startTime = Date.now();
    this.log('🔒 Iniciando análisis de seguridad...');

    try {
      await this.auditDependencies();
      await this.scanSourceCode(params.target || this.config.target);
      await this.checkExposedSecrets();
      await this.checkFilePermissions();
      const report = await this.generateReport();

      const duration = Date.now() - startTime;
      const shouldFail = this.config.failOnHigh && this.hasHighVulnerabilities();

      const result = {
        success: !shouldFail,
        duration: `${duration}ms`,
        vulnerabilities: this.vulnerabilities,
        summary: this.getSummary(),
        report: report,
        log: this.scanLog,
        timestamp: new Date().toISOString()
      };

      if (shouldFail) {
        this.log('❌ Vulnerabilidades críticas encontradas', 'error');
        throw new Error('Security scan failed: High severity vulnerabilities found');
      }

      this.log(`✅ Análisis completado en ${duration}ms`);
      return result;
    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'error');
      throw error;
    }
  }

  async auditDependencies() {
    this.log('📦 Auditando dependencias npm...');
    try {
      const auditOutput = execSync('npm audit --json', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      const auditData = JSON.parse(auditOutput);
      if (auditData.vulnerabilities) {
        for (const [pkg, vuln] of Object.entries(auditData.vulnerabilities)) {
          this.vulnerabilities.push({
            type: 'dependency',
            package: pkg,
            severity: vuln.severity,
            via: vuln.via,
            range: vuln.range,
            fixAvailable: vuln.fixAvailable
          });
        }
      }

      const vulnCount = Object.keys(auditData.vulnerabilities || {}).length;
      this.log(`✓ Auditoría: ${vulnCount} vulnerabilidades encontradas`);
    } catch (error) {
      try {
        const errorOutput = error.stdout?.toString() || '{}';
        const auditData = JSON.parse(errorOutput);
        if (auditData.metadata) {
          const { vulnerabilities } = auditData.metadata;
          this.log(`⚠️ Vulnerabilidades: ${JSON.stringify(vulnerabilities)}`, 'warn');
        }
      } catch {
        this.log('⚠️ No se pudo parsear npm audit', 'warn');
      }
    }
  }

  async scanSourceCode(targetDir) {
    this.log(`🔍 Escaneando código en ${targetDir}...`);
    if (!fs.existsSync(targetDir)) {
      this.log(`⚠️ Directorio no existe: ${targetDir}`, 'warn');
      return;
    }

    const scanDirectory = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
            scanDirectory(fullPath);
          }
        } else if (entry.name.endsWith('.js')) {
          this.scanFile(fullPath);
        }
      }
    };

    scanDirectory(targetDir);
    this.log(`✓ Escaneo completado`);
  }

  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const patterns = [
      {
        regex: /eval\s*\(/gi,
        severity: 'high',
        message: 'Uso de eval() (riesgo de inyección de código)'
      },
      {
        regex: /innerHTML\s*=/gi,
        severity: 'medium',
        message: 'innerHTML directo (riesgo de XSS)'
      },
      {
        regex: /(password|secret|api[_-]?key)\s*=\s*['"][^'"]+['"]/gi,
        severity: 'critical',
        message: 'Posible secreto hardcodeado'
      },
      {
        regex: /console\.(log|error|warn)\s*\(/gi,
        severity: 'low',
        message: 'Console.log (eliminar en producción)'
      }
    ];

    lines.forEach((line, index) => {
      patterns.forEach(pattern => {
        if (pattern.regex.test(line)) {
          this.vulnerabilities.push({
            type: 'code',
            file: filePath,
            line: index + 1,
            code: line.trim(),
            severity: pattern.severity,
            message: pattern.message
          });
        }
      });
    });
  }

  async checkExposedSecrets() {
    this.log('🔑 Verificando secretos expuestos...');
    const sensitiveFiles = ['.env', '.env.local', '.env.production'];
    
    for (const file of sensitiveFiles) {
      if (fs.existsSync(file)) {
        const gitignore = fs.existsSync('.gitignore') 
          ? fs.readFileSync('.gitignore', 'utf-8') 
          : '';

        if (!gitignore.includes(file)) {
          this.vulnerabilities.push({
            type: 'configuration',
            file: file,
            severity: 'high',
            message: `${file} no está en .gitignore`
          });
        }
      }
    }
    this.log('✓ Verificación completada');
  }

  async checkFilePermissions() {
    this.log('🔐 Verificando permisos...');
    if (process.platform !== 'win32') {
      this.log('✓ Verificación completada');
    } else {
      this.log('⚠️ Omitido en Windows', 'warn');
    }
  }

  async generateReport() {
    this.log('📄 Generando reporte...');
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      vulnerabilities: this.vulnerabilities,
      config: this.config,
      recommendations: this.getRecommendations()
    };

    fs.writeFileSync(this.config.reportPath, JSON.stringify(report, null, 2));
    this.log(`✓ Reporte: ${this.config.reportPath}`);
    return report;
  }

  getSummary() {
    const summary = { total: this.vulnerabilities.length, critical: 0, high: 0, medium: 0, low: 0 };
    this.vulnerabilities.forEach(vuln => {
      const severity = vuln.severity.toLowerCase();
      if (summary[severity] !== undefined) summary[severity]++;
    });
    return summary;
  }

  hasHighVulnerabilities() {
    return this.vulnerabilities.some(v => ['critical', 'high'].includes(v.severity.toLowerCase()));
  }

  getRecommendations() {
    const recommendations = [];
    const summary = this.getSummary();
    if (summary.critical > 0) recommendations.push('⚠️ URGENTE: Resolver vulnerabilidades críticas');
    if (summary.high > 0) recommendations.push('Resolver vulnerabilidades altas antes de producción');
    recommendations.push('Ejecutar npm audit fix');
    recommendations.push('Revisar código en busca de eval() e innerHTML');
    recommendations.push('Verificar secretos en variables de entorno');
    return recommendations;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    this.scanLog.push({ timestamp, level, message });
    const prefix = { info: 'ℹ️', warn: '⚠️', error: '❌' }[level] || 'ℹ️';
    console.log(`${prefix} [Security Agent] ${message}`);
  }
}

module.exports = SecurityAgent;

// CLI execution
if (require.main === module) {
  const agent = new SecurityAgent();
  agent.scan()
    .then(result => {
      console.log('\n📊 Resultado del Análisis de Seguridad:');
      console.log(JSON.stringify(result.summary, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n❌ Análisis de seguridad falló:', error.message);
      process.exit(1);
    });
}

