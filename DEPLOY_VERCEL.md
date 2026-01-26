# 🚀 Deploy en Vercel (Frontend)

Este documento describe el proceso de deploy del **frontend** de Numerology App en Vercel.

## 📋 Prerequisitos

- [x] Backend desplegado en Hetzner (ver [DEPLOY_HETZNER.md](./DEPLOY_HETZNER.md))
- [x] Cuenta en Vercel (https://vercel.com)
- [x] Cuenta en GitHub
- [x] Código subido a GitHub

---

## 🔧 PASO 1: Subir código a GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `numerology-app` (o el que prefieras)
3. Visibilidad: `Private` (recomendado) o `Public`
4. **NO inicialices** con README, .gitignore, o licencia
5. Click en "Create repository"

### 1.2 Subir código desde tu Mac

**En tu Mac:**

```bash
cd /Users/edu/numerology-project

# Inicializar git (si no está inicializado)
git init

# Crear .gitignore si no existe
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.production
.env.*.local
server/.env
server/.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
server/logs/

# Editor directories
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# PM2
.pm2/
EOF

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: Numerology App"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/numerology-app.git

# Subir código
git branch -M main
git push -u origin main
```

---

## 🌐 PASO 2: Importar proyecto en Vercel

### 2.1 Conectar GitHub con Vercel

1. Ve a https://vercel.com
2. Click en "Add New" → "Project"
3. Click en "Import Git Repository"
4. Autoriza Vercel para acceder a tu GitHub si es la primera vez
5. Selecciona el repositorio `numerology-app`

### 2.2 Configurar proyecto

**Framework Preset:** Vite

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### 2.3 Configurar variables de entorno

En la sección "Environment Variables", agrega:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://api-numerology.tudominio.com` |

> ⚠️ Reemplaza `api-numerology.tudominio.com` con tu dominio real del backend.

### 2.4 Deploy

1. Click en "Deploy"
2. Espera 1-2 minutos a que Vercel construya tu proyecto
3. ¡Listo! Vercel te dará una URL temporal como `https://numerology-app-xxxxx.vercel.app`

---

## 🌍 PASO 3: Configurar dominio personalizado (Opcional)

### Si tienes tu propio dominio:

1. En el dashboard de Vercel, ve a tu proyecto
2. Click en "Settings" → "Domains"
3. Agrega tu dominio: `numerology.tudominio.com`
4. Sigue las instrucciones de Vercel para configurar DNS

### Si NO tienes dominio:

Puedes usar el dominio de Vercel: `https://numerology-app-xxxxx.vercel.app`

---

## 🔄 PASO 4: Actualizar CORS en el backend

**Importante:** Ahora que tienes la URL de Vercel, actualiza el backend.

**En el servidor Hetzner (por SSH):**

```bash
cd /root/numerology-app/server
nano .env
```

**Actualiza `FRONTEND_URL` con tu URL de Vercel:**

```bash
FRONTEND_URL=https://numerology-app-xxxxx.vercel.app
```

O si tienes dominio personalizado:

```bash
FRONTEND_URL=https://numerology.tudominio.com,https://www.numerology.tudominio.com
```

**Guarda:** `Ctrl + X` → `Y` → `Enter`

**Reinicia el backend:**

```bash
pm2 restart numerology-api
```

---

## ✅ PASO 5: Verificar que todo funciona

### 5.1 Abrir la app

Abre tu app en el navegador:
- URL de Vercel: `https://numerology-app-xxxxx.vercel.app`
- O tu dominio personalizado

### 5.2 Pruebas

1. **Tarjeta de Número de Vida:**
   - Ingresa fecha de nacimiento
   - Click en "Calcular"
   - Debe mostrar resultado con interpretación de Claude ✅

2. **Chat:**
   - Haz una pregunta sobre numerología
   - Debe responder con interpretación ✅
   - Pregunta algo NO relacionado con numerología
   - Debe rechazar amablemente ✅

3. **Compatibilidad:**
   - Ingresa datos de 2 personas
   - Debe mostrar puntuación y análisis ✅

### 5.3 Verificar consola del navegador

Abre las DevTools (F12) y verifica que **NO haya errores** en la consola.

Si ves errores de CORS:
- Verifica que `FRONTEND_URL` en el backend incluya tu URL de Vercel
- Reinicia el backend: `pm2 restart numerology-api`

---

## 🎉 ¡Listo!

Tu app está en producción:
- **Frontend**: En Vercel
- **Backend**: En Hetzner

---

## 🔄 Actualizar la aplicación

### Actualizar Frontend (Vercel)

Vercel se actualiza automáticamente con cada push a GitHub:

```bash
cd /Users/edu/numerology-project
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel detectará el push y construirá automáticamente la nueva versión.

### Actualizar Backend (Hetzner)

Ver: [DEPLOY_HETZNER.md](./DEPLOY_HETZNER.md#-actualizar-la-aplicación)

---

## 📊 Monitoreo

### Vercel Dashboard

- **Deployments**: Ver historial de deploys
- **Analytics**: Estadísticas de visitas (si tienes plan Pro)
- **Logs**: Logs de build y runtime

### Logs en tiempo real

Vercel muestra logs en tiempo real durante el build. Si hay errores, aparecerán aquí.

---

## 🐛 Troubleshooting

### Error: "Failed to fetch" en la app

**Causa:** El frontend no puede conectarse al backend.

**Solución:**
1. Verifica que el backend esté corriendo:
   ```bash
   curl https://api-numerology.tudominio.com/api/health
   ```
2. Verifica la variable de entorno `VITE_API_URL` en Vercel
3. Verifica CORS en el backend (debe incluir tu URL de Vercel)

### Error: "CORS policy"

**Causa:** El backend no permite peticiones desde tu dominio de Vercel.

**Solución:**
```bash
# En el servidor
cd /root/numerology-app/server
nano .env

# Añadir tu URL de Vercel a FRONTEND_URL
FRONTEND_URL=https://numerology-app-xxxxx.vercel.app

# Reiniciar
pm2 restart numerology-api
```

### Build falla en Vercel

**Causa:** Error en el código o dependencias.

**Solución:**
1. Ve a los logs del build en Vercel
2. Lee el error específico
3. Corrige el error localmente
4. Haz push nuevamente

### Variables de entorno no funcionan

**Solución:**
1. Ve a Settings → Environment Variables en Vercel
2. Verifica que `VITE_API_URL` esté configurada
3. **Importante:** Después de cambiar variables, debes hacer un nuevo deploy
   - Click en "Deployments"
   - Click en el último deployment
   - Click en los 3 puntos → "Redeploy"

---

## 🔐 Seguridad

### Variables de entorno

- ✅ Nunca hagas commit de `.env`
- ✅ Usa las Environment Variables de Vercel
- ✅ Variables con `VITE_` son públicas (accesibles en el navegador)
- ⚠️ NO pongas secrets en `VITE_*` variables

### HTTPS

- ✅ Vercel proporciona HTTPS automáticamente
- ✅ Certificados SSL renovados automáticamente

---

## 💰 Costos

### Vercel Free Tier incluye:

- ✅ HTTPS/SSL gratuito
- ✅ Builds ilimitados
- ✅ 100 GB de ancho de banda/mes
- ✅ Dominios personalizados
- ✅ Deploy automático con GitHub

Para la mayoría de proyectos personales, el plan gratuito es suficiente.

---

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite en Vercel](https://vercel.com/docs/frameworks/vite)
- [Variables de entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✨ Tips

### Preview Deployments

Cada push a una rama que no sea `main` crea un "Preview Deployment" con su propia URL. Útil para probar cambios antes de producción.

### Rollback

Si algo sale mal, puedes hacer rollback a un deployment anterior:
1. Ve a "Deployments"
2. Encuentra un deployment anterior que funcionaba
3. Click en los 3 puntos → "Promote to Production"

### Dominios

Puedes tener múltiples dominios apuntando a la misma app:
- `numerology.tudominio.com`
- `www.numerology.tudominio.com`
- Vercel manejará automáticamente las redirecciones
