/**
 * Auth Module Tests
 */

const { JWT, PasswordHash, RBAC } = require('../auth');

describe('JWT', () => {
  let jwt;

  beforeEach(() => {
    jwt = new JWT('test-secret');
  });

  test('should generate JWT token', () => {
    const token = jwt.generate({ userId: 123 });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('should verify valid token', () => {
    const token = jwt.generate({ userId: 123 });
    const payload = jwt.verify(token);
    expect(payload.userId).toBe(123);
  });

  test('should decode token without verification', () => {
    const token = jwt.generate({ userId: 123 });
    const payload = jwt.decode(token);
    expect(payload.userId).toBe(123);
  });

  test('should throw error for invalid token', () => {
    expect(() => jwt.verify('invalid.token.here')).toThrow();
  });
});

describe('PasswordHash', () => {
  let passwordHash;

  beforeEach(() => {
    passwordHash = new PasswordHash();
  });

  test('should hash password', async () => {
    const result = await passwordHash.hash('password123');
    expect(result.hash).toBeDefined();
    expect(result.salt).toBeDefined();
    expect(typeof result.hash).toBe('string');
  });

  test('should verify correct password', async () => {
    const result = await passwordHash.hash('password123');
    const isValid = await passwordHash.verify('password123', result.hash, result.salt);
    expect(isValid).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const result = await passwordHash.hash('password123');
    const isValid = await passwordHash.verify('wrongpassword', result.hash, result.salt);
    expect(isValid).toBe(false);
  });

  test('should generate random password', () => {
    const password = passwordHash.generatePassword(16);
    expect(password.length).toBe(16);
    expect(typeof password).toBe('string');
  });
});

describe('RBAC', () => {
  let rbac;

  beforeEach(() => {
    rbac = new RBAC();
  });

  test('should define role with permissions', () => {
    rbac.defineRole('admin', ['read', 'write', 'delete']);
    expect(rbac.can('admin', 'read')).toBe(true);
    expect(rbac.can('admin', 'write')).toBe(true);
  });

  test('should add permission to role', () => {
    rbac.defineRole('user', ['read']);
    rbac.addPermission('user', 'write');
    expect(rbac.can('user', 'write')).toBe(true);
  });

  test('should remove permission from role', () => {
    rbac.defineRole('user', ['read', 'write']);
    rbac.removePermission('user', 'write');
    expect(rbac.can('user', 'write')).toBe(false);
  });

  test('should check if role has any permissions', () => {
    rbac.defineRole('user', ['read']);
    expect(rbac.canAny('user', ['read', 'write'])).toBe(true);
    expect(rbac.canAny('user', ['write', 'delete'])).toBe(false);
  });

  test('should check if role has all permissions', () => {
    rbac.defineRole('admin', ['read', 'write', 'delete']);
    expect(rbac.canAll('admin', ['read', 'write'])).toBe(true);
    expect(rbac.canAll('admin', ['read', 'execute'])).toBe(false);
  });

  test('should get all permissions for role', () => {
    rbac.defineRole('admin', ['read', 'write', 'delete']);
    const permissions = rbac.getPermissions('admin');
    expect(permissions).toContain('read');
    expect(permissions).toContain('write');
    expect(permissions).toContain('delete');
  });

  test('should get all roles', () => {
    rbac.defineRole('admin', ['read', 'write']);
    rbac.defineRole('user', ['read']);
    const roles = rbac.getRoles();
    expect(roles).toContain('admin');
    expect(roles).toContain('user');
  });
});
