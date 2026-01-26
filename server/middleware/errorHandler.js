/**
 * Error Handler Middleware
 * Catches all errors, logs safely, and returns sanitized messages to client
 */

export default function errorHandler(err, req, res, next) {
  // Log error for debugging (never log sensitive data)
  console.error('Error occurred:', {
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse = {
    error: err.message || 'Ha ocurrido un error en el servidor.'
  };

  // In development mode, include stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || null;
  }

  // Send sanitized error response
  res.status(statusCode).json(errorResponse);
}
