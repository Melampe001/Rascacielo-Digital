/**
 * PR Automation Agent - Rascacielos Digital
 * 
 * Agente especializado en automatización de Pull Requests
 * - Marca PRs Draft como Ready for Review
 * - Valida que pasen los checks
 * - Mergea automáticamente con squash
 * - Elimina branch después del merge
 */

const { Octokit } = require('@octokit/rest');

class PRAutomationAgent {
  constructor(config = {}) {
    this.name = 'PR Automation Agent';
    this.version = '1.0.0';
    this.config = {
      owner: config.owner || 'Melampe001',
      repo: config.repo || 'Rascacielo-Digital',
      token: config.token || process.env.GITHUB_TOKEN,
      mergeMethod: config.mergeMethod || 'squash',
      deleteBranch: config.deleteBranch !== false,
      ...config
    };

    if (!this.config.token) {
      throw new Error('GITHUB_TOKEN is required. Set it via environment variable or config.');
    }

    this.octokit = new Octokit({
      auth: this.config.token
    });
  }

  /**
   * Obtiene información del PR
   * @param {number} prNumber - Número del PR
   * @returns {Promise<Object>} - Información del PR
   */
  async getPRInfo(prNumber) {
    console.log(`[PR Automation Agent] Obteniendo información del PR #${prNumber}...`);
    
    try {
      const { data } = await this.octokit.pulls.get({
        owner: this.config.owner,
        repo: this.config.repo,
        pull_number: prNumber
      });

      return data;
    } catch (error) {
      console.error(`[PR Automation Agent] Error obteniendo info del PR: ${error.message}`);
      throw error;
    }
  }

  /**
   * Marca un PR Draft como Ready for Review
   * @param {number} prNumber - Número del PR
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async markAsReady(prNumber) {
    console.log(`[PR Automation Agent] Marcando PR #${prNumber} como Ready for Review...`);
    
    try {
      const { data } = await this.octokit.pulls.update({
        owner: this.config.owner,
        repo: this.config.repo,
        pull_number: prNumber,
        draft: false
      });

      console.log(`[PR Automation Agent] ✅ PR #${prNumber} marcado como Ready for Review`);
      return data;
    } catch (error) {
      console.error(`[PR Automation Agent] Error marcando como ready: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica el estado de los checks del PR
   * @param {number} prNumber - Número del PR
   * @returns {Promise<Object>} - Estado de los checks
   */
  async checkStatus(prNumber) {
    console.log(`[PR Automation Agent] Verificando estado de checks del PR #${prNumber}...`);
    
    try {
      const prInfo = await this.getPRInfo(prNumber);
      const { data: checks } = await this.octokit.checks.listForRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: prInfo.head.sha
      });

