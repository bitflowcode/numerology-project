#!/bin/bash
# Reiniciar la aplicación
echo "🔄 Reiniciando numerology-api..."
pm2 restart numerology-api
echo ""
echo "✅ App reiniciada"
echo ""
pm2 status
