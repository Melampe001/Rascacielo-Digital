/**
 * Monitor Agent - Rascacielos Digital
 *
 * Agente especializado en monitoreo y alertas
 */

class MonitorAgent {
  constructor(config = {}) {
    this.config = {
      metrics: config.metrics || ['cpu', 'memory', 'errors'],
      alerting: config.alerting !== false,
      interval: config.interval || 60000, // 1 minuto
      thresholds: {
        cpu: config.thresholds?.cpu || 80,
        memory: config.thresholds?.memory || 85,
        errorRate: config.thresholds?.errorRate || 5,
        responseTime: config.thresholds?.responseTime || 1000,
        ...config.thresholds
      },
      ...config
    };
    this.watching = false;
    this.alerts = [];
  }

  /**
   * Inicia el monitoreo
   * @param {Object} params - Parámetros del monitoreo
   * @returns {Promise<Object>} - Estado del monitoreo
   */
  async watch(params = {}) {
    try {
      console.log('[Monitor Agent] Iniciando monitoreo...');

      const metrics = params.metrics || this.config.metrics;
      console.log(`[Monitor Agent] Métricas a monitorear: ${metrics.join(', ')}`);

      this.watching = true;

      // Recopilar métricas iniciales
      const initialMetrics = await this.collectMetrics(metrics);

      // Verificar alertas
      if (this.config.alerting) {
        await this.checkAlerts(initialMetrics);
      }

      return {
        success: true,
        watching: true,
        metrics: initialMetrics,
        interval: this.config.interval
      };

    } catch (error) {
      console.error('[Monitor Agent] Error durante el monitoreo:', error.message);
      throw error;
    }
  }

  /**
   * Detiene el monitoreo
   */
  async stop() {
    console.log('[Monitor Agent] Deteniendo monitoreo...');
    this.watching = false;
    return { success: true, watching: false };
  }

  /**
   * Recopila métricas del sistema
   */
  async collectMetrics(metrics) {
    console.log('[Monitor Agent] Recopilando métricas...');

    const collectedMetrics = {};

    for (const metric of metrics) {
      collectedMetrics[metric] = await this.collectMetric(metric);
    }

    return {
      timestamp: new Date().toISOString(),
      metrics: collectedMetrics
    };
  }

  /**
   * Recopila una métrica específica
   */
  async collectMetric(metric) {
    // Simulación de recopilación de métricas
    const metricValues = {
      cpu: {
        usage: 45.5,
        cores: 4,
        load: [1.2, 1.5, 1.3]
      },
      memory: {
        total: 16384,
        used: 8192,
        free: 8192,
        percentage: 50
      },
      errors: {
        total: 15,
        rate: 0.5,
        last: [
          { message: 'Connection timeout', count: 5 },
          { message: 'Not found', count: 10 }
        ]
      },
      requests: {
        total: 15000,
        perSecond: 250,
        avgResponseTime: 120
      },
      disk: {
        total: 500,
        used: 200,
        free: 300,
        percentage: 40
      }
    };

    return metricValues[metric] || null;
  }

  /**
   * Verifica si hay alertas basadas en las métricas
   */
  async checkAlerts(metricsData) {
    console.log('[Monitor Agent] Verificando alertas...');

    const newAlerts = [];
    const metrics = metricsData.metrics;

    // Verificar CPU
    if (metrics.cpu && metrics.cpu.usage > this.config.thresholds.cpu) {
      newAlerts.push({
        type: 'cpu',
        severity: 'warning',
        message: `Uso de CPU alto: ${metrics.cpu.usage}%`,
        threshold: this.config.thresholds.cpu,
        value: metrics.cpu.usage,
        timestamp: new Date().toISOString()
      });
    }

    // Verificar memoria
    if (metrics.memory && metrics.memory.percentage > this.config.thresholds.memory) {
      newAlerts.push({
        type: 'memory',
        severity: 'warning',
        message: `Uso de memoria alto: ${metrics.memory.percentage}%`,
        threshold: this.config.thresholds.memory,
        value: metrics.memory.percentage,
        timestamp: new Date().toISOString()
      });
    }

    // Verificar tasa de errores
    if (metrics.errors && metrics.errors.rate > this.config.thresholds.errorRate) {
      newAlerts.push({
        type: 'errors',
        severity: 'critical',
        message: `Tasa de errores alta: ${metrics.errors.rate}%`,
        threshold: this.config.thresholds.errorRate,
        value: metrics.errors.rate,
        timestamp: new Date().toISOString()
      });
    }

    this.alerts = [...this.alerts, ...newAlerts];

    if (newAlerts.length > 0) {
      console.log(`[Monitor Agent] ${newAlerts.length} nueva(s) alerta(s) generada(s)`);
    }

    return newAlerts;
  }

  /**
   * Obtiene el estado actual del sistema
   */
  async getStatus() {
    console.log('[Monitor Agent] Obteniendo estado del sistema...');

    const metrics = await this.collectMetrics(this.config.metrics);

    return {
      status: this.determineOverallStatus(metrics),
      watching: this.watching,
      metrics,
      activeAlerts: this.alerts.filter(a => !a.resolved),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Determina el estado general basado en las métricas
   */
  determineOverallStatus(metricsData) {
    const metrics = metricsData.metrics;

    // Verificar estado crítico
    if (metrics.errors && metrics.errors.rate > this.config.thresholds.errorRate) {
      return 'critical';
    }

    // Verificar estado de advertencia
    if (metrics.cpu && metrics.cpu.usage > this.config.thresholds.cpu) {
      return 'warning';
    }

    if (metrics.memory && metrics.memory.percentage > this.config.thresholds.memory) {
      return 'warning';
    }

    return 'healthy';
  }

  /**
   * Obtiene alertas activas
   */
  async getAlerts(filter = {}) {
    let alerts = [...this.alerts];

    if (filter.severity) {
      alerts = alerts.filter(a => a.severity === filter.severity);
    }

    if (filter.type) {
      alerts = alerts.filter(a => a.type === filter.type);
    }

    if (!filter.includeResolved) {
      alerts = alerts.filter(a => !a.resolved);
    }

    return {
      alerts,
      total: alerts.length
    };
  }

  /**
   * Resuelve una alerta
   */
  async resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      console.log(`[Monitor Agent] Alerta ${alertId} resuelta`);
      return { success: true, alert };
    }
    return { success: false, message: 'Alerta no encontrada' };
  }

  /**
   * Genera reporte de métricas
   */
  async generateReport(period = '24h') {
    console.log(`[Monitor Agent] Generando reporte para período ${period}...`);

    return {
      period,
      summary: {
        avgCpu: 42.3,
        avgMemory: 55.2,
        totalErrors: 150,
        avgResponseTime: 125,
        uptime: '99.95%'
      },
      recommendations: [
        'Considerar escalar horizontalmente durante horas pico',
        'Revisar logs de errores de conexión',
        'Optimizar consultas lentas identificadas'
      ],
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = MonitorAgent;
