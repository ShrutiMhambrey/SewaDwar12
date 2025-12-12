const pool = require("../db");
const bcrypt = require("bcrypt");

// Login helpdesk user
const loginHelpdesk = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query user from m_users table by username
    const userResult = await pool.query(
      `SELECT * FROM m_users WHERE username = $1 AND is_active = true AND role_code = 'HD'`,
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Get helpdesk details
    const helpdeskResult = await pool.query(
      `SELECT * FROM m_helpdesk WHERE user_id = $1 AND is_active = true`,
      [user.user_id]
    );

    const helpdesk = helpdeskResult.rows[0] || {};

    res.json({
      message: "Login successful",
      helpdesk_id: helpdesk.helpdesk_id || user.user_id,
      username: user.username,
      full_name: helpdesk.full_name || user.username,
      role_code: "helpdesk",
      location_id: helpdesk.assigned_location,
    });
  } catch (error) {
    console.error("Helpdesk login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get helpdesk dashboard data
const getHelpdeskDashboard = async (req, res) => {
  const { helpdesk_id } = req.params;
  const { location_id } = req.query;

  try {
    const today = new Date().toISOString().split("T")[0];

    // Today's appointments for this location
    const todayAppointments = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.time_slot,
        a.status,
        v.name as visitor_name,
        v.email as visitor_email,
        v.phone as visitor_phone,
        s.service_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      WHERE DATE(a.appointment_date) = $1
        AND ($2::int IS NULL OR a.location_id = $2)
      ORDER BY a.time_slot ASC`,
      [today, location_id || null]
    );

    // Completed appointments
    const completedAppointments = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.time_slot,
        a.status,
        v.name as visitor_name,
        v.email as visitor_email,
        s.service_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      WHERE a.status = 'completed'
        AND ($1::int IS NULL OR a.location_id = $1)
      ORDER BY a.appointment_date DESC
      LIMIT 20`,
      [location_id || null]
    );

    // Pending appointments
    const pendingAppointments = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.time_slot,
        a.status,
        v.name as visitor_name,
        v.email as visitor_email,
        s.service_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      WHERE a.status = 'pending'
        AND ($1::int IS NULL OR a.location_id = $1)
      ORDER BY a.appointment_date ASC`,
      [location_id || null]
    );

    // Rescheduled appointments
    const rescheduledAppointments = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.time_slot,
        a.status,
        v.name as visitor_name,
        v.email as visitor_email,
        s.service_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      WHERE a.status = 'rescheduled'
        AND ($1::int IS NULL OR a.location_id = $1)
      ORDER BY a.appointment_date DESC`,
      [location_id || null]
    );

    // Reassigned appointments
    const reassignedAppointments = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.time_slot,
        a.status,
        v.name as visitor_name,
        v.email as visitor_email,
        s.service_name,
        o.officer_name as reassigned_to
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      LEFT JOIN m_officers o ON a.officer_id = o.officer_id
      WHERE a.status = 'reassigned'
        AND ($1::int IS NULL OR a.location_id = $1)
      ORDER BY a.appointment_date DESC`,
      [location_id || null]
    );

    res.json({
      today_appointments: todayAppointments.rows,
      completed_appointments: completedAppointments.rows,
      pending_appointments: pendingAppointments.rows,
      rescheduled_appointments: rescheduledAppointments.rows,
      reassigned_appointments: reassignedAppointments.rows,
    });
  } catch (error) {
    console.error("Get helpdesk dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Register/Create helpdesk user
const registerHelpdesk = async (req, res) => {
  const { username, password, full_name, email, phone, location_id } = req.body;

  try {
    // Check if user_id already exists
    const existingUser = await pool.query(
      `SELECT * FROM m_helpdesk WHERE user_id = $1`,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate helpdesk_id
    const idResult = await pool.query(`SELECT COALESCE(MAX(CAST(helpdesk_id AS INTEGER)), 0) + 1 as next_id FROM m_helpdesk`);
    const nextId = idResult.rows[0].next_id.toString();

    // Insert new helpdesk user
    const result = await pool.query(
      `INSERT INTO m_helpdesk (helpdesk_id, user_id, password, full_name, email_id, mobile_no, assigned_location, is_active, insert_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
       RETURNING helpdesk_id, user_id, full_name, email_id`,
      [nextId, username, hashedPassword, full_name, email, phone, location_id || null]
    );

    res.status(201).json({
      message: "Helpdesk user created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Register helpdesk error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Book walk-in appointment from helpdesk
const bookWalkinAppointment = async (req, res) => {
  const {
    visitor_name,
    visitor_phone,
    visitor_email,
    visitor_aadhar,
    visitor_address,
    organization_id,
    department_id,
    service_id,
    officer_id,
    appointment_date,
    slot_time,
    purpose,
    booked_by,
    insert_by,
  } = req.body;

  try {
    // Generate walkin_id
    const idResult = await pool.query(`SELECT COALESCE(MAX(CAST(walkin_id AS INTEGER)), 0) + 1 as next_id FROM walkins`);
    const nextId = idResult.rows[0].next_id.toString().padStart(3, '0');

    // Insert walk-in appointment using existing table structure
    const walkinResult = await pool.query(
      `INSERT INTO walkins (
        walkin_id,
        full_name,
        mobile_no,
        email_id,
        id_proof_no,
        organization_id,
        department_id,
        officer_id,
        purpose,
        walkin_date,
        appointment_date,
        time_slot,
        status,
        is_walkin,
        booked_by,
        insert_date,
        insert_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11, 'pending', true, $12, NOW(), $13)
      RETURNING walkin_id`,
      [
        nextId,
        visitor_name,
        visitor_phone,
        visitor_email || null,
        visitor_aadhar || null,
        organization_id,
        department_id,
        officer_id,
        purpose || null,
        appointment_date,
        slot_time,
        booked_by,
        insert_by,
      ]
    );

    const walkinId = walkinResult.rows[0].walkin_id;

    res.status(201).json({
      success: true,
      message: "Walk-in appointment booked successfully",
      walkin_id: walkinId,
    });
  } catch (error) {
    console.error("Book walk-in error:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Get officers by organization and department (for helpdesk booking)
const getOfficersForBooking = async (req, res) => {
  const { organization_id, department_id } = req.body;

  try {
    const result = await pool.query(
      `SELECT officer_id, full_name, designation_code, mobile_no, email_id
       FROM m_officers 
       WHERE organization_id = $1 
         AND department_id = $2 
         AND is_active = true
       ORDER BY full_name ASC`,
      [organization_id, department_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No officers found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Officers fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get officers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all appointments grouped by department (read-only view for helpdesk)
const getAllAppointmentsByDepartment = async (req, res) => {
  const { helpdesk_id } = req.params;
  const { date, location_id } = req.query;

  try {
    // Build date filter
    const dateFilter = date ? date : new Date().toISOString().split("T")[0];

    // Get all departments with their appointments
    const departmentsResult = await pool.query(
      `SELECT DISTINCT 
        d.department_id,
        d.department_name,
        o2.organization_name
      FROM m_department d
      JOIN m_organization o2 ON d.organization_id = o2.organization_id
      WHERE d.is_active = true
      ORDER BY d.department_name ASC`
    );

    // Get all appointments with detailed info
    const appointmentsResult = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.slot_time,
        a.status,
        a.purpose,
        a.reschedule_reason,
        a.department_id,
        a.officer_id,
        a.visitor_id,
        v.full_name as visitor_name,
        v.email_id as visitor_email,
        v.mobile_no as visitor_phone,
        s.service_name,
        d.department_name,
        o.full_name as officer_name,
        o.designation_code as officer_designation,
        org.organization_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      LEFT JOIN m_department d ON a.department_id = d.department_id
      LEFT JOIN m_officers o ON a.officer_id = o.officer_id
      LEFT JOIN m_organization org ON a.organization_id = org.organization_id
      WHERE DATE(a.appointment_date) = $1
      ORDER BY d.department_name ASC, o.full_name ASC, a.slot_time ASC`,
      [dateFilter]
    );

    // Group appointments by department
    const departmentMap = {};
    
    departmentsResult.rows.forEach(dept => {
      departmentMap[dept.department_id] = {
        department_id: dept.department_id,
        department_name: dept.department_name,
        organization_name: dept.organization_name,
        officers: {},
        appointment_count: 0
      };
    });

    // Group appointments by department and officer
    appointmentsResult.rows.forEach(apt => {
      if (!departmentMap[apt.department_id]) {
        departmentMap[apt.department_id] = {
          department_id: apt.department_id,
          department_name: apt.department_name,
          organization_name: apt.organization_name,
          officers: {},
          appointment_count: 0
        };
      }

      const dept = departmentMap[apt.department_id];
      
      if (!dept.officers[apt.officer_id]) {
        dept.officers[apt.officer_id] = {
          officer_id: apt.officer_id,
          officer_name: apt.officer_name,
          officer_designation: apt.officer_designation,
          appointments: []
        };
      }

      dept.officers[apt.officer_id].appointments.push({
        appointment_id: apt.appointment_id,
        appointment_date: apt.appointment_date,
        slot_time: apt.slot_time,
        status: apt.status,
        purpose: apt.purpose,
        reschedule_reason: apt.reschedule_reason,
        visitor_id: apt.visitor_id,
        visitor_name: apt.visitor_name,
        visitor_email: apt.visitor_email,
        visitor_phone: apt.visitor_phone,
        service_name: apt.service_name
      });

      dept.appointment_count++;
    });

    // Convert to array and filter out departments with no appointments (optional)
    const departmentsWithAppointments = Object.values(departmentMap)
      .map(dept => ({
        ...dept,
        officers: Object.values(dept.officers)
      }))
      .filter(dept => dept.appointment_count > 0);

    // Get summary stats
    const statusCounts = appointmentsResult.rows.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      date: dateFilter,
      total_appointments: appointmentsResult.rows.length,
      status_summary: {
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        completed: statusCounts.completed || 0,
        rejected: statusCounts.rejected || 0,
        rescheduled: statusCounts.rescheduled || 0
      },
      departments: departmentsWithAppointments,
      all_appointments: appointmentsResult.rows
    });
  } catch (error) {
    console.error("Get all appointments by department error:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

module.exports = {
  loginHelpdesk,
  getHelpdeskDashboard,
  registerHelpdesk,
  bookWalkinAppointment,
  getOfficersForBooking,
  getAllAppointmentsByDepartment,
};
