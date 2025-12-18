/**
 * Auth Module
 * JWT + PBKDF2 password hashing + RBAC
 */

const crypto = require('crypto');

class Auth {
  constructor(config = {}) {
    this.secret = config.secret || process.env.JWT_SECRET || 'default-secret';
    this.tokenExpiry = config.tokenExpiry || '24h';
    this.hashIterations = config.hashIterations || 100000;
    
    if (this.secret === 'default-secret') {
      console.warn('⚠️  Using default JWT secret. Set JWT_SECRET environment variable.');
    }
  }

  generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    })).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  verifyToken(token) {
    try {
      const [header, payload, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(`${header}.${payload}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());

      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, this.hashIterations, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    const computedHash = crypto.pbkdf2Sync(password, salt, this.hashIterations, 64, 'sha512').toString('hex');
    return hash === computedHash;
  }

  checkPermission(user, requiredRole) {
    const roleHierarchy = {
      admin: 3,
      moderator: 2,
      user: 1,
      guest: 0
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }
}

module.exports = { Auth };
