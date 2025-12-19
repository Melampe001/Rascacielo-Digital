/**
 * File Vault - Sistema de Blindaje de Archivos
 * Protección premium con acceso controlado
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const securityConfig = require('../../config/security-config');

class FileVault {
  constructor() {
    this.vaultDir = path.join(__dirname, '../../.vault');
    this.manifestFile = path.join(this.vaultDir, 'manifest.encrypted.json');

    // Archivos sensibles a proteger
    this.sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'config/secrets.js',
      'config/api-keys.js',
      'config/database.js',
      'config/treesit-cloud.js',
      'scripts/deploy-keys.js',
      'modules/auth/tokens.js'
    ];
  }

  /**
   * Inicializar vault
   */
  async initialize() {
    try {
      await fs.mkdir(this.vaultDir, { recursive: true });
      console.log('🔒 File Vault inicializado');
    } catch (error) {
      console.error('❌ Error inicializando vault:', error);
    }
  }

  /**
   * Blindar archivo sensible
   */
  async protectFile(filePath, user) {
    // Verificar acceso premium
    if (!securityConfig.isPremiumUser(user.username, user.email)) {
      throw new Error('🔒 Acceso denegado: Solo usuarios premium pueden blindar archivos');
    }

    try {
      // Leer archivo original
      const content = await fs.readFile(filePath, 'utf8');

      // Encriptar contenido
      const encrypted = securityConfig.encrypt(content);

      // Generar nombre encriptado
      const hash = crypto.createHash('sha256').update(filePath).digest('hex');

      const vaultPath = path.join(this.vaultDir, `${hash}.vault`);

      // Guardar archivo encriptado
      await fs.writeFile(vaultPath, JSON.stringify(encrypted));

      // Actualizar manifest
      await this.updateManifest(filePath, hash, user);

      // Crear archivo proxy con warning
      const proxyContent = this.generateProxyFile(filePath);
      await fs.writeFile(filePath, proxyContent);

      console.log(`✅ Archivo blindado: ${filePath}`);

      return {
        success: true,
        vaultPath,
        hash
      };
    } catch (error) {
      throw new Error(`Error blindando archivo: ${error.message}`);
    }
  }

  /**
   * Acceder a archivo protegido
   */
  async accessFile(filePath, user) {
    // Verificar acceso premium
    if (!securityConfig.isPremiumUser(user.username, user.email)) {
      throw new Error(
        '🔒 ACCESO DENEGADO\n\nEste archivo requiere verificación premium.\nContacta a: Elara (Melampe001)'
      );
    }

    try {
      // Obtener hash del archivo
      const hash = crypto.createHash('sha256').update(filePath).digest('hex');

      const vaultPath = path.join(this.vaultDir, `${hash}.vault`);

      // Leer archivo encriptado
      const encryptedData = JSON.parse(await fs.readFile(vaultPath, 'utf8'));

      // Desencriptar para usuario premium
      const content = securityConfig.decrypt(
        encryptedData.encrypted,
        encryptedData.iv,
        encryptedData.authTag,
        user
      );

      console.log(`✅ Acceso concedido: ${filePath} → ${user.username}`);

      return content;
    } catch (error) {
      throw new Error(`Error accediendo archivo: ${error.message}`);
    }
  }

  /**
   * Blindar todos los archivos sensibles
   */
  async protectAll(user) {
    console.log('🔒 Iniciando blindaje premium...\n');

    const results = {
      protected: [],
      failed: [],
      skipped: []
    };

    for (const file of this.sensitiveFiles) {
      try {
        const exists = await fs
          .access(file)
          .then(() => true)
          .catch(() => false);

        if (!exists) {
          results.skipped.push(file);
          console.log(`⏭️  Skipped: ${file} (no existe)`);
          continue;
        }

        await this.protectFile(file, user);
        results.protected.push(file);
      } catch (error) {
        results.failed.push({ file, error: error.message });
        console.error(`❌ Failed: ${file} - ${error.message}`);
      }
    }

    console.log('\n📊 RESUMEN DE BLINDAJE:');
    console.log(`   ✅ Protegidos: ${results.protected.length}`);
    console.log(`   ❌ Fallidos: ${results.failed.length}`);
    console.log(`   ⏭️  Omitidos: ${results.skipped.length}`);

    return results;
  }

  /**
   * Generar archivo proxy de advertencia
   */
  generateProxyFile(originalPath) {
    return `/**
 * 🔒 ARCHIVO PROTEGIDO - VERIFICACIÓN PREMIUM REQUERIDA
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Este archivo contiene información sensible y está blindado
 * con encriptación AES-256-GCM.
 * 
 * ⚠️  ACCESO RESTRINGIDO
 * Solo usuarios con verificación premium pueden acceder.
 * 
 * 📧 Contacto para acceso:
 *    - Elara (Melampe001)
 *    - Email: elara@rascacielo-digital.dev
 * 
 * 🔐 Para acceder al contenido real:
 *    node scripts/vault-access.js ${originalPath}
 * 
 * Fecha de blindaje: ${new Date().toISOString()}
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

throw new Error('🔒 ACCESO DENEGADO: Requiere verificación premium');
`;
  }

  /**
   * Actualizar manifest de archivos protegidos
   */
  async updateManifest(filePath, hash, user) {
    let manifest = {};

    try {
      const manifestContent = await fs.readFile(this.manifestFile, 'utf8');
      const encryptedManifest = JSON.parse(manifestContent);
      manifest = securityConfig.decrypt(
        encryptedManifest.encrypted,
        encryptedManifest.iv,
        encryptedManifest.authTag,
        user
      );
    } catch (error) {
      // Manifest no existe, crear nuevo
    }

    manifest[filePath] = {
      hash,
      protectedAt: new Date().toISOString(),
      protectedBy: user.username
    };

    const encrypted = securityConfig.encrypt(manifest);
    await fs.writeFile(this.manifestFile, JSON.stringify(encrypted, null, 2));
  }

  /**
   * Listar archivos protegidos
   */
  async listProtected(user) {
    if (!securityConfig.isPremiumUser(user.username, user.email)) {
      return ['🔒 Acceso denegado: Requiere verificación premium'];
    }

    try {
      const manifestContent = await fs.readFile(this.manifestFile, 'utf8');
      const encryptedManifest = JSON.parse(manifestContent);
      const manifest = securityConfig.decrypt(
        encryptedManifest.encrypted,
        encryptedManifest.iv,
        encryptedManifest.authTag,
        user
      );

      return Object.keys(manifest);
    } catch (error) {
      return [];
    }
  }
}

module.exports = new FileVault();
