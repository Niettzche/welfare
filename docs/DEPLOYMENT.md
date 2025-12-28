# Deployment

## Frontend (Vite)
1. Configura variables de entorno (ejemplo en `/.env.production`).
2. Build:
```bash
npm install
npm run build
```
3. Publica el contenido de `dist/` con Nginx u otro servidor estatico.

## Backend (Flask)
- Requiere Python 3.10+ y MariaDB.
- Variables en `backend/.env` (ver `backend/.env.example`).
- El servicio de systemd esta en `backend/welfare-api.service` y usa Gunicorn + eventlet.

Pasos tipicos:
1. Crea el virtualenv y dependencias en el servidor.
2. Ajusta `WorkingDirectory` y `EnvironmentFile` en `backend/welfare-api.service`.
3. Instala y habilita:
```bash
sudo cp backend/welfare-api.service /etc/systemd/system/welfare-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now welfare-api
```

## Nginx
Ver `nginx.conf`:
- Sirve `dist/` como frontend.
- Proxy a `127.0.0.1:5001` para API REST.
- Proxy a `/socket.io` para WebSockets.
- Alias para `/uploads/` apuntando a `backend/uploads/`.

Si `VITE_API_URL` incluye `/api`, se usa la regla `rewrite` en `nginx.conf`.
Si no hay prefijo, elimina el `rewrite` y ajusta `VITE_API_URL`.

## Uploads
- Asegura permisos de escritura para el usuario del backend.
- Nginx debe tener acceso de lectura a `backend/uploads/`.
