-- Create walkins table for walk-in appointments booked through helpdesk
CREATE TABLE IF NOT EXISTS walkins (
    walkin_id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(200),
    aadhar_number VARCHAR(20),
    address TEXT,
    organization_id VARCHAR(20),
    department_id VARCHAR(20),
    service_id VARCHAR(20),
    officer_id VARCHAR(20),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(10),
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    is_walkin BOOLEAN DEFAULT true,
    booked_by VARCHAR(100),
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(50),
    insert_ip VARCHAR(50),
    updated_date TIMESTAMP,
    update_by VARCHAR(50),
    update_ip VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_walkins_officer ON walkins(officer_id);
CREATE INDEX IF NOT EXISTS idx_walkins_date ON walkins(appointment_date);
CREATE INDEX IF NOT EXISTS idx_walkins_status ON walkins(status);
CREATE INDEX IF NOT EXISTS idx_walkins_phone ON walkins(phone);

-- Add comment
COMMENT ON TABLE walkins IS 'Walk-in appointments booked by helpdesk staff';
