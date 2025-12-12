const pool = require('./db');

async function createHelpdeskSampleData() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Creating sample data for helpdesk dashboard...');
    console.log('Date:', today);

    // First, add more officers for different departments
    console.log('\n📌 Creating additional officers...');
    
    const officers = [
      { id: 'OFF002', userId: 'USR_OFF002', name: 'Rajesh Kumar', dept: 'DEP002', designation: 'DES01' },
      { id: 'OFF003', userId: 'USR_OFF003', name: 'Priya Sharma', dept: 'DEP001', designation: 'DES02' },
      { id: 'OFF004', userId: 'USR_OFF004', name: 'Amit Patel', dept: 'DEP003', designation: 'DES03' },
    ];

    for (const officer of officers) {
      // First create user if not exists
      await pool.query(
        `INSERT INTO m_users (user_id, username, password_hash, role_code, is_active)
         VALUES ($1, $2, 'password123', 'OF', true)
         ON CONFLICT (user_id) DO NOTHING`,
        [officer.userId, officer.id]
      );
      
      // Then create officer
      await pool.query(
        `INSERT INTO m_officers (officer_id, user_id, full_name, department_id, organization_id, designation_code, email_id, mobile_no, is_active)
         VALUES ($1, $2, $3, $4, 'ORG001', $5, $6, $7, true)
         ON CONFLICT (officer_id) DO UPDATE SET 
           full_name = $3, department_id = $4, designation_code = $5`,
        [officer.id, officer.userId, officer.name, officer.dept, officer.designation, 
         officer.id.toLowerCase() + '@govt.in', '9876543' + officer.id.slice(-3)]
      );
      console.log('✅ Officer:', officer.name, '(' + officer.dept + ')');
    }

    // Delete old sample appointments
    console.log('\n📌 Cleaning old sample appointments...');
    await pool.query("DELETE FROM appointments WHERE appointment_id LIKE 'APT4%'");

    // Create appointments for multiple departments and officers
    console.log('\n📌 Creating appointments for today...');
    
    const appointments = [
      // Department 1 - OFF001 (Test Officer)
      { id: 'APT401', visitor: 'VIS001', officer: 'OFF001', dept: 'DEP001', service: 'SRV001', time: '09:00:00', status: 'pending', purpose: 'Property Tax Query' },
      { id: 'APT402', visitor: 'VIS002', officer: 'OFF001', dept: 'DEP001', service: 'SRV001', time: '09:30:00', status: 'approved', purpose: 'Building Permission' },
      { id: 'APT403', visitor: 'VIS001', officer: 'OFF001', dept: 'DEP001', service: 'SRV002', time: '10:00:00', status: 'completed', purpose: 'Land Record Verification' },
      
      // Department 1 - OFF003 (Priya Sharma)
      { id: 'APT404', visitor: 'VIS002', officer: 'OFF003', dept: 'DEP001', service: 'SRV001', time: '09:30:00', status: 'pending', purpose: 'NOC Application' },
      { id: 'APT405', visitor: 'VIS001', officer: 'OFF003', dept: 'DEP001', service: 'SRV002', time: '11:00:00', status: 'rejected', purpose: 'Transfer of Property' },
      
      // Department 2 - OFF002 (Rajesh Kumar)
      { id: 'APT406', visitor: 'VIS001', officer: 'OFF002', dept: 'DEP002', service: 'SRV002', time: '10:00:00', status: 'pending', purpose: 'Birth Certificate Application' },
      { id: 'APT407', visitor: 'VIS002', officer: 'OFF002', dept: 'DEP002', service: 'SRV002', time: '10:30:00', status: 'approved', purpose: 'Death Certificate Request' },
      { id: 'APT408', visitor: 'VIS001', officer: 'OFF002', dept: 'DEP002', service: 'SRV003', time: '11:00:00', status: 'rescheduled', purpose: 'Marriage Certificate' },
      { id: 'APT409', visitor: 'VIS002', officer: 'OFF002', dept: 'DEP002', service: 'SRV002', time: '14:00:00', status: 'pending', purpose: 'Domicile Certificate' },
      
      // Department 3 - OFF004 (Amit Patel)
      { id: 'APT410', visitor: 'VIS001', officer: 'OFF004', dept: 'DEP003', service: 'SRV003', time: '09:00:00', status: 'approved', purpose: 'Driving License Renewal' },
      { id: 'APT411', visitor: 'VIS002', officer: 'OFF004', dept: 'DEP003', service: 'SRV003', time: '09:30:00', status: 'completed', purpose: 'Vehicle Registration' },
      { id: 'APT412', visitor: 'VIS001', officer: 'OFF004', dept: 'DEP003', service: 'SRV001', time: '10:30:00', status: 'pending', purpose: 'License Duplicate' },
      { id: 'APT413', visitor: 'VIS002', officer: 'OFF004', dept: 'DEP003', service: 'SRV003', time: '11:30:00', status: 'rejected', purpose: 'Fitness Certificate' },
      { id: 'APT414', visitor: 'VIS001', officer: 'OFF004', dept: 'DEP003', service: 'SRV002', time: '14:30:00', status: 'approved', purpose: 'Pollution Certificate' },
    ];

    for (const apt of appointments) {
      await pool.query(
        `INSERT INTO appointments (appointment_id, visitor_id, officer_id, department_id, organization_id, service_id, appointment_date, slot_time, status, purpose)
         VALUES ($1, $2, $3, $4, 'ORG001', $5, $6, $7, $8, $9)
         ON CONFLICT (appointment_id) DO UPDATE SET 
           appointment_date = $6, slot_time = $7, status = $8, purpose = $9, officer_id = $3, department_id = $4`,
        [apt.id, apt.visitor, apt.officer, apt.dept, apt.service, today, apt.time, apt.status, apt.purpose]
      );
      console.log(`  ${apt.id}: ${apt.officer} - ${apt.purpose} (${apt.status})`);
    }

    // Verify and show summary
    console.log('\n📊 Summary by Department:');
    const summary = await pool.query(`
      SELECT 
        d.department_name,
        o.full_name as officer_name,
        a.status,
        COUNT(*) as count
      FROM appointments a
      JOIN m_department d ON a.department_id = d.department_id
      JOIN m_officers o ON a.officer_id = o.officer_id
      WHERE DATE(a.appointment_date) = $1
      GROUP BY d.department_name, o.full_name, a.status
      ORDER BY d.department_name, o.full_name, a.status
    `, [today]);

    console.table(summary.rows);

    // Total count
    const total = await pool.query(
      `SELECT COUNT(*) as total FROM appointments WHERE DATE(appointment_date) = $1`,
      [today]
    );
    console.log('\n✅ Total appointments for today:', total.rows[0].total);

    console.log('\n🎉 Sample data created successfully!');
    console.log('Login as helpdesk and check "All Appointments" to see the data.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createHelpdeskSampleData();
