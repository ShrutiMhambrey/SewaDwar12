-- ============================================
-- VISITOR MANAGEMENT SYSTEM - COMPLETE SCHEMA
-- ============================================

-- ============================================
-- PART 1: LOCATION HIERARCHY TABLES
-- ============================================

-- 1. STATE TABLE
CREATE TABLE m_state (
    state_code VARCHAR(2) PRIMARY KEY,
    state_name VARCHAR(255) NOT NULL,
    state_name_ll VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL
);

-- 2. DIVISION TABLE
CREATE TABLE m_division (
    division_code VARCHAR(3) NOT NULL PRIMARY KEY,
    state_code VARCHAR(2) NOT NULL,
    division_name VARCHAR(255) NOT NULL,
    division_name_ll VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (state_code) REFERENCES m_state(state_code)
);

-- 3. DISTRICT TABLE
CREATE TABLE m_district (
    district_code VARCHAR(3) NOT NULL PRIMARY KEY,
    division_code VARCHAR(3) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    district_name VARCHAR(255) NOT NULL,
    district_name_ll VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (division_code) REFERENCES m_division(division_code),
    FOREIGN KEY (state_code) REFERENCES m_state(state_code)
);

-- 4. TALUKA TABLE
CREATE TABLE m_taluka (
    taluka_code VARCHAR(4) NOT NULL PRIMARY KEY,
    district_code VARCHAR(5) NOT NULL,
    division_code VARCHAR(5) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    taluka_name VARCHAR(255) NOT NULL,
    taluka_name_ll VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (district_code) REFERENCES m_district(district_code),
    FOREIGN KEY (division_code) REFERENCES m_division(division_code),
    FOREIGN KEY (state_code) REFERENCES m_state(state_code)
);

-- ============================================
-- PART 2: ORGANIZATION HIERARCHY TABLES
-- ============================================

-- 5. ORGANIZATION TABLE
CREATE SEQUENCE IF NOT EXISTS m_organization_id_seq START 1 INCREMENT 1;

CREATE TABLE m_organization (
    organization_id VARCHAR(10) PRIMARY KEY DEFAULT ('ORG' || LPAD(nextval('m_organization_id_seq')::TEXT, 3, '0')),
    organization_name VARCHAR(255) NOT NULL,
    organization_name_ll VARCHAR(255) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (state_code) REFERENCES m_state(state_code)
);

-- 6. DEPARTMENT TABLE
CREATE SEQUENCE IF NOT EXISTS m_department_id_seq START 1 INCREMENT 1;

CREATE TABLE m_department (
    department_id VARCHAR(10) PRIMARY KEY DEFAULT ('DEP' || LPAD(nextval('m_department_id_seq')::TEXT, 3, '0')),
    organization_id VARCHAR(10) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    department_name_ll VARCHAR(255) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (state_code) REFERENCES m_state(state_code),
    FOREIGN KEY (organization_id) REFERENCES m_organization(organization_id)
);

-- 7. SERVICES TABLE
CREATE SEQUENCE IF NOT EXISTS m_services_id_seq START 1 INCREMENT 1;

CREATE TABLE m_services (
    service_id VARCHAR(10) PRIMARY KEY DEFAULT ('SRV' || LPAD(nextval('m_services_id_seq')::TEXT, 3, '0')),
    organization_id VARCHAR(10) NOT NULL,
    department_id VARCHAR(10) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_name_ll VARCHAR(255) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (state_code) REFERENCES m_state(state_code),
    FOREIGN KEY (organization_id) REFERENCES m_organization(organization_id),
    FOREIGN KEY (department_id) REFERENCES m_department(department_id)
);

-- ============================================
-- PART 3: ROLE AND DESIGNATION TABLES
-- ============================================

-- 8. ROLE TABLE
CREATE TABLE m_role (
    role_code VARCHAR(2) PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL,
    role_name_ll VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL
);

-- 9. DESIGNATION TABLE
CREATE TABLE m_designation (
    designation_code VARCHAR(5) PRIMARY KEY,
    designation_name VARCHAR(255) NOT NULL,
    designation_name_ll VARCHAR(255) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    division_code VARCHAR(5) NOT NULL,
    district_code VARCHAR(5) NOT NULL,
    taluka_code VARCHAR(5),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    insert_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (state_code) REFERENCES m_state(state_code),
    FOREIGN KEY (division_code) REFERENCES m_division(division_code),
    FOREIGN KEY (district_code) REFERENCES m_district(district_code),
    FOREIGN KEY (taluka_code) REFERENCES m_taluka(taluka_code)
);

-- ============================================
-- PART 4: USER MANAGEMENT TABLES
-- ============================================

-- 10. USERS TABLE
CREATE SEQUENCE m_users_user_id_seq START 1 INCREMENT 1;

