/**
 * Auth Module - Autenticación y autorización
 */
const crypto = require('crypto');

class Auth {
  constructor(config = {}) {
    this.config = {
      secret: config.secret || process.env.JWT_SECRET || 'default-secret-change-me',
      expiresIn: config.expiresIn || '24h',
      algorithm: config.algorithm || 'HS256',
      ...config
    };
  }

  async generateToken(payload, options = {}) {
    const header = { alg: this.config.algorithm, typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.parseExpiration(options.expiresIn || this.config.expiresIn)
    };

    const encodedHeader = this.base64URLEncode(JSON.stringify(header));
    const encodedPayload = this.base64URLEncode(JSON.stringify(tokenPayload));
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async verifyToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');

      const [encodedHeader, encodedPayload, signature] = parts;
      
      const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);
      if (signature !== expectedSignature) throw new Error('Invalid signature');

      const payload = JSON.parse(this.base64URLDecode(encodedPayload));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) throw new Error('Token expired');

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async hashPassword(password, salt = null) {
    salt = salt || crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve({ hash: derivedKey.toString('hex'), salt });
      });
    });
  }

  async verifyPassword(password, hash, salt) {
    const result = await this.hashPassword(password, salt);
    return result.hash === hash;
  }

  sign(data) {
    return crypto.createHmac('sha256', this.config.secret).update(data).digest('base64url');
  }

  base64URLEncode(str) {
    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  base64URLDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString();
  }

  parseExpiration(timeStr) {
    const units = { s: 1, m: 60, h: 3600, d: 86400 };
    const match = timeStr.match(/^(\d+)([smhd])$/);
    if (!match) return 3600;
    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }

  hasPermission(userRoles, requiredPermission) {
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'admin'],
      editor: ['read', 'write'],
      viewer: ['read']
    };
    return userRoles.some(role => rolePermissions[role]?.includes(requiredPermission));
  }
}

module.exports = { Auth };
