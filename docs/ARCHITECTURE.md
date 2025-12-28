# Arquitectura

## Vision general
- Frontend SPA en React/Vite consume la API REST y el canal Socket.IO.
- Backend Flask expone endpoints para negocios, IA, uploads y videos.
- MariaDB almacena negocios y videos; en modo dev se puede omitir escritura.
- Archivos subidos se guardan en `backend/uploads` y se sirven por el backend o Nginx.
- OpenAI se usa para optimizar descripcion y generar imagenes de portada.

## Flujo principal
1. El usuario navega el directorio en el frontend (`/`).
2. El frontend pide datos a `GET /businesses` y arma tarjetas y detalle.
3. El registro usa `POST /upload-logo` y `POST /businesses`.
4. La IA optimiza textos con `POST /ai/optimize` y genera portadas con `POST /ai/generate-cover`.
5. El asistente IA usa Socket.IO (`chat_message` -> `chat_response`).

## Componentes clave
- `src/config.js` define `API_BASE` y `SOCKET_URL`.
- `src/i18n` gestiona idiomas (ES/EN) con `LanguageProvider`.
- `backend/app.py` concentra rutas, validaciones y Socket.IO.
- `backend/db.py` mantiene la conexion a MariaDB.
- `db/schema.sql` y `db/videos_schema.sql` definen el esquema.

## Carpetas
- `src/`: frontend React, rutas y componentes.
- `backend/`: API Flask, Socket.IO y scripts auxiliares.
- `db/`: SQL para tablas y utilidades.
- `public/`: assets estaticos del frontend.
- `dist/`: build del frontend (Vite).
- `nginx.conf`: proxy y estaticos para despliegue.
