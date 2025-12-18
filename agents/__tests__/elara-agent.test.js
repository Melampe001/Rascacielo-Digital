/**
 * ELARA Agent Tests
 */

const ElaraAgent = require('../elara-agent');

describe('ElaraAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new ElaraAgent({
      colorScheme: 'modern',
      accessibilityLevel: 'AA',
      verbose: false
    });
  });

  describe('Constructor and Configuration', () => {
    test('should create agent with default config', () => {
      const defaultAgent = new ElaraAgent();
      expect(defaultAgent.config.colorScheme).toBe('modern');
      expect(defaultAgent.config.accessibilityLevel).toBe('AA');
      expect(defaultAgent.config.verbose).toBe(false);
    });

    test('should create agent with custom config', () => {
      const customAgent = new ElaraAgent({
        colorScheme: 'minimalist',
        accessibilityLevel: 'AAA',
        verbose: true
      });
      expect(customAgent.config.colorScheme).toBe('minimalist');
      expect(customAgent.config.accessibilityLevel).toBe('AAA');
      expect(customAgent.config.verbose).toBe(true);
    });

    test('should initialize with empty design history', () => {
      expect(agent.designHistory).toBeDefined();
      expect(Array.isArray(agent.designHistory)).toBe(true);
      expect(agent.designHistory.length).toBe(0);
    });
  });

  describe('Validation', () => {
    test('should validate valid parameters', async () => {
      const params = {
        operation: 'generateColorPalette',
        options: { baseColor: '#3B82F6' }
      };
      await expect(agent.validate(params)).resolves.toBe(true);
    });

    test('should throw error for missing operation', async () => {
      await expect(agent.validate({})).rejects.toThrow('El parámetro operation es requerido');
    });

    test('should throw error for invalid operation', async () => {
      await expect(agent.validate({ operation: 'invalidOp' })).rejects.toThrow(
        'Operación inválida'
      );
    });

    test('should throw error for non-object parameters', async () => {
      await expect(agent.validate(null)).rejects.toThrow('Los parámetros deben ser un objeto');
      await expect(agent.validate('string')).rejects.toThrow('Los parámetros deben ser un objeto');
    });

    test('should validate generateUIComponent requires type', async () => {
      await expect(agent.validate({ operation: 'generateUIComponent' })).rejects.toThrow(
        'El parámetro type es requerido para generateUIComponent'
      );
    });

    test('should validate createLayout requires specs', async () => {
      await expect(agent.validate({ operation: 'createLayout' })).rejects.toThrow(
        'El parámetro specs es requerido para createLayout'
      );
    });

    test('should validate optimizeDesign requires design', async () => {
      await expect(agent.validate({ operation: 'optimizeDesign' })).rejects.toThrow(
        'El parámetro design es requerido para optimizeDesign'
      );
    });
  });

  describe('Generate Color Palette', () => {
    test('should generate color palette with default options', async () => {
      const palette = await agent.generateColorPalette();
      expect(palette.primary).toBeDefined();
      expect(palette.secondary).toBeDefined();
      expect(palette.accent).toBeDefined();
      expect(palette.background).toBeDefined();
      expect(palette.text).toBeDefined();
      expect(Array.isArray(palette.colors)).toBe(true);
      expect(palette.colors.length).toBe(5);
    });

    test('should generate palette with custom base color', async () => {
      const palette = await agent.generateColorPalette({ baseColor: '#FF5733' });
      expect(palette.primary).toBe('#FF5733');
    });

    test('should generate palette with custom color count', async () => {
      const palette = await agent.generateColorPalette({ count: 8 });
      expect(palette.colors.length).toBe(8);
    });

    test('should include accessibility information', async () => {
      const palette = await agent.generateColorPalette();
      expect(palette.accessibility).toBeDefined();
      expect(palette.accessibility.textContrast).toBeDefined();
      expect(palette.accessibility.wcagAA).toBeDefined();
      expect(palette.accessibility.wcagAAA).toBeDefined();
    });

    test('should generate palette with specified scheme', async () => {
      const palette = await agent.generateColorPalette({ scheme: 'minimalist' });
      expect(palette.scheme).toBe('minimalist');
    });
  });

  describe('Create Layout', () => {
    test('should create layout with default specs', async () => {
      const layout = await agent.createLayout();
      expect(layout.type).toBeDefined();
      expect(layout.grid).toBeDefined();
      expect(layout.grid.columns).toBeDefined();
      expect(layout.sections).toBeDefined();
      expect(Array.isArray(layout.sections)).toBe(true);
    });

    test('should create grid layout', async () => {
      const layout = await agent.createLayout({ type: 'grid', columns: 12 });
      expect(layout.type).toBe('grid');
      expect(layout.grid.columns).toBe(12);
    });

    test('should create layout with custom sections', async () => {
      const layout = await agent.createLayout({
        sections: ['header', 'main', 'footer']
      });
      expect(layout.sections.length).toBe(3);
      expect(layout.sections[0].name).toBe('header');
      expect(layout.sections[2].name).toBe('footer');
    });

    test('should include responsive breakpoints', async () => {
      const layout = await agent.createLayout();
      expect(layout.responsive).toBeDefined();
      expect(layout.responsive.mobile).toBeDefined();
      expect(layout.responsive.tablet).toBeDefined();
      expect(layout.responsive.desktop).toBeDefined();
    });

    test('should create layout with custom gap', async () => {
      const layout = await agent.createLayout({ gap: '2rem' });
      expect(layout.grid.gap).toBe('2rem');
    });
  });

  describe('Optimize Design', () => {
    test('should optimize design with colors', async () => {
      const design = {
        colors: { primary: '#3B82F6', secondary: '#10B981' }
      };
      const result = await agent.optimizeDesign(design);
      expect(result.optimized).toBeDefined();
      expect(result.optimizations).toBeDefined();
      expect(Array.isArray(result.optimizations)).toBe(true);
    });

    test('should optimize design with spacing', async () => {
      const design = {
        spacing: { base: '1rem', scale: 1.5 }
      };
      const result = await agent.optimizeDesign(design);
      expect(result.optimized.spacing).toBeDefined();
    });

    test('should optimize design with typography', async () => {
      const design = {
        typography: { fontSize: '16px', lineHeight: '1.5' }
      };
      const result = await agent.optimizeDesign(design);
      expect(result.optimized.typography).toBeDefined();
    });

    test('should calculate design score', async () => {
      const design = {
        colors: {},
        typography: {},
        spacing: {}
      };
      const result = await agent.optimizeDesign(design);
      expect(result.score).toBeDefined();
      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThan(0);
    });

    test('should throw error for invalid design parameter', async () => {
      await expect(agent.optimizeDesign(null)).rejects.toThrow(
        'El parámetro design debe ser un objeto válido'
      );
    });

    test('should return original and optimized design', async () => {
      const design = { colors: {} };
      const result = await agent.optimizeDesign(design);
      expect(result.original).toBeDefined();
      expect(result.optimized).toBeDefined();
    });
  });

  describe('Generate UI Component', () => {
    test('should generate button component', async () => {
      const component = await agent.generateUIComponent('button', { text: 'Click me' });
      expect(component.type).toBe('button');
      expect(component.styles).toBeDefined();
      expect(component.html).toBeDefined();
      expect(component.accessibility).toBeDefined();
    });

    test('should generate card component', async () => {
      const component = await agent.generateUIComponent('card', { content: 'Card content' });
      expect(component.type).toBe('card');
      expect(component.styles).toBeDefined();
    });

    test('should generate input component', async () => {
      const component = await agent.generateUIComponent('input', { placeholder: 'Enter text' });
      expect(component.type).toBe('input');
      expect(component.styles).toBeDefined();
    });

    test('should throw error for unsupported component type', async () => {
      await expect(agent.generateUIComponent('unsupported', {})).rejects.toThrow(
        'Tipo de componente no soportado'
      );
    });

    test('should generate component with variants', async () => {
      const component = await agent.generateUIComponent('button', {
        variants: ['primary', 'secondary']
      });
      expect(component.variants).toBeDefined();
      expect(component.variants.length).toBe(2);
    });

    test('should include accessibility validation', async () => {
      const component = await agent.generateUIComponent('button', { label: 'Submit' });
      expect(component.accessibility).toBeDefined();
      expect(component.accessibility.keyboardAccessible).toBeDefined();
      expect(component.accessibility.score).toBeDefined();
    });

    test('should generate navbar component', async () => {
      const component = await agent.generateUIComponent('navbar', {});
      expect(component.type).toBe('navbar');
    });

    test('should generate modal component', async () => {
      const component = await agent.generateUIComponent('modal', {});
      expect(component.type).toBe('modal');
    });
  });

  describe('Validate Accessibility', () => {
    test('should validate design accessibility', async () => {
      const design = {
        colors: { primary: '#3B82F6', background: '#FFFFFF' },
        typography: { fontSize: '16px' }
      };
      const result = await agent.validateAccessibility(design);
      expect(result.score).toBeDefined();
      expect(result.wcagLevel).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should detect contrast issues', async () => {
      const design = {
        colors: { primary: '#FFFF00', background: '#FFFFFF' }
      };
      const result = await agent.validateAccessibility(design);
      expect(result.issues).toBeDefined();
    });

    test('should detect typography issues', async () => {
      const design = {
        typography: { fontSize: '10px' }
      };
      const result = await agent.validateAccessibility(design);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    test('should provide recommendations', async () => {
      const design = {
        colors: { primary: '#3B82F6', background: '#FFFFFF' }
      };
      const result = await agent.validateAccessibility(design);
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should determine WCAG compliance', async () => {
      const design = {
        colors: { primary: '#000000', background: '#FFFFFF' },
        typography: { fontSize: '16px' }
      };
      const result = await agent.validateAccessibility(design);
      expect(result.compliant).toBeDefined();
      expect(typeof result.compliant).toBe('boolean');
    });

    test('should throw error for invalid design parameter', async () => {
      await expect(agent.validateAccessibility(null)).rejects.toThrow(
        'El parámetro design debe ser un objeto válido'
      );
    });

    test('should include issue summary', async () => {
      const design = { colors: {} };
      const result = await agent.validateAccessibility(design);
      expect(result.summary).toBeDefined();
      expect(result.summary.total).toBeDefined();
      expect(result.summary.critical).toBeDefined();
      expect(result.summary.moderate).toBeDefined();
      expect(result.summary.minor).toBeDefined();
    });

    test('should validate interaction targets', async () => {
      const design = {
        components: [
          { type: 'button', width: 30 },
          { type: 'link', width: 50 }
        ]
      };
      const result = await agent.validateAccessibility(design);
      expect(result.issues.some(i => i.type === 'interaction')).toBe(true);
    });
  });

  describe('Create Responsive Breakpoints', () => {
    test('should create responsive breakpoints', async () => {
      const design = { layout: 'grid' };
      const breakpoints = await agent.createResponsiveBreakpoints(design);
      expect(breakpoints.mobile).toBeDefined();
      expect(breakpoints.tablet).toBeDefined();
      expect(breakpoints.desktop).toBeDefined();
      expect(breakpoints.largeDesktop).toBeDefined();
    });

    test('should include adaptations for each breakpoint', async () => {
      const design = { layout: 'grid' };
      const breakpoints = await agent.createResponsiveBreakpoints(design);
      expect(breakpoints.mobile.adaptations).toBeDefined();
      expect(breakpoints.tablet.adaptations).toBeDefined();
      expect(breakpoints.desktop.adaptations).toBeDefined();
    });

    test('should generate media queries', async () => {
      const design = { layout: 'grid' };
      const breakpoints = await agent.createResponsiveBreakpoints(design);
      expect(breakpoints.mediaQueries).toBeDefined();
      expect(Array.isArray(breakpoints.mediaQueries)).toBe(true);
    });

    test('should throw error for invalid design parameter', async () => {
      await expect(agent.createResponsiveBreakpoints(null)).rejects.toThrow(
        'El parámetro design debe ser un objeto válido'
      );
    });

    test('should adapt design for mobile', async () => {
      const design = { layout: 'grid' };
      const breakpoints = await agent.createResponsiveBreakpoints(design);
      expect(breakpoints.mobile.adaptations.layout).toBe('single-column');
    });

    test('should set correct max widths', async () => {
      const design = { layout: 'grid' };
      const breakpoints = await agent.createResponsiveBreakpoints(design);
      expect(breakpoints.mobile.maxWidth).toBe('767px');
      expect(breakpoints.tablet.minWidth).toBe('768px');
    });
  });

  describe('Execute', () => {
    test('should execute generateColorPalette operation', async () => {
      const result = await agent.execute({
        operation: 'generateColorPalette',
        options: { baseColor: '#3B82F6' }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('generateColorPalette');
      expect(result.result).toBeDefined();
      expect(result.duration).toBeDefined();
    });

    test('should execute createLayout operation', async () => {
      const result = await agent.execute({
        operation: 'createLayout',
        specs: { type: 'grid' }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('createLayout');
    });

    test('should execute optimizeDesign operation', async () => {
      const result = await agent.execute({
        operation: 'optimizeDesign',
        design: { colors: {} }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('optimizeDesign');
    });

    test('should execute generateUIComponent operation', async () => {
      const result = await agent.execute({
        operation: 'generateUIComponent',
        type: 'button',
        props: { text: 'Click' }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('generateUIComponent');
    });

    test('should execute validateAccessibility operation', async () => {
      const result = await agent.execute({
        operation: 'validateAccessibility',
        design: { colors: {} }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('validateAccessibility');
    });

    test('should execute createResponsiveBreakpoints operation', async () => {
      const result = await agent.execute({
        operation: 'createResponsiveBreakpoints',
        design: { layout: 'grid' }
      });
      expect(result.success).toBe(true);
      expect(result.operation).toBe('createResponsiveBreakpoints');
    });

    test('should throw error for unsupported operation', async () => {
      await expect(agent.execute({ operation: 'unsupportedOperation' })).rejects.toThrow(
        'Operación inválida'
      );
    });

    test('should add operation to design history', async () => {
      const initialLength = agent.designHistory.length;
      await agent.execute({
        operation: 'generateColorPalette',
        options: {}
      });
      expect(agent.designHistory.length).toBe(initialLength + 1);
    });

    test('should include timestamp in history', async () => {
      await agent.execute({
        operation: 'generateColorPalette',
        options: {}
      });
      const lastEntry = agent.designHistory[agent.designHistory.length - 1];
      expect(lastEntry.timestamp).toBeDefined();
      expect(lastEntry.operation).toBe('generateColorPalette');
    });
  });

  describe('Rollback', () => {
    test('should rollback last operation', async () => {
      await agent.execute({
        operation: 'generateColorPalette',
        options: {}
      });
      const initialLength = agent.designHistory.length;
      const result = await agent.rollback();
      expect(result.success).toBe(true);
      expect(agent.designHistory.length).toBe(initialLength - 1);
    });

    test('should return reverted operation info', async () => {
      await agent.execute({
        operation: 'createLayout',
        specs: {}
      });
      const result = await agent.rollback();
      expect(result.revertedOperation).toBe('createLayout');
      expect(result.timestamp).toBeDefined();
    });

    test('should handle rollback with empty history', async () => {
      const result = await agent.rollback();
      expect(result.success).toBe(true);
      expect(result.message).toBe('No history to rollback');
    });

    test('should rollback multiple operations sequentially', async () => {
      await agent.execute({ operation: 'generateColorPalette', options: {} });
      await agent.execute({ operation: 'createLayout', specs: {} });

      await agent.rollback();
      expect(agent.designHistory.length).toBe(1);

      await agent.rollback();
      expect(agent.designHistory.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle errors in execute', async () => {
      await expect(agent.execute({ operation: 'invalid' })).rejects.toThrow();
    });

    test('should handle errors in validation', async () => {
      await expect(agent.validate(null)).rejects.toThrow();
    });

    test('should provide meaningful error messages', async () => {
      try {
        await agent.execute({ operation: 'generateUIComponent' });
      } catch (error) {
        expect(error.message).toContain('type');
      }
    });
  });
});
