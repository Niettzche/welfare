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