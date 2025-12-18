/**
 * Authentication Module
 * JWT, password hashing, and RBAC
 */

const JWT = require('./jwt');
const PasswordHash = require('./hash');
const RBAC = require('./rbac');

module.exports = {
  JWT,
  PasswordHash,
  RBAC,
  createJWT: secret => new JWT(secret),
  createPasswordHash: config => new PasswordHash(config),
  createRBAC: () => new RBAC()
};