CREATE TABLE m_users (
    user_id VARCHAR(20) PRIMARY KEY DEFAULT ('USR' || LPAD(nextval('m_users_user_id_seq')::TEXT, 3, '0')),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_code VARCHAR(2) NOT NULL REFERENCES m_role(role_code),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_ip VARCHAR(50) NOT NULL DEFAULT 'NA',
    insert_by VARCHAR(100) NOT NULL DEFAULT 'system',
    updated_date TIMESTAMP DEFAULT NULL,
    update_ip VARCHAR(50) DEFAULT NULL,
    update_by VARCHAR(100) DEFAULT NULL
);

-- 11. VISITORS SIGNUP TABLE
CREATE SEQUENCE m_visitors_signup_id_seq START 1 INCREMENT 1;

CREATE TABLE m_visitors_signup (
    visitor_id VARCHAR(20) PRIMARY KEY DEFAULT ('VIS' || LPAD(nextval('m_visitors_signup_id_seq')::TEXT, 3, '0')),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M','F','O')),
    dob DATE,
    mobile_no VARCHAR(15) UNIQUE,
    email_id VARCHAR(255) UNIQUE,
    state_code VARCHAR(2),
    division_code VARCHAR(5),
    district_code VARCHAR(5),
    taluka_code VARCHAR(5),
    pincode VARCHAR(10),
    photo VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES m_users(user_id),
    FOREIGN KEY (state_code) REFERENCES m_state(state_code),
    FOREIGN KEY (division_code) REFERENCES m_division(division_code),
    FOREIGN KEY (district_code) REFERENCES m_district(district_code),
    FOREIGN KEY (taluka_code) REFERENCES m_taluka(taluka_code)
);

-- 12. OFFICERS TABLE
CREATE SEQUENCE m_officers_id_seq START 1 INCREMENT 1;

CREATE TABLE m_officers (
    officer_id VARCHAR(20) PRIMARY KEY DEFAULT ('OFF' || LPAD(nextval('m_officers_id_seq')::TEXT, 3, '0')),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(15) UNIQUE,
    email_id VARCHAR(255) UNIQUE,
    designation_code VARCHAR(5),
    department_id VARCHAR(10),
    organization_id VARCHAR(10),
    state_code VARCHAR(2),
    division_code VARCHAR(5),
    district_code VARCHAR(5),
    taluka_code VARCHAR(5),
    availability_status VARCHAR(50) DEFAULT 'Available',
    photo VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES m_users(user_id),
    FOREIGN KEY (designation_code) REFERENCES m_designation(designation_code),
    FOREIGN KEY (department_id) REFERENCES m_department(department_id),
    FOREIGN KEY (organization_id) REFERENCES m_organization(organization_id),
    FOREIGN KEY (state_code) REFERENCES m_state(state_code),
    FOREIGN KEY (division_code) REFERENCES m_division(division_code),
    FOREIGN KEY (district_code) REFERENCES m_district(district_code),
    FOREIGN KEY (taluka_code) REFERENCES m_taluka(taluka_code)
);

-- 13. HELPDESK TABLE
CREATE SEQUENCE m_helpdesk_id_seq START 1 INCREMENT 1;

CREATE TABLE m_helpdesk (
    helpdesk_id VARCHAR(20) PRIMARY KEY DEFAULT ('HLP' || LPAD(nextval('m_helpdesk_id_seq')::TEXT, 3, '0')),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile_no VARCHAR(15) UNIQUE,
    email_id VARCHAR(255) UNIQUE,
    assigned_department VARCHAR(10),
    assigned_location VARCHAR(10),
    start_time TIME NOT NULL DEFAULT '09:00',
    end_time TIME NOT NULL DEFAULT '17:00',
    photo VARCHAR(500),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES m_users(user_id),
    FOREIGN KEY (assigned_department) REFERENCES m_department(department_id),
    FOREIGN KEY (assigned_location) REFERENCES m_district(district_code)
);

-- 14. ADMINS TABLE
CREATE SEQUENCE m_admins_id_seq START 1 INCREMENT 1;

CREATE TABLE m_admins (
    admin_id VARCHAR(20) PRIMARY KEY DEFAULT ('ADM' || LPAD(nextval('m_admins_id_seq')::TEXT, 3, '0')),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email_id VARCHAR(255) UNIQUE,
    mobile_no VARCHAR(15) UNIQUE,
    photo VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES m_users(user_id)
);

-- ============================================
-- PART 5: APPOINTMENT AND VISIT TABLES
-- ============================================

-- 15. APPOINTMENTS TABLE
CREATE SEQUENCE appointments_id_seq START 1 INCREMENT 1;

CREATE TABLE appointments (
    appointment_id VARCHAR(20) PRIMARY KEY DEFAULT ('APT' || LPAD(nextval('appointments_id_seq')::TEXT, 3, '0')),
    visitor_id VARCHAR(20) NOT NULL,
    organization_id VARCHAR(10) NOT NULL,
    department_id VARCHAR(10) NOT NULL,
    officer_id VARCHAR(20) NOT NULL,
    service_id VARCHAR(20) NOT NULL,
    purpose TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','rescheduled','completed')),
    reschedule_reason TEXT,
    qr_code_path VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (visitor_id) REFERENCES m_visitors_signup(visitor_id),
    FOREIGN KEY (officer_id) REFERENCES m_officers(officer_id),
    FOREIGN KEY (organization_id) REFERENCES m_organization(organization_id),
    FOREIGN KEY (department_id) REFERENCES m_department(department_id),
    FOREIGN KEY (service_id) REFERENCES m_services(service_id)
);

