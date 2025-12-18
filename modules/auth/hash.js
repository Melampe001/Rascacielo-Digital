/**
 * Password Hashing Module
 * Secure password hashing and verification
 */

const crypto = require('crypto');

class PasswordHash {
  constructor(config = {}) {
    this.iterations = config.iterations || 10000;
    this.keyLength = config.keyLength || 64;
    this.digest = config.digest || 'sha512';
  }

  /**
   * Hash a password
   */
  async hash(password, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex');
    }

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        this.iterations,
        this.keyLength,
        this.digest,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              hash: derivedKey.toString('hex'),
              salt,
              iterations: this.iterations
            });
          }
        }
      );
    });
  }

  /**
   * Verify a password
   */
  async verify(password, hashedPassword, salt) {
    const result = await this.hash(password, salt);
    return result.hash === hashedPassword;
  }

  /**
   * Generate a random password
   */
  generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length];
    }

    return password;
  }
}

module.exports = PasswordHash;
