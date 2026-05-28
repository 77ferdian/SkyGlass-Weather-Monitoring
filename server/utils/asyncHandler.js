/**
 * Wraps an async Express route handler to catch errors
 * and forward them to Express error-handling middleware.
 * Eliminates the need for try-catch in every controller.
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} - Express middleware
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