      const { data: statuses } = await this.octokit.repos.getCombinedStatusForRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: prInfo.head.sha
      });

      const allChecks = {
        checkRuns: checks.check_runs,
        statuses: statuses.statuses,
        state: statuses.state,
        totalCount: checks.total_count + statuses.statuses.length
      };

      // Determinar si todos los checks pasaron
      const checksPassed = this.areChecksPassing(allChecks);

      console.log(`[PR Automation Agent] Estado de checks: ${checksPassed ? '✅ Pasaron' : '❌ Fallaron o pendientes'}`);
      console.log(`[PR Automation Agent] Total de checks: ${allChecks.totalCount}`);

      return {
        passed: checksPassed,
        details: allChecks
      };
    } catch (error) {
      console.error(`[PR Automation Agent] Error verificando checks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica si todos los checks están pasando
   * @param {Object} checks - Objeto con los checks
   * @returns {boolean} - true si todos pasaron
   */
  areChecksPassing(checks) {
    // Verificar check runs
    const checkRunsPassed = checks.checkRuns.every(check => 
      check.status === 'completed' && check.conclusion === 'success'
    );

    // Verificar statuses
    const statusesPassed = checks.statuses.every(status => 
      status.state === 'success'
    );

    // Estado general debe ser success
    const overallPassed = checks.state === 'success' || checks.state === '' || checks.totalCount === 0;

    return checkRunsPassed && statusesPassed && overallPassed;
  }

  /**
   * Espera a que los checks pasen
   * @param {number} prNumber - Número del PR
   * @param {Object} options - Opciones de espera
   * @returns {Promise<boolean>} - true si pasaron, false si timeout
   */
  async waitForChecks(prNumber, options = {}) {
    const maxAttempts = options.maxAttempts || 30;
    const intervalMs = options.intervalMs || 10000; // 10 segundos

    console.log(`[PR Automation Agent] Esperando a que pasen los checks (máx ${maxAttempts} intentos)...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`[PR Automation Agent] Intento ${attempt}/${maxAttempts}...`);

      const status = await this.checkStatus(prNumber);

      if (status.passed) {
        console.log('[PR Automation Agent] ✅ Todos los checks pasaron!');
        return true;
      }

      if (attempt < maxAttempts) {
        console.log(`[PR Automation Agent] Esperando ${intervalMs / 1000}s antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    console.log(`[PR Automation Agent] ⏱️ Timeout esperando checks después de ${maxAttempts} intentos`);
    return false;
  }

  /**
   * Mergea un PR
   * @param {number} prNumber - Número del PR
   * @param {Object} options - Opciones de merge
   * @returns {Promise<Object>} - Resultado del merge
   */
  async mergePR(prNumber, options = {}) {
    const commitMessage = options.commitMessage || '✅ Auto-merged via PR Automation Agent';
    const mergeMethod = options.mergeMethod || this.config.mergeMethod;

    console.log(`[PR Automation Agent] Mergeando PR #${prNumber} con método '${mergeMethod}'...`);

    try {
      const { data } = await this.octokit.pulls.merge({
        owner: this.config.owner,
        repo: this.config.repo,
        pull_number: prNumber,
        commit_title: commitMessage,
        merge_method: mergeMethod
      });

      console.log(`[PR Automation Agent] ✅ PR #${prNumber} mergeado exitosamente!`);
      console.log(`[PR Automation Agent] SHA del merge: ${data.sha}`);

      return data;
    } catch (error) {
      console.error(`[PR Automation Agent] Error mergeando PR: ${error.message}`);
      throw error;
    }
  }

  /**
   * Elimina un branch remoto
   * @param {string} branchName - Nombre del branch
   * @returns {Promise<void>}
   */
  async deleteBranch(branchName) {
    console.log(`[PR Automation Agent] Eliminando branch '${branchName}'...`);

    try {
      await this.octokit.git.deleteRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `heads/${branchName}`
      });

      console.log(`[PR Automation Agent] ✅ Branch '${branchName}' eliminado exitosamente!`);
    } catch (error) {
      console.error(`[PR Automation Agent] Error eliminando branch: ${error.message}`);
      throw error;
    }
  }

  /**
   * Flujo completo de auto-merge de PR
   * @param {number} prNumber - Número del PR
   * @param {Object} options - Opciones
   * @returns {Promise<Object>} - Resultado del proceso
   */
  async autoMergePR(prNumber, options = {}) {
    const startTime = Date.now();
    console.log(`\n🤖 [PR Automation Agent] Iniciando auto-merge del PR #${prNumber}...\n`);

    try {
      // 1. Obtener información del PR
      console.log('📋 Paso 1/5: Obteniendo información del PR...');
      const prInfo = await this.getPRInfo(prNumber);
      const branchName = prInfo.head.ref;

      console.log(`   - Título: ${prInfo.title}`);
      console.log(`   - Estado: ${prInfo.state}`);
      console.log(`   - Draft: ${prInfo.draft}`);
      console.log(`   - Branch: ${branchName}`);
      console.log(`   - Mergeable: ${prInfo.mergeable}`);
      console.log('');

      if (prInfo.state !== 'open') {
        throw new Error(`El PR #${prNumber} no está abierto (estado: ${prInfo.state})`);
      }

      // 2. Si es draft, marcar como ready
      if (prInfo.draft) {
        console.log('📝 Paso 2/5: Marcando PR como Ready for Review...');
        await this.markAsReady(prNumber);
        console.log('');
      } else {
        console.log('✓ Paso 2/5: PR ya está marcado como Ready for Review');
        console.log('');
      }

      // 3. Esperar a que pasen los checks
      if (options.waitForChecks !== false) {
        console.log('⏳ Paso 3/5: Esperando a que pasen los checks...');
        const checksPassed = await this.waitForChecks(prNumber, {
          maxAttempts: options.maxAttempts || 30,
          intervalMs: options.intervalMs || 10000
        });

        if (!checksPassed) {
          throw new Error('Los checks no pasaron en el tiempo esperado');
        }
        console.log('');
      } else {
        console.log('⚠️  Paso 3/5: Saltando validación de checks (waitForChecks: false)');
        console.log('');
      }

      // 4. Mergear PR
      console.log('🔀 Paso 4/5: Mergeando PR...');
      const mergeResult = await this.mergePR(prNumber, {
        commitMessage: options.commitMessage,
        mergeMethod: options.mergeMethod
      });
      console.log('');

      // 5. Eliminar branch
      if (this.config.deleteBranch && options.deleteBranch !== false) {
        console.log('🗑️  Paso 5/5: Eliminando branch...');
        await this.deleteBranch(branchName);
        console.log('');
      } else {
        console.log('✓ Paso 5/5: Preservando branch (deleteBranch: false)');
        console.log('');
      }

      const duration = Date.now() - startTime;
      console.log(`\n✅ [PR Automation Agent] Auto-merge completado exitosamente en ${duration}ms\n`);

      return {
        success: true,
        duration,
        prNumber,
        branch: branchName,
        merged: true,
        mergeCommit: mergeResult.sha
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`\n❌ [PR Automation Agent] Error durante auto-merge: ${error.message}\n`);
      
      return {
        success: false,
        duration,
        prNumber,
        error: error.message
      };
    }
  }
}

module.exports = PRAutomationAgent;
