# Welfare

Directorio de negocios y recursos para la comunidad Welfare School. Incluye registro de negocios con IA, panel de administracion y catalogo de videos para Parenting Academy.

## Funcionalidades
- Directorio con filtros, detalle y contacto por negocio.
- Registro guiado con optimizacion de descripcion y tags por IA.
- Generacion de portadas con IA y carga de logos/imagenes.
- Administracion de negocios (aprobar, editar, eliminar).
- Asistente IA en tiempo real via Socket.IO.
- Academia con listado paginado de videos.

## Stack
- Frontend: React 19, Vite, Tailwind, React Router.
- Backend: Flask, Flask-SocketIO, PyMySQL, OpenAI SDK.
- DB: MariaDB.
- Infra: Nginx + systemd (service para Gunicorn).

## Inicio rapido (local)
Frontend:
```bash
npm install
npm run dev
```

Backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app app run --port 5001
```

Base de datos:
- Ejecuta `db/schema.sql` y `db/videos_schema.sql` en MariaDB.
- Para modo sin escritura en DB, usa `SKIP_DB_WRITE=1` en `backend/.env`.

## Variables de entorno
Frontend:
- `VITE_API_URL` (default `http://localhost:5001`).
- `VITE_SOCKET_URL` (default `http://localhost:5001`).

Backend (ver `backend/.env.example`):
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- `SKIP_DB_WRITE`.
- `ALLOWED_ORIGINS`.
- `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL`, `OPENAI_IMAGE_SIZE`.

## Documentacion
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND.md`
- `docs/BACKEND.md`
- `docs/API.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `backend/README.md`

## Estructura del repo
- `src/`: frontend.
- `backend/`: API Flask, Socket.IO, uploads.
- `db/`: schemas SQL.
- `public/`: assets estaticos.
- `dist/`: build del frontend.
- `nginx.conf`: proxy y estaticos.

## Scripts
- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de produccion.
- `npm run preview`: preview del build.
- `npm run lint`: lint con ESLint.
