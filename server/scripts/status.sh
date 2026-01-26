#!/bin/bash
# Ver estado de la aplicación

echo "=== PM2 Status ==="
pm2 status
echo ""
echo "=== Health Check Local ==="
curl -s http://localhost:3001/api/health | jq '.' 2>/dev/null || curl http://localhost:3001/api/health
echo ""
