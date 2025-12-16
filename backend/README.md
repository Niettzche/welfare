Backend (Flask + MariaDB)
=========================

Requisitos
----------
- Python 3.10+
- MariaDB local con el esquema de `db/schema.sql`

Instalación
-----------
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # ajusta DB_PASSWORD
```

Base de datos
-------------
Ejecuta `db/schema.sql` en tu MariaDB local. Crea la base `welfare`, la tabla `businesses` y el usuario `mastercreators@localhost` con permisos completos. Cambia la contraseña en el SQL y en `.env` si lo deseas.

Modo dev sin escribir en DB
---------------------------
Si la base no está activa pero quieres probar la subida de imágenes, usa `SKIP_DB_WRITE=1` en `.env`. En ese modo:
- `/upload-logo` guarda el archivo localmente en `backend/uploads/` y devuelve `logo_url`.
- `/businesses` entrega un listado de prueba (mock) y las inserciones devuelven id/note sin tocar la DB.

CORS
----
Configura `ALLOWED_ORIGINS` en `.env` (por defecto `http://localhost:5173,http://127.0.0.1:5173`). El backend usa `flask-cors` para enviar los headers necesarios al frontend.

Ejecución
---------
```bash
cd backend
source .venv/bin/activate
flask --app app run --port 5001
```

Endpoints básicos
-----------------
- `GET /health` → estado
- `GET /businesses?limit=50` → lista negocios
- `POST /businesses` → crea negocio (valida email, teléfono, descuento; limpia HTML/caracteres especiales; salta la DB si `SKIP_DB_WRITE=1`)
- `POST /upload-logo` → sube logo (png/jpg máx 5MB) y devuelve `logo_url`
- `GET /uploads/<file>` → sirve logos guardados localmente
