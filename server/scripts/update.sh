#!/bin/bash
# Actualizar la aplicación después de subir nuevo código

echo "🔄 Actualizando numerology-api..."
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production

echo ""
echo "🔄 Reiniciando aplicación..."
pm2 restart numerology-api

echo ""
echo "✅ Actualización completada"
echo ""
pm2 status
