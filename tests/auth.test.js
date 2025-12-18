/**
 * Tests for Auth Module
 */
const { Auth } = require('../modules/auth');

describe('Auth', () => {
  let auth;

  beforeEach(() => {
    auth = new Auth({
      secret: 'test-secret-key',
      expiresIn: '1h'
    });
  });

  test('should create Auth instance', () => {
    expect(auth).toBeInstanceOf(Auth);
    expect(auth.config.secret).toBe('test-secret-key');
    expect(auth.config.expiresIn).toBe('1h');
  });

  test('should parse expiration time correctly', () => {
    expect(auth.parseExpiration('1s')).toBe(1);
    expect(auth.parseExpiration('1m')).toBe(60);
    expect(auth.parseExpiration('1h')).toBe(3600);
    expect(auth.parseExpiration('1d')).toBe(86400);
    expect(auth.parseExpiration('invalid')).toBe(3600);
  });

  test('should base64URL encode and decode', () => {
    const original = 'Hello, World!';
    const encoded = auth.base64URLEncode(original);
    const decoded = auth.base64URLDecode(encoded);
    expect(decoded).toBe(original);
  });

  test('should generate and verify JWT token', async () => {
    const payload = { userId: 123, username: 'testuser' };
    const token = await auth.generateToken(payload);
    
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verification = await auth.verifyToken(token);
    expect(verification.valid).toBe(true);
    expect(verification.payload.userId).toBe(123);
  });

  test('should reject invalid token', async () => {
    const result = await auth.verifyToken('invalid.token.format');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should hash and verify password', async () => {
    const password = 'mySecurePassword123';
    const { hash, salt } = await auth.hashPassword(password);
    
    expect(typeof hash).toBe('string');
    expect(typeof salt).toBe('string');
    expect(hash.length).toBeGreaterThan(0);

    const isValid = await auth.verifyPassword(password, hash, salt);
    expect(isValid).toBe(true);

    const isInvalid = await auth.verifyPassword('wrongPassword', hash, salt);
    expect(isInvalid).toBe(false);
  });

  test('should check permissions correctly', () => {
    expect(auth.hasPermission(['admin'], 'delete')).toBe(true);
    expect(auth.hasPermission(['editor'], 'write')).toBe(true);
    expect(auth.hasPermission(['viewer'], 'read')).toBe(true);
    expect(auth.hasPermission(['viewer'], 'delete')).toBe(false);
  });
});
