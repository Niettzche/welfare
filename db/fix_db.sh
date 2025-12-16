#!/bin/bash

# Configuración (Ajusta estos valores si es necesario)
DB_NAME="welfare"
DB_USER="root"
# Si tu root tiene contraseña, descomenta la siguiente línea y ponla, o usa -p al ejecutar
# DB_PASS="tu_contraseña" 

SQL_COMMANDS=$(cat <<EOF
USE $DB_NAME;

DROP TABLE IF EXISTS businesses;

CREATE TABLE businesses (
    id VARCHAR(36) PRIMARY KEY,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    show_email TINYINT(1) DEFAULT 0,
    phone VARCHAR(50) NOT NULL,
    show_phone TINYINT(1) DEFAULT 0,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    discount VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    website VARCHAR(255),
    logo_url VARCHAR(255),
    tags TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
EOF
)

echo "Aplicando corrección a la base de datos '$DB_NAME'..."

# Ejecutar SQL. Usamos sudo para asegurar permisos de root si es necesario.
# Si prefieres usar una contraseña explícita, cambia el comando a: mysql -u $DB_USER -p"$DB_PASS" -e "$SQL_COMMANDS"
sudo mysql -u $DB_USER -e "$SQL_COMMANDS"

if [ $? -eq 0 ]; then
    echo "✅ Tabla 'businesses' recreada exitosamente con ID VARCHAR(36)."
    echo "Reiniciando el servicio de la API..."
    # Intenta reiniciar el servicio si existe, ignora errores si no (por si se llama diferente)
    sudo systemctl restart welfare-api || echo "⚠️ No se pudo reiniciar 'welfare-api'. Hazlo manualmente si es necesario."
    echo "✅ Proceso completado."
else
    echo "❌ Error al ejecutar el script SQL. Verifica el nombre de la DB y tus credenciales."
fi
