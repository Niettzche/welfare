# API

Base URL (dev): `http://localhost:5001`.
Si se usa Nginx con prefijo `/api`, ver `nginx.conf`.

## Health
`GET /health`

Respuesta:
```json
{ "status": "ok" }
```

## Businesses (public)
`GET /businesses?limit=50`
- `limit` maximo 200.
- Filtra datos privados: si `show_email` o `show_phone` es falso, se devuelven como `null`.

`POST /businesses`
Body JSON requerido:
```json
{
  "surname": "Perez",
  "email": "contacto@ejemplo.com",
  "phone": "+52 123 456 7890",
  "show_email": true,
  "show_phone": false,
  "business_name": "Mi Negocio",
  "category": "Professional Services",
  "discount": "10%",
  "description": "Servicios...",
  "website": "https://ejemplo.com",
  "logo_url": "https://.../uploads/uuid.png",
  "background_url": "https://.../uploads/uuid.png",
  "tags": ["tag1", "tag2"]
}
```
Respuesta:
- `201` con `{ "id": "uuid", "status": "pending" }`.
- `200` si `SKIP_DB_WRITE=1`.

Validaciones:
- Email con formato valido.
- Telefono 7-20 caracteres (digitos, +, -, espacios, parentesis).
- Descuento dentro de `ALLOWED_DISCOUNTS`.
- Sitio web debe iniciar con `http://` o `https://`.

## Uploads
`POST /upload-logo`
- `multipart/form-data` con campo `logo`.
- Extensiones permitidas: png, jpg, jpeg.
- Max 5MB.

Respuesta:
```json
{ "logo_url": "http://host/uploads/<file>" }
```

`GET /uploads/<filename>`
- Sirve archivos guardados en `backend/uploads/`.

## Admin
`GET /admin/businesses`
- Devuelve negocios con todos los campos (sin filtro de privacidad).

`PUT /admin/businesses/<business_id>`
- Campos editables: `surname`, `email`, `show_email`, `phone`, `show_phone`, `business_name`, `category`, `discount`, `description`, `website`, `status`, `logo_url`, `background_url`, `tags`.

`DELETE /admin/businesses/<business_id>`

## Videos
`GET /videos`
- Lista `id`, `url`, `created_at`.

`POST /videos`
```json
{ "url": "https://www.youtube.com/watch?v=..." }
```

## AI
`POST /ai/optimize`
```json
{ "description": "...", "category": "General", "business_name": "Mi Negocio" }
```
Respuesta:
```json
{ "optimizedDescription": "...", "tags": ["..."] }
```

`POST /ai/generate-cover`
```json
{ "prompt": "...", "business_name": "...", "category": "...", "description": "..." }
```
Respuesta:
```json
{ "cover_url": "http://host/uploads/<file>.png" }
```

## Socket.IO
- `chat_message`: cliente envia `{ "message": "..." }`.
- `chat_response`: servidor responde `{ "message": "..." }`.
