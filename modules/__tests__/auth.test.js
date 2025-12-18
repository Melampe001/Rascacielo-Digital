/**
 * Auth Module Tests
 */

const { Auth } = require('../auth');

describe('Auth', () => {
  let auth;

  beforeEach(() => {
    auth = new Auth({ secret: 'test-secret' });
  });

  describe('JWT', () => {
    test('should generate JWT token', () => {
      const token = auth.generateToken({ userId: 123 });
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    test('should verify valid token', () => {
      const token = auth.generateToken({ userId: 123 });
      const payload = auth.verifyToken(token);
      expect(payload.userId).toBe(123);
    });

    test('should throw error for invalid token', () => {
      expect(() => auth.verifyToken('invalid.token.here')).toThrow();
    });

    test('should include iat and exp in token', () => {
      const token = auth.generateToken({ userId: 123 });
      const payload = auth.verifyToken(token);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password', () => {
      const hashed = auth.hashPassword('password123');
      expect(typeof hashed).toBe('string');
      expect(hashed).toContain(':');
    });

    test('should verify correct password', () => {
      const hashed = auth.hashPassword('password123');
      const isValid = auth.verifyPassword('password123', hashed);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', () => {
      const hashed = auth.hashPassword('password123');
      const isValid = auth.verifyPassword('wrongpassword', hashed);
      expect(isValid).toBe(false);
    });

    test('should generate different hashes for same password', () => {
      const hash1 = auth.hashPassword('password123');
      const hash2 = auth.hashPassword('password123');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('RBAC', () => {
    test('should check admin permission', () => {
      const user = { role: 'admin' };
      expect(auth.checkPermission(user, 'admin')).toBe(true);
      expect(auth.checkPermission(user, 'moderator')).toBe(true);
      expect(auth.checkPermission(user, 'user')).toBe(true);
    });

    test('should check user permission', () => {
      const user = { role: 'user' };
      expect(auth.checkPermission(user, 'user')).toBe(true);
      expect(auth.checkPermission(user, 'admin')).toBe(false);
    });

    test('should check guest permission', () => {
      const user = { role: 'guest' };
      expect(auth.checkPermission(user, 'guest')).toBe(true);
      expect(auth.checkPermission(user, 'user')).toBe(false);
    });

    test('should handle unknown roles', () => {
      const user = { role: 'unknown' };
      expect(auth.checkPermission(user, 'admin')).toBe(false);
    });
  });
});
