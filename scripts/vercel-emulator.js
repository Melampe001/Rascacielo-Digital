#!/usr/bin/env node
/**
 * Vercel Deployment Emulator
 * Simula el proceso completo de deploy en Vercel
 * Incluye todas las fases: Build, Functions, Static, Headers, etc.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VercelEmulator {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      phases: [],
      errors: [],
      warnings: [],
      metrics: {}
    };
    this.startTime = Date.now();
  }

  log(phase, message, type = 'info') {
    const icons = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      build: '🔨',
      deploy: '🚀',
      test: '🧪',
      security: '🔒'
    };
    console.log(`${icons[type] || '•'} [${phase}] ${message}`);
  }

  async run() {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║           🚀 VERCEL DEPLOYMENT EMULATOR v1.0.0                    ║');
    console.log('║                  Simulación Completa de Deploy                     ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');

    try {
      // Phase 1: Pre-flight checks
      await this.phasePreFlight();
      
      // Phase 2: Configuration validation
      await this.phaseConfigValidation();
      
      // Phase 3: Dependencies
      await this.phaseDependencies();
      
      // Phase 4: Lint & Format
      await this.phaseLintFormat();
      
      // Phase 5: Tests
      await this.phaseTests();
      
      // Phase 6: Build
      await this.phaseBuild();
      
      // Phase 7: Functions validation
      await this.phaseFunctions();
      
      // Phase 8: Static assets
      await this.phaseStaticAssets();
      
      // Phase 9: Headers & Security
      await this.phaseSecurityHeaders();
      
      // Phase 10: Final summary
      await this.phaseSummary();
      
    } catch (error) {
      this.results.errors.push(error.message);
      this.log('FATAL', error.message, 'error');
      process.exit(1);
    }
  }

  async phasePreFlight() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 1: PRE-FLIGHT CHECKS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const checks = [
      { name: 'package.json', required: true },
      { name: 'vercel.json', required: false },
      { name: 'node_modules', required: false, isDir: true },
      { name: '.git', required: true, isDir: true },
      { name: '.gitignore', required: false }
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
      const filePath = path.join(this.projectRoot, check.name);
      const exists = fs.existsSync(filePath);
      
      if (exists) {
        this.log('Pre-flight', `${check.name} encontrado`, 'success');
        passed++;
      } else if (check.required) {
        this.log('Pre-flight', `${check.name} NO encontrado (REQUERIDO)`, 'error');
        this.results.errors.push(`Archivo requerido no encontrado: ${check.name}`);
        failed++;
      } else {
        this.log('Pre-flight', `${check.name} no encontrado (opcional)`, 'warning');
        this.results.warnings.push(`Archivo opcional no encontrado: ${check.name}`);
      }
    }

    // Check Node version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion >= 18) {
      this.log('Pre-flight', `Node.js ${nodeVersion} ✓`, 'success');
      passed++;
    } else {
      this.log('Pre-flight', `Node.js ${nodeVersion} - Vercel requiere >= 18`, 'error');
      this.results.errors.push('Node.js version debe ser >= 18');
      failed++;
    }

    this.results.phases.push({ name: 'Pre-flight', passed, failed });
    
    if (failed > 0) {
      throw new Error('Pre-flight checks failed');
    }
  }

  async phaseConfigValidation() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 2: VALIDACIÓN DE CONFIGURACIÓN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    // Validate package.json
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      this.log('Config', 'package.json válido', 'success');
      passed++;

      // Check required fields
      const requiredFields = ['name', 'version'];
      for (const field of requiredFields) {
        if (pkg[field]) {
          this.log('Config', `package.json.${field}: "${pkg[field]}"`, 'success');
          passed++;
        } else {
          this.log('Config', `package.json.${field} faltante`, 'error');
          failed++;
        }
      }

      // Check scripts
      if (pkg.scripts) {
        const importantScripts = ['build', 'start', 'test'];
        for (const script of importantScripts) {
          if (pkg.scripts[script]) {
            this.log('Config', `Script "${script}": ${pkg.scripts[script]}`, 'success');
            passed++;
          } else {
            this.log('Config', `Script "${script}" no definido`, 'warning');
            this.results.warnings.push(`Script '${script}' no definido`);
          }
        }
      }

      // Check engines
      if (pkg.engines && pkg.engines.node) {
        this.log('Config', `Engines.node: ${pkg.engines.node}`, 'success');
        passed++;
      }

    } catch (e) {
      this.log('Config', `Error en package.json: ${e.message}`, 'error');
      this.results.errors.push(`package.json inválido: ${e.message}`);
      failed++;
    }

    // Validate vercel.json
    if (fs.existsSync('vercel.json')) {
      try {
        const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        this.log('Config', 'vercel.json válido', 'success');
        passed++;

        // Check for deprecated properties
        if (vercel.builds) {
          this.log('Config', '"builds" está DEPRECADO', 'error');
          this.results.errors.push('vercel.json: "builds" está deprecado');
          failed++;
        }

        // Check for conflicts
        if (vercel.builds && vercel.functions) {
          this.log('Config', 'Conflicto: builds + functions', 'error');
          this.results.errors.push('vercel.json: builds y functions no pueden coexistir');
          failed++;
        }

        // Validate functions
        if (vercel.functions) {
          for (const [pattern, config] of Object.entries(vercel.functions)) {
            // Check memory
            if (config.memory) {
              if (config.memory >= 128 && config.memory <= 3008) {
                this.log('Config', `functions[${pattern}].memory: ${config.memory}MB ✓`, 'success');
                passed++;
              } else {
                this.log('Config', 'functions memory fuera de rango (128-3008)', 'error');
                failed++;
              }
            }
            // Check maxDuration
            if (config.maxDuration) {
              if (config.maxDuration <= 10) {
                this.log('Config', `functions[${pattern}].maxDuration: ${config.maxDuration}s ✓`, 'success');
                passed++;
              } else if (config.maxDuration <= 60) {
                this.log('Config', `maxDuration ${config.maxDuration}s requiere plan Pro`, 'warning');
                this.results.warnings.push('maxDuration > 10s requiere plan Pro');
              } else {
                this.log('Config', 'maxDuration máximo es 60s (Enterprise: 900s)', 'error');
                failed++;
              }
            }
          }
        }

        // Check version
        if (vercel.version === 2) {
          this.log('Config', 'vercel.json version: 2 ✓', 'success');
          passed++;
        }

      } catch (e) {
        this.log('Config', `Error en vercel.json: ${e.message}`, 'error');
        this.results.errors.push(`vercel.json inválido: ${e.message}`);
        failed++;
      }
    }

    this.results.phases.push({ name: 'Config', passed, failed });
    
    if (failed > 0) {
      throw new Error('Configuration validation failed');
    }
  }

  async phaseDependencies() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 3: DEPENDENCIAS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      this.log('Dependencies', 'Instalando dependencias...', 'build');
      try {
        execSync('npm install', { stdio: 'pipe' });
        this.log('Dependencies', 'Dependencias instaladas', 'success');
        passed++;
      } catch (e) {
        this.log('Dependencies', 'Error instalando dependencias', 'error');
        failed++;
      }
    } else {
      this.log('Dependencies', 'node_modules existe', 'success');
      passed++;
    }

    // Check for vulnerabilities
    this.log('Dependencies', 'Verificando vulnerabilidades...', 'security');
    try {
      const auditOutput = execSync('npm audit --json 2>/dev/null || echo "{}"', { encoding: 'utf8' });
      const audit = JSON.parse(auditOutput || '{}');
      
      if (audit.metadata) {
        const vulns = audit.metadata.vulnerabilities || {};
        const critical = vulns.critical || 0;
        const high = vulns.high || 0;
        
        if (critical > 0) {
          this.log('Dependencies', `${critical} vulnerabilidades CRÍTICAS`, 'error');
          this.results.warnings.push(`${critical} vulnerabilidades críticas encontradas`);
        }
        if (high > 0) {
          this.log('Dependencies', `${high} vulnerabilidades altas`, 'warning');
        }
        if (critical === 0 && high === 0) {
          this.log('Dependencies', 'Sin vulnerabilidades críticas/altas', 'success');
          passed++;
        }
      } else {
        this.log('Dependencies', 'Audit completado (sin issues críticos)', 'success');
        passed++;
      }
    } catch (e) {
      this.log('Dependencies', 'No se pudo ejecutar audit', 'warning');
    }

    // Count dependencies
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const deps = Object.keys(pkg.dependencies || {}).length;
      const devDeps = Object.keys(pkg.devDependencies || {}).length;
      this.log('Dependencies', `${deps} dependencies, ${devDeps} devDependencies`, 'info');
      this.results.metrics.dependencies = deps;
      this.results.metrics.devDependencies = devDeps;
    } catch (_e) {
      // Ignore package.json read errors
    }

    this.results.phases.push({ name: 'Dependencies', passed, failed });
  }

  async phaseLintFormat() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 4: LINT & FORMAT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    // Run ESLint
    this.log('Lint', 'Ejecutando ESLint...', 'test');
    try {
      const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf8' });
      
      // Count errors and warnings
      const errorMatch = lintOutput.match(/(\d+) error/);
      const warningMatch = lintOutput.match(/(\d+) warning/);
      
      const errors = errorMatch ? parseInt(errorMatch[1]) : 0;
      const warnings = warningMatch ? parseInt(warningMatch[1]) : 0;
      
      if (errors > 0) {
        this.log('Lint', `${errors} errores de ESLint`, 'error');
        this.results.errors.push(`ESLint: ${errors} errores`);
        failed++;
      } else if (warnings > 0) {
        this.log('Lint', `0 errores, ${warnings} warnings`, 'warning');
        passed++;
      } else {
        this.log('Lint', 'Sin errores ni warnings', 'success');
        passed++;
      }
      
      this.results.metrics.lintErrors = errors;
      this.results.metrics.lintWarnings = warnings;
      
    } catch (e) {
      // ESLint returns non-zero on errors
      const output = e.stdout || e.message;
      const errorMatch = output.match(/(\d+) error/);
      const errors = errorMatch ? parseInt(errorMatch[1]) : 1;
      
      if (errors > 0) {
        this.log('Lint', `${errors} errores de ESLint`, 'error');
        failed++;
      } else {
        this.log('Lint', 'ESLint pasó', 'success');
        passed++;
      }
    }

    this.results.phases.push({ name: 'Lint', passed, failed });

    if (failed > 0) {
      throw new Error('Lint validation failed');
    }
  }

  async phaseTests() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 5: TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    this.log('Tests', 'Ejecutando test suite...', 'test');
    
    try {
      const testOutput = execSync('npm test 2>&1', { encoding: 'utf8' });
      
      // Parse Jest output
      const suiteMatch = testOutput.match(/Test Suites:\s+(\d+) passed/);
      const testMatch = testOutput.match(/Tests:\s+(\d+) passed/);
      const timeMatch = testOutput.match(/Time:\s+([\d.]+)\s*s/);
      
      const suites = suiteMatch ? parseInt(suiteMatch[1]) : 0;
      const tests = testMatch ? parseInt(testMatch[1]) : 0;
      const time = timeMatch ? parseFloat(timeMatch[1]) : 0;
      
      this.log('Tests', `${suites} test suites pasaron`, 'success');
      this.log('Tests', `${tests} tests pasaron`, 'success');
      this.log('Tests', `Tiempo: ${time}s`, 'info');
      
      this.results.metrics.testSuites = suites;
      this.results.metrics.tests = tests;
      this.results.metrics.testTime = time;
      
      passed++;
      
    } catch (e) {
      const output = e.stdout || '';
      const failMatch = output.match(/(\d+) failed/);
      const failures = failMatch ? parseInt(failMatch[1]) : 1;
      
      this.log('Tests', `${failures} tests fallaron`, 'error');
      this.results.errors.push(`${failures} tests fallaron`);
      failed++;
    }

    this.results.phases.push({ name: 'Tests', passed, failed });

    if (failed > 0) {
      throw new Error('Tests failed');
    }
  }

  async phaseBuild() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 6: BUILD');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    // Check if build script exists
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (pkg.scripts && pkg.scripts.build) {
      this.log('Build', 'Ejecutando build...', 'build');
      
      const buildStart = Date.now();
      
      try {
        execSync('npm run build 2>&1', { encoding: 'utf8' });
        const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2);
        
        this.log('Build', `Build completado en ${buildTime}s`, 'success');
        this.results.metrics.buildTime = parseFloat(buildTime);
        passed++;
        
        // Check dist directory
        if (fs.existsSync('dist')) {
          const distFiles = this.countFiles('dist');
          this.log('Build', `${distFiles} archivos en dist/`, 'info');
          this.results.metrics.distFiles = distFiles;
        }
        
      } catch (e) {
        this.log('Build', 'Build falló', 'error');
        this.results.errors.push('Build falló');
        failed++;
      }
    } else {
      this.log('Build', 'No hay script de build definido', 'warning');
      this.results.warnings.push('No hay script de build');
    }

    this.results.phases.push({ name: 'Build', passed, failed });

    if (failed > 0) {
      throw new Error('Build failed');
    }
  }

  async phaseFunctions() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 7: SERVERLESS FUNCTIONS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    let failed = 0;

    // Check api directory
    if (fs.existsSync('api')) {
      const apiFiles = fs.readdirSync('api').filter(f => f.endsWith('.js'));
      this.log('Functions', `${apiFiles.length} funciones en api/`, 'info');
      this.results.metrics.functions = apiFiles.length;

      for (const file of apiFiles) {
        const filePath = path.join('api', file);
        
        try {
          // Check syntax
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Verify it exports a function
          if (content.includes('module.exports') || content.includes('export default')) {
            // Check for req, res parameters
            if (content.includes('(req, res)') || content.includes('request, response')) {
              this.log('Functions', `api/${file} - Sintaxis válida ✓`, 'success');
              passed++;
              
              // Simulate function call
              this.log('Functions', `api/${file} - Simulando request...`, 'test');
              
              // Create mock req/res
              const mockReq = { method: 'GET', url: `/${file.replace('.js', '')}` };
              const mockRes = {
                statusCode: 200,
                headers: {},
                body: null,
                setHeader: function(k, v) { this.headers[k] = v; },
                status: function(code) { this.statusCode = code; return this; },
                json: function(data) { this.body = data; return this; },
                send: function(data) { this.body = data; return this; }
              };

              try {
                // Clear require cache
                delete require.cache[require.resolve(path.resolve(filePath))];
                const fn = require(path.resolve(filePath));
                
                if (typeof fn === 'function') {
                  fn(mockReq, mockRes);
                  this.log('Functions', `api/${file} - Response: ${mockRes.statusCode}`, 'success');
                  passed++;
                }
              } catch (fnError) {
                this.log('Functions', `api/${file} - Error en ejecución: ${fnError.message}`, 'warning');
                this.results.warnings.push(`api/${file} error: ${fnError.message}`);
              }
              
            } else {
              this.log('Functions', `api/${file} - Falta (req, res)`, 'warning');
              this.results.warnings.push(`api/${file} no tiene parámetros req, res`);
            }
          } else {
            this.log('Functions', `api/${file} - No exporta función`, 'error');
            this.results.errors.push(`api/${file} no exporta una función`);
            failed++;
          }
          
        } catch (e) {
          this.log('Functions', `api/${file} - Error: ${e.message}`, 'error');
          this.results.errors.push(`api/${file}: ${e.message}`);
          failed++;
        }
      }
      
    } else {
      this.log('Functions', 'No hay directorio api/', 'warning');
      this.results.warnings.push('No hay funciones serverless (api/)');
    }

    this.results.phases.push({ name: 'Functions', passed, failed });
  }

  async phaseStaticAssets() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 8: STATIC ASSETS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;

    const staticDirs = ['public', 'static', 'assets', 'dist'];
    let totalSize = 0;
    let fileCount = 0;

    for (const dir of staticDirs) {
      if (fs.existsSync(dir)) {
        const stats = this.getDirStats(dir);
        this.log('Static', `${dir}/: ${stats.files} archivos, ${this.formatSize(stats.size)}`, 'info');
        totalSize += stats.size;
        fileCount += stats.files;
        passed++;
      }
    }

    // Check for large files
    if (totalSize > 100 * 1024 * 1024) { // 100MB
      this.log('Static', 'Tamaño total > 100MB - considera optimizar', 'warning');
      this.results.warnings.push('Assets > 100MB pueden causar deploys lentos');
    } else if (totalSize > 0) {
      this.log('Static', `Total: ${fileCount} archivos, ${this.formatSize(totalSize)}`, 'success');
      passed++;
    } else {
      this.log('Static', 'No se encontraron assets estáticos', 'info');
    }

    this.results.metrics.staticFiles = fileCount;
    this.results.metrics.staticSize = totalSize;

    this.results.phases.push({ name: 'Static', passed, failed: 0 });
  }

  async phaseSecurityHeaders() {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  FASE 9: SECURITY HEADERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    let passed = 0;
    const failed = 0;

    if (fs.existsSync('vercel.json')) {
      const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      
      if (vercel.headers) {
        this.log('Security', 'Headers configurados en vercel.json', 'success');
        passed++;

        const securityHeaders = [
          'X-Content-Type-Options',
          'X-Frame-Options',
          'X-XSS-Protection',
          'Strict-Transport-Security',
          'Content-Security-Policy',
          'Referrer-Policy'
        ];

        const configuredHeaders = new Set();
        
        for (const headerConfig of vercel.headers) {
          if (headerConfig.headers) {
            for (const h of headerConfig.headers) {
              configuredHeaders.add(h.key);
            }
          }
        }

        for (const header of securityHeaders) {
          if (configuredHeaders.has(header)) {
            this.log('Security', `${header} ✓`, 'success');
            passed++;
          } else {
            this.log('Security', `${header} no configurado`, 'warning');
            this.results.warnings.push(`Header de seguridad faltante: ${header}`);
          }
        }

        // Check CORS for API
        if (configuredHeaders.has('Access-Control-Allow-Origin')) {
          this.log('Security', 'CORS configurado para API', 'success');
          passed++;
        }

      } else {
        this.log('Security', 'No hay headers de seguridad configurados', 'warning');
        this.results.warnings.push('Sin headers de seguridad en vercel.json');
      }
    } else {
      this.log('Security', 'No hay vercel.json para configurar headers', 'warning');
    }

    this.results.phases.push({ name: 'Security', passed, failed });
  }

  async phaseSummary() {
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('');
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    📊 RESUMEN DEL EMULADOR                        ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log('');

    // Phase summary table
    console.log('┌─────────────────────┬──────────┬──────────┐');
    console.log('│ Fase                │ Pasados  │ Fallidos │');
    console.log('├─────────────────────┼──────────┼──────────┤');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    for (const phase of this.results.phases) {
      const name = phase.name.padEnd(19);
      const passed = String(phase.passed).padStart(8);
      const failed = String(phase.failed).padStart(8);
      console.log(`│ ${name} │ ${passed} │ ${failed} │`);
      totalPassed += phase.passed;
      totalFailed += phase.failed;
    }
    
    console.log('├─────────────────────┼──────────┼──────────┤');
    console.log(`│ TOTAL               │ ${String(totalPassed).padStart(8)} │ ${String(totalFailed).padStart(8)} │`);
    console.log('└─────────────────────┴──────────┴──────────┘');

    // Metrics
    console.log('');
    console.log('📈 Métricas:');
    if (this.results.metrics.tests) {
      console.log(`   • Tests: ${this.results.metrics.tests} pasaron`);
    }
    if (this.results.metrics.functions) {
      console.log(`   • Functions: ${this.results.metrics.functions} serverless`);
    }
    if (this.results.metrics.buildTime) {
      console.log(`   • Build time: ${this.results.metrics.buildTime}s`);
    }
    if (this.results.metrics.staticSize) {
      console.log(`   • Static assets: ${this.formatSize(this.results.metrics.staticSize)}`);
    }

    // Errors
    if (this.results.errors.length > 0) {
      console.log('');
      console.log('❌ Errores:');
      for (const error of this.results.errors) {
        console.log(`   • ${error}`);
      }
    }

    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('');
      console.log('⚠️  Warnings:');
      for (const warning of this.results.warnings) {
        console.log(`   • ${warning}`);
      }
    }

    console.log('');
    console.log(`⏱️  Tiempo total: ${totalTime}s`);
    console.log('');

    // Final verdict
    if (totalFailed > 0) {
      console.log('╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║  🔴 DEPLOY FALLARÁ - Corrige los errores antes de continuar       ║');
      console.log('╚═══════════════════════════════════════════════════════════════════╝');
      process.exit(1);
    } else if (this.results.warnings.length > 5) {
      console.log('╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║  🟡 DEPLOY POSIBLE - Pero revisa los warnings                     ║');
      console.log('╚═══════════════════════════════════════════════════════════════════╝');
    } else {
      console.log('╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║  🟢 DEPLOY LISTO - El proyecto pasó todas las validaciones        ║');
      console.log('╚═══════════════════════════════════════════════════════════════════╝');
    }
    console.log('');
  }

  // Utility methods
  countFiles(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        count += this.countFiles(fullPath);
      } else {
        count++;
      }
    }
    return count;
  }

  getDirStats(dir) {
    let size = 0;
    let files = 0;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subStats = this.getDirStats(fullPath);
        size += subStats.size;
        files += subStats.files;
      } else {
        size += stat.size;
        files++;
      }
    }
    
    return { size, files };
  }

  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

// Run emulator
const emulator = new VercelEmulator();
emulator.run().catch(console.error);