-- 16. APPOINTMENT DOCUMENTS TABLE
CREATE SEQUENCE appointment_documents_id_seq START 1 INCREMENT 1;

CREATE TABLE appointment_documents (
    document_id VARCHAR(20) PRIMARY KEY DEFAULT ('DOC' || LPAD(nextval('appointment_documents_id_seq')::TEXT, 3, '0')),
    appointment_id VARCHAR(20) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by VARCHAR(20) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (uploaded_by) REFERENCES m_users(user_id)
);

-- 17. WALKINS TABLE
CREATE SEQUENCE walkins_id_seq START 1 INCREMENT 1;

CREATE TABLE walkins (
    walkin_id VARCHAR(20) PRIMARY KEY DEFAULT ('W' || LPAD(nextval('walkins_id_seq')::TEXT, 5, '0')),
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M','F','O')),
    mobile_no VARCHAR(15),
    email_id VARCHAR(255),
    id_proof_type VARCHAR(100) DEFAULT NULL,
    id_proof_no VARCHAR(50) DEFAULT NULL,
    organization_id VARCHAR(10) NOT NULL,
    department_id VARCHAR(10) NOT NULL,
    officer_id VARCHAR(20),
    purpose VARCHAR(500) NOT NULL,
    walkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','completed')),
    remarks VARCHAR(500),
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    FOREIGN KEY (organization_id) REFERENCES m_organization(organization_id),
    FOREIGN KEY (department_id) REFERENCES m_department(department_id),
    FOREIGN KEY (officer_id) REFERENCES m_officers(officer_id)
);

-- 18. WALKIN TOKENS TABLE
CREATE SEQUENCE walkin_tokens_id_seq START 1 INCREMENT 1;

CREATE TABLE walkin_tokens (
    token_id VARCHAR(20) PRIMARY KEY DEFAULT ('T' || LPAD(nextval('walkin_tokens_id_seq')::TEXT, 5, '0')),
    walkin_id VARCHAR(20) NOT NULL,
    token_number VARCHAR(20) NOT NULL,
    issue_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting','in-progress','served','cancelled')),
    called_time TIMESTAMP DEFAULT NULL,
    completed_time TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (walkin_id) REFERENCES walkins(walkin_id)
);

-- 19. CHECKINS TABLE
CREATE SEQUENCE checkins_id_seq START 1 INCREMENT 1;

