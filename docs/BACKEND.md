# Backend

## Stack
- Flask 3
- Flask-CORS
- Flask-SocketIO
- PyMySQL
- OpenAI SDK

## Ejecucion local
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app app run --port 5001
```

## Variables de entorno
Archivo base: `backend/.env.example`.
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: conexion a MariaDB.
- `SKIP_DB_WRITE`: si es `1` evita escribir en DB y usa datos mock.
- `ALLOWED_ORIGINS`: lista separada por coma para CORS.
- `OPENAI_API_KEY`: habilita endpoints de IA.
- `OPENAI_IMAGE_MODEL`, `OPENAI_IMAGE_SIZE`: parametros para imagenes.

## Endpoints
Ver `docs/API.md` para detalles. Los principales:
- `GET /health`
- `GET/POST /businesses`
- `POST /upload-logo`
- `GET/POST /videos`
- `POST /ai/optimize`
- `POST /ai/generate-cover`
- `GET/PUT/DELETE /admin/businesses`

## Socket.IO
- Evento `chat_message` recibe una consulta.
- Evento `chat_response` envia la respuesta del asistente.
- El contexto se arma con `build_knowledge_base()` leyendo la tabla `businesses` (o mocks si `SKIP_DB_WRITE=1`).

## Subidas y assets
- `POST /upload-logo` acepta PNG/JPG hasta 5MB.
- Los archivos se guardan en `backend/uploads/` y se sirven con `GET /uploads/<filename>`.

## Scripts auxiliares
- `backend/recommendation.py`: demo local de recomendaciones con TF-IDF.

## Base de datos
- Conexion en `backend/db.py` con `pymysql`.
- Esquema en `db/schema.sql` y `db/videos_schema.sql`.
