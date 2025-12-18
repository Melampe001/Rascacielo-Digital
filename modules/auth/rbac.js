/**
 * RBAC (Role-Based Access Control) Module
 * Manages user roles and permissions
 */

class RBAC {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
  }

  /**
   * Define a new role
   */
  defineRole(roleName, permissions = []) {
    this.roles.set(roleName, new Set(permissions));
    return this;
  }

  /**
   * Add permission to a role
   */
  addPermission(roleName, permission) {
    if (!this.roles.has(roleName)) {
      this.roles.set(roleName, new Set());
    }
    this.roles.get(roleName).add(permission);
    return this;
  }

  /**
   * Remove permission from a role
   */
  removePermission(roleName, permission) {
    if (this.roles.has(roleName)) {
      this.roles.get(roleName).delete(permission);
    }
    return this;
  }

  /**
   * Check if a role has a permission
   */
  can(roleName, permission) {
    if (!this.roles.has(roleName)) {
      return false;
    }
    return this.roles.get(roleName).has(permission);
  }

  /**
   * Check if a role has any of the permissions
   */
  canAny(roleName, permissions) {
    if (!this.roles.has(roleName)) {
      return false;
    }
    const rolePermissions = this.roles.get(roleName);
    return permissions.some(permission => rolePermissions.has(permission));
  }

  /**
   * Check if a role has all permissions
   */
  canAll(roleName, permissions) {
    if (!this.roles.has(roleName)) {
      return false;
    }
    const rolePermissions = this.roles.get(roleName);
    return permissions.every(permission => rolePermissions.has(permission));
  }

  /**
   * Get all permissions for a role
   */
  getPermissions(roleName) {
    if (!this.roles.has(roleName)) {
      return [];
    }
    return Array.from(this.roles.get(roleName));
  }

  /**
   * Get all roles
   */
  getRoles() {
    return Array.from(this.roles.keys());
  }

  /**
   * Middleware for Express.js
   */
  middleware(requiredPermission) {
    return (req, res, next) => {
      const userRole = req.user?.role;

      if (!userRole || !this.can(userRole, requiredPermission)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  }
}

module.exports = RBAC;
