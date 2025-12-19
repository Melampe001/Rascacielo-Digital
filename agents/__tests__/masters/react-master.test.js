/**
 * React Master Tests
 */

const ReactMaster = require('../../masters/react-master');

describe('ReactMaster', () => {
  let master;

  beforeEach(() => {
    master = new ReactMaster();
  });

  test('should initialize with correct properties', () => {
    expect(master.name).toBe('React Master');
    expect(master.version).toBe('1.0.0');
    expect(master.expertise).toContain('React 18+');
    expect(master.bestPractices).toContain('Use functional components with hooks');
  });

  test('should detect class components', async () => {
    const code = `
class MyComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
`;
    const result = await master.analyze(code);
    const hasClassComponentIssue = result.issues.some(
      issue => issue.type === 'class_component'
    );
    expect(hasClassComponentIssue).toBe(true);
  });

  test('should validate functional components', async () => {
    const code = `
import React, { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
`;
    const result = await master.validate(code);
    expect(result.valid).toBe(true);
  });

  test('should scaffold React app', async () => {
    const result = await master.scaffold('app', { name: 'test-app' });
    expect(result).toHaveProperty('files');
    expect(result.files['App.tsx']).toBeDefined();
    expect(result.files['App.tsx']).toContain('useState');
  });

  test('should optimize code', async () => {
    const code = `function Component() { return <div>Test</div>; }`;
    const result = await master.optimize(code);
    expect(result).toHaveProperty('optimizations');
    expect(result.improved).toBe(true);
  });

  test('should provide guidance', () => {
    const guide = master.getGuidance('hooks');
    expect(guide).toHaveProperty('title');
    expect(guide.title).toContain('React');
  });

  test('should handle empty code', async () => {
    const result = await master.analyze('');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('score');
  });
});
