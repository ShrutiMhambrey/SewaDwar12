-- Create helpdesk table for helpdesk users
CREATE TABLE IF NOT EXISTS m_helpdesk (
    helpdesk_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    location_id INTEGER,
    role_code VARCHAR(50) DEFAULT 'helpdesk',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_helpdesk_username ON m_helpdesk(username);
CREATE INDEX IF NOT EXISTS idx_helpdesk_location ON m_helpdesk(location_id);
