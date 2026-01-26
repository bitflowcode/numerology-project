# Numerology API - Backend

API REST para interpretaciones numerológicas con Claude AI.

## 🚀 Inicio rápido

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tu API key
nano .env

# Iniciar servidor de desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3001`

---

## 📁 Estructura

```
server/
├── config/           # Configuración (Anthropic, CORS)
├── middleware/       # Validación, rate limiting, errores
├── routes/          # Rutas de la API
├── scripts/         # Scripts de utilidad (logs, restart, etc.)
├── logs/            # Logs de PM2 (creado automáticamente)
├── .env.example     # Plantilla de variables de entorno
├── ecosystem.config.js  # Configuración de PM2
└── index.js         # Punto de entrada
```

---

## 🔑 Variables de entorno

Crea un archivo `.env` con:

```bash
# API Key de Claude/Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Puerto del servidor
PORT=3001

# Entorno (development | production)
NODE_ENV=development

# URL del frontend (separar múltiples con comas)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

---

## 📡 Endpoints

### Health Check
```bash
GET /api/health
```

Responde con estado del servidor:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "environment": "production",
  "uptime": 123.45,
  "port": 3001
}
```

### Interpretación numerológica
```bash
POST /api/numerology/interpret
```

Body:
```json
{
  "tipo": "vida",
  "numero": 7,
  "datos": {
    "nombre": "María García",
    "fechaNacimiento": "1990-05-15",
    "detalles": "Día: 15→6, Mes: 5→5, Año: 1990→1, Total: 6+5+1=12→3"
  },
  "esMaestro": false
}
```

### Chat
```bash
POST /api/numerology/chat
```

Body:
```json
{
  "mensaje": "¿Qué significa el número 7?",
  "conversationHistory": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "Hola, ¿en qué puedo ayudarte?" }
  ]
}
```

---

## 🛠️ Comandos

### Desarrollo
```bash
npm run dev        # Iniciar con nodemon
```

### Producción con PM2
```bash
pm2 start ecosystem.config.js    # Iniciar
pm2 restart numerology-api       # Reiniciar
pm2 stop numerology-api          # Detener
pm2 logs numerology-api          # Ver logs
pm2 status                       # Ver estado
```

### Scripts auxiliares
```bash
bash scripts/logs.sh      # Ver últimos 50 logs
bash scripts/restart.sh   # Reiniciar app
bash scripts/status.sh    # Ver estado y health check
bash scripts/update.sh    # Actualizar después de cambios
```

---

## 🔒 Seguridad

- ✅ Helmet.js para headers de seguridad
- ✅ CORS con whitelist de orígenes
- ✅ Rate limiting (100 req/15min por defecto)
- ✅ Validación y sanitización de inputs
- ✅ Límite de payload: 1MB

---

## 📝 Logs

### Desarrollo
Los logs se muestran en consola con colores.

### Producción (PM2)
Los logs se guardan en:
- Error logs: `logs/err.log`
- Output logs: `logs/out.log`
- PM2 logs: `~/.pm2/logs/`

Ver logs:
```bash
pm2 logs numerology-api          # En tiempo real
pm2 logs numerology-api --lines 50   # Últimas 50 líneas
```

---

## 🐛 Troubleshooting

### Error: "ANTHROPIC_API_KEY is not set"
Verifica que el archivo `.env` existe y contiene la API key.

### Error: "Port 3001 already in use"
```bash
# Encontrar proceso usando el puerto
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### Error 413: "Payload Too Large"
El límite actual es 1MB. Si necesitas más, edita `index.js`:
```javascript
app.use(express.json({ limit: '2mb' }));
```

### Errores de CORS
Verifica que `FRONTEND_URL` en `.env` incluye el origen que hace la petición.

---

## 📚 Deploy

Ver documentación completa:
- [Deploy en Hetzner](../DEPLOY_HETZNER.md)
- [Deploy Frontend en Vercel](../DEPLOY_VERCEL.md)

---

## 🔗 Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **AI**: Claude (Anthropic API)
- **Process Manager**: PM2
- **Web Server**: Caddy (reverse proxy)

---

## 📄 Licencia

Privado - Todos los derechos reservados
