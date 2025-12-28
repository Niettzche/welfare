# Frontend

## Stack
- React 19 + Vite
- React Router
- Tailwind CSS
- Socket.IO client

## Ejecucion local
```bash
npm install
npm run dev
```

## Variables de entorno
- `VITE_API_URL`: base de la API REST (default `http://localhost:5001`).
- `VITE_SOCKET_URL`: base para Socket.IO (default `http://localhost:5001`).

Ejemplo en `/.env.production`:
```
VITE_API_URL=https://welfare.mastercreators.work/api
VITE_SOCKET_URL=https://welfare.mastercreators.work
```

## Rutas
- `/`: directorio de negocios (Home).
- `/register`: registro de negocios con asistente IA.
- `/admin`: panel para administrar negocios.
- `/parenting-academy`: catalogo de videos.
- `/privacy`: politica de privacidad y terminos.
- `/ayuda`: contacto y soporte.

## Flujos de datos
- Home: `GET /businesses?limit=200`, filtros y paginacion local.
- Admin: `GET /admin/businesses`, edicion con `PUT /admin/businesses/:id` y borrado con `DELETE`.
- Registro: subidas con `POST /upload-logo`, optimizacion con `POST /ai/optimize`, portada con `POST /ai/generate-cover`, alta con `POST /businesses`.
- Academia: `GET /videos` y enriquecimiento de metadata con noembed en cliente.
- IA en tiempo real: modal que usa Socket.IO (`chat_message` / `chat_response`).

## Componentes clave
- `src/components/Layout.jsx`: base comun con header.
- `src/components/Header.jsx`: menu principal, cambio de idioma.
- `src/components/Sidebar.jsx`: filtros y acceso al asistente IA.
- `src/components/ListingCard.jsx`: tarjeta de negocio.
- `src/components/ListingDetailModal.jsx`: detalle y contacto.
- `src/components/AiAssistantModal.jsx`: chat en tiempo real.
- `src/components/AdminEditModal.jsx`: edicion de negocio.
- `src/components/Preloader.jsx`: preloader animado.
- `src/components/Pagination.jsx`: paginacion reusable.

## i18n
- `src/i18n/LanguageProvider.jsx` administra el idioma (ES/EN) y lo persiste en localStorage con la llave `welfare_language`.
- `src/i18n/translations.js` contiene las cadenas.
- `src/i18n/context.js` expone `useLanguage()`.

## Estilos
- `tailwind.config.js` define colores de marca (`welfare.blue`, `welfare.light`) y animaciones custom.
- `src/index.css` y `src/App.css` contienen estilos globales.
