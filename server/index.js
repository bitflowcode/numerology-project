import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import corsMiddleware from './config/cors.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import numerologyRoutes from './routes/numerology.js';

/**
 * Main Server Entry Point
 * Secure Node.js/Express backend with Claude API integration
 */

// Validate required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Please create a .env file based on .env.example and add your API key.');
  console.error('Get your API key from: https://console.anthropic.com/');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware - apply helmet first for security headers
app.use(helmet());

// CORS middleware - must come before routes
app.use(corsMiddleware);

// Body parser middleware with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiter - protect against abuse
app.use(rateLimiter);

// Health check endpoint (before routes, excluded from rate limiting)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount API routes
app.use('/api/numerology', numerologyRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Error handler middleware - must be last
app.use(errorHandler);

// Start server - listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Network: http://192.168.1.174:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`✓ Rate limit: ${process.env.RATE_LIMIT_MAX || 100} requests per ${(parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000} minutes`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
