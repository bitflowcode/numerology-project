import cors from 'cors';

/**
 * CORS Configuration
 * Implements whitelist-based origin validation for security
 */

// Parse FRONTEND_URL (puede tener múltiples URLs separadas por comas)
const frontendUrls = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

const allowedOrigins = [
  ...frontendUrls,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.174:5173'
];

// Log allowed origins en desarrollo
if (process.env.NODE_ENV !== 'production') {
  console.log('📡 CORS allowed origins:', allowedOrigins);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

export default cors(corsOptions);
