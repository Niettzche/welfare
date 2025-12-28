# Database

## Esquema principal
Archivo: `db/schema.sql`

Tabla `businesses`:
- `id` VARCHAR(36) PK
- `surname` VARCHAR(255)
- `email` VARCHAR(255)
- `show_email` TINYINT(1)
- `phone` VARCHAR(50)
- `show_phone` TINYINT(1)
- `business_name` VARCHAR(255)
- `category` VARCHAR(100)
- `discount` VARCHAR(50)
- `description` TEXT
- `website` VARCHAR(255)
- `logo_url` VARCHAR(255)
- `tags` TEXT (JSON en string)
- `status` VARCHAR(50) default `pending`
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

## Videos (Academia)
Archivo: `db/videos_schema.sql`

Tabla `videos`:
- `id` INT AUTO_INCREMENT PK
- `url` VARCHAR(500)
- `title` VARCHAR(255)
- `thumbnail_url` VARCHAR(500)
- `created_at` TIMESTAMP

## Script util
- `db/fix_db.sh` recrea la tabla `businesses` (requiere permisos de MySQL y sudo).
