const pool = require("../db"); // PostgreSQL pool
const bcrypt = require("bcrypt");

// exports.insertOfficerSignup = async (req, res) => {
//   try {
//     const {
//       full_name,
//       mobile_no,
//       email_id,
//       password,
//       designation_code,
//       department_id,
//       organization_id,
//       state_code,
//       division_code,
//       district_code,
//       taluka_code,
//     } = req.body;

//     // Basic validation
//     if (!full_name || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Full name and password are required",
//       });
//     }

//     // Handle uploaded photo (via multer)
//     const photo = req.file ? req.file.filename : null;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Call PostgreSQL function (12 params)
//     const result = await pool.query(
//       `SELECT * FROM public.register_officer(
//         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
//       );`,
//       [
//         hashedPassword,                    // p_password_hash
//         full_name?.trim().slice(0, 255),   // p_full_name
//         mobile_no?.trim() || null,         // p_mobile_no
//         email_id?.trim() || null,          // p_email_id
//         designation_code || null,          // p_designation_code
//         department_id || null,             // p_department_id
//         organization_id || null,           // p_organization_id
//         state_code?.trim() || null,        // p_state_code
//         division_code?.trim() || null,     // p_division_code
//         district_code?.trim() || null,     // p_district_code
//         taluka_code?.trim() || null,       // p_taluka_code
//         photo?.trim() || null              // p_photo
//       ]
//     );

//      const row = result.rows[0];

//     // ✅ Accept success message from DB properly
//     if (row?.message?.toLowerCase().includes("success")) {
//       return res.status(201).json({
//         success: true,
//         message: row.message,
//         user_id: row.user_id,
//         officer_id: row.officer_id,
//       });
//     }

//     // ❌ Handle DB rejection (duplicate, etc.)
//     return res.status(400).json({
//       success: false,
//       message: row?.message || "Failed to register officer",
//     });

//   } catch (error) {
//     console.error("❌ Error in insertOfficerSignup:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to register officer",
//       error: error.message,
//     });
//   }
// };




//  exports.insertOfficerSignup = async (req, res) => {
//   try {
//     const {
//       full_name,
//       mobile_no,
//       email_id,
//       password,
//       designation_code,
//       department_id,
//       organization_id,
//       state_code,
//       division_code,
//       district_code,
//       taluka_code,
//     } = req.body;

//     // Basic validation
//     if (!full_name || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Full name and password are required",
//       });
//     }

//     // Handle uploaded photo (via multer)
//     const photo = req.file ? req.file.filename : null;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Call PostgreSQL function (12 params)
//     const result = await pool.query(
//       `SELECT * FROM public.register_officer(
//         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
//       );`,
//       [
//         hashedPassword,                    // p_password_hash
//         full_name?.trim().slice(0, 255),   // p_full_name
//         mobile_no?.trim() || null,         // p_mobile_no
//         email_id?.trim() || null,          // p_email_id
//         designation_code || null,          // p_designation_code
//         department_id || null,             // p_department_id
//         organization_id || null,           // p_organization_id
//         state_code?.trim() || null,        // p_state_code
//         division_code?.trim() || null,     // p_division_code
//         district_code?.trim() || null,     // p_district_code
//         taluka_code?.trim() || null,       // p_taluka_code
//         photo?.trim() || null              // p_photo
//       ]
//     );

//      const row = result.rows[0];

//     // ✅ Accept success message from DB properly
//     if (row?.message?.toLowerCase().includes("success")) {
//       return res.status(201).json({
//         success: true,
//         message: row.message,
//         user_id: row.user_id,
//         officer_id: row.officer_id,
//       });
//     }

//     // ❌ Handle DB rejection (duplicate, etc.)
//     return res.status(400).json({
//       success: false,
//       message: row?.message || "Failed to register officer",
//     });

//   } catch (error) {
//     console.error("❌ Error in insertOfficerSignup:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to register officer",
//       error: error.message,
//     });
//   }
// };


