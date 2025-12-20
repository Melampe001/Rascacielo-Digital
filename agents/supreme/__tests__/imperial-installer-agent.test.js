/**
 * Tests for Imperial Package Installer Agent
 */

const ImperialInstallerAgent = require('../imperial-installer-agent');
const fs = require('fs');
const path = require('path');

describe('ImperialInstallerAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ImperialInstallerAgent();
  });

  describe('Constructor', () => {
    test('should create agent with default config', () => {
      expect(agent.name).toBe('Imperial Package Installer Agent');
      expect(agent.version).toBe('1.0.0');
      expect(agent.tier).toBe('SUPREME');
      expect(agent.config.nodeVersion).toBe('18.0.0');
    });

    test('should accept custom config', () => {
      const customAgent = new ImperialInstallerAgent({ timeout: 600000 });
      expect(customAgent.config.timeout).toBe(600000);
    });
  });

  describe('verifyNodeVersion', () => {
    test('should verify Node.js version successfully', async () => {
      const result = await agent.verifyNodeVersion();
      expect(result).toBe(true);
    });

    test('should throw error for old Node.js version', async () => {
      // Mock process.version to simulate old version
      const originalVersion = process.version;
      Object.defineProperty(process, 'version', {
        value: 'v16.0.0',
        configurable: true
      });

      await expect(agent.verifyNodeVersion()).rejects.toThrow();

      // Restore original version
      Object.defineProperty(process, 'version', {
        value: originalVersion,
        configurable: true
      });
    });
  });

  describe('setupTokens', () => {
    test('should return token configuration', async () => {
      const tokens = await agent.setupTokens();
      expect(tokens).toHaveProperty('github');
      expect(tokens).toHaveProperty('npm');
      expect(tokens).toHaveProperty('vercel');
    });
  });

  describe('verifyInstallation', () => {
    test('should verify installation integrity', async () => {
      const result = await agent.verifyInstallation();
      expect(result).toHaveProperty('passed');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('agentsOperational');
      expect(result.agentsOperational).toBe(192);
    });

    test('should verify minimal installation', async () => {
      const result = await agent.verifyInstallation({ minimal: true });
      expect(result.agentsOperational).toBe(40);
    });

    test('should verify custom installation', async () => {
      const customAgents = ['agent1', 'agent2', 'agent3'];
      const result = await agent.verifyInstallation({ custom: customAgents });
      expect(result.agentsOperational).toBe(3);
    });
  });

  describe('generateInstallReport', () => {
    test('should generate full installation report', async () => {
      const data = {
        type: 'full',
        duration: 5000,
        verification: { passed: true, checks: {}, agentsOperational: 192 }
      };

      const report = await agent.generateInstallReport(data);
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('agent');
      expect(report).toHaveProperty('version');
      expect(report).toHaveProperty('tier');
      expect(report.installationType).toBe('full');
      expect(report.duration).toBe(5000);
      expect(report.agentsInstalled).toBe(192);
      expect(report.status).toBe('success');
    });

    test('should generate minimal installation report', async () => {
      const data = {
        type: 'minimal',
        duration: 2000,
        verification: { passed: true, checks: {}, agentsOperational: 40 }
      };

      const report = await agent.generateInstallReport(data);
      expect(report.installationType).toBe('minimal');
      expect(report.agentsInstalled).toBe(40);
    });

    test('should include system information in report', async () => {
      const data = {
        type: 'full',
        duration: 5000,
        verification: { passed: true }
      };

      const report = await agent.generateInstallReport(data);
      expect(report).toHaveProperty('nodeVersion');
      expect(report).toHaveProperty('platform');
      expect(report.nodeVersion).toBe(process.version);
      expect(report.platform).toBe(process.platform);
    });
  });

  describe('installMinimal', () => {
    test('should complete minimal installation', async () => {
      const result = await agent.installMinimal();
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('report');
      expect(result.report.installationType).toBe('minimal');
    });
  });

  describe('installCustom', () => {
    test('should complete custom installation', async () => {
      const selectedAgents = ['agent1', 'agent2', 'agent3'];
      const result = await agent.installCustom(selectedAgents);
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('duration');
      expect(result.report.installationType).toBe('custom');
      expect(result.report.agents).toEqual(selectedAgents);
    });
  });

  describe('getInfo', () => {
    test('should return agent information', () => {
      const info = agent.getInfo();
      expect(info.name).toBe('Imperial Package Installer Agent');
      expect(info.version).toBe('1.0.0');
      expect(info.tier).toBe('SUPREME');
      expect(info).toHaveProperty('config');
    });
  });

  describe('generateEnvFile', () => {
    test('should skip if .env already exists', async () => {
      const envPath = path.join(process.cwd(), '.env');
      const existsSpy = jest.spyOn(fs, 'existsSync');
      existsSpy.mockReturnValueOnce(true); // .env exists

      const result = await agent.generateEnvFile();
      expect(result).toBe(false);

      existsSpy.mockRestore();
    });

    test('should skip if .env.example does not exist', async () => {
      const existsSpy = jest.spyOn(fs, 'existsSync');
      existsSpy.mockReturnValueOnce(false); // .env doesn't exist
      existsSpy.mockReturnValueOnce(false); // .env.example doesn't exist

      const result = await agent.generateEnvFile();
      expect(result).toBe(false);

      existsSpy.mockRestore();
    });
  });

  describe('runPostInstallScripts', () => {
    test('should run post-install scripts', async () => {
      const result = await agent.runPostInstallScripts();
      expect(result).toBe(true);
    });
  });
});
