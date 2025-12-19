/**
 * Security Configuration - Premium Verification System
 * Acceso controlado con verificación multi-factor
 */

const crypto = require('crypto');

class SecurityConfig {
  constructor() {
    this.premiumTeam = [
      'Melampe001', // Elara
      'elara@rascacielo-digital.dev'
    ];

    this.accessLevels = {
      OWNER: 4, // Elara - Acceso total
      ADMIN: 3, // Team premium - Acceso completo
      DEVELOPER: 2, // Colaboradores - Acceso limitado
      PUBLIC: 1 // Público - Solo lectura docs públicas
    };

    this.encryptionKey = process.env.MASTER_ENCRYPTION_KEY || this.generateMasterKey();
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Verificar si usuario tiene acceso premium
   */
  isPremiumUser(username, email = null) {
    return this.premiumTeam.includes(username) || (email && this.premiumTeam.includes(email));
  }

  /**
   * Obtener nivel de acceso
   */
  getAccessLevel(user) {
    if (!user) return this.accessLevels.PUBLIC;

    if (user.username === 'Melampe001') {
      return this.accessLevels.OWNER;
    }

    if (this.isPremiumUser(user.username, user.email)) {
      return this.accessLevels.ADMIN;
    }

    if (user.isCollaborator) {
      return this.accessLevels.DEVELOPER;
    }

    return this.accessLevels.PUBLIC;
  }

  /**
   * Generar clave maestra de encriptación
   */
  generateMasterKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Encriptar datos sensibles
   */
  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    );

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Desencriptar datos (solo para premium users)
   */
  decrypt(encryptedData, iv, authTag, user) {
    if (!this.isPremiumUser(user.username, user.email)) {
      throw new Error('🔒 Acceso denegado: Requiere verificación premium');
    }

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.encryptionKey, 'hex'),
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}

module.exports = new SecurityConfig();