CREATE TABLE checkins (
    checkin_id VARCHAR(20) PRIMARY KEY DEFAULT ('CHK' || LPAD(nextval('checkins_id_seq')::TEXT, 5, '0')),
    visitor_id VARCHAR(20) NOT NULL,
    appointment_id VARCHAR(20),
    walkin_id VARCHAR(20),
    checkin_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checkout_time TIMESTAMP DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'checked-in' CHECK (status IN ('checked-in','completed','cancelled')),
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (visitor_id) REFERENCES m_visitors_signup(visitor_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (walkin_id) REFERENCES walkins(walkin_id)
);

-- 20. QUEUE TABLE
CREATE SEQUENCE queue_id_seq START 1 INCREMENT 1;

CREATE TABLE queue (
    queue_id VARCHAR(20) PRIMARY KEY DEFAULT ('QUE' || LPAD(nextval('queue_id_seq')::TEXT, 5, '0')),
    token_number VARCHAR(20) NOT NULL,
    appointment_id VARCHAR(20),
    walkin_id VARCHAR(20),
    visitor_id VARCHAR(20) NOT NULL,
    position VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','served','skipped')),
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (walkin_id) REFERENCES walkins(walkin_id),
    FOREIGN KEY (visitor_id) REFERENCES m_visitors_signup(visitor_id)
);

-- 21. FEEDBACK TABLE
CREATE SEQUENCE feedback_id_seq START 1 INCREMENT 1;

CREATE TABLE feedback (
    feedback_id VARCHAR(20) PRIMARY KEY DEFAULT ('FDB' || LPAD(nextval('feedback_id_seq')::TEXT, 5, '0')),
    visitor_id VARCHAR(20) NOT NULL,
    appointment_id VARCHAR(20),
    walkin_id VARCHAR(20),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    insert_by VARCHAR(100) DEFAULT 'system',
    insert_ip VARCHAR(50) DEFAULT 'NA',
    updated_date TIMESTAMP DEFAULT NULL,
    update_by VARCHAR(100),
    update_ip VARCHAR(50),
    FOREIGN KEY (visitor_id) REFERENCES m_visitors_signup(visitor_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (walkin_id) REFERENCES walkins(walkin_id)
);

-- 22. NOTIFICATIONS TABLE
CREATE SEQUENCE notifications_id_seq START 1 INCREMENT 1;

CREATE TABLE notifications (
    notification_id VARCHAR(20) PRIMARY KEY DEFAULT ('NOT' || LPAD(nextval('notifications_id_seq')::TEXT, 5, '0')),
    username VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES m_users(username)
);

-- ============================================
-- PART 6: INITIAL DATA INSERTS
-- ============================================

-- Insert State (Maharashtra)
INSERT INTO m_state (state_code, state_name, state_name_ll)
VALUES ('27', 'Maharashtra', 'महाराष्ट्र');

-- Insert Divisions
INSERT INTO m_division (division_code, state_code, division_name, division_name_ll)
VALUES 
('01', '27', 'Konkan', 'कोकण'),
('02', '27', 'Pune', 'पुणे'),
('03', '27', 'Nashik', 'नाशिक'),
('04', '27', 'Aurangabad', 'औरंगाबाद'),
('05', '27', 'Amravati', 'अमरावती'),
('06', '27', 'Nagpur', 'नागपूर');

-- Insert Sample District (add your districts here)
INSERT INTO m_district (district_code, division_code, state_code, district_name, district_name_ll)
VALUES ('482', '02', '27', 'Pune', 'पुणे');

-- Insert Roles
INSERT INTO m_role (role_code, role_name, role_name_ll, is_active, insert_ip, insert_by)
VALUES 
('VS', 'Visitor', 'अभ्यागत', TRUE, '127.0.0.1', 'system'),
('AD', 'Administrator', 'प्रशासक', TRUE, '127.0.0.1', 'system'),
('OF', 'Officer', 'अधिकारी', TRUE, '127.0.0.1', 'system'),
('HD', 'Helpdesk', 'सहायता डेस्क', TRUE, '127.0.0.1', 'system');

-- Insert Sample Designation
INSERT INTO m_designation (
    designation_code,
    designation_name,
    designation_name_ll,
    state_code,
    division_code,
    district_code,
    taluka_code
)
VALUES
('DES01', 'District Officer', 'जिल्हाधिकारी', '27', '01', '482', NULL),
('DES02', 'Assistant Officer', 'सहाय्यक अधिकारी', '27', '01', '482', NULL),
('DES03', 'Clerk', 'लिपिक', '27', '01', '482', NULL);

-- Insert Organizations
INSERT INTO m_organization (
    organization_id,
    organization_name,
    organization_name_ll,
    state_code
) VALUES 
('ORG001', 'Organization1', 'संस्था1', '27'),
('ORG002', 'Organization2', 'संस्था2', '27'),
('ORG003', 'Organization3', 'संस्था3', '27');

-- Update organization sequence
SELECT setval(
    'm_organization_id_seq',
    (SELECT COALESCE(MAX(CAST(SUBSTRING(organization_id, 4) AS INTEGER)), 0) + 1
    FROM m_organization)
);

-- Insert Departments
INSERT INTO m_department (
    department_id,
    organization_id,
    department_name,
    department_name_ll,
    state_code
) VALUES
('DEP001', 'ORG001', 'Department1', 'विभाग1', '27'),
('DEP002', 'ORG002', 'Department2', 'विभाग2', '27'),
('DEP003', 'ORG003', 'Department3', 'विभाग3', '27');

-- Update department sequence
SELECT setval(
    'm_department_id_seq',
    (SELECT COALESCE(MAX(CAST(SUBSTRING(department_id, 5) AS INTEGER)), 0) + 1
     FROM m_department)
);

-- Insert Services
INSERT INTO m_services (
    service_id,
    organization_id,
    department_id,
    service_name,
    service_name_ll,
    state_code
) VALUES
('SRV001', 'ORG001', 'DEP001', 'Service1', 'सेवा1', '27'),
('SRV002', 'ORG002', 'DEP002', 'Service2', 'सेवा2', '27'),
('SRV003', 'ORG003', 'DEP003', 'Service3', 'सेवा3', '27');

-- Update services sequence
SELECT setval(
    'm_services_id_seq',
    (SELECT COALESCE(MAX(CAST(SUBSTRING(service_id, 4) AS INTEGER)), 0) + 1
     FROM m_services)
);

-- ============================================
-- PART 7: FUNCTIONS
-- ============================================

-- Function: Get Designations
CREATE OR REPLACE FUNCTION get_designations()
RETURNS TABLE(
    designation_code VARCHAR,
    designation_name TEXT
)
LANGUAGE sql
AS $$
  SELECT designation_code, designation_name
  FROM m_designation
  WHERE is_active = TRUE
  ORDER BY designation_name;
$$;

-- Function: Get Organizations
CREATE OR REPLACE FUNCTION get_organizations()
RETURNS TABLE(
    organization_id VARCHAR,
    organization_name TEXT
)
LANGUAGE sql
AS $$
  SELECT 
      organization_id,
      organization_name::TEXT
  FROM 
      m_organization
  WHERE 
      is_active = TRUE
  ORDER BY 
      organization_name;
$$;

-- Function: Get Departments
CREATE OR REPLACE FUNCTION get_departments(p_organization_id VARCHAR)
RETURNS TABLE(
    department_id VARCHAR,
    department_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT d.department_id, d.department_name
  FROM m_department d
  WHERE d.organization_id = p_organization_id
    AND d.is_active = TRUE
  ORDER BY d.department_name;
END;
$$;

-- Function: Get Services
CREATE OR REPLACE FUNCTION get_services(
    p_organization_id VARCHAR,
    p_department_id VARCHAR
)
RETURNS TABLE(
    service_id VARCHAR,
    service_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT s.service_id, s.service_name
  FROM m_services s
  WHERE s.organization_id = p_organization_id
    AND s.department_id = p_department_id
    AND s.is_active = TRUE
  ORDER BY s.service_name;
END;
$$;

-- Function: Get States
CREATE OR REPLACE FUNCTION get_states()
RETURNS TABLE(state_code VARCHAR, state_name TEXT)
LANGUAGE sql
AS $$
  SELECT state_code, state_name::TEXT
  FROM m_state
  WHERE is_active = TRUE
  ORDER BY state_name;
$$;

-- Function: Get Divisions
CREATE OR REPLACE FUNCTION get_divisions(p_state_code VARCHAR)
RETURNS TABLE(division_code VARCHAR, division_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT d.division_code, d.division_name
  FROM m_division d
  WHERE d.state_code = p_state_code AND d.is_active = TRUE
  ORDER BY d.division_name;
END;
$$;

-- Function: Get Districts
CREATE OR REPLACE FUNCTION get_districts(p_state_code VARCHAR, p_division_code VARCHAR)
RETURNS TABLE(district_code VARCHAR, district_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT d.district_code, d.district_name
  FROM m_district d
  WHERE d.division_code = p_division_code
    AND d.state_code = p_state_code
    AND d.is_active = TRUE
  ORDER BY d.district_name;
END;
$$;

-- Function: Get Talukas
CREATE OR REPLACE FUNCTION get_talukas(p_state_code VARCHAR, p_division_code VARCHAR, p_district_code VARCHAR)
RETURNS TABLE(taluka_code VARCHAR, taluka_name VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT t.taluka_code, t.taluka_name
  FROM m_taluka t
  WHERE t.district_code = p_district_code
    AND t.division_code = p_division_code
    AND t.state_code = p_state_code
    AND t.is_active = TRUE
  ORDER BY t.taluka_name;
END;
$$;

-- Function: Get Roles
CREATE OR REPLACE FUNCTION get_roles()
RETURNS TABLE (
    role_code VARCHAR,
    role_name VARCHAR,
    role_name_ll VARCHAR,
    is_active BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT r.role_code, r.role_name, r.role_name_ll, r.is_active
    FROM m_role r
    WHERE r.is_active = TRUE
      AND r.role_name <> 'Visitor'
    ORDER BY r.role_name ASC;
END;
$$;

-- Function: Register Visitor
CREATE OR REPLACE FUNCTION register_visitor(
    p_password_hash VARCHAR,
    p_full_name VARCHAR,
    p_gender CHAR(1),
    p_dob DATE,
    p_mobile_no VARCHAR,
    p_email_id VARCHAR,
    p_state_code VARCHAR DEFAULT NULL,
    p_division_code VARCHAR DEFAULT NULL,
    p_district_code VARCHAR DEFAULT NULL,
    p_taluka_code VARCHAR DEFAULT NULL,
    p_pincode VARCHAR DEFAULT NULL,
    p_photo VARCHAR DEFAULT NULL
)
RETURNS TABLE(out_user_id VARCHAR, visitor_id VARCHAR, message TEXT) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid VARCHAR(20);
    v_visitor_id VARCHAR(20);
BEGIN
    IF EXISTS (SELECT 1 FROM m_visitors_signup WHERE mobile_no = p_mobile_no) THEN
        RETURN QUERY SELECT NULL::VARCHAR, NULL::VARCHAR, 'Mobile number already registered';
        RETURN;
    END IF;

    IF EXISTS (SELECT 1 FROM m_visitors_signup WHERE email_id = p_email_id) THEN
        RETURN QUERY SELECT NULL::VARCHAR, NULL::VARCHAR, 'Email already registered';
        RETURN;
    END IF;

    INSERT INTO m_users (username, password_hash, role_code, insert_by)
    VALUES ('temp_' || p_mobile_no, p_password_hash, 'VS', 'self')
    RETURNING user_id INTO v_uid;

    INSERT INTO m_visitors_signup (
        user_id, full_name, gender, dob, mobile_no, email_id,
        state_code, division_code, district_code, taluka_code,
        pincode, photo, insert_by
    )
    VALUES (
        v_uid, p_full_name, p_gender, p_dob, p_mobile_no, p_email_id,
        p_state_code, p_division_code, p_district_code, p_taluka_code,
        p_pincode, p_photo, 'self'
    )
    RETURNING m_visitors_signup.visitor_id INTO v_visitor_id;

    UPDATE m_users
    SET username = v_visitor_id
    WHERE user_id = v_uid;

    RETURN QUERY SELECT v_uid, v_visitor_id, 'Registration successful';
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT NULL::VARCHAR, NULL::VARCHAR,
        'Registration failed: ' || SQLERRM;
END;
$$;

-- Function: Get User by Username
CREATE OR REPLACE FUNCTION get_user_by_username(
    p_username VARCHAR
)
RETURNS TABLE(
    out_user_id VARCHAR,
    out_username VARCHAR,
    out_password_hash VARCHAR,
    out_role_code VARCHAR,
    out_is_active BOOLEAN
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT user_id, username, password_hash, role_code, is_active
    FROM m_users
    WHERE username = p_username;
END;
$$;

-- Function: Get User by Username with Location
CREATE OR REPLACE FUNCTION get_user_by_username2(
    p_username VARCHAR
)
RETURNS TABLE(
    out_user_id VARCHAR,
    out_username VARCHAR,
    out_password_hash VARCHAR,
    out_role_code VARCHAR,
    out_is_active BOOLEAN,
    out_state_code VARCHAR,
    out_division_code VARCHAR,
    out_district_code VARCHAR,
    out_taluka_code VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id,
        u.username,
        u.password_hash,
        u.role_code,
        u.is_active,
        COALESCE(o.state_code, v.state_code) AS out_state_code,
        COALESCE(o.division_code, v.division_code) AS out_division_code,
        COALESCE(o.district_code, v.district_code) AS out_district_code,
        COALESCE(o.taluka_code, v.taluka_code) AS out_taluka_code
    FROM m_users u
    LEFT JOIN m_officers o ON o.user_id = u.user_id
    LEFT JOIN m_visitors_signup v ON v.user_id = u.user_id
    WHERE u.username = p_username;
END;
$$;

-- Function: Get Visitor Dashboard
CREATE OR REPLACE FUNCTION get_visitor_dashboard_by_username(p_username VARCHAR)
RETURNS JSON 
LANGUAGE plpgsql
AS $$
DECLARE
    appointment_data JSON;
    notification_data JSON;
    visitor_name VARCHAR;
BEGIN
    SELECT vs.full_name
    INTO visitor_name
    FROM m_visitors_signup vs
    JOIN m_users u ON u.user_id = vs.user_id
    WHERE u.username = p_username
    LIMIT 1;

    SELECT json_agg(
        json_build_object(
            'appointment_id', a.appointment_id,
            'organization_name', o.organization_name,
            'department_name', d.department_name,
            'officer_name', off.full_name,
            'service_name', s.service_name,
            'appointment_date', a.appointment_date,
            'slot_time', a.slot_time,
            'status', a.status,
            'purpose', a.purpose
        )
        ORDER BY a.insert_date DESC
    )
    INTO appointment_data
    FROM appointments a
    JOIN m_organization o ON o.organization_id = a.organization_id
    JOIN m_department d ON d.department_id = a.department_id
    JOIN m_officers off ON off.officer_id = a.officer_id
    JOIN m_services s ON s.service_id = a.service_id
    JOIN m_visitors_signup vs ON vs.visitor_id = a.visitor_id
    JOIN m_users u ON u.user_id = vs.user_id
    WHERE u.username = p_username;

    SELECT json_agg(
        json_build_object(
            'message', 
            CASE 
                WHEN a.status = 'approved' THEN 'Your appointment ' || a.appointment_id || ' has been approved.'
                WHEN a.status = 'rejected' THEN 'Your appointment ' || a.appointment_id || ' was rejected.'
                WHEN a.status = 'completed' THEN 'Your appointment ' || a.appointment_id || ' is completed.'
                ELSE 'Your appointment ' || a.appointment_id || ' is pending.'
            END,
            'status', a.status,
            'appointment_id', a.appointment_id
        )
        ORDER BY a.insert_date DESC
    )
    INTO notification_data
    FROM appointments a
    JOIN m_visitors_signup vs ON vs.visitor_id = a.visitor_id
    JOIN m_users u ON u.user_id = vs.user_id
    WHERE u.username = p_username;

    RETURN json_build_object(
        'full_name', visitor_name,
        'appointments', COALESCE(appointment_data, '[]'::json),
        'notifications', COALESCE(notification_data, '[]'::json)
    );
END;
$$;

-- Function: Register User by Role
CREATE OR REPLACE FUNCTION register_user_by_role(
    p_password_hash VARCHAR,
    p_full_name VARCHAR,
    p_mobile_no VARCHAR,
    p_email_id VARCHAR,
    p_designation_code VARCHAR DEFAULT NULL,
    p_department_id VARCHAR DEFAULT NULL,
    p_organization_id VARCHAR DEFAULT NULL,
    p_state_code VARCHAR DEFAULT NULL,
    p_division_code VARCHAR DEFAULT NULL,
    p_district_code VARCHAR DEFAULT NULL,
    p_taluka_code VARCHAR DEFAULT NULL,
    p_photo VARCHAR DEFAULT NULL,
    p_role_code VARCHAR DEFAULT 'OF'
)
RETURNS TABLE(out_user_id VARCHAR, out_entity_id VARCHAR, message TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid VARCHAR(20);
    v_entity_id VARCHAR(20);
BEGIN
    IF NOT EXISTS (SELECT 1 FROM m_role WHERE role_code = p_role_code AND is_active = TRUE) THEN
        RETURN QUERY SELECT NULL::VARCHAR, NULL::VARCHAR, 'Invalid or inactive role code';
        RETURN;
    END IF;

    IF p_role_code = 'OF' AND EXISTS (SELECT 1 FROM m_officers WHERE mobile_no = p_mobile_no OR email_id = p_email_id) THEN
        RETURN QUERY SELECT NULL, NULL, 'Officer mobile/email already registered';
        RETURN;
    ELSIF p_role_code = 'HD' AND EXISTS (SELECT 1 FROM m_helpdesk WHERE mobile_no = p_mobile_no OR email_id = p_email_id) THEN
        RETURN QUERY SELECT NULL, NULL, 'Helpdesk mobile/email already registered';
        RETURN;
    ELSIF p_role_code = 'AD' AND EXISTS (SELECT 1 FROM m_admins WHERE mobile_no = p_mobile_no OR email_id = p_email_id) THEN
        RETURN QUERY SELECT NULL, NULL, 'Admin mobile/email already registered';
        RETURN;
    END IF;

    INSERT INTO m_users (username, password_hash, role_code, insert_by)
    VALUES ('temp_' || p_mobile_no, p_password_hash, p_role_code, 'system')
    RETURNING user_id INTO v_uid;

    IF p_role_code = 'OF' THEN
        INSERT INTO m_officers (
            user_id, full_name, mobile_no, email_id,
            designation_code, department_id, organization_id,
            state_code, division_code, district_code, taluka_code,
            photo, insert_by
        ) VALUES (
            v_uid, p_full_name, p_mobile_no, p_email_id,
            p_designation_code, p_department_id, p_organization_id,
            p_state_code, p_division_code, p_district_code, p_taluka_code,
            p_photo, 'system'
        )
        RETURNING officer_id INTO v_entity_id;

    ELSIF p_role_code = 'HD' THEN
        INSERT INTO m_helpdesk (
            user_id, full_name, mobile_no, email_id,
            assigned_department, assigned_location, photo, insert_by
        ) VALUES (
            v_uid, p_full_name, p_mobile_no, p_email_id,
            p_department_id, p_district_code, p_photo, 'system'
        )
        RETURNING helpdesk_id INTO v_entity_id;

    ELSIF p_role_code = 'AD' THEN
        INSERT INTO m_admins (
            user_id, full_name, email_id, mobile_no, photo, insert_by
        ) VALUES (
            v_uid, p_full_name, p_email_id, p_mobile_no, p_photo, 'system'
        )
        RETURNING admin_id INTO v_entity_id;
    END IF;

    UPDATE m_users
    SET username = v_entity_id
    WHERE user_id = v_uid;

    RETURN QUERY SELECT v_uid, v_entity_id, 'User registered successfully';

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT NULL::VARCHAR, NULL::VARCHAR, 'Registration failed: ' || SQLERRM;
END;
$$;

-- Function: Insert Organization with Departments and Services
CREATE OR REPLACE FUNCTION insert_organization_data(
    p_organization_name TEXT,
    p_organization_name_ll TEXT,
    p_state_code TEXT,
    p_departments JSON
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_organization_id VARCHAR(10);
    v_department_id VARCHAR(10);
    dept_obj JSON;
    service_obj JSON;
BEGIN
    INSERT INTO m_organization(
        organization_name, organization_name_ll, state_code
    ) VALUES (
        p_organization_name, p_organization_name_ll, p_state_code
    )
    RETURNING organization_id INTO v_organization_id;

    IF p_departments IS NULL OR json_array_length(p_departments) = 0 THEN
        RETURN json_build_object('success', TRUE, 'organization_id', v_organization_id);
    END IF;

    FOR dept_obj IN SELECT * FROM json_array_elements(p_departments)
    LOOP
        INSERT INTO m_department(
            organization_id, department_name, department_name_ll, state_code
        ) VALUES (
            v_organization_id,
            dept_obj->>'dept_name',
            dept_obj->>'dept_name_ll',
            p_state_code
        ) RETURNING department_id INTO v_department_id;

        IF dept_obj->'services' IS NULL
           OR json_typeof(dept_obj->'services') <> 'array'
           OR json_array_length(dept_obj->'services') = 0 THEN
            CONTINUE;
        END IF;

        FOR service_obj IN SELECT * FROM json_array_elements(dept_obj->'services')
        LOOP
            INSERT INTO m_services(
                organization_id, department_id, service_name, service_name_ll, state_code
            ) VALUES (
                v_organization_id,
                v_department_id,
                service_obj->>'name',
                service_obj->>'name_ll',
                p_state_code
            );
        END LOOP;
    END LOOP;

    RETURN json_build_object(
        'success', TRUE,
        'organization_id', v_organization_id
    );
END;
$$;

-- Function: Insert Department Data
CREATE OR REPLACE FUNCTION insert_department_data(
    p_organization_id TEXT,
    p_state_code TEXT,
    p_departments JSON
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_department_id VARCHAR(10);
    dept_obj JSON;
    service_obj JSON;
    v_inserted_departments INT := 0;
    v_inserted_services INT := 0;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM m_organization WHERE organization_id = p_organization_id) THEN
        RETURN json_build_object(
            'success', FALSE,
            'message', 'Organization not found'
        );
    END IF;

    IF p_departments IS NULL OR json_array_length(p_departments) = 0 THEN
        RETURN json_build_object(
            'success', FALSE,
            'message', 'No departments provided'
        );
    END IF;

    FOR dept_obj IN SELECT * FROM json_array_elements(p_departments)
    LOOP
        INSERT INTO m_department (
            organization_id,
            department_name,
            department_name_ll,
            state_code
        ) VALUES (
            p_organization_id,
            dept_obj->>'dept_name',
            dept_obj->>'dept_name_ll',
            p_state_code
        )
        RETURNING department_id INTO v_department_id;

        v_inserted_departments := v_inserted_departments + 1;

        IF dept_obj->'services' IS NOT NULL
           AND json_typeof(dept_obj->'services') = 'array'
           AND json_array_length(dept_obj->'services') > 0 THEN

            FOR service_obj IN SELECT * FROM json_array_elements(dept_obj->'services')
            LOOP
                INSERT INTO m_services (
                    organization_id,
                    department_id,
                    service_name,
                    service_name_ll,
                    state_code
                ) VALUES (
                    p_organization_id,
                    v_department_id,
                    service_obj->>'name',
                    service_obj->>'name_ll',
                    p_state_code
                );
                v_inserted_services := v_inserted_services + 1;
            END LOOP;

        END IF;
    END LOOP;

    RETURN json_build_object(
        'success', TRUE,
        'message', 'Departments and services inserted successfully',
        'organization_id', p_organization_id,
        'departments_added', v_inserted_departments,
        'services_added', v_inserted_services
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', FALSE,
            'message', 'Error inserting data: ' || SQLERRM
        );
END;
$$;

-- Function: Insert Appointment
CREATE OR REPLACE FUNCTION insert_appointment(
    p_visitor_id VARCHAR,
    p_organization_id VARCHAR,
    p_department_id VARCHAR,
    p_officer_id VARCHAR,
    p_service_id VARCHAR,
    p_purpose TEXT,
    p_appointment_date DATE,
    p_slot_time TIME,
    p_insert_by VARCHAR,
    p_insert_ip VARCHAR
)
RETURNS VARCHAR 
LANGUAGE plpgsql
AS $$
DECLARE
    appointment_id VARCHAR;
BEGIN
    INSERT INTO appointments(
        visitor_id,
        organization_id,
        department_id,
        officer_id,
        service_id,
        purpose,
        appointment_date,
        slot_time,
        insert_by,
        insert_ip
    )
    VALUES (
        p_visitor_id,
        p_organization_id,
        p_department_id,
        p_officer_id,
        p_service_id,
        p_purpose,
        p_appointment_date,
        p_slot_time,
        p_insert_by,
        p_insert_ip
    )
    RETURNING appointments.appointment_id INTO appointment_id;

    RETURN appointment_id;
END;
$$;

-- Function: Insert Appointment Document
CREATE OR REPLACE FUNCTION insert_appointment_document(
    p_appointment_id VARCHAR,
    p_doc_type VARCHAR,
    p_file_path VARCHAR,
    p_uploaded_by VARCHAR
)
RETURNS VARCHAR 
LANGUAGE plpgsql
AS $$
DECLARE
    v_document_id VARCHAR;
BEGIN
    INSERT INTO appointment_documents (
        appointment_id,
        doc_type,
        file_path,
        uploaded_by
    )
    VALUES (
        p_appointment_id,
        p_doc_type,
        p_file_path,
        p_uploaded_by
    )
    RETURNING appointment_documents.document_id INTO v_document_id;

    RETURN v_document_id;
END;
$$;

-- Function: Get Officers in Same Location
CREATE OR REPLACE FUNCTION get_officers_same_location(
    p_state_code VARCHAR,
    p_division_code VARCHAR,
    p_district_code VARCHAR,
    p_taluka_code VARCHAR,
    p_organization_id VARCHAR,
    p_department_id VARCHAR
)
RETURNS TABLE (
    officer_id VARCHAR,
    full_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.officer_id,
        o.full_name
    FROM m_officers o
    WHERE o.is_active = TRUE
      AND o.state_code = p_state_code
      AND o.division_code = p_division_code
      AND o.district_code = p_district_code
      AND o.taluka_code = p_taluka_code
      AND o.organization_id = p_organization_id
      AND o.department_id = p_department_id
    ORDER BY o.full_name;
END;
$$;