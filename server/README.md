# Numerology Server

Secure Node.js/Express backend with Claude API integration for numerology interpretations.

## Features

- Claude API integration for AI-powered numerology interpretations
- Comprehensive input validation and sanitization
- Rate limiting to prevent abuse
- CORS protection with whitelist
- Security headers via Helmet
- Spanish language error messages
- Environment-based configuration

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 3. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Claude API key (required) | - |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` (15 min) |

## API Endpoints

### Health Check

**GET** `/api/health`

Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Get Interpretation

**POST** `/api/numerology/interpret`

Get numerology interpretation from Claude.

**Request Body:**
```json
{
  "tipo": "vida",
  "datos": {
    "nombre": "Maria Garcia",
    "fechaNacimiento": "1990-05-15",
    "detalles": "Día: 15→6, Mes: 5, Año: 1990→1"
  },
  "numero": 3,
  "esMaestro": false
}
```

**Valid tipos:**
- `vida` - Número de Vida
- `alma` - Número del Alma
- `personalidad` - Número de Personalidad
- `expresion` - Número de Expresión
- `compatibilidad` - Compatibilidad Numerológica
- `año` - Número de Año Personal
- `maestros` - Número Maestro

**Valid numeros:** 1-9, 11, 22, 33

**Response:**
```json
{
  "interpretation": "Tu número de vida 3...",
  "numero": 3,
  "esMaestro": false,
  "tipo": "vida",
  "metadata": {
    "model": "claude-3-5-sonnet-20241022",
    "usage": {
      "input_tokens": 150,
      "output_tokens": 300
    }
  }
}
```

### Chat

**POST** `/api/numerology/chat`

Chat with Claude about numerology.

**Request Body:**
```json
{
  "mensaje": "¿Qué significa el número 7?",
  "contexto": {
    "numeroActual": 7,
    "tipoActual": "vida"
  }
}
```

**Response:**
```json
{
  "response": "El número 7 representa...",
  "metadata": {
    "model": "claude-3-5-sonnet-20241022",
    "usage": {
      "input_tokens": 100,
      "output_tokens": 200
    }
  }
}
```

## Testing

### Using curl

**Health check:**
```bash
curl http://localhost:3001/api/health
```

**Get interpretation:**
```bash
curl -X POST http://localhost:3001/api/numerology/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "vida",
    "datos": {
      "nombre": "Maria Garcia",
      "fechaNacimiento": "1990-05-15",
      "detalles": "Día: 15→6, Mes: 5, Año: 1990→1"
    },
    "numero": 3,
    "esMaestro": false
  }'
```

**Chat:**
```bash
curl -X POST http://localhost:3001/api/numerology/chat \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "¿Qué significa el número 7?",
    "contexto": {}
  }'
```

**Test rate limiting:**
```bash
# Run this 101 times to trigger rate limit
for i in {1..101}; do
  curl http://localhost:3001/api/health
done
```

**Test invalid input:**
```bash
curl -X POST http://localhost:3001/api/numerology/interpret \
  -H "Content-Type: application/json" \
  -d '{"tipo": "invalid", "datos": {}, "numero": 99}'
```

## Security Features

- **Environment Variables:** Sensitive data (API keys) never in code
- **Input Validation:** All inputs validated and sanitized server-side
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS:** Whitelist-based origin validation
- **Helmet:** Security headers to prevent common attacks
- **Body Size Limits:** 10KB max request size
- **Error Sanitization:** No internal details exposed to client
- **Spanish Errors:** User-friendly error messages in Spanish

## Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] API key is kept secret
- [ ] Server validates API key on startup
- [ ] CORS only allows your frontend origin
- [ ] Rate limiting is enabled
- [ ] All inputs are validated
- [ ] Error messages don't expose internals

## Troubleshooting

**Server won't start - API key error:**
- Make sure `.env` file exists
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check for extra spaces or quotes around the key

**CORS errors in browser:**
- Verify `FRONTEND_URL` matches your frontend URL exactly
- Check browser console for specific CORS error
- Make sure frontend is running on allowed origin

**Rate limit exceeded:**
- Wait 15 minutes for rate limit to reset
- Or adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` in `.env`

**Claude API errors:**
- Check API key is valid
- Verify you have API credits
- Check [Anthropic Status](https://status.anthropic.com/)

## Architecture

```
server/
├── config/
│   ├── anthropic.js    # Claude API setup & prompts
│   └── cors.js         # CORS configuration
├── middleware/
│   ├── errorHandler.js # Error handling
│   ├── rateLimiter.js  # Rate limiting
│   └── validateInput.js # Input validation
├── routes/
│   └── numerology.js   # API endpoints
├── services/
│   └── claudeService.js # Claude API integration
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── index.js            # Server entry point
├── package.json        # Dependencies
└── README.md           # This file
```

## License

ISC
