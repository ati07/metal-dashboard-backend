// middleware/logUserAction.js
// const Log = require('../models/log');
import Log from '../models/log.js'
/**
 * Logs user actions from Express routes.
 * @param {string} action - Optional custom action label
 * @param {object} options - Optional metadata or custom route/method override
 */
function logUserAction(action = '', options = {}) {
  return async (req, res, next) => {
    try {
      // You must have `req.user` populated (via auth middleware)
      if (!req.auth.user._id) return next();

      const logEntry = new Log({
        userId: req.auth.user._id,
        action: action || `${req.method} ${req.originalUrl}`,
        route: options.route || req.originalUrl,
        method: options.method || req.method,
        metadata: options.metadata || req.body, // or req.query, etc.
      });

      await logEntry.save();
    } catch (err) {
      console.error('Logging error:', err);
      // Optional: log to file instead of blocking the request
    }

    next(); // Always move to next middleware/handler
  };
}

// module.exports = logUserAction;

export default logUserAction
