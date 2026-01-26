# 🚀 Deploy en Hetzner (Backend)

Este documento describe el proceso de deploy del **backend** de Numerology App en un servidor Hetzner con Caddy.

## 📋 Prerequisitos

Antes de empezar, verifica que tienes:

### En el servidor Hetzner:
```bash
# 1. Node.js instalado (v18+ o v20+)
node -v

# 2. PM2 instalado globalmente
pm2 -v

# 3. Caddy funcionando
sudo systemctl status caddy

# 4. Dominio configurado (DNS tipo A apuntando a la IP del servidor)
# Ejemplo: api-numerology.tudominio.com → TU_IP_SERVIDOR
```

### En tu Mac:
- SSH configurado: `ssh root@TU_IP_SERVIDOR`
- Código actualizado en `/Users/edu/numerology-project`

---

## 🔧 PASO 1: Crear estructura de carpetas en el servidor

**En el servidor (por SSH):**

```bash
cd /root
mkdir -p numerology-app
mkdir -p numerology-app/server/logs
```

---

## 📤 PASO 2: Subir código desde tu Mac

**En tu Mac (nueva terminal, NO por SSH):**

```bash
# Ir a la carpeta del proyecto
cd /Users/edu/numerology-project

# Subir carpeta server completa
scp -r ./server root@TU_IP_SERVIDOR:/root/numerology-app/

# Verificar que llegó correctamente
ssh root@TU_IP_SERVIDOR "ls -la /root/numerology-app/server"
```

---

## 🔑 PASO 3: Configurar variables de entorno

**En el servidor (por SSH):**

```bash
cd /root/numerology-app/server

# Crear archivo .env desde el ejemplo
cp .env.production.example .env

# Editar con nano
nano .env
```

**Configurar las siguientes variables:**

```bash
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXX  # ← Tu API key real
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://numerology.tudominio.com,https://www.numerology.tudominio.com  # ← Tu dominio de Vercel
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

**Guardar:** `Ctrl + X` → `Y` → `Enter`

---

## 📦 PASO 4: Instalar dependencias

**En el servidor:**

```bash
cd /root/numerology-app/server
npm install --production
```

> ⏱️ Esto tomará 1-2 minutos.

---

## 🚀 PASO 5: Iniciar con PM2

**En el servidor:**

```bash
cd /root/numerology-app/server

# Iniciar la aplicación
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

> 📝 **Importante:** El último comando te dará otro comando para ejecutar. Cópialo y ejecútalo.

---

## ✅ PASO 6: Verificar que funciona localmente

**En el servidor:**

```bash
# Verificar estado de PM2
pm2 status

# Health check local
curl http://localhost:3001/api/health

# Ver logs
pm2 logs numerology-api --lines 20
```

**Deberías ver:**
- PM2 status: `online` ✅
- Health check: `{"status":"ok",...}` ✅
- Sin errores en logs ✅

---

## 🌐 PASO 7: Configurar Caddy

**En el servidor:**

```bash
# Editar configuración de Caddy
sudo nano /etc/caddy/Caddyfile
```

**Añadir al final del archivo** (reemplazar con tu dominio real):

```
api-numerology.tudominio.com {
    reverse_proxy localhost:3001

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
    }

    log {
        output file /var/log/caddy/numerology-api.log {
            roll_size 10MB
            roll_keep 5
        }
    }
}
```

**Guardar:** `Ctrl + X` → `Y` → `Enter`

**Verificar sintaxis:**

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

**Recargar Caddy:**

```bash
sudo systemctl reload caddy
```

---

## 🔒 PASO 8: Verificar en producción

**Espera 1-2 minutos** para que Caddy obtenga el certificado SSL automáticamente.

**Desde tu Mac o el servidor:**

```bash
# Health check público
curl https://api-numerology.tudominio.com/api/health

# Debería responder con JSON y código 200
```

---

## 🎉 ¡Listo!

Tu backend está corriendo en:
- **URL**: `https://api-numerology.tudominio.com`
- **Health Check**: `https://api-numerology.tudominio.com/api/health`
- **PM2 Name**: `numerology-api`

---

## 📝 Comandos útiles

### Ver estado
```bash
pm2 status
```

### Ver logs en tiempo real
```bash
pm2 logs numerology-api
```

### Ver últimas 50 líneas de logs
```bash
pm2 logs numerology-api --lines 50
```

### Reiniciar aplicación
```bash
pm2 restart numerology-api
```

### Detener aplicación
```bash
pm2 stop numerology-api
```

### Monitoreo
```bash
pm2 monit
```

### Scripts auxiliares
```bash
cd /root/numerology-app/server

# Ver logs
bash scripts/logs.sh

# Ver estado
bash scripts/status.sh

# Reiniciar
bash scripts/restart.sh
```

---

## 🐛 Troubleshooting

### Si la app no inicia

```bash
# Ver logs de PM2
pm2 logs numerology-api --lines 50

# Ver estado
pm2 status

# Reiniciar
pm2 restart numerology-api
```

### Si Caddy no funciona

```bash
# Ver logs de Caddy
sudo journalctl -u caddy -f

# Verificar sintaxis del Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile

# Reiniciar Caddy
sudo systemctl restart caddy
```

### Si el health check falla

```bash
# Verificar que el puerto 3001 está abierto
netstat -tuln | grep 3001

# Verificar localmente primero
curl http://localhost:3001/api/health

# Verificar configuración de Caddy
sudo cat /etc/caddy/Caddyfile | grep numerology -A 10
```

### Errores comunes

#### Error: "Cannot find module"
```bash
cd /root/numerology-app/server
npm install --production
pm2 restart numerology-api
```

#### Error: "Port 3001 already in use"
```bash
# Ver qué está usando el puerto
lsof -i :3001

# Matar proceso si es necesario
pm2 delete numerology-api
pm2 start ecosystem.config.js
```

#### Error: "ANTHROPIC_API_KEY is not set"
```bash
# Verificar archivo .env
cat /root/numerology-app/server/.env

# Editar si falta
nano /root/numerology-app/server/.env
pm2 restart numerology-api
```

---

## 🔄 Actualizar la aplicación

Cuando hagas cambios en el código:

**1. Desde tu Mac:**
```bash
cd /Users/edu/numerology-project
scp -r ./server root@TU_IP_SERVIDOR:/root/numerology-app/
```

**2. En el servidor:**
```bash
cd /root/numerology-app/server
npm install --production
pm2 restart numerology-api
```

O simplemente:
```bash
cd /root/numerology-app/server
bash scripts/update.sh
```

---

## 📊 Logs de producción

Los logs se guardan en:
- **PM2 logs**: `/root/.pm2/logs/`
- **Caddy logs**: `/var/log/caddy/numerology-api.log`

```bash
# Ver logs de PM2
pm2 logs numerology-api

# Ver logs de Caddy
sudo tail -f /var/log/caddy/numerology-api.log
```

---

## 🔐 Seguridad

### Variables de entorno
- Nunca hagas commit del archivo `.env`
- Usa `.env.production.example` como plantilla
- Guarda tu `ANTHROPIC_API_KEY` de forma segura

### Firewall
Asegúrate de que solo los puertos necesarios estén abiertos:
- `22` - SSH
- `80` - HTTP (redirige a HTTPS)
- `443` - HTTPS

### Actualizaciones
```bash
# Actualizar Node.js dependencies regularmente
cd /root/numerology-app/server
npm update
pm2 restart numerology-api
```

---

## 📚 Siguiente paso: Deploy del Frontend en Vercel

Ver: [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)
