DROP TABLE IF EXISTS businesses;

CREATE TABLE businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surname TEXT NOT NULL,
    email TEXT NOT NULL,
    show_email BOOLEAN DEFAULT 0,
    phone TEXT NOT NULL,
    show_phone BOOLEAN DEFAULT 0,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    discount TEXT NOT NULL,
    description TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    tags TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
