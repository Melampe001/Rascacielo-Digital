/**
 * Tests for Monitor Agent - Rascacielos Digital
 */

const MonitorAgent = require('../agents/monitor-agent');

describe('MonitorAgent', () => {
  let monitorAgent;

  beforeEach(() => {
    monitorAgent = new MonitorAgent();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should create agent with default config', () => {
      expect(monitorAgent.config.metrics).toEqual(['cpu', 'memory', 'errors']);
      expect(monitorAgent.config.alerting).toBe(true);
      expect(monitorAgent.config.interval).toBe(60000);
      expect(monitorAgent.watching).toBe(false);
    });

    test('should create agent with custom config', () => {
      const customAgent = new MonitorAgent({
        metrics: ['cpu', 'disk'],
        alerting: false,
        interval: 30000,
        thresholds: { cpu: 90 }
      });

      expect(customAgent.config.metrics).toEqual(['cpu', 'disk']);
      expect(customAgent.config.alerting).toBe(false);
      expect(customAgent.config.interval).toBe(30000);
      expect(customAgent.config.thresholds.cpu).toBe(90);
    });
  });

  describe('watch', () => {
    test('should start monitoring successfully', async () => {
      const result = await monitorAgent.watch();

      expect(result.success).toBe(true);
      expect(result.watching).toBe(true);
      expect(result.metrics).toBeDefined();
      expect(monitorAgent.watching).toBe(true);
    });

    test('should use custom metrics from params', async () => {
      const result = await monitorAgent.watch({ metrics: ['cpu', 'disk'] });

      expect(result.metrics.metrics).toHaveProperty('cpu');
      expect(result.metrics.metrics).toHaveProperty('disk');
    });
  });

  describe('stop', () => {
    test('should stop monitoring', async () => {
      await monitorAgent.watch();
      const result = await monitorAgent.stop();

      expect(result.success).toBe(true);
      expect(result.watching).toBe(false);
      expect(monitorAgent.watching).toBe(false);
    });
  });

  describe('collectMetrics', () => {
    test('should collect specified metrics', async () => {
      const result = await monitorAgent.collectMetrics(['cpu', 'memory']);

      expect(result.timestamp).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.metrics.cpu).toBeDefined();
      expect(result.metrics.memory).toBeDefined();
    });
  });

  describe('collectMetric', () => {
    test('should collect cpu metric', async () => {
      const result = await monitorAgent.collectMetric('cpu');

      expect(result.usage).toBeDefined();
      expect(result.cores).toBeDefined();
      expect(result.load).toBeDefined();
    });

    test('should collect memory metric', async () => {
      const result = await monitorAgent.collectMetric('memory');

      expect(result.total).toBeDefined();
      expect(result.used).toBeDefined();
      expect(result.free).toBeDefined();
      expect(result.percentage).toBeDefined();
    });

    test('should collect errors metric', async () => {
      const result = await monitorAgent.collectMetric('errors');

      expect(result.total).toBeDefined();
      expect(result.rate).toBeDefined();
      expect(result.last).toBeDefined();
    });

    test('should return null for unknown metric', async () => {
      const result = await monitorAgent.collectMetric('unknown');
      expect(result).toBeNull();
    });
  });

  describe('checkAlerts', () => {
    test('should not generate alerts when below thresholds', async () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 40 },
          memory: { percentage: 50 },
          errors: { rate: 1 }
        }
      };

      const alerts = await monitorAgent.checkAlerts(metricsData);
      expect(alerts.length).toBe(0);
    });

    test('should generate cpu alert when above threshold', async () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 95 },
          memory: { percentage: 50 },
          errors: { rate: 1 }
        }
      };

      const alerts = await monitorAgent.checkAlerts(metricsData);
      const cpuAlert = alerts.find(a => a.type === 'cpu');

      expect(cpuAlert).toBeDefined();
      expect(cpuAlert.severity).toBe('warning');
    });

    test('should generate memory alert when above threshold', async () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 40 },
          memory: { percentage: 95 },
          errors: { rate: 1 }
        }
      };

      const alerts = await monitorAgent.checkAlerts(metricsData);
      const memoryAlert = alerts.find(a => a.type === 'memory');

      expect(memoryAlert).toBeDefined();
      expect(memoryAlert.severity).toBe('warning');
    });

    test('should generate critical error alert', async () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 40 },
          memory: { percentage: 50 },
          errors: { rate: 10 }
        }
      };

      const alerts = await monitorAgent.checkAlerts(metricsData);
      const errorAlert = alerts.find(a => a.type === 'errors');

      expect(errorAlert).toBeDefined();
      expect(errorAlert.severity).toBe('critical');
    });
  });

  describe('getStatus', () => {
    test('should return system status', async () => {
      const result = await monitorAgent.getStatus();

      expect(result.status).toBeDefined();
      expect(result.watching).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('determineOverallStatus', () => {
    test('should return healthy when all metrics normal', () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 40 },
          memory: { percentage: 50 },
          errors: { rate: 1 }
        }
      };

      const status = monitorAgent.determineOverallStatus(metricsData);
      expect(status).toBe('healthy');
    });

    test('should return critical when error rate high', () => {
      const metricsData = {
        metrics: {
          errors: { rate: 10 }
        }
      };

      const status = monitorAgent.determineOverallStatus(metricsData);
      expect(status).toBe('critical');
    });

    test('should return warning when cpu high', () => {
      const metricsData = {
        metrics: {
          cpu: { usage: 95 },
          errors: { rate: 1 }
        }
      };

      const status = monitorAgent.determineOverallStatus(metricsData);
      expect(status).toBe('warning');
    });
  });

  describe('getAlerts', () => {
    test('should return filtered alerts', async () => {
      monitorAgent.alerts = [
        { type: 'cpu', severity: 'warning' },
        { type: 'memory', severity: 'critical' },
        { type: 'errors', severity: 'warning', resolved: true }
      ];

      const result = await monitorAgent.getAlerts({ severity: 'warning' });
      expect(result.alerts.length).toBe(1);
    });

    test('should include resolved alerts when requested', async () => {
      monitorAgent.alerts = [
        { type: 'cpu', severity: 'warning', resolved: true }
      ];

      const result = await monitorAgent.getAlerts({ includeResolved: true });
      expect(result.alerts.length).toBe(1);
    });
  });

  describe('resolveAlert', () => {
    test('should resolve existing alert', async () => {
      monitorAgent.alerts = [{ id: 'alert-1', resolved: false }];

      const result = await monitorAgent.resolveAlert('alert-1');

      expect(result.success).toBe(true);
      expect(result.alert.resolved).toBe(true);
    });

    test('should return failure for non-existent alert', async () => {
      const result = await monitorAgent.resolveAlert('non-existent');

      expect(result.success).toBe(false);
    });
  });

  describe('generateReport', () => {
    test('should generate monitoring report', async () => {
      const result = await monitorAgent.generateReport('24h');

      expect(result.period).toBe('24h');
      expect(result.summary).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.generatedAt).toBeDefined();
    });
  });
});
