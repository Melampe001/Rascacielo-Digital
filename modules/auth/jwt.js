/**
 * JWT Module
 * JSON Web Token generation and verification
 */

class JWT {
  constructor(secret = 'default-secret') {
    this.secret = secret;
  }

  /**
   * Generate a JWT token
   */
  generate(payload, expiresIn = '24h') {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const exp = this.calculateExpiration(now, expiresIn);

    const tokenPayload = {
      ...payload,
      iat: now,
      exp
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Verify a JWT token
   */
  verify(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);

      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Decode token without verification
   */
  decode(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(this.base64UrlDecode(parts[1]));
    return payload;
  }

  sign(data) {
    // Simple signing (in production, use crypto library)
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('base64url');
  }

  base64UrlEncode(str) {
    return Buffer.from(str)
      .toString('base64url');
  }

  base64UrlDecode(str) {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }

  calculateExpiration(now, expiresIn) {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return now + 86400; // Default 24h
    }

    const [, value, unit] = match;
    const multipliers = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    };

    return now + parseInt(value) * multipliers[unit];
  }
}

module.exports = JWT;
