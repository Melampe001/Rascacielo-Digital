/**
 * Access Control Middleware
 * Middleware para proteger rutas y recursos
 */

const securityConfig = require('../../config/security-config');

class AccessMiddleware {
  /**
   * Verificar acceso premium
   */
  static premiumOnly(req, res, next) {
    const user = req.user || { username: req.headers['x-username'], email: req.headers['x-email'] };

    if (!securityConfig.isPremiumUser(user.username, user.email)) {
      return res.status(403).json({
        error: 'Acceso Denegado',
        message: '🔒 Este recurso requiere verificación premium',
        contact: 'Elara (Melampe001) - elara@rascacielo-digital.dev'
      });
    }

    req.accessLevel = securityConfig.getAccessLevel(user);
    next();
  }

  /**
   * Verificar nivel de acceso mínimo
   */
  static requireLevel(minLevel) {
    return (req, res, next) => {
      const user = req.user || { username: req.headers['x-username'] };
      const userLevel = securityConfig.getAccessLevel(user);

      if (userLevel < minLevel) {
        return res.status(403).json({
          error: 'Acceso Denegado',
          message: `Nivel de acceso insuficiente. Requerido: ${minLevel}, Actual: ${userLevel}`
        });
      }

      next();
    };
  }

  /**
   * Rate limiting por usuario
   */
  static rateLimit(maxRequests = 100, windowMs = 60000) {
    const requests = new Map();

    return (req, res, next) => {
      const user = req.user?.username || req.ip;
      const now = Date.now();
      const userRequests = requests.get(user) || [];

      // Limpiar requests antiguos
      const validRequests = userRequests.filter(time => now - time < windowMs);

      if (validRequests.length >= maxRequests) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit excedido. Intenta más tarde.'
        });
      }

      validRequests.push(now);
      requests.set(user, validRequests);

      next();
    };
  }
}

module.exports = AccessMiddleware;