exports.insertOfficerSignup = async (req, res) => {
  try {
    // ✅ 1️⃣ First log — check raw incoming data from frontend
    console.log("📩 Incoming signup request body:", req.body);
    console.log("📸 Uploaded file info:", req.file);

    const {
      full_name,
      mobile_no,
      email_id,
      password,
      designation_code,
      department_id,
      organization_id,
      state_code,
      division_code,
      district_code,
      taluka_code,
      role_code, // Admin / Officer / Helpdesk
    } = req.body;

    // ✅ Basic validation
    if (!full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name and password are required",
      });
    }

    // ✅ 2️⃣ Log what role is being used for registration
    console.log("🧩 Role being used:", role_code);

    // ✅ Validate role_code
    const roleCheck = await pool.query(
      "SELECT 1 FROM m_role WHERE role_code = $1 AND is_active = TRUE",
      [role_code || "OF"]
    );
    if (roleCheck.rowCount === 0) {
      console.warn("⚠️ Invalid or inactive role:", role_code);
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive role code",
      });
    }

    // ✅ Handle uploaded photo
    const photo = req.file ? req.file.filename : null;

    // ✅ 3️⃣ Log before password hashing
    console.log("🔐 Preparing to hash password for user:", email_id || mobile_no);

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4️⃣ Log the final payload to be passed into your DB function
    console.log("📦 Final parameters for DB function:", {
      hashedPassword,
      full_name,
      mobile_no,
      email_id,
      designation_code,
      department_id,
      organization_id,
      state_code,
      division_code,
      district_code,
      taluka_code,
      photo,
      role_code,
    });

    // ✅ Call generic user registration function
    const result = await pool.query(
      `SELECT * FROM public.register_user_by_role(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      );`,
      [
        hashedPassword,                    // p_password_hash
        full_name?.trim().slice(0, 255),   // p_full_name
        mobile_no?.trim() || null,         // p_mobile_no
        email_id?.trim() || null,          // p_email_id
        designation_code || null,          // p_designation_code
        department_id || null,             // p_department_id
        organization_id || null,           // p_organization_id
        state_code?.trim() || null,        // p_state_code
        division_code?.trim() || null,     // p_division_code
        district_code?.trim() || null,     // p_district_code
        taluka_code?.trim() || null,       // p_taluka_code
        photo?.trim() || null,             // p_photo
        role_code?.trim() || "OF",         // p_role_code
      ]
    );

    // ✅ 5️⃣ Log result coming back from PostgreSQL
    console.log("🧾 DB function result:", result.rows);

    const row = result.rows[0];
    let entityId;
    if (role_code === "OF") entityId = row.out_entity_id;
    else if (role_code === "HD") entityId = row.out_entity_id;
    else if (role_code === "AD") entityId = row.out_entity_id;

    // ✅ Success response
    if (row?.message?.toLowerCase().includes("success")) {
      console.log("✅ Registration successful:", row);
      return res.status(201).json({
        success: true,
        message: row.message,
        user_id: row.out_user_id,
        entity_id: entityId,
        role: role_code?.trim() || "OF",
      });
    }

    // ❌ Failure response from DB
    console.warn("❌ Registration failed from DB:", row?.message);
    return res.status(400).json({
      success: false,
      message: row?.message || "Failed to register user",
    });

  } catch (error) {
    console.error("💥 Error in insertOfficerSignup:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};





exports.loginOfficer = async (req, res) => {
  const { username, password } = req.body;
  console.log("🟢 Received username:", username);

  try {
    // ✅ Explicit schema + correct function name
    const result = await pool.query("SELECT * FROM public.get_user_by_username2($1);", [username]);
    console.log("🟢 Query result:", result.rows);

    const officer = result.rows[0];
    if (!officer) {
      return res.status(404).json({ success: false, message: "Officer username not found" });
    }

    if (!officer.out_is_active) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, officer.out_password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Get officer_id from m_officers table if role is Officer
    let officerId = null;
    if (officer.out_role_code === 'OF') {
      const officerResult = await pool.query(
        "SELECT officer_id FROM m_officers WHERE user_id = $1",
        [officer.out_user_id]
      );
      if (officerResult.rows.length > 0) {
        officerId = officerResult.rows[0].officer_id;
      }
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user_id: officer.out_user_id,
      officer_id: officerId || officer.out_username, // Use username as fallback
      username: officer.out_username,
      role: officer.out_role_code,
    });
  } catch (error) {
    console.error("❌ Officer login error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




// exports.loginOfficer = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const result = await pool.query("SELECT * FROM get_user_by_username2($1);", [username]);
//     const officer = result.rows[0];
//     // 1️⃣ Check if officer exists
//     if (!officer) {
//       return res.status(404).json({
//         success: false,
//         message: "Officer username not found",
//       });
//     }

//     // 2️⃣ Check if account is active
//     if (!officer.out_is_active) {
//       return res.status(403).json({
//         success: false,
//         message: "Account is inactive",
//       });
//     }

//     // 3️⃣ Verify password (plain text)
//     const isMatch = await bcrypt.compare(password, officer.out_password_hash);
//     console.log(isMatch)  
//     if (!isMatch) {
//           return res.status(401).json({
//             success: false,
//             message: "Invalid password",
//           });
//         }

//     // ✅ Success
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user_id: officer.out_user_id,
//       officer_id: officer.out_officer_id, // make sure this column exists in DB
//       // username: officer.out_username,
//       role: officer.out_role_code,
//     });
//   } catch (error) {
//     console.error("❌ Officer login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
exports.getOfficersByLocation = async (req, res) => {
  try {
    const { state_code, division_code, district_code, taluka_code,organization_id,department_id } = req.body;

    const query = `
      SELECT * FROM get_officers_same_location($1, $2, $3, $4,$5,$6);
    `;
    const values = [state_code, division_code, district_code, taluka_code,organization_id,department_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No officers found for this location",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Officers fetched successfully",
      data: result.rows, // [{officer_id, full_name}, ...]
    });
  } catch (error) {
    console.error("❌ Error fetching officers by location:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching officers",
      error: error.message,
    });
  }
};

// Get Officer Dashboard Data
exports.getOfficerDashboard = async (req, res) => {
  try {
    const { officer_id } = req.params;

    if (!officer_id) {
      return res.status(400).json({ success: false, message: "Officer ID is required" });
    }

    // Get today's appointments count (use CURRENT_DATE for consistent timezone)
    const todayResult = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE officer_id = $1 AND DATE(appointment_date) = CURRENT_DATE AND is_active = TRUE`,
      [officer_id]
    );

    // Get pending appointments count
    const pendingResult = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE officer_id = $1 AND status = 'pending' AND is_active = TRUE`,
      [officer_id]
    );

    // Get completed appointments count
    const completedResult = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE officer_id = $1 AND status = 'completed' AND is_active = TRUE`,
      [officer_id]
    );

    // Get rescheduled appointments count
    const rescheduledResult = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE officer_id = $1 AND status = 'rescheduled' AND is_active = TRUE`,
      [officer_id]
    );

    // Get walk-ins count for today
    const walkinsResult = await pool.query(
      `SELECT COUNT(*) as count FROM walkins 
       WHERE officer_id = $1 AND (DATE(walkin_date) = CURRENT_DATE OR DATE(appointment_date) = CURRENT_DATE)`,
      [officer_id]
    );

    // Get walk-in appointments for this officer
    const walkinAppointmentsResult = await pool.query(
      `SELECT w.walkin_id as appointment_id, w.full_name as visitor_name, w.mobile_no as visitor_mobile, 
              w.email_id as visitor_email, w.purpose, w.status, 
              COALESCE(w.appointment_date, w.walkin_date) as appointment_date, 
              w.time_slot as slot_time, w.id_proof_no as aadhar_number,
              d.department_name, o.organization_name, w.booked_by
       FROM walkins w
       LEFT JOIN m_department d ON w.department_id = d.department_id
       LEFT JOIN m_organization o ON w.organization_id = o.organization_id
       WHERE w.officer_id = $1 AND DATE(COALESCE(w.appointment_date, w.walkin_date)) >= CURRENT_DATE
       ORDER BY COALESCE(w.appointment_date, w.walkin_date) ASC, w.time_slot ASC
       LIMIT 20`,
      [officer_id]
    );

    // Get TODAY's appointments (all statuses)
    const todayAppointmentsResult = await pool.query(
      `SELECT a.appointment_id, a.visitor_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              v.full_name as visitor_name, v.mobile_no as visitor_mobile, v.email_id as visitor_email,
              s.service_name, d.department_name, o.organization_name
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       LEFT JOIN m_services s ON a.service_id = s.service_id
       LEFT JOIN m_department d ON a.department_id = d.department_id
       LEFT JOIN m_organization o ON a.organization_id = o.organization_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE 
         AND DATE(a.appointment_date) = CURRENT_DATE
       ORDER BY a.slot_time ASC`,
      [officer_id]
    );

    // Get PENDING appointments (all dates)
    const pendingAppointmentsResult = await pool.query(
      `SELECT a.appointment_id, a.visitor_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              v.full_name as visitor_name, v.mobile_no as visitor_mobile, v.email_id as visitor_email,
              s.service_name, d.department_name, o.organization_name
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       LEFT JOIN m_services s ON a.service_id = s.service_id
       LEFT JOIN m_department d ON a.department_id = d.department_id
       LEFT JOIN m_organization o ON a.organization_id = o.organization_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE 
         AND a.status = 'pending'
       ORDER BY a.appointment_date ASC, a.slot_time ASC
       LIMIT 20`,
      [officer_id]
    );

    // Get RESCHEDULED appointments
    const rescheduledAppointmentsResult = await pool.query(
      `SELECT a.appointment_id, a.visitor_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              a.reschedule_reason,
              v.full_name as visitor_name, v.mobile_no as visitor_mobile, v.email_id as visitor_email,
              s.service_name, d.department_name, o.organization_name
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       LEFT JOIN m_services s ON a.service_id = s.service_id
       LEFT JOIN m_department d ON a.department_id = d.department_id
       LEFT JOIN m_organization o ON a.organization_id = o.organization_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE 
         AND a.status = 'rescheduled'
       ORDER BY a.appointment_date ASC, a.slot_time ASC
       LIMIT 20`,
      [officer_id]
    );

    // Get upcoming appointments (today and future, not completed)
    const upcomingResult = await pool.query(
      `SELECT a.appointment_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              v.full_name as visitor_name, v.mobile_no as visitor_mobile
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE 
         AND DATE(a.appointment_date) >= CURRENT_DATE
         AND a.status NOT IN ('completed', 'rejected')
       ORDER BY a.appointment_date ASC, a.slot_time ASC
       LIMIT 10`,
      [officer_id]
    );

    // Get recent activity/notifications (recent status changes)
    const recentResult = await pool.query(
      `SELECT a.appointment_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              v.full_name as visitor_name, a.updated_date, a.insert_date
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE
       ORDER BY COALESCE(a.updated_date, a.insert_date) DESC
       LIMIT 5`,
      [officer_id]
    );

    // Get COMPLETED appointments
    const completedAppointmentsResult = await pool.query(
      `SELECT a.appointment_id, a.visitor_id, a.purpose, a.status, a.appointment_date, a.slot_time,
              v.full_name as visitor_name, v.mobile_no as visitor_mobile, v.email_id as visitor_email,
              s.service_name, d.department_name, o.organization_name, a.updated_date as completed_date
       FROM appointments a
       LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
       LEFT JOIN m_services s ON a.service_id = s.service_id
       LEFT JOIN m_department d ON a.department_id = d.department_id
       LEFT JOIN m_organization o ON a.organization_id = o.organization_id
       WHERE a.officer_id = $1 AND a.is_active = TRUE 
         AND a.status = 'completed'
       ORDER BY a.updated_date DESC, a.appointment_date DESC
       LIMIT 20`,
      [officer_id]
    );

    // Get officer details
    const officerResult = await pool.query(
      `SELECT full_name, designation_code, department_id FROM m_officers WHERE officer_id = $1`,
      [officer_id]
    );

    const officerInfo = officerResult.rows[0] || {};
    const fullName = officerInfo.full_name || "Officer";

    return res.status(200).json({
      success: true,
      data: {
        full_name: fullName,
        designation: officerInfo.designation_code || "",
        stats: {
          today: parseInt(todayResult.rows[0].count) || 0,
          pending: parseInt(pendingResult.rows[0].count) || 0,
          completed: parseInt(completedResult.rows[0].count) || 0,
          rescheduled: parseInt(rescheduledResult.rows[0].count) || 0,
          walkins: parseInt(walkinsResult.rows[0].count) || 0,
        },
        today_appointments: todayAppointmentsResult.rows,
        pending_appointments: pendingAppointmentsResult.rows,
        rescheduled_appointments: rescheduledAppointmentsResult.rows,
        completed_appointments: completedAppointmentsResult.rows,
        walkin_appointments: walkinAppointmentsResult.rows,
        upcoming_appointments: upcomingResult.rows,
        recent_activity: recentResult.rows,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching officer dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard",
      error: error.message,
    });
  }
};

// Update appointment status (approve, reject, complete)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointment_id, status, officer_id, reason } = req.body;

    if (!appointment_id || !status || !officer_id) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID, status, and officer ID are required",
      });
    }

    const validStatuses = ['approved', 'rejected', 'completed', 'pending'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: approved, rejected, completed, or pending",
      });
    }

    // Verify the appointment belongs to this officer
    const verifyResult = await pool.query(
      `SELECT appointment_id FROM appointments WHERE appointment_id = $1 AND officer_id = $2`,
      [appointment_id, officer_id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Appointment not found or does not belong to this officer",
      });
    }

    // Update the status
    const updateResult = await pool.query(
      `UPDATE appointments 
       SET status = $1, updated_date = NOW(), update_by = $2, reschedule_reason = $3
       WHERE appointment_id = $4
       RETURNING *`,
      [status.toLowerCase(), officer_id, reason || null, appointment_id]
    );

    return res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updateResult.rows[0],
    });

  } catch (error) {
    console.error("❌ Error updating appointment status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating appointment",
      error: error.message,
    });
  }
};

// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointment_id, officer_id, new_date, new_time, reason } = req.body;

    if (!appointment_id || !officer_id || !new_date || !new_time) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID, officer ID, new date, and new time are required",
      });
    }

    // Verify the appointment belongs to this officer
    const verifyResult = await pool.query(
      `SELECT appointment_id FROM appointments WHERE appointment_id = $1 AND officer_id = $2`,
      [appointment_id, officer_id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Appointment not found or does not belong to this officer",
      });
    }

    // Update the appointment with new date/time and set status to rescheduled
    const updateResult = await pool.query(
      `UPDATE appointments 
       SET appointment_date = $1, slot_time = $2, status = 'rescheduled', 
           reschedule_reason = $3, updated_date = NOW(), update_by = $4
       WHERE appointment_id = $5
       RETURNING *`,
      [new_date, new_time, reason || 'Rescheduled by officer', officer_id, appointment_id]
    );

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: updateResult.rows[0],
    });

  } catch (error) {
    console.error("❌ Error rescheduling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while rescheduling appointment",
      error: error.message,
    });
  }
};

// Get appointments by specific date for reports/downloads
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { officer_id } = req.params;
    const { date } = req.query;

    if (!officer_id) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Get appointments for the specified date
    const appointmentsResult = await pool.query(
      `SELECT 
        a.appointment_id,
        a.appointment_date,
        a.slot_time,
        a.status,
        a.purpose,
        a.reschedule_reason,
        v.full_name as visitor_name,
        v.mobile_no as visitor_mobile,
        v.email_id as visitor_email,
        d.department_name,
        s.service_name
      FROM appointments a
      LEFT JOIN m_visitors_signup v ON a.visitor_id = v.visitor_id
      LEFT JOIN m_department d ON a.department_id = d.department_id
      LEFT JOIN m_services s ON a.service_id = s.service_id
      WHERE a.officer_id = $1 AND DATE(a.appointment_date) = $2
      ORDER BY a.slot_time ASC`,
      [officer_id, date]
    );

    // Get summary stats for the date
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'rescheduled') as rescheduled
      FROM appointments
      WHERE officer_id = $1 AND DATE(appointment_date) = $2`,
      [officer_id, date]
    );

    return res.status(200).json({
      success: true,
      data: {
        date: date,
        appointments: appointmentsResult.rows,
        stats: statsResult.rows[0],
      },
    });

  } catch (error) {
    console.error("❌ Error fetching appointments by date:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
      error: error.message,
    });
  }
};

// Get report data for officer
exports.getOfficerReports = async (req, res) => {
  try {
    const { officer_id } = req.params;
    const { type, month, start, end } = req.query;

    if (!officer_id) {
      return res.status(400).json({
        success: false,
        message: "Officer ID is required",
      });
    }

    // Get officer name
    const officerResult = await pool.query(
      `SELECT full_name FROM m_officers WHERE officer_id = $1`,
      [officer_id]
    );
    const officerName = officerResult.rows[0]?.full_name || "Officer";

    let startDate, endDate;
    
    if (type === "monthly" && month) {
      // Monthly report
      startDate = `${month}-01`;
      const nextMonth = new Date(month + "-01");
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      endDate = nextMonth.toISOString().split('T')[0];
    } else if (type === "weekly") {
      // Weekly report (last 7 days)
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      startDate = weekAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (type === "custom" && start && end) {
      startDate = start;
      endDate = end;
    } else {
      // Default: current month
      const today = new Date();
      startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      endDate = today.toISOString().split('T')[0];
    }

    // Get summary stats
    const summaryResult = await pool.query(
      `SELECT 
        COUNT(*) as total_appointments,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'rescheduled') as rescheduled
      FROM appointments
      WHERE officer_id = $1 AND DATE(appointment_date) >= $2 AND DATE(appointment_date) <= $3`,
      [officer_id, startDate, endDate]
    );

    const summary = summaryResult.rows[0];
    const total = parseInt(summary.total_appointments) || 1;
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));

    // Get daily breakdown
    const dailyResult = await pool.query(
      `SELECT 
        DATE(appointment_date) as date,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'rescheduled') as rescheduled
      FROM appointments
      WHERE officer_id = $1 AND DATE(appointment_date) >= $2 AND DATE(appointment_date) <= $3
      GROUP BY DATE(appointment_date)
      ORDER BY DATE(appointment_date)`,
      [officer_id, startDate, endDate]
    );

    // Format daily data
    const dailyBreakdown = dailyResult.rows.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: row.date,
      completed: parseInt(row.completed) || 0,
      approved: parseInt(row.approved) || 0,
      pending: parseInt(row.pending) || 0,
      rejected: parseInt(row.rejected) || 0,
      rescheduled: parseInt(row.rescheduled) || 0,
    }));

    // Get peak day
    const peakDay = dailyBreakdown.reduce((max, day) => {
      const dayTotal = day.completed + day.approved + day.pending + day.rejected + day.rescheduled;
      return dayTotal > max.total ? { date: day.date, total: dayTotal } : max;
    }, { date: '', total: 0 });

    // Get hourly distribution
    const hourlyResult = await pool.query(
      `SELECT 
        EXTRACT(HOUR FROM slot_time::time) as hour,
        COUNT(*) as appointments
      FROM appointments
      WHERE officer_id = $1 AND DATE(appointment_date) >= $2 AND DATE(appointment_date) <= $3
      GROUP BY EXTRACT(HOUR FROM slot_time::time)
      ORDER BY hour`,
      [officer_id, startDate, endDate]
    );

    const hourlyDistribution = hourlyResult.rows.map(row => ({
      hour: `${row.hour > 12 ? row.hour - 12 : row.hour} ${row.hour >= 12 ? 'PM' : 'AM'}`,
      appointments: parseInt(row.appointments) || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        officer_name: officerName,
        period: `${startDate} to ${endDate}`,
        summary: {
          total_appointments: parseInt(summary.total_appointments) || 0,
          completed: parseInt(summary.completed) || 0,
          approved: parseInt(summary.approved) || 0,
          pending: parseInt(summary.pending) || 0,
          rejected: parseInt(summary.rejected) || 0,
          rescheduled: parseInt(summary.rescheduled) || 0,
          completion_rate: ((parseInt(summary.completed) / total) * 100).toFixed(1),
          approval_rate: (((parseInt(summary.completed) + parseInt(summary.approved)) / total) * 100).toFixed(1),
          avg_daily: (total / days).toFixed(1),
          peak_day: peakDay,
        },
        daily_breakdown: dailyBreakdown,
        status_distribution: [
          { name: 'Completed', value: parseInt(summary.completed) || 0, color: '#10b981' },
          { name: 'Approved', value: parseInt(summary.approved) || 0, color: '#3b82f6' },
          { name: 'Pending', value: parseInt(summary.pending) || 0, color: '#f59e0b' },
          { name: 'Rejected', value: parseInt(summary.rejected) || 0, color: '#ef4444' },
          { name: 'Rescheduled', value: parseInt(summary.rescheduled) || 0, color: '#8b5cf6' },
        ],
        hourly_distribution: hourlyDistribution,
      },
    });

  } catch (error) {
    console.error("❌ Error fetching officer reports:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
      error: error.message,
    });
  }
};